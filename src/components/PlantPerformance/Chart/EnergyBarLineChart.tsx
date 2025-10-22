import React, { useMemo } from "react"
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
  ChartOptions,
} from "chart.js"
import { Chart } from "react-chartjs-2"
import { EnergyCostChartAPIResponse } from "@/utils/types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
)

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
const LINE_COLOR = "#1E70BF"

interface Props {
  payload: EnergyCostChartAPIResponse
}

const EnergyBarLineChart: React.FC<Props> = ({ payload }) => {
  const { title, subtitle, data } = payload

  const labels = data.map((item) =>
    new Date(item.datetime).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
  )

  // Generate gradient colors for bars dynamically (one color per bar)
  const barColors = useMemo(() => generateGradientColors(GRADIENT_STOPS, data.length), [data.length])

  const chartData = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Energy Consumption (kWh)",
        data: data.map((d) => d.energyConsumption),
        backgroundColor: barColors,
        yAxisID: "y",
        order: 2, // bars below
      },
      {
        type: "line" as const,
        label: "Production Cost",
        data: data.map((d) => d.productionCost),
        borderColor: LINE_COLOR,
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        yAxisID: "y1",
        order: 1, // line on top
      },
    ],
  }
  const options: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" }, // changed from "top" to "bottom" here
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          y: {
            type: "linear",
            position: "left",
            title: { display: true, text: "kWh" },
            grid: {
              color: "#E5E7EB",
            },
            ticks: {
              color: "#6B7280",
              font: { size: 12 },
            },
          },
          y1: {
            type: "linear",
            position: "right",
            grid: { drawOnChartArea: false },
            title: { display: true, text: "Cost" },
            ticks: {
              color: "#6B7280",
              font: { size: 12 },
            },
          },
          x: {
            ticks: {
              color: "#6B7280",
              font: { size: 12 },
              maxRotation: 45,
            },
            grid: { display: false },
          },
        },
      }


  return (
    <div className="w-full bg-white rounded-xl border border-gray-300 shadow-md p-2">
      <h2 className="text-sm font-bold justify-start">{title}</h2>
      {subtitle && (
        <p className="text-sm text-gray-500 mb-4 justify-start">{subtitle}</p>
      )}

      <div className="h-[250px] w-full">
        <Chart type="bar" data={chartData} options={options} />
      </div>
    </div>
  )
}

export default EnergyBarLineChart




//250925
// // components/EnergyBarLineChart.tsx

// import React from "react"
// import {
//   Chart as ChartJS,
//   BarElement,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Legend,
//   Tooltip,
// } from "chart.js"
// import { Chart } from "react-chartjs-2"
// import { EnergyCostChartAPIResponse } from "@/utils/types"

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   LineElement,
//   PointElement,
//   Tooltip,
//   Legend,
// )

// interface Props {
//   payload: EnergyCostChartAPIResponse
// }

// const EnergyBarLineChart: React.FC<Props> = ({ payload }) => {
//   const { title, subtitle, data } = payload

//   const labels = data.map((item) =>
//     new Date(item.datetime).toLocaleDateString("en-US", {
//       month: "short",
//       year: "numeric",
//     }),
//   )

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         type: "bar" as const,
//         label: "Energy Consumption (kWh)",
//         data: data.map((d) => d.energyConsumption),
//         backgroundColor: "#00BFFF",
//         yAxisID: "y",
//         order: 2, // <-- bars below
//       },
//       {
//         type: "line" as const,
//         label: "Production Cost",
//         data: data.map((d) => d.productionCost),
//         borderColor: "#FF8C00",
//         borderWidth: 2,
//         fill: false,
//         tension: 0.4,
//         yAxisID: "y1",
//         order: 1, // <-- line on top
//       },
//     ],
//   }

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false as const,
//     plugins: {
//       legend: { position: "top" as const },
//       tooltip: { mode: "index" as const, intersect: false },
//     },
//     scales: {
//       y: {
//         type: "linear" as const,
//         position: "left" as const,
//         title: { display: true, text: "kWh" },
//       },
//       y1: {
//         type: "linear" as const,
//         position: "right" as const,
//         grid: { drawOnChartArea: false },
//         title: { display: true, text: "Cost" },
//       },
//     },
//   }

//   return (
//     <div className="bg-white p-4 rounded shadow w-full">
//       <h2 className="text-lg font-bold text-center">{title}</h2>
//       {subtitle && (
//         <p className="text-center text-sm text-gray-500 mb-4">{subtitle}</p>
//       )}

//       <div className="h-[400px] w-full">
//         <Chart type="bar" data={chartData} options={options} />
//       </div>
//     </div>
//   )
// }

// export default EnergyBarLineChart
