import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset } from '../api/authApi';
import './Auth.css';

export default function ResetPasswordConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('This reset link is missing or invalid. Request a new one.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await confirmPasswordReset(token, form.password);
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Set a new password</h2>

        {done ? (
          <p style={{ color: '#16A34A', fontSize: 14 }}>
            ✓ Password updated. Redirecting to login…
          </p>
        ) : !token ? (
          <p className="auth-error">This reset link is missing or invalid. Please request a new one from the login page.</p>
        ) : (
          <>
            <label>New password</label>
            <input type="password" value={form.password} onChange={update('password')} autoComplete="new-password" />

            <label>Confirm new password</label>
            <input type="password" value={form.confirm} onChange={update('confirm')} autoComplete="new-password" />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={submitting}>
              {submitting ? 'Updating…' : 'Update password'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}