import './MockInterviewCard.css';
import { useNavigate } from 'react-router-dom';

export default function MockInterviewCard(){
  const navigate = useNavigate();
  
  return(
    <div className="mock-card python-mock">
      <div className="mock-top">
        <h3>🐍 Python AI Mock Interview</h3>
        <span className="live-badge">15 Qs • LIVE</span>
      </div>
      
      <p>Python Core, Django, DRF, FastAPI & React - AI evaluated with instant feedback</p>
      
      <div className="mock-tags">
        <span>Python Core</span>
        <span>Django</span>
        <span>FastAPI</span>
        <span>React + SQL</span>
      </div>

      <div className="mock-actions">
        <button className="m1" onClick={()=> navigate('/role/fullstack/python/mock?type=voice')}>🎤 Start Voice Interview</button>
        <button className="m2" onClick={()=> navigate('/role/fullstack/python/mock?type=video')}>📹 Start Video Interview</button>
      </div>

      <div className="ai-feedback">
        <h4>🤖 AI Feedback (Sample - Python)</h4>
        <p>✅ Python Concepts: 80% | ✅ Django/DRF: 75% | ⚠ Project Explanation: Need improvement</p>
        <small>Tip: Explain GIL, decorators, Django ORM with real project example.</small>
      </div>
    </div>
  )
}