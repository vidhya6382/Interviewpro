import Navbar from '../components/Navbar.jsx';
import './CourseDetail.css';
import { useParams } from 'react-router-dom';

export default function CourseDetail(){
  const {id} = useParams();
  const title = id?.replace('-',' ').toUpperCase();

  return(
    <>
      <Navbar />
      <div className="role-detail-page">
        <h1>{title} Interview Preparation</h1>

        <div className="detail-grid-2">

          <div className="detail-card">
            <h3>📚 Technical Interview Questions</h3>
            <p>100+ Questions</p>
            <button>Open</button>
          </div>

          <div className="detail-card">
            <h3>💻 Coding Problems</h3>
            <div className="small-tags"><span>Easy</span><span>Medium</span><span>Hard</span></div>
            <button>Practice</button>
          </div>

          <div className="detail-card">
            <h3>📝 MCQ Quiz</h3>
            <div className="small-tags"><span>HTML</span><span>CSS</span><span>JavaScript</span><span>React</span><span>Python</span><span>SQL</span></div>
            <button>Start Quiz</button>
          </div>

          <div className="detail-card">
            <h3>👨💼 HR Interview</h3>
            <ul><li>Tell me about yourself</li><li>Strengths & Weaknesses</li><li>Behavioural Questions</li></ul>
            <button>Practice</button>
          </div>

          <div className="detail-card highlight">
            <h3>🎤 AI Mock Interview</h3>
            <p>Practice with AI and get feedback</p>
            <button className="ai-btn">Start AI Interview</button>
          </div>

          <div className="detail-card">
            <h3>📄 Resume Tips</h3>
            <ul><li>Resume Checklist</li><li>Projects</li><li>ATS Tips</li></ul>
            <button>View Tips</button>
          </div>

        </div>
      </div>
    </>
  )
}