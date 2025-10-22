import { useParams } from "react-router-dom"
import MonitoringDashboard from "@/components/PlantPerformance/GenericMonitoring"

const GenMonitoring = () => {
  const { id, plantName, lineName } = useParams()
  console.log("Generator ID:", id)
  console.log("Plantname:", plantName)
  console.log("Line Name:", lineName)
  return (
    <MonitoringDashboard
      hubUrl={`${process.env.NEXT_PUBLIC_API_URL?.replace(
        /\/api$/,
        "",
      )}/GeneratorHub`}
      receiveEvent="ReceiveGeneratorData"
      joinGroupMethod="JoinGeneratorGroup"
      leaveGroupMethod="LeaveGeneratorGroup"
      getPastDataMethod="GetPastData"
      groupId={id}
      navigationPath={(chartId) =>
        `/plantPerformanceUtilities/${plantName}/${lineName}/generator/${id}/monitoring/${chartId}`
      }
      plantName={plantName}
      lineName={lineName}
    />
  )
}

export default GenMonitoring

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

// const GenNewMonitoring = () => {
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
//     console.log("generatorID - " + genId)
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

//     // return () => {
//     //   abortController.abort()
//     //   clearInterval(heartbeat)

//     //   if (connectionRef.current) {
//     //     if (currentGenIdRef.current) {
//     //       connectionRef.current
//     //         .invoke("LeaveGeneratorGroup", currentGenIdRef.current)
//     //         .catch((err) => console.error("Cleanup leave error:", err))
//     //     }
//     //     connectionRef.current.off("ReceiveGeneratorData")
//     //     connectionRef.current
//     //       .stop()
//     //       .catch((err) => console.error("Cleanup stop error:", err))
//     //   }
//     // }
//     return () => {
//       abortController.abort()
//       clearInterval(heartbeat)

//       if (connectionRef.current) {
//         const connection = connectionRef.current

//         if (
//           currentGenIdRef.current &&
//           connection.state === signalR.HubConnectionState.Connected
//         ) {
//           connection
//             .invoke("LeaveGeneratorGroup", currentGenIdRef.current)
//             .catch((err) =>
//               console.warn("Cleanup leave error (ignored if closing):", err),
//             )
//         }

//         connection.off("ReceiveGeneratorData")

//         connection
//           .stop()
//           .catch((err) =>
//             console.warn(
//               "Cleanup stop error (safe to ignore if closing):",
//               err,
//             ),
//           )
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

// export default GenNewMonitoring

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
// import * as signalR from "@microsoft/signalr"
// import { useEffect, useRef, useState } from "react"
// import { createSignalRConnection } from "@/utils/signalr"
// import SingleBarChart from "@/components/PlantPerformance/Chart/SingleBarChart"
// import { useParams, useNavigate } from "react-router-dom"
// import GenericChart from "@/components/PlantPerformance/Chart/GenericChart"
// //  Use generic connection creator
// const connection = createSignalRConnection("/allvghub")
// const GenMonitoring = () => {
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

//   const { id, plantName, lineName } = useParams()
//   const navigate = useNavigate()
//   const [serverDown, setServerDown] = useState(false) // NEW state
//   const HEARTBEAT_INTERVAL = 5000 // 5 seconds in ms
//   const SERVER_TIMEOUT = 6000 // 6 seconds in ms
//   const lastLiveTsRef = useRef<number | null>(null)
//   const charts = getBarChartConfigs(chartData.bar)

