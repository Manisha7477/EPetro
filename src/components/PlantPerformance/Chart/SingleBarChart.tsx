import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts"
import { BarChartConfig } from "@/utils/types"

interface SingleBarChartProps {
  chart: BarChartConfig
  height?: number
  onClick?: (chartId: string) => void
  isClickable?: boolean
}

const SingleBarChart: React.FC<SingleBarChartProps> = ({
  chart,
  height = 250,
  onClick,
  isClickable = false,
}) => {
  const formatTooltipValue = (value: number, context: string) => {
    const unit = context.includes("Energy")
      ? "kWh"
      : context.includes("TDH")
      ? "Units"
      : ""
    return `${value} ${unit}`
  }
  const handleClick = () => {
    if (onClick && isClickable) {
      onClick(chart.id)
    }
  }

  if (!chart.Key) {
    console.error(
      `Chart with ID "${chart.id}" is missing a 'Key' property in its configuration. Cannot render chart.`,
    )
    return (
      <div
        className={`min-h-[${height}px] w-full bg-white rounded-lg shadow-md flex items-center justify-center text-red-500`}
      >
        Error: Chart data key missing.
      </div>
    )
  }

  return (
    <div
      className={`min-h-[${height}px] w-full flex flex-col ${
        isClickable
          ? "cursor-pointer hover:shadow-lg transition-shadow duration-200"
          : ""
      }`}
      onClick={handleClick}
      aria-label={
        isClickable
          ? `Click to view expanded ${chart.title} chart details`
          : undefined
      }
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          handleClick()
        }
      }}
    >
      <h3 className="text-md text-center mt-2 font-semibold mb-2 text-gray-800">
        {chart.title}
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chart.data}
          margin={{ top: 0, right: 0, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e0e0e0"
          />
          <XAxis
            dataKey="timestamp"
            angle={-45}
            textAnchor="end"
            height={40}
            stroke="#666"
            tickLine={false}
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
            label={{
              value: "Time",
              position: "bottom",
              offset: 0,
              dy: 30,
              style: { fill: "#666", fontSize: 12 },
            }}
          />
          <YAxis
            stroke="#666"
            tickLine={false}
            label={{
              value: chart.yAxisLabelContext,
              angle: -90,
              position: "insideLeft",
              dx: 10,
              style: { textAnchor: "middle", fontSize: 12, fontWeight: "bold" },
            }}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.1)" }}
            labelFormatter={(label) => `Time: ${label}`}
            formatter={(value) => [
              formatTooltipValue(value as number, chart.yAxisLabelContext),
              "Value",
            ]}
          />
          <defs>
            <linearGradient id="gradientAbove" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="red" stopOpacity={0.8} />
              <stop offset="100%" stopColor="red" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="gradientBelow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8884d8" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <Bar dataKey={chart.Key} isAnimationActive={false} barSize={80}>
            {chart.data.map((entry, index) => (
              <Cell
                key={entry.timestamp || index}
                fill={
                  entry[chart.Key] > chart.threshold
                    ? "url(#gradientAbove)"
                    : "url(#gradientBelow)"
                }
              />
            ))}
          </Bar>
          <ReferenceLine
            y={chart.threshold}
            stroke={chart.thresholdLineColor || "lightcoral"}
            strokeDasharray="3 3"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SingleBarChart
