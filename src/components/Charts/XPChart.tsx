import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getUserDataById } from '../../data/SampleUserData';


 const userId = "user_001"; // Replace with the actual user ID you want to fetch data for
const XPChart = () => {
  const user = getUserDataById(userId);
  if (!user) return null;

  const data = user.xp.daily;

  return (
    <motion.div
      className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4 text-blue-600">
        <Sparkles size={20} />
        <h3 className="font-semibold text-lg">XP Trend</h3>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
            }}
            formatter={(value: number, name: string) =>
              [`${value} XP`, name === "bonus" ? "Bonus" : "XP"]
            }
          />
          <Bar dataKey="xp" radius={[6, 6, 0, 0]} fill="#3b82f6">
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} className="transition-all duration-300 hover:fill-blue-400" />
            ))}
          </Bar>
          <Bar dataKey="bonus" radius={[6, 6, 0, 0]} fill="#10b981">
            {data.map((_entry, index) => (
              <Cell key={`cell-bonus-${index}`} className="transition-all duration-300 hover:fill-green-400" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default XPChart;