//   function formatPayload(payload: any, time: string) {
//     return {
//       voltage: {
//         timestamp: time,
//         v1: Number(payload.v1 ?? 0),
//         v2: Number(payload.v2 ?? 0),
//         v3: Number(payload.v3 ?? 0),
//       },
//       kvah: {
//         timestamp: time,
//         kVAh1: Number(payload.kVAh1 ?? 0),
//         kVAh2: Number(payload.kVAh2 ?? 0),
//         kVAh3: Number(payload.kVAh3 ?? 0),
//       },
//       frequency: {
//         timestamp: time,
//         frequency1: Number(payload.frequency1 ?? 0),
//       },
//       bar: {
//         timestamp: time,
//         total_net_kWh_Export: Number(payload.total_net_kWh_Export ?? 0),
//         thD_I: Number(payload.thD_I ?? 0),
//         thD_V: Number(payload.thD_V ?? 0),
//       },
//       line: {
//         timestamp: time,
//         v12: Number(payload.v12 ?? 0),
//         v23: Number(payload.v23 ?? 0),
//         v31: Number(payload.v31 ?? 0),
//       },
//       activePower: {
//         timestamp: time,
//         kW1: Number(payload.kW1 ?? 0),
//         kW2: Number(payload.kW2 ?? 0),
//         kW3: Number(payload.kW3 ?? 0),
//       },
//       reactivePower: {
//         timestamp: time,
//         kVAr1: Number(payload.kVAr1 ?? 0),
//         kVAr2: Number(payload.kVAr2 ?? 0),
//         kVAr3: Number(payload.kVAr3 ?? 0),
//       },
//       apparentPower: {
//         timestamp: time,
//         kVA1: Number(payload.kVA1 ?? 0),
//         kVA2: Number(payload.kVA2 ?? 0),
//         kVA3: Number(payload.kVA3 ?? 0),
//       },
//       kwh: {
//         timestamp: time,
//         kWh1: Number(payload.kWh1 ?? 0),
//         kWh2: Number(payload.kWh2 ?? 0),
//         kWh3: Number(payload.kWh3 ?? 0),
//       },
//       kvarh: {
//         timestamp: time,
//         kvarh1: Number(payload.kvarh1 ?? 0),
//         kvarh2: Number(payload.kvarh2 ?? 0),
//         kvarh3: Number(payload.kvarh3 ?? 0),
//       },
//       current: {
//         timestamp: time,
//         i1: Number(payload.i1 ?? 0),
//         i2: Number(payload.i2 ?? 0),
//         i3: Number(payload.i3 ?? 0),
//       },
//       powerFactor: {
//         timestamp: time,
//         PF1: Number(payload.PF1 ?? 0),
//         PF2: Number(payload.PF2 ?? 0),
//         PF3: Number(payload.PF3 ?? 0),
//       },
//     }
//   }

//   useEffect(() => {
//     let isMounted = true
//     let heartbeat: NodeJS.Timeout
//     const fetchInitialData = async () => {
//       try {
//         if (connection.state !== signalR.HubConnectionState.Connected) {
//           try {
//             await connection.start()
//             console.log(" Connected to SignalR")
//           } catch (err) {
//             console.error("SignalR connection failed:", err)
//             setServerDown(true)
//             return
//           }
//         }
//         // Fetch last 6 data points
//         const history = await connection.invoke("GetPastData")
//         if (isMounted && Array.isArray(history)) {
//           const formattedVoltage: PhaseWiseVoltageDataPoint[] = []
//           const formattedLine: LineWiseVoltageDataPoint[] = []
//           const formattedKvah: KvahEnergyDataPoint[] = []
//           const formattedFrequency: FrequencyDataPoint[] = []
//           const formattedBar: BarChartData[] = []
//           const formattedActPow: ActivePowerDataPoint[] = []
//           const formattedRePow: ReactivePowerDataPoint[] = []
//           const formattedAppPow: ApparentPowerDataPoint[] = []
//           const formattedKwh: KwhEnergyDataPoint[] = []
//           const formattedKvarh: KvarhEnergyDataPoint[] = []
//           const formattedCurrent: CurrentDataPoint[] = []
//           const formattedPowFactor: PowerFactorDataPoint[] = []
//           history.forEach((payload: any) => {
//             const time = payload.timestamp
//               ? new Date(payload.timestamp).toLocaleTimeString("en-GB", {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   second: "2-digit",
//                 })
//               : new Date().toLocaleTimeString("en-GB")
//             formattedVoltage.push({
//               timestamp: time,
//               v1: Number(payload.v1 ?? 0),
//               v2: Number(payload.v2 ?? 0),
//               v3: Number(payload.v3 ?? 0),
//             })
//             formattedKvah.push({
//               timestamp: time,
//               kVAh1: Number(payload.kVAh1 ?? 0),
//               kVAh2: Number(payload.kVAh2 ?? 0),
//               kVAh3: Number(payload.kVAh3 ?? 0),
//             })
//             formattedFrequency.push({
//               timestamp: time,
//               frequency1: Number(payload.frequency1 ?? 0),
//             })
//             formattedBar.push({
//               timestamp: time,
//               total_net_kWh_Export: Number(payload.total_net_kWh_Export ?? 0),
//               thD_I: Number(payload.thD_I ?? 0),
//               thD_V: Number(payload.thD_V ?? 0),
//             })
//             formattedLine.push({
//               timestamp: time,
//               v12: Number(payload.v12 ?? 0),
//               v23: Number(payload.v23 ?? 0),
//               v31: Number(payload.v31 ?? 0),
//             })
//             formattedActPow.push({
//               timestamp: time,
//               kW1: Number(payload.kW1 ?? 0),
//               kW2: Number(payload.kW2 ?? 0),
//               kW3: Number(payload.kW3 ?? 0),
//             })
//             formattedRePow.push({
//               timestamp: time,
//               kVAr1: Number(payload.kVAr1 ?? 0),
//               kVAr2: Number(payload.kVAr2 ?? 0),
//               kVAr3: Number(payload.kVAr3 ?? 0),
//             })
//             formattedAppPow.push({
//               timestamp: time,
//               kVA1: Number(payload.kVA1 ?? 0),
//               kVA2: Number(payload.kVA2 ?? 0),
//               kVA3: Number(payload.kVA3 ?? 0),
//             })
//             formattedKwh.push({
//               timestamp: time,
//               kWh1: Number(payload.kWh1 ?? 0),
//               kWh2: Number(payload.kWh2 ?? 0),
//               kWh3: Number(payload.kWh3 ?? 0),
//             })
//             formattedKvarh.push({
//               timestamp: time,
//               kvarh1: Number(payload.kvarh1 ?? 0),
//               kvarh2: Number(payload.kvarh2 ?? 0),
//               kvarh3: Number(payload.kvarh3 ?? 0),
//             })
//             formattedCurrent.push({
//               timestamp: time,
//               i1: Number(payload.i1 ?? 0),
//               i2: Number(payload.i2 ?? 0),
//               i3: Number(payload.i3 ?? 0),
//             })
//             formattedPowFactor.push({
//               timestamp: time,
//               PF1: Number(payload.PF1 ?? 0),
//               PF2: Number(payload.PF2 ?? 0),
//               PF3: Number(payload.PF3 ?? 0),
//             })
//           })
//           setChartData((prev) => ({
//             ...prev,
//             phaseWiseVoltage: formattedVoltage,
//             kvah: formattedKvah,
//             frequency: formattedFrequency,
//             bar: formattedBar,
//             lineWiseVoltage: formattedLine,
//             activePower: formattedActPow,
//             reactivePower: formattedRePow,
//             apparentPower: formattedAppPow,
//             kwh: formattedKwh,
//             kvarh: formattedKvarh,
//             current: formattedCurrent,
//             powerFactor: formattedPowFactor,
//           }))

