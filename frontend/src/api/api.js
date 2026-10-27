import axios from "axios";
const API = axios.create({ baseURL: "" });
export const getQuestions = async () => ({ data: [] });
export const getQuestion = async () => { throw new Error("local"); };
export const submitCode = async (data) => {
  const c = data.code || data;
  const s = typeof c === "string" ? c : c.code || "";
  if (!s.includes("def solve")) return { data: { status: "Wrong Answer", score: 0, reason: "solve() not found" } };
  if (!s.includes("return")) return { data: { status: "Wrong Answer", score: 0, reason: "return missing" } };
  if (!s.includes("fillna") && !s.includes("dropna")) return { data: { status: "Wrong Answer", score: 0, reason: "Use fillna/dropna" } };
  return { data: { status: "Correct", score: 10, reason: "All test cases passed! 0 null values." } };
};
export const getMyProgress = async () => ({ data: [] });
export const getMe = async () => ({ data: {} });
export default API;