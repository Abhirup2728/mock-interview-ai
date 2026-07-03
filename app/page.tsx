"use client";
import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [role, setRole] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setData(null);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ resume, role }),
    });
    const result = await res.json();
    setData(result);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: "20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", fontFamily: "sans-serif" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 28 }}>🎯</div>
            <h1 style={{ color: "#fff", fontSize: 24, margin: 0 }}>AI Mock Interview</h1>
          </div>
          <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Developed by - Abhirup Gumtya</p>
        </div>

        <p style={{ color: "#94a3b8", marginBottom: 24 }}>Paste your resume, get real interview Q&A + resume analysis</p>

        <div style={{ background: "#1e293b", padding: 20, borderRadius: 12, marginBottom: 20 }}>
          <textarea
            placeholder="Paste your resume text here"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={6}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", marginBottom: 12 }}
          />
          <input
            placeholder="Target job role (e.g. Frontend Developer)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#fff", marginBottom: 12 }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{ width: "100%", padding: 12, borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontWeight: 600, cursor: "pointer" }}
          >
            {loading ? "Analyzing..." : "Generate Questions & Answers"}
          </button>
        </div>

        {data && data.matchScore !== undefined && (
          <div style={{ background: "#1e293b", padding: 20, borderRadius: 12, marginBottom: 20 }}>
            <p style={{ color: "#818cf8", fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Resume Match Score: {data.matchScore}%</p>

            {data.missingKeywords && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: "#fbbf24", fontWeight: 600, marginBottom: 6 }}>Missing Keywords</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {data.missingKeywords.map((k: string, i: number) => (
                    <span key={i} style={{ background: "#422006", color: "#fbbf24", padding: "4px 10px", borderRadius: 20, fontSize: 13 }}>{k}</span>
                  ))}
                </div>
              </div>
            )}

            {data.skillsToImprove && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: "#f87171", fontWeight: 600, marginBottom: 6 }}>Skills to Improve</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {data.skillsToImprove.map((k: string, i: number) => (
                    <span key={i} style={{ background: "#450a0a", color: "#f87171", padding: "4px 10px", borderRadius: 20, fontSize: 13 }}>{k}</span>
                  ))}
                </div>
              </div>
            )}

            {data.suggestions && (
              <div>
                <p style={{ color: "#4ade80", fontWeight: 600, marginBottom: 6 }}>Suggestions to Crack This Role</p>
                {data.suggestions.map((s: string, i: number) => (
                  <p key={i} style={{ color: "#e2e8f0", fontSize: 14, marginBottom: 4 }}>✓ {s}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {data && data.items && data.items.map((item: any, i: number) => (
          <div key={i} style={{ background: "#1e293b", padding: 16, borderRadius: 12, marginBottom: 12 }}>
            <p style={{ color: "#818cf8", fontWeight: 600, marginBottom: 8 }}>Q{i + 1}: {item.question}</p>
            <p style={{ color: "#e2e8f0" }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}