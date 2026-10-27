import axios from 'axios';

const api = axios.create({
  baseURL: '',
});

export const submitCode = async (code) => {
  const res = await axios.post('/api/submit/', { code });
  return res.data;
};

export default api;