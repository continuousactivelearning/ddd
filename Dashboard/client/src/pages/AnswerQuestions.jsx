import '../styles/AnswerQuestion.css'
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
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
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

  const handleChange = (qid, answer) => {
    setAnswers((prev) => ({ ...prev, [qid]: answer }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/answers/submit", answers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Submitted successfully");
      setAnswers({});
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Submit failed");
    }
  };

  return (
    <div className="question-container">
      {score !== null && (
        <h3 className="score-display">🎯 Your Score: {score}</h3>
      )}

      {unansweredQuestions.length > 0 && (
        <>
          <h2 className="section-title">Unanswered Questions</h2>
          {unansweredQuestions.map((q) => (
            <div key={q._id} className="question-block">
              <p className="question-text">
                <strong>{q.questionText}</strong>
              </p>
              {q.options.map((opt, idx) => {
                const optionLetter = String.fromCharCode(65 + idx);
                return (
                  <label key={idx} className="option-label">
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
          <button onClick={handleSubmit} className="submit-button">
            Submit Answers
          </button>
        </>
      )}

      <h2 className="section-title">Answered Questions</h2>
      {answeredQuestions.map((q) => (
        <div key={q._id} className="question-block answered">
          <p className="question-text">
            <strong>{q.questionText}</strong>
          </p>
          {q.options.map((opt, idx) => {
            const optionLetter = String.fromCharCode(65 + idx);
            const isCorrect = q.correctAnswer === optionLetter;
            const isSelected = answers[q._id] === optionLetter;

            let optionClass = "option-label";
            if (isCorrect) optionClass += " correct";
            if (isSelected && !isCorrect) optionClass += " incorrect";

            return (
              <label key={idx} className={optionClass}>
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
