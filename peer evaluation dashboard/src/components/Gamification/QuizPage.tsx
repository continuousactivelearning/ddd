import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const QuizPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const [quizFinished, setQuizFinished] = useState(false);
  const navigate = useNavigate();

  // Fetch quiz questions
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
      .then((res) => res.json())
      .then((data) => setQuestions(data.results));
  }, []);

  // Countdown timer
  useEffect(() => {
    if (quizFinished || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleNext();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, currentIndex, quizFinished]);

  const handleSelect = (answer: string) => {
    setSelected(answer);
    if (answer === questions[currentIndex].correct_answer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleNext = () => {
    setSelected(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(15);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(15);
    setSelected(null);
    setQuizFinished(false);
    fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
      .then((res) => res.json())
      .then((data) => setQuestions(data.results));
  };

  if (questions.length === 0) return <div className="text-white p-8">Loading Quiz...</div>;

  if (quizFinished) {
    return (
      <div className="p-8 text-center text-white space-y-6">
        <h2 className="text-3xl font-bold">🎉 Quiz Finished!</h2>
        <p className="text-xl">Your Score: {score} / {questions.length}</p>
        <button
          onClick={handleRestart}
          className="bg-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Play Again
        </button>
        <button
          onClick={() => navigate("/minigames")}
          className="ml-4 border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-black transition"
        >
          Back to Mini Games
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const options = [...currentQ.incorrect_answers, currentQ.correct_answer].sort(() => Math.random() - 0.5);

  return (
    <div className="max-w-3xl mx-auto p-6 text-white space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Question {currentIndex + 1} / {questions.length}</h2>
        <div className="bg-black text-white px-4 py-1 rounded-full font-mono">⏱️ {timeLeft}s</div>
      </div>

      <div className="text-lg font-bold" dangerouslySetInnerHTML={{ __html: currentQ.question }} />

      <div className="space-y-3">
        {options.map((option, idx) => {
          const isCorrect = option === currentQ.correct_answer;
          const isSelected = selected === option;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`w-full text-left p-3 rounded-lg border transition ${
                selected
                  ? isCorrect
                    ? "bg-green-600 border-green-600 text-white"
                    : isSelected
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-gray-800 border-gray-700"
                  : "bg-gray-900 border-gray-700 hover:bg-gray-700"
              }`}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuizPage;
