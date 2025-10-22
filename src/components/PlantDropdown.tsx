import React, { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import api from "@/api/axiosInstance"
import { useNavigate } from "react-router-dom"

interface Plant {
  plantId: number
  plantName: string
}

interface PlantDropdownProps {
  plants?: Plant[] // optional pre-fetched plant list
  selected?: Plant | null // full Plant object (not just string)
  onChange?: (plant: Plant) => void
}

const PlantDropdown: React.FC<PlantDropdownProps> = ({
  plants = [],
  selected,
  onChange,
}) => {
  const [options, setOptions] = useState<Plant[]>(plants)
  const [loading, setLoading] = useState(plants.length === 0)
  const [error, setError] = useState(false)
  const [internalSelected, setInternalSelected] = useState<Plant | null>(
    selected || null,
  )
  const navigate = useNavigate()

  // ✅ Fetch plant list if not provided
  useEffect(() => {
    if (plants.length > 0) {
      setOptions(plants)
      if (!internalSelected && plants[0]) {
        setInternalSelected(plants[0])
        onChange?.(plants[0])
        const slug = plants[0].plantName.toLowerCase().replace(/\s/g, "-")
        navigate(`/plantPerformanceYogurtLine/${slug}`, { replace: true })
      }
      return
    }

    const fetchPlants = async () => {
      try {
        const response = await api.get("/User/Plant_DD")
        const data = response.data

        if (Array.isArray(data) && data.length > 0) {
          setOptions(data)

          // Auto-select the first plant
          const firstPlant = data[0]
          setInternalSelected(firstPlant)
          onChange?.(firstPlant)

          const slug = firstPlant.plantName.toLowerCase().replace(/\s/g, "-")
          navigate(`/plantPerformanceYogurtLine/${slug}`, { replace: true })
        } else {
          setError(true)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [plants, onChange, navigate])

  // ✅ Handle selection change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const plant = options.find((p) => p.plantName === e.target.value)
    if (plant) {
      setInternalSelected(plant)
      onChange?.(plant)

      const slug = plant.plantName.toLowerCase().replace(/\s/g, "-")
      navigate(`/plantPerformanceYogurtLine/${slug}`)
    }
  }

  const value = selected?.plantName || internalSelected?.plantName || ""

  return (
    <div className="sticky top-0 z-10 px-4 pt-2 pb-2  shadow-sm border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center mt-1 gap-2 w-full sm:w-auto">
        <label
          htmlFor="plant"
          className="text-sm font-medium whitespace-nowrap"
        >
          Plant Name <span className="text-red-500">*</span>
        </label>
        <div className="relative w-1/6 sm:min-w-[180px]">
          <select
            id="plant"
            value={value}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-1.5 pr-8 w-full
                       text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                       disabled:bg-gray-100 disabled:text-gray-400 transition-all"
            required
            disabled={loading || error}
          >
            <option value="" disabled>
              {loading
                ? "Loading..."
                : error
                ? "Error loading plants"
                : "Select Plant Name"}
            </option>

            {options.map((plant) => (
              <option key={plant.plantId} value={plant.plantName}>
                {plant.plantName}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlantDropdown
