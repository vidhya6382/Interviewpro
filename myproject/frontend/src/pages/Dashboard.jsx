import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getMyProgress, getMe } from '../api/api';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [expandedSlug, setExpandedSlug] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([getMe(), getMyProgress()])
      .then(([meRes, progressRes]) => {
        setUser(meRes.data);
        setProgress(progressRes.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
          navigate('/login');
        } else {
          setError('Could not load your dashboard. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 40 }}>Loading your dashboard…</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 40, color: '#EF4444' }}>{error}</div>
      </>
    );
  }

  const { solved_count, total_questions, questions } = progress;
  const percent = total_questions > 0 ? Math.round((solved_count / total_questions) * 100) : 0;

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.full_name || user?.username}</h1>
          <p className="dashboard-sub">Here's your practice progress so far.</p>
        </div>

        <div className="dashboard-summary">
          <div className="summary-card">
            <h2>{solved_count} / {total_questions}</h2>
            <p>Problems solved</p>
          </div>
          <div className="summary-card">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
            </div>
            <p>{percent}% complete</p>
          </div>
        </div>

        <div className="dashboard-list">
          {questions.map((q) => (
            <div key={q.id} className={`dashboard-row ${q.solved ? 'solved' : ''}`}>
              <div className="dashboard-row-main" onClick={() => q.last_code && setExpandedSlug(expandedSlug === q.slug ? null : q.slug)}>
                <span className="dashboard-tick">{q.solved ? '✅' : '⬜'}</span>
                <span className="dashboard-title">{q.title}</span>
                <span className={`dashboard-difficulty diff-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                {q.last_status && !q.solved && (
                  <span className="dashboard-attempted">Attempted</span>
                )}
                {q.last_code && (
                  <span className="dashboard-expand-hint">{expandedSlug === q.slug ? 'Hide' : 'View'} my last answer ▾</span>
                )}
              </div>

              {expandedSlug === q.slug && q.last_code && (
                <pre className="dashboard-code-preview">{q.last_code}</pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}