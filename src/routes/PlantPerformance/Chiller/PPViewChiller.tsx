import React from "react"
import PPViewUtilityPage from "@/components/PlantPerformance/PPViewUtilityPage"

const PPViewChiller: React.FC = () => {
  return (
    <PPViewUtilityPage
      defaultTitle="Chiller"
      imageUrl="/assets/PPUtilities/chiller.png"
    />
  )
}

export default PPViewChiller

// import React, { useCallback, useEffect, useState } from "react"

// import UtilityHeader from "@/components/UtilityHeader"

// import EquipmentOverviewPage from "@/components/PlantPerformance/EquipmentOverviewPage"
// import api from "@/api/axiosInstance"
// import PPUtilityHeader from "@/components/PPUtilityHeader"
// const PPViewChiller: React.FC = () => {
//   const [chillerData, setChillerData] = useState<any[]>([])
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
//       const response = await api.get("/Chillers/GetAllChillerDetails", {
//         params: { page: currentPage, limit: itemsPerPage },
//       })

//       if (response.data) {
//         const filteredData = response.data.filter(
//           (item: any) => !item.deleteFlag,
//         )

//         const transformedData = filteredData.map(
//           (item: any, index: number) => ({
//             slNo: index + 1,
//             chillerId: item.chillerId,
//             chillerName: item.chillerName,

//             modelNumber: item.modelNumber,
//           }),
//         )

//         setChillerData(transformedData)
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
//       <PPUtilityHeader
//         onPlantNameChange={(plant) => setPlantName(plant.plantName)}
//         onLineNameChange={(line) => setLineName(line.lineName)}
//         onUtilityChange={(utility) => setUtilityName(utility)}
//       />
//       <EquipmentOverviewPage
//         data={chillerData}
//         routePrefix={routePrefix}
//         idKey="chillerId"
//         nameKey="chillerName"
//         modelKey="modelNumber"
//         imageUrlKey="/assets/PPUtilities/chiller.png"
//         title="Chiller Name"
//       />
//     </div>
//   )
// }

// export default PPViewChiller

// import React, { useCallback, useEffect, useState } from "react"

// import UtilityHeader from "@/components/UtilityHeader"

// import EquipmentOverviewPage from "@/components/PlantPerformance/EquipmentOverviewPage"
// import api from "@/api/axiosInstance"
// const PPViewChiller: React.FC = () => {
//   const [chillerData, setChillerData] = useState<any[]>([])
//   const [loading, setLoading] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 10

//   const fetchAPI = useCallback(async () => {
//     setLoading(true)
//     try {
//       const response = await api.get("/Chillers/GetAllChillerDetails", {
//         params: { page: currentPage, limit: itemsPerPage },
//       })

//       if (response.data) {
//         const filteredData = response.data.filter(
//           (item: any) => !item.deleteFlag,
//         )

//         const transformedData = filteredData.map(
//           (item: any, index: number) => ({
//             slNo: index + 1,
//             chillerId: item.chillerId,
//             chillerName: item.chillerName,

//             modelNumber: item.modelNumber,
//           }),
//         )

//         setChillerData(transformedData)
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

//   return (
//     <div>
//       <div>
//         <UtilityHeader />
//       </div>
//       <EquipmentOverviewPage
//         data={chillerData}
//         routePrefix="/plantPerformanceUtilities/taiz/chiller"
//         idKey="chillerId"
//         nameKey="chillerName"
//         modelKey="modelNumber"
//         imageUrlKey="/assets/PPUtilities/chiller.png"
//         title="Chiller Name"
//       />
//     </div>
//   )
// }

// export default PPViewChiller
