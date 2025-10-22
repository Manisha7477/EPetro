import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import { Equipment } from "@/utils/types"

interface ImageImport {
  src: string
}

interface EquipmentOverviewProps {
  data: Equipment[]
  routePrefix: string
  idKey?: keyof Equipment
  nameKey?: keyof Equipment
  modelKey?: keyof Equipment
  imageUrlKey?: string | ImageImport
  title?: string
  loading?: boolean
  utilityName?: string
}

const EquipmentOverviewPage: React.FC<EquipmentOverviewProps> = ({
  data,
  routePrefix,
  idKey = "utilityId",
  nameKey = "utilityName",
  modelKey = "modelNumber",
  imageUrlKey,
  title = "Equipment",
  loading = false,
  utilityName,
}) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  // 🔹 Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading {title}...</p>
      </div>
    )
  }
  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value
  //   const words = value.trim().split(/\s+/)

  //   if (words.length <= 20) {
  //     setSearchQuery(value)
  //   } else {
  //     // Optional: trim it automatically to first 20 words
  //     const limited = words.slice(0, 20).join(" ")
  //     setSearchQuery(limited)
  //   }
  // }

  // 🔹 Filter data by search query

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    if (value.length > 20) {
      setShowPopup(true)
      value = value.slice(0, 20) // Trim to 20 characters
    } else {
      setShowPopup(false)
    }

    setSearchQuery(value)
  }

  const filteredData = data.filter((item) =>
    String(item[nameKey]).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // 🔹 Handle string or object image source
  const getImageUrl = (imageProp: string | ImageImport | undefined) => {
    if (typeof imageProp === "string") return imageProp
    if (imageProp && typeof imageProp === "object" && "src" in imageProp)
      return imageProp.src
    return undefined
  }

  return (
    <div className="p-1 min-h-screen">
      {/* Search Bar */}
      <div className="relative w-full mb-6">
        <input
          value={searchQuery}
          //  onChange={(e) => setSearchQuery(e.target.value)}
          onChange={handleSearchChange}
          placeholder={`Search ${title}`}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                     text-sm bg-white transition-all duration-200"
        />
        <FaSearch
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={14}
        />

        {showPopup && (
          <div className="absolute top-10 left-0 bg-red-100 text-red-600 px-3 py-1 rounded text-xs shadow-md z-50">
            Search up to 20 characters only
          </div>
        )}
      </div>

      {/* Grid */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredData.map((item) => (
            <div
              key={String(item[idKey])}
              onClick={() => navigate(`${routePrefix}/${item[idKey]}`)}
              className="group bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer overflow-hidden
                         hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
            >
              {/* Image container */}
              <div className="w-full h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={getImageUrl(imageUrlKey)}
                  alt="Equipment"
                  className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-3 text-center">
                <p className="text-blue-700 font-semibold underline text-sm truncate">
                  {item[nameKey]}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item[modelKey]}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-sm">
          No {title.toLowerCase()} found.
        </p>
      )}
    </div>
  )
}

export default EquipmentOverviewPage

// import React, { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { FaSearch } from "react-icons/fa"
// import { Equipment } from "@/utils/types"

// interface ImageImport {
//   src: string
// }

// interface EquipmentOverviewProps {
//   data: Equipment[]
//   routePrefix: string
//   idKey?: keyof Equipment
//   nameKey?: keyof Equipment
//   modelKey?: keyof Equipment
//   imageUrlKey?: string | ImageImport
//   title?: string
//   loading?: boolean
//   utilityName?: string
// }

// const EquipmentOverviewPage: React.FC<EquipmentOverviewProps> = ({
//   data,
//   routePrefix,
//   idKey = "utilityId",
//   nameKey = "utilityName",
//   modelKey = "modelNumber",
//   imageUrlKey,
//   title = "Equipment",
//   loading = false,
//   utilityName,
// }) => {
//   const navigate = useNavigate()
//   const [searchQuery, setSearchQuery] = useState("")

//   // 🔹 Show loading state
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-gray-500 text-sm">Loading {title}...</p>
//       </div>
//     )
//   }

