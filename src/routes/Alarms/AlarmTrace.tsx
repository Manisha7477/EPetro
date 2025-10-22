import React, { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { PiFilePdf } from "react-icons/pi"
import { BsFiletypeXlsx } from "react-icons/bs"

// --------------------- Alarm type ---------------------
interface Alarm {
  id: string
  equipment: string
  type: string
  severity: "Low" | "Medium" | "High" | "Critical"
  message: string
  timestamp: string
  acknowledged: boolean
}

const severities: Alarm["severity"][] = ["Low", "Medium", "High", "Critical"]

// --------------------- Random alarm generator ---------------------
const randomAlarm = (): Alarm => {
  const equipments = [
    "Generator-01",
    "Chiller-02",
    "Boiler-01",
    "Compressor-03",
  ]
  const types = ["OverVoltage", "OverCurrent", "Temperature", "LowPressure"]
  return {
    id: Date.now().toString(),
    equipment: equipments[Math.floor(Math.random() * equipments.length)],
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    message: "Simulated alarm event from dummy trace",
    timestamp: new Date().toLocaleTimeString(),
    // acknowledged: Math.random() > 0.7,
    acknowledged: false,
  }
}

// --------------------- Alarm Trend Generators ---------------------
const getRandom = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-GB", { hour12: false })
const generateTrendPoint = () => ({
  time: formatTime(new Date()),
  Critical: getRandom(3, 12),
  High: getRandom(2, 10),
  Medium: getRandom(1, 8),
  Low: getRandom(0, 5),
})

// --------------------- Alarm Dashboard ---------------------
const AlarmTrace: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [filterSeverity, setFilterSeverity] = useState<
    Alarm["severity"] | "All"
  >("All")
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null)
  const [alarmTrendData, setAlarmTrendData] = useState(
    Array.from({ length: 6 }, () => generateTrendPoint()),
  )

  // Generate alarms and trend points every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlarm = randomAlarm()
      setAlarms((prev) => [newAlarm, ...prev].slice(0, 10))
      setAlarmTrendData((prev) => [...prev.slice(1), generateTrendPoint()])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Handlers
  const handleAcknowledge = (id: string) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, acknowledged: true } : alarm,
      ),
    )
  }

  const handleDelete = (id: string) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id))
  }

  // Filtered alarms
  const displayedAlarms =
    filterSeverity === "All"
      ? alarms
      : alarms.filter((alarm) => alarm.severity === filterSeverity)

  // Counts
  const counts = {
    Critical: alarms.filter((a) => a.severity === "Critical").length,
    High: alarms.filter((a) => a.severity === "High").length,
    Medium: alarms.filter((a) => a.severity === "Medium").length,
    Low: alarms.filter((a) => a.severity === "Low").length,
  }

  // ---------------- Export ----------------
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(alarms)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alarms")
    XLSX.writeFile(workbook, "alarm_trace.xlsx")
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    const tableColumn = [
      "Time",
      "Equipment",
      "Type",
      "Severity",
      "Message",
      "Acknowledged",
    ]
    const tableRows: string[][] = alarms.map((a) => [
      a.timestamp,
      a.equipment,
      a.type,
      a.severity,
      a.message,
      a.acknowledged ? "Yes" : "No",
    ])
    ;(doc as any).autoTable({ head: [tableColumn], body: tableRows })
    doc.save("alarm_trace.pdf")
  }
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold mb-4">🚨 Alarm Trends Dashboard</h1>

      {/* KPI + Trend */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* KPI */}
        <div className="flex flex-col gap-4 w-40 shrink-0">
          <div
            className={`p-4 rounded-lg shadow cursor-pointer text-center ${
              filterSeverity === "All"
                ? "bg-gray-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setFilterSeverity("All")}
          >
            <p className="font-semibold">All</p>
            <p className="text-2xl font-bold">{alarms.length}</p>
          </div>

          {(["Critical", "High", "Medium", "Low"] as const).map((sev) => (
            <div
              key={sev}
              className={`p-4 rounded-lg shadow cursor-pointer text-center ${
                filterSeverity === sev
                  ? "ring-2 ring-offset-1 ring-blue-500"
                  : sev === "Critical"
                  ? "bg-red-600 text-white"
                  : sev === "High"
                  ? "bg-orange-500 text-white"
                  : sev === "Medium"
                  ? "bg-yellow-400 text-black"
                  : "bg-green-600 text-white"
              }`}
              onClick={() =>
                setFilterSeverity(filterSeverity === sev ? "All" : sev)
              }
            >
              <p className="font-semibold">{sev}</p>
              <p className="text-2xl font-bold">{counts[sev]}</p>
            </div>
          ))}
        </div>

        {/* Trend */}
        <div className="flex-1 bg-white shadow rounded-lg p-4 flex flex-col min-h-[200px]">
          <h2 className="text-lg font-semibold mb-2">Severity Trend (Live)</h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alarmTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Critical"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="High"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Medium"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Low"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alarm Table */}
      <div className="bg-white shadow rounded-lg  max-h-[500px] overflow-y-auto relative">
        <h2 className="text-lg font-semibold mb-2 flex justify-between items-center sticky top-0 bg-white z-20 px-2 py-1">
          <span>Alarm Trace</span>
          {/* Export Buttons fixed to the right */}
          <div className="flex gap-3 items-center">
            <button
              onClick={exportToExcel}
              title="Download Excel"
              className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg shadow transition transform hover:scale-105"
            >
              <BsFiletypeXlsx className="w-6 h-6" />
            </button>

            <button
              onClick={exportToPDF}
              title="Download PDF"
              className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow transition transform hover:scale-105"
            >
              <PiFilePdf className="w-6 h-6" />
            </button>
          </div>
        </h2>

        <table className="table-auto w-full text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-[48px] z-10">
            <tr>
              <th className="px-2 py-1 text-left">Time</th>
              <th className="px-2 py-1 text-left">Equipment</th>
              <th className="px-2 py-1 text-left">Type</th>
              <th className="px-2 py-1 text-left">Severity</th>
              <th className="px-2 py-1 text-left">Message</th>
              <th className="px-2 py-1 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedAlarms.map((alarm) => (
              <tr
                key={alarm.id}
                className={`border-b cursor-pointer hover:bg-gray-200 ${
                  alarm.severity === "Critical"
                    ? "bg-red-100"
                    : alarm.severity === "High"
                    ? "bg-orange-100"
                    : alarm.severity === "Medium"
                    ? "bg-yellow-100"
                    : "bg-green-100"
                }`}
                onClick={() => setSelectedAlarm(alarm)}
              >
                <td className="px-2 py-1">{alarm.timestamp}</td>
                <td className="px-2 py-1">{alarm.equipment}</td>
                <td className="px-2 py-1">{alarm.type}</td>
                <td
                  className="px-2 py-1 font-semibold hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFilterSeverity(alarm.severity)
                  }}
                >
                  {alarm.severity}
                </td>
                <td className="px-2 py-1">{alarm.message}</td>
                <td className="px-2 py-1 flex gap-2">
                  {alarm.acknowledged ? (
                    <span>✅</span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAcknowledge(alarm.id)
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Ack
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(alarm.id)
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {displayedAlarms.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No alarms matching this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedAlarm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedAlarm(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gray-100 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Alarm Details
              </h2>
              <button
                onClick={() => setSelectedAlarm(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="px-6 py-4 flex-1 overflow-y-auto space-y-3 scroll-smooth">
              <p>
                <span className="font-semibold text-gray-700">Time:</span>{" "}
                <span className="text-gray-900">{selectedAlarm.timestamp}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Equipment:</span>{" "}
                <span className="text-gray-900">{selectedAlarm.equipment}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Type:</span>{" "}
                <span className="text-gray-900">{selectedAlarm.type}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Severity:</span>{" "}
                <span
                  className={`font-bold ${
                    selectedAlarm.severity === "Critical"
                      ? "text-red-600"
                      : selectedAlarm.severity === "High"
                      ? "text-orange-500"
                      : selectedAlarm.severity === "Medium"
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {selectedAlarm.severity}
                </span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">Message:</span>{" "}
                <span className="text-gray-900">{selectedAlarm.message}</span>
              </p>
              <p>
                <span className="font-semibold text-gray-700">
                  Acknowledged:
                </span>{" "}
                <span className="text-gray-900">
                  {selectedAlarm.acknowledged ? "Yes" : "No"}
                </span>
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t flex justify-end bg-gray-50">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                onClick={() => setSelectedAlarm(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlarmTrace

// import React, { useEffect, useState } from "react"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts"
// import * as XLSX from "xlsx"
// import jsPDF from "jspdf"
// import "jspdf-autotable"
// import KpiCard from "@/components/PlantPerformance/Cards/KpiCard"

// // --------------------- Alarm type ---------------------
// interface Alarm {
//   id: string
//   equipment: string
//   type: string
//   severity: "Low" | "Medium" | "High" | "Critical"
//   message: string
//   timestamp: string
//   acknowledged: boolean
// }

// const severities: Alarm["severity"][] = ["Low", "Medium", "High", "Critical"]

// // --------------------- Random alarm generator ---------------------
// const randomAlarm = (): Alarm => {
//   const equipments = [
//     "Generator-01",
//     "Chiller-02",
//     "Boiler-01",
//     "Compressor-03",
//   ]
//   const types = ["OverVoltage", "OverCurrent", "Temperature", "LowPressure"]
//   return {
//     id: Date.now().toString(),
//     equipment: equipments[Math.floor(Math.random() * equipments.length)],
//     type: types[Math.floor(Math.random() * types.length)],
//     severity: severities[Math.floor(Math.random() * severities.length)],
//     message: "Simulated alarm event from dummy trace",
//     timestamp: new Date().toLocaleTimeString(),
//     acknowledged: false,
//   }
// }

// // --------------------- Alarm Trend Generators ---------------------
// const getRandom = (min: number, max: number) =>
//   Math.floor(Math.random() * (max - min + 1)) + min
// const formatTime = (date: Date) =>
//   date.toLocaleTimeString("en-GB", { hour12: false })
// const generateTrendPoint = () => ({
//   time: formatTime(new Date()),
//   Critical: getRandom(3, 12),
//   High: getRandom(2, 10),
//   Medium: getRandom(1, 8),
//   Low: getRandom(0, 5),
// })

// // --------------------- Alarm Dashboard ---------------------
// const AlarmTrace: React.FC = () => {
//   const [alarms, setAlarms] = useState<Alarm[]>([])
//   const [filterSeverity, setFilterSeverity] = useState<
//     Alarm["severity"] | "All"
//   >("All")
//   const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null)
//   const [alarmTrendData, setAlarmTrendData] = useState(
//     Array.from({ length: 6 }, () => generateTrendPoint()),
//   )

//   // Generate alarms and trend points every 5s
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const newAlarm = randomAlarm()
//       setAlarms((prev) => [newAlarm, ...prev].slice(0, 14))
//       setAlarmTrendData((prev) => [...prev.slice(1), generateTrendPoint()])
//     }, 5000)
//     return () => clearInterval(interval)
//   }, [])

//   // Handlers
//   const handleAcknowledge = (id: string) => {
//     setAlarms((prev) =>
//       prev.map((alarm) =>
//         alarm.id === id ? { ...alarm, acknowledged: true } : alarm,
//       ),
//     )
//   }

//   const handleDelete = (id: string) => {
//     setAlarms((prev) => prev.filter((alarm) => alarm.id !== id))
//   }

//   // Filtered alarms
//   const displayedAlarms =
//     filterSeverity === "All"
//       ? alarms
//       : alarms.filter((alarm) => alarm.severity === filterSeverity)

//   // Counts
//   const counts = {
//     Critical: alarms.filter((a) => a.severity === "Critical").length,
//     High: alarms.filter((a) => a.severity === "High").length,
//     Medium: alarms.filter((a) => a.severity === "Medium").length,
//     Low: alarms.filter((a) => a.severity === "Low").length,
//   }

//   // ---------------- Export ----------------
//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(alarms)
//     const workbook = XLSX.utils.book_new()
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Alarms")
//     XLSX.writeFile(workbook, "alarm_trace.xlsx")
//   }

//   const exportToPDF = () => {
//     const doc = new jsPDF()
//     const tableColumn = [
//       "Time",
//       "Equipment",
//       "Type",
//       "Severity",
//       "Message",
//       "Acknowledged",
//     ]
//     const tableRows: string[][] = alarms.map((a) => [
//       a.timestamp,
//       a.equipment,
//       a.type,
//       a.severity,
//       a.message,
//       a.acknowledged ? "Yes" : "No",
//     ])
//     ;(doc as any).autoTable({ head: [tableColumn], body: tableRows })
//     doc.save("alarm_trace.pdf")
//   }

//   return (
//     <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6">
//       <h1 className="text-2xl font-bold mb-4">🚨 Alarm Trends Dashboard</h1>

//       {/* KPI + Trend Layout */}
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* KPI Section (Vertical Left) */}
//         <div className="flex flex-col gap-4 w-full lg:w-64 shrink-0">
//           <KpiCard
//             title="Critical Alarms"
//             kpivalue={counts.Critical.toString()}
//             subtitle="Immediate attention required"
//             icon={<span className="text-red-600 text-lg">⚠️</span>}
//             tooltip="Highest priority alarms"
//           />
//           <KpiCard
//             title="High Alarms"
//             kpivalue={counts.High.toString()}
//             subtitle="High severity alerts"
//             icon={<span className="text-orange-500 text-lg">🔥</span>}
//             tooltip="High severity — requires quick response"
//           />
//           <KpiCard
//             title="Medium Alarms"
//             kpivalue={counts.Medium.toString()}
//             subtitle="Monitor regularly"
//             icon={<span className="text-yellow-500 text-lg">⚡</span>}
//             tooltip="Medium severity alarms"
//           />
//           <KpiCard
//             title="Low Alarms"
//             kpivalue={counts.Low.toString()}
//             subtitle="Minor warnings"
//             icon={<span className="text-green-500 text-lg">🟢</span>}
//             tooltip="Low severity — informational"
//           />
//         </div>

//         {/* Trend Chart (Right Side) */}
//         <div className="flex-1 bg-white shadow rounded-lg p-4 flex flex-col min-h-[300px]">
//           <h2 className="text-lg font-semibold mb-2">Severity Trend (Live)</h2>
//           <div className="flex-1">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={alarmTrendData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="time" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="Critical"
//                   stroke="#dc2626"
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="High"
//                   stroke="#f97316"
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="Medium"
//                   stroke="#eab308"
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="Low"
//                   stroke="#22c55e"
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Export Buttons */}
//       <div className="flex gap-2">
//         <button
//           onClick={exportToExcel}
//           className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
//         >
//           Export Excel
//         </button>
//         <button
//           onClick={exportToPDF}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
//         >
//           Export PDF
//         </button>
//       </div>

