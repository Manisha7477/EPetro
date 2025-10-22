import React from "react"
import PPViewUtilityPage from "@/components/PlantPerformance/PPViewUtilityPage"

const PPViewGenerator: React.FC = () => {
  return (
    <PPViewUtilityPage
      defaultTitle="Generator"
      imageUrl="/assets/PPUtilities/generator.png"
    />
  )
}

export default PPViewGenerator

// import React, { useEffect, useState } from "react"
// import { useLocation } from "react-router-dom"
// import api from "@/api/axiosInstance"
// import PPUtilityHeader from "@/components/PPUtilityHeader"
// import EquipmentOverviewPage from "@/components/PlantPerformance/EquipmentOverviewPage"

// interface Plant {
//   plantId: number
//   plantName: string
// }

// interface Line {
//   lineId: number
//   lineName: string
// }

// interface Utility {
//   utilityId: number
//   utilityName: string
// }

// interface Generator {
//   generatorId: number
//   generatorName: string
//   status: string
//   capacity: string
// }

// const PPViewGeneratorPage: React.FC = () => {
//   const location = useLocation()

//   const [plant, setPlant] = useState<Plant | null>(null)
//   const [line, setLine] = useState<Line | null>(null)
//   const [utility, setUtility] = useState<Utility | null>(null)
//   const [generatorData, setGeneratorData] = useState<Generator[]>([])
//   const [loading, setLoading] = useState(false)

//   // Fetch generator data whenever filters change
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!plant || !line || !utility) return

//       setLoading(true)
//       try {
//         const res = await api.get("/User/GetUtilitiesDD", {
//           params: {
//             PlantId: plant.plantId,
//             LineId: line.lineId,
//             UtilityType: utility.utilityName, // ✅ string
//           },
//         })
//         console.log("Generator Data:", res.data)
//         // setGeneratorData(res.data)
//         const mappedData = res.data.map((item: any, index: number) => ({
//           slNo: index + 1,
//           generatorId: item.utilityId, // idKey
//           generatorName: item.utilityName, // nameKey
//           modelNumber: item.modelNumber || "", // optional
//         }))

//         setGeneratorData(mappedData)
//       } catch (err) {
//         console.error("Error fetching generator data:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [plant, line, utility])

//   return (
//     <div className="p-4 space-y-6">
//       {/* Header with dropdowns */}
//       <PPUtilityHeader
//         onPlantNameChange={(p) => setPlant(p)}
//         onLineNameChange={(l) => setLine(l)}
//         onUtilityChange={(u) => setUtility(u)}
//       />

//       {/* Show loading or data */}
//       {loading ? (
//         <p className="text-center text-gray-500">Loading generators...</p>
//       ) : generatorData.length > 0 ? (
//         <EquipmentOverviewPage
//           data={generatorData} // ✅ pass as 'data'
//           routePrefix={`/plantPerformanceUtilities/${plant?.plantName
//             .toLowerCase()
//             .replace(/\s/g, "-")}/${line?.lineName
//             .toLowerCase()
//             .replace(/\s/g, "-")}/${utility?.utilityName
//             .toLowerCase()
//             .replace(/\s/g, "-")}`}
//           imageUrlKey="/assets/PPUtilities/generator.png"
//           title="Generator"
//         />
//       ) : (
//         <p className="text-center text-gray-400">No generators found</p>
//       )}
//     </div>
//   )
// }

// export default PPViewGeneratorPage

// import api from "@/api/axiosInstance"
// import EquipmentOverviewPage from "@/components/PlantPerformance/EquipmentOverviewPage"
// import PPUtilityHeader from "@/components/PPUtilityHeader"
// import React, { useCallback, useEffect, useState } from "react"
// import { useLocation } from "react-router-dom"

// const PPViewGenerator: React.FC = () => {
//   const location = useLocation()

//   const [generatorData, setGeneratorData] = useState<any[]>([])
//   const [loading, setLoading] = useState(false)
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 10

//   // Store both Name + Id for API calls
//   const [plant, setPlant] = useState<{
//     plantId: number
//     plantName: string
//   } | null>(null)
//   const [line, setLine] = useState<{ lineId: number; lineName: string } | null>(
//     null,
//   )
//   const [utility, setUtility] = useState<string>("")

