import React, { useMemo } from "react"
import { PieChart, Pie, Cell } from "recharts"

export type GaugeData = {
  value: number
  max: number
  thresholds?: Record<string, number | null>
}

export type Status = "critical" | "warning" | "attention" | "optimal"

interface GaugeChartProps {
  title: string
  data: GaugeData
  unit?: string
  width?: number
  height?: number
  precision?: number
  showValue?: boolean
  showPercent?: boolean
}

const THRESHOLD_COLORS: Record<number, string[]> = {
  1: ["#10B981", "#DC2626"],
  2: ["#DC2626", "#10B981", "#DC2626"],
  3: ["#10B981", "#F59E0B", "#F97316", "#DC2626"],
  4: ["#DC2626", "#F97316", "#10B981", "#F97316", "#DC2626"],
}

const statusConfig: Record<Status, { bg: string; dot: string; label: string }> =
  {
    critical: {
      bg: "bg-red-50 border-red-500",
      dot: "bg-red-500",
      label: "Critical",
    },
    warning: {
      bg: "bg-amber-50 border-orange-400",
      dot: "bg-orange-500",
      label: "Warning",
    },
    attention: {
      bg: "bg-red-50 border-yellow-400",
      dot: "bg-yellow-500",
      label: "Attention",
    },
    optimal: {
      bg: "bg-emerald-50 border-emerald-400",
      dot: "bg-emerald-500",
      label: "Optimal",
    },
  }

const getStatusFromValue = (
  value: number,
  maxValue: number,
  thresholds?: Record<string, number | null>,
): Status => {
  if (!thresholds || Object.keys(thresholds).length === 0) return "optimal"

  const thresholdValues = Object.values(thresholds)
    .filter((t): t is number => t !== null)
    .sort((a, b) => a - b)

  if (thresholdValues.length === 1) {
    return value <= thresholdValues[0] ? "optimal" : "critical"
  }
  if (thresholdValues.length === 2) {
    if (value <= thresholdValues[0]) return "critical"
    if (value <= thresholdValues[1]) return "optimal"
    return "critical"
  }
  if (thresholdValues.length === 3) {
    if (value <= thresholdValues[0]) return "optimal"
    if (value <= thresholdValues[1]) return "attention"
    if (value <= thresholdValues[2]) return "warning"
    return "critical"
  }
  if (thresholdValues.length >= 4) {
    if (value <= thresholdValues[0]) return "critical"
    if (value <= thresholdValues[1]) return "warning"
    if (value <= thresholdValues[2]) return "optimal"
    if (value <= thresholdValues[3]) return "warning"
    return "critical"
  }
  return "optimal"
}

