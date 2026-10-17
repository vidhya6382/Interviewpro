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
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState("");

  useEffect(() => {
    const decoded = decodeURIComponent(id || "");
    const q = allQuestions.find(x => x.title === decoded) || 
              allQuestions.find(x => x.title.toLowerCase() === decoded.toLowerCase()) ||
              allQuestions.find(x => String(x.id) === decoded);
    if (q) {
      setQuestion(q);
      setCode(q.starter_code);
    } else {
      setNotFound(true);
    }
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setConsoleOutput("");

    const fullCode = `
${code}

# --- Hidden Test Cases ---
import pandas as pd
import numpy as np
import sys
import traceback

def run_tests():
    try:
        result = solve()
        
        # Test 1: Return type
        if not isinstance(result, pd.DataFrame):
            return False, "Return Type Error", f"solve() must return a pandas DataFrame. You returned {type(result).__name__}.", ""
        
        # Test 2: Null check
        nullCount = result.isnull().sum().sum()
        if nullCount > 0:
            return False, "Wrong Answer - Null Values Found", f"Your DataFrame still has {nullCount} null values. Found: {result.isnull().sum().to_dict()}", result.to_string()
        
        # Test 3: Empty check
        if len(result) == 0:
            return False, "Wrong Answer - Empty Result", "Your DataFrame is empty after cleaning. Check dropna() logic.", ""
        
        return True, "Correct", "All test cases passed!", result.to_string()
        
    except SyntaxError as e:
        return False, "Syntax Error", f"Line {e.lineno}: {e.msg}", traceback.format_exc()
    except IndentationError as e:
        return False, "Indentation Error", f"Line {e.lineno}: {e.msg}", traceback.format_exc()
    except Exception as e:
        return False, "Runtime Error", f"{type(e).__name__}: {str(e)}", traceback.format_exc()

is_pass, status, message, out = run_tests()
print(f"__STATUS__:{status}")
print(f"__MESSAGE__:{message}")
print("__OUTPUT__START__")
print(out)
print("__OUTPUT__END__")
if not is_pass:
    print("__FAILED__")
else:
    print("__PASSED__")
`;

    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "python",
          version: "3.10.0",
          files: [{ content: fullCode }]
        })
      });

      const data = await res.json();
      const stdout = data.run?.stdout || data.run?.output || "";
      const stderr = data.run?.stderr || "";
      const fullOut = stdout + stderr;

      const statusMatch = fullOut.match(/__STATUS__:(.*)/);
      const msgMatch = fullOut.match(/__MESSAGE__:(.*)/);
      const outMatch = fullOut.match(/__OUTPUT__START__([\s\S]*?)__OUTPUT__END__/);
      
      const status = statusMatch ? statusMatch[1].trim() : "Error";
      const message = msgMatch ? msgMatch[1].trim() : "Unknown error";
      const testOut = outMatch ? outMatch[1].trim() : "";

      const combinedConsole = fullOut;
      setConsoleOutput(combinedConsole);

      if (fullOut.includes("__PASSED__")) {
        // ONLY WHEN CORRECT - 10/10
        setResult({
          status: "Correct",
          score: 10,
          reason: message,
          details: testOut
        });
      } else {
        // WRONG - 0/10 + mistake reason
        let score = 0;
        setResult({
          status: status,
          score: score,
          reason: message,
          details: testOut || stderr || "Check console for error details"
        });
      }

    } catch (e) {
      setResult({
        status: "Connection Error",
        score: 0,
        reason: "Failed to connect to judge. Please try again.",
        details: e.message
      });
    }
    setLoading(false);
  };

  if (notFound) {
    return <div style={{padding:'50px'}}><h2>Question Not Found</h2><p>ID: {id}</p><button onClick={()=>navigate(-1)}>← Back</button></div>;
  }
  if (!question) return <div className="loading">Loading...</div>;

  return (
    <div className="solve-page">
      <div className="solve-left">
        <div className="solve-topbar">
          <button className="back" onClick={()=>navigate(-1)}>← Back</button>
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
          <p><strong>Task:</strong> Implement <code>solve()</code> returning a DataFrame with 0 null values.</p>
        </div>

        {result && (
          <div style={{
            marginTop:'20px', 
            padding:'16px', 
            borderRadius:'8px', 
            background: result.status === 'Correct' ? '#dcfce7' : '#fee2e2',
            border: `1px solid ${result.status === 'Correct' ? '#16a34a' : '#dc2626'}`,
          }}>
            <h3 style={{margin:'0 0 8px 0', color: result.status === 'Correct' ? '#16a34a' : '#dc2626'}}>
              {result.status === 'Correct' ? `✅ Correct (${result.score}/10)` : `❌ ${result.status} (${result.score}/10)`}
            </h3>
            <p style={{margin:'8px 0', fontWeight:'600'}}>{result.reason}</p>
            {result.details && (
              <pre style={{background:'#1e293b', color:'#e2e8f0', padding:'12px', borderRadius:'6px', fontSize:'12px', overflow:'auto', marginTop:'10px', whiteSpace:'pre-wrap'}}>
                {result.details}
              </pre>
            )}
          </div>
        )}

        {consoleOutput && (
          <div className="card dark" style={{marginTop:'15px'}}>
            <h3>Console Output</h3>
            <pre style={{fontSize:'12px', whiteSpace:'pre-wrap', maxHeight:'200px', overflow:'auto'}}>{consoleOutput}</pre>
          </div>
        )}
      </div>

      <div className="solve-right">
        <div className="editor-top">
          <h3>💻 Code Editor</h3>
          <button className="reset-btn" onClick={()=>setCode(question.starter_code)}>Reset</button>
        </div>
        <textarea className="code-area" value={code} onChange={(e)=>setCode(e.target.value)} spellCheck={false} />
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Running Tests..." : "Submit & Verify"}
        </button>
      </div>
    </div>
  );
}