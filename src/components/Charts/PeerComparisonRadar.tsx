import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { getUserDataById } from "../../data/SampleUserData";

interface PeerComparisonRadarProps {
  userId: string;
}

const PeerComparisonRadar: React.FC<PeerComparisonRadarProps> = ({ userId }) => {
  const user = getUserDataById(userId);
  if (!user) return null;

  const data = user.peerComparison.map((value, index) => ({
    subject: `Metric ${index + 1}`,
    value,
  }));

  return (
    <motion.div
      className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-blue-600 mb-4">
        Peer Comparison
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 10]} /> {/* ✅ Add this */}
          <Radar
            name="User"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PeerComparisonRadar;