//           console.log(" Loaded initial 6 history points")
//         }
//       } catch (err) {
//         console.error(" Error fetching initial data:", err)
//       }
//     }
//     connection.off("ReceiveVoltageData") // 👈 clear before re-attaching
//     const listenForLiveData = () => {
//       connection.on("ReceiveVoltageData", (data: any) => {
//         if (!isMounted) return
//         const payload = Array.isArray(data) ? data[0] : data
//         if (!payload) {
//           console.warn(" No data received:", payload)
//           return
//         }
//         const time = payload.timestamp
//           ? new Date(payload.timestamp).toLocaleTimeString("en-GB", {
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit",
//             })
//           : new Date().toLocaleTimeString("en-GB")
//         const newVoltage: PhaseWiseVoltageDataPoint = {
//           timestamp: time,
//           v1: Number(payload.v1 ?? 0),
//           v2: Number(payload.v2 ?? 0),
//           v3: Number(payload.v3 ?? 0),
//         }
//         const newKvah: KvahEnergyDataPoint = {
//           timestamp: time,
//           kVAh1: Number(payload.kVAh1 ?? 0),
//           kVAh2: Number(payload.kVAh2 ?? 0),
//           kVAh3: Number(payload.kVAh3 ?? 0),
//         }
//         const newFrequency: FrequencyDataPoint = {
//           timestamp: time,
//           frequency1: Number(payload.frequency1 ?? 0),
//         }
//         const newBar: BarChartData = {
//           timestamp: time,
//           total_net_kWh_Export: Number(payload.total_net_kWh_Export ?? 0),
//           thD_I: Number(payload.thD_I ?? 0),
//           thD_V: Number(payload.thD_V ?? 0),
//         }
//         const newLine: LineWiseVoltageDataPoint = {
//           timestamp: time,
//           v12: Number(payload.v12 ?? 0),
//           v23: Number(payload.v23 ?? 0),
//           v31: Number(payload.v31 ?? 0),
//         }
//         const newActPow: ActivePowerDataPoint = {
//           timestamp: time,
//           kW1: Number(payload.kW1 ?? 0),
//           kW2: Number(payload.kW2 ?? 0),
//           kW3: Number(payload.kW3 ?? 0),
//         }
//         const newRePow: ReactivePowerDataPoint = {
//           timestamp: time,
//           kVAr1: Number(payload.kVAr1 ?? 0),
//           kVAr2: Number(payload.kVAr2 ?? 0),
//           kVAr3: Number(payload.kVAr3 ?? 0),
//         }
//         const newAppPow: ApparentPowerDataPoint = {
//           timestamp: time,
//           kVA1: Number(payload.kVA1 ?? 0),
//           kVA2: Number(payload.kVA2 ?? 0),
//           kVA3: Number(payload.kVA3 ?? 0),
//         }
//         const newKwh: KwhEnergyDataPoint = {
//           timestamp: time,
//           kWh1: Number(payload.kWh1 ?? 0),
//           kWh2: Number(payload.kWh2 ?? 0),
//           kWh3: Number(payload.kWh3 ?? 0),
//         }
//         const newKvarh: KvarhEnergyDataPoint = {
//           timestamp: time,
//           kvarh1: Number(payload.kvarh1 ?? 0),
//           kvarh2: Number(payload.kvarh2 ?? 0),
//           kvarh3: Number(payload.kvarh3 ?? 0),
//         }
//         const newCurrent: CurrentDataPoint = {
//           timestamp: time,
//           i1: Number(payload.i1 ?? 0),
//           i2: Number(payload.i2 ?? 0),
//           i3: Number(payload.i3 ?? 0),
//         }
//         const newPowFactor: PowerFactorDataPoint = {
//           timestamp: time,
//           PF1: Number(payload.PF1 ?? 10),
//           PF2: Number(payload.PF2 ?? 5),
//           PF3: Number(payload.PF3 ?? 3),
//         }
//         console.group(`[${new Date().toISOString()}] 📊 Incoming Data`)
//         console.table({
//           Voltage: newVoltage,
//           Kvah: newKvah,
//           Frequency: newFrequency,
//           Bar: newBar,
//           Line: newLine,
//           ActivePower: newActPow,
//           ReactivePower: newRePow,
//           ApparentPower: newAppPow,
//           Kwh: newKwh,
//           Kvarh: newKvarh,
//           Current: newCurrent,
//           PowerFactor: newPowFactor,
//         })
//         console.groupEnd()

