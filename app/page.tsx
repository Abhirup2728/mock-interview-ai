"use client";
import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setQuestions([]);
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ resume, role }),
    });
    const data = await res.json();
    const list = data.questions
      .split("\n")
      .filter((q: string) => q.trim().length > 0);
    setQuestions(list);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>AI Mock Interview</h1>
      <textarea
        placeholder="Paste your resume text here"
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        rows={6}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <input
        placeholder="Target job role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />
      <button onClick={handleGenerate} disabled={loading} style={{ padding: "8px 16px" }}>
        {loading ? "Generating..." : "Generate Questions"}
      </button>

      <div style={{ marginTop: 20 }}>
        {questions.map((q, i) => (
          <div key={i} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, marginBottom: 8 }}>
            {q}
          </div>
        ))}
      </div>
    </div>
  );
}