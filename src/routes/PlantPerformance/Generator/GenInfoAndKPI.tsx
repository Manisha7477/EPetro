import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import GaugeChart from "@/components/Chart/GaugeChart"
import { InfoCard } from "@/components/PlantPerformance/Cards/InfoCard"
import KpiCard from "@/components/PlantPerformance/Cards/KpiCard"
import api from "@/api/axiosInstance"
import { motion } from "framer-motion"
import Loading from "@/navigation/Loading"

const GenInfoAndKPI = () => {
  const { id } = useParams()
  const [generatorInfo, setGeneratorInfo] = useState<any | null>(null)

  const [kpiData, setKpiData] = useState<any | null>(null)
  const [kpiLoading, setKpiLoading] = useState(false)

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }
  // ✅ Fetch Generator Details once (when id changes)
  const fetchGeneratorDetails = async (updateId: string) => {
    try {
      const res = await api.get(
        `/Generator/GetAllGeneratorDetails_Id?GeneratorId=${updateId}`,
      )
      if (res.data && res.data.length > 0) {
        const data = res.data[0]
        const status =
          data.generatorStatus?.toLowerCase() === "active"
            ? "active"
            : "inactive"

        const dynamicGeneratorInfo = {
          title: data.generatorName || "Generator Details",
          columns: 2,
          status,
          items: [
            { label: "Generator IP", value: data.generatorIP },
            { label: "Fuel", value: data.dgFuelType ?? data.fuelType ?? "N/A" },
            { label: "Communication Protocol", value: data.commPrtcl },
            {
              label: "Slave ID / Comm. ID",
              value: data.commIdorSlaveId ?? "N/A",
            },
            { label: "Manufacturer Name", value: data.manufacturerName },
            { label: "Model Number", value: data.modelNumber },
            { label: "Serial Number", value: data.serialNumber },
            { label: "Year of Manufacture", value: data.manufactureYear },
            { label: "Engine Model", value: data.dgEngModel },
            { label: "Engine Serial Number", value: data.dgEngSrNo },
            { label: "Alternator Model", value: data.dgAltModel },
            { label: "Alternator Serial Number", value: data.dgAltSrNo },
            { label: "Power Output", value: data.dgEngPwrOut },
            { label: "Voltage", value: data.dgAltVolt },
            { label: "Frequency", value: data.dgAltFreq },
          ],
        }
        setGeneratorInfo(dynamicGeneratorInfo)
      }
    } catch (error) {
      console.error("Error fetching generator details:", error)
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
      fetchGeneratorDetails(id)
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
  if (!generatorInfo) {
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
          <InfoCard {...generatorInfo} />
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

export default GenInfoAndKPI
