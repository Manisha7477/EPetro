import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { useRef, useEffect, useState } from "react"

const ProductBatchEfficiencyChart = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const products = [
    "Brownies",
    "Butter\nCookies",
    "Chocolate\nCookies",
    "Gingers-\nnaps",
    "Lemon\nCookies",
    "Shortbread\nCookies",
    "Snickerdoo-\ndles",
    "Sugar\nCookies",
    "Wafers",
    "Wafers",
  ]

  const purpleData = [
    { product: "Brownies", value: 1.3, x: 0 },
    { product: "Brownies", value: 1.15, x: 0 },
    { product: "Butter\nCookies", value: 1.6, x: 1 },
    { product: "Butter\nCookies", value: 1.55, x: 1 },
    { product: "Chocolate\nCookies", value: 1.25, x: 2 },
    { product: "Chocolate\nCookies", value: 1.13, x: 2 },
    { product: "Gingers-\nnaps", value: 1.3, x: 3 },
    { product: "Gingers-\nnaps", value: 1.2, x: 3 },
    { product: "Lemon\nCookies", value: 1.02, x: 4 },
    { product: "Shortbread\nCookies", value: 1.25, x: 5 },
    { product: "Shortbread\nCookies", value: 1.2, x: 5 },
    { product: "Snickerdoo-\ndles", value: 1.25, x: 6 },
    { product: "Snickerdoo-\ndles", value: 1.15, x: 6 },
    { product: "Sugar\nCookies", value: 1.25, x: 7 },
    { product: "Sugar\nCookies", value: 1.15, x: 7 },
    { product: "Wafers", value: 1.15, x: 8 },
    { product: "Wafers", value: 1.05, x: 8 },
    { product: "Wafers", value: 1.1, x: 9 },
    { product: "Wafers", value: 1.05, x: 9 },
  ]

  // Cyan dots (lower values)
  const cyanData = [
    { product: "Brownies", value: 0.85, x: 0 },
    { product: "Brownies", value: 0.58, x: 0 },
    { product: "Butter\nCookies", value: 0.85, x: 1 },
    { product: "Chocolate\nCookies", value: 0.72, x: 2 },
    { product: "Chocolate\nCookies", value: 0.63, x: 2 },
    { product: "Gingers-\nnaps", value: 0.71, x: 3 },
    { product: "Lemon\nCookies", value: 0.65, x: 4 },
    { product: "Shortbread\nCookies", value: 0.73, x: 5 },
    { product: "Snickerdoo-\ndles", value: 0.75, x: 6 },
    { product: "Sugar\nCookies", value: 0.69, x: 7 },
    { product: "Wafers", value: 0.75, x: 8 },
    { product: "Wafers", value: 0.67, x: 9 },
  ]

  // Reference line data with labels
  const referenceLines = [
    { product: "Brownies", value: 1.41, label: "1,41", x: 0 },
    { product: "Butter\nCookies", value: 1.2, label: "1,20", x: 1 },
    { product: "Chocolate\nCookies", value: 1.2, label: "1,20", x: 2 },
    { product: "Gingers-\nnaps", value: 1.0, label: "1,00", x: 3 },
    { product: "Lemon\nCookies", value: 0.93, label: "0,93", x: 4 },
    { product: "Shortbread\nCookies", value: 1.04, label: "1,04", x: 5 },
    { product: "Snickerdoo-\ndles", value: 1.04, label: "1,04", x: 6 },
    { product: "Sugar\nCookies", value: 1.05, label: "1,05", x: 7 },
    { product: "Wafers", value: 0.91, label: "0,91", x: 8 },
    { product: "Wafers", value: 0.91, label: "0,91", x: 9 },
  ]

  const CustomDot = ({ cx, cy, fill }: any) => (
    <circle cx={cx} cy={cy} r={3} fill={fill} />
  )

  const CustomYAxisTick = ({ x, y, payload }: any) => (
    <g transform={`translate(${x},${y})`}>
      <text x={-5} y={0} dy={0} textAnchor="end" fill="#666" fontSize={10}>
        {payload.value.toFixed(1).replace(".", ",")}
      </text>
    </g>
  )

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const lines = products[payload.value]?.split("\n") || []
    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line: string, index: number) => (
          <text
            key={index}
            x={0}
            y={0}
            dy={10 + index * 12}
            textAnchor="middle"
            fill="#666"
            fontSize={10}
          >
            {line}
          </text>
        ))}
      </g>
    )
  }

  const ReferenceLines = ({
    width,
    height,
  }: {
    width: number
    height: number
  }) => {
    const paddingLeft = 40
    const chartWidth = width - 60
    const chartHeight = height - 70

    return (
      <>
        {referenceLines.map((line, index) => {
          const x =
            paddingLeft + (line.x + 0.5) * (chartWidth / products.length)
          const y = chartHeight - (line.value / 2) * chartHeight

          return (
            <g key={index}>
              <line
                x1={x - 15}
                y1={y}
                x2={x + 15}
                y2={y}
                stroke="#4CAF50"
                strokeWidth={1}
              />
              <text
                x={x}
                y={y - 4}
                textAnchor="middle"
                fontSize={10}
                fill="#4CAF50"
              >
                {line.label}
              </text>
            </g>
          )
        })}
      </>
    )
  }

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="w-full" style={{ height: "30vh" }}>
      <div className="bg-white p-4 rounded-lg shadow w-full h-full">
        <h1 className="text-xs font-semibold mb-2 text-center">
          Product and Batch Efficiency
        </h1>
        <div className="relative w-full h-[100%]" ref={containerRef}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                type="number"
                dataKey="x"
                tick={<CustomXAxisTick />}
                domain={[0, products.length - 1]}
                interval={0}
                padding={{ left: 10, right: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="number"
                dataKey="value"
                domain={[0, 2]}
                tick={<CustomYAxisTick />}
                ticks={[0, 0.5, 1, 1.5, 2]}
                label={{
                  value: "Energy Efficiency (GJ/t)",
                  angle: -90,
                  position: "insideLeft",
                  offset: 10,
                  style: { fontSize: 10 },
                }}
                tickLine={false}
                axisLine={false}
              />
              <Scatter
                data={purpleData}
                fill="#9c27b0"
                shape={<CustomDot fill="#9c27b0" />}
              />
              <Scatter
                data={cyanData}
                fill="#00bcd4"
                shape={<CustomDot fill="#00bcd4" />}
              />
            </ScatterChart>
          </ResponsiveContainer>

          {/* Reference lines */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="none"
          >
            <ReferenceLines
              width={dimensions.width}
              height={dimensions.height}
            />
          </svg>
        </div>
        <div className="text-center mt-1 text-xs text-gray-600">
          Energy Efficiency (GJ/t)
        </div>
      </div>
    </div>
  )
}

export default ProductBatchEfficiencyChart
