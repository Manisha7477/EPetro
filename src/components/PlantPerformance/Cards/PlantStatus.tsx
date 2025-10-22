import React from "react"

type PlantStatusProps = {
  status: "active" | "inactive" | string
}

const PlantStatus: React.FC<PlantStatusProps> = ({ status }) => {
  const isActive = status === "active"

  return (
    <div className="flex items-center bg-white border rounded p-2 w-fit shadow-sm">
      <span className="mr-4 font-semibold text-base">Status</span>
      <span
        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
          isActive
            ? "bg-green-100 text-green-700 border border-green-400"
            : "bg-red-100 text-red-700 border border-red-400"
        }`}
      >
        {isActive ? "Active " : "Inactive"}
      </span>
    </div>
  )
}

export default PlantStatus

// import React from "react"

// type PlantStatusProps = {
//   status: string
// }

// const PlantStatus: React.FC<PlantStatusProps> = ({ status }) => {
//   return (
//     <div className="flex gap-items-center bg-white border rounded p-2 w-fit">
//       <span className="mr-4 font-semibold text-base">Status</span>
//       <div className="flex">
//         <div
//           className={`px-6 py-2 rounded-l transition-colors duration-200 ${
//             status === "active"
//               ? "bg-green-600 text-white font-semibold"
//               : "bg-green-200 text-green-700"
//           }`}
//         >
//           Active
//         </div>
//         <div
//           className={`px-6 py-2 rounded-r transition-colors duration-200 ml-2 ${
//             status === "inactive"
//               ? "bg-red-600 text-white font-semibold"
//               : "bg-red-200 text-red-700"
//           }`}
//         >
//           Inactive
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PlantStatus
