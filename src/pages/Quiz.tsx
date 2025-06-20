import React, { useState, useEffect } from 'react';
import questions from './questions.json';

interface Question {
  question: string;
  A: string;
  B: string;
  C: string;
  D: string;
  answer: 'A' | 'B' | 'C' | 'D';
}

const Quiz: React.FC = () => {
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // ⏳ 30 seconds per question

  useEffect(() => {
    const shuffled = (questions as Question[])
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    setQuizQuestions(shuffled);
  }, []);

  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (timeLeft === 0 && !isAnswered) {
      setIsAnswered(true);
    }
  }, [timeLeft, isAnswered]);

  const currentQuestion = quizQuestions[currentIndex];

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentIndex(currentIndex + 1);
    setTimeLeft(30);
  };

  if (quizQuestions.length === 0) return <div style={{ paddingLeft: '230px' }}>Loading...</div>;

  return (
    <div
      style={{
        paddingLeft: '230px',
        paddingTop: '2rem',
        paddingRight: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        color: '#1f2937', // Ensures text is always visible
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
          Question {currentIndex + 1} of 10
        </h2>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>
          Score: {score}
        </div>
      </div>

      <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '12px' }}>
        Time left: <span style={{ color: timeLeft <= 10 ? '#dc2626' : '#2563eb' }}>{timeLeft}s</span>
      </div>

      <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '1rem' }}>
        {currentQuestion.question}
      </p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {(['A', 'B', 'C', 'D'] as const).map((key) => {
          const isCorrect = currentQuestion.answer === key;
          const isSelected = selectedAnswer === key;

          return (
            <li key={key} style={{ marginBottom: '12px' }}>
              <label
                style={{
                  display: 'block',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #ccc',
                  backgroundColor: isAnswered
                    ? isCorrect
                      ? '#dcfce7'
                      : isSelected
                      ? '#fee2e2'
                      : '#fff'
                    : '#fff',
                  color: isAnswered && isCorrect
                    ? '#166534'
                    : isSelected
                    ? '#991b1b'
                    : '#1f2937',
                  cursor: isAnswered ? 'default' : 'pointer',
                  fontWeight: 500,
                }}
              >
                <input
                  type="radio"
                  name="option"
                  value={key}
                  disabled={isAnswered}
                  checked={isSelected}
                  onChange={() => handleAnswer(key)}
                  style={{ marginRight: '12px' }}
                />
                <strong>{key}:</strong> {currentQuestion[key]}
              </label>
            </li>
          );
        })}
      </ul>

      {isAnswered && (
        <div style={{ marginTop: '16px', fontSize: '16px', fontWeight: 500 }}>
          {selectedAnswer === currentQuestion.answer ? (
            <span style={{ color: '#16a34a' }}>✅ Correct!</span>
          ) : (
            <span style={{ color: '#b91c1c' }}>
              ❌ Incorrect. Correct answer: {currentQuestion.answer}
            </span>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        {isAnswered && currentIndex < 9 && (
          <button
            onClick={handleNext}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Next
          </button>
        )}

        {isAnswered && currentIndex === 9 && (
          <div style={{ marginTop: '24px', fontSize: '20px', fontWeight: 600 }}>
            🎉 Quiz Complete! Final Score: <span style={{ color: '#3b82f6' }}>{score}/10</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
