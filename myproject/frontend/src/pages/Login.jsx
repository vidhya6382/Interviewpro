import Navbar from '../components/Navbar.jsx';
import './Login.css';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, saveTokens, googleLogin } from '../api/authApi';

export default function Login(){
  const location = useLocation();
  const justVerified = location.state?.justVerified;
  const prefillUsername = location.state?.username || '';

  const [form, setForm] = useState({ username: prefillUsername, password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await loginUser(form.username, form.password);
      saveTokens(data.tokens);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      const data = await googleLogin(credentialResponse.credential);
      saveTokens(data.tokens);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return(
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-left">
          <div className="login-branding">
            <h1>Ace Your Dream Job with <span>AI</span></h1>
            <p>Join 10K+ students who cracked interviews with InterviewPro</p>
            <div className="login-stats">
              <div><h3>1200+</h3><p>Questions</p></div>
              <div><h3>50+</h3><p>Courses</p></div>
              <div><h3>10K+</h3><p>Students</p></div>
            </div>
            <img src="/home1.webp" alt="robot" className="login-robot" />
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <h2>Welcome Back</h2>
            <p className="login-sub">Login to continue your preparation</p>

            {justVerified && (
              <p style={{ color: '#16A34A', fontSize: 13, background: '#F0FDF4', border: '1px solid #16A34A', borderRadius: 8, padding: '8px 12px', marginTop: 8 }}>
                ✓ Account verified — log in to continue.
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Username</label>
                <input type="text" placeholder="your_username" required
                  value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>

              <Link to="/forgot-password" className="forgot">Forgot password?</Link>

              {error && <p style={{ color: '#EF4444', fontSize: 13, marginTop: 8 }}>{error}</p>}

              <button type="submit" className="login-btn" disabled={submitting}>
                {submitting ? 'Logging in…' : '🔐 Login'}
              </button>
            </form>

            <div className="divider"><span>or</span></div>

            <div className="social-btns" style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login failed. Please try again.')}
              />
            </div>

            <p className="switch-text">
              Don't have an account?{' '}
              <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}