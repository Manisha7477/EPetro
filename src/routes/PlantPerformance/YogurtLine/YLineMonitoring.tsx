import { useParams } from "react-router-dom"
import MonitoringDashboard from "@/components/PlantPerformance/GenericMonitoring"

const YLineMonitoring = () => {
  const { id, plantName, lineName } = useParams()
  console.log("Line ID:", id)
  console.log("Plantname:", plantName)
  return (
    <MonitoringDashboard
      hubUrl={`${process.env.NEXT_PUBLIC_API_URL?.replace(
        /\/api$/,
        "",
      )}/LineHub`}
      receiveEvent="ReceiveLineData"
      joinGroupMethod="JoinLineGroup"
      leaveGroupMethod="LeaveLineGroup"
      getPastDataMethod="GetLinePastData"
      groupId={id}
      navigationPath={(chartId) =>
        `/plantPerformanceYogurtLine/${plantName}/${id}/monitoring/${chartId}`
      }
      plantName={plantName}
    />
  )
}

export default YLineMonitoring

// import {
//   activePowerChartConfig,
//   activePowerThresholds,
//   apparentPowerChartConfig,
//   apparentPowerThresholds,
//   currentChartConfig,
//   currentThresholds,
//   frequencyChartConfig,
//   frequencyThresholds,
//   getBarChartConfigs,
//   kvahEnergyChartConfig,
//   kVahEnergyThresholds,
//   kvarhEnergyChartConfig,
//   kVarhEnergyThresholds,
//   kwhEnergyChartConfig,
//   kwhEnergyThresholds,
//   lineWiseVoltageChartConfig,
//   lineWiseVoltageThresholds,
//   phaseWiseVoltageChartConfig,
//   phaseWiseVoltageThresholds,
//   powerFactorChartConfig,
//   powerFactorThresholds,
//   reactivePowerChartConfig,
//   reactivePowerThresholds,
// } from "@/utils/data"
// import {
//   FrequencyDataPoint,
//   KvahEnergyDataPoint,
//   PhaseWiseVoltageDataPoint,
//   ActivePowerDataPoint,
//   ApparentPowerDataPoint,
//   BarChartData,
//   CurrentDataPoint,
//   KvarhEnergyDataPoint,
//   KwhEnergyDataPoint,
//   LineWiseVoltageDataPoint,
//   ReactivePowerDataPoint,
//   type PowerFactorDataPoint,
// } from "@/utils/types"

// import { useEffect, useRef, useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import * as signalR from "@microsoft/signalr"

// import SingleBarChart from "@/components/PlantPerformance/Chart/SingleBarChart"
// import GenericChart from "@/components/PlantPerformance/Chart/GenericChart"

// const YLineMonitoring = () => {
//   const { id: genId, plantName, lineName } = useParams()
//   const navigate = useNavigate()

//   const connectionRef = useRef<signalR.HubConnection | null>(null)
//   const currentGenIdRef = useRef<number | null>(null)
//   const lastLiveTsRef = useRef<number | null>(null)

//   const [chartData, setChartData] = useState({
//     phaseWiseVoltage: [] as PhaseWiseVoltageDataPoint[],
//     kvah: [] as KvahEnergyDataPoint[],
//     frequency: [] as FrequencyDataPoint[],
//     bar: [] as BarChartData[],
//     lineWiseVoltage: [] as LineWiseVoltageDataPoint[],
//     activePower: [] as ActivePowerDataPoint[],
//     reactivePower: [] as ReactivePowerDataPoint[],
//     apparentPower: [] as ApparentPowerDataPoint[],
//     kwh: [] as KwhEnergyDataPoint[],
//     kvarh: [] as KvarhEnergyDataPoint[],
//     current: [] as CurrentDataPoint[],
//     powerFactor: [] as PowerFactorDataPoint[],
//   })

//   const [serverDown, setServerDown] = useState(false)
//   const [errorMsg, setErrorMsg] = useState<string | null>(null)

//   const HEARTBEAT_INTERVAL = 5000
//   const SERVER_TIMEOUT = 6000
//   const charts = getBarChartConfigs(chartData.bar)
//   useEffect(() => {
//     if (!genId) return
//     const abortController = new AbortController()
//     let heartbeat: NodeJS.Timeout

//     const initConnection = async () => {
//       if (!connectionRef.current) {
//         connectionRef.current = new signalR.HubConnectionBuilder()
//           .withUrl(
//             `${process.env.NEXT_PUBLIC_API_URL?.replace(
//               /\/api$/,
//               "",
//             )}/GeneratorHub`,
//             {
//               skipNegotiation: true,
//               transport: signalR.HttpTransportType.WebSockets,
//             },
//           )
//           .withAutomaticReconnect()
//           .configureLogging(signalR.LogLevel.Information)
//           .build()

