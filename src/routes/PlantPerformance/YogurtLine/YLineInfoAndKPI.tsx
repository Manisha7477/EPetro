import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import GaugeChart from "@/components/Chart/GaugeChart"
import { InfoCard } from "@/components/PlantPerformance/Cards/InfoCard"
import KpiCard from "@/components/PlantPerformance/Cards/KpiCard"
import api from "@/api/axiosInstance"
import { motion } from "framer-motion"
import Loading from "@/navigation/Loading"

const YLineInfoAndKPI = () => {
  const { id } = useParams()
  const [lineInfo, setlineInfo] = useState<any | null>(null)

  const [kpiData, setKpiData] = useState<any | null>(null)
  const [kpiLoading, setKpiLoading] = useState(false)

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const fetchlineDetails = async (updateId: string) => {
    try {
      const res = await api.get(`/Line/GetAllLineDetails_Id?LineId=${updateId}`)
      console.log("API Response:", res.data)
      if (res.data && res.data.length > 0) {
        const data = res.data[0]
        const status =
          data.lineStatus?.toLowerCase() === "active" ? "active" : "inactive"
        const dynamiclineInfo = {
          title: data.lineName || "line Details",
          columns: 2,
          status,
          items: [
            { label: "Site ID", value: data.siteId },
            { label: "Plant Name", value: data.plantName },
            { label: "Site Name", value: data.siteName },
            { label: "Line Type", value: data.lineType },
            {
              label: "Theoretical Power Consumption",
              value: data.theoPowerCon,
            },
            { label: "Description", value: data.description },
            { label: "Actual Power Consumption", value: data.actualPowerCon },
            { label: "Current Rating", value: data.currentRating },
            { label: "Capacity", value: data.capacity },
            { label: "Low Voltage Rating", value: data.lowVtgRating },
            { label: "High Voltage Rating", value: data.highVtgRating },
            { label: "Electrical Supply", value: data.electricalSupply },
            { label: "Area Affiliation", value: data.areaAffiliation },
            { label: "Area Name", value: data.areaName },
            { label: "Total Equipments", value: data.totalEquipments },
            { label: "Peak Load", value: data.peakLoad },
            { label: "Plant ID", value: data.plantId },
            {
              label: "Theorized Line Engineering Efficiency",
              value: data.theorizedLineEngEff,
            },
          ],
        }

        setlineInfo(dynamiclineInfo)
      }
    } catch (error) {
      console.error("Error fetching Line details:", error)
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
      fetchlineDetails(id)
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
  if (!lineInfo) {
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
          <InfoCard {...lineInfo} />
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

export default YLineInfoAndKPI
