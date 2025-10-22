import api from "@/api/axiosInstance"
import * as signalR from "@microsoft/signalr"
import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import {
  kwhEnergyChartConfig,
  kwhEnergyThresholds,
  utilityConfigs,
} from "@/utils/data"
import { KwhEnergyDataPoint, TimePeriod, UtilityType } from "@/utils/types"
import GenericChart from "../../../components/PlantPerformance/Chart/GenericChart"
import UtilityDetailsPanel from "../../../components/PlantPerformance/DetailPagePanel/UtilityDetailsPanel"

const HEARTBEAT_INTERVAL = 5000
const SERVER_TIMEOUT = 6000

interface Props {
  type: UtilityType
}

const UtilityEnergyConsumptionKwhDetail: React.FC<Props> = ({ type }) => {
  const { id, plantName, lineName } = useParams()
  const navigate = useNavigate()
  const config = utilityConfigs[type]

  const [utilityInfo, setUtilityInfo] = useState<any>(null)
  const [liveSummary, setLiveSummary] = useState<Record<string, number>>({})
  const [pastSummary, setPastSummary] = useState<Record<string, number>>({})
  const [kwhData, setKwhData] = useState<KwhEnergyDataPoint[]>([])
  const [serverDown, setServerDown] = useState(false)
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<TimePeriod>("live")

  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const currentIdRef = useRef<number | null>(null)
  const lastLiveTsRef = useRef<number | null>(null)

  // Fetch utility details
  const fetchDetails = async (uid: string) => {
    try {
      const res = await api.get(config.apiEndpoint + uid)
      if (res.data && res.data.length > 0) {
        const data = res.data[0]
        setUtilityInfo({
          name: data[`${type}Name`],
          modelNo: data.modelNumber,
          plant: data.plantName,

          lastUpdated: new Date(
            data.modifiedDate || data.createdDate,
          ).toLocaleString(),
          alarmCount: 0,
        })
      }
    } catch (err) {
      console.error("Error fetching details:", err)
    }
  }

  useEffect(() => {
    if (id) fetchDetails(id)
  }, [id])

  useEffect(() => {
    if (!id) return

    let heartbeat: NodeJS.Timeout
    let intervalId: NodeJS.Timeout
    const abortController = new AbortController()

    const initLiveConnection = async () => {
      if (!connectionRef.current) {
        connectionRef.current = new signalR.HubConnectionBuilder()
          .withUrl(
            `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "")}/${
              config.hubUrl
            }`,
            {
              skipNegotiation: true,
              transport: signalR.HttpTransportType.WebSockets,
            },
          )
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build()
      }

      const connection = connectionRef.current
      try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          await connection.start()
        }

        // Past Data
        const pastData: any[] = await connection.invoke(
          config.pastDataMethod,
          "kwh",
          Number(id),
        )
        if (!abortController.signal.aborted && Array.isArray(pastData)) {
          setKwhData(
            pastData.map((p) => ({
              timestamp: new Date(p.timestamp).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              kWh1: Number(p.kWh1 ?? 0),
              kWh2: Number(p.kWh2 ?? 0),
              kWh3: Number(p.kWh3 ?? 0),
            })),
          )
        }

        // Live subscription
        connection.on(config.liveEvent, (payload: any) => {
          if (!payload?.timestamp) return
          const newPoint: KwhEnergyDataPoint = {
            timestamp: new Date(payload.timestamp).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            kWh1: Number(payload.kWh1 ?? 0),
            kWh2: Number(payload.kWh2 ?? 0),
            kWh3: Number(payload.kWh3 ?? 0),
          }
          setKwhData((prev) => [...prev.slice(-6), newPoint])
          lastLiveTsRef.current = Date.now()
          setServerDown(false)
        })

        await connection.invoke(config.joinGroupMethod, "kwh", Number(id))
        currentIdRef.current = Number(id)

        heartbeat = setInterval(() => {
          if (
            !lastLiveTsRef.current ||
            Date.now() - lastLiveTsRef.current > SERVER_TIMEOUT
          ) {
            setServerDown(true)
            setKwhData([])
          }
        }, HEARTBEAT_INTERVAL)
      } catch (err) {
        console.error("Connection failed:", err)
        setServerDown(true)
      }
    }

    const fetchGraphData = async () => {
      try {
        const res = await api.get(
          `/AllGraphs/${config.detailedGraphByFilterId}?filter=${selectedTimePeriod}&${config.graphIdParam}=${id}&graphType=Kwh`,
        )
        if (res.data) {
          if (res.data.liveSummary) setLiveSummary(res.data.liveSummary)
          if (res.data.pastSummary) setPastSummary(res.data.pastSummary)

          if (res.data.graphData) {
            setKwhData(
              res.data.graphData.map((item: any) => ({
                timestamp:
                  selectedTimePeriod === "daily"
                    ? new Date(item.DaySlot).toLocaleDateString("en-GB")
                    : new Date(
                        item.HourSlot ?? item.DaySlot,
                      ).toLocaleTimeString("en-GB"),
                kWh1: Number(item.kWh1 ?? 0),
                kWh2: Number(item.kWh2 ?? 0),
                kWh3: Number(item.kWh3 ?? 0),
              })),
            )
          } else setKwhData([])
        }
      } catch (err) {
        console.error("Error fetching graph data:", err)
      }
    }

    if (selectedTimePeriod === "live") {
      initLiveConnection()
    } else {
      if (connectionRef.current) {
        connectionRef.current.stop().catch(console.error)
        connectionRef.current = null
      }
      fetchGraphData()
      intervalId = setInterval(fetchGraphData, 60 * 60 * 1000)
    }

    return () => {
      abortController.abort()
      clearInterval(heartbeat)
      clearInterval(intervalId)
      if (connectionRef.current) {
        if (currentIdRef.current) {
          connectionRef.current
            .invoke(config.leaveGroupMethod, currentIdRef.current)
            .catch(console.error)
        }
        connectionRef.current.off(config.liveEvent)
        connectionRef.current.stop().catch(console.error)
        connectionRef.current = null
      }
    }
  }, [id, selectedTimePeriod])

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="px-4 py-1 rounded-t-md bg-blue-500 text-white">
          Plant: {plantName}, {type.charAt(0).toUpperCase() + type.slice(1)}:{" "}
          {id}
        </h2>
        <div className="flex items-center space-x-2">
          {(["live", "hourly", "daily"] as TimePeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimePeriod(period)}
              className={`px-4 py-1 rounded-md border transition ${
                selectedTimePeriod === period
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-300 hover:bg-blue-100"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition ml-2"
            onClick={() => navigate(-1)}
          >
            <img src="/back.png" alt="Back" className="w-5 h-5" />
          </div>
        </div>
      </div>

      {serverDown && selectedTimePeriod === "live" ? (
        // 🔹 Live → service down
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="text-red-600 text-2xl font-bold mb-4">
              Service is not live
            </div>
            <p className="text-gray-600">
              Waiting for live data from server...
            </p>
          </div>
        </div>
      ) : setKwhData.length === 0 &&
        (selectedTimePeriod === "hourly" || selectedTimePeriod === "daily") ? (
        // 🔹 Hourly/Daily → no data available
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="text-gray-500 text-xl mb-4">No data available</div>
            <p className="text-gray-600">
              Try changing the time period or check back later.
            </p>
          </div>
        </div>
      ) : (
        kwhEnergyChartConfig.map((chartConfig) => (
          <div key={chartConfig.id} className="mb-2 cursor-pointer">
            <div className="w-full h-64">
              <GenericChart
                config={chartConfig}
                data={kwhData}
                thresholds={kwhEnergyThresholds}
                timePeriod={selectedTimePeriod}
              />
            </div>

            <UtilityDetailsPanel
              chartConfigs={kwhEnergyChartConfig}
              utilityInfo={utilityInfo ?? {}}
              selectedTimePeriod={selectedTimePeriod}
              liveSummary={liveSummary}
              pastSummary={pastSummary}
              unit="kwh"
              infoFields={config.infoFields}
            />
          </div>
        ))
      )}
    </div>
  )
}

export default UtilityEnergyConsumptionKwhDetail
