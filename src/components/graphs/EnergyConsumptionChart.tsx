// import React, { PureComponent } from 'react';
// import {
//   ComposedChart,
//   Line,
//   Area,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts'; 

// import { BAR_GRAPH_DATA } from '@/utils/data/Dashboard/Graph/BarGraphData';

// export default class BarGraph extends PureComponent {
//   static demoUrl = 'https://codesandbox.io/p/sandbox/composed-chart-with-axis-label-xykxs9';

//   render() {
//     return (
//       <ResponsiveContainer width="100%" height="100%">
//         <ComposedChart
//           width={500}
//           height={400}
//           data={BAR_GRAPH_DATA}
//           margin={{
//             top: 20,
//             right: 80,
//             bottom: 20,
//             left: 20,
//           }}
//         >
//           <CartesianGrid stroke="#f5f5f5" />
//           <XAxis dataKey="name" label={{ value: 'Pages', position: 'insideBottomRight', offset: 0 }} scale="band" />
//           <YAxis label={{ value: 'Index', angle: -90, position: 'insideLeft' }} />
//           <Tooltip />
//           <Legend />
//           <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
//           <Bar dataKey="pv" barSize={20} fill="#413ea0" />
//           <Line type="monotone" dataKey="uv" stroke="#ff7300" />
//         </ComposedChart>
//       </ResponsiveContainer>
//     );
//   }
// }



// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// export default function EnergyConsumptionChart() {
//   const data = [
//     { name: 'Equipment 4', value: 30, color: '#40E0D0' }, // Cyan/Turquoise
//     { name: 'Equipment 2', value: 22, color: '#FF0000' }, // Red
//     { name: 'Equipment 3', value: 34, color: '#0000FF' }, // Blue
//     { name: 'Equipment 1', value: 28, color: '#FFD700' }, // Gold/Yellow
//   ];

//   // Custom component to render the labels with arrows
//   // const renderCustomContent = () => {
//   //   return (
//   //     <g>
//   //       {/* Top-left: Equipment 1 */}
//   //       <g>
//   //         {/* <line x1="100" y1="100" x2="100" y2="50" stroke="#000" strokeWidth="1" /> */}
//   //         {/* <line x1="140" y1="100" x2="120" y2="100" stroke="#000" strokeWidth="1" /> */}
//   //         <line x1="140" y1="100" x2="90" y2="100" stroke="#000" strokeWidth="1" />


//   // {/* <line x1="100" y1="100" x2="100" y2="60" stroke="#000" strokeWidth="1" /> */}
//   //         <text x="60" y="45" textAnchor="end" className="font-bold">18 kWh</text>
//   //         <text x="70" y="65" textAnchor="end" fontSize="12">Equipment 4</text>
//   //       </g>
        
//   //       {/* Bottom-left: Equipment 2 */}
//   //       <g>
//   //         <line x1="130" y1="220" x2="70" y2="240" stroke="#000" strokeWidth="1" />
//   //         <text x="60" y="245" textAnchor="end" className="font-bold">22 kWh</text>
//   //         <text x="70" y="265" textAnchor="end" fontSize="12">Equipment 3</text>
//   //       </g>
        
//   //       {/* Bottom-right: Equipment 3 */}
//   //       <g>
//   //         <line x1="270" y1="220" x2="330" y2="240" stroke="#000" strokeWidth="1" />
//   //         <text x="350" y="245" textAnchor="start" className="font-bold">30 kWh</text>
//   //         <text x="350" y="265" textAnchor="start" fontSize="12">Equipment 2</text>
//   //       </g>
        
//   //       {/* Top-right: Equipment 4 */}
//   //       <g>
//   //         {/* <line x1="250" y1="180" x2="90" y2="100" stroke="#000" strokeWidth="1" />  */}
//   //         {/* <line x1="150" y1="150" x2="200" y2="100" stroke="#000" strokeWidth="1" /> */}

//   //         <text x="350" y="45" textAnchor="start" className="font-bold">23kWh</text>
//   //         <text x="350" y="65" textAnchor="start" fontSize="12">Equipment 1</text>
//   //       </g>
//   //     </g>
//   //   );
//   // };
//   const renderCustomContent = () => {
//     return (
//       <g>
//         {/* Equipment 4 - Top Left */}
//         <g>
//           <line x1="120" y1="60" x2="70" y2="60" stroke="#000" strokeWidth="1" />
//           <text x="70" y="30" textAnchor="end" fontWeight="bold">18 kWh</text>
//           <text x="70" y="40" textAnchor="end" fontSize="12">Equipment 4</text>
//         </g>
  
