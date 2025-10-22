// import { classNames } from "@/utils/dom";
// import PieChart from "@/components/Chart/PieChart";
// import {
//   chartPieData,
//   chartPieData2, // Add your second pie chart data here
// } from "@/utils/ChartData";
// import CardChartBox from "@/components/Dashboard/CardChartBox";

// interface IManagerDashboardProps {}

// const CARD_INFO_DATA = [
//   {
//     title: "Inventory Level",
//     value: 200,
//     description: "Overall stock availability",
//   },
//   {
//     title: "Stock Movements",
//     value: 300,
//     description: "Total Quantity Moved",
//   },
//   {
//     title: "Picking & Packing",
//     value: 50,
//     description: "Picking and Packing Efficiency",
//   },
//   {
//     title: "Dispatch",
//     value: 150,
//     description: "On-time Dispatch Rate",
//   },
//   {
//     title: "Supplier Order",
//     value: 50,
//     description: "On-time Delivery Rate",
//   },
//   {
//     title: "Production Order",
//     value: 150,
//     description: "Status Distribution",
//   },
// ];

// const chartConfig = {
//   displayTitle: true,
//   displayLegend: true,
//   legendPosition: "right",
// };

// const ManagerDashboard: React.FunctionComponent<IManagerDashboardProps> = () => {
//   return (
//     <div className="p-4">
//       {/* Key Metrics */}
//       <div className="w-full mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
//         {CARD_INFO_DATA.map((itemData) => (
//           <div
//             className="w-full rounded-lg shadow-lg p-4 bg-white"
//             key={itemData.title}
//           >
//             <div className="text-center font-bold text-lg mb-2">
//               {itemData.title}
//             </div>
//             <div
//               className={classNames(
//                 "text-center text-2xl font-semibold",
//                 itemData.value > 200
//                   ? "text-green-600"
//                   : itemData.value > 100
//                   ? "text-blue-600"
//                   : "text-red-600"
//               )}
//             >
//               {itemData.value}
//             </div>
//             {itemData.description && (
//               <div className="text-center mt-2 text-sm text-gray-600">
//                 {itemData.description}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Pie Chart Section */}
//       <div className="flex flex-col md:flex-row gap-6 mb-10">
//         <CardChartBox
//           title="First Pie Chart"
//           yearFilterData={[]}
//         >
//           <PieChart
//             chartData={chartPieData}
//             chartConfig={{
//               ...chartConfig,
//               title: "Chart-1",
//             }}
//           />
//         </CardChartBox>
//         <CardChartBox
//           title="Second Pie Chart"
//           yearFilterData={[]}
//         >
//           <PieChart
//             chartData={chartPieData2}
//             chartConfig={{
//               ...chartConfig,
//               title: "Chart-2",
//             }}
//           />
//         </CardChartBox>
//       </div>

//       {/* Additional Insights */}
//       <div className="w-full bg-white p-4 rounded-lg shadow-lg mt-6">
//         <h2 className="text-xl font-bold mb-4">Additional Insights</h2>
//         <p className="text-gray-600 mb-2">
//           Review key performance indicators and trends to make informed decisions.
//         </p>
//         <p className="text-gray-600">
//           Track inventory levels, stock movements, and operational efficiency to
//           optimize performance and address potential issues.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;

// import { classNames } from "@/utils/dom"
// import BarChart from "@/components/Chart/BarChart"
// import StackBarChart from "@/components/Chart/StackBarChart"
// import LineChart from "@/components/Chart/LineChart"
// import {
//   chartGateEntryData,
//   chartInventoryLevelData,
//   chartPickingPackingData,
//   chartProductionOrderData,
//   chartStockTransferOrderData,
//   chartSupplierOrderData,
// } from "@/utils/ChartData"
// import CardChartBox from "@/components/Dashboard/CardChartBox"

// interface IManagerDashboardProps {}

// const CARD_INFO_DATA = [
//   {
//     title: "Inventory Level",
//     value: 200,
//     description: "Overall stock availability",
//   },
//   {
//     title: "Stock Movements",
//     value: 300,
//     description: "Total Quantity Moved",
//   },
//   {
//     title: "Picking & Packing",
//     value: 50,
//     description: "Picking and Packing Efficiency",
//   },
//   {
//     title: "Dispatch",
//     value: 150,
//     description: "On-time Dispatch Rate",
//   },
//   {
//     title: "Supplier Order",
//     value: 50,
//     description: "On-time Delivery Rate",
//   },
//   {
//     title: "Production Order",
//     value: 150,
//     description: "Status Distribution",
//   },
// ]

