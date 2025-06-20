import "../styles/Auth.css"
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/questions",
        {
          questionText,
          options,
          correctAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Question posted!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      navigate("/login");
      alert(err.response?.data?.error || "Error posting question");
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Post a New Question</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          placeholder="Question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="auth-input"
        />
        {options.map((opt, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <label>{String.fromCharCode(65 + i)}.</label>
            <input
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              className="auth-input"
              style={{ flex: 1 }}
            />
          </div>
        ))}
        <input
          placeholder="Correct option (A/B/C/D)"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value.toUpperCase())}
          className="auth-input"
        />
        <button type="submit" className="auth-button">Post Question</button>
      </form>
    </div>
  );
}

export default PostQuestion;