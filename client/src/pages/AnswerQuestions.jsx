import React, { useEffect, useState } from "react";
import axios from "axios";

function AnswerQuestions() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [score, setScore] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const [qRes, aRes, sRes] = await Promise.all([
          axios.get("http://localhost:5000/api/questions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/answers/mine", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/answers/score", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const questions = qRes.data;
        const myAnswers = aRes.data;

        const answeredMap = {};
        myAnswers.forEach((ans) => {
          answeredMap[ans.question] = ans.answer;
        });

        const answered = questions.filter((q) => answeredMap[q._id]);
        const unanswered = questions.filter((q) => !answeredMap[q._id]);

        setQuestions(questions);
        setAnswers(answeredMap);
        setAnsweredQuestions(answered);
        setUnansweredQuestions(unanswered);
        setScore(sRes.data.score);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (qid, answer) => {
    setAnswers({ ...answers, [qid]: answer });
  };

const handleSubmit = async () => {
  try {
    await axios.post("http://localhost:5000/api/answers/submit", answers, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Submitted successfully");

    // Clear local answers to avoid re-submission
    setAnswers({});
    // Re-fetch data properly
    window.location.reload();
  } catch (err) {
    alert(err.response?.data?.error || "Submit failed");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      {score !== null && (
        <h3 style={{ color: "purple" }}>🎯 Your Score: {score}</h3>
      )}

      {unansweredQuestions.length > 0 && (
        <>
          <h2>🆕 Unanswered Questions</h2>
          {unansweredQuestions.map((q) => (
            <div key={q._id} style={{ marginBottom: "20px" }}>
              <p><strong>{q.questionText}</strong></p>
              {q.options.map((opt, idx) => {
                const optionLetter = String.fromCharCode(65 + idx);
                return (
                  <label key={idx} style={{ display: "block" }}>
                    <input
                      type="radio"
                      name={q._id}
                      value={optionLetter}
                      checked={answers[q._id] === optionLetter}
                      onChange={() => handleChange(q._id, optionLetter)}
                    />
                    {optionLetter}. {opt}
                  </label>
                );
              })}
            </div>
          ))}
          <button onClick={handleSubmit} style={{ marginBottom: "30px" }}>
            Submit Answers
          </button>
        </>
      )}

      <h2>✅ Answered Questions</h2>
      {answeredQuestions.map((q) => (
        <div key={q._id} style={{ marginBottom: "20px", opacity: 0.9 }}>
          <p><strong>{q.questionText}</strong></p>
          {q.options.map((opt, idx) => {
            const optionLetter = String.fromCharCode(65 + idx);
            const isCorrect = q.correctAnswer === optionLetter;
            const isSelected = answers[q._id] === optionLetter;

            let color = "black";
            if (isCorrect) color = "green";
            if (isSelected && !isCorrect) color = "red";

            return (
              <label key={idx} style={{ display: "block", color }}>
                <input
                  type="radio"
                  name={q._id}
                  value={optionLetter}
                  checked={isSelected}
                  disabled
                />
                {optionLetter}. {opt}
              </label>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default AnswerQuestions;