//         setChartData((prev) => ({
//           phaseWiseVoltage: [...prev.phaseWiseVoltage.slice(-6), newVoltage],
//           kvah: [...prev.kvah.slice(-6), newKvah],
//           frequency: [...prev.frequency.slice(-6), newFrequency],
//           bar: [...prev.bar.slice(-6), newBar],
//           lineWiseVoltage: [...prev.lineWiseVoltage.slice(-6), newLine],
//           activePower: [...prev.activePower.slice(-6), newActPow],
//           reactivePower: [...prev.reactivePower.slice(-6), newRePow],
//           apparentPower: [...prev.apparentPower.slice(-6), newAppPow],
//           kwh: [...prev.kwh.slice(-6), newKwh],
//           kvarh: [...prev.kvarh.slice(-6), newKvarh],
//           current: [...prev.current.slice(-6), newCurrent],
//           powerFactor: [...prev.powerFactor.slice(-6), newPowFactor],
//         }))

//         lastLiveTsRef.current = Date.now()
//         setServerDown(false)
//       })
//     }
//     fetchInitialData().then(listenForLiveData)

//     heartbeat = setInterval(() => {
//       if (
//         !lastLiveTsRef.current ||
//         Date.now() - lastLiveTsRef.current > SERVER_TIMEOUT
//       ) {
//         setServerDown(true)

//         // Reset all chart data in ONE call
//         setChartData({
//           phaseWiseVoltage: [],
//           kvah: [],
//           frequency: [],
//           bar: [],
//           lineWiseVoltage: [],
//           activePower: [],
//           reactivePower: [],
//           apparentPower: [],
//           kwh: [],
//           kvarh: [],
//           current: [],
//           powerFactor: [],
//         })
//       }
//     }, HEARTBEAT_INTERVAL)

//     return () => {
//       isMounted = false
//       clearInterval(heartbeat) // add this
//       if (connection.state !== signalR.HubConnectionState.Disconnected) {
//         connection.off("ReceiveVoltageData")
//         connection.stop().then(() => {
//           console.log("SignalR connection stopped.")
//         })
//       }
//     }
//   }, [])
//   const handleChartClick = (chartId: string) => {
//     if (!id || !plantName) {
//       console.error("ID or Plant Name not found for navigation.")
//       return
//     }
//     navigate(
//       `/plantPerformanceUtilities/${plantName}/${lineName}/generator/${id}/monitoring/${chartId}`,
//     )
//   }
//   return (
//     <div className="space-y-4">
//       {serverDown ? (
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="text-red-600 text-2xl font-bold mb-4">
//               🚨 Service is not live
//             </div>
//             <p className="text-gray-600">
//               Waiting for live data from server...
//             </p>
//           </div>
//         </div>
//       ) : (
//         <>
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
//                   className="cursor-pointer transition-transform hover:scale-[1.01]"
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
// export default GenMonitoring

