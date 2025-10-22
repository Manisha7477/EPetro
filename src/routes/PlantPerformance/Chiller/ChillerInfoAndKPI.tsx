import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import GaugeChart from "@/components/Chart/GaugeChart"
import { InfoCard } from "@/components/PlantPerformance/Cards/InfoCard"
import KpiCard from "@/components/PlantPerformance/Cards/KpiCard"
import api from "@/api/axiosInstance"
import { motion } from "framer-motion"
import Loading from "@/navigation/Loading"

const ChillerInfoAndKPI = () => {
  const { id } = useParams()
  const [chillerInfo, setChillerInfo] = useState<any | null>(null)

  const [kpiData, setKpiData] = useState<any | null>(null)
  const [kpiLoading, setKpiLoading] = useState(false)

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const fetchChillerDetails = async (updateId: string) => {
    try {
      const res = await api.get(
        `/Chillers/GetAllChillerDetails_Id?ChillerId=${updateId}`,
      )
      console.log("API Response:", res.data)
      if (res.data && res.data.length > 0) {
        const data = res.data[0]
        const status =
          data.chillerStatus?.toLowerCase() === "active" ? "active" : "inactive"
        // Build the infoCard-compatible structure
        const dynamicChillerInfo = {
          title: data.chillerName || "Chiller Details",
          // subtitle: data.plantName,
          columns: 2,
          status,
          items: [
            {
              label: "Chiller IP",
              value: data.chillerIP,
            },
            { label: "Communication Protocol", value: data.commPrtcl },
            { label: "Slave ID / Comm. ID", value: data.commIdorSlaveId },
            { label: "Manufacturer Name", value: data.manufacturerName },
            { label: "Model Number", value: data.modelNumber },
            { label: "Serial Number", value: data.serialNumber },
            { label: "Cooling Capacity", value: data.coolingCapacity },
            {
              label: "Power Supply Requirements (Vtg)",
              value: data.powerSupplyRequirementsVtg,
            },
            {
              label: "Power Supply Requirements (Phase)",
              value: data.powerSupplyRequirementsPhase,
            },
            {
              label: "Power Supply Requirements (Frq)",
              value: data.powerSupplyRequirementsFrq,
            },
            { label: "Refrigerant Type", value: data.refrigerantType },
            { label: "Refrigerant Quantity", value: data.refrigerantQuantity },
            {
              label: "Maximum Operating Pressure",
              value: data.maxOperatingPressure,
            },
            { label: "Compressor Type", value: data.compressorType },
            { label: "Full Load Amps", value: data.fullLoadAmps },
            {
              label: "Minimum Circuit Ampacity",
              value: data.minCircuitAmpacity,
            },
            { label: "Maximum Fuse Size", value: data.maxFuseSize },
          ],
        }

        setChillerInfo(dynamicChillerInfo)
      }
    } catch (error) {
      console.error("Error fetching chiller details:", error)
      // } finally {
      //   setLoading(false)
    }
  }
  // ✅ Fetch KPI data (refresh every 15 min)
  const fetchKpiData = async (updateId: string) => {
    setKpiLoading(true)
    try {
      const res = await api.get(
        `/AllKpi/GetGeneratorKpisById?GeneratorId=${updateId}`,
      )
      if (res.data) {
        setKpiData(res.data)
      }
    } catch (error) {
      console.error("Error fetching generator KPIs:", error)
    } finally {
      setKpiLoading(false)
    }
  }

  // Run generator details fetch once
  useEffect(() => {
    if (id) {
      fetchChillerDetails(id)
    }
  }, [id])

  // Run KPI fetch initially and then every 15 minutes
  useEffect(() => {
    if (!id) return

    // Initial fetch
    fetchKpiData(id)

    // Set 15-min interval
    const interval = setInterval(() => {
      fetchKpiData(id)
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [id])

  // Handle loading states
  if (!chillerInfo) {
    return <div className="p-4 text-gray-600">Loading generator info...</div>
  }

  if (kpiLoading || !kpiData) {
    return <Loading />
  }
  return (
    <div className="flex flex-col bg-neutral md:flex-row gap-2 w-full h-full">
      {/* Left Side Info Card */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col w-full md:w-1/3 gap-2 flex-shrink-0"
      >
        <div className="flex text-xs items-center justify-center">
          <InfoCard {...chillerInfo} />
        </div>
      </motion.div>

      {/* Right Side KPI + Gauges */}
      <div className="flex flex-col md:w-2/3 gap-2 overflow-y-auto max-h-screen pr-2">
        {/* KPI Cards */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-row w-full gap-4"
        >
          <KpiCard
            title="Total Energy Exported"
            kpivalue={`${kpiData.totalEnergyExported ?? 0} kWh`}
          />
          <KpiCard
            title="Temperature"
            kpivalue={`${kpiData.temperature ?? 0} °C`}
          />
        </motion.div>

        {/* Gauge Charts */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-row w-full gap-4 p-4"
        >
          <GaugeChart title="Average THD (%)" data={kpiData.avgTHD} unit="%" />
          <GaugeChart title="Engine Load" data={kpiData.loadFactor} unit="%" />
          <GaugeChart title="Power Factor" data={kpiData.powerFactor} unit="" />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-row w-full gap-4 p-4"
        >
          <GaugeChart
            title="System Efficiency"
            data={kpiData.systemEfficiency}
            unit="%"
          />
          <GaugeChart
            title="Avg Fuel Consumption Rate"
            data={kpiData.avgFuelConsumption}
            unit="L/Hr"
          />
          <GaugeChart
            title="Fuel Efficiency"
            data={kpiData.fuelEfficiency}
            unit="kWh/L"
          />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-row w-full gap-4 p-4"
        >
          <GaugeChart
            title="Peak Hourly Demand"
            data={kpiData.peakDemand}
            unit=""
          />
          <GaugeChart
            title="Cumulative Fuel Used"
            data={kpiData.cumulativeFuelUsed}
            unit="L"
          />
          <GaugeChart
            title="CO2 Emissions"
            data={kpiData.cO2Emissions}
            unit="%"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default ChillerInfoAndKPI
