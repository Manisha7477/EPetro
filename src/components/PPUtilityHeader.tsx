import React, { useEffect, useState, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import api from "@/api/axiosInstance"

interface PPUtilityHeaderProps {
  onPlantNameChange?: (plant: { plantId: number; plantName: string }) => void
  onLineNameChange?: (line: { lineId: number; lineName: string }) => void
  onUtilityChange?: (utility: {
    utilityId: number
    utilityName: string
  }) => void
}

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

const utilityOptions: Utility[] = [
  { utilityId: 1, utilityName: "Boiler" },
  { utilityId: 2, utilityName: "Chiller" },
  { utilityId: 3, utilityName: "AirCompressor" },
  { utilityId: 4, utilityName: "Generator" },
]

const PPUtilityHeader: React.FC<PPUtilityHeaderProps> = ({
  onPlantNameChange,
  onLineNameChange,
  onUtilityChange,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [plantNameOptions, setPlantNameOptions] = useState<Plant[]>([])
  const [lineOptions, setLineOptions] = useState<Line[]>([])

  const [selectedPlantName, setSelectedPlantName] = useState("")
  const [selectedLineName, setSelectedLineName] = useState("")
  const [selectedUtility, setSelectedUtility] = useState("")

  const [loadingError, setLoadingError] = useState(false)
  const [currentBasePath, setCurrentBasePath] = useState("/utilities")

  // --- Extract basePath dynamically from URL ---
  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean)
    const baseIndex = segments.findIndex(
      (s) => s === "plantPerformanceUtilities",
    )
    if (baseIndex !== -1) {
      setCurrentBasePath("/" + segments.slice(0, baseIndex + 1).join("/"))
    } else {
      setCurrentBasePath("/utilities")
    }
  }, [location.pathname])

  // --- Parse URL segments back into selections ---
  const parsePathSegments = useCallback(
    (pathname: string) => {
      const segments = pathname.split("/").filter(Boolean)
      const baseIndex = segments.findIndex(
        (s) => s === "plantPerformanceUtilities",
      )
      if (baseIndex === -1) return { plant: null, line: null, utility: null }

      const plantSlug = segments[baseIndex + 1] || null
      const lineSlug = segments[baseIndex + 2] || null
      const utilitySlug = segments[baseIndex + 3] || null

      const plant = plantNameOptions.find(
        (p) => p.plantName.toLowerCase().replace(/\s/g, "-") === plantSlug,
      )

      const line = lineOptions.find(
        (l) => l.lineName.toLowerCase().replace(/\s/g, "-") === lineSlug,
      )

      const utility = utilityOptions.find(
        (u) => u.utilityName.toLowerCase().replace(/\s/g, "-") === utilitySlug,
      )

      return {
        plant: plant || null,
        line: line || null,
        utility: utility || null,
      }
    },
    [plantNameOptions, lineOptions],
  )

  // --- Fetch plants ---
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await api.get("/User/Plant_DD")
        if (Array.isArray(response.data)) {
          setPlantNameOptions(response.data)
        } else {
          setLoadingError(true)
          console.error("Unexpected plant list format", response.data)
        }
      } catch (err) {
        setLoadingError(true)
        console.error("Error fetching plant list:", err)
      }
    }
    fetchPlants()
  }, [])

  // --- Fetch lines whenever plant changes ---
  useEffect(() => {
    const fetchLines = async () => {
      const selected = plantNameOptions.find(
        (p) => p.plantName === selectedPlantName,
      )
      if (!selected) return

      try {
        const response = await api.get(
          `/EdgeDevice/GetLineDD?plantId=${selected.plantId}`,
        )
        if (Array.isArray(response.data)) {
          setLineOptions(response.data)
        }
      } catch (err) {
        console.error("Error fetching line list:", err)
      }
    }

    if (selectedPlantName) fetchLines()
  }, [selectedPlantName, plantNameOptions])

  // --- Sync state with URL OR set defaults ---
  useEffect(() => {
    if (plantNameOptions.length === 0 || loadingError) return

    const { plant, line, utility } = parsePathSegments(location.pathname)

    if (plant) {
      setSelectedPlantName(plant.plantName)
      onPlantNameChange?.(plant)
    }
    if (line) {
      setSelectedLineName(line.lineName)
      onLineNameChange?.(line)
    }
    if (utility) {
      setSelectedUtility(utility.utilityName)
      onUtilityChange?.(utility)
    }

    // --- Apply defaults only if no valid URL found ---
    if (!plant && !line && !utility && !selectedPlantName) {
      const taiz = plantNameOptions.find((p) => p.plantName === "Taiz")
      if (taiz) {
        setSelectedPlantName(taiz.plantName)
        const defaultUtility = utilityOptions.find(
          (u) => u.utilityName === "Generator",
        )
        if (defaultUtility) {
          setSelectedUtility(defaultUtility.utilityName)
          onPlantNameChange?.(taiz)
          onUtilityChange?.(defaultUtility)
        }

        api.get(`/EdgeDevice/GetLineDD?plantId=${taiz.plantId}`).then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const defaultLine = res.data[0]
            setLineOptions(res.data)
            setSelectedLineName(defaultLine.lineName)
            onLineNameChange?.(defaultLine)

            navigate(
              `${currentBasePath}/taiz/${defaultLine.lineName
                .toLowerCase()
                .replace(/\s/g, "-")}/generator`,
              { replace: true },
            )
          }
        })
      }
    }
  }, [
    plantNameOptions,
    loadingError,
    location.pathname,
    parsePathSegments,
    onPlantNameChange,
    onLineNameChange,
    onUtilityChange,
    navigate,
    currentBasePath,
    selectedPlantName,
  ])

  // --- Handlers ---
  const handlePlantNameChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newPlantName = e.target.value
    setSelectedPlantName(newPlantName)

    const selected = plantNameOptions.find((p) => p.plantName === newPlantName)
    if (!selected) return

    onPlantNameChange?.(selected)

    try {
      const response = await api.get(
        `/EdgeDevice/GetLineDD?plantId=${selected.plantId}`,
      )
      if (Array.isArray(response.data) && response.data.length > 0) {
        setLineOptions(response.data)

        // Auto-pick first line
        const defaultLine = response.data[0]
        setSelectedLineName(defaultLine.lineName)
        onLineNameChange?.(defaultLine)

        // Keep utility if already chosen, else default to Generator
        const utility =
          utilityOptions.find((u) => u.utilityName === selectedUtility) ||
          utilityOptions.find((u) => u.utilityName === "Generator")

        if (utility) {
          setSelectedUtility(utility.utilityName)
          onUtilityChange?.(utility)

          const plantSlug = newPlantName.toLowerCase().replace(/\s/g, "-")
          const lineSlug = defaultLine.lineName
            .toLowerCase()
            .replace(/\s/g, "-")
          const utilitySlug = utility.utilityName
            .toLowerCase()
            .replace(/\s/g, "-")

          navigate(`${currentBasePath}/${plantSlug}/${lineSlug}/${utilitySlug}`)
        }
      } else {
        setLineOptions([])
        setSelectedLineName("")
        setSelectedUtility("")
      }
    } catch (err) {
      console.error("Error fetching line list:", err)
    }
  }

  const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLineName = e.target.value
    setSelectedLineName(newLineName)

    const selected = lineOptions.find((l) => l.lineName === newLineName)
    if (selected) {
      onLineNameChange?.(selected)
    }

    if (selectedPlantName && selectedUtility) {
      const plantSlug = selectedPlantName.toLowerCase().replace(/\s/g, "-")
      const lineSlug = newLineName.toLowerCase().replace(/\s/g, "-")
      const utilitySlug = selectedUtility.toLowerCase().replace(/\s/g, "-")
      navigate(`${currentBasePath}/${plantSlug}/${lineSlug}/${utilitySlug}`)
    }
  }

  const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUtility = e.target.value
    setSelectedUtility(newUtility)

    const selected = utilityOptions.find((u) => u.utilityName === newUtility)
    if (selected) {
      onUtilityChange?.(selected) // ✅ send object { utilityId, utilityName }
    }

    if (selectedPlantName && selectedLineName && selected) {
      const plantSlug = selectedPlantName.toLowerCase().replace(/\s/g, "-")
      const lineSlug = selectedLineName.toLowerCase().replace(/\s/g, "-")
      const utilitySlug = selected.utilityName.toLowerCase().replace(/\s/g, "-")
      navigate(`${currentBasePath}/${plantSlug}/${lineSlug}/${utilitySlug}`)
    }
  }

  return (
    <div className="sticky top-0 z-10 px-2 pb-2 shadow-sm border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-end sm:gap-8 gap-4 mt-1">
        {/* Plant */}
        <Dropdown
          id="plant"
          label="Plant Name"
          value={selectedPlantName}
          onChange={handlePlantNameChange}
          options={plantNameOptions.map((p) => ({
            id: p.plantId,
            label: p.plantName,
          }))}
          required
        />

        {/* Line */}
        <Dropdown
          id="line"
          label="Line Name"
          value={selectedLineName}
          onChange={handleLineChange}
          options={lineOptions.map((l) => ({
            id: l.lineId,
            label: l.lineName,
          }))}
          disabled={!selectedPlantName}
          required
        />

        {/* Utility */}
        <Dropdown
          id="utility"
          label="Utilities"
          value={selectedUtility}
          onChange={handleUtilityChange}
          options={utilityOptions.map((u) => ({
            id: u.utilityId,
            label: u.utilityName,
          }))}
          disabled={!selectedLineName}
          required
        />
      </div>
    </div>
  )
}

// 🔹 Small reusable dropdown
const Dropdown = ({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
  required,
}: {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { id: number; label: string }[]
  disabled?: boolean
  required?: boolean
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
    <label htmlFor={id} className="text-sm font-medium whitespace-nowrap">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative w-full flex">
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="border border-gray-300 rounded-md px-3 py-2 pr-8 w-full text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((o) => (
          <option key={o.id} value={o.label}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-2 top-3 text-gray-500 pointer-events-none" />
    </div>
  </div>
)

export default PPUtilityHeader

// import React, { useEffect, useState, useCallback } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import { ChevronDown } from "lucide-react"
// import api from "@/api/axiosInstance"

// interface PPUtilityHeaderProps {
//   onPlantNameChange?: (plant: { plantId: number; plantName: string }) => void
//   onLineNameChange?: (line: { lineId: number; lineName: string }) => void
//   onUtilityChange?: (utility: {
//     utilityId: number
//     utilityName: string
//   }) => void
// }

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

// const utilityOptions: Utility[] = [
//   { utilityId: 1, utilityName: "Boiler" },
//   { utilityId: 2, utilityName: "Chiller" },
//   { utilityId: 3, utilityName: "AirCompressor" },
//   { utilityId: 4, utilityName: "Generator" },
// ]

// const PPUtilityHeader: React.FC<PPUtilityHeaderProps> = ({
//   onPlantNameChange,
//   onLineNameChange,
//   onUtilityChange,
// }) => {
//   const navigate = useNavigate()
//   const location = useLocation()

//   const [plantNameOptions, setPlantNameOptions] = useState<Plant[]>([])
//   const [lineOptions, setLineOptions] = useState<Line[]>([])
//   const [selectedPlantName, setSelectedPlantName] = useState("")
//   const [selectedLineName, setSelectedLineName] = useState("")
//   const [selectedUtility, setSelectedUtility] = useState("")

//   const [loadingError, setLoadingError] = useState(false)
//   const [currentBasePath, setCurrentBasePath] = useState("/utilities")

//   // --- Extract basePath dynamically from URL ---
//   useEffect(() => {
//     const segments = location.pathname.split("/").filter(Boolean)
//     const baseIndex = segments.findIndex(
//       (s) => s === "plantPerformanceUtilities",
//     )
//     setCurrentBasePath(
//       baseIndex !== -1
//         ? "/" + segments.slice(0, baseIndex + 1).join("/")
//         : "/utilities",
//     )
//   }, [location.pathname])

//   // --- Fetch plants once ---
//   useEffect(() => {
//     api
//       .get("/User/Plant_DD")
//       .then((res) => {
//         if (Array.isArray(res.data)) {
//           setPlantNameOptions(res.data)
//         } else {
//           setLoadingError(true)
//           console.error("Unexpected plant list format", res.data)
//         }
//       })
//       .catch((err) => {
//         setLoadingError(true)
//         console.error("Error fetching plant list:", err)
//       })
//   }, [])

//   // --- Helper: fetch lines ---
//   const fetchLines = async (plantId: number) => {
//     try {
//       const res = await api.get(`/EdgeDevice/GetLineDD?plantId=${plantId}`)
//       if (Array.isArray(res.data)) {
//         setLineOptions(res.data)
//         return res.data
//       }
//     } catch (err) {
//       console.error("Error fetching line list:", err)
//     }
//     return []
//   }

//   // --- Sync with URL OR set defaults ---
//   useEffect(() => {
//     if (plantNameOptions.length === 0 || loadingError) return

//     const segments = location.pathname.split("/").filter(Boolean)
//     const baseIndex = segments.findIndex(
//       (s) => s === "plantPerformanceUtilities",
//     )
//     const plantSlug = segments[baseIndex + 1] || null
//     const lineSlug = segments[baseIndex + 2] || null
//     const utilitySlug = segments[baseIndex + 3] || null

//     const plant = plantNameOptions.find(
//       (p) => p.plantName.toLowerCase().replace(/\s/g, "-") === plantSlug,
//     )

//     if (plant) {
//       setSelectedPlantName(plant.plantName)
//       onPlantNameChange?.(plant)

//       fetchLines(plant.plantId).then((lines) => {
//         let line = lines.find(
//           (l) => l.lineName.toLowerCase().replace(/\s/g, "-") === lineSlug,
//         )
//         if (!line && lines.length > 0) line = lines[0]

//         if (line) {
//           setSelectedLineName(line.lineName)
//           onLineNameChange?.(line)
//         }

//         let utility = utilityOptions.find(
//           (u) =>
//             u.utilityName.toLowerCase().replace(/\s/g, "-") === utilitySlug,
//         )
//         if (!utility)
//           utility = utilityOptions.find((u) => u.utilityName === "Generator")

//         if (utility) {
//           setSelectedUtility(utility.utilityName)
//           onUtilityChange?.(utility)
//         }

//         // If URL was empty, navigate with defaults
//         if (!plantSlug || !lineSlug || !utilitySlug) {
//           navigate(
//             `${currentBasePath}/${plant.plantName
//               .toLowerCase()
//               .replace(/\s/g, "-")}/${line?.lineName
//               .toLowerCase()
//               .replace(/\s/g, "-")}/${utility?.utilityName
//               .toLowerCase()
//               .replace(/\s/g, "-")}`,
//             { replace: true },
//           )
//         }
//       })
//     } else {
//       // no URL → default to 0th plant + 0th line + Generator
//       const defaultPlant = plantNameOptions[0]
//       if (defaultPlant) {
//         setSelectedPlantName(defaultPlant.plantName)
//         onPlantNameChange?.(defaultPlant)

//         fetchLines(defaultPlant.plantId).then((lines) => {
//           if (lines.length > 0) {
//             const defaultLine = lines[0]
//             setLineOptions(lines)
//             setSelectedLineName(defaultLine.lineName)
//             onLineNameChange?.(defaultLine)

//             const defaultUtility = utilityOptions.find(
//               (u) => u.utilityName === "Generator",
//             )
//             if (defaultUtility) {
//               setSelectedUtility(defaultUtility.utilityName)
//               onUtilityChange?.(defaultUtility)

//               navigate(
//                 `${currentBasePath}/${defaultPlant.plantName
//                   .toLowerCase()
//                   .replace(/\s/g, "-")}/${defaultLine.lineName
//                   .toLowerCase()
//                   .replace(/\s/g, "-")}/generator`,
//                 { replace: true },
//               )
//             }
//           }
//         })
//       }
//     }
//   }, [plantNameOptions, loadingError, location.pathname, currentBasePath])

//   // --- Handlers ---
//   const handlePlantNameChange = async (
//     e: React.ChangeEvent<HTMLSelectElement>,
//   ) => {
//     const newPlantName = e.target.value
//     setSelectedPlantName(newPlantName)

//     const selected = plantNameOptions.find((p) => p.plantName === newPlantName)
//     if (!selected) return
//     onPlantNameChange?.(selected)

//     const lines = await fetchLines(selected.plantId)
//     if (lines.length > 0) {
//       const defaultLine = lines[0]
//       setSelectedLineName(defaultLine.lineName)
//       onLineNameChange?.(defaultLine)

//       const utility =
//         utilityOptions.find((u) => u.utilityName === selectedUtility) ||
//         utilityOptions.find((u) => u.utilityName === "Generator")

//       if (utility) {
//         setSelectedUtility(utility.utilityName)
//         onUtilityChange?.(utility)

//         navigate(
//           `${currentBasePath}/${newPlantName
//             .toLowerCase()
//             .replace(/\s/g, "-")}/${defaultLine.lineName
//             .toLowerCase()
//             .replace(/\s/g, "-")}/${utility.utilityName
//             .toLowerCase()
//             .replace(/\s/g, "-")}`,
//         )
//       }
//     } else {
//       setLineOptions([])
//       setSelectedLineName("")
//       setSelectedUtility("")
//     }
//   }

//   const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newLineName = e.target.value
//     setSelectedLineName(newLineName)

//     const selected = lineOptions.find((l) => l.lineName === newLineName)
//     if (selected) onLineNameChange?.(selected)

//     if (selectedPlantName && selectedUtility) {
//       navigate(
//         `${currentBasePath}/${selectedPlantName
//           .toLowerCase()
//           .replace(/\s/g, "-")}/${newLineName
//           .toLowerCase()
//           .replace(/\s/g, "-")}/${selectedUtility
//           .toLowerCase()
//           .replace(/\s/g, "-")}`,
//       )
//     }
//   }

//   const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newUtility = e.target.value
//     setSelectedUtility(newUtility)

//     const selected = utilityOptions.find((u) => u.utilityName === newUtility)
//     if (selected) onUtilityChange?.(selected)

//     if (selectedPlantName && selectedLineName && selected) {
//       navigate(
//         `${currentBasePath}/${selectedPlantName
//           .toLowerCase()
//           .replace(/\s/g, "-")}/${selectedLineName
//           .toLowerCase()
//           .replace(/\s/g, "-")}/${selected.utilityName
//           .toLowerCase()
//           .replace(/\s/g, "-")}`,
//       )
//     }
//   }

//   return (
//     <div className="sticky top-0 z-10 px-4 pt-2 pb-2 mt-14 bg-neutral shadow-sm border-b border-gray-200">
//       <div className="flex flex-col sm:flex-row sm:items-end sm:gap-8 gap-4 mt-1">
//         <Dropdown
//           id="plant"
//           label="Plant Name"
//           value={selectedPlantName}
//           onChange={handlePlantNameChange}
//           options={plantNameOptions.map((p) => ({
//             id: p.plantId,
//             label: p.plantName,
//           }))}
//           required
//         />
//         <Dropdown
//           id="line"
//           label="Line Name"
//           value={selectedLineName}
//           onChange={handleLineChange}
//           options={lineOptions.map((l) => ({
//             id: l.lineId,
//             label: l.lineName,
//           }))}
//           disabled={!selectedPlantName}
//           required
//         />
//         <Dropdown
//           id="utility"
//           label="Utilitiy"
//           value={selectedUtility}
//           onChange={handleUtilityChange}
//           options={utilityOptions.map((u) => ({
//             id: u.utilityId,
//             label: u.utilityName,
//           }))}
//           disabled={!selectedLineName}
//           required
//         />
//       </div>
//     </div>
//   )
// }

// // 🔹 Reusable Dropdown
// const Dropdown = ({
//   id,
//   label,
//   value,
//   onChange,
//   options,
//   disabled,
//   required,
// }: {
//   id: string
//   label: string
//   value: string
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
//   options: { id: number; label: string }[]
//   disabled?: boolean
//   required?: boolean
// }) => (
//   <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
//     <label htmlFor={id} className="text-sm font-medium whitespace-nowrap">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <div className="relative w-full sm:min-w-[180px]">
//       <select
//         id={id}
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//         required={required}
//         className="border border-gray-300 rounded-md px-3 py-2 pr-8 w-full text-sm
//                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
//       >
//         <option value="" disabled>
//           Select {label}
//         </option>
//         {options.map((o) => (
//           <option key={o.id} value={o.label}>
//             {o.label}
//           </option>
//         ))}
//       </select>
//       <ChevronDown className="w-4 h-4 absolute right-2 top-3 text-gray-500 pointer-events-none" />
//     </div>
//   </div>
// )

// export default PPUtilityHeader

// // import React, { useEffect, useState, useCallback } from "react"
// // import { useNavigate, useLocation } from "react-router-dom"
// // import { ChevronDown } from "lucide-react"
// // import api from "@/api/axiosInstance"

// // interface PPUtilityHeaderProps {
// //   onPlantNameChange?: (plant: { plantId: number; plantName: string }) => void
// //   onLineNameChange?: (line: { lineId: number; lineName: string }) => void
// //   onUtilityChange?: (utility: string) => void
// // }

// // interface Plant {
// //   plantId: number
// //   plantName: string
// // }

// // interface Line {
// //   lineId: number
// //   lineName: string
// // }

// // const utilityOptions = [
// //   { id: 1, tab: "Boiler" },
// //   { id: 2, tab: "Chiller" },
// //   { id: 3, tab: "Air Compressor" },
// //   { id: 4, tab: "Generator" },
// // ]

// // const PPUtilityHeader: React.FC<PPUtilityHeaderProps> = ({
// //   onPlantNameChange,
// //   onLineNameChange,
// //   onUtilityChange,
// // }) => {
// //   const navigate = useNavigate()
// //   const location = useLocation()

// //   const [plantNameOptions, setPlantNameOptions] = useState<Plant[]>([])
// //   const [lineOptions, setLineOptions] = useState<Line[]>([])

// //   const [selectedPlantName, setSelectedPlantName] = useState("")
// //   const [selectedLineName, setSelectedLineName] = useState("")
// //   const [selectedUtility, setSelectedUtility] = useState("")

// //   const [loadingError, setLoadingError] = useState(false)
// //   const [currentBasePath, setCurrentBasePath] = useState("/utilities")

// //   // --- Extract basePath dynamically from URL ---
// //   useEffect(() => {
// //     const segments = location.pathname.split("/").filter(Boolean)
// //     const baseIndex = segments.findIndex(
// //       (s) => s === "plantPerformanceUtilities",
// //     )
// //     if (baseIndex !== -1) {
// //       setCurrentBasePath("/" + segments.slice(0, baseIndex + 1).join("/"))
// //     } else {
// //       setCurrentBasePath("/utilities")
// //     }
// //   }, [location.pathname])

// //   // --- Parse URL segments back into selections ---
// //   const parsePathSegments = useCallback(
// //     (pathname: string) => {
// //       const segments = pathname.split("/").filter(Boolean)
// //       const baseIndex = segments.findIndex(
// //         (s) => s === "plantPerformanceUtilities",
// //       )
// //       if (baseIndex === -1)
// //         return { plant: null, line: null, utilityName: null }

// //       const plantSlug = segments[baseIndex + 1] || null
// //       const lineSlug = segments[baseIndex + 2] || null
// //       const utilitySlug = segments[baseIndex + 3] || null

// //       const plant = plantNameOptions.find(
// //         (p) => p.plantName.toLowerCase().replace(/\s/g, "-") === plantSlug,
// //       )

// //       const line = lineOptions.find(
// //         (l) => l.lineName.toLowerCase().replace(/\s/g, "-") === lineSlug,
// //       )

// //       const utility = utilityOptions.find(
// //         (u) => u.tab.toLowerCase().replace(/\s/g, "-") === utilitySlug,
// //       )

// //       return {
// //         plant: plant || null,
// //         line: line || null,
// //         utilityName: utility ? utility.tab : null,
// //       }
// //     },
// //     [plantNameOptions, lineOptions],
// //   )

// //   // --- Fetch plants ---
// //   useEffect(() => {
// //     const fetchPlants = async () => {
// //       try {
// //         const response = await api.get("/User/Plant_DD")
// //         if (Array.isArray(response.data)) {
// //           setPlantNameOptions(response.data)
// //         } else {
// //           setLoadingError(true)
// //           console.error("Unexpected plant list format", response.data)
// //         }
// //       } catch (err) {
// //         setLoadingError(true)
// //         console.error("Error fetching plant list:", err)
// //       }
// //     }
// //     fetchPlants()
// //   }, [])

// //   // --- Fetch lines whenever plant changes ---
// //   useEffect(() => {
// //     const fetchLines = async () => {
// //       const selected = plantNameOptions.find(
// //         (p) => p.plantName === selectedPlantName,
// //       )
// //       if (!selected) return

// //       try {
// //         const response = await api.get(
// //           `/EdgeDevice/GetLineDD?plantId=${selected.plantId}`,
// //         )
// //         if (Array.isArray(response.data)) {
// //           setLineOptions(response.data)
// //         }
// //       } catch (err) {
// //         console.error("Error fetching line list:", err)
// //       }
// //     }

// //     if (selectedPlantName) fetchLines()
// //   }, [selectedPlantName, plantNameOptions])

// //   // --- Sync state with URL OR set defaults ---
// //   useEffect(() => {
// //     if (plantNameOptions.length === 0 || loadingError) return

// //     const { plant, line, utilityName } = parsePathSegments(location.pathname)

// //     if (plant) {
// //       setSelectedPlantName(plant.plantName)
// //       onPlantNameChange?.(plant)
// //     }
// //     if (line) {
// //       setSelectedLineName(line.lineName)
// //       onLineNameChange?.(line)
// //     }
// //     if (utilityName) {
// //       setSelectedUtility(utilityName)
// //       onUtilityChange?.(utilityName)
// //     }

// //     // --- Apply defaults only if no valid URL found ---
// //     if (!plant && !line && !utilityName && !selectedPlantName) {
// //       const taiz = plantNameOptions.find((p) => p.plantName === "Taiz")
// //       if (taiz) {
// //         setSelectedPlantName(taiz.plantName)
// //         setSelectedUtility("Generator")
// //         onPlantNameChange?.(taiz)
// //         onUtilityChange?.("Generator")

// //         api.get(`/EdgeDevice/GetLineDD?plantId=${taiz.plantId}`).then((res) => {
// //           if (Array.isArray(res.data) && res.data.length > 0) {
// //             const defaultLine = res.data[0]
// //             setLineOptions(res.data)
// //             setSelectedLineName(defaultLine.lineName)
// //             onLineNameChange?.(defaultLine)

// //             navigate(
// //               `${currentBasePath}/taiz/${defaultLine.lineName
// //                 .toLowerCase()
// //                 .replace(/\s/g, "-")}/generator`,
// //               { replace: true },
// //             )
// //           }
// //         })
// //       }
// //     }
// //   }, [
// //     plantNameOptions,
// //     loadingError,
// //     location.pathname,
// //     parsePathSegments,
// //     onPlantNameChange,
// //     onLineNameChange,
// //     onUtilityChange,
// //     navigate,
// //     currentBasePath,
// //     selectedPlantName,
// //   ])

// //   // --- Handlers ---

// //   const handlePlantNameChange = async (
// //     e: React.ChangeEvent<HTMLSelectElement>,
// //   ) => {
// //     const newPlantName = e.target.value
// //     setSelectedPlantName(newPlantName)

// //     const selected = plantNameOptions.find((p) => p.plantName === newPlantName)
// //     if (!selected) return

// //     onPlantNameChange?.(selected)

// //     try {
// //       const response = await api.get(
// //         `/EdgeDevice/GetLineDD?plantId=${selected.plantId}`,
// //       )
// //       if (Array.isArray(response.data) && response.data.length > 0) {
// //         setLineOptions(response.data)

// //         // Auto-pick first line
// //         const defaultLine = response.data[0]
// //         setSelectedLineName(defaultLine.lineName)
// //         onLineNameChange?.(defaultLine)

// //         // Keep utility if already chosen, else default to Generator
// //         const utility = selectedUtility || "Generator"
// //         setSelectedUtility(utility)
// //         onUtilityChange?.(utility)

// //         // Navigate to new URL
// //         const plantSlug = newPlantName.toLowerCase().replace(/\s/g, "-")
// //         const lineSlug = defaultLine.lineName.toLowerCase().replace(/\s/g, "-")
// //         const utilitySlug = utility.toLowerCase().replace(/\s/g, "-")

// //         navigate(`${currentBasePath}/${plantSlug}/${lineSlug}/${utilitySlug}`)
// //       } else {
// //         setLineOptions([])
// //         setSelectedLineName("")
// //         setSelectedUtility("")
// //       }
// //     } catch (err) {
// //       console.error("Error fetching line list:", err)
// //     }
// //   }

// //   const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const newLineName = e.target.value
// //     setSelectedLineName(newLineName)

// //     const selected = lineOptions.find((l) => l.lineName === newLineName)
// //     if (selected) {
// //       onLineNameChange?.(selected)
// //     }

// //     if (selectedPlantName && selectedUtility) {
// //       const plantSlug = selectedPlantName.toLowerCase().replace(/\s/g, "-")
// //       const lineSlug = newLineName.toLowerCase().replace(/\s/g, "-")
// //       const utilitySlug = selectedUtility.toLowerCase().replace(/\s/g, "-")
// //       navigate(`${currentBasePath}/${plantSlug}/${lineSlug}/${utilitySlug}`)
// //     }
// //   }

// //   const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const newUtility = e.target.value
// //     setSelectedUtility(newUtility)
// //     onUtilityChange?.(newUtility)

// //     if (selectedPlantName && selectedLineName) {
// //       const plantSlug = selectedPlantName.toLowerCase().replace(/\s/g, "-")
// //       const lineSlug = selectedLineName.toLowerCase().replace(/\s/g, "-")
// //       const utilitySlug = newUtility.toLowerCase().replace(/\s/g, "-")
// //       navigate(`${currentBasePath}/${plantSlug}/${lineSlug}/${utilitySlug}`)
// //     }
// //   }

// //   return (
// //     <div className="sticky top-0 z-10 px-4 pt-2 pb-2 mt-14 bg-neutral shadow-sm border-b border-gray-200">
// //       <div className="flex flex-col sm:flex-row sm:items-end sm:gap-8 gap-4 mt-1">
// //         {/* Plant */}
// //         <Dropdown
// //           id="plant"
// //           label="Plant Name"
// //           value={selectedPlantName}
// //           onChange={handlePlantNameChange}
// //           options={plantNameOptions.map((p) => ({
// //             id: p.plantId,
// //             label: p.plantName,
// //           }))}
// //           required
// //         />

// //         {/* Line */}
// //         <Dropdown
// //           id="line"
// //           label="Line Name"
// //           value={selectedLineName}
// //           onChange={handleLineChange}
// //           options={lineOptions.map((l) => ({
// //             id: l.lineId,
// //             label: l.lineName,
// //           }))}
// //           disabled={!selectedPlantName}
// //           required
// //         />

// //         {/* Utility */}
// //         <Dropdown
// //           id="utility"
// //           label="Utilities"
// //           value={selectedUtility}
// //           onChange={handleUtilityChange}
// //           options={utilityOptions.map((u) => ({ id: u.id, label: u.tab }))}
// //           disabled={!selectedLineName}
// //           required
// //         />
// //       </div>
// //     </div>
// //   )
// // }

// // // 🔹 Small reusable dropdown to reduce duplication
// // const Dropdown = ({
// //   id,
// //   label,
// //   value,
// //   onChange,
// //   options,
// //   disabled,
// //   required,
// // }: {
// //   id: string
// //   label: string
// //   value: string
// //   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
// //   options: { id: number; label: string }[]
// //   disabled?: boolean
// //   required?: boolean
// // }) => (
// //   <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
// //     <label htmlFor={id} className="text-sm font-medium whitespace-nowrap">
// //       {label} {required && <span className="text-red-500">*</span>}
// //     </label>
// //     <div className="relative w-full sm:min-w-[180px]">
// //       <select
// //         id={id}
// //         value={value}
// //         onChange={onChange}
// //         disabled={disabled}
// //         required={required}
// //         className="border border-gray-300 rounded-md px-3 py-2 pr-8 w-full text-sm
// //                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
// //       >
// //         <option value="" disabled>
// //           Select {label}
// //         </option>
// //         {options.map((o) => (
// //           <option key={o.id} value={o.label}>
// //             {o.label}
// //           </option>
// //         ))}
// //       </select>
// //       <ChevronDown className="w-4 h-4 absolute right-2 top-3 text-gray-500 pointer-events-none" />
// //     </div>
// //   </div>
// // )

// // export default PPUtilityHeader
