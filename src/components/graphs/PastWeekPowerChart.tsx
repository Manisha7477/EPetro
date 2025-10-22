import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
//  import { generatePastWeekData, formatDate, PowerData } from '@/utils/chartData';
import { subDays, format } from 'date-fns';

const PowerChart: React.FC = () => {
    const generatePastWeekData = (): PowerData[] => {
        const data: PowerData[] = [];
        const now = new Date();
      
        // Generate data points for the past 7 days
        for (let i = 7; i >= 0; i--) {
          const date = subDays(now, i);
          // Generate 24 data points per day (hourly)
          for (let hour = 0; hour < 24; hour++) {
            date.setHours(hour);
            data.push({
              timestamp: date.toISOString(),
              value: Math.random() * 100 + 50, // Random value between 50 and 150
            });
          }
        }
      
        return data;
      };
  const [data] = React.useState<PowerData[]>(generatePastWeekData());


   interface PowerData {
    timestamp: string;
    value: number;
  }
  
  
  
  const formatDate = (timestamp: string): string => {
    return format(new Date(timestamp), 'dd-MM-yyyy HH:mm');
  };
  return (
    <div className="w-full h-[30vh] px-[2%]">
      <h1 className="text-[150%] font-bold mb-[2%]">Power Spikes past week</h1>
      <div className="w-full h-[calc(100%-2rem)] overflow-x-auto">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#33C3F0" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#33C3F0" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatDate}
                interval={24}
                tick={{ fontSize: '30%' }}
              />
              <YAxis tick={{ fontSize: '90%' }} />
              <Tooltip
                labelFormatter={(label) => formatDate(label as string)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '90%'
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#33C3F0"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PowerChart;