// const chartConfig = {
//   displayTitle: false,
//   title: "Chart.js Bar Chart",
//   displayLegend: true,
//   legendPosition: "bottom",
//   displayXaxisTitle: false,
//   xAxisTitle: "Month",
//   displayYaxisTitle: false,
//   yAxisTitle: "Quantity",
// }

// const ManagerDashboard: React.FunctionComponent<
//   IManagerDashboardProps
// > = ({}) => {
//   const d = new Date()
//   const yearSelection = () => {
//     return [d.getFullYear() - 2, d.getFullYear() - 1, d.getFullYear()]
//   }

//   return (
//     <>
//       <div className="w-full sm:flex gap-4 mb-4">
//         {CARD_INFO_DATA.map((itemData) => (
//           <div
//             className="w-full rounded-lg shadow-lg mb-4 p-2"
//             key={itemData.title}
//           >
//             <div className="stat-figure text-primary text-center font-bold">
//               {itemData.title}
//             </div>
//             <div
//               className={classNames(
//                 "stat-value text-center",
//                 itemData.value > 200
//                   ? "text-success"
//                   : itemData.value > 100
//                   ? "text-primary"
//                   : "text-error",
//               )}
//             >
//               {itemData.value}
//             </div>
//             {itemData.description && (
//               <div className="stat-desc text-center mt-2">
//                 {itemData.description}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="w-full sm:flex gap-6">
//         <CardChartBox
//           title="Inventory Levels by Month"
//           yearFilterData={yearSelection()}
//         >
//           <StackBarChart
//             chartData={chartInventoryLevelData}
//             chartConfig={chartConfig}
//           />
//         </CardChartBox>
//         <CardChartBox
//           title="Picking & Packing by Month"
//           yearFilterData={yearSelection()}
//         >
//           <StackBarChart
//             chartData={chartPickingPackingData}
//             chartConfig={chartConfig}
//           />
//         </CardChartBox>
//       </div>
//       <div className="w-full sm:flex gap-6">
//         <CardChartBox
//           title="Production Order by Month"
//           yearFilterData={yearSelection()}
//         >
//           <BarChart
//             chartData={chartProductionOrderData}
//             chartConfig={chartConfig}
//           />
//         </CardChartBox>
//         <CardChartBox
//           title="Supplier Order by Month"
//           yearFilterData={yearSelection()}
//         >
//           <BarChart
//             chartData={chartSupplierOrderData}
//             chartConfig={chartConfig}
//           />
//         </CardChartBox>
//       </div>

//       <div className="w-full sm:flex gap-6 mb-10">
//         <CardChartBox
//           title="Stock Transfer & Movement by Month"
//           yearFilterData={yearSelection()}
//         >
//           <LineChart
//             chartData={chartStockTransferOrderData}
//             chartConfig={chartConfig}
//           />
//         </CardChartBox>

//         <CardChartBox
//           title="Gate Entry Out & In by Month"
//           yearFilterData={yearSelection()}
//         >
//           <LineChart chartData={chartGateEntryData} chartConfig={chartConfig} />
//         </CardChartBox>
//       </div>
//     </>
//   )
// }

// export default ManagerDashboard
// import { classNames } from "@/utils/dom";
// import BarChart from "@/components/Chart/BarChart";
// import StackBarChart from "@/components/Chart/StackBarChart";
// import LineChart from "@/components/Chart/LineChart";
// import {
//   chartGateEntryData,
//   chartInventoryLevelData,
//   chartPickingPackingData,
//   chartProductionOrderData,
//   chartStockTransferOrderData,
//   chartSupplierOrderData,
// } from "@/utils/ChartData";
// import CardChartBox from "@/components/Dashboard/CardChartBox";

// interface IManagerDashboardProps {}

// const CARD_INFO_DATA = [
//   {
//     title: "Inventory Level",
//     value: 200,
//     description: "Overall stock availability",
//   },
//   {
//     title: "Stock Movements",
//     value: 300,
//     description: "Total Quantity Moved",
//   },
//   {
//     title: "Picking & Packing",
//     value: 50,
//     description: "Picking and Packing Efficiency",
//   },
//   {
//     title: "Dispatch",
//     value: 150,
//     description: "On-time Dispatch Rate",
//   },
//   {
//     title: "Supplier Order",
//     value: 50,
//     description: "On-time Delivery Rate",
//   },
//   {
//     title: "Production Order",
//     value: 150,
//     description: "Status Distribution",
//   },
// ];

// const chartConfig = {
//   displayTitle: false,
//   title: "Chart.js Bar Chart",
//   displayLegend: true,
//   legendPosition: "bottom",
//   displayXaxisTitle: false,
//   xAxisTitle: "Month",
//   displayYaxisTitle: false,
//   yAxisTitle: "Quantity",
// };

// const ManagerDashboard: React.FunctionComponent<IManagerDashboardProps> = () => {
//   const d = new Date();
//   const yearSelection = () => {
//     return [d.getFullYear() - 2, d.getFullYear() - 1, d.getFullYear()];
//   };

//   return (
//     <div className="p-4">
//       {/* Key Metrics */}
//       <div className="w-full mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {CARD_INFO_DATA.map((itemData) => (
//           <div
//             className="w-full rounded-lg shadow-lg p-4 bg-white"
//             key={itemData.title}
//           >
//             <div className="text-center font-bold text-lg mb-2">
//               {itemData.title}
//             </div>
//             <div
//               className={classNames(
//                 "text-center text-2xl font-semibold",
//                 itemData.value > 200
//                   ? "text-green-600"
//                   : itemData.value > 100
//                   ? "text-blue-600"
//                   : "text-red-600"
//               )}
//             >
//               {itemData.value}
//             </div>
//             {itemData.description && (
//               <div className="text-center mt-2 text-sm text-gray-600">
//                 {itemData.description}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="w-full flex flex-col gap-6">
//         <div className="flex flex-col md:flex-row gap-6 mb-6">
//           <CardChartBox
//             title="Inventory Levels by Month"
//             yearFilterData={yearSelection()}
//           >
//             <StackBarChart
//               chartData={chartInventoryLevelData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//           <CardChartBox
//             title="Picking & Packing by Month"
//             yearFilterData={yearSelection()}
//           >
//             <StackBarChart
//               chartData={chartPickingPackingData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//         </div>

//         <div className="flex flex-col md:flex-row gap-6 mb-6">
//           <CardChartBox
//             title="Production Order by Month"
//             yearFilterData={yearSelection()}
//           >
//             <BarChart
//               chartData={chartProductionOrderData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//           <CardChartBox
//             title="Supplier Order by Month"
//             yearFilterData={yearSelection()}
//           >
//             <BarChart
//               chartData={chartSupplierOrderData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//         </div>

//         <div className="flex flex-col md:flex-row gap-6">
//           <CardChartBox
//             title="Stock Transfer & Movement by Month"
//             yearFilterData={yearSelection()}
//           >
//             <LineChart
//               chartData={chartStockTransferOrderData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//           <CardChartBox
//             title="Gate Entry Out & In by Month"
//             yearFilterData={yearSelection()}
//           >
//             <LineChart
//               chartData={chartGateEntryData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;

// import { classNames } from "@/utils/dom";
// import BarChart from "@/components/Chart/BarChart";
// import StackBarChart from "@/components/Chart/StackBarChart";
// import LineChart from "@/components/Chart/LineChart";
// import PieChart from "@/components/Chart/PieChart";
// import {
//   chartGateEntryData,
//   chartInventoryLevelData,
//   chartPickingPackingData,
//   chartProductionOrderData,
//   chartStockTransferOrderData,
//   chartSupplierOrderData,
//   chartPieData, // Add your pie chart data here
// } from "@/utils/ChartData";
// import CardChartBox from "@/components/Dashboard/CardChartBox";

// interface IManagerDashboardProps {}

// const CARD_INFO_DATA = [
//   {
//     title: "Inventory Level",
//     value: 200,
//     description: "Overall stock availability",
//   },
//   {
//     title: "Stock Movements",
//     value: 300,
//     description: "Total Quantity Moved",
//   },
//   {
//     title: "Picking & Packing",
//     value: 50,
//     description: "Picking and Packing Efficiency",
//   },
//   {
//     title: "Dispatch",
//     value: 150,
//     description: "On-time Dispatch Rate",
//   },
//   {
//     title: "Supplier Order",
//     value: 50,
//     description: "On-time Delivery Rate",
//   },
//   {
//     title: "Production Order",
//     value: 150,
//     description: "Status Distribution",
//   },
// ];

