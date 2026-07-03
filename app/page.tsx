"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [role, setRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const recognitionRef = useRef<any>(null);

  async function handleGenerate() {
    setLoading(true);
    setData(null);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ resume, role, jobDesc, companyName }),
    });
    const result = await res.json();
    setData(result);
    setLoading(false);
  }

  function speak(text: string) {
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  }

  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice not supported in this browser. Use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (e: any) => setTranscript(e.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  function startVoiceInterview() {
    setVoiceMode(true);
    setCurrentQ(0);
    setTranscript("");
    setEvalResult(null);
    if (data?.items?.[0]) speak(data.items[0].question);
  }

  async function evaluateAnswer() {
    setEvaluating(true);
    const q = data.items[currentQ];
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ action: "evaluate", question: q.question, idealAnswer: q.answer, userAnswer: transcript }),
    });
    const result = await res.json();
    setEvalResult(result);
    setEvaluating(false);
  }

  function nextQuestion() {
    const next = currentQ + 1;
    if (data?.items?.[next]) {
      setCurrentQ(next);
      setTranscript("");
      setEvalResult(null);
      speak(data.items[next].question);
    } else {
      setVoiceMode(false);
      alert("Interview complete!");
    }
  }

  const cardStyle = { background: "#1e293b", padding: 20, borderRadius: 12, marginBottom: 20 };
  const tagStyle = (bg: string, color: string) => ({ background: bg, color, padding: "4px 10px", borderRadius: 20, fontSize: 13 });

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: "20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", fontFamily: "sans-serif" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 28 }}>🎯</div>
            <h1 style={{ color: "#fff", fontSize: 24, margin: 0 }}>AI Mock Interview — 360° Prep</h1>
          </div>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Developed by - Abhirup Gumtya</p>
        </div>

        {!voiceMode && (
          <>
            <div style={cardStyle}>
              <textarea placeholder="Paste your resume text here" value={resume} onChange={(e) => setResume(e.target.value)} rows={6} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", marginBottom: 12 }} />
              <input placeholder="Target job role" value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", marginBottom: 12 }} />
              <input placeholder="Company name (optional)" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", marginBottom: 12 }} />
              <textarea placeholder="Paste full job description here (optional)" value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} rows={4} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", marginBottom: 12 }} />
              <button onClick={handleGenerate} disabled={loading} style={{ width: "100%", padding: 12, borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                {loading ? "Analyzing..." : "Generate Full Prep Kit"}
              </button>
            </div>

            {data?.matchScore !== undefined && (
              <div style={cardStyle}>
                <p style={{ color: "#818cf8", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Resume Match Score: {data.matchScore}%</p>
                {data.missingKeywords && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ color: "#fbbf24", fontWeight: 600, marginBottom: 6 }}>Missing Keywords</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {data.missingKeywords.map((k: string, i: number) => <span key={i} style={tagStyle("#422006", "#fbbf24")}>{k}</span>)}
                    </div>
                  </div>
                )}
                {data.skillsToImprove && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ color: "#f87171", fontWeight: 600, marginBottom: 6 }}>Skills to Improve</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {data.skillsToImprove.map((k: string, i: number) => <span key={i} style={tagStyle("#450a0a", "#f87171")}>{k}</span>)}
                    </div>
                  </div>
                )}
                {data.suggestions && (
                  <div>
                    <p style={{ color: "#4ade80", fontWeight: 600, marginBottom: 6 }}>Suggestions to Crack This Role</p>
                    {data.suggestions.map((s: string, i: number) => <p key={i} style={{ color: "#e2e8f0", fontSize: 14, marginBottom: 4 }}>✓ {s}</p>)}
                  </div>
                )}
              </div>
            )}

            {data?.companyTips?.length > 0 && (
              <div style={cardStyle}>
                <h2 style={{ color: "#38bdf8", fontSize: 18, marginBottom: 12 }}>🏢 Company Research & Culture Fit</h2>
                {data.companyTips.map((t: string, i: number) => <p key={i} style={{ color: "#e2e8f0", fontSize: 14, marginBottom: 6 }}>• {t}</p>)}
              </div>
            )}

            {data?.salaryTips && (
              <div style={cardStyle}>
                <h2 style={{ color: "#a78bfa", fontSize: 18, marginBottom: 12 }}>💰 Salary Negotiation Guidance</h2>
                <p style={{ color: "#fff", fontWeight: 600, marginBottom: 8 }}>Expected Range: {data.salaryTips.range}</p>
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>What to say when asked expected salary:</p>
                <p style={{ color: "#e2e8f0", fontStyle: "italic", marginBottom: 10, background: "#0f172a", padding: 10, borderRadius: 8 }}>"{data.salaryTips.negotiationScript}"</p>
                {data.salaryTips.tips?.map((t: string, i: number) => <p key={i} style={{ color: "#e2e8f0", fontSize: 14, marginBottom: 4 }}>• {t}</p>)}
              </div>
            )}

            {data?.starAnswers?.length > 0 && (
              <div style={cardStyle}>
                <h2 style={{ color: "#fb923c", fontSize: 18, marginBottom: 12 }}>⭐ STAR Method Behavioral Answers</h2>
                {data.starAnswers.map((s: any, i: number) => (
                  <div key={i} style={{ background: "#0f172a", padding: 14, borderRadius: 8, marginBottom: 12 }}>
                    <p style={{ color: "#fb923c", fontWeight: 600, marginBottom: 8 }}>{s.question}</p>
                    <p style={{ color: "#94a3b8", fontSize: 13 }}><b style={{ color: "#e2e8f0" }}>Situation:</b> {s.situation}</p>
                    <p style={{ color: "#94a3b8", fontSize: 13 }}><b style={{ color: "#e2e8f0" }}>Task:</b> {s.task}</p>
                    <p style={{ color: "#94a3b8", fontSize: 13 }}><b style={{ color: "#e2e8f0" }}>Action:</b> {s.action}</p>
                    <p style={{ color: "#94a3b8", fontSize: 13 }}><b style={{ color: "#e2e8f0" }}>Result:</b> {s.result}</p>
                  </div>
                ))}
              </div>
            )}

            {data?.confidenceTips?.length > 0 && (
              <div style={cardStyle}>
                <h2 style={{ color: "#f472b6", fontSize: 18, marginBottom: 12 }}>💪 Confidence & Body Language Tips</h2>
                {data.confidenceTips.map((t: string, i: number) => <p key={i} style={{ color: "#e2e8f0", fontSize: 14, marginBottom: 6 }}>• {t}</p>)}
              </div>
            )}

            {data?.items?.length > 0 && (
              <button onClick={startVoiceInterview} style={{ width: "100%", padding: 14, borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontWeight: 600, cursor: "pointer", marginBottom: 20 }}>
                🎤 Start Voice Mock Interview
              </button>
            )}

            {data?.items?.length > 0 && (
              <button onClick={() => window.print()} style={{ width: "100%", padding: 14, borderRadius: 8, border: "1px solid #6366f1", background: "transparent", color: "#6366f1", fontWeight: 600, cursor: "pointer", marginBottom: 20 }}>
                📄 Download Full Prep Report (PDF)
              </button>
            )}

            {data?.items?.map((item: any, i: number) => (
              <div key={i} style={cardStyle}>
                <p style={{ color: "#818cf8", fontWeight: 600, marginBottom: 8 }}>Q{i + 1}: {item.question}</p>
                <p style={{ color: "#e2e8f0" }}>{item.answer}</p>
              </div>
            ))}

            {data?.jdQuestions?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h2 style={{ color: "#fbbf24", fontSize: 18, marginBottom: 12 }}>📌 Probable Questions Based on Job Description</h2>
                {data.jdQuestions.map((item: any, i: number) => (
                  <div key={i} style={{ ...cardStyle, border: "1px solid #fbbf24" }}>
                    <p style={{ color: "#fbbf24", fontWeight: 600, marginBottom: 8 }}>Q{i + 1}: {item.question}</p>
                    <p style={{ color: "#e2e8f0" }}>{item.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {voiceMode && data?.items?.[currentQ] && (
          <div style={{ background: "#1e293b", padding: 30, borderRadius: 12, textAlign: "center" }}>
            <p style={{ color: "#64748b", marginBottom: 8 }}>Question {currentQ + 1} of {data.items.length}</p>
            <p style={{ color: "#fff", fontSize: 20, fontWeight: 600, marginBottom: 20 }}>{data.items[currentQ].question}</p>
            <button onClick={startListening} style={{ padding: "14px 28px", borderRadius: 50, border: "none", background: listening ? "#dc2626" : "#6366f1", color: "#fff", fontWeight: 600, cursor: "pointer", marginBottom: 20 }}>
              {listening ? "🔴 Listening..." : "🎙️ Tap to Answer"}
            </button>
            {transcript && (
              <div style={{ background: "#0f172a", padding: 16, borderRadius: 8, marginBottom: 20, textAlign: "left" }}>
                <p style={{ color: "#64748b", fontSize: 13, marginBottom: 6 }}>Your Answer:</p>
                <p style={{ color: "#e2e8f0" }}>{transcript}</p>
                <button onClick={evaluateAnswer} disabled={evaluating} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, border: "none", background: "#f59e0b", color: "#000", fontWeight: 600, cursor: "pointer" }}>
                  {evaluating ? "Evaluating..." : "✓ Evaluate My Answer"}
                </button>
              </div>
            )}
            {evalResult?.score !== undefined && (
              <div style={{ background: "#0f172a", padding: 16, borderRadius: 8, marginBottom: 20, textAlign: "left", border: "1px solid #f59e0b" }}>
                <p style={{ color: "#f59e0b", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Answer Score: {evalResult.score}%</p>
                <p style={{ color: "#e2e8f0", marginBottom: 10 }}>{evalResult.feedback}</p>
                {evalResult.missingPoints?.length > 0 && (
                  <>
                    <p style={{ color: "#fbbf24", fontWeight: 600, marginBottom: 6 }}>You should also mention:</p>
                    {evalResult.missingPoints.map((p: string, i: number) => <p key={i} style={{ color: "#cbd5e1", fontSize: 14 }}>• {p}</p>)}
                  </>
                )}
              </div>
            )}
            {data.items[currentQ].answer && (
              <div style={{ background: "#0f172a", padding: 16, borderRadius: 8, marginBottom: 20, textAlign: "left" }}>
                <p style={{ color: "#4ade80", fontSize: 13, marginBottom: 6 }}>Ideal Answer:</p>
                <p style={{ color: "#e2e8f0" }}>{data.items[currentQ].answer}</p>
              </div>
            )}
            <button onClick={nextQuestion} style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: "#16a34a", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
              Next Question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}