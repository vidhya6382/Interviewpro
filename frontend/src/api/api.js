import axios from 'axios';

const api = axios.create({
  baseURL: 'https://interviewpro-co22-b7c3129-vidhyas-projects-b8042b5b.vercel.app/api',
});

export const submitCode = async (code) => {
  const res = await api.post('/submit/', { code });
  return res.data;
};

export default api;