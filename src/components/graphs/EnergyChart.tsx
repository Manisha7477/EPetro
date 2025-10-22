// import React from 'react';
// import {
//   ComposedChart,
//   Line,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// const data = [
//   { month: 'March', year: '2025', powerConsumption: 85, productionCost: 155 },
//   { month: 'February', year: '2025', powerConsumption: 65, productionCost: 125 },
//   { month: 'January', year: '2025', powerConsumption: 75, productionCost: 145 },
//   { month: 'December', year: '2024', powerConsumption: 55, productionCost: 115 },
//   { month: 'November', year: '2024', powerConsumption: 45, productionCost: 95 },
//   { month: 'October', year: '2024', powerConsumption: 60, productionCost: 120 },
//   { month: 'September', year: '2024', powerConsumption: 70, productionCost: 135 },
//   { month: 'August', year: '2024', powerConsumption: 50, productionCost: 105 },
//   { month: 'July', year: '2024', powerConsumption: 40, productionCost: 85 },
// ].reverse();

// const EnergyChart = () => {
//   return (
//     <div className="w-full h-[40vh] bg-white rounded-xl shadow-lg p-6">
//       <h1 className="text-2xl font-semibold text-center mb-8 text-gray-800">
//         Monthly Energy Consumption & Production Cost
//       </h1>
//       <div className="w-full h-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <ComposedChart
//             data={data}
//             margin={{
//               top: 20,
//               right: 50,
//               left: 30,
//               bottom: 60,
//             }}
//           >
//             <CartesianGrid 
//               strokeDasharray="3 3" 
//               horizontal={true}
//               vertical={false}
//               stroke="#E5E7EB"
//             />
//             <XAxis
//               dataKey={(data) => `${data.month} ${data.year}`}
//               tick={{ fill: '#6B7280', fontSize: 12 }}
//               tickLine={{ stroke: '#E5E7EB' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//               interval={0}
//               angle={-45}
//               textAnchor="end"
//               height={60}
//             />
//             <YAxis
//               yAxisId="left"
//               orientation="left"
//               domain={[0, 100]}
//               tick={{ fill: '#6B7280', fontSize: 12 }}
//               tickLine={{ stroke: '#E5E7EB' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//               tickCount={6}
//               label={{
//                 value: 'Power Consumption',
//                 angle: -90,
//                 position: 'insideLeft',
//                 offset: -5,
//                 style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 12 }
//               }}
//             />
//             <YAxis
//               yAxisId="right"
//               orientation="right"
//               domain={[0, 200]}
//               tick={{ fill: '#6B7280', fontSize: 12 }}
//               tickLine={{ stroke: '#E5E7EB' }}
//               axisLine={{ stroke: '#E5E7EB' }}
//               tickCount={6}
//               label={{
//                 value: 'Production Cost',
//                 angle: 90,
//                 position: 'insideRight',
//                 offset: -5,
//                 style: { textAnchor: 'middle', fill: '#6B7280', fontSize: 12 }
//               }}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: 'white',
//                 border: '1px solid #E5E7EB',
//                 borderRadius: '6px',
//                 padding: '8px',
//               }}
//             />
//             <Legend
//               verticalAlign="bottom"
//               align="center"
//               height={36}
//               iconType="circle"
//               iconSize={10}
//               wrapperStyle={{
//                 paddingTop: '20px',
//                 bottom: 0
//               }}
//             />
//             <Bar
//               yAxisId="left"
//               dataKey="powerConsumption"
//               name="Power Consumption"
//               fill="#60A5FA"
//               radius={[4, 4, 0, 0]}
//               barSize={30}
//             />
//             <Line
//               yAxisId="right"
//               type="monotone"
//               dataKey="productionCost"
//               name="Production Cost"
//               stroke="#F97316"
//               strokeWidth={3}
//               dot={{ r: 6, fill: '#FFFFFF', strokeWidth: 3 }}
//               activeDot={{ r: 8 }}
//             />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default EnergyChart;



// import React from 'react';
// import {
//   BarChart,
//   Bar,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   ComposedChart
// } from 'recharts';

// interface DataPoint {
//   month: string;
//   year: string;
//   powerConsumption: number;
//   productionCost: number;
// }

