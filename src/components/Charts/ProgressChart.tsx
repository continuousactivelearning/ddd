import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import { getUserDataById } from '../../data/SampleUserData'; // ✅ use relative path based on your structure

interface ProgressChartProps {
  userId: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ userId }) => {
  const user = getUserDataById(userId);
  if (!user) return null;

  const data = user.progress.weeklyScores;

  return (
    <motion.div
      className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-blue-600 mb-4">Weekly Progress</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f9fafb',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.75rem'
            }}
            formatter={(value: number, name: string) => [`${value}`, name === 'score' ? 'Score' : 'Hours']}
          />
          <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ProgressChart;
