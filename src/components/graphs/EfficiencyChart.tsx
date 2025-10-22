// import { useState } from 'react';
// import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

// export default function EfficiencyChart() {
//   // Sample data based on the image
//   const purpleData = [
//     { x: 0, y: 5.7 },
//     { x: 1, y: 6.4 },
//     { x: 1.5, y: 6.6 },
//     { x: 2.5, y: 7.1 },
//     { x: 3.5, y: 7.4 },
//     { x: 5, y: 8.4 },
//     { x: 5.5, y: 8.1 },
//     { x: 6, y: 8.3 },
//     { x: 6, y: 8.8 },
//   ];

//   const orangeData = [
//     { x: 1, y: 0.3 },
//     { x: 10, y: 7.8 },
//     { x: 12, y: 7.9 },
//     { x: 15, y: 3 },
//     { x: 17, y: 8.5 },
//     { x: 18, y: 3 },
//     { x: 20, y: 8.5 },
//     { x: 22, y: 8.4 },
//     { x: 23, y: 2.8 },
//     { x: 24, y: 2.5 },
//   ];

//   const cyanData = [
//     { x: 1, y: 4.5 },
//     { x: 1.5, y: 2.2 },
//     { x: 24, y: 8.5 },
//   ];

//   const redData = [
//     { x: 10, y: 6.3 },
//   ];

//   const formatData = (data:any) => {
//     return data.map((point: { x: any; y: any; }) => ({
//       Volume: point.x,
//       Efficiency: point.y,
//     }));
//   };

//   // Custom tick formatter to match the image format (using commas instead of periods)
//   const formatXAxis = (value:any) => {
//     return `${value},0`;
//   };

//   return (
//     <div className="w-full h-[25vh] bg-gray-50 p-4">
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//         <h1 className="text-sm font-bold mb-6">Efficiency Per hour</h1>
//         <div className="h-[25vh] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <ScatterChart
//               margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
//               <XAxis 
//                 type="number" 
//                 dataKey="Volume" 
//                 name="Volume" 
//                 domain={[0, 25]} 
//                 tickFormatter={formatXAxis}
//                 tickCount={7}
//                 label={{ value: 'Volume (t)', position: 'bottom', offset: 5 }} 
//               />
//               <YAxis 
//                 type="number" 
//                 dataKey="Efficiency" 
//                 name="Efficiency" 
//                 domain={[0, 10]} 
//               >
//                 <Label 
//                   value="Total energy" 
//                   position="insideLeft"
//                   angle={-90}
//                   style={{ textAnchor: 'middle' }}
//                   offset={-5}
//                 />
//               </YAxis>
//               <Tooltip 
//                 formatter={(value, name) => [value, name === 'Volume' ? 'Volume (t)' : 'Efficiency']}
//                 cursor={{ strokeDasharray: '3 3' }} 
//               />
//               <Scatter name="Purple Series" data={formatData(purpleData)} fill="#8884d8" />
//               <Scatter name="Orange Series" data={formatData(orangeData)} fill="#ff9e40" />
//               <Scatter name="Cyan Series" data={formatData(cyanData)} fill="#4ecdc4" />
//               <Scatter name="Red Point" data={formatData(redData)} fill="#ff5252" />
//             </ScatterChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

// function EfficiencyChart() {
//   const purpleData = [
//     { x: 0, y: 5.7 }, { x: 1, y: 6.4 }, { x: 1.5, y: 6.6 }, { x: 2.5, y: 7.1 },
//     { x: 3.5, y: 7.4 }, { x: 5, y: 8.4 }, { x: 5.5, y: 8.1 }, { x: 6, y: 8.3 }, { x: 6, y: 8.8 },
//   ];

//   const orangeData = [
//     { x: 1, y: 0.3 }, { x: 10, y: 7.8 }, { x: 12, y: 7.9 }, { x: 15, y: 3 },
//     { x: 17, y: 8.5 }, { x: 18, y: 3 }, { x: 20, y: 8.5 }, { x: 22, y: 8.4 },
//     { x: 23, y: 2.8 }, { x: 24, y: 2.5 },
//   ];

//   const cyanData = [
//     { x: 1, y: 4.5 }, { x: 1.5, y: 2.2 }, { x: 24, y: 8.5 },
//   ];

//   const redData = [
//     { x: 10, y: 6.3 },
//   ];

