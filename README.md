

Readme · MD
# 🎯 AI Mock Interview — 360° Interview Preparation Platform
 
**An end-to-end, AI-powered platform that helps job seekers prepare for interviews using their own resume — with real-time voice mock interviews, instant answer evaluation, and complete placement-readiness guidance.**
 
🔗 **Live Demo:** [mock-interview-ai-abhirup2728.vercel.app](https://mock-interview-ai-abhirup2728.vercel.app/)
💻 **Repository:** [github.com/Abhirup2728/mock-interview-ai](https://github.com/Abhirup2728/mock-interview-ai)
 
---
 
## 📌 Overview
 
Most interview prep tools give generic questions. **AI Mock Interview** doesn't.
 
It reads *your* resume, *your* target job role, and *your* job description — and generates a fully personalized, 360-degree interview preparation kit, then lets you **practice out loud** with an AI that scores your spoken answers in real time.
 
Built solo, end-to-end — from architecture to deployment — as a production-ready product, not a notebook prototype.
 
---
 
## ✨ Key Features
 
### 📄 Resume Intelligence
- **Resume-JD Match Score** — instant semantic compatibility score between your resume and the target role
- **Missing Keyword Detection** — surfaces the exact skills/keywords recruiters and ATS systems are scanning for
- **Skill Gap Analysis** — highlights specific areas to improve before applying
### 🎙️ Voice-Based Mock Interview
- AI **speaks interview questions aloud** (Text-to-Speech)
- Candidate **answers by speaking naturally** (Speech-to-Text)
- AI **evaluates the spoken answer in real time**, returning a quantified score, feedback, and missing key points — compared against an ideal model answer
### 🧠 Personalized Question Generation
- Resume-based interview questions with model answers
- **Job Description–specific questions**, generated from the actual JD pasted by the user
- **STAR-method behavioral answers** auto-built from the candidate's own resume projects and experience
### 🏢 360° Placement Readiness
- **Company research & culture-fit tips**
- **Salary negotiation guidance** — realistic market range + a ready-to-use negotiation script
- **Confidence & body language tips** for interview presence
- **One-click PDF export** of the full prep report
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **AI / LLM** | Google Gemini API (`gemini-flash-latest`) |
| **Backend / Database** | Supabase |
| **Voice** | Web Speech API (Speech-to-Text + Speech Synthesis) |
| **Version Control** | Git & GitHub |
| **Deployment** | Vercel (CI/CD from GitHub) |
| **Styling** | Custom responsive UI (inline CSS-in-JS) |
 
---
 
## ⚙️ How It Works
 
1. User pastes their **resume**, target **job role**, optional **company name**, and optional **job description**
2. The app sends this to a **Next.js API route**, which prompts **Google Gemini** to return structured JSON: match score, keyword gaps, tailored questions, STAR answers, salary guidance, and more
3. User can enter **Voice Mock Interview mode** — the AI asks questions aloud, listens to spoken answers via the browser's Speech Recognition API, and evaluates them against an ideal answer using a second AI call
4. Results are rendered live in a clean, dark-themed dashboard, with an option to **download the full prep kit as a PDF**
---
 
## 🎯 Why I Built This
 
As a final-year B.Tech CSE (AI & ML) student actively going through placement season, I wanted a tool that didn't just throw generic interview questions at me — but actually understood *my* resume, *my* target role, and gave me a way to **practice out loud** and get honest, instant feedback — the same way a real mock interviewer would.
 
This project reflects my ability to independently design, build, and ship a **full-stack, AI-integrated, production-deployed product** — from prompt engineering and API architecture to UI/UX and CI/CD deployment.
 
---
 
## 🚀 Live Project
 
👉 **Try it here:** [mock-interview-ai-abhirup2728.vercel.app](https://mock-interview-ai-abhirup2728.vercel.app/)
 
---
 
## 👤 Author
 
**Abhirup Gumtya**
B.Tech CSE (AI & ML) | Brainware University, Kolkata
 
- 🔗 LinkedIn: [linkedin.com/in/abhirupgumtya](https://linkedin.com/in/abhirupgumtya)
- 💻 GitHub: [github.com/Abhirup2728](https://github.com/Abhirup2728)
- 🌐 Portfolio: [abhirup-gumtya-portfolio.netlify.app](https://abhirup-gumtya-portfolio.netlify.app)
---
 
⭐ If you found this project useful or interesting, consider giving it a star on GitHub!
 
