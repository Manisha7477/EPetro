import React from "react"
import PPViewUtilityPage from "@/components/PlantPerformance/PPViewUtilityPage"

const PPViewAirCompressorPage: React.FC = () => {
  return (
    <PPViewUtilityPage
      defaultTitle="AirCompressor"
      imageUrl="/assets/PPUtilities/air-compressor.png"
    />
  )
}

export default PPViewAirCompressorPage

// import React, { useCallback, useEffect, useState } from "react"

// import api from "@/api/axiosInstance"
// import EquipmentOverviewPage from "@/components/PlantPerformance/EquipmentOverviewPage"
// import PPUtilityHeader from "@/components/PPUtilityHeader"
// const PPViewAirCompressor: React.FC = () => {
//   const [aircData, setAircData] = useState<any[]>([])
//   const [loading, setLoading] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 10

//   // NEW: Plant, Line, Utility state
//   const [plantName, setPlantName] = useState("")
//   const [lineName, setLineName] = useState("")
//   const [utilityName, setUtilityName] = useState("")
//   const fetchAPI = useCallback(async () => {
//     setLoading(true)
//     try {
//       const response = await api.get("/AirCompressor/GetAllAirCompDetails", {
//         params: { page: currentPage, limit: itemsPerPage },
//       })

//       if (response.data) {
//         const filteredData = response.data.filter(
//           (item: any) => !item.deleteFlag,
//         )

//         const transformedData = filteredData.map(
//           (item: any, index: number) => ({
//             slNo: index + 1,
//             airCompId: item.airCompId,
//             airCompName: item.airCompName,

//             modelNumber: item.modelNumber,
//           }),
//         )

//         setAircData(transformedData)
//       }
//     } catch (error) {
//       console.error("Error fetching generator details:", error)
//     } finally {
//       setLoading(false)
//     }
//   }, [currentPage, itemsPerPage])
//   useEffect(() => {
//     fetchAPI()
//   }, [fetchAPI])

//   // Build route dynamically
//   const routePrefix =
//     plantName && lineName && utilityName
//       ? `/plantPerformanceUtilities/${plantName
//           .toLowerCase()
//           .replace(/\s/g, "-")}/${lineName
//           .toLowerCase()
//           .replace(/\s/g, "-")}/${utilityName
//           .toLowerCase()
//           .replace(/\s/g, "-")}`
//       : ""

//   return (
//     <div>
//       {/* <div>
//         <UtilityHeader />
//       </div> */}

//       <PPUtilityHeader
//         onPlantNameChange={(plant) => setPlantName(plant.plantName)}
//         onLineNameChange={(line) => setLineName(line.lineName)}
//         onUtilityChange={(utility) => setUtilityName(utility)}
//       />
//       <EquipmentOverviewPage
//         data={aircData}
//         routePrefix="/plantPerformanceUtilities/taiz/air-compressor"
//         idKey="airCompId"
//         nameKey="airCompName"
//         modelKey="modelNumber"
//         imageUrlKey="/assets/PPUtilities/air-compressor.png"
//         title="AirCompressor Name"
//       />
//     </div>
//   )
// }

// export default PPViewAirCompressor
