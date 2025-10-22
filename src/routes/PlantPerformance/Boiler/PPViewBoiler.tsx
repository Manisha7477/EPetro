import React from "react"
import PPViewUtilityPage from "@/components/PlantPerformance/PPViewUtilityPage"

const PPViewBoilerPage: React.FC = () => {
  return (
    <PPViewUtilityPage
      defaultTitle="Boiler"
      imageUrl="/assets/PPUtilities/boiler.png"
    />
  )
}

export default PPViewBoilerPage

// import React, { useCallback, useEffect, useState } from "react"

// import EquipmentOverviewPage from "@/components/PlantPerformance/EquipmentOverviewPage"

// import api from "@/api/axiosInstance"
// import PPUtilityHeader from "@/components/PPUtilityHeader"
// const PPViewBoiler: React.FC = () => {
//   const [boilerData, setBoilerData] = useState<any[]>([])
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
//       const response = await api.get("Boilers/GetAllBoilerDetails", {
//         params: { page: currentPage, limit: itemsPerPage },
//       })

//       if (response.data) {
//         const filteredData = response.data.filter(
//           (item: any) => !item.deleteFlag,
//         )

//         const transformedData = filteredData.map(
//           (item: any, index: number) => ({
//             slNo: index + 1,
//             boilerId: item.boilerId,
//             boilerName: item.boilerName,

//             modelNumber: item.modelNumber,
//           }),
//         )

//         setBoilerData(transformedData)
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
//       <div>
//         <PPUtilityHeader
//           onPlantNameChange={(plant) => setPlantName(plant.plantName)}
//           onLineNameChange={(line) => setLineName(line.lineName)}
//           onUtilityChange={(utility) => setUtilityName(utility)}
//         />
//       </div>
//       <EquipmentOverviewPage
//         data={boilerData}
//         routePrefix={routePrefix}
//         idKey="boilerId"
//         nameKey="boilerName"
//         modelKey="modelNumber"
//         imageUrlKey="/assets/PPUtilities/boiler.png"
//         title="Boiler Name"
//       />
//     </div>
//   )
// }

// export default PPViewBoiler

// import React, { useCallback, useEffect, useState } from "react"

// import EquipmentOverviewPage from "@/components/PlantPerformance/EquipmentOverviewPage"

// import api from "@/api/axiosInstance"
// import UtilityHeader from "@/components/UtilityHeader"
// const PPViewBoiler: React.FC = () => {
//   const [boilerData, setBoilerData] = useState<any[]>([])
//   const [loading, setLoading] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 10

//   const fetchAPI = useCallback(async () => {
//     setLoading(true)
//     try {
//       const response = await api.get("Boilers/GetAllBoilerDetails", {
//         params: { page: currentPage, limit: itemsPerPage },
//       })

//       if (response.data) {
//         const filteredData = response.data.filter(
//           (item: any) => !item.deleteFlag,
//         )

//         const transformedData = filteredData.map(
//           (item: any, index: number) => ({
//             slNo: index + 1,
//             boilerId: item.boilerId,
//             boilerName: item.boilerName,

//             modelNumber: item.modelNumber,
//           }),
//         )

//         setBoilerData(transformedData)
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
//         data={boilerData}
//         routePrefix="/plantPerformanceUtilities/taiz/boiler"
//         idKey="boilerId"
//         nameKey="boilerName"
//         modelKey="modelNumber"
//         imageUrlKey="/assets/PPUtilities/boiler.png"
//         title="Boiler Name"
//       />
//     </div>
//   )
// }

// export default PPViewBoiler