// 2nd Type Graph Handle Past data in freeze when server down

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
// import * as signalR from "@microsoft/signalr"
// import { useEffect, useRef, useState } from "react"
// import { createSignalRConnection } from "@/utils/signalr"
// import SingleBarChart from "@/components/PlantPerformance/Chart/SingleBarChart"
// import { useParams, useNavigate } from "react-router-dom"
// import GenericChart from "@/components/PlantPerformance/Chart/GenericChart"
// import ChartCard from "@/components/PlantPerformance/Chart/ChartCard"

// //  Use generic connection creator
// const connection = createSignalRConnection("/allvghub")

// const GenMonitoring = () => {
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

//   const { id, plantName } = useParams()
//   const navigate = useNavigate()
//   const [serverDown, setServerDown] = useState(false)
//   const HEARTBEAT_INTERVAL = 5000
//   const SERVER_TIMEOUT = 6000
//   const lastLiveTsRef = useRef<number | null>(null)

//   const charts = getBarChartConfigs(chartData.bar)

//   useEffect(() => {
//     let isMounted = true
//     let heartbeat: NodeJS.Timeout

//     const fetchInitialData = async () => {
//       try {
//         if (connection.state !== signalR.HubConnectionState.Connected) {
//           try {
//             await connection.start()
//             console.log("✅ Connected to SignalR")
//           } catch (err) {
//             console.error("SignalR connection failed:", err)
//             setServerDown(true)
//             return
//           }
//         }

//         // Fetch last 6 data points
//         const history = await connection.invoke("GetPastData")
//         if (isMounted && Array.isArray(history)) {
//           // format all data
//           const formattedVoltage: PhaseWiseVoltageDataPoint[] = []
//           const formattedLine: LineWiseVoltageDataPoint[] = []
//           const formattedKvah: KvahEnergyDataPoint[] = []
//           const formattedFrequency: FrequencyDataPoint[] = []
//           const formattedBar: BarChartData[] = []
//           const formattedActPow: ActivePowerDataPoint[] = []
//           const formattedRePow: ReactivePowerDataPoint[] = []
//           const formattedAppPow: ApparentPowerDataPoint[] = []
//           const formattedKwh: KwhEnergyDataPoint[] = []
//           const formattedKvarh: KvarhEnergyDataPoint[] = []
//           const formattedCurrent: CurrentDataPoint[] = []
//           const formattedPowFactor: PowerFactorDataPoint[] = []

//           history.forEach((payload: any) => {
//             const time = payload.timestamp
//               ? new Date(payload.timestamp).toLocaleTimeString("en-GB", {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   second: "2-digit",
//                 })
//               : new Date().toLocaleTimeString("en-GB")

//             formattedVoltage.push({
//               timestamp: time,
//               v1: Number(payload.v1 ?? 0),
//               v2: Number(payload.v2 ?? 0),
//               v3: Number(payload.v3 ?? 0),
//             })
//             formattedKvah.push({
//               timestamp: time,
//               kVAh1: Number(payload.kVAh1 ?? 0),
//               kVAh2: Number(payload.kVAh2 ?? 0),
//               kVAh3: Number(payload.kVAh3 ?? 0),
//             })
//             formattedFrequency.push({
//               timestamp: time,
//               frequency1: Number(payload.frequency1 ?? 0),
//             })
//             formattedBar.push({
//               timestamp: time,
//               total_net_kWh_Export: Number(payload.total_net_kWh_Export ?? 0),
//               thD_I: Number(payload.thD_I ?? 0),
//               thD_V: Number(payload.thD_V ?? 0),
//             })
//             formattedLine.push({
//               timestamp: time,
//               v12: Number(payload.v12 ?? 0),
//               v23: Number(payload.v23 ?? 0),
//               v31: Number(payload.v31 ?? 0),
//             })
//             formattedActPow.push({
//               timestamp: time,
//               kW1: Number(payload.kW1 ?? 0),
//               kW2: Number(payload.kW2 ?? 0),
//               kW3: Number(payload.kW3 ?? 0),
//             })
//             formattedRePow.push({
//               timestamp: time,
//               kVAr1: Number(payload.kVAr1 ?? 0),
//               kVAr2: Number(payload.kVAr2 ?? 0),
//               kVAr3: Number(payload.kVAr3 ?? 0),
//             })
//             formattedAppPow.push({
//               timestamp: time,
//               kVA1: Number(payload.kVA1 ?? 0),
//               kVA2: Number(payload.kVA2 ?? 0),
//               kVA3: Number(payload.kVA3 ?? 0),
//             })
//             formattedKwh.push({
//               timestamp: time,
//               kWh1: Number(payload.kWh1 ?? 0),
//               kWh2: Number(payload.kWh2 ?? 0),
//               kWh3: Number(payload.kWh3 ?? 0),
//             })
//             formattedKvarh.push({
//               timestamp: time,
//               kvarh1: Number(payload.kvarh1 ?? 0),
//               kvarh2: Number(payload.kvarh2 ?? 0),
//               kvarh3: Number(payload.kvarh3 ?? 0),
//             })
//             formattedCurrent.push({
//               timestamp: time,
//               i1: Number(payload.i1 ?? 0),
//               i2: Number(payload.i2 ?? 0),
//               i3: Number(payload.i3 ?? 0),
//             })
//             formattedPowFactor.push({
//               timestamp: time,
//               PF1: Number(payload.PF1 ?? 0),
//               PF2: Number(payload.PF2 ?? 0),
//               PF3: Number(payload.PF3 ?? 0),
//             })
//           })

