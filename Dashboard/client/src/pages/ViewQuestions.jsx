import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ViewQuestions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/questions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data);
      } catch (err) {
        alert("Failed to load questions");
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 All Posted Questions</h2>
      {questions.length === 0 ? (
        <p>No questions posted yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {questions.map((q) => (
            <li
              key={q._id}
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              <strong>Q:</strong> {q.questionText}
              <ul>
                {q.options.map((opt, i) => (
                  <li key={i}>{String.fromCharCode(65 + i)}. {opt}</li>
                ))}
              </ul>
              <div style={{ marginTop: "10px" }}>
                <Link to={`/responses/${q._id}`}>
                  <button>📊 View Responses</button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewQuestions;