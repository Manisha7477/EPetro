import React from "react"

import TopThreeCard from "@/components/PlantPerformance/Cards/TopThreeCard"

import {
  energyCostChartData,
  averageEnergyApiResponse,
  electricityChartData,
} from "@/utils/data"
import HomepageDynamicPowerSpikesLive from "@/components/PlantPerformance/Chart/HomepageDynamicPowerSpikesLive"
import EnergyBarLineChart from "@/components/PlantPerformance/Chart/EnergyBarLineChart"
import DonutChart from "@/components/PlantPerformance/Chart/DonutChart"
import ElectricityBarChart from "@/components/PlantPerformance/Chart/ElectricityBarChart"
import PowerUsageBarChart from "@/components/PlantPerformance/Chart/PowerUsageBarChart"
import KpiCard from "@/components/PlantPerformance/Cards/KpiCard"
import { TbFilePower } from "react-icons/tb";
import { BsLightningCharge } from "react-icons/bs";
import { BsCurrencyDollar } from "react-icons/bs";
import { PiBellSimpleRinging, PiPercent } from "react-icons/pi";
// import { FaGasPump } from "react-icons/fa6";
import { MdOutlineGasMeter } from "react-icons/md";
import { TbSteam } from "react-icons/tb";

interface INavbarProps {
  isOpenMenu: boolean
}

const Dashboard: React.FunctionComponent<INavbarProps> = ({ isOpenMenu }) => {
  return (
     <div className="flex flex-col py-2 gap-1 h-full w-full">
      <div className=" grid grid-cols-6  gap-1 h-full">
        <KpiCard
            title="# Plant Energy Consumption"
            kpivalue="24300"
            subtitle="kWh"
            icon={<BsLightningCharge className="text-primary w-12 h-12" />}
          />
          <KpiCard
            title="# Plant Energy Consumption"
            kpivalue="243"
            subtitle="kWh/L"
            icon={<BsLightningCharge className="text-primary h-12 w-12" />}
          />
          <KpiCard
            title="Energy Efficiency"
            kpivalue="23"
            subtitle="kWh/L"
            icon={<PiPercent className="text-primary h-12 w-12" />}
          />
          <KpiCard
                title="# Natural Gas Consumed"
                kpivalue="1000"
                subtitle="L(Past Day)"
                icon={<MdOutlineGasMeter className="text-primary h-12 w-12" />}
          />
          <KpiCard
            title="# Steam Consumed"
            kpivalue="3000"
            subtitle="L(Past Day)"
            icon={<TbSteam className="text-primary h-12 w-12" />}
          />
          <KpiCard
            title="# Energy Cost past Month"
            kpivalue="23"
            subtitle="$"
            icon={<BsCurrencyDollar className="text-primary h-12 w-12" />}
          />

      </div>
      <div className="grid grid-cols-2 w-full gap-1 h-full">
            <div className="flex flex-row gap-1">
                    <div className="flex flex-row gap-1 w-1/3">
                      <KpiCard
                        title="# Energy Consumed by Utilities"
                        kpivalue="3000 kWh"
                        subtitle="kWh"
                        icon={<BsLightningCharge className="text-primary h-12 w-12" />}
                      />
                      </div>
                    <div className="flex flex-row gap-1 w-2/3">
                    <TopThreeCard
                        title="# 3 Most energy Consuming utilities"
                        data={[
                          { title: "Gen-YK341", value: "12 kWh" },
                          { title: "Utility 2", value: "11 kWh" },
                          { title: "Utility 3", value: "10 kWh" },
                        ]}
                      />
                      </div> 
                  </div>
            <div className="flex flex-row gap-1">
              <div className="flex flex-row gap-1 w-1/3">
                  <KpiCard
                    title="# Alarms Raised"
                    kpivalue="100"
                    subtitle="past day"
                    icon={<PiBellSimpleRinging className="text-primary h-12 w-12" />}
                      /> 
                </div>

                  <div className="flex flex-row gap-1 w-2/3">
                    <TopThreeCard
                        title="# 3 Most triggered Alarms"
                        data={[
                          { title: "Voltage Out of Range", value: "50" },
                          { title: "Current Spike Detected", value: "45" },
                          { title: "Temperature Threshold Exceeded", value: "36" },
                        ]}
                      />
                    </div>
                  </div>
      </div>
      
      <div className="grid grid-cols-3 gap-1 ">
        <DonutChart payload={averageEnergyApiResponse} />
        <ElectricityBarChart
            title="Electricity Consumption"
            data={electricityChartData}
            subtitle="Past Day"
          />
          <HomepageDynamicPowerSpikesLive />
      </div>
      <div className="grid grid-cols-2 gap-1 ">
        <EnergyBarLineChart payload={energyCostChartData} />
        <PowerUsageBarChart
            title="Power Usage"
            dataByDuration={{
              "Past Day": [
                { date: "2023-10-01", value: 100 },
                { date: "2023-10-02", value: 120 },
                { date: "2023-10-03", value: 90 },
                { date: "2023-10-04", value: 70 }
              ],
              "Past Week": [
                { date: "2023-09-25", value: 700 },
                { date: "2023-09-26", value: 800 },
                { date: "2023-09-27", value: 750 },
                { date: "2023-09-28", value: 330 },
                { date: "2023-09-29", value: 900 },
                { date: "2023-09-30", value: 1500 },
              ],
            }}
          />

      </div>
    
    </div>
  )
}

