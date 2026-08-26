import Navbar from '../components/Navbar.jsx';
import './MockInterview.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getQuestion, submitCode } from '../api/api';

const CODING_SLUGS = [
  'two-sum', 'valid-parentheses', 'reverse-linked-list',
  'best-time-to-buy-and-sell-stock', 'valid-anagram',
  'merge-two-sorted-lists', 'climbing-stairs', 'maximum-subarray',
  'binary-search', 'lru-cache'
];

const STAGES = { INTRO: 'intro', RULES: 'rules', CODING: 'coding', RESULTS: 'results', TERMINATED: 'terminated' };
const TIME_PER_QUESTION = 5 * 60;
const MAX_VIOLATIONS = 3;
const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js-models/tiny_face_detector';
const LOCK_KEY = 'mock_interview_terminated';

const ConfettiBurst = () => {
  const colors = ['#F59E0B', '#16A34A', '#0EA5E9', '#EF4444', '#8B5CF6', '#EC4899'];
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 0.6,
    duration: 2.2 + Math.random() * 1.3, color: colors[i % colors.length],
    rotate: Math.random() * 360, size: 6 + Math.random() * 6
  }));
  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <span key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`, backgroundColor: p.color, width: p.size,
          height: p.size * 0.4, animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`, transform: `rotate(${p.rotate}deg)`
        }} />
      ))}
    </div>
  );
};

// Rules screen shown before camera turns on — candidate must agree
function RulesScreen({ onAgree }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="mock-domain-grid" style={{gridTemplateColumns:'480px', justifyContent:'center'}}>
      <div className="mock-domain-card" style={{borderTop:'4px solid #EF4444', padding:'28px', textAlign:'left'}}>
        <h3 style={{marginBottom:12}}>⚠ Proctoring Rules</h3>
        <ul style={{color:'#334155', lineHeight:1.8, paddingLeft:20, fontSize:14}}>
          <li>Your camera will stay on for the entire interview.</li>
          <li><strong>Do not look away from the screen</strong> — keep your face visible to the camera at all times.</li>
          <li>Do not switch tabs or minimize the window.</li>
          <li>Getting caught looking away or switching tabs counts as a <strong>violation</strong>.</li>
          <li><strong>3 violations</strong> will automatically end the interview.</li>
          <li>Once terminated, you <strong>cannot retake</strong> this interview.</li>
        </ul>
        <label style={{display:'flex', alignItems:'center', gap:8, marginTop:20, fontSize:14}}>
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
          I understand and agree to these rules
        </label>
        <button
          className="mock-card-btn"
          disabled={!checked}
          style={{background: checked ? '#0F172A' : '#94A3B8', marginTop:16, cursor: checked ? 'pointer' : 'not-allowed'}}
          onClick={onAgree}
        >
          I Agree — Turn On Camera & Start
        </button>
      </div>
    </div>
  );
}

// Webcam + face-api.js based "looking away" detection + tab-switch detection
function CameraWatch({ onViolation, paused }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [modelsReady, setModelsReady] = useState(false);
  const noFaceStreakRef = useRef(0); // consecutive missed detections
  const lastViolationRef = useRef(0); // debounce so one look-away = one violation

  // Load face-api models once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        if (!cancelled) setModelsReady(true);
      } catch (e) {
        console.error('Face model load failed', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Start camera
  useEffect(() => {
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError('Camera access denied');
      }
    })();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  // Periodic face-presence check
  useEffect(() => {
    if (!modelsReady || paused) return;
    const interval = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) return;
      try {
        const detection = await window.faceapi.detectSingleFace(
          videoRef.current,
          new window.faceapi.TinyFaceDetectorOptions()
        );
        if (!detection) {
          noFaceStreakRef.current += 1;
          // Face missing for ~3 consecutive checks (≈3s) = genuinely looking away
          if (noFaceStreakRef.current >= 3) {
            const now = Date.now();
            if (now - lastViolationRef.current > 4000) { // debounce 4s
              lastViolationRef.current = now;
              onViolation('Face not visible to camera');
            }
            noFaceStreakRef.current = 0;
          }
        } else {
          noFaceStreakRef.current = 0;
        }
      } catch (e) { /* ignore transient detection errors */ }
    }, 1000);
    return () => clearInterval(interval);
  }, [modelsReady, paused, onViolation]);

  // Tab-switch detection
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !paused) onViolation('Tab switched away');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [onViolation, paused]);

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, width: 150, zIndex: 20 }}>
      {error ? (
        <p style={{ fontSize: 11, color: '#EF4444', background: 'white', padding: 6, borderRadius: 6 }}>{error}</p>
      ) : (
        <>
          <video ref={videoRef} autoPlay muted playsInline
            style={{ width: '100%', borderRadius: 8, border: '2px solid #0F172A', display: 'block' }} />
          <span style={{ fontSize: 10, color: modelsReady ? '#16A34A' : '#F59E0B' }}>
            ● {modelsReady ? 'Watching' : 'Loading detector...'}
          </span>
        </>
      )}
    </div>
  );
}

