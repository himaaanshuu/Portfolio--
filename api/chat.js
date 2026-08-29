const { GoogleGenAI } = require("@google/genai");

const SYSTEM_PROMPT = `You are "Ask Himanshu", the AI assistant embedded inside Himanshu Gupta's personal developer portfolio.

Your purpose is to help visitors understand Himanshu's background, skills, projects, education, interests, and current work.

You must answer using only the portfolio knowledge provided to you.

Never invent: internships, employment, companies, clients, awards, certifications, achievements, project users, revenue, GitHub statistics, performance metrics, technologies, or project features not listed.

If information is not available, say that the portfolio does not currently provide that information.

Be concise, natural, professional, and conversational.

When appropriate, mention the relevant portfolio section or project.

Do not pretend to be Himanshu. You are an assistant representing his portfolio.

If a visitor asks something unrelated, politely say that you can help them explore Himanshu's portfolio.`;

const PORTFOLIO_KNOWLEDGE = `
=== PROFILE ===
Name: Himanshu Gupta
Education: B.Tech Computer Science and Engineering, Galgotias University, 2024-2028, 3rd Year
Email: himanshu2005gupta@gmail.com
GitHub: himaaanshuu
LinkedIn: himanshu-gupta-9b5490338
Resume: https://drive.google.com/file/d/1ckPjrGd9eIvnDECA4GhoOO9qVk-jPKzj/view?usp=sharing

Personal Positioning: A 3rd-year Computer Science student who learns by building, experiments with AI, and turns ambitious ideas into working products.

Professional Interests: AI, ML, Generative AI, LLMs, Software Engineering, Full-Stack Development, Data-driven applications, Developer tools, Problem solving.

=== PROJECT 1: JALDRISHTI ===
Name: JalDrishti
Type: Groundwater Intelligence / AI / Data / Decision Support
GitHub: https://github.com/himaaanshuu/JALDRISTHI
Description: An intelligent groundwater management platform designed to transform complex groundwater data into accessible and actionable insights.
Key Concepts: Groundwater intelligence, data visualization, geospatial information, groundwater analytics, knowledge centre, AI-powered assistance, decision support, environmental data.

=== PROJECT 2: BITEZ ===
Name: Bitez
Type: Full-Stack Campus Food Ordering Platform
GitHub: https://github.com/himaaanshuu/BItz
Live: https://b-itz-web4.vercel.app
Description: A modern campus food ordering platform designed to make student food ordering faster, simpler, and more engaging.
Technology: React, Vite, Node.js, Express.js, MongoDB, JWT, Phone OTP auth, Google OAuth, REST APIs, Docker.
Features: Student/admin auth, Phone OTP, Google OAuth, JWT, REST API, MongoDB, Dockerized backend, glassmorphism UI, dynamic animations.

=== PROJECT 3: GITHUB ANALYZER ===
Name: GitHub Analyzer
Status: Currently Building (NOT completed)
Description: An AI-powered codebase intelligence platform built around one goal: make any unfamiliar repository feel familiar.
Vision: Goes beyond README summarization to help developers understand repo architecture, dependencies, code relationships, technologies, and project intent.

=== SKILLS ===
Frontend: HTML, CSS, JavaScript, React
Backend: Node.js, Express.js, REST APIs
Programming: Python, JavaScript, Java
Databases: SQL, MongoDB
AI/Data: Python, Pandas, NumPy, ML, Generative AI, LLM integration
Tools: Git, GitHub, Docker, Vite

=== ACHIEVEMENTS ===
- Job Simulation as Data Analyst - Deloitte Australia (2026)
- SQL Certification - Oracle (2025)
`;

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 15;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"] || (req.socket && req.socket.remoteAddress) || "unknown";
  if (!checkRateLimit(ip)) return res.status(429).json({ error: "Too many requests. Please wait a moment." });

  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required." });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: "Message too long. Please keep it under 2000 characters." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not configured on the server.");
    return res.status(500).json({ error: "AI assistant is not configured. Please contact the site owner." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
    const systemInstruction = SYSTEM_PROMPT + "\n\n" + PORTFOLIO_KNOWLEDGE;

    const chatHistory = [];
    const recentHistory = history.slice(-20);
    for (const msg of recentHistory) {
      if (msg.role === "user" || msg.role === "model") {
        chatHistory.push({ role: msg.role, parts: [{ text: msg.text }] });
      }
    }

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
      history: chatHistory,
    });

    const response = await chat.sendMessage({ message });
    const reply = response.text || "I couldn't generate a response. Please try again.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err.message || err);
    return res.status(500).json({ error: "Something went wrong while connecting to the AI assistant. Please try again." });
  }
};