//         {/* Equipment 2 - Bottom Left */}
//         <g>
//           <line x1="120" y1="140" x2="70" y2="160" stroke="#000" strokeWidth="1" />
//           <text x="70" y="80" textAnchor="end" fontWeight="bold">22 kWh</text>
//           <text x="70" y="90" textAnchor="end" fontSize="12">Equipment 3</text>
//         </g>
  
//         {/* Equipment 3 - Bottom Right */}
//         <g>
//           <line x1="180" y1="140" x2="230" y2="160" stroke="#000" strokeWidth="1" />
//           <text x="300" y="80" textAnchor="start" fontWeight="bold">30 kWh</text>
//           <text x="300" y="90" textAnchor="start" fontSize="12">Equipment 2</text>
//         </g>
  
//         {/* Equipment 1 - Top Right */}
//         <g>
//           <line x1="180" y1="60" x2="230" y2="60" stroke="#000" strokeWidth="1" />
//           <text x="300" y="30" textAnchor="start" fontWeight="bold">23 kWh</text>
//           <text x="300" y="40" textAnchor="start" fontSize="12">Equipment 1</text>
//         </g>
//       </g>
//     );
//   };
  
//   return (
//     <div className="flex h-[30vh] flex-col justify-center  items-center bg-white p-4 rounded-lg shadow-md">
//       <h5 className="text-sm font-bold mb-4 text-center">Average Energy Consumption By Equipment</h5>
//       <div className="w-full relative h-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={20}
//               outerRadius={40}
//               paddingAngle={0}
//               dataKey="value"
//               startAngle={45}
//               endAngle={405}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             {renderCustomContent()}
//           </PieChart>
//         </ResponsiveContainer>
//         {/* <div className="absolute left-[80%] top-[10%] z-10">
//   <span className=" absolute w-[90px] right-[80%] bottom-[20%] h-[2px] bg-[black] mb-1">sj</span>
//   23 kWh

//   <div className="text-xs font-normal">Equipment 1</div>
// </div> */}

//       </div>

//     </div>
//   )
// }


// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// export default function EnergyConsumptionChart() {
//   const data = [
//     { name: 'Equipment 4', value: 30, color: '#40E0D0' },
//     { name: 'Equipment 2', value: 22, color: '#FF0000' },
//     { name: 'Equipment 3', value: 34, color: '#0000FF' },
//     { name: 'Equipment 1', value: 28, color: '#FFD700' },
//   ];

//   const renderCustomContent = () => (
//     <g>
//       {/* Equipment 4 - Top Left */}
//       <g>
//         <line x1="120" y1="60" x2="70" y2="60" stroke="#000" strokeWidth="1" />
//         <text x="70" y="30" textAnchor="end" fontWeight="bold">18 kWh</text>
//         <text x="70" y="40" textAnchor="end" fontSize="12">Equipment 4</text>
//       </g>

//       {/* Equipment 2 - Bottom Left */}
//       <g>
//         <line x1="120" y1="140" x2="70" y2="160" stroke="#000" strokeWidth="1" />
//         <text x="70" y="80" textAnchor="end" fontWeight="bold">22 kWh</text>
//         <text x="70" y="90" textAnchor="end" fontSize="12">Equipment 3</text>
//       </g>

//       {/* Equipment 3 - Bottom Right */}
//       <g>
//         <line x1="180" y1="140" x2="230" y2="160" stroke="#000" strokeWidth="1" />
//         <text x="300" y="80" textAnchor="start" fontWeight="bold">30 kWh</text>
//         <text x="300" y="90" textAnchor="start" fontSize="12">Equipment 2</text>
//       </g>

//       {/* Equipment 1 - Top Right */}
//       <g>
//         <line x1="180" y1="60" x2="230" y2="60" stroke="#000" strokeWidth="1" />
//         <text x="300" y="30" textAnchor="start" fontWeight="bold">23 kWh</text>
//         <text x="300" y="40" textAnchor="start" fontSize="12">Equipment 1</text>
//       </g>
//     </g>
//   );

//   return (
//     <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
//       <h5 className="text-sm font-bold mb-4 text-center">Average Energy Consumption By Equipment</h5>
//       <div className="w-full relative h-[30vh]">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={20}
//               outerRadius={40}
//               dataKey="value"
//               startAngle={45}
//               endAngle={405}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             {renderCustomContent()}
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }





// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// function EnergyConsumptionChart() {
//   const data = [
//     { name: 'Equipment 4', value: 30, color: '#40E0D0' },  // Turquoise
//     { name: 'Equipment 2', value: 22, color: '#FF0000' },  // Red
//     { name: 'Equipment 3', value: 34, color: '#0000FF' },  // Blue
//     { name: 'Equipment 1', value: 28, color: '#FFD700' },  // Gold
//   ];

