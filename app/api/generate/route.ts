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
{"score": 75, "feedback": "short feedback", "missingPoints": ["point1","point2"]}
Score 0-100 based on how close the candidate's answer is to the ideal answer in content and completeness. Give short feedback and 2-3 missing points they should add.`;
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    let evalData = {};
    try { evalData = JSON.parse(text); } catch { evalData = {}; }
    return NextResponse.json(evalData);
  }

  const { resume, role } = body;
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  const prompt = `Based on this resume: ${resume}
For the role: ${role}
Return ONLY valid JSON, no extra text:
{"items": [{"question":"...","answer":"..."}],"matchScore": 75,"missingKeywords": ["keyword1"],"skillsToImprove": ["skill1"],"suggestions": ["tip1"]}
Generate 5 questions with answers, match score, 5 missing keywords, 3 skills to improve, 3 suggestions.`;
  const result = await model.generateContent(prompt);
  let text = result.response.text();
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();
  let data = {};
  try { data = JSON.parse(text); } catch { data = {}; }
  return NextResponse.json(data);
}