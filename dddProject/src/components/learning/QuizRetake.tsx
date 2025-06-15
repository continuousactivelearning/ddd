const QuizRetake = ({ questions }: { questions: string[] }) => (
  <div>
    <h2 className="text-xl font-semibold mb-2">Retake Quiz</h2>
    {questions.map((q, i) => (
      <div key={i} className="p-3 mb-2 bg-white shadow rounded">
        {q}
        {/* Add options */}
      </div>
    ))}
  </div>
);
export default QuizRetake;