//       {/* Alarm Table */}
//       <div className="bg-white shadow rounded-lg p-4 max-h-[500px] overflow-y-auto">
//         <h2 className="text-lg font-semibold mb-2">Alarm Trace</h2>
//         <table className="table-auto w-full text-sm border-collapse">
//           <thead className="bg-gray-100 sticky top-0 z-10">
//             <tr>
//               <th className="px-2 py-1 text-left">Time</th>
//               <th className="px-2 py-1 text-left">Equipment</th>
//               <th className="px-2 py-1 text-left">Type</th>
//               <th className="px-2 py-1 text-left">Severity</th>
//               <th className="px-2 py-1 text-left">Message</th>
//               <th className="px-2 py-1 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayedAlarms.map((alarm) => (
//               <tr
//                 key={alarm.id}
//                 className={`border-b cursor-pointer hover:bg-gray-200 ${
//                   alarm.severity === "Critical"
//                     ? "bg-red-100"
//                     : alarm.severity === "High"
//                     ? "bg-orange-100"
//                     : alarm.severity === "Medium"
//                     ? "bg-yellow-100"
//                     : "bg-green-100"
//                 }`}
//                 onClick={() => setSelectedAlarm(alarm)}
//               >
//                 <td className="px-2 py-1">{alarm.timestamp}</td>
//                 <td className="px-2 py-1">{alarm.equipment}</td>
//                 <td className="px-2 py-1">{alarm.type}</td>
//                 <td
//                   className="px-2 py-1 font-semibold hover:underline"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     setFilterSeverity(alarm.severity)
//                   }}
//                 >
//                   {alarm.severity}
//                 </td>
//                 <td className="px-2 py-1">{alarm.message}</td>
//                 <td className="px-2 py-1 flex gap-2">
//                   {alarm.acknowledged ? (
//                     <span>✅</span>
//                   ) : (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         handleAcknowledge(alarm.id)
//                       }}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
//                     >
//                       Ack
//                     </button>
//                   )}
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation()
//                       handleDelete(alarm.id)
//                     }}
//                     className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {displayedAlarms.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="text-center py-4 text-gray-500">
//                   No alarms matching this filter
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {selectedAlarm && (
//         <div
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           role="dialog"
//           aria-modal="true"
//           onClick={() => setSelectedAlarm(null)}
//         >
//           <div
//             className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="px-6 py-4 bg-gray-100 border-b flex justify-between items-center">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 Alarm Details
//               </h2>
//               <button
//                 onClick={() => setSelectedAlarm(null)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="px-6 py-4 flex-1 overflow-y-auto space-y-3 scroll-smooth">
//               <p>
//                 <span className="font-semibold text-gray-700">Time:</span>{" "}
//                 {selectedAlarm.timestamp}
//               </p>
//               <p>
//                 <span className="font-semibold text-gray-700">Equipment:</span>{" "}
//                 {selectedAlarm.equipment}
//               </p>
//               <p>
//                 <span className="font-semibold text-gray-700">Type:</span>{" "}
//                 {selectedAlarm.type}
//               </p>
//               <p>
//                 <span className="font-semibold text-gray-700">Severity:</span>{" "}
//                 <span
//                   className={`font-bold ${
//                     selectedAlarm.severity === "Critical"
//                       ? "text-red-600"
//                       : selectedAlarm.severity === "High"
//                       ? "text-orange-500"
//                       : selectedAlarm.severity === "Medium"
//                       ? "text-yellow-500"
//                       : "text-green-600"
//                   }`}
//                 >
//                   {selectedAlarm.severity}
//                 </span>
//               </p>
//               <p>
//                 <span className="font-semibold text-gray-700">Message:</span>{" "}
//                 {selectedAlarm.message}
//               </p>
//               <p>
//                 <span className="font-semibold text-gray-700">
//                   Acknowledged:
//                 </span>{" "}
//                 {selectedAlarm.acknowledged ? "Yes" : "No"}
//               </p>
//             </div>

//             <div className="px-6 py-3 border-t flex justify-end bg-gray-50">
//               <button
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
//                 onClick={() => setSelectedAlarm(null)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AlarmTrace
