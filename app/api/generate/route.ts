import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export async function POST(req: Request) {
  const { resume, role } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `Based on this resume: ${resume}
For the role: ${role}

Return ONLY valid JSON, no extra text, in this exact format:
{
  "items": [{"question":"...","answer":"..."}],
  "matchScore": 75,
  "missingKeywords": ["keyword1","keyword2"],
  "skillsToImprove": ["skill1","skill2"],
  "suggestions": ["tip1","tip2"]
}
Generate 5 questions with answers, a match score (0-100) for how well resume fits the role, 5 missing keywords recruiters look for, 3 skills to improve, and 3 suggestions to crack this role.`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  let data = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = {};
  }

  return NextResponse.json(data);
}