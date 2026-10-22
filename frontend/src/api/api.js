import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const submitCode = async (code) => {
  const res = await api.post('/submit/', { code });
  return res.data;
};

export default api;