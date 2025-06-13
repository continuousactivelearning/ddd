import { useState, useEffect } from "react";
import { Sparkles, Brain, Map } from "lucide-react"; // Optional icons

type QuizQuestion = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const MiniGames = () => {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const games = [
    { name: "Memory Map", icon: <Map className="w-5 h-5 mr-2" />, color: "from-green-400 to-blue-500" },
    { name: "Quiz", icon: <Brain className="w-5 h-5 mr-2" />, color: "from-purple-500 to-pink-500" },
    { name: "Short Questions", icon: <Sparkles className="w-5 h-5 mr-2" />, color: "from-yellow-400 to-orange-500" },
  ];

  useEffect(() => {
    if (showQuiz) {
      fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
        .then((res) => res.json())
        .then((data) => setQuizQuestions(data.results))
        .catch((err) => console.error("Failed to load quiz questions", err));
    }
  }, [showQuiz]);

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {games.map((game) => (
        <button
          key={game.name}
          onClick={() => game.name === "Quiz" && setShowQuiz(true)}
          className={`flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl shadow-md bg-gradient-to-r ${game.color} text-white text-lg font-semibold transform hover:scale-105 transition-transform duration-300`}
        >
          {game.icon}
          {game.name}
        </button>
      ))}

      {showQuiz && (
        <div className="mt-6 bg-gray-800 text-white p-4 rounded-xl space-y-3 shadow-lg">
          <h3 className="text-xl font-bold">🧠 Quiz Time!</h3>
          {quizQuestions.length === 0 ? (
            <p>Loading questions...</p>
          ) : (
            quizQuestions.map((q, idx) => (
              <div key={idx} className="border-b border-gray-600 pb-3 mb-3">
                <p className="font-semibold mb-2" dangerouslySetInnerHTML={{ __html: `${idx + 1}. ${q.question}` }}></p>
                <ul className="list-disc list-inside ml-4">
                  {[...q.incorrect_answers, q.correct_answer]
                    .sort(() => Math.random() - 0.5)
                    .map((option, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: option }}></li>
                    ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MiniGames;
