import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { allQuestions } from "../data/index.js";
import "./Solve.css";

export default function Solve() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [hintShow, setHintShow] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const decodedTitle = decodeURIComponent(id || "");
    // Title vechu search panrom
    let q = allQuestions.find(x => x.title === decodedTitle) 
         || allQuestions.find(x => x.title.toLowerCase() === decodedTitle.toLowerCase())
         || allQuestions.find(x => String(x.id) === decodedTitle);
    
    if (q) {
      setQuestion(q);
      setCode(q.starter_code);
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div style={{padding:'50px'}}>
        <h2>Question Not Found</h2>
        <p>Question ID : {id}</p>
        <p>Available: {allQuestions.length} questions</p>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  if (!question) return <div style={{padding:'50px'}}>Loading...</div>;

  return (
    <div className="solve-page">
      <div className="solve-left">
        <div className="solve-topbar">
          <button className="back" onClick={() => navigate(-1)}>← Back</button>
          <span className="qid">#{question.id}</span>
        </div>
        <h1>{question.title}</h1>
        <div className="q-badges">
          <span className="b easy">{question.difficulty}</span>
          <span className="b gray">{question.topic}</span>
          <span className="b gray">{question.company_tags}</span>
        </div>
        <div className="card">
          <h3>Description</h3>
          <p>{question.description}</p>
        </div>
        <div className="sample-grid">
          <div className="sample"><h4>Sample Input</h4><code>{question.sample_input}</code></div>
          <div className="sample"><h4>Sample Output</h4><code>{question.sample_output}</code></div>
        </div>
        <div className="card dark"><h3>Constraints</h3><pre>{question.constraints}</pre></div>
        <div className="hint-box">
          <div className="hint-head" onClick={() => setHintShow(!hintShow)}><span>💡 Hint</span><span>{hintShow ? "▲" : "▼"}</span></div>
          {hintShow && <p>{question.hints}</p>}
        </div>
      </div>
      <div className="solve-right">
        <div className="editor-top">
          <h3>💻 Code Editor</h3>
          <button className="reset-btn" onClick={() => setCode(question.starter_code)}>Reset</button>
        </div>
        <textarea className="code-area" value={code} onChange={(e) => setCode(e.target.value)} />
        <button className="submit-btn" onClick={() => alert('Local mode: Code saved! Backend connect pannuna auto-check pannalam')}>Submit Answer</button>
      </div>
    </div>
  );
}