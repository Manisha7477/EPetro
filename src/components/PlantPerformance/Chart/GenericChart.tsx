import { CommonProps } from "@/utils/types"
import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

const GenericChart: React.FC<CommonProps> = ({
  config,
  data,
  thresholds,
  timePeriod,
  defaultYAxisLabel = "Value",
  showFixedThresholdLines = false,
}) => {
  const thresholdRange =
    config.threshold && thresholds ? thresholds[config.threshold] : undefined

  return (
    <>
      <h3 className="text-md font-semibold mb-2 text-center">{config.title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        {/* <LineChart data={data}> */}
        <LineChart
          data={data}
          margin={{ top: 0, right: 0, left: 18, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />

          <YAxis
            domain={config.domain ?? ["auto", "auto"]}
            label={{
              value: config.yAxisLabel || defaultYAxisLabel,
              angle: -90,
              offset: -10,
              position: "insideLeft",
              style: { textAnchor: "middle" },
              fontSize: 12, // smaller text
              fontWeight: "bold", // make it bold
            }}
          />

          <Tooltip />
          <Legend />

          {/* Threshold range lines */}
          {thresholdRange && (
            <>
              <ReferenceLine
                y={thresholdRange.min}
                stroke="red"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={thresholdRange.max}
                stroke="red"
                strokeDasharray="3 3"
              />
            </>
          )}

          {/* Fixed reference lines (like voltage 220, 240) */}
          {showFixedThresholdLines && (
            <>
              <ReferenceLine y={220} stroke="red" strokeDasharray="4 2" />
              <ReferenceLine y={240} stroke="red" strokeDasharray="4 2" />
            </>
          )}

          {/* Chart lines */}
          {config.dataKeys.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.stroke}
              name={line.label}
              dot={false}
              strokeWidth={1}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

export default GenericChart
