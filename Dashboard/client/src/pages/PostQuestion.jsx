import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  let navigate = useNavigate();

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
      console.log(err);
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
    <form onSubmit={handleSubmit}>
      <label>Question</label>
      <input
        placeholder="Question"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />
      {options.map((opt, i) => (
        <div key={i} style={{ marginBottom: "8px" }}>
          <label>{String.fromCharCode(65 + i)}.</label>
          <input
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => updateOption(i, e.target.value)}
            style={{ marginLeft: "8px" }}
          />
        </div>
      ))}
      <input
        placeholder="Correct option"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
      />
      <button type="submit">Post Question</button>
    </form>
  );
}
export default PostQuestion;