//           setChartData({
//             phaseWiseVoltage: formattedVoltage,
//             kvah: formattedKvah,
//             frequency: formattedFrequency,
//             bar: formattedBar,
//             lineWiseVoltage: formattedLine,
//             activePower: formattedActPow,
//             reactivePower: formattedRePow,
//             apparentPower: formattedAppPow,
//             kwh: formattedKwh,
//             kvarh: formattedKvarh,
//             current: formattedCurrent,
//             powerFactor: formattedPowFactor,
//           })

//           console.log("📊 Loaded initial 6 history points")
//         }
//       } catch (err) {
//         console.error("Error fetching initial data:", err)
//       }
//     }

//     connection.off("ReceiveVoltageData")
//     const listenForLiveData = () => {
//       connection.on("ReceiveVoltageData", (data: any) => {
//         if (!isMounted) return
//         const payload = Array.isArray(data) ? data[0] : data
//         if (!payload) return

//         const time = payload.timestamp
//           ? new Date(payload.timestamp).toLocaleTimeString("en-GB", {
//               hour: "2-digit",
//               minute: "2-digit",
//               second: "2-digit",
//             })
//           : new Date().toLocaleTimeString("en-GB")

//         // format new points
//         const newVoltage: PhaseWiseVoltageDataPoint = {
//           timestamp: time,
//           v1: Number(payload.v1 ?? 0),
//           v2: Number(payload.v2 ?? 0),
//           v3: Number(payload.v3 ?? 0),
//         }
//         const newKvah: KvahEnergyDataPoint = {
//           timestamp: time,
//           kVAh1: Number(payload.kVAh1 ?? 0),
//           kVAh2: Number(payload.kVAh2 ?? 0),
//           kVAh3: Number(payload.kVAh3 ?? 0),
//         }
//         const newFrequency: FrequencyDataPoint = {
//           timestamp: time,
//           frequency1: Number(payload.frequency1 ?? 0),
//         }
//         const newBar: BarChartData = {
//           timestamp: time,
//           total_net_kWh_Export: Number(payload.total_net_kWh_Export ?? 0),
//           thD_I: Number(payload.thD_I ?? 0),
//           thD_V: Number(payload.thD_V ?? 0),
//         }
//         const newLine: LineWiseVoltageDataPoint = {
//           timestamp: time,
//           v12: Number(payload.v12 ?? 0),
//           v23: Number(payload.v23 ?? 0),
//           v31: Number(payload.v31 ?? 0),
//         }
//         const newActPow: ActivePowerDataPoint = {
//           timestamp: time,
//           kW1: Number(payload.kW1 ?? 0),
//           kW2: Number(payload.kW2 ?? 0),
//           kW3: Number(payload.kW3 ?? 0),
//         }
//         const newRePow: ReactivePowerDataPoint = {
//           timestamp: time,
//           kVAr1: Number(payload.kVAr1 ?? 0),
//           kVAr2: Number(payload.kVAr2 ?? 0),
//           kVAr3: Number(payload.kVAr3 ?? 0),
//         }
//         const newAppPow: ApparentPowerDataPoint = {
//           timestamp: time,
//           kVA1: Number(payload.kVA1 ?? 0),
//           kVA2: Number(payload.kVA2 ?? 0),
//           kVA3: Number(payload.kVA3 ?? 0),
//         }
//         const newKwh: KwhEnergyDataPoint = {
//           timestamp: time,
//           kWh1: Number(payload.kWh1 ?? 0),
//           kWh2: Number(payload.kWh2 ?? 0),
//           kWh3: Number(payload.kWh3 ?? 0),
//         }
//         const newKvarh: KvarhEnergyDataPoint = {
//           timestamp: time,
//           kvarh1: Number(payload.kvarh1 ?? 0),
//           kvarh2: Number(payload.kvarh2 ?? 0),
//           kvarh3: Number(payload.kvarh3 ?? 0),
//         }
//         const newCurrent: CurrentDataPoint = {
//           timestamp: time,
//           i1: Number(payload.i1 ?? 0),
//           i2: Number(payload.i2 ?? 0),
//           i3: Number(payload.i3 ?? 0),
//         }
//         const newPowFactor: PowerFactorDataPoint = {
//           timestamp: time,
//           PF1: Number(payload.PF1 ?? 0),
//           PF2: Number(payload.PF2 ?? 0),
//           PF3: Number(payload.PF3 ?? 0),
//         }