const getThresholdData = (
  thresholds: Record<string, number | null> | undefined,
  min: number,
  max: number,
) => {
  if (!thresholds || Object.keys(thresholds).length === 0) {
    return [{ name: `${min}-${max}`, value: max - min, color: "#6B7280" }]
  }

  const entries = Object.entries(thresholds)
    .filter(([_, v]) => v !== null) // remove nulls
    .map(([k, v]) => ({ key: k, val: v as number }))
    .sort((a, b) => {
      const ai = parseInt(a.key.replace(/\D/g, "")) || 0
      const bi = parseInt(b.key.replace(/\D/g, "")) || 0
      return ai - bi
    })

  const colors = THRESHOLD_COLORS[entries.length] || []
  const vals = entries.map((e) => e.val)

  const pieData: { name: string; value: number; color: string }[] = []
  let prev = min

  for (let i = 0; i < vals.length; i++) {
    const cur = Math.min(Math.max(vals[i], min), max)
    if (cur > prev) {
      pieData.push({
        name: `${prev}-${cur}`,
        value: cur - prev,
        color: colors[i] || "#6B7280",
      })
      prev = cur
    }
  }

  if (prev < max) {
    pieData.push({
      name: `${prev}-${max}`,
      value: max - prev,
      color: colors[vals.length] || "#9CA3AF",
    })
  }
  return pieData
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  title,
  data,
  unit,
  width = 260,
  height = 160,
  precision = 1,
  showValue = true,
  showPercent = true,
}) => {
  const minValue = 0
  const safeValue = Math.min(Math.max(data.value, minValue), data.max)
  const percentage = (safeValue / data.max) * 100

  const radius = Math.min(width, height) * 0.42
  const innerRadius = radius * 0.63

  const thresholdData = useMemo(
    () => getThresholdData(data.thresholds, minValue, data.max),
    [data, minValue],
  )
  const currentStatus = getStatusFromValue(safeValue, data.max, data.thresholds)
  const statusClasses = statusConfig[currentStatus]

  const cx = width / 2
  const cy = radius + 16
  const angle = 180 - (safeValue / data.max) * 180
  const rad = (angle * Math.PI) / 180
  const needle = {
    x: cx + innerRadius * 0.82 * Math.cos(rad),
    y: cy - innerRadius * 0.82 * Math.sin(rad),
  }

  return (
    <div
      className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 ${statusClasses.bg}`}
      style={{
        width: width + 16,
        height: height + 56,
        minWidth: 180,
        minHeight: 140,
      }}
    >
      {/* Header with Status UI */}
      <div className="px-2 border-b rounded-lg border-gray-200 bg-gray-100 py-1.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {title}
          </h3>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${statusClasses.dot}`} />
            <span className="text-[10px] font-medium">
              {statusClasses.label}
            </span>
          </div>
        </div>
      </div>

      {/* Gauge */}
      <div className="p-2 flex flex-col items-center">
        <div className="relative" style={{ height: radius + 28 }}>
          <PieChart width={width} height={radius + 28}>
            <Pie
              data={thresholdData}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius={innerRadius}
              outerRadius={radius}
              cx={cx}
              cy={cy}
              stroke="#fff"
              strokeWidth={1.5}
            >
              {thresholdData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{ outline: "none" }}
                />
              ))}
            </Pie>
            {/* Needle */}
            <g>
              <line
                x1={cx}
                y1={cy}
                x2={needle.x}
                y2={needle.y}
                stroke="#1E40AF"
                strokeWidth={3}
              />
              <circle
                cx={cx}
                cy={cy}
                r={6}
                fill="#1E40AF"
                stroke="#fff"
                strokeWidth={2}
              />
            </g>
          </PieChart>
        </div>

        {/* Values */}
        {(showValue || showPercent) && (
          <div className="mt-2 text-center">
            {showValue && (
              <div className="text-xl font-bold text-gray-900">
                {safeValue.toFixed(2)} {unit}
              </div>
            )}
            {showPercent && (
              <div className="text-xs text-gray-500">
                {percentage.toFixed(1)}% of max{" "}
                {unit ? `(${data.max} ${unit})` : `(${data.max})`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GaugeChart

// import React, { useMemo } from "react"
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
// import { GaugeChartProps } from "@/utils/types"

// // Professional color palette with semantic meaning
// const ENTERPRISE_THRESHOLD_COLORS = {
//   1: ["#10B981", "#DC2626"], // Emerald-500, Red-600
//   2: ["#DC2626", "#10B981", "#DC2626"], // Red-600, Emerald-500, Red-600
//   3: ["#10B981", "#F59E0B", "#F97316", "#DC2626"], // Emerald-500, Amber-500, Orange-500, Red-600
//   4: ["#DC2626", "#F97316", "#10B981", "#F97316", "#DC2626"], // Red-600, Orange-500, Emerald-500, Orange-500, Red-600
// } as const

// type Status = "critical" | "warning" | "optimal" | "normal"

// const getStatusFromValue = (
//   value: number,
//   maxValue: number,
//   threshold?: Record<string, number>,
// ): Status => {
//   if (!threshold || Object.keys(threshold).length === 0) return "normal"

//   const percentage = (value / maxValue) * 100
//   const thresholdValues = Object.values(threshold).sort((a, b) => a - b)

//   if (thresholdValues.length === 1) {
//     // t1 => critical <= t1, else optimal
//     return percentage <= thresholdValues[0] ? "critical" : "optimal"
//   }
//   if (thresholdValues.length >= 2) {
//     if (percentage <= thresholdValues[0]) return "critical"
//     if (percentage <= thresholdValues[1]) return "warning"
//     return "optimal"
//   }
//   return "normal"
// }

// type SizePreset = "xs" | "sm" | "md" | "lg"
// type Density = "compact" | "cozy" | "comfortable"

// interface EnhancedGaugeChartProps extends GaugeChartProps {
//   // Layout & sizing
//   width?: number // fixed width
//   height?: number // fixed height
//   size?: SizePreset // presets override width/height unless width/height provided
//   density?: Density // padding and text sizes
//   className?: string

//   // Display toggles
//   showStatus?: boolean
//   showTicks?: boolean
//   showValue?: boolean
//   showPercent?: boolean
//   showTitle?: boolean

//   // Behavior
//   animated?: boolean
//   precision?: number
//   tickStep?: number // percent step for major ticks (e.g., 25)
//   minValue?: number // clamp lower bound (default 0)

//   // Accessibility
//   ariaLabel?: string
// }

// const densityConfig: Record<
//   Density,
//   {
//     paddingY: string
//     headerText: string
//     valueText: string
//     subText: string
//     cardPad: string
//   }
// > = {
//   compact: {
//     paddingY: "py-1.5",
//     headerText: "text-sm",
//     valueText: "text-xl",
//     subText: "text-xs",
//     cardPad: "p-2",
//   },
//   cozy: {
//     paddingY: "py-2",
//     headerText: "text-base",
//     valueText: "text-2xl",
//     subText: "text-xs",
//     cardPad: "p-3",
//   },
//   comfortable: {
//     paddingY: "py-2.5",
//     headerText: "text-lg",
//     valueText: "text-3xl",
//     subText: "text-sm",
//     cardPad: "p-4",
//   },
// }

// const sizePresetMap: Record<SizePreset, { w: number; h: number }> = {
//   xs: { w: 200, h: 120 },
//   sm: { w: 240, h: 140 },
//   md: { w: 280, h: 160 },
//   lg: { w: 320, h: 180 },
// }

// const statusConfig: Record<
//   Status,
//   { bg: string; text: string; dot: string; label: string }
// > = {
//   critical: {
//     bg: "bg-red-50 border-red-200",
//     text: "text-red-700",
//     dot: "bg-red-500",
//     label: "Critical",
//   },
//   warning: {
//     bg: "bg-amber-50 border-amber-200",
//     text: "text-amber-700",
//     dot: "bg-amber-500",
//     label: "Warning",
//   },
//   optimal: {
//     bg: "bg-emerald-50 border-emerald-200",
//     text: "text-emerald-700",
//     dot: "bg-emerald-500",
//     label: "Optimal",
//   },
//   normal: {
//     bg: "bg-gray-50 border-gray-200",
//     text: "text-gray-700",
//     dot: "bg-gray-500",
//     label: "Normal",
//   },
// }

// const GaugeChart: React.FC<EnhancedGaugeChartProps> = ({
//   title,
//   value,
//   unit,
//   maxValue,
//   threshold,

//   // New defaults to reduce overall size and density
//   size = "sm",
//   density = "compact",

//   // Explicit overrides if provided
//   width,
//   height,

//   className = "",
//   showStatus = true,
//   showTicks = true,
//   showValue = true,
//   showPercent = true,
//   showTitle = true,
//   animated = false, // default off for performance
//   precision = 1,
//   tickStep = 25,
//   minValue = 0,
//   ariaLabel,
// }) => {
//   // Resolve dimensions
//   const baseDims = sizePresetMap[size]
//   const resolvedWidth = width ?? baseDims.w
//   const resolvedHeight = height ?? baseDims.h

//   // Calculations with useMemo for performance
//   const calculations = useMemo(() => {
//     const mx = Math.max(minValue, Math.min(value, maxValue))
//     const clampedValue = Math.min(Math.max(mx, minValue), maxValue)
//     const scaleSpan = maxValue - minValue
//     const normalized = scaleSpan > 0 ? (clampedValue - minValue) / scaleSpan : 0
//     const needleAngle = 180 - normalized * 180
//     const percentage = scaleSpan > 0 ? (clampedValue / maxValue) * 100 : 0
//     const status = getStatusFromValue(clampedValue, maxValue, threshold)

//     // Dynamic radius calculation based on resolved dimensions (slightly smaller than before)
//     const baseRadius = Math.min(resolvedWidth, resolvedHeight) * 0.42
//     const innerRadius = baseRadius * 0.63
//     const outerRadius = baseRadius

//     return {
//       clampedValue,
//       needleAngle,
//       percentage,
//       status,
//       innerRadius,
//       outerRadius,
//     }
//   }, [value, maxValue, minValue, threshold, resolvedWidth, resolvedHeight])

//   // Threshold data processing (robust to unsorted keys)
//   const thresholdData = useMemo(() => {
//     if (!threshold || Object.keys(threshold).length === 0) {
//       // default to single neutral arc
//       return [
//         {
//           name: `${minValue}-${maxValue}`,
//           value: maxValue - minValue,
//           color: "#6B7280",
//         },
//       ]
//     }

//     const entries = Object.entries(threshold)
//       .map(([k, v]) => ({ key: k, val: v }))
//       .sort((a, b) => {
//         const ai = parseInt(a.key.replace(/\D/g, "")) || 0
//         const bi = parseInt(b.key.replace(/\D/g, "")) || 0
//         return ai - bi
//       })

//     const numThresholds = entries.length
//     const colors =
//       ENTERPRISE_THRESHOLD_COLORS[
//         numThresholds as keyof typeof ENTERPRISE_THRESHOLD_COLORS
//       ] || []
//     const vals = entries.map((e) => e.val)

//     const pieData: { name: string; value: number; color: string }[] = []
//     let prev = minValue

//     for (let i = 0; i < vals.length; i++) {
//       const cur = Math.min(Math.max(vals[i], minValue), maxValue)
//       if (cur > prev) {
//         pieData.push({
//           name: `${prev}-${cur}`,
//           value: cur - prev,
//           color: colors[i] || "#6B7280",
//         })
//         prev = cur
//       }
//     }

//     if (prev < maxValue) {
//       pieData.push({
//         name: `${prev}-${maxValue}`,
//         value: maxValue - prev,
//         color: colors[vals.length] || "#9CA3AF",
//       })
//     }

//     return pieData
//   }, [threshold, minValue, maxValue])

//   // Chart positioning
//   const cx = resolvedWidth / 2
//   const cy = calculations.outerRadius + 16 // slightly tighter

//   // Needle positioning calculation
//   const getPointOnCircle = (angleInDegrees: number, radius: number) => {
//     const angleInRadians = (angleInDegrees * Math.PI) / 180
//     const x = cx + radius * Math.cos(angleInRadians)
//     const y = cy - radius * Math.sin(angleInRadians)
//     return { x, y }
//   }

//   const needleTip = getPointOnCircle(
//     calculations.needleAngle,
//     calculations.innerRadius * 0.82,
//   )

//   const currentStatus = statusConfig[calculations.status]
//   const d = densityConfig[density]

//   // Build tick list based on tickStep, ensure 0..100 inclusive
//   const ticks = useMemo(() => {
//     if (!showTicks) return []
//     const arr: number[] = []
//     for (let p = 0; p <= 100; p += tickStep) arr.push(p)
//     if (arr[arr.length - 1] !== 100) arr.push(100)
//     return arr
//   }, [tickStep, showTicks])

//   return (
//     <div
//       className={`
//         bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md
//         transition-all duration-300 overflow-hidden
//         ${currentStatus.bg} ${className}
//       `}
//       style={{
//         width: resolvedWidth + 16, // reduced outer padding
//         height: resolvedHeight + 56, // tighter header/body
//         minWidth: 180,
//         minHeight: 140,
//       }}
//       role="img"
//       aria-label={
//         ariaLabel ??
//         `${title ?? "Gauge"} showing ${calculations.clampedValue.toFixed(
//           precision,
//         )} ${unit ?? ""} out of ${maxValue} ${unit ?? ""}`
//       }
//     >
//       {/* Header Section */}
//       {(showTitle || showStatus) && (
//         <div
//           className={`px-2 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50 ${d.paddingY}`}
//         >
//           <div className="flex items-center justify-between gap-2">
//             {showTitle && (
//               <h3
//                 className={`${d.headerText} font-semibold text-gray-900 truncate`}
//               >
//                 {title}
//               </h3>
//             )}
//             {showStatus && (
//               <div className="flex items-center gap-1.5">
//                 <div
//                   className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`}
//                 />
//                 <span className="text-[10px] font-medium">
//                   {currentStatus.label}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Chart Section */}
//       <div className={`${d.cardPad} pt-2 flex flex-col items-center`}>
//         <div
//           className="relative"
//           style={{ height: calculations.outerRadius + 28 }}
//         >
//           {/* Use fixed width/height for predictable sizing and a responsive container wrapper if needed */}
//           <PieChart
//             width={resolvedWidth}
//             height={calculations.outerRadius + 28}
//           >
//             <defs>
//               <filter
//                 id={`shadow-${title}`}
//                 x="-50%"
//                 y="-50%"
//                 width="200%"
//                 height="200%"
//               >
//                 <feDropShadow
//                   dx="0"
//                   dy="2"
//                   stdDeviation="3"
//                   floodColor="#000000"
//                   floodOpacity="0.08"
//                 />
//               </filter>
//               <filter
//                 id={`needle-glow-${title}`}
//                 x="-50%"
//                 y="-50%"
//                 width="200%"
//                 height="200%"
//               >
//                 <feDropShadow
//                   dx="0"
//                   dy="0"
//                   stdDeviation="2"
//                   floodColor="#3B82F6"
//                   floodOpacity="0.35"
//                 />
//               </filter>
//             </defs>

//             <Pie
//               data={thresholdData}
//               dataKey="value"
//               startAngle={180}
//               endAngle={0}
//               innerRadius={calculations.innerRadius}
//               outerRadius={calculations.outerRadius}
//               paddingAngle={0}
//               cornerRadius={3}
//               cx={cx}
//               cy={cy}
//               stroke="#ffffff"
//               strokeWidth={1.5}
//               isAnimationActive={animated}
//             >
//               {thresholdData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={entry.color}
//                   filter={`url(#shadow-${title})`}
//                 />
//               ))}
//             </Pie>

//             {/* Needle */}
//             <g>
//               <line
//                 x1={cx}
//                 y1={cy}
//                 x2={needleTip.x}
//                 y2={needleTip.y}
//                 stroke="#1E40AF"
//                 strokeWidth={3}
//                 strokeLinecap="round"
//                 filter={`url(#needle-glow-${title})`}
//                 className={animated ? "animate-pulse" : ""}
//               />
//               <circle
//                 cx={cx}
//                 cy={cy}
//                 r={6}
//                 fill="#1E40AF"
//                 stroke="#ffffff"
//                 strokeWidth={2}
//                 filter={`url(#shadow-${title})`}
//               />
//             </g>

//             {/* Scale markers */}
//             {ticks.map((percent) => {
//               const angle = 180 - (percent / 100) * 180
//               const markerStart = getPointOnCircle(
//                 angle,
//                 calculations.outerRadius + 3,
//               )
//               const markerEnd = getPointOnCircle(
//                 angle,
//                 calculations.outerRadius + (percent % 50 === 0 ? 10 : 6),
//               )
//               return (
//                 <g key={percent}>
//                   <line
//                     x1={markerStart.x}
//                     y1={markerStart.y}
//                     x2={markerEnd.x}
//                     y2={markerEnd.y}
//                     stroke="#6B7280"
//                     strokeWidth={percent % 50 === 0 ? 1.5 : 1}
//                     opacity={0.75}
//                   />
//                 </g>
//               )
//             })}
//           </PieChart>
//         </div>

//         {/* Value Display */}
//         {(showValue || showPercent) && (
//           <div className="mt-2 text-center">
//             {showValue && (
//               <div
//                 className={`${d.valueText} font-bold text-gray-900 leading-none`}
//               >
//                 {calculations.clampedValue.toFixed(precision)}
//                 {unit ? (
//                   <span className="text-xs font-medium text-gray-500 ml-1">
//                     {unit}
//                   </span>
//                 ) : null}
//               </div>
//             )}
//             {showPercent && (
//               <div className={`${d.subText} text-gray-500 mt-0.5`}>
//                 {calculations.percentage.toFixed(1)}% of max
//                 {unit ? ` (${maxValue} ${unit})` : ` (${maxValue})`}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default GaugeChart

// // import React from "react"
// // import { PieChart, Pie, Cell } from "recharts"
// // import { GaugeChartProps } from "@/utils/types"

// // const THRESHOLD_COLORS = {
// //   1: ["#22C55E", "#EF4444"], // Green, Red
// //   2: ["#EF4444", "#22C55E", "#EF4444"], // Red, Green, Red
// //   3: ["#22C55E", "#F59E0B", "#F97316", "#EF4444"], // Green, Yellow, Orange, Red
// //   4: ["#EF4444", "#F97316", "#22C55E", "#F97316", "#EF4444"], // Red, Orange, Green, Orange, Red
// // }

// // const GaugeChart: React.FC<GaugeChartProps> = ({
// //   title,
// //   value,
// //   unit,
// //   maxValue,
// //   threshold,
// //   innerRadius = 40,
// //   outerRadius = 60,
// // }) => {
// //   const clampedValue = Math.min(Math.max(value, 0), maxValue)
// //   const needleAngle = 180 - (clampedValue / maxValue) * 180

// //   const thresholdKeys = threshold
// //     ? Object.keys(threshold).sort(
// //         (a, b) => parseInt(a.replace("t", "")) - parseInt(b.replace("t", "")),
// //       )
// //     : []

// //   const numThresholds = thresholdKeys.length
// //   const currentThresholdsValues = thresholdKeys.map((key) =>
// //     threshold ? threshold[key] : 0,
// //   )
// //   const colors =
// //     THRESHOLD_COLORS[numThresholds as keyof typeof THRESHOLD_COLORS] || []

// //   const pieData = []
// //   let prevThreshold = 0

// //   for (let i = 0; i < numThresholds; i++) {
// //     const currentThresholdValue = currentThresholdsValues[i]
// //     pieData.push({
// //       name: `${prevThreshold}-${currentThresholdValue}`,
// //       value: currentThresholdValue - prevThreshold,
// //       color: colors[i],
// //     })
// //     prevThreshold = currentThresholdValue
// //   }
// //   if (prevThreshold < maxValue) {
// //     pieData.push({
// //       name: `${prevThreshold}-${maxValue}`,
// //       value: maxValue - prevThreshold,
// //       color: colors[numThresholds],
// //     })
// //   }

// //   // Define cx and cy for the PieChart.
// //   // For horizontal centering, cx should be half of the PieChart's width.
// //   // For a semi-circle where the base is at the bottom, cy should be equal to the outerRadius.
// //   // This ensures the semi-circle starts at the top of the minimal canvas height.
// //   const cx = outerRadius // For horizontal centering within (outerRadius * 2) width
// //   const cy = outerRadius // For placing the semicircle's flat base at y=outerRadius

// //   const getPointOnCircle = (angleInDegrees: number, radius: number) => {
// //     const angleInRadians = (angleInDegrees * Math.PI) / 180
// //     const x = cx + radius * Math.cos(angleInRadians)
// //     const y = cy - radius * Math.sin(angleInRadians)
// //     return { x, y }
// //   }

// //   const needleTip = getPointOnCircle(needleAngle, innerRadius * 0.6)

// //   return (
// //     <div
// //       className="bg-white rounded-lg shadow-md flex flex-col items-center p-1 overflow-hidden"
// //       style={{ width: 220, height: 155 }}
// //     >
// //       <h3 className="text-sm font-semibold text-gray-700 text-center mb-1">
// //         {title}
// //       </h3>

// //       <div className="relative" style={{ height: outerRadius + 10 }}>
// //         {" "}
// //         {/* Adjust height of this wrapper div */}
// //         <PieChart width={outerRadius * 2.1} height={outerRadius + 10}>
// //           {" "}
// //           {/* KEY CHANGE: Height reduced */}
// //           <Pie
// //             data={pieData}
// //             dataKey="value"
// //             startAngle={180}
// //             endAngle={0}
// //             innerRadius={innerRadius}
// //             outerRadius={outerRadius}
// //             paddingAngle={0}
// //             cornerRadius={5}
// //             labelLine={false}
// //             cx={cx}
// //             cy={cy}
// //           >
// //             {pieData.map((entry, index) => (
// //               <Cell key={`cell-${index}`} fill={entry.color} />
// //             ))}
// //           </Pie>
// //           <g>
// //             <line
// //               x1={cx}
// //               y1={cy}
// //               x2={needleTip.x}
// //               y2={needleTip.y}
// //               stroke="#60A5FA"
// //               strokeWidth={3}
// //               strokeLinecap="round"
// //             />
// //             <circle
// //               cx={cx}
// //               cy={cy}
// //               r={6}
// //               fill="#60A5FA"
// //               stroke="#3B82F6"
// //               strokeWidth={1.5}
// //             />
// //           </g>
// //         </PieChart>
// //       </div>

// //       {/* No negative margin needed anymore, use a small positive margin-top if desired */}
// //       <div className="text-sm font-bold text-gray-800 mt-1">{`${value} ${unit}`}</div>
// //     </div>
// //   )
// // }
// // export default GaugeChart

// // import React, { useEffect, useState } from 'react';

// // interface IGaugeChartProps {
// //   id?: string;
// //   percent: number;
// //   colors?: string[];
// //   arcPadding?: number;
// //   cornerRadius?: number;
// //   nrOfLevels?: number;
// //   needleColor?: string;
// //   needleBaseColor?: string;
// //   textColor?: string;
// //   formatTextValue?: (value: number) => string;
// // }

// // const CustomGaugeChart: React.FC<IGaugeChartProps> = ({
// //   id = "gauge-chart",
// //   percent,
// //   colors = ["#FF0000", "#FFFF00", "#00FF00"],
// //   arcPadding = 0.02,
// //   cornerRadius = 3,
// //   nrOfLevels = 20,
// //   needleColor = "#345243",
// //   needleBaseColor = "#345243",
// //   textColor = "#345243",
// //   formatTextValue = (value) => `${value}`
// // }) => {
// //   const [GaugeChart, setGaugeChart] = useState<any>(null);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const loadGaugeChart = async () => {
// //       try {
// //         const gaugeModule = await import('react-gauge-chart');
// //         setGaugeChart(() => gaugeModule.default);
// //       } catch (err) {
// //         console.error('Error importing react-gauge-chart:', err);
// //         setError('Failed to load GaugeChart');
// //       }
// //     };

// //     loadGaugeChart();
// //   }, []);

// //   if (error) return <div>{error}</div>;
// //   if (!GaugeChart) return <div>Loading...</div>;

// //   return (
// //     <GaugeChart
// //       id={id}
// //       percent={percent}
// //       colors={colors}
// //       arcPadding={arcPadding}
// //       cornerRadius={cornerRadius}
// //       nrOfLevels={nrOfLevels}
// //       needleColor={needleColor}
// //       needleBaseColor={needleBaseColor}
// //       textColor={textColor}
// //       formatTextValue={formatTextValue}
// //     />
// //   );
// // };

// // export default CustomGaugeChart;
