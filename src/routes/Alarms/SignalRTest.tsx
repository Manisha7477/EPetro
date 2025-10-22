import React, { useEffect, useRef, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { HubConnection, HubConnectionState } from "@microsoft/signalr"
import { createSignalRConnection } from "@/utils/signalr"

interface VoltageData {
  timestamp: string
  v1: number
  v2: number
  v3: number
}

type Props = {
  genId: number
}

const SignalRTest: React.FC<Props> = ({ genId }) => {
  const [chartData, setChartData] = useState<VoltageData[]>([])
  const [serverDown, setServerDown] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const connectionRef = useRef<HubConnection | null>(null)
  const lastLiveTsRef = useRef<number | null>(null)

  const HEARTBEAT_INTERVAL = 5000
  const SERVER_TIMEOUT = 6000

  useEffect(() => {
    const abortController = new AbortController()
    let heartbeat: NodeJS.Timeout

    const initConnection = async () => {
      if (!connectionRef.current) {
        connectionRef.current = createSignalRConnection("/GeneratorHub")
      }

      const connection = connectionRef.current

      if (
        connection.state === HubConnectionState.Connected ||
        connection.state === HubConnectionState.Connecting
      ) {
        console.warn("Already connected or connecting. Skipping start.")
        return
      }

      try {
        await connection.start()
        console.log("✅ Connected to SignalR hub:", connection.connectionId)

        // --- STEP 1: Join generator group
        await connection.invoke("JoinGeneratorGroup", genId)
        console.log(`✅ Joined generator group ${genId}`)

        // --- STEP 2: Fetch history AFTER group join
        try {
          const pastData: VoltageData[] = await connection.invoke(
            "GetPastData",
            genId,
          )

          if (!abortController.signal.aborted && Array.isArray(pastData)) {
            const formatted = pastData.map((d) => ({
              ...d,
              timestamp: new Date(d.timestamp).toLocaleTimeString(),
            }))
            setChartData(formatted)
            console.log("[PAST DATA]", formatted)
          }
        } catch (err) {
          if (!abortController.signal.aborted) {
            console.error("❌ Error fetching history:", err)
            setErrorMsg("Failed to load past data")
          }
        }

        // --- STEP 3: Listen for live updates
        connection.off("ReceiveGeneratorData")
        connection.on("ReceiveGeneratorData", (data: any) => {
          if (abortController.signal.aborted || !data?.timestamp) {
            console.warn("⚠️ Invalid or ignored live data:", data)
            return
          }

          const formatted = {
            timestamp: new Date(data.timestamp).toLocaleTimeString(),
            v1: data.v1,
            v2: data.v2,
            v3: data.v3,
          }

          setChartData((prev) => [...prev.slice(-6), formatted]) // keep last 20 points
          lastLiveTsRef.current = Date.now()
          setServerDown(false)
        })

        // --- STEP 4: Heartbeat check
        heartbeat = setInterval(() => {
          if (
            !lastLiveTsRef.current ||
            Date.now() - lastLiveTsRef.current > SERVER_TIMEOUT
          ) {
            setServerDown(true)
            setChartData([])
          }
        }, HEARTBEAT_INTERVAL)
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("❌ SignalR connection failed:", err)
          setErrorMsg("Connection failed")
          setServerDown(true)
        }
      }
    }

    initConnection()

    return () => {
      abortController.abort()
      clearInterval(heartbeat)
      if (connectionRef.current) {
        connectionRef.current.off("ReceiveGeneratorData")
        connectionRef.current.stop()
      }
    }
  }, [genId])

  return (
    <div className="sm:ml-10 xl:ml-0 min-w-[80vw]">
      <div className="border rounded border-base-300">
        <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
          Voltage Graph - Gen {genId}
        </div>
        <h2 className="text-xl font-semibold mb-4">Live Voltage Chart</h2>

        {errorMsg ? (
          <div className="text-red-600 font-bold text-center py-10">
            🚨 {errorMsg}
          </div>
        ) : serverDown ? (
          <div className="text-red-600 font-bold text-center py-10">
            🚨 Server is shut / no live data coming
          </div>
        ) : (
          <ResponsiveContainer width="90%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="v1" stroke="#8884d8" name="V1" />
              <Line type="monotone" dataKey="v2" stroke="#82ca9d" name="V2" />
              <Line type="monotone" dataKey="v3" stroke="#ff7300" name="V3" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default SignalRTest

// import React, { useEffect, useRef, useState } from "react"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
// import { HubConnection, HubConnectionState } from "@microsoft/signalr"
// import { createSignalRConnection } from "@/utils/signalr"

// interface VoltageData {
//   timestamp: string
//   v1: number
//   v2: number
//   v3: number
// }

// type Props = {
//   genId: number
// }

// const SignalRTest: React.FC<Props> = ({ genId }) => {
//   const [chartData, setChartData] = useState<VoltageData[]>([])
//   const [serverDown, setServerDown] = useState(false)
//   const [errorMsg, setErrorMsg] = useState<string | null>(null)

//   const connectionRef = useRef<HubConnection | null>(null)
//   const lastLiveTsRef = useRef<number | null>(null)

//   const HEARTBEAT_INTERVAL = 5000
//   const SERVER_TIMEOUT = 6000

//   useEffect(() => {
//     let isMounted = true
//     let heartbeat: NodeJS.Timeout

//     const initConnection = async () => {
//       if (!connectionRef.current) {
//         connectionRef.current = createSignalRConnection("/GeneratorHub")
//       }

//       const connection = connectionRef.current

//       if (
//         connection.state === HubConnectionState.Connected ||
//         connection.state === HubConnectionState.Connecting
//       ) {
//         console.warn("Already connected or connecting. Skipping start.")
//         return
//       }

//       try {
//         await connection.start()
//         console.log("✅ Connected to SignalR hub:", connection.connectionId)

//         // --- STEP 1: Join generator group
//         try {
//           await connection.invoke("JoinGeneratorGroup", genId)
//           console.log(`✅ Joined generator group ${genId}`)

//           // --- STEP 2: Fetch history AFTER group join
//           try {
//             const pastData: VoltageData[] = await connection.invoke(
//               "GetPastData",
//               genId,
//             )
//             if (isMounted && Array.isArray(pastData)) {
//               const formatted = pastData.map((d) => ({
//                 ...d,
//                 timestamp: new Date(d.timestamp).toLocaleTimeString(),
//               }))
//               setChartData(formatted)
//               console.log("[PAST DATA]", formatted)
//             }
//           } catch (err) {
//             console.error("❌ Error fetching history:", err)
//             setErrorMsg("Failed to load past data")
//           }
//         } catch (err) {
//           console.error("❌ Failed to join generator group:", err)
//           setErrorMsg("Failed to join generator group")
//         }

//         // --- STEP 3: Listen for live updates (correct event name)
//         connection.off("ReceiveGeneratorData") // clear old handlers
//         connection.on("ReceiveGeneratorData", (data: any) => {
//           if (!isMounted || !data?.timestamp) {
//             console.warn("⚠️ Invalid live data:", data)
//             return
//           }

//           const formatted = {
//             timestamp: new Date(data.timestamp).toLocaleTimeString(),
//             v1: data.v1,
//             v2: data.v2,
//             v3: data.v3,
//           }

//           setChartData((prev) => [...prev.slice(-6), formatted])
//           lastLiveTsRef.current = Date.now()
//           setServerDown(false)
//         })

//         // --- STEP 4: Heartbeat check
//         heartbeat = setInterval(() => {
//           if (
//             !lastLiveTsRef.current ||
//             Date.now() - lastLiveTsRef.current > SERVER_TIMEOUT
//           ) {
//             setServerDown(true)
//             setChartData([])
//           }
//         }, HEARTBEAT_INTERVAL)
//       } catch (err) {
//         console.error("❌ SignalR connection failed:", err)
//         setErrorMsg("Connection failed")
//         setServerDown(true)
//       }
//     }

//     initConnection()

//     return () => {
//       isMounted = false
//       clearInterval(heartbeat)
//       if (connectionRef.current) {
//         connectionRef.current.off("ReceiveGeneratorData")
//         connectionRef.current.stop()
//       }
//     }
//   }, [genId])

//   return (
//     <div className="sm:ml-10 xl:ml-0 min-w-[80vw]">
//       <div className="border rounded border-base-300">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           Voltage Graph - Gen {genId}
//         </div>
//         <h2 className="text-xl font-semibold mb-4">Live Voltage Chart</h2>

//         {errorMsg ? (
//           <div className="text-red-600 font-bold text-center py-10">
//             🚨 {errorMsg}
//           </div>
//         ) : serverDown ? (
//           <div className="text-red-600 font-bold text-center py-10">
//             🚨 Server is shut / no live data coming
//           </div>
//         ) : (
//           <ResponsiveContainer width="90%" height={300}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="timestamp" />
//               <YAxis domain={["auto", "auto"]} />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="v1" stroke="#8884d8" name="V1" />
//               <Line type="monotone" dataKey="v2" stroke="#82ca9d" name="V2" />
//               <Line type="monotone" dataKey="v3" stroke="#ff7300" name="V3" />
//             </LineChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   )
// }

// export default SignalRTest

// import React, { useEffect, useRef, useState } from "react"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
// import * as signalR from "@microsoft/signalr"

// interface VoltageData {
//   timestamp: string
//   v1: number
//   v2: number
//   v3: number
// }

// // Create SignalR connection with WebSockets preferred
// const connection = new signalR.HubConnectionBuilder()
//   .withUrl("https://122.166.153.170:8078/GeneratorHub", {
//     transport: signalR.HttpTransportType.WebSockets,
//     skipNegotiation: true,
//   })
//   .withAutomaticReconnect()
//   .configureLogging(signalR.LogLevel.Information)
//   .build()

// const SignalRTest = () => {
//   const [chartData, setChartData] = useState<VoltageData[]>([])
//   const [serverDown, setServerDown] = useState(false) // NEW state
//   const HEARTBEAT_INTERVAL = 5000 // 5 seconds in ms
//   const SERVER_TIMEOUT = 6000 // 6 seconds in ms
//   const lastLiveTsRef = useRef<number | null>(null)
//   useEffect(() => {
//     let isMounted = true
//     let heartbeat: NodeJS.Timeout
//     const connectToHub = async () => {
//       if (
//         connection.state === signalR.HubConnectionState.Connected ||
//         connection.state === signalR.HubConnectionState.Connecting
//       ) {
//         console.warn("SignalR already connecting or connected. Skipping start.")
//         return
//       }

//       try {
//         console.log("Attempting to connect to SignalR...")
//         await connection.start()
//         console.log("SignalR connected:", connection.connectionId)

//         // Step 1: Request last 6 points from backend before listening live
//         try {
//           const history: VoltageData[] = await connection.invoke("GetPastData")
//           if (isMounted && Array.isArray(history)) {
//             const formattedHistory = history.map((d) => ({
//               ...d,
//               timestamp: new Date(d.timestamp).toLocaleTimeString(),
//             }))
//             setChartData(formattedHistory)
//             console.log("Initial 6 points loaded from hub:", formattedHistory)
//           }
//         } catch (err) {
//           console.error("Error fetching initial history from hub:", err)
//         }
//         connection.off("ReceiveVoltageData") // 👈 clear before re-attaching
//         // Step 2: Subscribe to new live data
//         connection.on("ReceiveVoltageData", (data: VoltageData | null) => {
//           if (
//             !isMounted ||
//             !data ||
//             !data.timestamp ||
//             data.v1 == null ||
//             data.v2 == null ||
//             data.v3 == null
//           ) {
//             console.warn("Invalid or incomplete voltage data received:", data)
//             return
//           }

//           const formatted = {
//             timestamp: new Date(data.timestamp).toLocaleTimeString(),
//             v1: data.v1,
//             v2: data.v2,
//             v3: data.v3,
//           }

//           // Keep only last 7 points
//           setChartData((prev) => [...prev.slice(-6), formatted])
//           // Mark live server as healthy
//           lastLiveTsRef.current = Date.now()
//           setServerDown(false)
//         })

//         //  3: Heartbeat check (every 5s)
//         heartbeat = setInterval(() => {
//           if (
//             !lastLiveTsRef.current || // never received live data
//             Date.now() - lastLiveTsRef.current > SERVER_TIMEOUT // >6 sec since last packet
//           ) {
//             setServerDown(true)
//             setChartData([]) // clear chart data so old points don’t freeze
//           }
//         }, HEARTBEAT_INTERVAL)
//       } catch (error) {
//         console.error("SignalR connection error:", error)
//         setServerDown(true)
//       }
//     }

//     connectToHub()

//     return () => {
//       isMounted = false
//       clearInterval(heartbeat) // 👈 add this
//       if (connection.state !== signalR.HubConnectionState.Disconnected) {
//         connection.off("ReceiveVoltageData")
//         connection.stop().then(() => {
//           console.log("SignalR connection stopped.")
//         })
//       }
//     }
//   }, [])

//   return (
//     <div className="sm:ml-10 xl:ml-0 min-w-[80vw]">
//       <div className="border rounded border-base-300">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           This is for SignalR - Test
//         </div>
//         <h2 className="text-xl font-semibold mb-4">Live Voltage Chart</h2>

//         {serverDown ? (
//           <div className="text-red-600 font-bold text-center py-10">
//             🚨 Server is shut / no live data coming
//           </div>
//         ) : (
//           <ResponsiveContainer width="90%" height={300}>
//             <LineChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="timestamp" />
//               <YAxis domain={[230, 240]} />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="v1" stroke="#8884d8" name="V1" />
//               <Line type="monotone" dataKey="v2" stroke="#82ca9d" name="V2" />
//               <Line type="monotone" dataKey="v3" stroke="#ff7300" name="V3" />
//             </LineChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   )
// }

// export default SignalRTest

// import React, { useEffect, useState } from "react"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
// import * as signalR from "@microsoft/signalr"

// interface VoltageData {
//   timestamp: string
//   v1: number
//   v2: number
//   v3: number
// }

// // Create SignalR connection with WebSockets preferred
// const connection = new signalR.HubConnectionBuilder()
//   .withUrl("https://122.166.153.170:8078/allvghub", {
//     transport: signalR.HttpTransportType.WebSockets,
//     skipNegotiation: true,
//   })
//   .withAutomaticReconnect()
//   .configureLogging(signalR.LogLevel.Information)
//   .build()

// const SignalRTest = () => {
//   const [chartData, setChartData] = useState<VoltageData[]>([])

//   useEffect(() => {
//     let isMounted = true

//     const connectToHub = async () => {
//       if (
//         connection.state === signalR.HubConnectionState.Connected ||
//         connection.state === signalR.HubConnectionState.Connecting
//       ) {
//         console.warn("SignalR already connecting or connected. Skipping start.")
//         return
//       }

//       try {
//         console.log("Attempting to connect to SignalR...")
//         await connection.start()
//         console.log("SignalR connected:", connection.connectionId)
//         // null , runtime error if not handled
//         connection.on("ReceiveVoltageData", (data: VoltageData | null) => {
//           if (
//             !isMounted ||
//             !data ||
//             !data.timestamp ||
//             data.v1 == null ||
//             data.v2 == null ||
//             data.v3 == null
//           ) {
//             console.warn("Invalid or incomplete voltage data received:", data)
//             return
//           }

//           console.log("Received Voltage Data:", data)

//           setChartData((prev) => [
//             ...prev.slice(-19),
//             {
//               timestamp: new Date(data.timestamp).toLocaleTimeString(),
//               v1: data.v1,
//               v2: data.v2,
//               v3: data.v3,
//             },
//           ])
//         })
//       } catch (error) {
//         console.error("SignalR connection error:", error)
//       }
//     }

//     connectToHub()

//     return () => {
//       isMounted = false
//       if (connection.state !== signalR.HubConnectionState.Disconnected) {
//         connection.off("ReceiveVoltageData")
//         connection.stop().then(() => {
//           console.log(" SignalR connection stopped.")
//         })
//       }
//     }
//   }, [])

//   return (
//     <div className="sm:ml-10 xl:ml-0 min-w-[80vw]">
//       <div className="border rounded border-base-300">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           SignalR - Test
//         </div>
//         <h2 className="text-xl font-semibold mb-4">Live Voltage Chart</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="timestamp" />
//             <YAxis domain={[230, 240]} />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="v1" stroke="#8884d8" name="V1" />
//             <Line type="monotone" dataKey="v2" stroke="#82ca9d" name="V2" />
//             <Line type="monotone" dataKey="v3" stroke="#ff7300" name="V3" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   )
// }

// export default SignalRTest