export default Dashboard

// import React from "react"

// import TopThreeCard from "@/components/PlantPerformance/Cards/TopThreeCard"

// import {
//   energyCostChartData,
//   averageEnergyApiResponse,
//   electricityChartData,
// } from "@/utils/data"
// import HomepageDynamicPowerSpikesLive from "@/components/PlantPerformance/Chart/HomepageDynamicPowerSpikesLive"
// import EnergyBarLineChart from "@/components/PlantPerformance/Chart/EnergyBarLineChart"
// import DonutChart from "@/components/PlantPerformance/Chart/DonutChart"
// import ElectricityBarChart from "@/components/PlantPerformance/Chart/ElectricityBarChart"
// import PowerUsageBarChart from "@/components/PlantPerformance/Chart/PowerUsageBarChart"
// import KpiCard from "@/components/PlantPerformance/Cards/KpiCard"

// interface INavbarProps {
//   isOpenMenu: boolean
// }

// const Dashboard: React.FunctionComponent<INavbarProps> = ({ isOpenMenu }) => {
//   return (
//     <div className="flex flex-col gap-4  mt-16">
//       <div className="flex flex-col lg:flex-row gap-4 w-full">
//         {/* KPI Cards: 2/5 Width on lg, full width on smaller screens */}
//         <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-2/5">
//           <KpiCard
//             title="# Power Usage past Month"
//             kpivalue="243"
//             subtitle="kWh"
//           />
//           <KpiCard
//             title="# Energy Cost past Month"
//             kpivalue="23"
//             subtitle="$"
//           />
//         </div>

//         {/* TopThreeCard: 3/5 Width on lg, full width on smaller screens */}
//         <div className="w-full lg:w-3/5">
//           <TopThreeCard
//             title="# 3 Most energy Consuming utilities"
//             data={[
//               { title: "Utility 1", value: "1200 kWh" },
//               { title: "Utility 2", value: "1100 kWh" },
//               { title: "Utility 3", value: "1000 kWh" },
//             ]}
//           />
//         </div>
//       </div>

//       {/* Charts section */}
//       <div className="flex flex-col lg:flex-row gap-4 w-full">
//         {/* Left column charts */}
//         <div className="flex flex-col gap-4 w-full lg:w-2/5">
//           <DonutChart payload={averageEnergyApiResponse} />
//           <PowerUsageBarChart
//             title="Power Usage"
//             dataByDuration={{
//               "Past Day": [
//                 { date: "2023-10-01", value: 100 },
//                 { date: "2023-10-02", value: 120 },
//                 { date: "2023-10-03", value: 90 },
//               ],
//               "Past Week": [
//                 { date: "2023-09-25", value: 700 },
//                 { date: "2023-09-26", value: 800 },
//                 { date: "2023-09-27", value: 750 },
//               ],
//             }}
//           />
//           <ElectricityBarChart
//             title="Electricity Consumption - Past Day"
//             data={electricityChartData}
//           />
//         </div>

//         {/* Right column charts */}
//         <div className="flex flex-col gap-4 w-full lg:w-3/5">
//           {/* Top row: KPI and TopThreeCard */}
//           <div className="flex flex-col sm:flex-row gap-2 w-full">
//             <div className="w-full sm:w-1/3">
//               <KpiCard
//                 title="# Alarms Raised"
//                 kpivalue="100"
//                 subtitle="past day"
//               />
//             </div>
//             <div className="w-full sm:w-2/3">
//               <TopThreeCard
//                 title="# 3 Most triggered Alarms"
//                 data={[
//                   { title: "Voltage Out of Range", value: "50" },
//                   { title: "Current Spike Detected", value: "45" },
//                   { title: "Temperature Threshold Exceeded", value: "36" },
//                 ]}
//               />
//             </div>
//           </div>

//           {/* Bottom charts */}
//           <div className="w-full flex flex-col gap-4">
//             <HomepageDynamicPowerSpikesLive />
//             <EnergyBarLineChart payload={energyCostChartData} />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Dashboard