//   // Labels for the four quadrants
//   const renderCustomContent = () => (
//     <g>
//       {/* Top Left - Equipment 4 */}
//       <g>
//         <line x1="35%" y1="35%" x2="20%" y2="30%" stroke="#000" strokeWidth="1" />
//         <circle cx="35%" cy="35%" r="2.5" fill="#000" />
//         <text x="18%" y="25%" textAnchor="end" fontWeight="bold" className='lg:text-[80%] md:text-[40%]'>
//           30 kWh
//         </text>
//         <text x="18%" y="30%" textAnchor="end" className='lg:text-[60%] md:text-[40%]'>
//           Equipment 4
//         </text>
//       </g>

//       {/* Bottom Left - Equipment 2 */}
//       <g>
//         <line x1="35%" y1="65%" x2="20%" y2="70%" stroke="#000" strokeWidth="1" />
//         <circle cx="35%" cy="65%" r="2.5" fill="#000" />
//         <text x="18%" y="75%" textAnchor="end" fontWeight="bold" className='lg:text-[60%] md:text-[40%]'>
//           22 kWh
//         </text>
//         <text x="18%" y="80%" textAnchor="end" className='lg:text-[60%] md:text-[40%]'>
//           Equipment 2
//         </text>
//       </g>

//       {/* Bottom Right - Equipment 3 */}
//       <g>
//         <line x1="65%" y1="65%" x2="80%" y2="70%" stroke="#000" strokeWidth="1" />
//         <circle cx="65%" cy="65%" r="2.5" fill="#000" />
//         <text x="82%" y="75%" textAnchor="start" fontWeight="bold" className='lg:text-[60%] md:text-[40%]'>
//           34 kWh
//         </text>
//         <text x="82%" y="80%" textAnchor="start" className='lg:text-[60%] md:text-[40%]'>
//           Equipment 3
//         </text>
//       </g>

//       {/* Top Right - Equipment 1 */}
//       <g>
//         <line x1="65%" y1="35%" x2="80%" y2="30%" stroke="#000" strokeWidth="1" />
//         <circle cx="65%" cy="35%" r="2.5" fill="#000" />
//         <text x="82%" y="25%" textAnchor="start" fontWeight="bold" className='lg:text-[60%] md:text-[40%]'>
//           28 kWh
//         </text>
//         <text x="82%" y="30%" textAnchor="start" className='lg:text-[60%] md:text-[40%]'>
//           Equipment 1
//         </text>
//       </g>
//     </g>
//   );

//   return (
//     <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
//       <h5 className="text-sm font-bold mb-4 text-center">
//         Average Energy Consumption By Equipment
//       </h5>
//       <div className="w-full relative h-[30vh]">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={"20%"}
//               outerRadius={'45%'}
//               dataKey="value"
//               startAngle={0}
//               endAngle={360}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             {renderCustomContent()}
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// export default EnergyConsumptionChart; 


// import React from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// function EnergyConsumptionChart() {
//   const data = [
//     { name: 'Equipment 4', value: 30, color: '#40E0D0' },  // Turquoise
//     { name: 'Equipment 2', value: 22, color: '#FF0000' },  // Red
//     { name: 'Equipment 3', value: 34, color: '#0000FF' },  // Blue
//     { name: 'Equipment 1', value: 28, color: '#FFD700' },  // Gold
//   ];

//   // Labels for the four quadrants
//   const renderCustomContent = () => (
//     <g>
//       {/* Top Left - Equipment 4 */}
//       <g>
//         <line x1="46%" y1="30%" x2="20%" y2="30%" stroke="#000" strokeWidth="1" />
//         <circle cx="46%" cy="30%" r="2.5" fill="#000" />
//         <text x="18%" y="25%" textAnchor="end" fontWeight="bold" className='lg:text-[80%] md:text-[40%]'>
//           30 kWh
//         </text>
//         <text x="18%" y="30%" textAnchor="end" className='lg:text-[60%] md:text-[40%]'>
//           Equipment 4
//         </text>
//       </g>

//       {/* Bottom Left - Equipment 2 */}
//       <g>
//         <line x1="46%" y1="54%" x2="20%" y2="70%" stroke="#000" strokeWidth="1" />
//         <circle cx="46%" cy="54%" r="2.5" fill="#000" />
//         <text x="18%" y="75%" textAnchor="end" fontWeight="bold" className='lg:text-[60%] md:text-[40%]'>
//           22 kWh
//         </text>
//         <text x="18%" y="80%" textAnchor="end" className='lg:text-[60%] md:text-[40%]'>
//           Equipment 2
//         </text>
//       </g>

