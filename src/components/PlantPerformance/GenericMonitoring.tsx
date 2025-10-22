import {
  activePowerChartConfig,
  activePowerThresholds,
  apparentPowerChartConfig,
  apparentPowerThresholds,
  currentChartConfig,
  currentThresholds,
  frequencyChartConfig,
  frequencyThresholds,
  getBarChartConfigs,
  kvahEnergyChartConfig,
  kVahEnergyThresholds,
  kvarhEnergyChartConfig,
  kVarhEnergyThresholds,
  kwhEnergyChartConfig,
  kwhEnergyThresholds,
  lineWiseVoltageChartConfig,
  lineWiseVoltageThresholds,
  phaseWiseVoltageChartConfig,
  phaseWiseVoltageThresholds,
  powerFactorChartConfig,
  powerFactorThresholds,
  reactivePowerChartConfig,
  reactivePowerThresholds,
} from "@/utils/data"
import {
  FrequencyDataPoint,
  KvahEnergyDataPoint,
  PhaseWiseVoltageDataPoint,
  ActivePowerDataPoint,
  ApparentPowerDataPoint,
  BarChartData,
  CurrentDataPoint,
  KvarhEnergyDataPoint,
  KwhEnergyDataPoint,
  LineWiseVoltageDataPoint,
  ReactivePowerDataPoint,
  PowerFactorDataPoint,
} from "@/utils/types"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as signalR from "@microsoft/signalr"
import SingleBarChart from "@/components/PlantPerformance/Chart/SingleBarChart"
import GenericChart from "@/components/PlantPerformance/Chart/GenericChart"

interface GenericMonitoringProps {
  hubUrl: string
  receiveEvent: string
  joinGroupMethod: string
  leaveGroupMethod: string
  getPastDataMethod: string
  groupId: number | string | undefined
  navigationPath: (chartId: string) => string
  plantName?: string
  lineName?: string
}

