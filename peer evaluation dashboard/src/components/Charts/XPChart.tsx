import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fullData = [
  { day: "Mon", AC: 12 },
  { day: "Tue", AC: 20 },
  { day: "Wed", AC: 18 },
  { day: "Thurs", AC: 15 },
  { day: "Fri", AC: 21 },
  { day: "Sat", AC: 25 },
  { day: "Sun", AC: 30 },
];

const ACChart: React.FC = () => {
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let index = 0;
    const interval = setInterval(() => {
      setAnimatedData((prev) => [...prev, fullData[index]]);
      index++;
      if (index === fullData.length) clearInterval(interval);
    }, 150); // Staggered appearance like badges
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={animatedData}>
          <XAxis dataKey="day" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Bar
            dataKey="AC"
            fill="#8B5CF6"
            radius={[8, 8, 0, 0]}
            animationDuration={500}
            isAnimationActive={mounted}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ACChart;