import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function QuestionResponses() {
  const { questionId } = useParams();
  const [responses, setResponses] = useState([]);
  const [answerCounts, setAnswerCounts] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/answers/question/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResponses(res.data);

        const countsMap = {};
        res.data.forEach((r) => {
          countsMap[r.answer] = (countsMap[r.answer] || 0) + 1;
        });

        const chartData = Object.entries(countsMap).map(([answer, count]) => ({
          answer,
          count,
        }));

        setAnswerCounts(chartData);
      } catch (err) {
        alert("Failed to fetch responses for this question.");
      }
    };

    fetchResponses();
  }, [questionId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Responses for Question ID: {questionId}</h2>

      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <>
          <div style={{ width: "100%", height: 300, maxWidth: "600px", margin: "auto" }}>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={answerCounts}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="answer" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#82ca9d" name="Number of Responses" />
    </BarChart>
  </ResponsiveContainer>
</div>


          <ul style={{ marginTop: "30px" }}>
            {responses.map((resp) => (
              <li key={resp._id} style={{ marginBottom: "10px" }}>
                <p><strong>Student:</strong> {resp.student?.name} ({resp.student?.email})</p>
                <p><strong>Answer:</strong> {resp.answer}</p>
                <hr />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default QuestionResponses;