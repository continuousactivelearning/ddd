import "../styles/ViewQuestions.css"
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
    <div className="question-container">
      <h2 className="section-title">📚 All Posted Questions</h2>
      {questions.length === 0 ? (
        <p>No questions posted yet.</p>
      ) : (
        <ul className="question-list">
          {questions.map((q) => (
            <li key={q._id} className="question-item">
              <p className="question-text"><strong>Q:</strong> {q.questionText}</p>
              <ul className="option-list">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    {String.fromCharCode(65 + i)}. {opt}
                  </li>
                ))}
              </ul>
              <div className="response-button">
                <Link to={`/responses/${q._id}`} className="link-button">
                  📊 View Responses
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