//         setChartData((prev) => ({
//           phaseWiseVoltage: [...prev.phaseWiseVoltage.slice(-6), newVoltage],
//           kvah: [...prev.kvah.slice(-6), newKvah],
//           frequency: [...prev.frequency.slice(-6), newFrequency],
//           bar: [...prev.bar.slice(-6), newBar],
//           lineWiseVoltage: [...prev.lineWiseVoltage.slice(-6), newLine],
//           activePower: [...prev.activePower.slice(-6), newActPow],
//           reactivePower: [...prev.reactivePower.slice(-6), newRePow],
//           apparentPower: [...prev.apparentPower.slice(-6), newAppPow],
//           kwh: [...prev.kwh.slice(-6), newKwh],
//           kvarh: [...prev.kvarh.slice(-6), newKvarh],
//           current: [...prev.current.slice(-6), newCurrent],
//           powerFactor: [...prev.powerFactor.slice(-6), newPowFactor],
//         }))

//         lastLiveTsRef.current = Date.now()
//         setServerDown(false)
//       })
//     }

//     fetchInitialData().then(listenForLiveData)

//     heartbeat = setInterval(() => {
//       if (
//         !lastLiveTsRef.current ||
//         Date.now() - lastLiveTsRef.current > SERVER_TIMEOUT
//       ) {
//         setServerDown(true)
//         // setChartData({
//         //   phaseWiseVoltage: [],
//         //   kvah: [],
//         //   frequency: [],
//         //   bar: [],
//         //   lineWiseVoltage: [],
//         //   activePower: [],
//         //   reactivePower: [],
//         //   apparentPower: [],
//         //   kwh: [],
//         //   kvarh: [],
//         //   current: [],
//         //   powerFactor: [],
//         // })
//       }
//     }, HEARTBEAT_INTERVAL)

//     return () => {
//       isMounted = false
//       clearInterval(heartbeat)
//       if (connection.state !== signalR.HubConnectionState.Disconnected) {
//         connection.off("ReceiveVoltageData")
//         connection.stop().then(() => console.log("SignalR stopped."))
//       }
//     }
//   }, [])

//   const handleChartClick = (chartId: string) => {
//     if (!id || !plantName) {
//       console.error("Missing ID or Plant Name")
//       return
//     }
//     navigate(
//       `/plantPerformanceUtilities/${plantName}/generator/${id}/monitoring/${chartId}`,
//     )
//   }

//   //
//   return (
//     <div className="space-y-4 p-4 bg-neutral min-h-screen">
//       {/* Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {charts.map((chart) => (
//           <ChartCard
//             key={chart.id}
//             title={chart.label}
//             onClick={() => handleChartClick(chart.id)}
//           >
//             <div className="relative">
//               <div
//                 className={serverDown ? "opacity-50 pointer-events-none" : ""}
//               >
//                 <SingleBarChart chart={chart} />
//               </div>
//               {serverDown && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-xl">
//                   <span className="text-yellow-300 font-semibold">
//                     ⚠️ Server unstable – showing last known data
//                   </span>
//                 </div>
//               )}
//             </div>
//           </ChartCard>
//         ))}
//       </div>

//       {/* Voltage */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <ChartCard
//           title="Phase Wise Voltage"
//           onClick={() => handleChartClick("phaseWiseVoltage")}
//         >
//           <div className="relative">
//             <div className={serverDown ? "opacity-50 pointer-events-none" : ""}>
//               {phaseWiseVoltageChartConfig.map((config) => (
//                 <GenericChart
//                   key={config.id}
//                   config={config}
//                   data={chartData.phaseWiseVoltage}
//                   thresholds={phaseWiseVoltageThresholds}
//                   timePeriod="live"
//                 />
//               ))}
//             </div>
//             {serverDown && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-xl">
//                 <span className="text-yellow-300 font-semibold">
//                   ⚠️ Server unstable – showing last known data
//                 </span>
//               </div>
//             )}
//           </div>
//         </ChartCard>

//         <ChartCard
//           title="Line Wise Voltage"
//           onClick={() => handleChartClick("lineWiseVoltage")}
//         >
//           <div className="relative">
//             <div className={serverDown ? "opacity-50 pointer-events-none" : ""}>
//               {lineWiseVoltageChartConfig.map((config) => (
//                 <GenericChart
//                   key={config.id}
//                   config={config}
//                   data={chartData.lineWiseVoltage}
//                   thresholds={lineWiseVoltageThresholds}
//                   timePeriod="live"
//                 />
//               ))}
//             </div>
//             {serverDown && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-xl">
//                 <span className="text-yellow-300 font-semibold">
//                   ⚠️ Server unstable – showing last known data
//                 </span>
//               </div>
//             )}
//           </div>
//         </ChartCard>
//       </div>

