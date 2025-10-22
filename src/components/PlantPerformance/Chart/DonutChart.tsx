import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { AverageEnergyChartAPIResponse } from "@/utils/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  payload: AverageEnergyChartAPIResponse;
  className?: string;
  showLegend?: boolean;
  height?: number;
}

// Helper: convert hex to RGB array
const hexToRgb = (hex: string): [number, number, number] =>
  hex
    .replace(/^#/, "")
    .match(/.{2}/g)!
    .map((x) => parseInt(x, 16)) as [number, number, number];

// Helper: convert RGB array to hex string
const rgbToHex = (rgb: [number, number, number]): string =>
  "#" +
  rgb
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

// Linear interpolate between two numbers
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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
  ];
};

// Generate colors across the gradient stops evenly
const generateGradientColors = (
  gradientStops: string[],
  count: number,
): string[] => {
  if (count <= 0) return [];
  if (count === 1) return [gradientStops[0]];

  const rgbStops = gradientStops.map(hexToRgb);
  const sections = rgbStops.length - 1;
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const sectionIndex = Math.min(Math.floor(t * sections), sections - 1);
    const sectionT = (t - sectionIndex / sections) * sections;
    const colorRgb = interpolateColor(rgbStops[sectionIndex], rgbStops[sectionIndex + 1], sectionT);
    colors.push(rgbToHex(colorRgb));
  }

  return colors;
};

const GRADIENT_STOPS = ["#010810", "#08437C", "#1E70BF", "#5E9CD9", "#D9EBFD"];

const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  } else {
    return value.toFixed(1);
  }
};

