import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewResponses() {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/answers/responses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResponses(res.data);
      } catch (err) {
        alert("Failed to fetch responses");
      }
    };
    fetchResponses();
  }, []);

  return (
    <div>
      <h2>Student Responses</h2>
      {responses.length === 0 ? (
        <p>No responses submitted yet.</p>
      ) : (
        <ul>
          {responses.map((resp) => (
            <li key={resp._id}>
              <p><strong>Student:</strong> {resp.student?.name} ({resp.student?.email})</p>
              <p><strong>Question:</strong> {resp.question?.questionText}</p>
              <p><strong>Answer:</strong> {resp.answer}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ViewResponses;
