import React from "react"
import { TopThreeCardProps } from "@/utils/types"

const TopThreeCard: React.FC<TopThreeCardProps> = ({ title, data }) => {
  return (
    <div className="w-full bg-white rounded-md border-[1px] border-gray-300 shadow-md p-1">
      <div className="text-xs font-medium text-gray-900 mb-2 flex items-center gap-2">
        {title}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {data.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center text-center rounded-md border-[1px] border-gray-400 shadow-sm p-2 gap-2"
          >
            <div className="text-xs font-base text-gray-900 truncate w-full">{item.title}</div>
            <div className="text-xl font-bold text-secondary">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopThreeCard




//250925
// import React from "react"
// import { TopThreeCardProps } from "@/utils/types"

// const TopThreeCard: React.FC<TopThreeCardProps> = ({ title, data }) => {
//   return (
//     <div className="w-full rounded-lg border bg-white p-2 shadow-md hover:shadow-md transition duration-200">
//       <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
//         {title}
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//         {data.slice(0, 3).map((item, index) => (
//           <div
//             key={index}
//             className="bg-white border border-gray-200 shadow-md rounded-lg p-2 flex flex-col items-center text-center transition-transform hover:scale-[1.03] gap-1"
//           >
//             <div className="text-xs font-semibold text-gray-800 truncate w-full">
//               {item.title}
//             </div>
//             <div className="text-xl font-bold text-gray-800">{item.value}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default TopThreeCard