export default function MockInterview(){
  const [stage, setStage] = useState(
    localStorage.getItem(LOCK_KEY) === 'true' ? STAGES.TERMINATED : STAGES.INTRO
  );
  const [codingQs, setCodingQs] = useState([]);
  const [cIndex, setCIndex] = useState(0);
  const [code, setCode] = useState('');
  const [codingResults, setCodingResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [violations, setViolations] = useState(0);
  const [warningMsg, setWarningMsg] = useState(null);

  const isLocked = stage === STAGES.TERMINATED;

  const loadCodingRound = async () => {
    setLoading(true);
    setStage(STAGES.CODING);
    try {
      const loaded = [];
      for (const slug of CODING_SLUGS) {
        try {
          const res = await getQuestion(slug);
          loaded.push(res.data);
        } catch (e) {
          console.warn(`Question not found: ${slug}`);
        }
      }
      if (loaded.length === 0) throw new Error('No questions loaded');
      setCodingQs(loaded);
      setCIndex(0);
      setCode(loaded[0]?.starter_code || 'def solve():\n pass');
      setCodingResults(Array(loaded.length).fill(null));
      setTimeLeft(TIME_PER_QUESTION);
    } catch (err) {
      console.error(err);
      alert('Unable to load interview questions. Please ensure backend is running.');
      setStage(STAGES.INTRO);
    }
    setLoading(false);
  };

  const submitCurrentCode = useCallback(async () => {
    setSubmitting(true);
    setLastResult(null);
    try {
      const q = codingQs[cIndex];
      const res = await submitCode({ question_id: q.id, code, language_id: 71 });
      setLastResult(res.data);
      setCodingResults(prev => {
        const updated = [...prev];
        updated[cIndex] = {
          title: q.title, status: res.data.status,
          score: res.data.score || 0, reason: res.data.reason
        };
        return updated;
      });
    } catch (err) {
      alert('Submission failed. Please check your connection.');
    }
    setSubmitting(false);
  }, [codingQs, cIndex, code]);

  const advance = () => {
    if (cIndex < codingQs.length - 1) {
      const next = cIndex + 1;
      setCIndex(next);
      setCode(codingQs[next]?.starter_code || 'def solve():\n pass');
      setLastResult(null);
      setTimeLeft(TIME_PER_QUESTION);
    } else {
      setStage(STAGES.RESULTS);
    }
  };

  // Handles a proctoring violation — terminates + locks after MAX_VIOLATIONS
  const handleViolation = useCallback((reason) => {
    setViolations(prev => {
      const next = prev + 1;
      if (next >= MAX_VIOLATIONS) {
        localStorage.setItem(LOCK_KEY, 'true');
        setStage(STAGES.TERMINATED);
      } else {
        setWarningMsg(`⚠ Warning ${next}/${MAX_VIOLATIONS}: ${reason}. ${MAX_VIOLATIONS - next} more will end your interview permanently.`);
        setTimeout(() => setWarningMsg(null), 5000);
      }
      return next;
    });
  }, []);

  // 5-min countdown per question
  useEffect(() => {
    if (stage !== STAGES.CODING || loading) return;
    if (timeLeft <= 0) {
      submitCurrentCode();
      setTimeout(() => advance(), 300);
      return;
    }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, stage, loading]);

  const nextCoding = () => {
    if (codingResults[cIndex]?.status !== 'Correct') {
      alert('Please solve the current problem correctly to proceed to the next one.');
      return;
    }
    advance();
  };

  const skipCoding = () => advance();

  const correctCount = codingResults.filter(r => r?.status === 'Correct').length;
  const isFullMarks = codingQs.length > 0 && correctCount === codingQs.length;
  const totalMarks = correctCount * 10;

  const mins = Math.floor(Math.max(timeLeft, 0) / 60);
  const secs = Math.max(timeLeft, 0) % 60;

  return(
    <>
      <Navbar />
      <div className="mock-page-v2">

        {stage === STAGES.TERMINATED && (
          <div className="mock-domain-grid" style={{gridTemplateColumns:'420px', justifyContent:'center'}}>
            <div className="mock-domain-card" style={{borderTop:'4px solid #EF4444', padding:'28px', textAlign:'center'}}>
              <h2 style={{color:'#EF4444'}}>Interview Terminated</h2>
              <p style={{color:'#64748B', marginTop:12}}>
                This interview was ended after repeated proctoring violations
                (looking away from camera / switching tabs). Retakes are not permitted for this session.
              </p>
            </div>
          </div>
        )}

        {stage === STAGES.INTRO && (
          <>
            <div className="mock-header-v2">
              <h1>Technical Coding Interview</h1>
              <p>10 Curated Problems • 5 Min per Question • Camera Proctored</p>
            </div>
            <div className="mock-domain-grid" style={{gridTemplateColumns:'380px', justifyContent:'center'}}>
              <div className="mock-domain-card" style={{borderTop:'4px solid #0F172A', padding:'24px'}}>
                <div className="mock-domain-top">
                  <div className="mock-domain-icon" style={{background:'#0F172A10'}}>💻</div>
                  <span className="mock-domain-role">Professional Assessment</span>
                </div>
                <h3>Python Coding Round</h3>
                <p style={{color:'#64748B', margin:'8px 0 16px'}}>
                  {CODING_SLUGS.length} problems, 5 minutes each. Camera-proctored with face monitoring.
                </p>
                <div className="mock-domain-tags">
                  <span>DSA</span><span>Timed</span><span>Proctored</span>
                </div>
                <button className="mock-card-btn" style={{background:'#0F172A', marginTop:'16px'}} onClick={() => setStage(STAGES.RULES)}>
                  Start Interview →
                </button>
              </div>
            </div>
          </>
        )}

        {stage === STAGES.RULES && (
          <RulesScreen onAgree={loadCodingRound} />
        )}

        {stage === STAGES.CODING && (
          <div className="mock-running">
            <CameraWatch onViolation={handleViolation} paused={loading} />
            {loading && <p style={{padding:24}}>Preparing your interview...</p>}
            {!loading && codingQs.length > 0 && (
              <div className="mock-right" style={{margin:'0 auto', maxWidth:'900px'}}>
                <div className="question-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span className="q-label">Question {cIndex+1} of {codingQs.length}</span>
                  <span style={{
                    fontWeight:700, fontSize:15,
                    color: timeLeft <= 30 ? '#EF4444' : '#0F172A'
                  }}>
                    ⏱ {mins}:{secs.toString().padStart(2,'0')}
                  </span>
                  <span className="q-difficulty medium">{codingResults[cIndex]?.status || 'Not Attempted'}</span>
                </div>

                {warningMsg && (
                  <div style={{marginTop:10, padding:'10px 14px', borderRadius:8, background:'#FEF2F2', border:'1px solid #EF4444', color:'#991B1B', fontSize:13, fontWeight:600}}>
                    {warningMsg}
                  </div>
                )}

                <h2 className="question-text" style={{marginTop:8}}>{codingQs[cIndex].title}</h2>
                <div style={{background:'#F8FAFC', border:'1px solid #E2E8F0', padding:'16px', borderRadius:'10px', whiteSpace:'pre-wrap', lineHeight:'1.6'}}>
                  {codingQs[cIndex].description}
                </div>

                <div style={{marginTop:20}}>
                  <label style={{fontWeight:600, fontSize:14}}>Your Solution (Python)</label>
                  <textarea
                    style={{fontFamily:'JetBrains Mono, monospace', minHeight:'320px', width:'100%', marginTop:8, padding:12, borderRadius:'8px', border:'1px solid #CBD5E1'}}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    spellCheck={false}
                  />
                </div>

                {lastResult && (
                  <div style={{
                    marginTop:16, padding:'14px 16px', borderRadius:'10px',
                    background: lastResult.status === 'Correct'? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${lastResult.status === 'Correct'? '#16A34A' : '#EF4444'}`
                  }}>
                    <strong>{lastResult.status === 'Correct'? '✓ All Test Cases Passed' : `✕ ${lastResult.status}`}</strong>
                    <pre style={{whiteSpace:'pre-wrap', fontSize:'13px', marginTop:6, color:'#334155'}}>{lastResult.reason || ''}</pre>
                  </div>
                )}

                <div className="mock-btns" style={{marginTop:20, display:'flex', gap:12}}>
                  <button onClick={submitCurrentCode} disabled={submitting} style={{background:'#0F172A', color:'white', padding:'10px 18px', borderRadius:'8px', border:'none'}}>
                    {submitting? 'Evaluating...' : 'Submit Solution'}
                  </button>
                  <button onClick={nextCoding} className="next" style={{padding:'10px 18px', borderRadius:'8px'}}>
                    {cIndex < codingQs.length - 1? 'Next Problem →' : 'Complete Interview'}
                  </button>
                  <button onClick={skipCoding} style={{background:'transparent', border:'1px solid #E2E8F0', padding:'10px 18px', borderRadius:'8px'}}>
                    Skip
                  </button>
                </div>

                <p style={{marginTop:12, fontSize:12, color: violations > 0 ? '#EF4444' : '#94A3B8'}}>
                  Violations: {violations} / {MAX_VIOLATIONS}
                </p>
              </div>
            )}
          </div>
        )}

        {stage === STAGES.RESULTS && (
          <div className="mock-running">
            {isFullMarks && <ConfettiBurst />}
            <div className="mock-right" style={{margin:'0 auto', maxWidth:'650px', textAlign:'center', position:'relative'}}>
              <h2>Interview Summary</h2>

              {isFullMarks && (
                <div style={{
                  margin:'16px auto 8px', display:'inline-block', padding:'8px 20px',
                  borderRadius:'999px', background:'linear-gradient(90deg,#F59E0B,#EF4444)',
                  color:'white', fontWeight:700, fontSize:15
                }}>
                  🏆 Full Marks!
                </div>
              )}

              <h1 style={{fontSize:'56px', margin:'12px 0'}}>{correctCount} / {codingQs.length}</h1>
              <p style={{color:'#64748B', fontSize:15}}>Total Marks: <strong>{totalMarks} / 100</strong></p>
              <p style={{color:'#64748B'}}>
                {isFullMarks ? 'Perfect score — every problem solved correctly!' : 'Problems Solved Successfully'}
              </p>

              <div style={{textAlign:'left', marginTop:32, background:'white', border:'1px solid #E2E8F0', borderRadius:'12px', padding:'16px'}}>
                {codingQs.map((q,i) => (
                  <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #F1F5F9'}}>
                    <span>{i+1}. {q.title}</span>
                    <span style={{fontWeight:600, color: codingResults[i]?.status === 'Correct'? '#16A34A' : '#EF4444'}}>
                      {codingResults[i]?.status === 'Correct'? 'Solved (+10)' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>

              <button className="mock-card-btn" style={{background:'#0F172A', marginTop:24}} onClick={() => setStage(STAGES.INTRO)}>
                Retake Interview
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}