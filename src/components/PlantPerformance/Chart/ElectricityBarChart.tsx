import React, { useMemo } from "react"
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
import { ElectricityChartData } from "@/utils/types"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ElectricityBarChartProps {
  title: string
  data: ElectricityChartData[]
  className?: string
  height?: number
  subtitle?: string
}

const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  } else {
    return value.toFixed(1)
  }
}

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
const interpolateColor = (start: [number, number, number], end: [number, number, number], t: number) => {
  return [
    Math.round(lerp(start[0], end[0], t)),
    Math.round(lerp(start[1], end[1], t)),
    Math.round(lerp(start[2], end[2], t)),
  ] as [number, number, number]
}

// Given an array of gradient stops and count, returns count evenly spaced colors in hex
const generateGradientColors = (gradientStops: string[], count: number): string[] => {
  if (count <= 0) return []

  if (count === 1) return [gradientStops[0]]

  const rgbStops = gradientStops.map(hexToRgb)

  const sections = rgbStops.length - 1
  const colors: string[] = []

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1) // 0 to 1
    // Find which section of gradient this falls into
    const sectionIndex = Math.min(Math.floor(t * sections), sections - 1)
    const sectionT = (t - sectionIndex / sections) * sections
    const colorRgb = interpolateColor(rgbStops[sectionIndex], rgbStops[sectionIndex + 1], sectionT)
    colors.push(rgbToHex(colorRgb))
  }

  return colors
}

const GRADIENT_STOPS = ["#010810", "#08437C", "#1E70BF", "#5E9CD9", "#D9EBFD"]