//   const formatData = (data: any) =>
//     data.map((point: { x: any; y: any }) => ({
//       Volume: point.x,
//       Efficiency: point.y,
//     }));

//   const formatXAxis = (value: any) => `${value},0`;

//   return (
//     <div className="w-full bg-gray-50 p-4">
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//         <h1 className="text-sm font-bold mb-4">Efficiency Per Hour</h1>
//         <div className="w-full h-[25vh]">
//           <ResponsiveContainer width="100%" height="100%">
//             <ScatterChart margin={{ top: 10, right: 0, bottom: 40, left: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
//               <XAxis
//                 type="number"
//                 dataKey="Volume"
//                 domain={[0, 25]}
//                 tickFormatter={formatXAxis}
//                 tickCount={7}
//                 label={{ value: 'Volume (t)', position: 'bottom', offset: 0 }}
//               />
//               <YAxis
//                 type="number"
//                 dataKey="Efficiency"
//                 domain={[0, 10]}
//               >
//                 <Label
//                   value="Total Energy"
//                   position="insideLeft"
//                   angle={-90}
//                   style={{ textAnchor: 'middle' }}
//                 //   offset={-5}
//                 />
//               </YAxis>
//               <Tooltip
//                 formatter={(value, name) => [value, name === 'Volume' ? 'Volume (t)' : 'Efficiency']}
//                 cursor={{ strokeDasharray: '3 3' }}
//               />
//               <Scatter name="Purple Series" data={formatData(purpleData)} fill="#8884d8" />
//               <Scatter name="Orange Series" data={formatData(orangeData)} fill="#ff9e40" />
//               <Scatter name="Cyan Series" data={formatData(cyanData)} fill="#4ecdc4" />
//               <Scatter name="Red Point" data={formatData(redData)} fill="#ff5252" />
//             </ScatterChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default EfficiencyChart;

import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  Label,
} from 'recharts';

function EfficiencyChart() {
  const purpleData = [
    { x: 0, y: 5.7 }, { x: 1, y: 6.4 }, { x: 1.5, y: 6.6 }, { x: 2.5, y: 7.1 },
    { x: 3.5, y: 7.4 }, { x: 5, y: 8.4 }, { x: 5.5, y: 8.1 }, { x: 6, y: 8.3 }, { x: 6, y: 8.8 },
  ];

  const orangeData = [
    { x: 1, y: 0.3 }, { x: 10, y: 7.8 }, { x: 12, y: 7.9 }, { x: 15, y: 3 },
    { x: 17, y: 8.5 }, { x: 18, y: 3 }, { x: 20, y: 8.5 }, { x: 22, y: 8.4 },
    { x: 23, y: 2.8 }, { x: 24, y: 2.5 },
  ];

  const cyanData = [
    { x: 1, y: 4.5 }, { x: 1.5, y: 2.2 }, { x: 24, y: 8.5 },
  ];

  const redData = [
    { x: 10, y: 6.3 },
  ];

  const formatData = (data: any[]) =>
    data.map((point: { x: any; y: any; }) => ({
      Volume: point.x,
      Efficiency: point.y,
    }));

  const formatXAxis = (value: any) => `${value},0`;

  return (
    <div className="w-full h-[30vh] bg-gray-50 p-[2%]">
      <div className="w-full h-full bg-white p-[2%] rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-sm font-bold mb-[2%]">Efficiency Per Hour</h1>
        <div className="w-full h-[100%]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 0, bottom: 40, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                type="number"
                dataKey="Volume"
                domain={[0, 25]}
                tickFormatter={formatXAxis}
                tickCount={7}
                label={{ value: 'Volume (t)', position: 'bottom', offset: 0}}
              />
              <YAxis
                type="number"
                dataKey="Efficiency"
                domain={[0, 10]}
              >
                <Label
                  value="Total Energy"
                  position="insideLeft"
                  angle={-90}
                  style={{ textAnchor: 'middle' }}
                />
              </YAxis>
              <Tooltip
                formatter={(value, name) => [value, name === 'Volume' ? 'Volume (t)' : 'Efficiency']}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter name="Purple Series" data={formatData(purpleData)} fill="#8884d8" />
              <Scatter name="Orange Series" data={formatData(orangeData)} fill="#ff9e40" />
              <Scatter name="Cyan Series" data={formatData(cyanData)} fill="#4ecdc4" />
              <Scatter name="Red Point" data={formatData(redData)} fill="#ff5252" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default EfficiencyChart;
