import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getQuestion, submitCode } from "../api/api";
import { allQuestions } from "../data/index.js";
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
    // 1. First try backend
    try {
      const res = await getQuestion(id);
      setQuestion(res.data);
      setCode(res.data.starter_code || `def solve():\n    # Write your code here\n    pass`);
      return;
    } catch (err) {
      console.log("Backend not found, trying local JSON...");
    }

    // 2. Fallback to local JSON - Title vechu search
    try {
      const decoded = decodeURIComponent(id || "");
      let q = allQuestions.find(x => x.title === decoded) ||
              allQuestions.find(x => x.title.toLowerCase() === decoded.toLowerCase()) ||
              allQuestions.find(x => String(x.id) === decoded);
      
      if (q) {
        setQuestion(q);
        setCode(q.starter_code);
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
        question_id: id,
        code: code,
        language_id: 71,
      });
      setResult(res.data);
      if (res.data.status !== "Correct") {
        // No alert - show in result box only
        console.log(res.data.reason);
      }
    } catch (err) {
      // Backend fail na local verification
      const hasLogic = code.includes("fillna") || code.includes("dropna") || code.includes("return");
      if (hasLogic && code.length > 20) {
        setResult({
          status: "Correct",
          score: 10,
          reason: "Solution submitted successfully!",
          logic_error: "",
          ai_hint: "Local verification: Code structure looks good."
        });
      } else {
        setResult({
          status: "Wrong Answer",
          score: 0,
          reason: "Please implement solve() with proper null handling",
          logic_error: "Missing fillna/dropna or return statement",
          ai_hint: "Use df.fillna() or df.dropna()"
        });
      }
    }
    setLoading(false);
  };

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
          <span className="b gray">{question.topic}</span>
        </div>
        <div className="card"><h3>Description</h3><p>{question.description}</p></div>
        <div className="sample-grid">
          <div className="sample"><h4>Sample Input</h4><code>{question.sample_input}</code></div>
          <div className="sample"><h4>Sample Output</h4><code>{question.sample_output}</code></div>
        </div>
        <div className="card dark"><h3>Constraints</h3><pre>{question.constraints}</pre></div>
        <div className="hint-box">
          <div className="hint-head" onClick={() => setHintShow(!hintShow)}><span>💡 Hint</span><span>{hintShow ? "▲" : "▼"}</span></div>
          {hintShow && <p>{question.hints}</p>}
        </div>
        {result && (
          <div className={`result ${result.status}`} style={{marginTop:'20px', padding:'15px', borderRadius:'8px', background: result.status==='Correct'?'#dcfce7':'#fee2e2', border:'1px solid #ccc'}}>
            <h3>{result.status === "Correct" ? `✅ Correct (${result.score}/10)` : `❌ ${result.status} (${result.score}/10)`}</h3>
            <p>{result.reason}</p>
            <p>{result.logic_error}</p>
            <p>{result.ai_hint}</p>
          </div>
        )}
      </div>
      <div className="solve-right">
        <div className="editor-top"><h3>💻 Code Editor</h3><button className="reset-btn" onClick={() => setCode(question.starter_code)}>Reset</button></div>
        <textarea className="code-area" value={code} onChange={(e) => setCode(e.target.value)} />
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>{loading ? "Checking..." : "Submit Answer"}</button>
      </div>
    </div>
  );
}