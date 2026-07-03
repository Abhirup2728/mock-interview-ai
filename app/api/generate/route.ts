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
Return ONLY valid JSON: {"score": 75, "feedback": "short feedback", "missingPoints": ["p1","p2"]}`;
    const result = await model.generateContent(prompt);
    let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    let evalData = {};
    try { evalData = JSON.parse(text); } catch { evalData = {}; }
    return NextResponse.json(evalData);
  }

  const { resume, role, jobDesc, companyName } = body;
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  const prompt = `Resume: ${resume}
Role: ${role}
Job Description: ${jobDesc || "not provided"}
Company: ${companyName || "not provided"}

Return ONLY valid JSON, no extra text:
{
"items": [{"question":"...","answer":"..."}],
"matchScore": 75,
"missingKeywords": ["k1"],
"skillsToImprove": ["s1"],
"suggestions": ["tip1"],
"jdQuestions": [{"question":"...","answer":"..."}],
"starAnswers": [{"question":"...","situation":"...","task":"...","action":"...","result":"..."}],
"companyTips": ["tip1","tip2","tip3"],
"salaryTips": {"range": "e.g. 4-7 LPA for freshers in this role in India", "negotiationScript": "what to say when asked expected salary", "tips": ["tip1","tip2"]},
"confidenceTips": ["tip1","tip2","tip3"]
}

Generate: 5 general resume-based Q&A, match score, 5 missing keywords, 3 skills to improve, 3 suggestions, 5 jdQuestions (empty array if no JD given), 3 starAnswers (STAR format behavioral answers based on resume projects/experience), 3 companyTips (research/culture-fit tips - if company name given be specific, else general tips), salaryTips object with realistic Indian market range for a fresher in this role plus a negotiation script plus 2 tips, and 4 confidenceTips for speaking confidently and using good body language in interviews.`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
  let data = {};
  try { data = JSON.parse(text); } catch { data = {}; }
  return NextResponse.json(data);
}