// export default function EnergyChart() {
//   const data: DataPoint[] = [
//     { month: 'march', year: '2025', powerConsumption: 90, productionCost: 165 },
//     { month: 'february', year: '2025', powerConsumption: 82, productionCost: 155 },
//     { month: 'january', year: '2025', powerConsumption: 52, productionCost: 100 },
//     { month: 'december', year: '2024', powerConsumption: 68, productionCost: 135 },
//     { month: 'november', year: '2024', powerConsumption: 45, productionCost: 85 },
//     { month: 'october', year: '2024', powerConsumption: 78, productionCost: 145 },
//     { month: 'september', year: '2024', powerConsumption: 58, productionCost: 115 },
//     { month: 'august', year: '2024', powerConsumption: 55, productionCost: 110 },
//     { month: 'july', year: '2024', powerConsumption: 93, productionCost: 180 },
//   ];

//   return (
//     <div className="h-[40vh] w-[30vw] bg-white p-4 rounded-lg shadow-md">
//       <h1 className="text-lg font-bold mb-4 text-center">
//         Monthly Energy Consumption & Production Cost
//       </h1>
//       <div className="w-full h-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <ComposedChart
//             data={data}
//             margin={{
//               top: 5,
//               right: 30,
//               left: 20,
//               bottom: 30
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
//             <XAxis
//               dataKey="month"
//               tick={{ fontSize: 12 }}
//               axisLine={true}
//               tickLine={true}
//               tickFormatter={(value, index) => {
//                 const entry = data[index];
//                 const shortMonth = entry.month.slice(0, 3);
//                 const shortYear = entry.year.slice(2);
//                 return `${shortMonth} '${shortYear}`;
//               }}
//             />
//             <YAxis
//               yAxisId="left"
//               orientation="left"
//               domain={[0, 100]}
//               tickCount={6}
//               tick={{ fontSize: 12 }}
//               axisLine={true}
//               tickLine={true}
//             />
//             <YAxis
//               yAxisId="right"
//               orientation="right"
//               domain={[0, 200]}
//               tickCount={6}
//               tick={{ fontSize: 12 }}
//               axisLine={true}
//               tickLine={true}
//             />
//             <Tooltip />
//             <Bar
//               yAxisId="left"
//               dataKey="powerConsumption"
//               fill="#00AAFF"
//               name="Power Consumption"
//               barSize={15}
//               radius={[2, 2, 0, 0]}
//             />
//             <Line
//               yAxisId="right"
//               type="monotone"
//               dataKey="productionCost"
//               stroke="#FF8000"
//               strokeWidth={3}
//               dot={{ r: 4 }}
//               activeDot={{ r: 6 }}
//               name="Production Cost"
//             />
//             <Legend align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: 20 }} />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
// import React from 'react';
// import {
//   ComposedChart,
//   Bar,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from 'recharts';

// interface DataPoint {
//   month: string;
//   year: string;
//   powerConsumption: number;
//   productionCost: number;
// }

// export default function EnergyChart() {
//   const data: DataPoint[] = [
//     { month: 'march', year: '2025', powerConsumption: 90, productionCost: 165 },
//     { month: 'february', year: '2025', powerConsumption: 82, productionCost: 155 },
//     { month: 'january', year: '2025', powerConsumption: 52, productionCost: 100 },
//     { month: 'december', year: '2024', powerConsumption: 68, productionCost: 135 },
//     { month: 'november', year: '2024', powerConsumption: 45, productionCost: 85 },
//     { month: 'october', year: '2024', powerConsumption: 78, productionCost: 145 },
//     { month: 'september', year: '2024', powerConsumption: 58, productionCost: 115 },
//     { month: 'august', year: '2024', powerConsumption: 55, productionCost: 110 },
//     { month: 'july', year: '2024', powerConsumption: 93, productionCost: 180 },
//   ];

//   return (
//     <div className="w-full  h-[40vh] bg-white p-4 rounded-lg shadow-md">
//       <h1 className="text-sm font-bold mb-4 text-center">
//         Monthly Energy Consumption & Production Cost
//       </h1>
//       <div className="w-full h-[80%]">
//         <ResponsiveContainer width="100%" height="100%">
//           <ComposedChart
//             data={data}
//             // margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis
//               dataKey="month"
//               tick={{ fontSize: 12 }}
//               tickFormatter={(value, index) => {
//                 const entry = data[index];
//                 return `${entry.month.slice(0, 3)} '${entry.year.slice(2)}`;
//               }}
//             />
//             <YAxis
//               yAxisId="left"
//               domain={[0, 100]}
//               tick={{ fontSize: 12 }}
//             />
//             <YAxis
//               yAxisId="right"
//               orientation="right"
//               domain={[0, 200]}
//               tick={{ fontSize: 12 }}
//             />
//             <Tooltip />
//             <Legend verticalAlign="bottom" height={36} />
//             <Bar
//               yAxisId="left"
//               dataKey="powerConsumption"
//               fill="#00AAFF"
//               barSize={10}
//               radius={[2, 2, 0, 0]}
//               name="Power Consumption"
//             />
//             <Line
//               yAxisId="right"
//               type="monotone"
//               dataKey="productionCost"
//               stroke="#FF8000"
//               strokeWidth={3}
//               dot={{ r: 4 }}
//               activeDot={{ r: 6 }}
//               name="Production Cost"
//             />
//           </ComposedChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }






// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart } from 'recharts';

// function EnergyChart() {
//   // Function to get the last 9 months of data
//   const getLast9MonthsData = () => {
//     const months = [];
//     const currentDate = new Date();
    
//     for (let i = 8; i >= 0; i--) {
//       const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
//       const month = date.toLocaleString('default', { month: 'long' });
//       const year = date.getFullYear();
      
//       // Generate random data for demonstration
//       // In real application, this would come from your API or database
//       months.push({
//         date: `${month}\n${year}`,
//         powerConsumption: Math.floor(Math.random() * (95 - 40) + 40), // Random between 40-95
//         productionCost: Math.floor(Math.random() * (180 - 80) + 80), // Random between 80-180
//       });
//     }
//     return months;
//   };

//   const data = getLast9MonthsData();

//   return (
//     <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
//       <h5 className="text-lg font-bold mb-4 text-center">
//         Monthly Energy Consumption & Production Cost
//       </h5>
//       <div className="w-full h-[400px]">
//         <ComposedChart
//           width={800}
//           height={400}
//           data={data}
//           margin={{
//             top: 20,
//             right: 30,
//             left: 20,
//             bottom: 40,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//           <XAxis 
//             dataKey="date" 
//             angle={-45}
//             textAnchor="end"
//             height={60}
//             interval={0}
//             stroke="#666"
//           />
//           <YAxis 
//             yAxisId="left"
//             orientation="left"
//             stroke="#666"
//             domain={[0, 100]}
//             ticks={[0, 20, 40, 60, 80, 100]}
//             label={{ value: 'Power Consumption', angle: -90, position: 'insideLeft', offset: 0 }}
//           />
//           <YAxis
//             yAxisId="right"
//             orientation="right"
//             stroke="#ff7300"
//             domain={[0, 200]}
//             ticks={[0, 40, 80, 120, 160, 200]}
//             label={{ value: 'Production Cost', angle: 90, position: 'insideRight', offset: 0 }}
//           />
//           <Tooltip />
//           <Legend verticalAlign="top" height={36} />
//           <Bar
//             yAxisId="left"
//             dataKey="powerConsumption"
//             name="Power Consumption"
//             fill="#00bcd4"
//             barSize={40}
//           />
//           <Line
//             yAxisId="right"
//             type="monotone"
//             dataKey="productionCost"
//             name="Production Cost"
//             stroke="#ff7300"
//             strokeWidth={3}
//             dot={{ r: 6 }}
//           />
//         </ComposedChart>
//       </div>
//     </div>
//   );
// }

// export default EnergyChart; 




import React from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart, ResponsiveContainer } from 'recharts';

function EnergyChart() {
  // Function to get the last 9 months of data
  const getLast9MonthsData = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 8; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      // Generate random data for demonstration
      // In real application, this would come from your API or database
      months.push({
        date: `${month} ${year}`,
        powerConsumption: Math.floor(Math.random() * (95 - 40) + 40), // Random between 40-95
        productionCost: Math.floor(Math.random() * (180 - 80) + 80), // Random between 80-180
      });
    }
    return months;
  };

  const data = getLast9MonthsData();

  return (
    <div className="w-[full] flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
      <h5 className="text-base font-bold mb-4 text-center">
        Monthly Energy Consumption & Production Cost
      </h5>
      <div className="w-full h-[40vh]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 60
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="date" 
              angle={270}
              textAnchor="middle"
              height={40}
              interval={0}
              stroke="#666"
              tickMargin={10}
              scale="band"
              tick={{ fontSize: 7}}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              stroke="#666"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              width={60}
              tick={{ fontSize: 12 }}
  
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#ff7300"
              domain={[0, 200]}
              ticks={[0, 40, 80, 120, 160, 200]}
              width={60}
              tick={{ fontSize: 12 }}
            
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #ccc',
                fontSize: 9,
                padding: 8
              }}
            />
            <Legend 
              verticalAlign="bottom"
              align="center"
              height={36}
              wrapperStyle={{ 
                fontSize: 12,
                paddingTop: 8,
                paddingBottom: 8
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="powerConsumption"
              name="Power Consumption"
              fill="#00bcd4"
              barSize={20}
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="productionCost"
              name="Production Cost"
              stroke="#ff7300"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EnergyChart; 