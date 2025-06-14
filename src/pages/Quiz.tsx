import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

type QuizQuestion = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const Quiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
  fetch("https://quizapi.io/api/v1/questions?apiKey=wCDCTsF9WwhlTcfyOHX1Xwix1r9S0RfVBKUuxjrN&category=code&difficulty=Easy&limit=10&tags=JavaScript")
    .then((res) => {
      if (!res.ok) throw new Error("Quiz API request failed.");
      return res.json();
    })
    .then((data) => {
      const formatted = data.map((q: any) => {
        const correctKey = Object.entries(q.correct_answers || {}).find(([_, isCorrect]) => isCorrect === "true");
        const correctAnswerKey = correctKey?.[0]?.replace("_correct", "");
        const correctAnswer = q.answers?.[correctAnswerKey] || "";

        const incorrectAnswers = Object.entries(q.answers || {})
          .filter(([key, val]) => val && key !== correctAnswerKey)
          .map(([_, val]) => val as string);

        return {
          question: q.question,
          correct_answer: correctAnswer,
          incorrect_answers: incorrectAnswers,
        };
      });
      setQuestions(formatted);
    })
    .catch((err) => {
      console.error("Failed to load quiz questions Error:", err);
      setError("Failed to load quiz. Please try again later.");
    });
}, []);



  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [current]: answer }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getScore = () => {
    return Object.entries(answers).filter(
      ([qIdx, ans]) => ans === questions[parseInt(qIdx)].correct_answer
    ).length;
  };

  const currentQ = questions[current];
  const allOptions = currentQ
    ? [...currentQ.incorrect_answers, currentQ.correct_answer].sort(() => Math.random() - 0.5)
    : [];

  if (error) {
    return (
      <div className="main-content">
        <h2 className="text-red-500 text-xl">{error}</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="main-content text-white text-lg">
        Loading quiz...
      </div>
    );
  }

  return (
    <div className="main-content quiz-container">
      <div className="quiz-box">
        <h1 className="text-2xl font-bold mb-6">🧠 Quiz Time!</h1>

        <p className="text-lg mb-4" dangerouslySetInnerHTML={{ __html: `${current + 1}. ${currentQ.question}` }} />
        <ul className="space-y-2">
          {allOptions.map((option, index) => (
            <li
              key={index}
              className={`p-2 border rounded cursor-pointer ${
                answers[current] === option
                  ? "bg-purple-700 border-purple-400"
                  : "hover:bg-gray-700 border-gray-600"
              }`}
              onClick={() => handleAnswer(option)}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          ))}
        </ul>

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="bg-gray-600 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {current < questions.length - 1 ? (
            <button onClick={handleNext} className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
              Submit
            </button>
          )}
        </div>

        {submitted && (
          <div className="mt-6 text-center">
            <p className="text-xl font-bold text-green-400">
              🎉 Your Score: {getScore()} / {questions.length}
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-gray-700 px-4 py-2 rounded"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