//   // 🔹 Parse URL on mount
//   useEffect(() => {
//     const segments = location.pathname.split("/").filter(Boolean)
//     const baseIndex = segments.findIndex(
//       (s) => s === "plantPerformanceUtilities",
//     )
//     if (baseIndex !== -1) {
//       const plantSlug = segments[baseIndex + 1] || null
//       const lineSlug = segments[baseIndex + 2] || null
//       const utilitySlug = segments[baseIndex + 3] || null

//       if (plantSlug && lineSlug && utilitySlug) {
//         // Step 1: fetch plant list
//         api.get("/User/Plant_DD").then((res) => {
//           const plants = res.data || []
//           const plantMatch = plants.find(
//             (p: any) =>
//               p.plantName.toLowerCase().replace(/\s/g, "-") === plantSlug,
//           )
//           if (plantMatch) {
//             setPlant(plantMatch)

//             // Step 2: fetch line list for this plant
//             api
//               .get(`/EdgeDevice/GetLineDD?plantId=${plantMatch.plantId}`)
//               .then((lineRes) => {
//                 const lines = lineRes.data || []
//                 const lineMatch = lines.find(
//                   (l: any) =>
//                     l.lineName.toLowerCase().replace(/\s/g, "-") === lineSlug,
//                 )
//                 if (lineMatch) {
//                   setLine(lineMatch)
//                 }
//               })
//           }
//         })

//         // Step 3: set utility directly
//         setUtility(
//           utilitySlug.charAt(0).toUpperCase() +
//             utilitySlug.slice(1).replace(/-/g, " "),
//         )
//       }
//     }
//   }, [location.pathname])

//   const fetchAPI = useCallback(async () => {
//     if (!plant || !line || !utility) return

//     setLoading(true)
//     try {
//       //Working code
//       // const response = await api.get(
//       //   // `/plants/${plant.plantId}/lines/${line.lineId}/${utility}/GetAllGeneratorDetails`,
//       //   `api/${utility}/GetAllGeneratorDetails?plantId=${plant.plantId}&lineId=${line.lineId}`,
//       //   //("/Generator/GetAllGeneratorDetails",

//       //   {
//       //     params: {
//       //       page: currentPage,
//       //       limit: itemsPerPage,
//       //     },
//       //   }
//       // )

//       const response = await api.get("/Generator/GetAllGeneratorDetails", {
//         params: { page: currentPage, limit: itemsPerPage },
//       })

//       if (response.data) {
//         const filteredData = response.data.filter(
//           (item: any) => !item.deleteFlag,
//         )

//         const transformedData = filteredData.map(
//           (item: any, index: number) => ({
//             slNo: index + 1,
//             generatorId: item.generatorId,
//             generatorName: item.generatorName,
//             modelNumber: item.modelNumber,
//           }),
//         )

//         setGeneratorData(transformedData)
//       }
//     } catch (error) {
//       console.error("Error fetching generator details:", error)
//     } finally {
//       setLoading(false)
//     }
//   }, [currentPage, itemsPerPage, plant, line, utility])

//   useEffect(() => {
//     fetchAPI()
//   }, [fetchAPI])

//   //  Build route dynamically
//   const routePrefix =
//     plant && line && utility
//       ? `/plantPerformanceUtilities/${plant.plantName
//           .toLowerCase()
//           .replace(/\s/g, "-")}/${line.lineName
//           .toLowerCase()
//           .replace(/\s/g, "-")}/${utility.toLowerCase().replace(/\s/g, "-")}`
//       : ""

//   return (
//     <div>
//       {/* Utility Header with callbacks */}
//       <PPUtilityHeader
//         onPlantNameChange={(p) => setPlant(p)}
//         onLineNameChange={(l) => setLine(l)}
//         onUtilityChange={(u) => setUtility(u)}
//       />

//       <EquipmentOverviewPage
//         data={generatorData}
//         routePrefix={routePrefix}
//         idKey="generatorId"
//         nameKey="generatorName"
//         modelKey="modelNumber"
//         imageUrlKey="/assets/PPUtilities/generator.png"
//         title="Generator Name"
//       />
//     </div>
//   )
// }

// export default PPViewGenerator
