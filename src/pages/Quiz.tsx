import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [timer, setTimer] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
      .then((res) => {
        if (!res.ok) throw new Error("Quiz API request failed.");
        return res.json();
      })
      .then((data) => {
        setQuestions(data.results);
      })
      .catch((err) => {
        console.error("Failed to load quiz questions", err);
        setError("Failed to load quiz. Please try again later.");
      });
  }, []);

  useEffect(() => {
    if (!submitted) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleNext();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [current, submitted]);

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [current]: answer }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setTimer(15);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
      setTimer(15);
    }
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

  const styles = {
    container: {
      padding: "2rem",
      marginLeft: "250px", // space for fixed sidebar
      color: "white",
      minHeight: "100vh",
      backgroundColor: "#111827",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    box: {
      backgroundColor: "#1f2937",
      padding: "2rem",
      borderRadius: "10px",
      maxWidth: "600px",
      width: "100%",
      boxShadow: "0 0 15px rgba(0,0,0,0.5)",
    },
    question: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "1rem",
    },
    option: (selected: boolean, correct: boolean, submitted: boolean) => ({
      backgroundColor: selected
        ? submitted
          ? correct
            ? "#10b981"
            : "#ef4444"
          : "#6366f1"
        : "#374151",
      color: "white",
      padding: "0.75rem",
      marginBottom: "0.5rem",
      borderRadius: "6px",
      cursor: submitted ? "not-allowed" : "pointer",
      border: "1px solid #4b5563",
      transition: "all 0.3s ease",
    }),
    button: {
      padding: "0.5rem 1rem",
      backgroundColor: "#3b82f6",
      border: "none",
      borderRadius: "6px",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      margin: "0 0.5rem",
    },
    timer: {
      fontSize: "16px",
      marginBottom: "1rem",
      fontWeight: "bold",
      color: timer <= 5 ? "#f87171" : "#fbbf24",
    },
  };

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>{error}</h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={styles.container}>
        <p>Loading quiz...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "1rem" }}>🧠 Quiz Time!</h2>
        <div style={styles.timer}>⏳ Time Left: {timer}s</div>

        <p
          style={styles.question}
          dangerouslySetInnerHTML={{ __html: `${current + 1}. ${currentQ.question}` }}
        />

        <div>
          {allOptions.map((option, index) => (
            <div
              key={index}
              style={styles.option(
                answers[current] === option,
                option === currentQ.correct_answer,
                submitted
              )}
              onClick={() => {
                if (!submitted) handleAnswer(option);
              }}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          ))}
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
          <button
            style={styles.button}
            onClick={handlePrev}
            disabled={current === 0}
          >
            Previous
          </button>
          {current < questions.length - 1 ? (
            <button style={styles.button} onClick={handleNext}>
              Next
            </button>
          ) : (
            <button style={styles.button} onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>

        {submitted && (
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>
              🎉 Your Score: {getScore()} / {questions.length}
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                ...styles.button,
                backgroundColor: "#6b7280",
                marginTop: "1rem",
              }}
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
