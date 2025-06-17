import React, { useState } from "react";
import axios from "axios";

function PostQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/api/questions", {
        questionText,
        options,
        correctAnswer,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Question posted!");
    } catch (err) {
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
      <input
        placeholder="Question"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />
      {options.map((opt, i) => (
        <input
          key={i}
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => updateOption(i, e.target.value)}
        />
      ))}
      <input
        placeholder="Correct Answer"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
      />
      <button type="submit">Post Question</button>
    </form>
  );
}
export default PostQuestion;