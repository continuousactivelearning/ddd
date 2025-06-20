import "../styles/LeadBoard.css"
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Leaderboard = () => {
  const [responses, setResponses] = useState([]);
  const prevRankingsRef = useRef({});

  useEffect(() => {
    const fetchLeaderboard = () => {
      axios
        .get("http://localhost:5000/api/answers/leaderboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setResponses(res.data))
        .catch((err) => console.error(err));
    };

    fetchLeaderboard();
    const intervalId = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const sortedResponses = [...responses].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return new Date(a.lastSubmission) - new Date(b.lastSubmission);
  });

  const currentRankings = {};
  sortedResponses.forEach((res, i) => {
    currentRankings[res._id] = i;
  });

  const getRankChange = (id) => {
    const prev = prevRankingsRef.current[id];
    const curr = currentRankings[id];
    if (prev === undefined) return null;
    if (curr < prev) return "up";
    if (curr > prev) return "down";
    return "same";
  };

  useEffect(() => {
    prevRankingsRef.current = currentRankings;
  }, [responses]);

  return (
    <div className="leaderboard-container">
      <h2 className="board-heading">🏆 Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Sl.No.</th>
            <th>Student</th>
            <th>Score</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {sortedResponses.map((res, index) => {
              const movement = getRankChange(res._id);
              const rowBg =
                movement === "up"
                  ? "bg-green-50"
                  : movement === "down"
                  ? "bg-red-50"
                  : "bg-white";

              return (
                <motion.tr
                  key={res._id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  className={`transition-colors duration-500 ${rowBg}`}
                >
                  <td className="px-4 py-2 flex items-center gap-2 font-semibold">
                    {index + 1}
                    <motion.span
                      key={res._id + movement}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3 }}
                      className="rank-icon"
                    >
                      {movement === "up" && (
                        <span className="text-green-500">▲</span>
                      )}
                      {movement === "down" && (
                        <span className="text-red-500">▼</span>
                      )}
                    </motion.span>
                  </td>
                  <td className="px-4 py-2">{res.name || "Unnamed"}</td>
                  <td className="px-4 py-2">{res.totalScore}</td>
                  <td className="px-4 py-2">
                    {new Date(res.lastSubmission).toLocaleString()}
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;