//         // Attach live listener
//         connectionRef.current.on("ReceiveGeneratorData", (payload: any) => {
//           if (abortController.signal.aborted || !payload) return

//           const time = new Date(payload.timestamp).toLocaleTimeString("en-GB", {
//             hour: "2-digit",
//             minute: "2-digit",
//             second: "2-digit",
//           })

//           // Example: only phase voltage shown, repeat for others
//           const newBarChartData: BarChartData = {
//             timestamp: time,
//             total_net_kWh_Export: Number(payload.total_net_kWh_Export ?? 0),
//             thD_I: Number(payload.thD_I ?? 0),
//             thD_V: Number(payload.thD_V ?? 0),
//           }
//           const newPhaseWiseVoltage: PhaseWiseVoltageDataPoint = {
//             timestamp: time,
//             v1: Number(payload.v1 ?? 0),
//             v2: Number(payload.v2 ?? 0),
//             v3: Number(payload.v3 ?? 0),
//           }
//           const newLineWiseVoltage: LineWiseVoltageDataPoint = {
//             timestamp: time,
//             v12: Number(payload.v12 ?? 0),
//             v23: Number(payload.v23 ?? 0),
//             v31: Number(payload.v31 ?? 0),
//           }
//           const newActPow: ActivePowerDataPoint = {
//             timestamp: time,
//             kW1: Number(payload.kW1 ?? 0),
//             kW2: Number(payload.kW2 ?? 0),
//             kW3: Number(payload.kW3 ?? 0),
//           }
//           const newRePow: ReactivePowerDataPoint = {
//             timestamp: time,
//             kVAr1: Number(payload.kVAr1 ?? 0),
//             kVAr2: Number(payload.kVAr2 ?? 0),
//             kVAr3: Number(payload.kVAr3 ?? 0),
//           }
//           const newAppPow: ApparentPowerDataPoint = {
//             timestamp: time,
//             kVA1: Number(payload.kVA1 ?? 0),
//             kVA2: Number(payload.kVA2 ?? 0),
//             kVA3: Number(payload.kVA3 ?? 0),
//           }

//           const newKwh: KwhEnergyDataPoint = {
//             timestamp: time,
//             kWh1: Number(payload.kWh1 ?? 0),
//             kWh2: Number(payload.kWh2 ?? 0),
//             kWh3: Number(payload.kWh3 ?? 0),
//           }
//           const newKvarh: KvarhEnergyDataPoint = {
//             timestamp: time,
//             kvarh1: Number(payload.kvarh1 ?? 0),
//             kvarh2: Number(payload.kvarh2 ?? 0),
//             kvarh3: Number(payload.kvarh3 ?? 0),
//           }
//           const newKvah: KvahEnergyDataPoint = {
//             timestamp: time,
//             kVAh1: Number(payload.kVAh1 ?? 0),
//             kVAh2: Number(payload.kVAh2 ?? 0),
//             kVAh3: Number(payload.kVAh3 ?? 0),
//           }
//           const newCurrent: CurrentDataPoint = {
//             timestamp: time,
//             i1: Number(payload.i1 ?? 0),
//             i2: Number(payload.i2 ?? 0),
//             i3: Number(payload.i3 ?? 0),
//           }
//           const newPowFactor: PowerFactorDataPoint = {
//             timestamp: time,
//             pF1: Number(payload.pF1 ?? 0),
//             pF2: Number(payload.pF2 ?? 0),
//             pF3: Number(payload.pF3 ?? 0),
//           }
//           const newFrequency: FrequencyDataPoint = {
//             timestamp: time,
//             frequency1: Number(payload.frequency1 ?? 0),
//           }

//           setChartData((prev) => ({
//             ...prev,
//             bar: [...prev.bar.slice(-6), newBarChartData],
//             phaseWiseVoltage: [
//               ...prev.phaseWiseVoltage.slice(-6),
//               newPhaseWiseVoltage,
//             ],
//             lineWiseVoltage: [
//               ...prev.lineWiseVoltage.slice(-6),
//               newLineWiseVoltage,
//             ],
//             activePower: [...prev.activePower.slice(-6), newActPow],
//             reactivePower: [...prev.reactivePower.slice(-6), newRePow],
//             apparentPower: [...prev.apparentPower.slice(-6), newAppPow],
//             kwh: [...prev.kwh.slice(-6), newKwh],
//             kvarh: [...prev.kvarh.slice(-6), newKvarh],
//             kvah: [...prev.kvah.slice(-6), newKvah],
//             current: [...prev.current.slice(-6), newCurrent],
//             powerFactor: [...prev.powerFactor.slice(-6), newPowFactor],
//             frequency: [...prev.frequency.slice(-6), newFrequency],

