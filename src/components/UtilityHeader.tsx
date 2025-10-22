import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ChevronDown } from "lucide-react"

interface UtilityHeaderProps {
  onUtilityChange?: (utility: string) => void
}

const utilityOptions = [
  { id: 1, tab: "Boiler" },
  { id: 2, tab: "Chiller" },
  { id: 3, tab: "Air Compressor" },
  { id: 4, tab: "Generator" },
]

const UtilityHeader: React.FC<UtilityHeaderProps> = ({ onUtilityChange }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedUtility, setSelectedUtility] = useState("")

  // Set default Utility as Generator on first load
  useEffect(() => {
    const segments = location.pathname.split("/").filter((s) => s !== "")
    const baseIndex = segments.findIndex(
      (s) => s === "utilities" || s === "plantPerformanceUtilities",
    )

    const basePath =
      baseIndex !== -1
        ? "/" + segments.slice(0, baseIndex + 1).join("/")
        : "/utilities"

    const utilitySlug = segments[baseIndex + 1] || null
    const utility = utilityOptions.find(
      (u) => u.tab.toLowerCase().replace(/\s/g, "-") === utilitySlug,
    )

    if (utility) {
      setSelectedUtility(utility.tab)
      onUtilityChange?.(utility.tab)
    } else {
      // Default Utility → Generator
      const defaultUtility = "Generator"
      setSelectedUtility(defaultUtility)
      onUtilityChange?.(defaultUtility)

      const defaultSlug = defaultUtility.toLowerCase().replace(/\s/g, "-")
      navigate(`${basePath}/${defaultSlug}`, { replace: true })
    }
  }, [location.pathname, navigate, onUtilityChange])

  // Handle utility change
  const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUtility = e.target.value
    setSelectedUtility(newUtility)
    onUtilityChange?.(newUtility)

    const segments = location.pathname.split("/").filter((s) => s !== "")
    const baseIndex = segments.findIndex(
      (s) => s === "utilities" || s === "plantPerformanceUtilities",
    )

    const basePath =
      baseIndex !== -1
        ? "/" + segments.slice(0, baseIndex + 1).join("/")
        : "/utilities"

    const utilitySlug = newUtility.toLowerCase().replace(/\s/g, "-")
    navigate(`${basePath}/${utilitySlug}`)
  }

  return (
    <div className="sticky top-0 z-10 px-4 pt-2 pb-2  shadow-sm ">
      <div className="flex flex-col sm:flex-row sm:items-end sm:gap-8 gap-4 mt-1">
        {/* Utility */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="utility"
            className="text-sm font-medium whitespace-nowrap"
          >
            Utilities <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full sm:min-w-[180px]">
            <select
              id="utility"
              value={selectedUtility}
              onChange={handleUtilityChange}
              className="border border-gray-300 rounded-md px-3 py-2 pr-8 w-full
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                         disabled:bg-gray-100 disabled:text-gray-400 transition-all"
              required
            >
              <option value="" disabled>
                Select Utility
              </option>
              {utilityOptions.map((utility) => (
                <option key={utility.tab} value={utility.tab}>
                  {utility.tab}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UtilityHeader



// import React, { useEffect, useState } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import { ChevronDown } from "lucide-react"

// interface UtilityHeaderProps {
//   onUtilityChange?: (utility: string) => void
// }

// const utilityOptions = [
//   { id: 1, tab: "Boiler" },
//   { id: 2, tab: "Chiller" },
//   { id: 3, tab: "Air Compressor" },
//   { id: 4, tab: "Generator" },
// ]

// const UtilityHeader: React.FC<UtilityHeaderProps> = ({ onUtilityChange }) => {
//   const navigate = useNavigate()
//   const location = useLocation()

//   const [selectedUtility, setSelectedUtility] = useState("")

//   // Set default Utility as Generator on first load
//   useEffect(() => {
//     const segments = location.pathname.split("/").filter((s) => s !== "")
//     const baseIndex = segments.findIndex(
//       (s) => s === "utilities" || s === "plantPerformanceUtilities",
//     )

//     const basePath =
//       baseIndex !== -1
//         ? "/" + segments.slice(0, baseIndex + 1).join("/")
//         : "/utilities"

//     const utilitySlug = segments[baseIndex + 1] || null
//     const utility = utilityOptions.find(
//       (u) => u.tab.toLowerCase().replace(/\s/g, "-") === utilitySlug,
//     )

//     if (utility) {
//       setSelectedUtility(utility.tab)
//       onUtilityChange?.(utility.tab)
//     } else {
//       // Default Utility → Generator
//       const defaultUtility = "Generator"
//       setSelectedUtility(defaultUtility)
//       onUtilityChange?.(defaultUtility)

//       const defaultSlug = defaultUtility.toLowerCase().replace(/\s/g, "-")
//       navigate(`${basePath}/${defaultSlug}`, { replace: true })
//     }
//   }, [location.pathname, navigate, onUtilityChange])

//   // Handle utility change
//   const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newUtility = e.target.value
//     setSelectedUtility(newUtility)
//     onUtilityChange?.(newUtility)

//     const segments = location.pathname.split("/").filter((s) => s !== "")
//     const baseIndex = segments.findIndex(
//       (s) => s === "utilities" || s === "plantPerformanceUtilities",
//     )

//     const basePath =
//       baseIndex !== -1
//         ? "/" + segments.slice(0, baseIndex + 1).join("/")
//         : "/utilities"

//     const utilitySlug = newUtility.toLowerCase().replace(/\s/g, "-")
//     navigate(`${basePath}/${utilitySlug}`)
//   }

//   return (
//     <div className="sticky top-0 z-10 px-4 pt-2 pb-2 mt-14 bg-neutral shadow-sm border-b border-gray-200">
//       <div className="flex flex-col sm:flex-row sm:items-end sm:gap-8 gap-4 mt-1">
//         {/* Utility */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
//           <label
//             htmlFor="utility"
//             className="text-sm font-medium whitespace-nowrap"
//           >
//             Utilities <span className="text-red-500">*</span>
//           </label>
//           <div className="relative w-full sm:min-w-[180px]">
//             <select
//               id="utility"
//               value={selectedUtility}
//               onChange={handleUtilityChange}
//               className="border border-gray-300 rounded-md px-3 py-2 pr-8 w-full
//                          text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
//                          disabled:bg-gray-100 disabled:text-gray-400 transition-all"
//               required
//             >
//               <option value="" disabled>
//                 Select Utility
//               </option>
//               {utilityOptions.map((utility) => (
//                 <option key={utility.tab} value={utility.tab}>
//                   {utility.tab}
//                 </option>
//               ))}
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
//               <ChevronDown className="w-4 h-4" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default UtilityHeader

// // import React, { useEffect, useState } from "react"
// // import { useNavigate, useLocation } from "react-router-dom"
// // import { ChevronDown } from "lucide-react"
// // import api from "@/api/axiosInstance"

// // interface UtilityHeaderProps {
// //   onPlantNameChange?: (plant: { plantId: number; plantName: string }) => void
// //   onUtilityChange?: (utility: string) => void
// // }

// // interface Plant {
// //   plantId: number
// //   plantName: string
// // }

// // const utilityOptions = [
// //   { id: 1, tab: "Boiler" },
// //   { id: 2, tab: "Chiller" },
// //   { id: 3, tab: "Air Compressor" },
// //   { id: 4, tab: "Generator" },
// // ]

// // const UtilityHeader: React.FC<UtilityHeaderProps> = ({
// //   onPlantNameChange,
// //   onUtilityChange,
// // }) => {
// //   const navigate = useNavigate()
// //   const location = useLocation()

// //   const [plantNameOptions, setPlantNameOptions] = useState<Plant[]>([])
// //   const [selectedPlantName, setSelectedPlantName] = useState("")
// //   const [selectedUtility, setSelectedUtility] = useState("")
// //   const [loadingError, setLoadingError] = useState(false)
// //   const [currentBasePath, setCurrentBasePath] = useState("/utilities")

// //   // Dynamically determine the base path (up to 'utilities' or 'plantPerformanceUtilities')
// //   useEffect(() => {
// //     const segments = location.pathname.split("/").filter((s) => s !== "")
// //     const baseIndex = segments.findIndex(
// //       (s) => s === "utilities" || s === "plantPerformanceUtilities",
// //     )
// //     if (baseIndex !== -1) {
// //       setCurrentBasePath("/" + segments.slice(0, baseIndex + 1).join("/"))
// //     } else {
// //       setCurrentBasePath("/utilities") // fallback
// //     }
// //   }, [location.pathname])

// //   const parsePathSegments = React.useCallback(
// //     (pathname: string) => {
// //       const segments = pathname.split("/").filter((s) => s !== "")
// //       const baseIndex = segments.findIndex(
// //         (s) => s === "utilities" || s === "plantPerformanceUtilities",
// //       )

// //       if (baseIndex === -1) return { plant: null, utilityName: null }

// //       const plantSlug = segments[baseIndex + 1] || null
// //       const utilitySlug = segments[baseIndex + 2] || null

// //       const plant = plantNameOptions.find(
// //         (p) => p.plantName.toLowerCase().replace(/\s/g, "-") === plantSlug,
// //       )

// //       const utility = utilityOptions.find(
// //         (u) => u.tab.toLowerCase().replace(/\s/g, "-") === utilitySlug,
// //       )

// //       return {
// //         plant: plant || null,
// //         utilityName: utility ? utility.tab : null,
// //       }
// //     },
// //     [plantNameOptions],
// //   )

// //   // Fetch plant list
// //   useEffect(() => {
// //     const fetchPlants = async () => {
// //       try {
// //         const response = await api.get("/User/Plant_DD")
// //         const data = response.data
// //         if (Array.isArray(data)) {
// //           const filtered = data.filter(
// //             (plant) => plant.plantName.trim().toLowerCase() === "taiz",
// //           )
// //           setPlantNameOptions(filtered)
// //         } else {
// //           setLoadingError(true)
// //           console.error("Unexpected plant list format", data)
// //         }
// //       } catch (err) {
// //         setLoadingError(true)
// //         console.error("Error fetching plant list:", err)
// //       }
// //     }

// //     fetchPlants()
// //   }, [])

// //   useEffect(() => {
// //     if (plantNameOptions.length === 0 || loadingError) return

// //     const { plant, utilityName } = parsePathSegments(location.pathname)

// //     if (plant) {
// //       setSelectedPlantName(plant.plantName)
// //       onPlantNameChange?.(plant)
// //     }

// //     if (utilityName) {
// //       setSelectedUtility(utilityName)
// //       onUtilityChange?.(utilityName)
// //     }

// //     if (!plant && !utilityName) {
// //       const taiz = plantNameOptions.find((p) => p.plantName === "Taiz")
// //       if (taiz) {
// //         setSelectedPlantName(taiz.plantName)
// //         setSelectedUtility("Generator")
// //         onPlantNameChange?.(taiz)
// //         onUtilityChange?.("Generator")
// //         navigate(`${currentBasePath}/taiz/generator`, { replace: true })
// //       }
// //     }
// //   }, [
// //     plantNameOptions,
// //     loadingError,
// //     location.pathname,
// //     parsePathSegments,
// //     onPlantNameChange,
// //     onUtilityChange,
// //     navigate,
// //     currentBasePath,
// //   ])

// //   // --- Event handlers ---
// //   const handlePlantNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const newPlantName = e.target.value
// //     setSelectedPlantName(newPlantName)

// //     const selected = plantNameOptions.find((p) => p.plantName === newPlantName)
// //     if (selected) {
// //       onPlantNameChange?.(selected)
// //     }

// //     const plantSlug = newPlantName.toLowerCase().replace(/\s/g, "-")
// //     const utilitySlug = selectedUtility
// //       ? selectedUtility.toLowerCase().replace(/\s/g, "-")
// //       : ""

// //     navigate(
// //       `${currentBasePath}/${plantSlug}${utilitySlug ? `/${utilitySlug}` : ""}`,
// //     )
// //   }

// //   const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const newUtility = e.target.value
// //     setSelectedUtility(newUtility)
// //     onUtilityChange?.(newUtility)

// //     const plantSlug = selectedPlantName
// //       ? selectedPlantName.toLowerCase().replace(/\s/g, "-")
// //       : ""
// //     const utilitySlug = newUtility.toLowerCase().replace(/\s/g, "-")

// //     navigate(`${currentBasePath}/${plantSlug}/${utilitySlug}`)
// //   }

// //   return (
// //     <div className="sticky top-0 z-10 px-4 pt-2 pb-2 mt-14  bg-neutral shadow-sm border-b border-gray-200">
// //       <div className="flex flex-col sm:flex-row sm:items-end sm:gap-8 gap-4 mt-1">
// //         {/* Plant Name */}
// //         <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
// //           <label
// //             htmlFor="plant"
// //             className="text-sm font-medium whitespace-nowrap"
// //           >
// //             Plant Name <span className="text-red-500">*</span>
// //           </label>
// //           <div className="relative w-full sm:min-w-[180px]">
// //             <select
// //               id="plant"
// //               value={selectedPlantName}
// //               onChange={handlePlantNameChange}
// //               className="border border-gray-300 rounded-md px-3 py-2 pr-8 w-full
// //                          text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
// //                          disabled:bg-gray-100 disabled:text-gray-400 transition-all"
// //               required
// //             >
// //               <option value="" disabled>
// //                 Select Plant Name
// //               </option>
// //               {plantNameOptions.map((plant) => (
// //                 <option key={plant.plantId} value={plant.plantName}>
// //                   {plant.plantName}
// //                 </option>
// //               ))}
// //             </select>
// //             <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
// //               <ChevronDown className="w-4 h-4" />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Utility */}
// //         <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
// //           <label
// //             htmlFor="utility"
// //             className="text-sm font-medium whitespace-nowrap"
// //           >
// //             Utilities <span className="text-red-500">*</span>
// //           </label>
// //           <div className="relative w-full sm:min-w-[180px]">
// //             <select
// //               id="utility"
// //               value={selectedUtility}
// //               onChange={handleUtilityChange}
// //               className="border border-gray-300 rounded-md px-3 py-2 pr-8 w-full
// //                          text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
// //                          disabled:bg-gray-100 disabled:text-gray-400 transition-all"
// //               required
// //               disabled={!selectedPlantName}
// //             >
// //               <option value="" disabled>
// //                 Select Utility
// //               </option>
// //               {utilityOptions.map((utility) => (
// //                 <option key={utility.tab} value={utility.tab}>
// //                   {utility.tab}
// //                 </option>
// //               ))}
// //             </select>
// //             <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
// //               <ChevronDown className="w-4 h-4" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }
// // export default UtilityHeader

// // import React, { useEffect, useState } from "react"
// // import { useNavigate, useLocation } from "react-router-dom"
// // import { ChevronDown } from "lucide-react"
// // import api from "@/api/axiosInstance"

// // interface UtilityHeaderProps {
// //   onPlantNameChange?: (plant: { plantId: number; plantName: string }) => void
// //   onUtilityChange?: (utility: string) => void
// // }

// // interface Plant {
// //   plantId: number
// //   plantName: string
// // }

// // const utilityOptions = [
// //   { id: 1, tab: "Boiler" },
// //   { id: 2, tab: "Chiller" },
// //   { id: 3, tab: "Air Compressor" },
// //   { id: 4, tab: "Generator" },
// // ]

// // const UtilityHeader: React.FC<UtilityHeaderProps> = ({
// //   onPlantNameChange,
// //   onUtilityChange,
// // }) => {
// //   const navigate = useNavigate()
// //   const location = useLocation()

// //   const [plantNameOptions, setPlantNameOptions] = useState<Plant[]>([])
// //   const [selectedPlantName, setSelectedPlantName] = useState("")
// //   const [selectedUtility, setSelectedUtility] = useState("")
// //   const [loadingError, setLoadingError] = useState(false)

// //   const parsePathSegments = React.useCallback(
// //     (pathname: string) => {
// //       const segments = pathname.split("/").filter((s) => s !== "")
// //       const utilitiesIndex = segments.indexOf("utilities")

// //       if (utilitiesIndex === -1) return { plant: null, utilityName: null }

// //       const plantSlug = segments[utilitiesIndex + 1] || null
// //       const utilitySlug = segments[utilitiesIndex + 2] || null

// //       const plant = plantNameOptions.find(
// //         (p) => p.plantName.toLowerCase().replace(/\s/g, "-") === plantSlug,
// //       )

// //       const utility = utilityOptions.find(
// //         (u) => u.tab.toLowerCase().replace(/\s/g, "-") === utilitySlug,
// //       )

// //       return {
// //         plant: plant || null,
// //         utilityName: utility ? utility.tab : null,
// //       }
// //     },
// //     [plantNameOptions], // Dependency: only plantNameOptions is used here
// //   )

// //   // Fetch plant list
// //   useEffect(() => {
// //     const fetchPlants = async () => {
// //       try {
// //         const response = await api.get("/User/Plant_DD")
// //         const data = response.data
// //         if (Array.isArray(data)) {
// //           const filtered = data.filter(
// //             (plant) => plant.plantName.trim().toLowerCase() === "taiz",
// //           )
// //           setPlantNameOptions(filtered)
// //         } else {
// //           setLoadingError(true)
// //           console.error("Unexpected plant list format", data)
// //         }
// //       } catch (err) {
// //         setLoadingError(true)
// //         console.error("Error fetching plant list:", err)
// //       }
// //     }

// //     fetchPlants()
// //   }, [])

// //   useEffect(() => {
// //     if (plantNameOptions.length === 0 || loadingError) return

// //     const { plant, utilityName } = parsePathSegments(location.pathname)

// //     if (plant) {
// //       setSelectedPlantName(plant.plantName)
// //       onPlantNameChange?.(plant)
// //     }

// //     if (utilityName) {
// //       setSelectedUtility(utilityName)
// //       onUtilityChange?.(utilityName)
// //     }

// //     if (!plant && !utilityName) {
// //       const taiz = plantNameOptions.find((p) => p.plantName === "Taiz")
// //       if (taiz) {
// //         setSelectedPlantName(taiz.plantName)
// //         setSelectedUtility("Generator")
// //         onPlantNameChange?.(taiz)
// //         onUtilityChange?.("Generator")
// //         navigate("/utilities/taiz/generator", { replace: true })
// //       }
// //     }
// //   }, [
// //     plantNameOptions,
// //     loadingError,
// //     location.pathname,
// //     parsePathSegments,
// //     onPlantNameChange,
// //     onUtilityChange,
// //     navigate, // ✅ All dependencies included
// //   ])

// //   // --- Event handlers ---
// //   const handlePlantNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const newPlantName = e.target.value
// //     setSelectedPlantName(newPlantName)

// //     const selected = plantNameOptions.find((p) => p.plantName === newPlantName)
// //     if (selected) {
// //       onPlantNameChange?.(selected)
// //     }

// //     const plantSlug = newPlantName.toLowerCase().replace(/\s/g, "-")
// //     const utilitySlug = selectedUtility
// //       ? selectedUtility.toLowerCase().replace(/\s/g, "-")
// //       : ""

// //     navigate(`/utilities/${plantSlug}${utilitySlug ? `/${utilitySlug}` : ""}`)
// //   }

// //   const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const newUtility = e.target.value
// //     setSelectedUtility(newUtility)
// //     onUtilityChange?.(newUtility)

// //     const plantSlug = selectedPlantName
// //       ? selectedPlantName.toLowerCase().replace(/\s/g, "-")
// //       : ""
// //     const utilitySlug = newUtility.toLowerCase().replace(/\s/g, "-")

// //     navigate(`/utilities/${plantSlug}/${utilitySlug}`)
// //   }

// //   return (
// //     // <div className="sticky top-0 z-20 px-4 pt-4 pb-2 mt-12 -ml-2">
// //     <div className="sticky top-0 z-10 px-4 pt-2 pb-2 mt-14  shadow-sm border-b bg-neutral">
// //       {/* <div className="flex flex-row items-end gap-8"> */}
// //       <div className="flex flex-col sm:flex-row sm:items-end sm:gap-8 gap-4 mt-1">
// //         {/* --- Plant Dropdown --- */}
// //         {/* <div className="flex flex-row items-center gap-2"> */}
// //         <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
// //           <label
// //             htmlFor="plant"
// //             className="block text-md font-medium whitespace-nowrap"
// //           >
// //             Plant Name <span className="text-red-500">*</span>
// //           </label>
// //           {/* <div className="relative"> */}
// //           <div className="relative w-full sm:min-w-[180px]">
// //             <select
// //               id="plant"
// //               value={selectedPlantName}
// //               onChange={handlePlantNameChange}
// //               // className="border border-gray-300 rounded px-3 py-2 appearance-none min-w-[160px]"
// //               className="border border-gray-300 rounded-md px-3 py-2 pr-8 w-full
// //                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
// //                        disabled:bg-gray-100 disabled:text-gray-400 transition-all"
// //               disabled={loadingError}
// //               required
// //             >
// //               <option value="" disabled>
// //                 Select PlantName
// //               </option>
// //               {plantNameOptions.map((plant) => (
// //                 <option key={plant.plantId} value={plant.plantName}>
// //                   {plant.plantName}
// //                 </option>
// //               ))}
// //             </select>
// //             {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"> */}
// //             <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
// //               <ChevronDown className="w-4 h-4" />
// //             </div>
// //           </div>
// //         </div>

// //         {/* --- Utility Dropdown --- */}
// //         {/* <div className="flex flex-row items-center gap-2"> */}
// //         <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
// //           <label
// //             htmlFor="utility"
// //             // className="block text-md font-medium whitespace-nowrap"
// //             className="text-sm font-medium whitespace-nowrap"
// //           >
// //             Utilities <span className="text-red-500">*</span>
// //           </label>
// //           {/* <div className="relative"> */}
// //           <div className="relative w-full sm:min-w-[180px]">
// //             <select
// //               id="utility"
// //               value={selectedUtility}
// //               onChange={handleUtilityChange}
// //               // className="border border-gray-300 rounded px-3 py-2 appearance-none min-w-[160px]"
// //               className="border border-gray-300 rounded-md px-3 py-2 pr-8 w-full
// //                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
// //                        disabled:bg-gray-100 disabled:text-gray-400 transition-all"
// //               required
// //               disabled={!selectedPlantName}
// //             >
// //               <option value="" disabled>
// //                 Select Utility
// //               </option>
// //               {utilityOptions.map((utility) => (
// //                 <option key={utility.tab} value={utility.tab}>
// //                   {utility.tab}
// //                 </option>
// //               ))}
// //             </select>
// //             {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"> */}
// //             <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
// //               <ChevronDown className="w-4 h-4" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default UtilityHeader
