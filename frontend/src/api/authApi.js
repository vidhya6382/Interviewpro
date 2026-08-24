const BASE_URL = '/api/auth';

async function request(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.error || data.message || Object.values(data)[0] || 'Something went wrong';
    throw new Error(Array.isArray(message) ? message[0] : message);
  }
  return data;
}

export const registerUser = (username, email, password, full_name, phone) =>
  request('/register/', { username, email, password, full_name, phone });

export const verifyOtp = (username, code) =>
  request('/verify-otp/', { username, code });

export const resendOtp = (username) =>
  request('/resend-otp/', { username });

export const loginUser = (username, password) =>
  request('/login/', { username, password });

export const googleLogin = (credential) =>
  request('/google/', { credential });

export const requestPasswordReset = (identifier) =>
  request('/password-reset/request/', { identifier });

export const confirmPasswordReset = (token, new_password) =>
  request('/password-reset/confirm/', { token, new_password });

export function saveTokens({ access, refresh }) {
  sessionStorage.setItem('access_token', access);
  sessionStorage.setItem('refresh_token', refresh);
}