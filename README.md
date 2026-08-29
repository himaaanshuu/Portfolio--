# 🚀 Himanshu Gupta — Personal Portfolio

A modern, AI-powered **React portfolio** showcasing projects, skills, and live GitHub activity — with an integrated AI assistant.

**Live:** [portfolio-steel-six-iv641m8dyf.vercel.app](https://portfolio-steel-six-iv641m8dyf.vercel.app)

---

## ✨ Features

- **Ask Himanshu** — AI chatbot powered by Gemini, trained on portfolio knowledge. Ask about projects, skills, education, and interests.
- **Live GitHub Insights** — Real-time commit activity, language breakdown, and repo stats fetched from the GitHub API.
- **Animated UI** — Scroll-triggered reveals, char-by-char text animation, magnetic CTA buttons, sticky scaling project cards.
- **Dark Theme** — Full nardo grey accent system on a deep `#0C0C0C` background.
- **Responsive** — Works on mobile, tablet, and desktop.
- **Framer Motion** — Smooth page transitions, hover effects, and animated chatbot logo.
- **Server-Side API Proxy** — Gemini API key never exposed to the browser. All AI requests go through `/api/chat`.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Framer Motion, Recharts |
| **Styling** | CSS3, Kanit + Space Grotesk fonts |
| **AI Backend** | `@google/genai`, Gemini 3.5 Flash |
| **API Server** | Express.js, Vercel Serverless Functions |
| **Data** | GitHub REST API (live) |
| **Build** | Create React App |
| **Deploy** | Vercel |

---

## ⚙️ Setup & Installation

### 1. Clone

```bash
git clone https://github.com/himaaanshuu/Portfolio--.git
cd Portfolio--
```

### 2. Install

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
```

> Get your API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 4. Run

```bash
npm start
```

This starts both the React dev server (port 3000) and the API server (port 3001).

Open **http://localhost:3000**

---

## 📂 Project Structure

```
Portfolio--/
├── api/
│   └── chat.js              # Serverless API handler (Vercel + local)
├── server/
│   └── index.js             # Express server for local dev
├── src/
│   ├── data/
│   │   └── portfolioKnowledge.js   # Centralized knowledge base for AI
│   ├── App.js                # Main portfolio + Ask Himanshu chatbot
│   ├── App.css               # Global styles
│   └── index.css             # Dark theme, scrollbar, CTA styles
├── public/
│   └── index.html            # Google Fonts (Kanit, Space Grotesk)
├── .env.example              # Environment template
└── package.json
```

---

## 🚀 Features In Progress

| Feature | Status |
|---|---|
| GitHub Analyzer — AI-powered codebase intelligence | 🚧 Building |
| Portfolio knowledge base expansion | 🔜 Planned |
| Chat history persistence | 🔜 Planned |
| Vercel deployment with serverless API | ✅ Ready |

---

## 📬 Contact

- **Email:** himanshu2005gupta@gmail.com
- **GitHub:** [himaaanshuu](https://github.com/himaaanshuu)
- **LinkedIn:** [himanshu-gupta-9b5490338](https://www.linkedin.com/in/himanshu-gupta-9b5490338)
- **Resume:** [Download](https://drive.google.com/file/d/1ckPjrGd9eIvnDECA4GhoOO9qVk-jPKzj/view?usp=sharing)

---

⭐ If you found this helpful, don't forget to star the repository!