//       {/* Power */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {[
//           {
//             title: "Active Power",
//             config: activePowerChartConfig,
//             data: chartData.activePower,
//             thresholds: activePowerThresholds,
//             id: "activePower",
//           },
//           {
//             title: "Reactive Power",
//             config: reactivePowerChartConfig,
//             data: chartData.reactivePower,
//             thresholds: reactivePowerThresholds,
//             id: "reactivePower",
//           },
//           {
//             title: "Apparent Power",
//             config: apparentPowerChartConfig,
//             data: chartData.apparentPower,
//             thresholds: apparentPowerThresholds,
//             id: "apparentPower",
//           },
//         ].map(({ title, config, data, thresholds, id }) => (
//           <ChartCard
//             key={id}
//             title={title}
//             onClick={() => handleChartClick(id)}
//           >
//             <div className="relative">
//               <div
//                 className={serverDown ? "opacity-50 pointer-events-none" : ""}
//               >
//                 {config.map((c) => (
//                   <GenericChart
//                     key={c.id}
//                     config={c}
//                     data={data}
//                     thresholds={thresholds}
//                     timePeriod="live"
//                   />
//                 ))}
//               </div>
//               {serverDown && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-xl">
//                   <span className="text-yellow-300 font-semibold">
//                     ⚠️ Server unstable – showing last known data
//                   </span>
//                 </div>
//               )}
//             </div>
//           </ChartCard>
//         ))}
//       </div>

//       {/* Energy */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {[
//           {
//             title: "kWh Energy",
//             config: kwhEnergyChartConfig,
//             data: chartData.kwh,
//             thresholds: kwhEnergyThresholds,
//             id: "kwhEnergy",
//           },
//           {
//             title: "kVArh Energy",
//             config: kvarhEnergyChartConfig,
//             data: chartData.kvarh,
//             thresholds: kVarhEnergyThresholds,
//             id: "kvarhEnergy",
//           },
//           {
//             title: "kVAh Energy",
//             config: kvahEnergyChartConfig,
//             data: chartData.kvah,
//             thresholds: kVahEnergyThresholds,
//             id: "kvahEnergy",
//           },
//         ].map(({ title, config, data, thresholds, id }) => (
//           <ChartCard
//             key={id}
//             title={title}
//             onClick={() => handleChartClick(id)}
//           >
//             <div className="relative">
//               <div
//                 className={serverDown ? "opacity-50 pointer-events-none" : ""}
//               >
//                 {config.map((c) => (
//                   <GenericChart
//                     key={c.id}
//                     config={c}
//                     data={data}
//                     thresholds={thresholds}
//                     timePeriod="live"
//                   />
//                 ))}
//               </div>
//               {serverDown && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-xl">
//                   <span className="text-yellow-300 font-semibold">
//                     ⚠️ Server unstable – showing last known data
//                   </span>
//                 </div>
//               )}
//             </div>
//           </ChartCard>
//         ))}
//       </div>

//       {/* Current, PF, Frequency */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {[
//           {
//             title: "Current",
//             config: currentChartConfig,
//             data: chartData.current,
//             thresholds: currentThresholds,
//             id: "current",
//           },
//           {
//             title: "Power Factor",
//             config: powerFactorChartConfig,
//             data: chartData.powerFactor,
//             thresholds: powerFactorThresholds,
//             id: "powerFactor",
//           },
//           {
//             title: "Frequency",
//             config: frequencyChartConfig,
//             data: chartData.frequency,
//             thresholds: frequencyThresholds,
//             id: "frequency",
//           },
//         ].map(({ title, config, data, thresholds, id }) => (
//           <ChartCard
//             key={id}
//             title={title}
//             onClick={() => handleChartClick(id)}
//           >
//             <div className="relative">
//               <div
//                 className={serverDown ? "opacity-50 pointer-events-none" : ""}
//               >
//                 {config.map((c) => (
//                   <GenericChart
//                     key={c.id}
//                     config={c}
//                     data={data}
//                     thresholds={thresholds}
//                     timePeriod="live"
//                   />
//                 ))}
//               </div>
//               {serverDown && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-xl">
//                   <span className="text-yellow-300 font-semibold">
//                     ⚠️ Server unstable – showing last known data
//                   </span>
//                 </div>
//               )}
//             </div>
//           </ChartCard>
//         ))}
//       </div>
//     </div>
//   )
// }
// export default GenMonitoring
