import { GoogleGenerativeAI } from "@google/generative-ai";

//1. init the google client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//2. select model
// Try the latest stable Flash model
export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});