//             // add others the same way...
//           }))

//           lastLiveTsRef.current = Date.now()
//           setServerDown(false)
//         })
//       }

//       const connection = connectionRef.current
//       try {
//         if (
//           connection.state !== signalR.HubConnectionState.Connected &&
//           connection.state !== signalR.HubConnectionState.Connecting
//         ) {
//           await connection.start()
//           console.log("✅ Connected:", connection.connectionId)
//         }

//         // Leave old group
//         if (currentGenIdRef.current) {
//           await connection
//             .invoke("LeaveGeneratorGroup", currentGenIdRef.current)
//             .catch((err) => console.error("Error leaving old group:", err))
//         }

//         // Join new group
//         await connection.invoke("JoinGeneratorGroup", Number(genId))
//         currentGenIdRef.current = Number(genId)

//         // Fetch past data
//         try {
//           const pastData: any[] = await connection.invoke(
//             "GetPastData",
//             Number(genId),
//           )
//           if (Array.isArray(pastData)) {
//             const formatedNewBar = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               total_net_kWh_Export: Number(p.total_net_kWh_Export ?? 0),
//               thD_I: Number(p.thD_I ?? 0),
//               thD_V: Number(p.thD_V ?? 0),
//             }))

//             const formattedPhase = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               v1: Number(p.v1 ?? 0),
//               v2: Number(p.v2 ?? 0),
//               v3: Number(p.v3 ?? 0),
//             }))

//             const formattedLine = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               v12: Number(p.v12 ?? 0),
//               v23: Number(p.v23 ?? 0),
//               v31: Number(p.v31 ?? 0),
//             }))
//             const formattedActive = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               kW1: Number(p.kW1 ?? 0),
//               kW2: Number(p.kW2 ?? 0),
//               kW3: Number(p.kW3 ?? 0),
//             }))
//             const formattedReactive = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               kVAr1: Number(p.kVAr1 ?? 0),
//               kVAr2: Number(p.kVAr2 ?? 0),
//               kVAr3: Number(p.kVAr3 ?? 0),
//             }))
//             const formattedKwh = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               kWh1: Number(p.kWh1 ?? 0),
//               kWh2: Number(p.kWh2 ?? 0),
//               kWh3: Number(p.kWh3 ?? 0),
//             }))
//             const formattedKvah = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               kVAh1: Number(p.kVAh1 ?? 0),
//               kVAh2: Number(p.kVAh2 ?? 0),
//               kVAh3: Number(p.kVAh3 ?? 0),
//             }))
//             const formattedKvarh = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               kvarh1: Number(p.kvarh1 ?? 0),
//               kvarh2: Number(p.kvarh2 ?? 0),
//               kvarh3: Number(p.kvarh3 ?? 0),
//             }))
//             const formattedCurrent = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               i1: Number(p.i1 ?? 0),
//               i2: Number(p.i2 ?? 0),
//               i3: Number(p.i3 ?? 0),
//             }))

//             const formattedPowerFactor = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               pF1: Number(p.pF1 ?? 0),
//               pF2: Number(p.pF2 ?? 0),
//               pF3: Number(p.pF3 ?? 0),
//             }))
//             const formattedFrequency = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               frequency1: Number(p.frequency1 ?? 0),
//             }))
//             const formattedApparent = pastData.map((p) => ({
//               timestamp: p.timestamp
//                 ? new Date(p.timestamp).toLocaleTimeString("en-GB", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                   })
//                 : new Date().toLocaleTimeString("en-GB"),
//               kVA1: Number(p.kVA1 ?? 0),
//               kVA2: Number(p.kVA2 ?? 0),
//               kVA3: Number(p.kVA3 ?? 0),
//             }))
//             setChartData((prev) => ({
//               ...prev,
//               bar: formatedNewBar,
//               phaseWiseVoltage: formattedPhase,
//               lineWiseVoltage: formattedLine,
//               activePower: formattedActive,
//               reactivePower: formattedReactive,
//               apparentPower: formattedApparent,
//               kwh: formattedKwh,
//               kvah: formattedKvah,
//               kvarh: formattedKvarh,
//               current: formattedCurrent,
//               powerFactor: formattedPowerFactor,
//               frequency: formattedFrequency,
//             }))
//           }
//         } catch (err) {
//           console.error(" Failed past data:", err)
//           setErrorMsg("Failed to load past data")
//         }

