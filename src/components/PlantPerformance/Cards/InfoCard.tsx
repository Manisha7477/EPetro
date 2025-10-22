import React from "react"
import { InfoCardProps, InfoItem } from "@/utils/types"
import PlantStatus from "@/components/PlantPerformance/Cards/PlantStatus"

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  subtitle,
  items,
  columns = 4,
  status, // Default to 4 columns for a professional grid look
}) => {
  // Split items into `columns` roughly-equal groups
  const chunkSize = Math.ceil(items.length / columns)
  const columnsData = Array.from({ length: columns }, (_, i) =>
    items.slice(i * chunkSize, i * chunkSize + chunkSize),
  )

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 px-8 py-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight border-l-4 border-[#0A91AB] pl-2 bg-gradient-to-r from-gray-700/20 to-white-500 w-full mb-2">
          {title}
        </h2>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}

        <div className="w-full">
          <PlantStatus status={status ?? ""} />
          {/* <PlantStatus status="inactive" /> */}
        </div>
      </div>

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
      >
        {columnsData.map((colItems, ci) => (
          <ul key={ci} className="space-y-2">
            {colItems.map((item, ri) =>
              item.href ? (
                <LinkItem key={ri} {...item} />
              ) : (
                <PlainItem key={ri} {...item} />
              ),
            )}
          </ul>
        ))}
      </div>
    </div>
  )
}

const LinkItem: React.FC<InfoItem> = ({ label, value, href }) => (
  <li>
    <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </span>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-blue-700 font-medium hover:underline break-all"
    >
      {value}
    </a>
  </li>
)

const PlainItem: React.FC<InfoItem> = ({ label, value }) => (
  <li>
    <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-xs text-gray-900 font-medium break-all">{value}</span>
  </li>
)

// import React from "react"
// import { InfoCardProps, InfoItem } from "@/utils/types"
// import { motion } from "framer-motion"

// export const InfoCard: React.FC<InfoCardProps> = ({
//   title,
//   subtitle,
//   items,
//   columns = 2,
// }) => {
//   return (
//     <div className="w-full max-w-full px-4 py-2 bg-white shadow-sm rounded-md border border-gray-200">
//       <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-1">
//         {title}
//       </h2>
//       {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}

//       <div className={`grid gap-x-6 gap-y-2 grid-cols-${columns}`}>
//         {items.map((item, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 5 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: index * 0.04 }}
//           >
//             <PlainItem {...item} />
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   )
// }

// const PlainItem: React.FC<InfoItem> = ({ label, value }) => (
//   <div className="flex flex-col text-xs leading-tight">
//     <span className="font-semibold text-gray-700">{label}</span>
//     <span className="text-gray-500">{value ?? "N/A"}</span>
//   </div>
// )

// import React from "react"
// import { InfoCardProps, InfoItem } from "@/utils/types"
// import { motion } from "framer-motion"

// export const InfoCard: React.FC<InfoCardProps> = ({
//   title,
//   subtitle,
//   items,
//   columns = 2,
// }) => {
//   const chunkSize = Math.ceil(items.length / columns)
//   const columnsData = Array.from({ length: columns }, (_, i) =>
//     items.slice(i * chunkSize, i * chunkSize + chunkSize),
//   )

//   return (
//     <div className="w-full max-w-xl p-4 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-xl rounded-2xl border border-gray-300">
//       <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">
//         {title}
//       </h2>
//       {subtitle && (
//         <p className="text-sm text-gray-600 mb-4 italic">{subtitle}</p>
//       )}

//       <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         {items.map((item, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.4, delay: index * 0.05 }}
//             className="p-4 rounded-lg bg-white shadow-sm border hover:shadow-md transition"
//           >
//             <PlainItem {...item} />
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   )
// }

// const PlainItem: React.FC<InfoItem> = ({ label, value }) => (
//   <div className="flex flex-col space-y-1">
//     <span className="text-sm font-semibold text-gray-800">{label}</span>
//     <span className="text-sm text-gray-500">{value ?? "N/A"}</span>
//   </div>
// )

// import React from "react"
// import { InfoCardProps, InfoItem } from "@/utils/types"
// import { motion } from "framer-motion"

// export const InfoCard: React.FC<InfoCardProps> = ({
//   title,
//   subtitle,
//   items,
//   columns = 2,
// }) => {
//   const chunkSize = Math.ceil(items.length / columns)
//   const columnsData = Array.from({ length: columns }, (_, i) =>
//     items.slice(i * chunkSize, i * chunkSize + chunkSize),
//   )

//   return (
//     <div className="w-full max-w-6xl p-6 bg-white shadow-md rounded-xl border border-gray-200">
//       <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
//         {title}
//       </h2>
//       {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}

//       <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//         {items.map((item, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.4, delay: index * 0.05 }}
//           >
//             <PlainItem {...item} />
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   )
// }

// const PlainItem: React.FC<InfoItem> = ({ label, value }) => (
//   <div className="flex flex-col">
//     <span className="text-xs text-gray-500">{label}</span>
//     <span className="text-sm text-gray-800 font-medium">{value ?? "N/A"}</span>
//   </div>
// )

// import React from "react"
// import { InfoCardProps, InfoItem } from "@/utils/types"

// export const InfoCard: React.FC<InfoCardProps> = ({
//   title,
//   subtitle,
//   items,
//   columns = 2,
// }) => {
//   // Split items into `columns` roughly-equal chunks
//   const chunkSize = Math.ceil(items.length / columns)
//   const columnsData = Array.from({ length: columns }, (_, i) =>
//     items.slice(i * chunkSize, i * chunkSize + chunkSize),
//   )

//   return (
//     <div className=" bg-white p-1   ">
//       {" "}
//       {/* w-full rounded-sm border border-gray-400 */}
//       <h2 className="text-xs font-bold border border-solid border-black rounded-lg px-3 py-1 inline-block">
//         {title}
//       </h2>
//       {subtitle && <p className="text-gray-500 mb-4">{subtitle}</p>}
//       <div
//         className="grid gap-6 mt-4"
//         style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
//       >
//         {columnsData.map((colItems, ci) => (
//           <ul key={ci} className="space-y-2">
//             {colItems.map((item, ri) =>
//               item.href ? (
//                 <LinkItem key={ri} {...item} />
//               ) : (
//                 <PlainItem key={ri} {...item} />
//               ),
//             )}
//           </ul>
//         ))}
//       </div>
//     </div>
//   )
// }

// const LinkItem: React.FC<InfoItem> = ({ label, value, href }) => (
//   <li>
//     <span className="font-normal">{label}:</span>{" "}
//     <a
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-blue-600 hover:underline"
//     >
//       {value}
//     </a>
//   </li>
// )

// const PlainItem: React.FC<InfoItem> = ({ label, value }) => (
//   <li>
//     <span className="font-normal">{label}:</span>{" "}
//     <span className="text-gray-800">{value}</span>
//   </li>
// )
