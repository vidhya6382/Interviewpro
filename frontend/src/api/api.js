import axios from "axios";

const BACKEND_URL = "https://interviewpro-w38o.vercel.app";

const API = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" }
});

export const getQuestions = async () => ({ data: [] });
export const getQuestion = async () => { throw new Error("local"); };

export const submitCode = async (data) => {
  const res = await API.post("/api/submit", data);
  return res;
};

export const getMyProgress = async () => ({ data: [] });
export const getMe = async () => ({ data: {} });
export default API;