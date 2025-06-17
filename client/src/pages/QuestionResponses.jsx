import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function QuestionResponses() {
  const { questionId } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/answers/question/${questionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setResponses(res.data);
      } catch (err) {
        alert("Failed to fetch responses for this question.");
      }
    };
    fetchResponses();
  }, [questionId]);

  return (
    <div>
      <h2>Responses for Question ID: {questionId}</h2>
      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <ul>
          {responses.map((resp) => (
            <li key={resp._id}>
              <p><strong>Student:</strong> {resp.student?.name} ({resp.student?.email})</p>
              <p><strong>Answer:</strong> {resp.answer}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuestionResponses;