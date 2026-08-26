import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import './Auth.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', full_name: '', email: '', phone: '', password: '', confirm: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => {
    setForm(f => ({...f, [field]: e.target.value }));
    if (error) setError(''); // clear error while typing
  };

  const validate = () => {
    if (form.username.trim().length < 3) return 'Username must be at least 3 characters.';
    if (!form.full_name.trim()) return 'Enter your full name.';
    if (!EMAIL_RE.test(form.email.trim())) return 'Enter a valid email address.';

    // Don't trim password - spaces can be part of password, but check length
    if (!form.password) return 'Enter a password.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password!== form.confirm) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      console.log('Registering with:', form.username, form.email); // debug
      // MAKE SURE this order matches your authApi.js definition
      await registerUser(form.username, form.email, form.password, form.full_name, form.phone);
      navigate('/verify-otp', { state: { username: form.username.trim() } });
    } catch (err) {
      // backend errors like 400 Password too weak
      const msg = err.response?.data?.detail || err.response?.data?.message || err.message;
      setError(msg || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h2>Create your account</h2>
        <p className="auth-subtext">You'll log in with your username. Email is only used for verification & recovery.</p>

        <label>Username</label>
        <input type="text" value={form.username} onChange={update('username')} autoComplete="username" />

        <label>Full name</label>
        <input type="text" value={form.full_name} onChange={update('full_name')} autoComplete="name" />

        <label>Email (for verification & recovery)</label>
        <input type="email" value={form.email} onChange={update('email')} autoComplete="email" />

        <label>Phone number (optional)</label>
        <input type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" />

        <label>Password</label>
        <input type="password" value={form.password} onChange={update('password')} autoComplete="new-password" />

        <label>Confirm password</label>
        <input type="password" value={form.confirm} onChange={update('confirm')} autoComplete="new-password" />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting? 'Creating account…' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
}