const ElectricityBarChart: React.FC<ElectricityBarChartProps> = ({
  title,
  data,
  className = "",
  height = 250,
  subtitle,
}) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return null

    const formattedData = data.map((entry) => {
      const mergedCategories = entry.categories.reduce<Record<string, number>>(
        (acc, curr) => ({ ...acc, ...curr }),
        {},
      )
      return { date: entry.date, ...mergedCategories } as {
        date: string
      } & Record<string, number>
    })

    const uniqueKeys = Array.from(
      new Set(
        data.flatMap((entry) => entry.categories.map((c) => Object.keys(c)[0])),
      ),
    )

    const colors = generateGradientColors(GRADIENT_STOPS, uniqueKeys.length)

    return {
      labels: formattedData.map((item) => item.date),
      datasets: uniqueKeys.map((key, index) => ({
        label: key,
        data: formattedData.map((item) => item[key] || 0),
        backgroundColor: colors[index],
        borderColor: colors[index],
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      })),
    }
  }, [data])

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "rect",
          font: {
            size: 12,
            family: "'Inter', 'Segoe UI', sans-serif",
          },
          color: "#374151",
        },
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
            return `${context.dataset.label}: ${formatValue(
              context.parsed.y,
            )} kWh`
          },
          footer: function (tooltipItems) {
            const total = tooltipItems.reduce(
              (sum, item) => sum + item.parsed.y,
              0,
            )
            return `Total: ${formatValue(total)} kWh`
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
          maxRotation: 45,
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
          text: "Consumption (kWh)",
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

  if (!chartData) {
    return (
      <div
        className={`w-full bg-white border border-gray-300 shadow-md rounded-xl ${className}`}
      >
        <div className="p-6 text-center">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`w-full bg-white border border-gray-300 shadow-md rounded-xl ${className}`}
    >
      <div className="p-2">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div style={{ height: `${height}px` }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}

export default ElectricityBarChart






//250925
// import React, { useMemo } from "react"
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
// import { ElectricityChartData } from "@/utils/types"

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// interface ElectricityBarChartProps {
//   title: string
//   data: ElectricityChartData[]
//   className?: string
//   height?: number
//   subtitle?: string
// }

// /**
//  * Generates dynamic colors using HSL color space
//  */
// const generateDynamicColors = (count: number): string[] => {
//   const colors: string[] = []
//   const hueStep = 360 / count

//   for (let i = 0; i < count; i++) {
//     const hue = (i * hueStep) % 360
//     const saturation = 60 + (i % 4) * 10
//     const lightness = 45 + (i % 3) * 10
//     colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
//   }

//   return colors
// }

// const formatValue = (value: number): string => {
//   if (value >= 1000000) {
//     return `${(value / 1000000).toFixed(1)}M`
//   } else if (value >= 1000) {
//     return `${(value / 1000).toFixed(1)}K`
//   } else {
//     return value.toFixed(1)
//   }
// }

// const ElectricityBarChart: React.FC<ElectricityBarChartProps> = ({
//   title,
//   data,
//   className = "",
//   height = 400,
//   subtitle,
// }) => {
//   const chartData = useMemo(() => {
//     if (!data || data.length === 0) return null

//     // Convert nested category structure to flat objects
//     const formattedData = data.map((entry) => {
//       const mergedCategories = entry.categories.reduce<Record<string, number>>(
//         (acc, curr) => ({ ...acc, ...curr }),
//         {},
//       )
//       return { date: entry.date, ...mergedCategories } as {
//         date: string
//       } & Record<string, number>
//     })

//     // Get all unique category keys
//     const uniqueKeys = Array.from(
//       new Set(
//         data.flatMap((entry) => entry.categories.map((c) => Object.keys(c)[0])),
//       ),
//     )

//     const colors = generateDynamicColors(uniqueKeys.length)

//     return {
//       labels: formattedData.map((item) => item.date),
//       datasets: uniqueKeys.map((key, index) => ({
//         label: key,
//         data: formattedData.map((item) => item[key] || 0),
//         backgroundColor: colors[index],
//         borderColor: colors[index],
//         borderWidth: 1,
//         borderRadius: 4,
//         borderSkipped: false,
//       })),
//     }
//   }, [data])

//   const options: ChartOptions<"bar"> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           padding: 20,
//           usePointStyle: true,
//           pointStyle: "rect",
//           font: {
//             size: 12,
//             family: "'Inter', 'Segoe UI', sans-serif",
//           },
//           color: "#374151",
//         },
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
//             return `${context.dataset.label}: ${formatValue(
//               context.parsed.y,
//             )} kWh`
//           },
//           footer: function (tooltipItems) {
//             const total = tooltipItems.reduce(
//               (sum, item) => sum + item.parsed.y,
//               0,
//             )
//             return `Total: ${formatValue(total)} kWh`
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
//           maxRotation: 45,
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
//           text: "Consumption (kWh)",
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

//   if (!chartData) {
//     return (
//       <div
//         className={`w-full bg-white border border-gray-200 shadow-sm rounded-xl ${className}`}
//       >
//         <div className="p-6 text-center">
//           <p className="text-gray-500">No data available</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div
//       className={`w-full bg-white border border-gray-200 shadow-sm rounded-xl ${className}`}
//     >
//       <div className="p-6">
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
//           {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
//         </div>

//         <div style={{ height: `${height}px` }}>
//           <Bar data={chartData} options={options} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ElectricityBarChart

// // // components/ElectricityBarChart.tsx
// // import React from "react"
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts"
// // import { ElectricityChartData } from "@/utils/types"

// // // color generator for consistent unique colors
// // const dynamicColors: string[] = [
// //   "#3366CC",
// //   "#DC3912",
// //   "#FF9900",
// //   "#109618",
// //   "#990099",
// //   "#3B3EAC",
// //   "#0099C6",
// //   "#DD4477",
// //   "#66AA00",
// //   "#B82E2E",
// //   "#316395",
// //   "#994499",
// //   "#22AA99",
// //   "#AAAA11",
// //   "#6633CC",
// // ]

// // interface ElectricityBarChartProps {
// //   title: string
// //   data: ElectricityChartData[]
// // }

// // const ElectricityBarChart: React.FC<ElectricityBarChartProps> = ({
// //   title,
// //   data,
// // }) => {
// //   if (!data || data.length === 0) return <div>No data available</div>

// //   // Convert nested category structure to flat objects
// //   const formattedData = data.map((entry) => {
// //     const mergedCategories = entry.categories.reduce(
// //       (acc, curr) => ({ ...acc, ...curr }),
// //       {},
// //     )
// //     return { date: entry.date, ...mergedCategories }
// //   })

// //   // Get all unique category keys
// //   const uniqueKeys = Array.from(
// //     new Set(
// //       data.flatMap((entry) => entry.categories.map((c) => Object.keys(c)[0])),
// //     ),
// //   )

// //   return (
// //     <div className="bg-white p-4 rounded shadow-md">
// //       <h2 className="text-lg font-semibold mb-4">{title}</h2>
// //       <ResponsiveContainer width="100%" height={350}>
// //         <BarChart data={formattedData}>
// //           <XAxis dataKey="date" />
// //           <YAxis />
// //           <Tooltip />
// //           <Legend />
// //           {uniqueKeys.map((key, index) => (
// //             <Bar
// //               key={key}
// //               dataKey={key}
// //               fill={dynamicColors[index % dynamicColors.length]}
// //               name={key}
// //             />
// //           ))}
// //         </BarChart>
// //       </ResponsiveContainer>
// //     </div>
// //   )
// // }

// // export default ElectricityBarChart