// const chartConfig = {
//   displayTitle: false,
//   title: "Chart.js Bar Chart",
//   displayLegend: true,
//   legendPosition: "bottom",
//   displayXaxisTitle: false,
//   xAxisTitle: "Month",
//   displayYaxisTitle: false,
//   yAxisTitle: "Quantity",
// };

// const ManagerDashboard: React.FunctionComponent<IManagerDashboardProps> = () => {
//   const d = new Date();
//   const yearSelection = () => {
//     return [d.getFullYear() - 2, d.getFullYear() - 1, d.getFullYear()];
//   };

//   return (
//     <div className="p-4">
//       {/* Key Metrics */}
//       <div className="w-full mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {CARD_INFO_DATA.map((itemData) => (
//           <div
//             className="w-full rounded-lg shadow-lg p-4 bg-white"
//             key={itemData.title}
//           >
//             <div className="text-center font-bold text-lg mb-2">
//               {itemData.title}
//             </div>
//             <div
//               className={classNames(
//                 "text-center text-2xl font-semibold",
//                 itemData.value > 200
//                   ? "text-green-600"
//                   : itemData.value > 100
//                   ? "text-blue-600"
//                   : "text-red-600"
//               )}
//             >
//               {itemData.value}
//             </div>
//             {itemData.description && (
//               <div className="text-center mt-2 text-sm text-gray-600">
//                 {itemData.description}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       Charts Section
//       <div className="w-full flex flex-col gap-6">
//         Section for High-Level Metrics
//         <div className="flex flex-col md:flex-row gap-6 mb-6">
//           <CardChartBox
//             title="Inventory Levels by Month"
//             yearFilterData={yearSelection()}
//           >
//             <StackBarChart
//               chartData={chartInventoryLevelData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//           <CardChartBox
//             title="Picking & Packing by Month"
//             yearFilterData={yearSelection()}
//           >
//             <StackBarChart
//               chartData={chartPickingPackingData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//         </div>

//         {/* Section for Operational Metrics */}
//         <div className="flex flex-col md:flex-row gap-6 mb-6">
//           <CardChartBox
//             title="Production Order by Month"
//             yearFilterData={yearSelection()}
//           >
//             <BarChart
//               chartData={chartProductionOrderData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//           <CardChartBox
//             title="Supplier Order by Month"
//             yearFilterData={yearSelection()}
//           >
//             <BarChart
//               chartData={chartSupplierOrderData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//         </div>

//         {/* Section for Detailed Metrics */}
//         <div className="flex flex-col md:flex-row gap-6 mb-10">
//           <CardChartBox
//             title="Stock Transfer & Movement by Month"
//             yearFilterData={yearSelection()}
//           >
//             <LineChart
//               chartData={chartStockTransferOrderData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>

//           <CardChartBox
//             title="Gate Entry Out & In by Month"
//             yearFilterData={yearSelection()}
//           >
//             <LineChart
//               chartData={chartGateEntryData}
//               chartConfig={chartConfig}
//             />
//           </CardChartBox>
//         </div>

//       {/* ----------------------- */}
//            {/* Pie Chart Section */}
//            <div className="flex flex-col md:flex-row gap-6 mb-10">
//           <CardChartBox
//             title="First Pie Chart"
//             yearFilterData={yearSelection()}
//           >
//             <PieChart
//               chartData={chartPieData} // Add your specific pie chart data here
//               chartConfig={{
//                 displayTitle: true,
//                 title: "Pie Chart Example",
//                 displayLegend: true,
//                 legendPosition: "right",
//               }}
//             />
//           </CardChartBox>
//         </div>
//       </div>
//       {/* Additional Insights */}
//       <div className="w-full bg-white p-4 rounded-lg shadow-lg mt-6">
//         <h2 className="text-xl font-bold mb-4">Additional Insights</h2>
//         <p className="text-gray-600 mb-2">
//           Review key performance indicators and trends to make informed decisions.
//         </p>
//         <p className="text-gray-600">
//           Track inventory levels, stock movements, and operational efficiency to
//           optimize performance and address potential issues.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;
