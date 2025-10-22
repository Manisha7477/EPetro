import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface PowerData {
  date: string;
  power: number;
  color: string;
}

export default function PowerUsageChart() {
  const [powerData, setPowerData] = useState<PowerData[]>([]);
  
  useEffect(() => {
    // Generate data for the last 7 days dynamically
    const generateData = () => {
      const data: PowerData[] = [];
      const colors = [
        '#9370DB', // Purple (01/04)
        '#FFA07A', // Light salmon (02/04)
        '#5DC1CD', // Teal (03/04)
        '#FFBB68', // Orange (04/04)
        '#5287DA', // Blue (05/04)
        '#8AD59A', // Green (06/04)
        '#9370DB'  // Purple (07/04)
      ];
      
      // Generate power values similar to the image
      const powerValues = [70, 50, 60, 55, 35, 40, 50];
      
      // Get the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(2)}`;
        
        data.push({
          date: formattedDate,
          power: powerValues[6-i],
          color: colors[6-i]
        });
      }
      
      setPowerData(data);
    };
    
    generateData();
  }, []);
  
  const CustomBar = (props: any) => {
    const { x, y, width, height, color } = props;
    return <rect x={x} y={y} width={width} height={height} fill={color} rx={2} ry={2} />;
  };
  
  return (
<div className="w-full p-4 h-[35vh] rounded-lg shadow-md">
      <div className="pb-4">
        <h5 className="text-sm font-bold">Power usage Last 7 days</h5>
      </div>
 
      <div className="flex">
        <div className="w-full h-[35vh] bg-blue-50/20">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={powerData}
              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={true} 
                tickLine={false}
                tick={{ fontSize: 12 }}
                // height={50}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar 
                dataKey="power" 
                name="Power"
                shape={<CustomBar />}
                isAnimationActive={false}
              >
                {powerData.map((entry, index) => (
                  <rect 
                    key={`rect-${index}`} 
                    fill={entry.color} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      
    </div>
  );
}