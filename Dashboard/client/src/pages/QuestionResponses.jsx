import "../styles/QuestionResponses.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer,Legend } from "recharts";

const COLORS = ["#4caf50", "#ff9800"];

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
    <div className="question-container">
      <h2 className="section-title">Responses for Question</h2>
      {question && (
        <>
      <div className="question-block">
          <h3 style={{ color: "#444", marginBottom: "1rem" }}>
            {question.questionText}
          </h3>

          <ul className="option-list">
            {question.options.map((opt, idx) => (
              <li key={idx}>
                {String.fromCharCode(65 + idx)}. {opt}
              </li>
            ))}
          </ul>
          </div>
          <div className="chart-wrapper">
            <h2>Correctly and incorrectly answered</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={answerCounts}
                  dataKey="count"
                  nameKey="answer"
                  outerRadius={100}
                  innerRadius={75}
                  label={({ count, percent }) =>
                    `${count} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {answerCounts.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  payload={[
                    { value: "Correct", type: "square", color: COLORS[0] },
                    { value: "In-correct", type: "square", color: COLORS[1] },
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="response-table">
            <h4>📋 Student Responses</h4>
            {responses.length === 0 ? (
              <p>No responses yet.</p>
            ) : (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Answer</th>
                    <th>Score</th>
                    <th>Answered At</th>
                  </tr>
                </thead>
                <tbody>
                  {[...responses]
                    .sort((a, b) => {
                      if (b.score !== a.score) return b.score - a.score;
                      return new Date(a.createdAt) - new Date(b.createdAt);
                    })
                    .map((resp) => (
                      <tr key={resp._id}>
                        <td>{resp.student?.name || "Anonymous"}</td>
                        <td>{resp.student?.email || "N/A"}</td>
                        <td>{resp.answer}</td>
                        <td>
                          {resp.answer === question.correctAnswer ? 1 : 0}
                        </td>
                        <td>
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

export default QuestionResponses;
