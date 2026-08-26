import Navbar from '../components/Navbar.jsx';
import './RoleFullStack.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getQuestions } from '../api/api';

export default function Practice(){
  const { stack } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getQuestions(stack || 'python')
    .then(res => setQuestions(res.data || []))
    .catch(() => setError(true))
    .finally(() => setLoading(false));
  }, [stack]);

  const filtered = questions.filter(q =>
    (q.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const easyCount = questions.filter(q => q.difficulty === 'Easy').length;
  const medCount = questions.filter(q => q.difficulty === 'Medium').length;
  const hardCount = questions.filter(q => q.difficulty === 'Hard').length;

  return(
    <>
      <Navbar />
      <div className="fs-page">
        <div className="fs-header" style={{borderLeft:`5px solid #16A34A`}}>
          <h1>🐍 Python Interview Platform</h1>
          <p>{questions.length}+ Auto-Verified Coding Qs • Real Companies • Topic-wise</p>
        </div>

        <div className="practice-pro">
          <div className="pro-header">
            <div>
              <h3>Practice Questions</h3>
              <p>{questions.length}+ Real coding questions with verified test cases</p>
            </div>
            <div className="pro-search">
              <input placeholder="Search questions, topic, company..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
          </div>

          {loading && <p style={{padding:'20px'}}>Loading questions...</p>}
          {error && <p style={{padding:'20px', color:'red'}}>Could not load questions from the server.</p>}

          {!loading &&!error && (
            <>
              <div className="pro-badges">
                <span className="badge easy">Easy {easyCount}</span>
                <span className="badge medium">Medium {medCount}</span>
                <span className="badge hard">Hard {hardCount}</span>
                <span className="badge total">Total {filtered.length} / {questions.length}</span>
              </div>

              <div className="pro-list">
                {filtered.map((q, idx)=>(
                  <div key={q.id || q.slug || idx} className="pro-row">
                    <div className="pro-left">
                      <div className="pro-num">{String(idx+1).padStart(3,'0')}</div>
                      <div className="pro-info">
                        <h4>{q.title}</h4>
                        <div className="pro-meta">
                          <span className="meta-pill topic">{q.topic}</span>
                          <span className="meta-pill company">{q.company_tags}</span>
                          <span className={`meta-pill diff-${(q.difficulty||'').toLowerCase()}`}>{q.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <button className="pro-solve" onClick={()=> navigate(`/solve/${q.slug}`)}>Solve →</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}