const GenericMonitoring = ({
  hubUrl,
  receiveEvent,
  joinGroupMethod,
  leaveGroupMethod,
  getPastDataMethod,
  groupId,
  navigationPath,
}: GenericMonitoringProps) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const currentGroupIdRef = useRef<number | string | null>(null)
  const lastLiveTsRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const [chartData, setChartData] = useState({
    phaseWiseVoltage: [] as PhaseWiseVoltageDataPoint[],
    kvah: [] as KvahEnergyDataPoint[],
    frequency: [] as FrequencyDataPoint[],
    bar: [] as BarChartData[],
    lineWiseVoltage: [] as LineWiseVoltageDataPoint[],
    activePower: [] as ActivePowerDataPoint[],
    reactivePower: [] as ReactivePowerDataPoint[],
    apparentPower: [] as ApparentPowerDataPoint[],
    kwh: [] as KwhEnergyDataPoint[],
    kvarh: [] as KvarhEnergyDataPoint[],
    current: [] as CurrentDataPoint[],
    powerFactor: [] as PowerFactorDataPoint[],
  })

  const [serverDown, setServerDown] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const HEARTBEAT_INTERVAL = 5000
  const SERVER_TIMEOUT = 6000
  const charts = getBarChartConfigs(chartData.bar)

  // Navigation handler (to be passed from route)
  const handleChartClick = (chartId: string) => {
    navigate(navigationPath(chartId))
  }

  useEffect(() => {
    if (!groupId) return
    const abortController = new AbortController()
    let heartbeat: NodeJS.Timeout

    const initConnection = async () => {
      if (!connectionRef.current) {
        connectionRef.current = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build()

        // Attach live listener
        connectionRef.current.on(receiveEvent, (payload: any) => {
          if (abortController.signal.aborted || !payload) return

          const time = new Date(payload.timestamp).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })

          setChartData((prev) => ({
            ...prev,
            bar: [
              ...prev.bar.slice(-6),
              {
                timestamp: time,
                total_net_kWh_Export: Number(payload.total_net_kWh_Export ?? 0),
                thD_I: Number(payload.thD_I ?? 0),
                thD_V: Number(payload.thD_V ?? 0),
              },
            ],
            phaseWiseVoltage: [
              ...prev.phaseWiseVoltage.slice(-6),
              {
                timestamp: time,
                v1: Number(payload.v1 ?? 0),
                v2: Number(payload.v2 ?? 0),
                v3: Number(payload.v3 ?? 0),
              },
            ],
            lineWiseVoltage: [
              ...prev.lineWiseVoltage.slice(-6),
              {
                timestamp: time,
                v12: Number(payload.v12 ?? 0),
                v23: Number(payload.v23 ?? 0),
                v31: Number(payload.v31 ?? 0),
              },
            ],
            activePower: [
              ...prev.activePower.slice(-6),
              {
                timestamp: time,
                kW1: Number(payload.kW1 ?? 0),
                kW2: Number(payload.kW2 ?? 0),
                kW3: Number(payload.kW3 ?? 0),
              },
            ],
            reactivePower: [
              ...prev.reactivePower.slice(-6),
              {
                timestamp: time,
                kVAr1: Number(payload.kVAr1 ?? 0),
                kVAr2: Number(payload.kVAr2 ?? 0),
                kVAr3: Number(payload.kVAr3 ?? 0),
              },
            ],
            apparentPower: [
              ...prev.apparentPower.slice(-6),
              {
                timestamp: time,
                kVA1: Number(payload.kVA1 ?? 0),
                kVA2: Number(payload.kVA2 ?? 0),
                kVA3: Number(payload.kVA3 ?? 0),
              },
            ],
            kwh: [
              ...prev.kwh.slice(-6),
              {
                timestamp: time,
                kWh1: Number(payload.kWh1 ?? 0),
                kWh2: Number(payload.kWh2 ?? 0),
                kWh3: Number(payload.kWh3 ?? 0),
              },
            ],
            kvarh: [
              ...prev.kvarh.slice(-6),
              {
                timestamp: time,
                kvarh1: Number(payload.kvarh1 ?? 0),
                kvarh2: Number(payload.kvarh2 ?? 0),
                kvarh3: Number(payload.kvarh3 ?? 0),
              },
            ],
            kvah: [
              ...prev.kvah.slice(-6),
              {
                timestamp: time,
                kVAh1: Number(payload.kVAh1 ?? 0),
                kVAh2: Number(payload.kVAh2 ?? 0),
                kVAh3: Number(payload.kVAh3 ?? 0),
              },
            ],
            current: [
              ...prev.current.slice(-6),
              {
                timestamp: time,
                i1: Number(payload.i1 ?? 0),
                i2: Number(payload.i2 ?? 0),
                i3: Number(payload.i3 ?? 0),
              },
            ],
            powerFactor: [
              ...prev.powerFactor.slice(-6),
              {
                timestamp: time,
                pF1: Number(payload.pF1 ?? payload.PF1 ?? 0),
                pF2: Number(payload.pF2 ?? payload.PF2 ?? 0),
                pF3: Number(payload.pF3 ?? payload.PF3 ?? 0),
              },
            ],
            frequency: [
              ...prev.frequency.slice(-6),
              {
                timestamp: time,
                frequency1: Number(payload.frequency1 ?? 0),
              },
            ],
          }))

          lastLiveTsRef.current = Date.now()
          setServerDown(false)
        })
      }
      console.log("Connecting to SignalR hub:", hubUrl)
      console.log("Group ID:", groupId)
      const connection = connectionRef.current
      try {
        if (
          connection.state !== signalR.HubConnectionState.Connected &&
          connection.state !== signalR.HubConnectionState.Connecting
        ) {
          await connection.start()
          console.log("SignalR connected:", connection.connectionId)
        }

        // Leave old group
        if (currentGroupIdRef.current) {
          await connection
            .invoke(leaveGroupMethod, currentGroupIdRef.current)
            .catch(() => {})
        }

        // Join new group
        await connection.invoke(joinGroupMethod, Number(groupId))
        currentGroupIdRef.current = Number(groupId)

        // Fetch past data
        try {
          const pastData: any[] = await connection.invoke(
            getPastDataMethod,
            Number(groupId),
          )
          if (Array.isArray(pastData)) {
            setChartData({
              bar: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                total_net_kWh_Export: Number(p.total_net_kWh_Export ?? 0),
                thD_I: Number(p.thD_I ?? 0),
                thD_V: Number(p.thD_V ?? 0),
              })),
              phaseWiseVoltage: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                v1: Number(p.v1 ?? 0),
                v2: Number(p.v2 ?? 0),
                v3: Number(p.v3 ?? 0),
              })),
              lineWiseVoltage: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                v12: Number(p.v12 ?? 0),
                v23: Number(p.v23 ?? 0),
                v31: Number(p.v31 ?? 0),
              })),
              activePower: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                kW1: Number(p.kW1 ?? 0),
                kW2: Number(p.kW2 ?? 0),
                kW3: Number(p.kW3 ?? 0),
              })),
              reactivePower: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                kVAr1: Number(p.kVAr1 ?? 0),
                kVAr2: Number(p.kVAr2 ?? 0),
                kVAr3: Number(p.kVAr3 ?? 0),
              })),
              apparentPower: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                kVA1: Number(p.kVA1 ?? 0),
                kVA2: Number(p.kVA2 ?? 0),
                kVA3: Number(p.kVA3 ?? 0),
              })),
              kwh: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                kWh1: Number(p.kWh1 ?? 0),
                kWh2: Number(p.kWh2 ?? 0),
                kWh3: Number(p.kWh3 ?? 0),
              })),
              kvarh: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                kvarh1: Number(p.kvarh1 ?? 0),
                kvarh2: Number(p.kvarh2 ?? 0),
                kvarh3: Number(p.kvarh3 ?? 0),
              })),
              kvah: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                kVAh1: Number(p.kVAh1 ?? 0),
                kVAh2: Number(p.kVAh2 ?? 0),
                kVAh3: Number(p.kVAh3 ?? 0),
              })),
              current: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                i1: Number(p.i1 ?? 0),
                i2: Number(p.i2 ?? 0),
                i3: Number(p.i3 ?? 0),
              })),
              powerFactor: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                pF1: Number(p.pF1 ?? p.PF1 ?? 0),
                pF2: Number(p.pF2 ?? p.PF2 ?? 0),
                pF3: Number(p.pF3 ?? p.PF3 ?? 0),
              })),
              frequency: pastData.map((p) => ({
                timestamp: p.timestamp
                  ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : new Date().toLocaleTimeString("en-GB"),
                frequency1: Number(p.frequency1 ?? 0),
              })),
            })
          }
          console.log("[PAST DATA]", pastData)
        } catch (err) {
          setErrorMsg("Failed to load past data")
        }

        // Heartbeat monitor
        heartbeat = setInterval(() => {
          if (
            !lastLiveTsRef.current ||
            Date.now() - lastLiveTsRef.current > SERVER_TIMEOUT
          ) {
            setServerDown(true)
            setChartData({
              phaseWiseVoltage: [],
              kvah: [],
              frequency: [],
              bar: [],
              lineWiseVoltage: [],
              activePower: [],
              reactivePower: [],
              apparentPower: [],
              kwh: [],
              kvarh: [],
              current: [],
              powerFactor: [],
            })
          }
        }, HEARTBEAT_INTERVAL)
      } catch (err) {
        console.error("SignalR connection error:", err)
        setErrorMsg("Connection failed")
        setServerDown(true)
      }
    }

    initConnection()

    return () => {
      abortController.abort()
      clearInterval(heartbeat)
      if (connectionRef.current) {
        if (currentGroupIdRef.current) {
          connectionRef.current
            .invoke(leaveGroupMethod, currentGroupIdRef.current)
            .catch(() => {})
        }
        connectionRef.current.off(receiveEvent)
        connectionRef.current.stop().catch(() => {})
      }
    }
  }, [hubUrl, groupId])

  return (
    <div className="space-y-4">
      {errorMsg ? (
        <div className="flex items-center justify-center h-[80vh] text-red-600 font-bold text-2xl">
          🚨 {errorMsg}
        </div>
      ) : serverDown ? (
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="text-red-600 text-2xl font-bold mb-4">
              🚨 Service is not live
            </div>
            <p className="text-gray-600">Waiting for live data...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {charts.map((chart) => (
              <SingleBarChart
                key={chart.id}
                chart={chart}
                onClick={handleChartClick}
                isClickable={true}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {phaseWiseVoltageChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer hover:scale-[1.01]"
                  onClick={() => handleChartClick("phaseWiseVoltage")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.phaseWiseVoltage}
                    thresholds={phaseWiseVoltageThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {lineWiseVoltageChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => handleChartClick("lineWiseVoltage")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.lineWiseVoltage}
                    thresholds={lineWiseVoltageThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {activePowerChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => handleChartClick("activePower")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.activePower}
                    thresholds={activePowerThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {reactivePowerChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => handleChartClick("reactivePower")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.reactivePower}
                    thresholds={reactivePowerThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {apparentPowerChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => handleChartClick("apparentPower")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.apparentPower}
                    thresholds={apparentPowerThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {kwhEnergyChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => handleChartClick("kwhEnergy")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.kwh}
                    thresholds={kwhEnergyThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {kvarhEnergyChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => handleChartClick("kvarhEnergy")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.kvarh}
                    thresholds={kVarhEnergyThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {kvahEnergyChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => handleChartClick("kvahEnergy")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.kvah}
                    thresholds={kVahEnergyThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {currentChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => handleChartClick("current")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.current}
                    thresholds={currentThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {powerFactorChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => handleChartClick("powerFactor")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.powerFactor}
                    thresholds={powerFactorThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
            <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
              {frequencyChartConfig.map((config) => (
                <div
                  key={config.id}
                  className="cursor-pointer transition-transform hover:scale-[1.01]"
                  onClick={() => handleChartClick("frequency")}
                >
                  <GenericChart
                    config={config}
                    data={chartData.frequency}
                    thresholds={frequencyThresholds}
                    timePeriod="live"
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default GenericMonitoring
