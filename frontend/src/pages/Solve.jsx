import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getQuestion, submitCode } from "../api/api";
import { allQuestions } from "../data/index.js";
import "./Solve.css";

const STARTERS = {
  "two sum": "def two_sum(nums, target):\n    # Write your code here\n    pass",
  "valid parentheses": "def is_valid(s):\n    # Write your code here\n    pass",
};

const getStarter = (q) =>
  q.starter_code ||
  STARTERS[(q.title || "").toLowerCase()] ||
  "# Write your code here\n";

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
    setResult(null);
    try {
      const res = await getQuestion(id);
      setQuestion(res.data);
      setCode(getStarter(res.data));
      return;
    } catch (err) {
      console.log("Backend not found, trying local JSON...");
    }

    try {
      const decoded = decodeURIComponent(id || "");
      const q =
        allQuestions.find((x) => x.title === decoded) ||
        allQuestions.find((x) => (x.title || "").toLowerCase() === decoded.toLowerCase()) ||
        allQuestions.find((x) => String(x.id) === decoded);

      if (q) {
        setQuestion(q);
        setCode(getStarter(q));
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setNotFound(true);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
          const res = await submitCode({
        question_id: question?.title || id,
        mbpp_id: question?.id,
        code: code,
      });
      setResult(res.data);
    } catch (err) {
      setResult({
        status: "Runtime Error",
        score: 0,
        reason: "Backend reach aagala. api.js la BACKEND_URL check pannunga.",
        logic_error: err.response?.data?.reason || err.message,
      });
    }
    setLoading(false);
  };

  const bg =
    result?.status === "Correct" ? "#dcfce7"
    : result?.status === "Not Auto-Gradable" ? "#fef9c3"
    : "#fee2e2";

  if (notFound) {
    return (
      <div className="loading">
        <h2>Question Not Found</h2>
        <p>Question ID : {id}</p>
        <button className="back" onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }
  if (!question) return <div className="loading">Loading...</div>;

  return (
    <div className="solve-page">
      <div className="solve-left">
        <div className="solve-topbar">
          <button className="back" onClick={() => navigate(-1)}>← Back</button>
          <span className="qid">#{question.id}</span>
        </div>
        <h1>{question.title}</h1>
        <div className="q-badges">
          <span className="b easy">{question.difficulty || question.diff}</span>
          <span className="b gray">{question.category || question.topic}</span>
        </div>
        <div className="card"><h3>Description</h3><p>{question.description}</p></div>
        <div className="sample-grid">
          <div className="sample"><h4>Sample Input</h4><code>{question.sample_input}</code></div>
          <div className="sample"><h4>Sample Output</h4><code>{question.sample_output}</code></div>
        </div>
        <div className="card dark"><h3>Constraints</h3><pre>{question.constraints}</pre></div>
        <div className="hint-box">
          <div className="hint-head" onClick={() => setHintShow(!hintShow)}>
            <span>💡 Hint</span><span>{hintShow ? "▲" : "▼"}</span>
          </div>
          {hintShow && <p>{question.hints}</p>}
        </div>
        {result && (
          <div style={{ marginTop: "20px", padding: "15px", borderRadius: "8px", background: bg, border: "1px solid #ccc" }}>
            <h3>
              {result.status === "Correct"
                ? `✅ Correct (${result.score}/10)`
                : result.status === "Not Auto-Gradable"
                ? "ℹ️ Not Auto-Gradable"
                : `❌ ${result.status} (${result.score}/10)`}
            </h3>
            <p>{result.reason}</p>
            {result.logic_error && <p>{result.logic_error}</p>}
          </div>
        )}
      </div>
      <div className="solve-right">
        <div className="editor-top">
          <h3>💻 Code Editor</h3>
          <button className="reset-btn" onClick={() => setCode(getStarter(question))}>Reset</button>
        </div>
        <textarea className="code-area" value={code} onChange={(e) => setCode(e.target.value)} />
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Checking..." : "Submit Answer"}
        </button>
      </div>
    </div>
  );
}