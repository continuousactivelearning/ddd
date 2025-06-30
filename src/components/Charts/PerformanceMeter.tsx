import React from "react";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { getUserDataById } from "../../data/SampleUserData";

interface PerformanceMeterProps {
  userId: string;
}

const PerformanceMeter: React.FC<PerformanceMeterProps> = ({ userId }) => {
  const user = getUserDataById(userId);
  if (!user) return null;

  const { score, accuracy, totalQuestions, quizScore } = user.performance;

  const data = [
    {
      name: "Performance",
      value: score,
      fill: "#3b82f6",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: "100%",
        height: "100%",
        background: "rgba(255, 255, 255, 0.05)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "0px",
        textAlign: "center",
        color: "#1e293b",
      }}
    >
      <h3
        style={{
          fontSize: "20px",
          fontWeight: 600,
          color: "#2563eb",
          marginBottom: "20px",
        }}
      >
        Performance Overview
      </h3>

      <div style={{ position: "relative", width: "160px", height: "160px", marginBottom: "24px" }}>
        <RadialBarChart
          width={160}
          height={160}
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={15}
          />
        </RadialBarChart>

        {/* Center Label */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "28px",
          fontWeight: 700,
          color: "#3b82f6",
        }}>
          {score}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", justifyContent: "space-around", width: "100%", flexWrap: "wrap", gap: "16px" }}>
        <div style={statBox}>
          <div style={statLabel}>Accuracy</div>
          <div style={statValue}>{accuracy}%</div>
        </div>
        <div style={statBox}>
          <div style={statLabel}>Total Questions</div>
          <div style={statValue}>{totalQuestions}</div>
        </div>
        <div style={statBox}>
          <div style={statLabel}>Quiz Score</div>
          <div style={statValue}>{quizScore}</div>
        </div>
      </div>
    </motion.div>
  );
};

// 🧊 Styles
const statBox: React.CSSProperties = {
  minWidth: "100px",
  padding: "12px",
  backgroundColor: "rgba(255,255,255,0.1)",
  borderRadius: "12px",
  textAlign: "center",
};

const statLabel: React.CSSProperties = {
  fontSize: "13px",
  color: "#64748b",
  marginBottom: "4px",
};

const statValue: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
};

export default PerformanceMeter;