//         // Heartbeat monitor
//         heartbeat = setInterval(() => {
//           if (
//             !lastLiveTsRef.current ||
//             Date.now() - lastLiveTsRef.current > SERVER_TIMEOUT
//           ) {
//             setServerDown(true)
//             setChartData({
//               phaseWiseVoltage: [],
//               kvah: [],
//               frequency: [],
//               bar: [],
//               lineWiseVoltage: [],
//               activePower: [],
//               reactivePower: [],
//               apparentPower: [],
//               kwh: [],
//               kvarh: [],
//               current: [],
//               powerFactor: [],
//             })
//           }
//         }, HEARTBEAT_INTERVAL)
//       } catch (err) {
//         console.error("❌ Connection failed:", err)
//         setErrorMsg("Connection failed")
//         setServerDown(true)
//       }
//     }

//     initConnection()

//     return () => {
//       abortController.abort()
//       clearInterval(heartbeat)

//       if (connectionRef.current) {
//         if (currentGenIdRef.current) {
//           connectionRef.current
//             .invoke("LeaveGeneratorGroup", currentGenIdRef.current)
//             .catch((err) => console.error("Cleanup leave error:", err))
//         }
//         connectionRef.current.off("ReceiveGeneratorData")
//         connectionRef.current
//           .stop()
//           .catch((err) => console.error("Cleanup stop error:", err))
//       }
//     }
//   }, [genId])

//   const handleChartClick = (chartId: string) => {
//     if (!genId || !plantName || !lineName) return
//     navigate(
//       `/plantPerformanceUtilities/${plantName}/${lineName}/generator/${genId}/monitoring/${chartId}`,
//     )
//   }

//   return (
//     <div className="space-y-4">
//       {errorMsg ? (
//         <div className="flex items-center justify-center h-[80vh] text-red-600 font-bold text-2xl">
//           🚨 {errorMsg}
//         </div>
//       ) : serverDown ? (
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="text-red-600 text-2xl font-bold mb-4">
//               🚨 Service is not live
//             </div>
//             <p className="text-gray-600">Waiting for live data...</p>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Example usage, keep your full chart grid layout */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {charts.map((chart) => (
//               <SingleBarChart
//                 key={chart.id}
//                 chart={chart}
//                 onClick={handleChartClick}
//                 isClickable={true}
//               />
//             ))}
//           </div>

//           {/* Phase Wise Voltage */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {phaseWiseVoltageChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer hover:scale-[1.01]"
//                   onClick={() => handleChartClick("phaseWiseVoltage")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.phaseWiseVoltage}
//                     thresholds={phaseWiseVoltageThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Line Wise Voltage */}
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {lineWiseVoltageChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
//                   onClick={() => handleChartClick("lineWiseVoltage")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.lineWiseVoltage}
//                     thresholds={lineWiseVoltageThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//           {/*  Active Power */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {activePowerChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
//                   onClick={() => handleChartClick("activePower")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.activePower}
//                     thresholds={activePowerThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {reactivePowerChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
//                   onClick={() => handleChartClick("reactivePower")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.reactivePower}
//                     thresholds={reactivePowerThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {apparentPowerChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
//                   onClick={() => handleChartClick("apparentPower")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.apparentPower}
//                     thresholds={apparentPowerThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {kwhEnergyChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
//                   onClick={() => handleChartClick("kwhEnergy")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.kwh}
//                     thresholds={kwhEnergyThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {kvarhEnergyChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
//                   onClick={() => handleChartClick("kVArhEnergy")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.kvarh}
//                     thresholds={kVarhEnergyThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>
//             {/* Kvah Energy Consumption */}
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {kvahEnergyChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
//                   onClick={() => handleChartClick("kVAhEnergy")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.kvah}
//                     thresholds={kVahEnergyThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {currentChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
//                   onClick={() => handleChartClick("current")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.current}
//                     thresholds={currentThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {powerFactorChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
//                   onClick={() => handleChartClick("powerFactor")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.powerFactor}
//                     thresholds={powerFactorThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>
//             {/* Frequency */}
//             <div className="bg-white pt-2 px-4 pb-4 rounded shadow-md">
//               {frequencyChartConfig.map((config) => (
//                 <div
//                   key={config.id}
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
//                   onClick={() => handleChartClick("frequency")}
//                 >
//                   <GenericChart
//                     config={config}
//                     data={chartData.frequency}
//                     thresholds={frequencyThresholds}
//                     timePeriod="live"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default YLineMonitoring
