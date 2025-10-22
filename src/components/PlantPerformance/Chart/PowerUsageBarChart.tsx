import Select from "@/components/Select"
import React, { useState, useMemo } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js"
import { Bar } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Helper: convert hex to RGB array
const hexToRgb = (hex: string): [number, number, number] =>
  hex
    .replace(/^#/, "")
    .match(/.{2}/g)!
    .map((x) => parseInt(x, 16)) as [number, number, number]

// Helper: convert RGB array to hex string
const rgbToHex = (rgb: [number, number, number]): string =>
  "#" +
  rgb
    .map((x) => {
      const hex = x.toString(16)
      return hex.length === 1 ? "0" + hex : hex
    })
    .join("")

// Linear interpolate between two numbers
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// Interpolate between two RGB colors
const interpolateColor = (
  start: [number, number, number],
  end: [number, number, number],
  t: number,
): [number, number, number] => {
  return [
    Math.round(lerp(start[0], end[0], t)),
    Math.round(lerp(start[1], end[1], t)),
    Math.round(lerp(start[2], end[2], t)),
  ]
}

// Generate gradient colors evenly spaced across the gradient stops
const generateGradientColors = (
  gradientStops: string[],
  count: number,
): string[] => {
  if (count <= 0) return []
  if (count === 1) return [gradientStops[0]]

  const rgbStops = gradientStops.map(hexToRgb)
  const sections = rgbStops.length - 1
  const colors: string[] = []

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    const sectionIndex = Math.min(Math.floor(t * sections), sections - 1)
    const sectionT = (t - sectionIndex / sections) * sections
    const colorRgb = interpolateColor(rgbStops[sectionIndex], rgbStops[sectionIndex + 1], sectionT)
    colors.push(rgbToHex(colorRgb))
  }

  return colors
}

const GRADIENT_STOPS = ["#010810", "#08437C", "#1E70BF", "#5E9CD9", "#D9EBFD"]

export type PowerUsageBarChartProps = {
  title: string
  dataByDuration: {
    [key: string]: {
      date: string
      value: number
    }[]
  }
  yAxisLabel?: string
  className?: string
  height?: number
}

const PowerUsageBarChart: React.FC<PowerUsageBarChartProps> = ({
  title,
  dataByDuration,
  yAxisLabel = "Power (kW)",
  className = "",
  height = 250,
}) => {
  const durations = Object.keys(dataByDuration)
  const [selectedDuration, setSelectedDuration] = useState(durations[0])

  const chartDataRaw = dataByDuration[selectedDuration] || []

  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    } else {
      return value.toFixed(1)
    }
  }

  // Generate gradient colors dynamically based on number of bars
  const gradientColors = useMemo(
    () => generateGradientColors(GRADIENT_STOPS, chartDataRaw.length),
    [chartDataRaw.length],
  )

  const data = {
    labels: chartDataRaw.map((item) => item.date),
    datasets: [
      {
        label: yAxisLabel,
        data: chartDataRaw.map((item) => item.value),
        backgroundColor: gradientColors,
        borderColor: gradientColors,
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${formatValue(context.parsed.y)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          callback: function (value) {
            return formatValue(value as number)
          },
        },
        title: {
          display: true,
          text: yAxisLabel,
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 1000,
    },
  }

  return (
    <div
      className={`w-full bg-white border border-gray-300 shadow-md rounded-xl ${className}`}
    >
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm justify-start font-semibold text-gray-900">{title}</h2>
          <Select
            defaultValue={selectedDuration}
            onValueChange={setSelectedDuration}
          >
            <Select.Trigger className="w-20" />
            <Select.Content>
              {durations.map((duration) => (
                <Select.Item key={duration} value={duration}>
                  {duration}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <div style={{ height: `${height}px` }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  )
}

export default PowerUsageBarChart




//250925
// // components/PowerUsageBarChart.tsx (Chart.js Version)

// import Select from "@/components/Select"
// import React, { useState } from "react"
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartOptions,
// } from "chart.js"
// import { Bar } from "react-chartjs-2"

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// export type PowerUsageBarChartProps = {
//   title: string
//   dataByDuration: {
//     [key: string]: {
//       date: string
//       value: number
//     }[]
//   }
//   yAxisLabel?: string
//   className?: string
//   height?: number
// }

// const PowerUsageBarChart: React.FC<PowerUsageBarChartProps> = ({
//   title,
//   dataByDuration,
//   yAxisLabel = "Power (kW)",
//   className = "",
//   height = 350,
// }) => {
//   const durations = Object.keys(dataByDuration)
//   const [selectedDuration, setSelectedDuration] = useState(durations[0])

//   const chartData = dataByDuration[selectedDuration] || []

//   const formatValue = (value: number): string => {
//     if (value >= 1000000) {
//       return `${(value / 1000000).toFixed(1)}M`
//     } else if (value >= 1000) {
//       return `${(value / 1000).toFixed(1)}K`
//     } else {
//       return value.toFixed(1)
//     }
//   }

//   const data = {
//     labels: chartData.map((item) => item.date),
//     datasets: [
//       {
//         label: yAxisLabel,
//         data: chartData.map((item) => item.value),
//         backgroundColor: "rgba(99, 102, 241, 0.8)",
//         borderColor: "rgba(99, 102, 241, 1)",
//         borderWidth: 1,
//         borderRadius: 6,
//         borderSkipped: false,
//       },
//     ],
//   }

//   const options: ChartOptions<"bar"> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         backgroundColor: "rgba(0, 0, 0, 0.8)",
//         titleColor: "#ffffff",
//         bodyColor: "#ffffff",
//         borderColor: "#e5e7eb",
//         borderWidth: 1,
//         cornerRadius: 8,
//         padding: 12,
//         callbacks: {
//           label: function (context) {
//             return `${context.dataset.label}: ${formatValue(context.parsed.y)}`
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//         ticks: {
//           color: "#6B7280",
//           font: {
//             size: 12,
//           },
//         },
//       },
//       y: {
//         grid: {
//           color: "#E5E7EB",
//         },
//         ticks: {
//           color: "#6B7280",
//           font: {
//             size: 12,
//           },
//           callback: function (value) {
//             return formatValue(value as number)
//           },
//         },
//         title: {
//           display: true,
//           text: yAxisLabel,
//           color: "#6B7280",
//           font: {
//             size: 12,
//           },
//         },
//       },
//     },
//     animation: {
//       duration: 1000,
//     },
//   }

//   return (
//     <div
//       className={`w-full bg-white border border-gray-200 shadow-sm rounded-xl ${className}`}
//     >
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//           <Select
//             defaultValue={selectedDuration}
//             onValueChange={setSelectedDuration}
//           >
//             <Select.Trigger className="w-40" />
//             <Select.Content>
//               {durations.map((duration) => (
//                 <Select.Item key={duration} value={duration}>
//                   {duration}
//                 </Select.Item>
//               ))}
//             </Select.Content>
//           </Select>
//         </div>

//         <div style={{ height: `${height}px` }}>
//           <Bar data={data} options={options} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PowerUsageBarChart
