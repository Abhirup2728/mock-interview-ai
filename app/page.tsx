"use client";
import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [role, setRole] = useState("");
  const [items, setItems] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setItems([]);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ resume, role }),
    });
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: "40px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", fontFamily: "sans-serif" }}>
        <h1 style={{ color: "#fff", fontSize: 32, marginBottom: 8 }}>AI Mock Interview</h1>
        <p style={{ color: "#94a3b8", marginBottom: 24 }}>Paste your resume, get real interview Q&A</p>

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
            {loading ? "Generating..." : "Generate Questions & Answers"}
          </button>
        </div>

        {items.map((item, i) => (
          <div key={i} style={{ background: "#1e293b", padding: 16, borderRadius: 12, marginBottom: 12 }}>
            <p style={{ color: "#818cf8", fontWeight: 600, marginBottom: 8 }}>Q{i + 1}: {item.question}</p>
            <p style={{ color: "#e2e8f0" }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}