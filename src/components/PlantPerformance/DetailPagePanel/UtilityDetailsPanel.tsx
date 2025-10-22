import React from "react"
import { UtilityDetailsPanelProps } from "@/utils/types"

const UtilityDetailsPanel: React.FC<UtilityDetailsPanelProps> = ({
  chartConfigs,
  utilityInfo,
  selectedTimePeriod,
  liveSummary,
  pastSummary,
  infoFields,
  unit = "",
}) => {
  const config = chartConfigs[0]
  if (!config) return null

  const periodLabel = selectedTimePeriod === "daily" ? "Past Day" : "Past Hour"

  const rows = [
    "Live",
    `Min (${periodLabel})`,
    `Peak (${periodLabel})`,
    `Avg (${periodLabel})`,
  ]

  const getSummaryValue = (rowLabel: string, lineKey: string): number => {
    const summaryKey = (prefix: string) => `${prefix}${lineKey}`

    if (rowLabel === "Live") return liveSummary?.[summaryKey("Avg")] ?? 0
    if (rowLabel.startsWith("Min")) return pastSummary?.[summaryKey("Min")] ?? 0
    if (rowLabel.startsWith("Peak"))
      return pastSummary?.[summaryKey("Max")] ?? 0
    if (rowLabel.startsWith("Avg")) return pastSummary?.[summaryKey("Avg")] ?? 0
    return 0
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* LEFT: Utility Info */}
      <div className="bg-gray-100 p-4 rounded shadow-md w-full lg:w-1/3 text-sm">
        {infoFields.map((field) => (
          <p key={field.key}>
            <strong>{field.label}:</strong> {utilityInfo[field.key]}
          </p>
        ))}

        {utilityInfo.alarmCount !== undefined && (
          <p className="mt-4 font-semibold text-center text-red-600">
            Total Alarms Occurred (Past Month): <br />
            <span className="text-xl font-bold">{utilityInfo.alarmCount}</span>
          </p>
        )}
      </div>

      {/* RIGHT: Summary Table */}
      {(selectedTimePeriod === "hourly" || selectedTimePeriod === "daily") && (
        <div className="flex-1 overflow-x-auto">
          <table className="w-full table table-fixed border-collapse text-sm text-center">
            <thead>
              <tr>
                <th className="border p-2"></th>
                {config.dataKeys.map((line) => (
                  <th key={line.key} className="border p-2">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full mb-1"
                        style={{ backgroundColor: line.stroke }}
                      ></div>
                      {line.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((label) => (
                <tr key={label}>
                  <td className="border p-2 font-medium bg-gray-50">{label}</td>
                  {config.dataKeys.map((line) => (
                    <td key={line.key} className="border p-2">
                      {getSummaryValue(label, line.key).toFixed(2)} {unit}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UtilityDetailsPanel
