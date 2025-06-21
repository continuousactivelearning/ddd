import "../styles/Auth.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

function PostQuestion() {
  const [content, setContent] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    const prompt = `
      Generate 1 multiple choice question based on the following content.

Return the response as a single valid JSON array of objects.

Each object must include:
- "question": (string)
- "options": (an array of 4 plain strings — do NOT prefix with A), B), etc.)
- "answer": (a single letter: "A", "B", "C", or "D", indicating the correct option)

      Content: """${content}"""
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let text = response.text;
      text = text.replace(/```json\n?|```/g, "").trim();
      const parsed = JSON.parse(text);

      const q = parsed[0];
      setQuestionText(q.question);
      setOptions(q.options);
      setCorrectAnswer(q.answer);
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/questions",
        {
          questionText,
          options,
          correctAnswer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Question posted!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error posting question");
      navigate("/login");
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Generate or Edit a Question</h2>

      <textarea
        rows="5"
        placeholder="Paste content here to generate question..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="auth-input"
      ></textarea>

      <button
        onClick={handleGenerate}
        disabled={loading || !content}
        className="auth-button"
      >
        {loading ? "Generating..." : "Generate Question"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form mt-4">
        <input
          placeholder="Question"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="auth-input"
        />
        {options.map((opt, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <label>{String.fromCharCode(65 + i)}.</label>
            <input
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              className="auth-input"
              style={{ flex: 1 }}
            />
          </div>
        ))}
        <input
          placeholder="Correct option (A/B/C/D)"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value.toUpperCase())}
          className="auth-input"
        />
        <button type="submit" className="auth-button">Post Question</button>
      </form>
    </div>
  );
}

export default PostQuestion;