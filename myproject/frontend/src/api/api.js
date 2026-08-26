import axios from 'axios';

const API = axios.create({ baseURL: 'http://127.0.0.1:8000/api/' });
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Questions / Submit ---
export const getQuestions = () => API.get('questions/');
export const getQuestion = (slug) => API.get(`questions/${slug}/`);
export const submitCode = (data) => API.post('submit/', data);

// --- Dashboard (requires login) ---
export const getMyProgress = () => API.get('my-progress/');
export const getMe = () => API.get('auth/me/');

export default API;