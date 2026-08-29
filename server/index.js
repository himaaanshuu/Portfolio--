require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

const chatHandler = require(path.join(__dirname, "..", "api", "chat.js"));

app.post("/api/chat", (req, res) => {
  return chatHandler(req, res);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", hasApiKey: !!process.env.GEMINI_API_KEY });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`API key configured: ${!!process.env.GEMINI_API_KEY}`);
});
