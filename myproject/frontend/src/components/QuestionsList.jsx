import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions } from "../api/api";

export default function QuestionsList() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuestions();

        if (Array.isArray(response.data)) {
          setQuestions(response.data);
        } else {
          setQuestions(response.data.results || []);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>{questions.length} Questions</h2>

      {questions.map((question, index) => (
        <div
          key={question.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3>
              {String(index + 1).padStart(3, "0")}. {question.title}
            </h3>

            <p>
              <strong>Difficulty:</strong> {question.difficulty}
            </p>
          </div>

          <button
            onClick={() => navigate(`/solve/${question.id}`)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Solve →
          </button>
        </div>
      ))}
    </div>
  );
}