//   // 🔹 Filter data by search query
//   const filteredData = data.filter((item) =>
//     String(item[nameKey]).toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   // 🔹 Handle string or object image source
//   const getImageUrl = (imageProp: string | ImageImport | undefined) => {
//     if (typeof imageProp === "string") return imageProp
//     if (imageProp && typeof imageProp === "object" && "src" in imageProp)
//       return imageProp.src
//     return undefined
//   }

//   return (
//     <div className="p-1 min-h-screen">
//       {/* Search Bar */}
//       <div className="relative w-full mb-6">
//         <input
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder={`Search ${title}`}
//           className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm
//                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
//                      text-sm bg-white transition-all duration-200"
//         />
//         <FaSearch
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//           size={14}
//         />
//       </div>

//       {/* Grid */}
//       {filteredData.length > 0 ? (
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//           {filteredData.map((item) => (
//             <div
//               key={String(item[idKey])}
//               onClick={() => navigate(`${routePrefix}/${item[idKey]}`)}
//               className="group bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer overflow-hidden
//                          hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
//             >
//               {/* Image container */}
//               <div className="w-full h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
//                 <img
//                   src={getImageUrl(imageUrlKey)}
//                   alt="Equipment"
//                   className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
//                 />
//               </div>

//               {/* Content */}
//               <div className="p-3 text-center">
//                 <p className="text-blue-700 font-semibold underline text-sm truncate">
//                   {item[nameKey]}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">{item[modelKey]}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500 mt-10 text-sm">
//           No {title.toLowerCase()} found.
//         </p>
//       )}
//     </div>
//   )
// }

// export default EquipmentOverviewPage

// import React, { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { FaSearch } from "react-icons/fa"
// import { Equipment } from "@/utils/types"

// interface ImageImport {
//   src: string
// }

// interface EquipmentOverviewProps {
//   data: Equipment[]
//   routePrefix: string
//   idKey?: keyof Equipment
//   nameKey?: keyof Equipment
//   modelKey?: keyof Equipment
//   imageUrlKey?: string | ImageImport
//   title?: string
// }

// const EquipmentOverviewPage: React.FC<EquipmentOverviewProps> = ({
//   data,
//   routePrefix,
//   idKey = "generatorId",
//   nameKey = "generatorName",
//   modelKey = "modelNumber",
//   imageUrlKey,
//   title = "Equipment Overview",
// }) => {
//   const navigate = useNavigate()
//   const [searchQuery, setSearchQuery] = useState("")

//   const filteredData = data.filter((item) =>
//     String(item[nameKey]).toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   const getImageUrl = (imageProp: string | ImageImport | undefined) => {
//     if (typeof imageProp === "string") return imageProp
//     if (imageProp && typeof imageProp === "object" && "src" in imageProp)
//       return imageProp.src
//     return undefined
//   }

//   return (
//     <div className="p-1 bg-neutral min-h-screen">
//       {/* Title */}
//       {/* <h1 className="text-lg font-bold text-gray-800 mb-4">{title}</h1> */}

//       {/* Search Bar */}
//       <div className="relative w-full mb-6">
//         <input
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           placeholder={`Search ${title}`}
//           className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm
//                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
//                      text-sm bg-white transition-all duration-200"
//         />
//         <FaSearch
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//           size={14}
//         />
//       </div>

//       {/* Grid */}
//       {filteredData.length > 0 ? (
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//           {filteredData.map((item) => (
//             <div
//               key={String(item[idKey])}
//               onClick={() => navigate(`${routePrefix}/${item[idKey]}`)}
//               className="group bg-white rounded-xl border border-gray-200 shadow-sm cursor-pointer overflow-hidden
//                          hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
//             >
//               {/* Image container */}
//               <div className="w-full h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
//                 <img
//                   src={getImageUrl(imageUrlKey)}
//                   alt="Equipment"
//                   className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
//                 />
//               </div>

//               {/* Content */}
//               <div className="p-3 text-center">
//                 <p className="text-blue-700 font-semibold underline text-sm truncate">
//                   {item[nameKey]}
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">{item[modelKey]}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500 mt-10 text-sm">
//           No {title.toLowerCase()} found.
//         </p>
//       )}
//     </div>
//   )
// }

// export default EquipmentOverviewPage
