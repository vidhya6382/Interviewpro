import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../api/authApi';
import './Auth.css';

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const username = state?.username;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!username) navigate('/register'); // no username in state -> came here directly, send back
    inputRef.current?.focus();
  }, [username, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Enter the 6-digit code.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await verifyOtp(username, code);
      // Verified — send them to the login page to sign in with their new account,
      // instead of auto-logging them in.
      navigate('/login', { state: { justVerified: true, username } });
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await resendOtp(username);
      setCooldown(60);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Verify your email</h2>
        <p className="auth-subtext">Enter the 6-digit code sent to the email on your account ({username})</p>

        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          style={{ letterSpacing: '6px', fontSize: 20, textAlign: 'center' }}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Verifying…' : 'Verify'}
        </button>

        <p className="auth-switch">
          Didn't get a code?{' '}
          <button type="button" className="link-btn" onClick={handleResend} disabled={cooldown > 0}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
        </p>
      </form>
    </div>
  );
}