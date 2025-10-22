import React, { useEffect, useState } from "react"
import api from "@/api/axiosInstance"
import EquipmentOverviewPage from "@/components/PlantPerformance/EquipmentOverviewPage"

import PlantDropdown from "@/components/PlantDropdown"

interface YogurtLine {
  lineId: number
  lineName: string
  model?: string
}

interface Plant {
  plantId: number
  plantName: string
}

const ViewPPYogurtline: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([])
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [currentItems, setCurrentItems] = useState<YogurtLine[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ 1️⃣ Fetch all plants first (only once)
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await api.get("/User/Plant_DD") // adjust your actual API
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPlants(res.data)
          setSelectedPlant(res.data[0]) // ✅ auto-select 1st plant
        }
      } catch (err: any) {
        console.error("Error fetching plants:", err)
        setError("Failed to load plants.")
      }
    }

    fetchPlants()
  }, [])

  // ✅ 2️⃣ Fetch yogurt lines when selectedPlant changes
  useEffect(() => {
    if (!selectedPlant?.plantId) return

    const fetchYogurtLines = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await api.get(
          `/EdgeDevice/GetLineDD?plantId=${selectedPlant.plantId}`,
        )

        if (response?.data && Array.isArray(response.data)) {
          const filteredData = response.data.filter(
            (item: any) => !item.deleteFlag,
          )
          setCurrentItems(filteredData)
        } else {
          throw new Error("No data found")
        }
      } catch (err: any) {
        console.error("Error fetching lines:", err)
        setError(err.message || "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchYogurtLines()
  }, [selectedPlant])

  const plantSlug =
    selectedPlant?.plantName.trim().toLowerCase().replace(/\s/g, "-") || ""

  return (
    <div>
      <div className="mb-4">
        <PlantDropdown
          plants={plants} // pass list to dropdown
          selected={selectedPlant}
          onChange={(plant) => setSelectedPlant(plant)}
        />
      </div>

      {loading && <p className="text-gray-500">Loading lines...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && currentItems.length > 0 && (
        <EquipmentOverviewPage
          data={currentItems}
          routePrefix={`/plantPerformanceYogurtLine/${plantSlug}`}
          idKey="lineId"
          nameKey="lineName"
          modelKey="model"
          imageUrlKey="/assets/PPUtilities/yogurtLine.png"
          title="Line Name"
        />
      )}

      {!loading && !error && selectedPlant && currentItems.length === 0 && (
        <p className="text-gray-500 text-center mt-4">
          No lines found for {selectedPlant.plantName}
        </p>
      )}
    </div>
  )
}

export default ViewPPYogurtline
