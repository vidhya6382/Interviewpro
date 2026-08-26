import { useState } from 'react';
import { requestPasswordReset } from '../api/authApi';
import './Auth.css';

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Enter your phone number or email.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await requestPasswordReset(identifier.trim());
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Forgot password</h2>
        <p className="auth-subtext">
          Enter the phone number or email on your account. If it matches, we'll email a reset link to the address on file.
        </p>

        {sent ? (
          <p style={{ color: '#16A34A', fontSize: 14, marginTop: 8 }}>
            ✓ If an account matches those details, a reset link has been sent to the email on file. Check your inbox.
          </p>
        ) : (
          <>
            <label>Phone number or email</label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="you@example.com or +91XXXXXXXXXX"
            />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          </>
        )}

        <p className="auth-switch">
          Remembered it? <a href="/login">Back to login</a>
        </p>
      </form>
    </div>
  );
}