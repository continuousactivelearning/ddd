import React, { useEffect, useState } from "react";
import axios from "axios";

function AnswerQuestions() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get("http://localhost:5000/api/questions");
      setQuestions(res.data);
    };
    fetchQuestions();
  }, []);

  const handleChange = (qid, answer) => {
    setAnswers({ ...answers, [qid]: answer });
  };

  const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  try {
    await axios.post("http://localhost:5000/api/answers/submit", answers, {

      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    alert("Submitted successfully");
  } catch (err) {
    console.error("Submit error:", err.response?.data);
    alert("Failed to submit answers");
  }
};

  return (
    <div>
      <h2>Answer Questions</h2>
      {questions.map((q) => (
        <div key={q._id}>
          <p>{q.questionText}</p>
          {q.options.map((opt, idx) => (
            <label key={idx}>
              <input
                type="radio"
                name={q._id}
                value={opt}
                checked={answers[q._id] === opt}
                onChange={() => handleChange(q._id, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Answers</button>
    </div>
  );
}
export default AnswerQuestions;