import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export async function POST(req: Request) {
  const { resume, role } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `Based on this resume: ${resume}
For the role: ${role}

Generate 5 interview questions specific to this resume, each with a strong sample answer the candidate can say. Reply ONLY in this exact JSON format, no extra text:
[{"question":"...","answer":"..."}]`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  let items = [];
  try {
    items = JSON.parse(text);
  } catch {
    items = [];
  }

  return NextResponse.json({ items });
}