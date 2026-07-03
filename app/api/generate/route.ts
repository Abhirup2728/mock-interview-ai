import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

export async function POST(req: Request) {
  const body = await req.json();

  if (body.action === "evaluate") {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `Question: ${body.question}
Ideal Answer: ${body.idealAnswer}
Candidate's Spoken Answer: ${body.userAnswer}

Return ONLY valid JSON, no extra text:
{"score": 75, "feedback": "short feedback", "missingPoints": ["point1","point2"]}`;
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    let evalData = {};
    try { evalData = JSON.parse(text); } catch { evalData = {}; }
    return NextResponse.json(evalData);
  }

  const { resume, role, jobDesc } = body;
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  const prompt = `Resume: ${resume}
Role: ${role}
Job Description: ${jobDesc || "not provided"}

Return ONLY valid JSON, no extra text:
{"items": [{"question":"...","answer":"..."}],"matchScore": 75,"missingKeywords": ["k1"],"skillsToImprove": ["s1"],"suggestions": ["tip1"],"jdQuestions": [{"question":"...","answer":"..."}]}

Generate 5 general resume-based questions with answers, match score, 5 missing keywords, 3 skills to improve, 3 suggestions. Also generate 5 jdQuestions specifically based on the job description (skip if no job description given, then jdQuestions can be empty array).`;
  const result = await model.generateContent(prompt);
  let text = result.response.text();
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();
  let data = {};
  try { data = JSON.parse(text); } catch { data = {}; }
  return NextResponse.json(data);
}