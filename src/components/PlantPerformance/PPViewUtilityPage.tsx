import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import api from "@/api/axiosInstance"
import PPUtilityHeader from "@/components/PPUtilityHeader"
import EquipmentOverviewPage from "@/components/PlantPerformance/EquipmentOverviewPage"

interface Plant {
  plantId: number
  plantName: string
}

interface Line {
  lineId: number
  lineName: string
}

interface Utility {
  utilityId: number
  utilityName: string
}

interface UtilityData {
  slNo: number
  utilityId: number
  utilityName: string
  modelNumber?: string
}

interface PPViewUtilityPageProps {
  defaultTitle: string
  imageUrl: string
}

const PPViewUtilityPage: React.FC<PPViewUtilityPageProps> = ({
  defaultTitle,
  imageUrl,
}) => {
  const location = useLocation()

  const [plant, setPlant] = useState<Plant | null>(null)
  const [line, setLine] = useState<Line | null>(null)
  const [utility, setUtility] = useState<Utility | null>(null)
  const [data, setData] = useState<UtilityData[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch utility data whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      if (!plant || !line || !utility) return

      setLoading(true)
      try {
        const res = await api.get("/User/GetUtilitiesDD", {
          params: {
            PlantId: plant.plantId,
            LineId: line.lineId,
            UtilityType: utility.utilityName, // backend-friendly name
          },
        })

        const mappedData = res.data.map((item: any, index: number) => ({
          slNo: index + 1,
          utilityId: item.utilityId,
          utilityName: item.utilityName,
          modelNumber: item.modelNumber || "",
        }))

        setData(mappedData)
      } catch (err) {
        console.error(`Error fetching ${defaultTitle} data:`, err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [plant, line, utility, defaultTitle])

  const routePrefix = `/plantPerformanceUtilities/${plant?.plantName
    .toLowerCase()
    .replace(/\s/g, "-")}/${line?.lineName
    .toLowerCase()
    .replace(/\s/g, "-")}/${utility?.utilityName.toLowerCase()}`

  return (
    <div>
      <PPUtilityHeader
        onPlantNameChange={(p) => setPlant(p)}
        onLineNameChange={(l) => setLine(l)}
        onUtilityChange={(u) => setUtility(u)}
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading {defaultTitle}...</p>
      ) : data.length > 0 ? (
        <EquipmentOverviewPage
          data={data}
          routePrefix={routePrefix}
          imageUrlKey={imageUrl}
          title={defaultTitle}
        />
      ) : (
        <p className="text-center text-gray-400">No {defaultTitle} found</p>
      )}
    </div>
  )
}

export default PPViewUtilityPage
