import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

interface PowerSpikesProps {
  title?: string;
  height?: number;
}

interface PowerDataPoint {
  timestamp: string; // full date + time string
  power: number;
  displayTime: string; // time only for x-axis
  displayDate: string; // date only for legend
}

const generateDataPoint = (): PowerDataPoint => {
  const now = new Date();
  const timestamp = now.toLocaleString("en-GB", { hour12: false }).replace(",", "");
  const power = parseFloat((Math.random() * 2 + 4).toFixed(2)); // 4 to 6 range
  const displayTime = now.toLocaleTimeString("en-GB", { hour12: false });
  const displayDate = now.toLocaleDateString("en-GB");
  return { timestamp, power, displayTime, displayDate };
};

const HomepageDynamicPowerSpikesLive = ({
  title = "Power Spikes",
  height = 250,
}: PowerSpikesProps) => {
  const [data, setData] = useState<PowerDataPoint[]>([]);

  useEffect(() => {
    const initialData: PowerDataPoint[] = Array.from({ length: 10 }, (_, i) => {
      const past = new Date(Date.now() - (9 - i) * 3000);
      const timestamp = past.toLocaleString("en-GB", { hour12: false }).replace(",", "");
      const power = parseFloat((Math.random() * 2 + 4).toFixed(2));
      const displayTime = past.toLocaleTimeString("en-GB", { hour12: false });
      const displayDate = past.toLocaleDateString("en-GB");
      return { timestamp, power, displayTime, displayDate };
    });

    setData(initialData);

    const interval = setInterval(() => {
      setData((prev) => {
        const newPoint = generateDataPoint();
        const updated = [...prev, newPoint].slice(-10);
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const latestDate = data.length > 0 ? data[data.length - 1].displayDate : "";

  const chartData = {
    labels: data.map((d) => d.displayTime),
    datasets: [
      {
        label: "Power (kWh)",
        data: data.map((d) => d.power),
        fill: true,
        backgroundColor: "rgba(30, 112, 191, 0.4)", // lighter shade of the line color
        borderColor: "#1E70BF", // updated line chart color
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#1E70BF",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 0,
          maxTicksLimit: 10,
          color: "#6B7280",
        },
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Time (HH:mm:ss)",
          color: "#6B7280",
          font: {
            size: 11,
          },
        },
      },
      y: {
        min: 3.5,
        max: 6.5,
        ticks: {
          font: {
            size: 10,
          },
          color: "#6B7280",
        },
        grid: {
          color: "#E5E7EB",
        },
        title: {
          display: true,
          text: "Power (kWh)",
          color: "#6B7280",
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y} kWh`;
          },
          labelTextColor: () => "#ffffff",
        },
      },
    },
  };

  return (
    <div className="relative bg-white rounded-xl border border-gray-300 shadow-md max-w-md w-full p-2">
      <h2 className="text-sm font-semibold text-gray-800 justify-start">{title}</h2>
      <p className="text-start text-gray-700 text-xs mb-2">Date: {latestDate}</p>
      <div style={{ width: "100%", height }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HomepageDynamicPowerSpikesLive;


// //HomepageDynamicPowerSpikesLive

// import React, { useEffect, useState, useRef, useCallback } from "react"
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend,
// } from "chart.js"
// import { Line } from "react-chartjs-2"

// // Register required Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend,
// )

// interface PowerSpikesProps {
//   title?: string
//   height?: number
// }

// interface PowerDataPoint {
//   timestamp: string // full date + time string
//   power: number
//   displayTime: string // time only for x-axis
//   displayDate: string // date only for legend
// }

// const generateDataPoint = (): PowerDataPoint => {
//   const now = new Date()
//   const timestamp = now
//     .toLocaleString("en-GB", { hour12: false })
//     .replace(",", "")
//   const power = parseFloat((Math.random() * 2 + 4).toFixed(2)) // 4 to 6 range
//   const displayTime = now.toLocaleTimeString("en-GB", { hour12: false })
//   const displayDate = now.toLocaleDateString("en-GB")
//   return { timestamp, power, displayTime, displayDate }
// }

// const HomepageDynamicPowerSpikesLive = ({
//   title = "Power Spikes",
//   height = 300,
// }: PowerSpikesProps) => {
//   const [data, setData] = useState<PowerDataPoint[]>([])

//   useEffect(() => {
//     // Initialize with 10 points spaced 3 seconds apart (past 30 seconds)
//     const initialData: PowerDataPoint[] = Array.from({ length: 10 }, (_, i) => {
//       const past = new Date(Date.now() - (9 - i) * 3000)
//       const timestamp = past
//         .toLocaleString("en-GB", { hour12: false })
//         .replace(",", "")
//       const power = parseFloat((Math.random() * 2 + 4).toFixed(2))
//       const displayTime = past.toLocaleTimeString("en-GB", { hour12: false })
//       const displayDate = past.toLocaleDateString("en-GB")
//       return { timestamp, power, displayTime, displayDate }
//     })

//     setData(initialData)

//     const interval = setInterval(() => {
//       setData((prev) => {
//         const newPoint = generateDataPoint()
//         const updated = [...prev, newPoint].slice(-10) // Keep last 10
//         return updated
//       })
//     }, 3000) // every 3 seconds

//     return () => clearInterval(interval)
//   }, [])

//   const latestDate = data.length > 0 ? data[data.length - 1].displayDate : ""

//   const chartData = {
//     labels: data.map((d) => d.displayTime), // time only on x-axis
//     datasets: [
//       {
//         label: "Power (kWh)",
//         data: data.map((d) => d.power),
//         fill: true,
//         backgroundColor: "rgba(14, 165, 233, 0.4)", // similar to #0ea5e9 with transparency
//         borderColor: "#0ea5e9",
//         borderWidth: 2,
//         tension: 0.4,
//         pointRadius: 0,
//         pointHoverRadius: 6,
//         pointHoverBackgroundColor: "#0ea5e9",
//         pointHoverBorderColor: "#ffffff",
//         pointHoverBorderWidth: 2,
//       },
//     ],
//   }

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         ticks: {
//           font: {
//             size: 10,
//           },
//           maxRotation: 45,
//           minRotation: 0,
//           maxTicksLimit: 10,
//           color: "#6B7280", // Tailwind gray-500
//         },
//         grid: {
//           display: false,
//         },
//         title: {
//           display: true,
//           text: "Time (HH:mm:ss)",
//           color: "#6B7280",
//           font: {
//             size: 11,
//           },
//         },
//       },
//       y: {
//         min: 3.5,
//         max: 6.5,
//         ticks: {
//           font: {
//             size: 10,
//           },
//           color: "#6B7280",
//         },
//         grid: {
//           color: "#E5E7EB",
//         },
//         title: {
//           display: true,
//           text: "Power (kWh)",
//           color: "#6B7280",
//           font: {
//             size: 11,
//           },
//         },
//       },
//     },
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
//           label: function (context: any) {
//             return `${context.dataset.label}: ${context.parsed.y} kWh`
//           },
//           labelTextColor: () => "#ffffff",
//         },
//       },
//     },
//   }

//   return (
//     <div className="bg-white shadow-md border border-slate-200 rounded p-2">
//       <h2 className="text-xs font-bold text-center mb-1">{title}</h2>
//       <p className="text-center text-gray-500 text-xs mb-2">
//         Date: {latestDate}
//       </p>
//       <div style={{ width: "100%", height }}>
//         <Line data={chartData} options={options} />
//       </div>
//     </div>
//   )
// }

// export default HomepageDynamicPowerSpikesLive

