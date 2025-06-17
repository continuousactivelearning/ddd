import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewQuestions() {
  const [questions, setQuestions] = useState([]);
  const [responsesMap, setResponsesMap] = useState({}); // stores responses per question
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/questions", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data);
      } catch (err) {
        alert("Failed to load questions");
      }
    };
    fetchQuestions();
  }, []);

  const handleViewResponses = async (questionId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`http://localhost:5000/api/questions/responses/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResponsesMap((prev) => ({ ...prev, [questionId]: res.data }));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to fetch responses");
    }
  };

  return (
    <div>
      <h2>All Questions</h2>
      {questions.length === 0 ? (
        <p>No questions posted yet.</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li key={q._id}>
              <strong>Question:</strong> {q.questionText}
              <ul>
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <button onClick={() => handleViewResponses(q._id)}>
                View Responses
              </button>

              {/* Show responses if available */}
              {responsesMap[q._id] && (
                <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
                  <h4>Responses:</h4>
                  {responsesMap[q._id].length === 0 ? (
                    <p>No one answered yet.</p>
                  ) : (
                    <ul>
                      {responsesMap[q._id].map((resp) => (
                        <li key={resp._id}>
                          <strong>{resp.student?.name || "Unknown"}:</strong> {resp.answer}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewQuestions;