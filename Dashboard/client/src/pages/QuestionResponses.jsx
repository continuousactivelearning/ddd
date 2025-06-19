import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

function QuestionResponses() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [responses, setResponses] = useState([]);
  const [answerCounts, setAnswerCounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [questionRes, answersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/questions/${questionId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(
            `http://localhost:5000/api/answers/question/${questionId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        setQuestion(questionRes.data);
        setResponses(answersRes.data);

        const countsMap = {};
        answersRes.data.forEach((r) => {
          countsMap[r.answer] = (countsMap[r.answer] || 0) + 1;
        });

        const chartData = Object.entries(countsMap).map(([answer, count]) => ({
          answer,
          count,
        }));

        setAnswerCounts(chartData);
      } catch (error) {
        alert("Error loading question insight.");
      }
    };

    fetchData();
  }, [questionId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📘 Question Insight</h2>

      {question && (
        <>
          <h3 style={{ color: "#444" }}>{question.questionText}</h3>

          {/* Show options */}
          {question.options && (
            <ul>
              {question.options.map((opt, idx) => (
                <li key={idx}>
                  {String.fromCharCode(65 + idx)}. {opt}
                </li>
              ))}
            </ul>
          )}

          {/* Pie Chart */}
          <div style={{ marginTop: "40px" }}>
            <h4>🥧 Answer Distribution (Pie Chart)</h4>
            <div style={{ width: "100%", maxWidth: "400px", margin: "auto" }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={answerCounts}
                    dataKey="count"
                    nameKey="answer"
                    outerRadius={100}
                    label
                  >
                    {answerCounts.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Responses Table */}
          <div style={{ marginTop: "40px" }}>
            <h4>📋 Student Responses</h4>
            {responses.length === 0 ? (
              <p>No responses yet.</p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f4f4f4" }}>
                    <th style={thStyle}>Student Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Answer</th>
                    <th style={thStyle}>Score</th>
                    <th style={thStyle}>Answered At</th>
                  </tr>
                </thead>
                <tbody>
                  {[...responses]
                    .sort((a, b) => {
                      if (b.score !== a.score) return b.score - a.score;
                      return new Date(b.createdAt) - new Date(a.createdAt);
                    })
                    .map((resp) => (
                      <tr key={resp._id}>
                        <td style={tdStyle}>
                          {resp.student?.name || "Anonymous"}
                        </td>
                        <td style={tdStyle}>{resp.student?.email || "N/A"}</td>
                        <td style={tdStyle}>{resp.answer}</td>
                        <td style={tdStyle}>
                          {resp.answer === question.correctAnswer ? 1 : 0}
                        </td>
                        <td style={tdStyle}>
                          {!isNaN(Date.parse(resp.createdAt))
                            ? new Date(resp.createdAt).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default QuestionResponses;
