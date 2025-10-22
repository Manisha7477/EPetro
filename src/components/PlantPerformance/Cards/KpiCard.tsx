import React from "react";
import { KpiCardType } from "@/utils/types";

interface KpiCardProps extends KpiCardType {
  icon?: React.ReactNode;
  tooltip?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  kpivalue,
  subtitle,
  icon,
  tooltip,
}) => (
  <div className="relative bg-white w-full rounded-md border-[1px] border-gray-300 shadow-md flex items-center max-w-md">
    {/* Icon column */}
    <div className="flex-shrink-0 flex items-center justify-center w-12 h-20 rounded mr-4">
      {icon ? (
        <span className="text-black font-medium text-base">{icon}</span>
      ) : (
        <span className="text-black font-medium text-base">ICON</span>
      )}
    </div>
    {/* Content column */}
    <div className="flex flex-col justify-center flex-1">
      <div className="flex items-center relative">
        <span className="text-xs font-medium text-gray-900 mr-2">{title}</span>
        {tooltip && (
          <span className="ml-1 group-hover:visible invisible absolute -top-7 left-1/2 transform -translate-x-1/2 z-10 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
            {tooltip}
          </span>
        )}
      </div>
      <div className="text-xl font-bold text-secondary leading-tight">{kpivalue}</div>
      <span className="text-sm text-gray-700 font-medium">{subtitle}</span>
    </div>
  </div>
);

export default KpiCard;


// import React from "react"
// import { KpiCardType } from "@/utils/types"

// const KpiCard = ({ title, kpivalue, subtitle }: KpiCardType) => {
//   return (
//     <div className="w-full rounded-lg border bg-white p-3 shadow-md hover:shadow-md transition duration-200 flex flex-col gap-1">
//       <div className="flex items-center justify-between">
//         <span className="flex items-center gap-1 text-xs font-bold text-gray-700">
//           {title}
//         </span>
//       </div>
//       <div className="text-2xl font-bold text-center text-gray-800">
//         {kpivalue}
//       </div>
//     </div>
//   )
// }

// export default KpiCard
