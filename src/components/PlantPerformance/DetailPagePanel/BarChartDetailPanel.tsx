import React from "react"
import { BarChartData, BarChartConfig, TimePeriod } from "@/utils/types"

interface Props {
  mainChartConfig: BarChartConfig
  detailedChartData: BarChartData[]
  utilityName: string
  plantAffiliated: string
  modelNo?: string
  utilityId: string
  lastUpdated: string
  totalAlarms: number
  selectedTimePeriod: TimePeriod
  liveSummary?: Record<string, number>
  pastSummary?: Record<string, number>
}

const BarChartDetailPanel: React.FC<Props> = ({
  mainChartConfig,
  detailedChartData,
  utilityName,
  plantAffiliated,
  modelNo,
  utilityId,
  lastUpdated,
  totalAlarms,
  selectedTimePeriod,
  liveSummary,
  pastSummary,
}) => {
  const dataKey = mainChartConfig.Key || ""
  const unit =
    mainChartConfig.yAxisLabelContext.split("(")[1]?.replace(")", "") || ""

  const getSummaryValue = (rowLabel: string): number | null => {
    const summaryKeyPrefix = rowLabel.split(" ")[0]
    const summaryKey = `${summaryKeyPrefix.replace("Live", "Avg")}${dataKey}`
    const summaryData = rowLabel === "Live" ? liveSummary : pastSummary
    return summaryData ? summaryData[summaryKey] ?? null : null
  }

  const periodLabel = selectedTimePeriod === "daily" ? "Past Day" : "Past Hour"

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-6">
      {/* LEFT: Utility Info */}
      <div className="bg-white p-4 rounded shadow-md w-full lg:w-1/3 text-sm">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          {utilityName} Overview
        </h3>
        <p>
          <strong>Name:</strong> {utilityName}
        </p>
        <p>
          <strong>Plant Affiliated:</strong> {plantAffiliated}
        </p>
        {modelNo && (
          <p>
            <strong>Model No:</strong> {modelNo}
          </p>
        )}

        {/* <p>
          <strong>ID:</strong> {utilityId}
        </p> */}
        <p>
          <strong>Last Updated:</strong> {lastUpdated}
        </p>
        <p className="mt-4 font-semibold text-center text-red-600">
          Total Alarms Occurred (Past Month): <br />
          <span className="text-xl font-bold">{totalAlarms}</span>
        </p>
      </div>

      {/* RIGHT: Stats Table */}
      {(selectedTimePeriod === "hourly" || selectedTimePeriod === "daily") && (
        <div className="flex-1 overflow-x-auto bg-white p-4 rounded shadow-md">
          {/* <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Key Statistics ({mainChartConfig.title})
          </h3> */}
          <table className="w-full table-fixed border-collapse text-sm text-center">
            <thead>
              <tr>
                <th className="border p-2"></th>
                <th className="border p-2">
                  <div className="flex flex-col items-center">
                    {mainChartConfig.baseBarColor && (
                      <div
                        className="w-3 h-3 rounded-full mb-1"
                        style={{
                          backgroundColor: mainChartConfig.baseBarColor,
                        }}
                      ></div>
                    )}
                    {mainChartConfig.yAxisLabelContext}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                "Live",
                `Min (${periodLabel})`,
                `Max (${periodLabel})`,
                `Avg (${periodLabel})`,
              ].map((label) => {
                const value = getSummaryValue(label)
                return (
                  <tr key={label}>
                    <td className="border p-2 font-medium bg-gray-50">
                      {label}
                    </td>
                    <td className="border p-2">
                      {typeof value === "number" ? value.toFixed(2) : "0.00"}{" "}
                      {unit}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BarChartDetailPanel

// import React from "react"
// import { BarChartData, BarChartConfig } from "@/utils/types"

// interface Props {
//   mainChartConfig: BarChartConfig
//   detailedChartData: BarChartData[]
//   generatorName: string
//   plantAffiliated: string
//   modelNo: string
//   genset: string
//   lastUpdated: string
//   totalAlarms: number
// }

// const GenBarChartDetailPanel: React.FC<Props> = ({
//   mainChartConfig,
//   detailedChartData,
//   generatorName,
//   plantAffiliated,
//   modelNo,
//   genset,
//   lastUpdated,
//   totalAlarms,
// }) => {
//   const calculateStats = (key: keyof BarChartData) => {
//     const values = detailedChartData
//       .map((d) => d[key])
//       .filter((v): v is number => typeof v === "number" && !isNaN(v))

//     if (values.length === 0) return { min: NaN, max: NaN, avg: NaN, peak: NaN }

//     const min = Math.min(...values)
//     const max = Math.max(...values)
//     const avg = values.reduce((a, b) => a + b, 0) / values.length
//     return { min, max, avg, peak: max }
//   }

//   const unit =
//     mainChartConfig.yAxisLabelContext.split("(")[1]?.replace(")", "") || ""

//   return (
//     <div className="flex flex-col lg:flex-row gap-6 mt-6">
//       {/* LEFT: Generator Info */}
//       <div className="bg-white p-4 rounded shadow-md w-full lg:w-1/3 text-sm">
//         <h3 className="text-lg font-semibold mb-3 text-gray-800">
//           Generator Overview
//         </h3>
//         <p>
//           <strong>Generator Name:</strong> {generatorName}
//         </p>
//         <p>
//           <strong>Plant Affiliated:</strong> {plantAffiliated}
//         </p>
//         <p>
//           <strong>Model No:</strong> {modelNo}
//         </p>
//         <p>
//           <strong>Genset:</strong> {genset}
//         </p>
//         <p>
//           <strong>Last Updated:</strong> {lastUpdated}
//         </p>
//         <p className="mt-4 font-semibold text-center text-red-600">
//           Total Alarms Occurred (Past Month): <br />
//           <span className="text-xl font-bold">{totalAlarms}</span>
//         </p>
//       </div>

//       {/* RIGHT: Stats Table */}
//       <div className="flex-1 overflow-x-auto bg-white p-4 rounded shadow-md">
//         <h3 className="text-lg font-semibold mb-3 text-gray-800">
//           Key Statistics ({mainChartConfig.title})
//         </h3>
//         {detailedChartData.length > 0 ? (
//           <table className="w-full border-collapse text-sm text-center">
//             <thead>
//               <tr>
//                 <th className="border p-2"></th>
//                 <th className="border p-2">
//                   <div className="flex flex-col items-center">
//                     {mainChartConfig.baseBarColor && (
//                       <div
//                         className="w-3 h-3 rounded-full mb-1"
//                         style={{
//                           backgroundColor: mainChartConfig.baseBarColor,
//                         }}
//                       ></div>
//                     )}
//                     {mainChartConfig.yAxisLabelContext}
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {[
//                 "Live",
//                 "Min (Past Hour)",
//                 "Peak (Past Hour)",
//                 "Avg (Past Hour)",
//               ].map((label, rowIndex) => {
//                 const stats = calculateStats(mainChartConfig.Key)
//                 let value: number | string = "--"

//                 if (rowIndex === 0) {
//                   value =
//                     detailedChartData[detailedChartData.length - 1]?.[
//                       mainChartConfig.Key
//                     ]
//                 } else if (rowIndex === 1) {
//                   value = stats.min
//                 } else if (rowIndex === 2) {
//                   value = stats.peak
//                 } else if (rowIndex === 3) {
//                   value = stats.avg
//                 }

//                 return (
//                   <tr key={label}>
//                     <td className="border p-2 font-medium bg-gray-50">
//                       {label}
//                     </td>
//                     <td className="border p-2">
//                       {typeof value === "number" && !isNaN(value)
//                         ? value.toFixed(2)
//                         : "--"}{" "}
//                       {unit}
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
//         ) : (
//           <p className="text-gray-600">
//             No detailed statistics available for this chart type and period.
//           </p>
//         )}
//       </div>
//     </div>
//   )
// }

// export default GenBarChartDetailPanel
