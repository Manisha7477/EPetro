import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import Image from "next/image"
import { Equipment } from "@/utils/types"

interface EquipmentOverviewProps {
  data: Equipment[]
  routePrefix: string
  idKey?: keyof Equipment
  nameKey?: keyof Equipment
  modelKey?: keyof Equipment
  title?: string
  imageUrl?: string // Optional static image
}

const YogurtEquipmentOverviewPage: React.FC<EquipmentOverviewProps> = ({
  data,
  imageUrl,
  routePrefix,
  idKey = "lineId",
  nameKey = "lineName",
  modelKey = "",
  title = "Equipment Overview",
}) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const equipmentImageMap: Record<string, string> = {
    line: "/assets/PPUtilities/boiler.png",
  }

  const filteredData = data.filter((item) =>
    String(item[nameKey]).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-2 bg-white min-h-screen">
      <div className="relative w-full mb-4 px-2 -ml-2">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${title}`}
          className="border border-gray-300 p-1 pl-8 rounded w-full shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <FaSearch
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={12}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-2">
        {filteredData.map((item) => {
          const name = String(item[nameKey]).toLowerCase().trim()
          const imageSrc =
            imageUrl ||
            equipmentImageMap[name] ||
            "/assets/PPUtilities/default.png"

          return (
            <div
              key={String(item[idKey])}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 ease-in-out cursor-pointer bg-white"
              onClick={() => navigate(`${routePrefix}/${item[idKey]}`)}
            >
              <div className="mb-2">
                <Image
                  src={imageSrc}
                  alt={`${item[nameKey]} icon`}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <p className="text-blue-700 font-medium underline text-center text-sm">
                {item[nameKey]}
              </p>
              <p className="text-xs text-gray-600">{item[modelKey]}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default YogurtEquipmentOverviewPage
