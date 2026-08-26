import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getQuestion, submitCode } from "../api/api";
import "./Solve.css";

export default function Solve() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [hintShow, setHintShow] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, [id]);

  const loadQuestion = async () => {
    setQuestion(null);
    setNotFound(false);

    try {
      const res = await getQuestion(id);

      setQuestion(res.data);

      setCode(
        res.data.starter_code ||
          `def solve():
    # Write your code here
    pass`
      );
    } catch (err) {
      console.error(err);
      setNotFound(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await submitCode({
        question_id: id,
        code: code,
        language_id: 71,
      });

      setResult(res.data);

      if (res.data.status !== "Correct") {
        alert(
          `❌ ${res.data.status}\n${
            res.data.reason || res.data.logic_error || ""
          }`
        );
      }
    } catch (err) {
      console.error(err);
      alert("Backend connection failed.");
    }

    setLoading(false);
  };

  if (notFound) {
    return (
      <div className="loading">
        <h2>Question Not Found</h2>
        <p>Question ID : {id}</p>

        <button className="back" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    );
  }

  if (!question) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="solve-page">
      <div className="solve-left">

        <div className="solve-topbar">
          <button className="back" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <span className="qid">#{question.id}</span>
        </div>

        <h1>{question.title}</h1>

        <div className="q-badges">
          <span className="b easy">{question.difficulty}</span>
          <span className="b gray">{question.category}</span>
          <span className="b gray">{question.topic}</span>
        </div>

        <div className="card">
          <h3>Description</h3>
          <p>{question.description}</p>
        </div>

        <div className="sample-grid">
          <div className="sample">
            <h4>Sample Input</h4>
            <code>{question.sample_input}</code>
          </div>

          <div className="sample">
            <h4>Sample Output</h4>
            <code>{question.sample_output}</code>
          </div>
        </div>

        <div className="card dark">
          <h3>Constraints</h3>
          <pre>{question.constraints}</pre>
        </div>

        <div className="hint-box">
          <div
            className="hint-head"
            onClick={() => setHintShow(!hintShow)}
          >
            <span>💡 Hint</span>
            <span>{hintShow ? "▲" : "▼"}</span>
          </div>

          {hintShow && <p>{question.hints}</p>}
        </div>

        {result && (
          <div className={`result ${result.status}`}>
            <h3>
              {result.status === "Correct"
                ? `✅ Correct (${result.score}/10)`
                : `❌ Wrong (${result.score}/10)`}
            </h3>

            <p>{result.reason}</p>

            <p>{result.logic_error}</p>

            <p>{result.ai_hint}</p>
          </div>
        )}
      </div>

      <div className="solve-right">
        <div className="editor-top">
          <h3>💻 Code Editor</h3>

          <button
            className="reset-btn"
            onClick={() => setCode(question.starter_code)}
          >
            Reset
          </button>
        </div>

        <textarea
          className="code-area"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Checking..." : "Submit Answer"}
        </button>
      </div>
    </div>
  );
}