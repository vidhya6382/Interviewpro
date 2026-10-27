import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL || "https://interviewpro-w38o-9jz20lm0r-vidhyas-projects-b8042b5b.vercel.app";

const API = axios.create({ baseURL: BACKEND_URL });

export const getQuestions = async () => ({ data: [] });
export const getQuestion = async () => { throw new Error("local"); };

export const submitCode = async (data) => {
  // REAL BACKEND CALL - 100% execution!
  const res = await API.post("/api/submit/", data);
  return res;
};

export const getMyProgress = async () => ({ data: [] });
export const getMe = async () => ({ data: {} });
export default API;