//       {/* Bottom Right - Equipment 3 */}
//       <g>
//         <line x1="54%" y1="54%" x2="80%" y2="70%" stroke="#000" strokeWidth="1" />
//         <circle cx="54%" cy="54%" r="2.5" fill="#000" />
//         <text x="82%" y="75%" textAnchor="start" fontWeight="bold" className='lg:text-[60%] md:text-[40%]'>
//           34 kWh
//         </text>
//         <text x="82%" y="80%" textAnchor="start" className='lg:text-[60%] md:text-[40%]'>
//           Equipment 3
//         </text>
//       </g>

//       {/* Top Right - Equipment 1 */}
//       <g>
//         <line x1="54%" y1="46%" x2="80%" y2="30%" stroke="#000" strokeWidth="1" />
//         <circle cx="54%" cy="46%" r="2.5" fill="#000" />
//         <text x="82%" y="25%" textAnchor="start" fontWeight="bold" className='lg:text-[60%] md:text-[40%]'>
//           28 kWh
//         </text>
//         <text x="82%" y="30%" textAnchor="start" className='lg:text-[60%] md:text-[40%]'>
//           Equipment 1
//         </text>
//       </g>
//     </g>
//   );

//   return (
//     <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
//       <h5 className="text-sm font-bold mb-4 text-center">
//         Average Energy Consumption By Equipment
//       </h5>
//       <div className="w-full relative h-[30vh]">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius={"20%"}
//               outerRadius={'45%'}
//               dataKey="value"
//               startAngle={0}
//               endAngle={360}
//             >
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={entry.color} />
//               ))}
//             </Pie>
//             {renderCustomContent()}
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

// export default EnergyConsumptionChart; 


import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function EnergyConsumptionChart() {
  const data = [
    { name: 'Equipment 4', value: 30, color: '#40E0D0' },  // Turquoise
    { name: 'Equipment 2', value: 22, color: '#FF0000' },  // Red
    { name: 'Equipment 3', value: 34, color: '#0000FF' },  // Blue
    { name: 'Equipment 1', value: 28, color: '#FFD700' },  // Gold
  ];

  // Labels for the four quadrants
  const renderCustomContent = () => (
    <g>
      {/* Top Left - Equipment 4 */}
      <g>
        <line x1="39%" y1="39%" x2="20%" y2="30%" stroke="#000" strokeWidth="1" />
        <circle cx="39%" cy="39%" r="2.5" fill="#000" />
        <text x="18%" y="25%" textAnchor="end" fontWeight="bold" className='lg:text-[80%] md:text-[40%]'>
          30 kWh
        </text>
        <text x="18%" y="30%" textAnchor="end" className='lg:text-[60%] md:text-[40%]'>
          Equipment 4
        </text>
      </g>

      {/* Bottom Left - Equipment 2 */}
      <g>
        <line x1="38%" y1="60%" x2="20%" y2="70%" stroke="#000" strokeWidth="1" />
        <circle cx="38%" cy="60%" r="2.5" fill="#000" />
        <text x="18%" y="75%" textAnchor="end" fontWeight="bold" className='lg:text-[80%] md:text-[40%]'>
          22 kWh
        </text>
        <text x="18%" y="80%" textAnchor="end" className='lg:text-[60%] md:text-[40%]'>
          Equipment 2
        </text>
      </g>

      {/* Bottom Right - Equipment 3 */}
      <g>
        <line x1="62%" y1="60%" x2="80%" y2="70%" stroke="#000" strokeWidth="1" />
        <circle cx="62%" cy="60%" r="2.5" fill="#000" />
        <text x="82%" y="75%" textAnchor="start" fontWeight="bold" className='lg:text-[80%] md:text-[40%]'>
          34 kWh
        </text>
        <text x="82%" y="80%" textAnchor="start" className='lg:text-[60%] md:text-[40%]'>
          Equipment 3
        </text>
      </g>

      {/* Top Right - Equipment 1 */}
      <g>
        <line x1="62%" y1="40%" x2="80%" y2="30%" stroke="#000" strokeWidth="1" />
        <circle cx="62%" cy="40%" r="2.5" fill="#000" />
        <text x="82%" y="25%" textAnchor="start" fontWeight="bold" className='lg:text-[80%] md:text-[40%]'>
          28 kWh
        </text>
        <text x="82%" y="30%" textAnchor="start" className='lg:text-[60%] md:text-[40%]'>
          Equipment 1
        </text>
      </g>
    </g>
  );

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md">
      <h5 className="text-sm font-bold mb-4 text-center">
        Average Energy Consumption By Equipment
      </h5>
      <div className="w-full relative h-[30vh]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={"20%"}
              outerRadius={'45%'}
              dataKey="value"
              startAngle={0}
              endAngle={360}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {renderCustomContent()}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EnergyConsumptionChart; 