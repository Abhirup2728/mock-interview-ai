import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export async function POST(req: Request) {
  const { resume, role } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `You are an interviewer. Based on this resume: ${resume} for the role: ${role}, generate 5 interview questions.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return NextResponse.json({ questions: text });
}