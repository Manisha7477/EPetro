import React, { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import * as signalR from "@microsoft/signalr"
import api from "@/api/axiosInstance"
import {
  BarChartConfig,
  BarChartData,
  TimePeriod,
  UtilityType,
} from "@/utils/types"
import { getBarChartConfigs, utilityConfigs } from "@/utils/data"
import SingleBarChart from "@/components/PlantPerformance/Chart/SingleBarChart"
import BarChartDetailPanel from "@/components/PlantPerformance/DetailPagePanel/BarChartDetailPanel"

const HEARTBEAT_INTERVAL = 5000
const SERVER_TIMEOUT = 6000

interface ThdVoltageDetailProps {
  utilityType: UtilityType // Only pass this when rendering
}

const ThdVoltageDetail: React.FC<ThdVoltageDetailProps> = ({ utilityType }) => {
  const { plantName, id } = useParams<{ plantName: string; id: string }>()
  const navigate = useNavigate()

  const {
    apiEndpoint,
    hubUrl,
    pastDataMethod,
    liveEvent,
    joinGroupMethod,
    leaveGroupMethod,
    graphIdParam,
    detailedGraphByFilterId,
  } = utilityConfigs[utilityType]

  const chartId = "Thd-V"

  const [mainChartConfig, setMainChartConfig] = useState<BarChartConfig | null>(
    null,
  )
  const [detailedPanelData, setDetailedPanelData] = useState<BarChartData[]>([])
  const [utilityInfo, setUtilityInfo] = useState<any>(null)
  const [serverDown, setServerDown] = useState(false)
  const [selectedTimePeriod, setSelectedTimePeriod] =
    useState<TimePeriod>("live")
  const [liveSummary, setLiveSummary] = useState<Record<string, number>>({})
  const [pastSummary, setPastSummary] = useState<Record<string, number>>({})

  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const currentIdRef = useRef<number | null>(null)
  const lastLiveTsRef = useRef<number | null>(null)

  const fetchUtilityDetails = async (utilityId: string) => {
    try {
      const res = await api.get(`${apiEndpoint}${utilityId}`)
      if (res.data && res.data.length > 0) {
        const data = res.data[0]
        setUtilityInfo({
          name: data[`${utilityType}Name`],
          modelNo: utilityType === "line" ? undefined : data.modelNumber, //  line has no model
          plant: data.plantName,
          id:
            utilityType === "line"
              ? String(data.lineId)
              : String(data[`${utilityType.toLowerCase()}Id`]),
          lastUpdated: new Date(
            data.modifiedDate || data.createdDate,
          ).toLocaleString(),
          totalAlarms: data.totalAlarms ?? 0,
        })
      }
    } catch (err) {
      console.error(`❌ Error fetching ${utilityType} details:`, err)
    }
  }

  // fetch hourly/daily
  const fetchGraphData = async () => {
    try {
      const res = await api.get(
        `/AllGraphs/${detailedGraphByFilterId}?filter=${selectedTimePeriod}&${graphIdParam}=${id}&graphType=${chartId}`,
      )

      if (res.data) {
        if (res.data.liveSummary) setLiveSummary(res.data.liveSummary)
        if (res.data.pastSummary) setPastSummary(res.data.pastSummary)

        if (res.data.graphData) {
          const formatted = res.data.graphData.map((item: any) => {
            let label: string
            if (selectedTimePeriod === "daily") {
              label = new Date(item.DaySlot).toLocaleDateString("en-GB")
            } else if (selectedTimePeriod === "hourly") {
              label = new Date(item.HourSlot).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })
            } else {
              label = new Date(
                item.HourSlot ?? item.DaySlot,
              ).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            }
            return {
              timestamp: label,
              thD_V: Number(item.thD_V ?? 0),
            }
          })
          setDetailedPanelData(formatted)
        } else {
          setDetailedPanelData([])
        }
      }
    } catch (err) {
      console.error("❌ Error fetching graph data:", err)
    }
  }

  useEffect(() => {
    if (!id) return

    let heartbeat: NodeJS.Timeout
    let intervalId: NodeJS.Timeout
    const abortController = new AbortController()

    fetchUtilityDetails(id)

    const initLive = async () => {
      if (!connectionRef.current) {
        connectionRef.current = new signalR.HubConnectionBuilder()
          .withUrl(
            `${process.env.NEXT_PUBLIC_API_URL?.replace(
              /\/api$/,
              "",
            )}/${hubUrl}`,
            {
              skipNegotiation: true,
              transport: signalR.HttpTransportType.WebSockets,
            },
          )
          .withAutomaticReconnect()
          .build()
      }

      const connection = connectionRef.current
      try {
        if (
          ![
            signalR.HubConnectionState.Connected,
            signalR.HubConnectionState.Connecting,
          ].includes(connection.state)
        ) {
          await connection.start()
        }

        // past data
        try {
          const pastData: any[] = await connection.invoke(
            pastDataMethod,
            chartId,
            Number(id),
          )
          if (!abortController.signal.aborted && Array.isArray(pastData)) {
            const formatted = pastData.map((p) => ({
              timestamp: p.timestamp
                ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : new Date().toLocaleTimeString("en-GB"),
              thD_V: Number(p.thD_V ?? 0),
              total_net_kWh_Export: 0,
              thD_I: 0,
            }))
            setDetailedPanelData(formatted)
            const lastPoint = formatted.at(-1)
            if (lastPoint)
              setLiveSummary({
                AvgthD_V: lastPoint.thD_V,
              })
          }
        } catch (err) {
          console.error("❌ Failed to fetch past data:", err)
          setServerDown(true)
        }

        // live data
        connection.on(liveEvent, (payload: any) => {
          if (!payload?.timestamp) return
          const t = new Date(payload.timestamp).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
          const newPoint: BarChartData = {
            timestamp: t,
            thD_V: Number(payload.thD_V ?? 0),
            total_net_kWh_Export: 0,
            thD_I: 0,
          }
          setDetailedPanelData((prev) => [...prev.slice(-6), newPoint])
          lastLiveTsRef.current = Date.now()
          setServerDown(false)
          setLiveSummary({
            AvgthD_V: newPoint.thD_V,
          })
        })

        await connection.invoke(joinGroupMethod, chartId, Number(id))
        currentIdRef.current = Number(id)

        heartbeat = setInterval(() => {
          if (
            !lastLiveTsRef.current ||
            Date.now() - lastLiveTsRef.current > SERVER_TIMEOUT
          ) {
            setServerDown(true)
            setDetailedPanelData([])
          }
        }, HEARTBEAT_INTERVAL)
      } catch (err) {
        console.error("❌ Connection failed:", err)
        setServerDown(true)
      }
    }

    if (selectedTimePeriod === "live") {
      initLive()
    } else {
      if (connectionRef.current) {
        connectionRef.current.stop().catch(console.error)
        connectionRef.current = null
      }
      fetchGraphData()
      intervalId = setInterval(fetchGraphData, 15 * 60 * 1000)
    }

    return () => {
      abortController.abort()
      clearInterval(heartbeat)
      clearInterval(intervalId)
      if (connectionRef.current) {
        if (currentIdRef.current) {
          connectionRef.current
            .invoke(leaveGroupMethod, currentIdRef.current)
            .catch(console.error)
        }
        connectionRef.current.off(liveEvent)
        connectionRef.current.stop().catch(console.error)
        connectionRef.current = null
      }
    }
  }, [id, selectedTimePeriod])

  useEffect(() => {
    if (detailedPanelData.length > 0) {
      const chartConfigs = getBarChartConfigs(detailedPanelData)
      setMainChartConfig(chartConfigs.find((c) => c.id === chartId) || null)
    }
  }, [detailedPanelData])

  if (serverDown && selectedTimePeriod === "live") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-600 text-2xl font-bold mb-4">
            🚨 Service is not live
          </div>
          <p className="text-gray-600">Waiting for live data from server...</p>
        </div>
      </div>
    )
  }

  if (!utilityInfo) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        <p>Loading {utilityType} information...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header & Period Selection */}
      <div className="flex justify-between items-center gap-4 ">
        <h2 className="px-4 py-1 rounded-t-md bg-blue-500 text-white">
          Plant: {plantName},{" "}
          {utilityType.charAt(0).toUpperCase() + utilityType.slice(1)}: {id}
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
            className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800 transition ml-2"
            onClick={() => navigate(-1)}
          >
            <img src="/back.png" alt="Back" className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        {mainChartConfig ? (
          <SingleBarChart
            chart={mainChartConfig}
            height={300}
            isClickable={false}
          />
        ) : (
          <div className="flex justify-center items-center h-48 text-gray-500">
            Loading...
          </div>
        )}
      </div>

      {/* Panel */}
      {mainChartConfig && utilityInfo && (
        <BarChartDetailPanel
          mainChartConfig={mainChartConfig}
          detailedChartData={detailedPanelData}
          utilityName={utilityInfo.name}
          plantAffiliated={utilityInfo.plant}
          modelNo={utilityInfo.modelNo}
          utilityId={utilityInfo.gensetId}
          lastUpdated={utilityInfo.lastUpdated}
          totalAlarms={utilityInfo.totalAlarms}
          selectedTimePeriod={selectedTimePeriod}
          liveSummary={liveSummary}
          pastSummary={pastSummary}
        />
      )}
    </div>
  )
}

export default ThdVoltageDetail
