import Navbar from '../components/Navbar.jsx';
import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home(){
  const navigate = useNavigate();

  return(
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-container">
          <div className="hero-left">
            <span className="badge">🐍 Master Python Coding Interviews with AI</span>
            <h1>Ace Your Python Interview <br/>with <span className="blue">AI</span></h1>
            <p className="sub">Learn • Practice • Mock Interview • Get Hired — Your complete Python interview prep platform.</p>
            <div className="search-box"><span>🔍</span><input placeholder="Search topics: Arrays, Strings, DP, Trees..." /></div>
            <div className="hero-btns">
              <button className="btn-primary" onClick={()=> navigate('/practice')}>🚀 Start Practicing</button>
              <button className="btn-secondary" onClick={()=> navigate('/mock-interview')}>🎯 AI Mock Interview</button>
            </div>
          </div>

          <div className="hero-right">
            <div className="robot-wrap">
              <img src="/home1.webp" alt="robot" />
              <div className="float f1">🐍 &lt;/&gt;</div>
              <div className="float f2">AI Mock Interview</div>
              <div className="float f3">Real-time Feedback</div>
              <div className="float f4">📊</div>
              <div className="float f5">🎤</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="section-head">
          <h2>Why Choose InterviewPro?</h2>
          <p>Everything you need to ace your Python coding interview</p>
        </div>
        <div className="features-grid">
          <div className="feature-card"><div className="f-icon">🤖</div><h4>AI Mock Interviews</h4><p>Camera-based Python coding interviews with real-time feedback</p></div>
          <div className="feature-card"><div className="f-icon">🐍</div><h4>Python DSA Roadmap</h4><p>Structured learning path from beginner to advanced Python</p></div>
          <div className="feature-card"><div className="f-icon">💻</div><h4>Topic-wise Practice</h4><p>100+ Python coding questions across arrays, strings, trees & more</p></div>
          <div className="feature-card"><div className="f-icon">📊</div><h4>Progress Tracking</h4><p>Track your Python practice score & interview readiness</p></div>
          <div className="feature-card"><div className="f-icon">🏢</div><h4>Company-wise Prep</h4><p>Python interview questions from Amazon, Google, Zoho, TCS</p></div>
          <div className="feature-card"><div className="f-icon">🏆</div><h4>Readiness Score</h4><p>AI-generated Python interview readiness score</p></div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-card">
          <h2>Ready to Ace Your Python Interview?</h2>
          <p>Join 10,000+ students who cracked their dream job with Python</p>
          <div className="cta-btns">
            <button onClick={()=> navigate('/practice')}>Start Practicing Free →</button>
            <button className="outline" onClick={()=> navigate('/mock-interview')}>Try AI Mock</button>
          </div>
        </div>
      </section>
    </>
  )
}