const DonutChart: React.FC<DonutChartProps> = ({
  payload,
  className = "",
  showLegend = true,
  height = 160,
}) => {
  const { title, subtitle, data } = payload;
  const labels = Object.keys(data);
  const values = Object.values(data);
  const totalValue = values.reduce((sum, value) => sum + value, 0);

  // Use dynamic gradient colors across slices
  const backgroundColors = generateGradientColors(GRADIENT_STOPS, labels.length);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Energy Consumption",
        data: values,
        backgroundColor: backgroundColors,
        borderColor: "#fff", // white divisions between segments
        borderWidth: 2,
        hoverBackgroundColor: backgroundColors.map((color) => color),
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "40%",
    layout: {
      padding: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.95)",
        titleColor: "#f3f4f6",
        bodyColor: "#f3f4f6",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        titleFont: {
          size: 12,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function (tooltipItem: any) {
            const label = labels[tooltipItem.dataIndex] || "";
            const value = values[tooltipItem.dataIndex] || 0;
            const percentage = ((value / totalValue) * 100).toFixed(1);
            return [`${label}`, `${formatValue(value)} kWh`, `${percentage}% of total`];
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 900,
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <div
      className={`relative bg-white rounded-xl border border-gray-300 shadow-md w-full ${className} p-2`}
    >
      {/* Header */}
      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-0.5">{title}</h4>
        {subtitle && (
          <div className="text-sm text-gray-500 mb-2">
            {subtitle}
          </div>
        )}
      </div>
      {/* Chart Section */}
      <div className="flex flex-col items-center justify-center mt-1 mb-2">
        <div
          style={{ height: `${height}px`, width: `${height}px` }}
          className="relative"
        >
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
      {/* Custom Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-x-2 gap-y-2 justify-start items-center mt-2 px-1">
          {labels.map((label, i) => (
            <div key={label} className="flex items-center text-sm">
              <span
                className="inline-block rounded-full border border-gray-300 mr-1"
                style={{
                  width: 11,
                  height: 11,
                  background: backgroundColors[i],
                }}
              />
              <span className="text-gray-700 font-base mr-1">{label}</span>
              <span className="text-xs text-gray-400 ml-0.5">
                {((values[i] / totalValue) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
      {/* Stats Section */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex flex-row justify-between text-sm gap-2">
          {/* <div>
            <span className="text-gray-500">Total</span>
            <span className="ml-2 font-semibold text-gray-800">
              {formatValue(totalValue)} kWh
            </span>
          </div> */}
          <div>
            <span className="text-gray-500">Categories</span>
            <span className="ml-2 font-semibold text-gray-800">
              {labels.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;



//250925
// // components/DonutChart.tsx

// import React from "react"
// import { Doughnut } from "react-chartjs-2"
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
// import { AverageEnergyChartAPIResponse } from "@/utils/types"

// ChartJS.register(ArcElement, Tooltip, Legend)

// interface DonutChartProps {
//   payload: AverageEnergyChartAPIResponse
//   className?: string
//   showLegend?: boolean
//   height?: number
// }

// /**
//  * Generates a dynamic color palette based on HSL color space
//  */
// const generateDynamicColors = (count: number): string[] => {
//   const colors: string[] = []
//   const hueStep = 360 / count

//   for (let i = 0; i < count; i++) {
//     const hue = (i * hueStep) % 360
//     const saturation = 65 + (i % 3) * 10 // 65%, 75%, 85%
//     const lightness = 45 + (i % 2) * 10 // 45%, 55%
//     colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
//   }

//   return colors
// }

// /**
//  * Generates border colors (slightly darker than background)
//  */
// const generateBorderColors = (backgroundColors: string[]): string[] => {
//   return backgroundColors.map((color) => {
//     const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
//     if (hslMatch) {
//       const [, h, s, l] = hslMatch
//       const darkerL = Math.max(0, parseInt(l) - 15)
//       return `hsl(${h}, ${s}%, ${darkerL}%)`
//     }
//     return color
//   })
// }

// /**
//  * Formats numbers with appropriate units and decimal places
//  */
// const formatValue = (value: number): string => {
//   if (value >= 1000000) {
//     return `${(value / 1000000).toFixed(1)}M`
//   } else if (value >= 1000) {
//     return `${(value / 1000).toFixed(1)}K`
//   } else {
//     return value.toFixed(1)
//   }
// }

// const DonutChart: React.FC<DonutChartProps> = ({
//   payload,
//   className = "",
//   showLegend = true,
//   height = 300,
// }) => {
//   const { title, subtitle, data } = payload

//   const labels = Object.keys(data)
//   const values = Object.values(data)
//   const totalValue = values.reduce((sum, value) => sum + value, 0)

//   // Generate dynamic colors based on data length
//   const backgroundColors = generateDynamicColors(labels.length)
//   const borderColors = generateBorderColors(backgroundColors)

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: "Energy Consumption",
//         data: values,
//         backgroundColor: backgroundColors,
//         borderColor: borderColors,
//         borderWidth: 2,
//         hoverBackgroundColor: backgroundColors.map((color) => {
//           const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
//           if (hslMatch) {
//             const [, h, s, l] = hslMatch
//             const lighterL = Math.min(100, parseInt(l) + 10)
//             return `hsl(${h}, ${s}%, ${lighterL}%)`
//           }
//           return color
//         }),
//         hoverBorderWidth: 3,
//       },
//     ],
//   }

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "60%",
//     layout: {
//       padding: {
//         left: 20,
//         right: 20,
//         top: 20,
//         bottom: 20,
//       },
//     },
//     plugins: {
//       legend: {
//         display: showLegend,
//         position: "right" as const,
//         align: "center" as const,
//         labels: {
//           padding: 15,
//           usePointStyle: true,
//           pointStyle: "circle",
//           boxWidth: 12,
//           boxHeight: 12,
//           font: {
//             size: 11,
//             family: "'Inter', 'Segoe UI', sans-serif",
//           },
//           color: "#374151",
//           generateLabels: (chart: any) => {
//             const data = chart.data
//             if (data.labels.length && data.datasets.length) {
//               return data.labels.map((label: string, i: number) => {
//                 const value = data.datasets[0].data[i]
//                 const percentage = ((value / totalValue) * 100).toFixed(1)
//                 return {
//                   text: `${label} (${percentage}%)`,
//                   fillStyle: data.datasets[0].backgroundColor[i],
//                   strokeStyle: data.datasets[0].borderColor[i],
//                   lineWidth: data.datasets[0].borderWidth,
//                   hidden: false,
//                   index: i,
//                 }
//               })
//             }
//             return []
//           },
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
//         titleFont: {
//           size: 14,
//           weight: "bold" as const,
//         },
//         bodyFont: {
//           size: 13,
//         },
//         callbacks: {
//           label: function (tooltipItem: any) {
//             const label = labels[tooltipItem.dataIndex] || ""
//             const value = values[tooltipItem.dataIndex] || 0
//             const percentage = ((value / totalValue) * 100).toFixed(1)
//             return [
//               `${label}`,
//               `${formatValue(value)} kWh`,
//               `${percentage}% of total`,
//             ]
//           },
//         },
//       },
//     },
//     animation: {
//       animateRotate: true,
//       animateScale: true,
//       duration: 1000,
//     },
//     interaction: {
//       intersect: false,
//       mode: "index" as const,
//     },
//   }

//   return (
//     <div
//       className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
//     >
//       <div className="p-6">
//         {/* Header Section */}
//         <div className="mb-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
//           {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
//         </div>

//         {/* Chart Container with Proper Layout */}
//         <div className="flex items-center justify-center">
//           <div className="relative flex items-center">
//             {/* Chart Section */}
//             <div
//               style={{ height: `${height}px`, width: `${height}px` }}
//               className="relative"
//             >
//               <Doughnut data={chartData} options={options} />

//               {/* Center Value Display - Properly positioned 
//               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                
//                 <div className="text-center">
                  
//                   <div className="text-xl font-bold text-gray-900">
//                     {formatValue(totalValue)}
//                   </div>

//                   <div className="text-xs text-gray-500 mt-1">
//                     Total kWh
//                   </div>
//                 </div>
//               </div>
//               */}
//             </div>
//           </div>
//         </div>

//         {/* Summary Stats */}
//         <div className="mt-6 pt-4 border-t border-gray-100">
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <span className="text-gray-500">Total Consumption:</span>
//               <span className="ml-2 font-medium text-gray-900">
//                 {formatValue(totalValue)} kWh
//               </span>
//             </div>
//             <div>
//               <span className="text-gray-500">Categories:</span>
//               <span className="ml-2 font-medium text-gray-900">
//                 {labels.length}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DonutChart
