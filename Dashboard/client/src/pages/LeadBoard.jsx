import '../styles/LeadBoard.css'
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Leaderboard = () => {
  const [responses, setResponses] = useState([]);
  const [userId, setUserId] = useState(null);
  const prevRankingsRef = useRef({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

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
      <div>
        <Link to="/profile" className="link-button">Back</Link>
        <h2 className="board-heading">🏆 Leaderboard</h2>
      </div>
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
  <AnimatePresence initial={false}>
    {sortedResponses.map((res, index) => {
      const movement = getRankChange(res._id);
      const isCurrentUser = userId === res.studentId;

      const rowBg =
        movement === "up"
          ? "bg-green-50"
          : movement === "down"
          ? "bg-red-50"
          : "bg-white";

      const badge =
        index === 0
          ? "🥇"
          : index === 1
          ? "🥈"
          : index === 2
          ? "🥉"
          : null;

      return (
        <motion.tr
          key={res.studentId}
          layout
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className={`transition-colors duration-500 ${rowBg} ${
            isCurrentUser ? "highlight-row" : ""
          }`}
        >
          <td className="px-4 py-2 font-semibold flex items-center gap-2">
            {badge && <span className="text-xl">{badge}</span>}
            {index + 1}
            {isCurrentUser && (
              <span className="text-purple-600 ml-1">(You)</span>
            )}
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
