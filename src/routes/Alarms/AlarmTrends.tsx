import React, { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

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

const generateTopSources = () => [
  { equipment: "Generator-01", alarms: getRandom(10, 25) },
  { equipment: "Chiller-02", alarms: getRandom(8, 20) },
  { equipment: "Boiler-01", alarms: getRandom(5, 15) },
  { equipment: "Compressor-03", alarms: getRandom(3, 12) },
]

const AlarmTrends: React.FC = () => {
  const [alarmTrendData, setAlarmTrendData] = useState(
    Array.from({ length: 6 }, () => generateTrendPoint()),
  )
  const [topSourcesData, setTopSourcesData] = useState(generateTopSources())

  const latest = alarmTrendData[alarmTrendData.length - 1]

  useEffect(() => {
    const interval = setInterval(() => {
      setAlarmTrendData((prev) => [...prev.slice(1), generateTrendPoint()])
      setTopSourcesData(generateTopSources())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🚨 Alarm Trends Dashboard</h1>

      {/* Vertical KPIs + Severity Trend side by side */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* KPIs Vertical */}
        <div className="flex flex-col gap-4 w-full md:w-1/4">
          <div className="bg-red-600 text-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Critical</h2>
            <p className="text-3xl font-bold">{latest?.Critical ?? 0}</p>
          </div>
          <div className="bg-orange-500 text-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">High</h2>
            <p className="text-3xl font-bold">{latest?.High ?? 0}</p>
          </div>
          <div className="bg-yellow-400 text-black p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Medium</h2>
            <p className="text-3xl font-bold">{latest?.Medium ?? 0}</p>
          </div>
          <div className="bg-green-600 text-white p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">Low</h2>
            <p className="text-3xl font-bold">{latest?.Low ?? 0}</p>
          </div>
        </div>

        {/* Severity Trend Chart */}
        <div className="bg-white shadow rounded-xl p-4 w-full md:w-3/4">
          <h2 className="text-lg font-semibold mb-2">Severity Trend (Live)</h2>
          <ResponsiveContainer width="100%" height={320}>
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
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="High"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="Medium"
                stroke="#eab308"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="Low"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top alarm sources */}
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">Top Alarm Sources</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topSourcesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="equipment" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="alarms" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AlarmTrends

// import React, { useState } from "react"
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
//   ColumnDef,
// } from "@tanstack/react-table"
// import { FaRegCalendarAlt } from "react-icons/fa"
// import { HiOutlineCog } from "react-icons/hi"
// import ModalComponent from "@/components/ModalComponent"
// import TableHeaderConfig from "@/components/TableHeaderConfig"
// import { ITableHeader } from "@/utils/types"

// // Define the type for the alarm event data
// type AlarmEvent = {
//   eventTime: string
//   eventId: string
//   source: string
//   eventState: string
//   priority: string
// }

// const data: AlarmEvent[] = [
//   {
//     eventTime: "08/13/2024 04:28:52",
//     eventId: "41db679c-cd47-4ea1-89c5-659e1924e845",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Ack",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:28:52",
//     eventId: "6612248a-19e3-4c92-8f06-7edf95c44598",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Active",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:28:53",
//     eventId: "6612248a-19e3-4c92-8f06-7edf95c44598",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Clear",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:28:56",
//     eventId: "ab9a687d-6752-4c3c-bcc8-84c149010199",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Active",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:06",
//     eventId: "778f2616-fa4b-4443-981d-f64520304764",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Active",
//     priority: "High",
//   },
//   {
//     eventTime: "08/13/2024 04:29:08",
//     eventId: "778f2616-fa4b-4443-981d-f64520304764",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Clear",
//     priority: "High",
//   },
//   {
//     eventTime: "08/13/2024 04:29:10",
//     eventId: "91ae45df-2b19-4b85-9937-629d5a6c5d10",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Active",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:12",
//     eventId: "5bc8e2c8-cf7e-45a1-9215-74d29cb7b6d0",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Active",
//     priority: "High",
//   },
//   {
//     eventTime: "08/13/2024 04:29:15",
//     eventId: "a33f73e7-7e43-41b4-8d9d-8e7fa27bbf21",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Clear",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:18",
//     eventId: "c8b92fc8-f4d7-42f8-9436-04fb305d22b3",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Ack",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:22",
//     eventId: "e193f8ab-bc9f-4d95-8917-7a3df2271ed2",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Active",
//     priority: "Medium",
//   },
//   {
//     eventTime: "08/13/2024 04:29:26",
//     eventId: "5e3fc328-b9a2-4a41-b276-14663e00d063",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Active",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:28",
//     eventId: "a3a4e60c-8c3d-4b8e-8d39-ec95f09de930",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Clear",
//     priority: "High",
//   },
//   {
//     eventTime: "08/13/2024 04:29:32",
//     eventId: "b8e7d3ad-9d0d-4c4a-941e-dc835023e965",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Active",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:34",
//     eventId: "94f60b57-91d0-4e4d-85d1-128b9948bb65",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Ack",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:36",
//     eventId: "3f6b77d9-63c5-4900-8c75-372c8e4c591e",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Active",
//     priority: "Medium",
//   },
//   {
//     eventTime: "08/13/2024 04:29:40",
//     eventId: "1d3e45e7-b7f3-4a63-ae7e-0f9f394b3e7b",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Clear",
//     priority: "High",
//   },
//   {
//     eventTime: "08/13/2024 04:29:42",
//     eventId: "d49e2a6b-49e6-4f9e-b94c-3f9c69f7a6b2",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Active",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:44",
//     eventId: "2c59a3b8-bb5b-4b39-9d32-4d36a6f7f2c6",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Ack",
//     priority: "Medium",
//   },
//   {
//     eventTime: "08/13/2024 04:29:46",
//     eventId: "5a4e1b6f-8b5c-4964-b0c6-97f5aeb0f49d",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Clear",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:48",
//     eventId: "8d6e4c2f-ae93-4e4f-a5d6-bb38f6a6b6d1",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Active",
//     priority: "Low",
//   },
//   {
//     eventTime: "08/13/2024 04:29:50",
//     eventId: "e9f85c7b-79f4-4982-b1f8-5d7f9a4f7c8d",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Ack",
//     priority: "High",
//   },
//   {
//     eventTime: "08/13/2024 04:29:52",
//     eventId: "1f0e3d3b-54a2-4926-bf0a-76d6f0f4b7d4",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Active",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:54",
//     eventId: "7a6e8b4c-5f9e-472a-a5c8-b4f7f6e2f7d4",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Clear",
//     priority: "Medium",
//   },
//   {
//     eventTime: "08/13/2024 04:29:56",
//     eventId: "6b8d9a5b-c8f3-4e8f-a1b7-9f4e2c7d4a6c",
//     source: "prov:VisionProvider:/tag:HMI Op...",
//     eventState: "Ack",
//     priority: "Critical",
//   },
//   {
//     eventTime: "08/13/2024 04:29:58",
//     eventId: "9e4b7c1d-9f5b-4e9c-a5d8-7f4b8a5f2d6c",
//     source: "prov:default:/tag:Exchange/Data...",
//     eventState: "Active",
//     priority: "High",
//   },
// ]
// // Define the columns for the table using `ColumnDef`
// const columns: ColumnDef<AlarmEvent>[] = [
//   {
//     accessorKey: "eventTime",
//     header: "Event Time",
//   },
//   {
//     accessorKey: "eventId",
//     header: "Event Id",
//   },
//   {
//     accessorKey: "source",
//     header: "Source",
//   },
//   {
//     accessorKey: "eventState",
//     header: "Event State",
//   },
//   {
//     accessorKey: "priority",
//     header: "Priority",
//   },
// ]

// // Data structure for table header configuration
// const ALARM_NOTIFICATION_HEADER_DATA: ITableHeader[] = [
//   {
//     name: "slNo",
//     display: "SI. No.",
//     visible: true,
//   },
//   {
//     name: "ackNotes",
//     display: "Ack Notes",
//     visible: true,
//   },
//   {
//     name: "ackUser",
//     display: "Ack User",
//     visible: true,
//   },
//   {
//     name: "displayPath",
//     display: "display Path",
//     visible: true,
//   },
//   {
//     name: "eventId",
//     display: "Event Id",
//     visible: true,
//   },
//   {
//     name: "eventState",
//     display: "Event State",
//     visible: true,
//   },
//   {
//     name: "eventValue",
//     display: "Event Value",
//     visible: true,
//   },
//   {
//     name: "isSystemEvent",
//     display: "Is System Event",
//     visible: true,
//   },
//   {
//     name: "label",
//     display: "Label",
//     visible: true,
//   },
//   {
//     name: "name",
//     display: "Name",
//     visible: true,
//   },
//   {
//     name: "priority",
//     display: "Priority",
//     visible: true,
//   },
// ]

// // Main component definition
// const AlarmAndNotifications: React.FC = () => {
//   const [modal, setModal] = useState(false) // Modal state
//   const [tableHeaderFilter, setTableHeaderFilter] = useState(
//     ALARM_NOTIFICATION_HEADER_DATA,
//   ) // Table header filter state

//   // Initialize the table using the `useReactTable` hook
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   })

//   // Function to open the modal
//   const handleTableConfig = () => {
//     setModal(true)
//   }

//   // Function to close the modal
//   const handleCloseModal = (modalStatus: boolean) => {
//     setModal(modalStatus)
//   }

//   // Function to determine row background color based on event state
//   const getRowBgColor = (eventState: string): string => {
//     switch (eventState) {
//       case "Ack":
//         return "#f2f5c5" // Yellow for acknowledged events
//       case "Active":
//         return "#fdafaf" // Red for active events
//       case "Clear":
//         return "#bedffe" // Blue for cleared events
//       default:
//         return ""
//     }
//   }

//   // Function to update the visible status of table headers
//   const handleVisibleStatus = (itemsUpdatedData: ITableHeader[]) => {
//     const filterTableHeader = itemsUpdatedData.filter((item) => item.visible)
//     setTableHeaderFilter(filterTableHeader)
//   }
//   const [currentPage, setCurrentPage] = useState(1)
//   const rowsPerPage = 10

//   const totalPages = Math.ceil(table.getRowModel().rows.length / rowsPerPage)

//   const handlePageChange = (newPage: any) => {
//     setCurrentPage(newPage)
//   }

//   const paginatedRows = table
//     .getRowModel()
//     .rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
//   // Function to render the modal
//   const renderModal = () => (
//     <ModalComponent
//       showModal={modal}
//       handleCloseModal={handleCloseModal}
//       title="Organization Structure View - Header Setting"
//     >
//       <TableHeaderConfig
//         tableHeaderData={ALARM_NOTIFICATION_HEADER_DATA}
//         handleVisibleStatus={handleVisibleStatus}
//       />
//     </ModalComponent>
//   )

//   // JSX for rendering the component
//   return (
//     <div className="overflow-auto">
//       <div className="flex justify-between mx-3">
//         <div className="bg-info rounded-t border-b border-base-300 font-bold px-4 py-1 mt-16">
//           This is Temporary page
//         </div>
//         <div className="flex items-center gap-5">
//           <div className="text-2xl">
//             <FaRegCalendarAlt />
//           </div>
//           <div>
//             <h4 className="font-bold">569 Alarm events</h4>
//             <h4 className="font-bold">Last 1 hour</h4>
//           </div>
//         </div>
//         <div>
//           <HiOutlineCog
//             className="cursor-pointer text-2xl"
//             onClick={handleTableConfig}
//           />
//         </div>
//       </div>
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th
//                   key={header.id}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   {flexRender(
//                     header.column.columnDef.header,
//                     header.getContext(),
//                   )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {paginatedRows.map((row) => (
//             <tr
//               key={row.id}
//               style={{
//                 backgroundColor: getRowBgColor(row.original.eventState),
//               }}
//             >
//               {row.getVisibleCells().map((cell) => (
//                 <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {modal && renderModal()}
//       <div className="flex justify-between items-center p-4">
//         <button
//           className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   )
// }

// export default AlarmAndNotifications
