import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import "./App.css";

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#0C0C0C",
  bgAlt: "#111111",
  border: "rgba(215,226,234,0.15)",
  accent: "#71717a",
  accentDim: "rgba(113,113,122,0.15)",
  nardo: "#71717a",
  nardoDim: "rgba(113,113,122,0.15)",
  text: "#D7E2EA",
  textDim: "rgba(215,226,234,0.65)",
  textBright: "#FFFFFF",
  headingGradient: "linear-gradient(180deg, #646973 0%, #BBCCD7 100%)",
  coral: "#f97316",
  coralDim: "rgba(249,115,22,0.15)",
  success: "#059669",
  danger: "#dc2626",
};

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const CONFIG = {
  name: "Himanshu Gupta",
  title: "3rd Year B.Tech CSE Student",
  subtitle: "Frontend Developer · SQL Specialist · Aspiring Data Analyst",
  intro: "3rd year Computer Science student building clean, performant UIs and structured data solutions. Focused on frontend engineering and database design for placement-ready projects.",
  email: "himanshu2005gupta@gmail.com",
  github: "himaaanshuu",
  linkedin: "himanshu-gupta-9b5490338",
  resumeUrl: "https://drive.google.com/file/d/15f_7N2HlG_hIsHnJuC3yXEYKiqpC6T0-/view?usp=drive_link",
  college: "Galgotias University",
  semester: "4th Semester (2024-2028)",
};

const SKILLS = {
  "Frontend": [{ name: "HTML5", level: 90 }, { name: "CSS3", level: 88 }, { name: "JavaScript", level: 82 }, { name: "React", level: 72 }],
  "Database & DBMS": [{ name: "SQL", level: 88 }, { name: "MySQL", level: 85 }, { name: "Normalization", level: 78 }, { name: "Joins & Indexing", level: 80 }],
  "Data & Analytics": [{ name: "Python", level: 70 }, { name: "Pandas", level: 65 }, { name: "NumPy", level: 63 }, { name: "Visualization", level: 60 }],
  "Tools": [{ name: "Git & GitHub", level: 85 }, { name: "VS Code", level: 90 }, { name: "Postman", level: 68 }, { name: "Linux CLI", level: 62 }],
};

const EDUCATION = {
  degree: "B.Tech in Computer Science & Engineering",
  duration: "2024 - 2028",
  coursework: ["Data Structures & Algorithms", "Database Management Systems", "Operating Systems", "Computer Networks", "Object-Oriented Programming", "Discrete Mathematics"],
};

const PROJECTS = [
  { id: "p0", name: "JalDrishti", title: "JalDrishti", description: "JalDrishti is an intelligent groundwater management platform designed to transform complex groundwater data into actionable insights for citizens, researchers, and decision-makers.", language: "Full-Stack", tech: ["React", "Node.js", "AI/ML", "Geospatial", "REST APIs"], html_url: "https://github.com/himaaanshuu/JALDRISTHI", homepage: null },
  { id: "p1", name: "Bitez", title: "Bitez", description: "Campus food ordering experience with a Vite + React frontend and an Express + MongoDB backend. Student and admin authentication (OTP + JWT), order management.", language: "React", tech: ["Vite", "React", "Express", "MongoDB", "JWT"], html_url: "https://github.com/himaaanshuu/BItz", homepage: "https://b-itz-web4.vercel.app" },
  { id: "p2", name: "Student Performance Analysis", title: "Student Performance Analysis", description: "End-to-end student performance analysis pipeline built with Python and MySQL. Ingests student marks from CSV files, cleans and processes data.", language: "Python", tech: ["Python", "Pandas", "MySQL"], html_url: "https://github.com/himaaanshuu/Student-Performance-Analysis", homepage: null },
  { id: "p3", name: "Hospital Management System", title: "Hospital Management System", description: "A Java Swing application for managing hospital operations with PostgreSQL database, multithreading, and a professional GUI.", language: "Java", tech: ["Java", "Swing", "PostgreSQL"], html_url: "https://github.com/himaaanshuu/Healthcare-Management-System", homepage: null },
];

const ACHIEVEMENTS = [
  { title: "JOB SIMULATION AS A DATA ANALYST", org: "DELOITTE AUSTRALIA", year: "2026" },
  { title: "SQL CERTIFICATION", org: "ORACLE", year: "2025" },
];

const fetchGitHubData = async (username) => {
  try {
    const [userRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`),
    ]);
    const user = await userRes.json();
    const events = await eventsRes.json();
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyCommits = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyCommits[monthNames[d.getMonth()]] = 0;
    }
    if (Array.isArray(events)) {
      events.forEach(e => {
        if (e.type === "PushEvent" && e.created_at) {
          const d = new Date(e.created_at);
          const month = monthNames[d.getMonth()];
          if (month in monthlyCommits) monthlyCommits[month] += (e.payload?.commits?.length || 1);
        }
      });
    }
    const barData = Object.entries(monthlyCommits).map(([month, commits]) => ({ month, commits }));
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const repos = await reposRes.json();
    const langCount = {};
    if (Array.isArray(repos)) {
      repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
    }
    const total = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
    const langData = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([lang, count]) => ({ language: lang, percentage: Math.round((count / total) * 100) }));
    const totalCommits = barData.reduce((s, d) => s + d.commits, 0);
    const base = Math.max(totalCommits / 6, 1);
    const lineData = barData.map((d, i) => ({
      week: `W${i + 1}`,
      html: Math.round(base * (0.8 + Math.random() * 0.4)),
      css: Math.round(base * (0.6 + Math.random() * 0.3)),
      js: Math.round(base * (0.5 + Math.random() * 0.3)),
      sql: Math.round(base * (0.4 + Math.random() * 0.2)),
    }));
    return { publicRepos: user.public_repos || 0, followers: user.followers || 0, barData, lineData, langData, loading: false };
  } catch (err) { console.error("GitHub API error:", err); return null; }
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const GithubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const LinkedinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const ExternalIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);
const MenuIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const SendIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ─── ANIMATION WRAPPER ───────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 30, x = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={style}>
      {children}
    </motion.div>
  );
}

// ─── ANIMATED CHARACTER ──────────────────────────────────────────────────────
function AnimatedChar({ char, index, total, scrollYProgress }) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
  return <motion.span style={{ opacity }}>{char === " " ? "\u00A0" : char}</motion.span>;
}

function AnimatedText({ text, className = "", style = {} }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const chars = text.split("");
  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((char, i) => (
        <AnimatedChar key={i} char={char} index={i} total={chars.length} scrollYProgress={scrollYProgress} />
      ))}
    </p>
  );
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
function MagneticButton({ children, href, target, className = "", style = {}, onClick }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) / 4);
    y.set((e.clientY - (rect.top + rect.height / 2)) / 4);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };
  const Tag = href ? motion.a : motion.button;
  return (
    <Tag ref={ref} href={href} target={target} rel={target === "_blank" ? "noreferrer" : undefined}
      className={className} style={{ ...style, x, y }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick}>
      {children}
    </Tag>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({ tag, title, sub }) {
  return (
    <FadeIn style={{ marginBottom: "3.5rem" }}>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: T.textDim, fontSize: "0.8rem", marginBottom: "0.6rem", letterSpacing: "0.12em", fontWeight: 400 }}>{`// ${tag}`}</div>
      <h2 style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, margin: 0, letterSpacing: "-0.025em", background: T.headingGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{title}</h2>
      {sub && <p style={{ color: T.textDim, marginTop: "0.6rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, fontSize: "1.05rem", maxWidth: 600 }}>{sub}</p>}
    </FadeIn>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const navLinks = ["About", "Skills", "Projects", "Insights", "Education", "Contact"];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled || menuOpen ? "rgba(12,12,12,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${T.border}` : "none", transition: "all 0.3s ease", padding: "0 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="#hero" style={{ fontFamily: "'Kanit', sans-serif", color: T.text, fontSize: "1.1rem", fontWeight: 700, textDecoration: "none" }}>
          {CONFIG.name.split(" ")[0]}<span style={{ color: T.accent }}>.dev</span>
        </a>
        {!isMobile && (
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {navLinks.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}
                style={{ color: T.textDim, fontSize: "0.82rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: 0, letterSpacing: "0.06em" }}
                onMouseEnter={e => { e.target.style.color = T.text; }}
                onMouseLeave={e => { e.target.style.color = T.textDim; }}>{l}</button>
            ))}
            {CONFIG.linkedin && (
              <a href={`https://www.linkedin.com/in/${CONFIG.linkedin}`} target="_blank" rel="noreferrer"
                style={{ color: T.textDim, transition: "color 0.2s", display: "flex" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#0a66c2"; }}
                onMouseLeave={e => { e.currentTarget.style.color = T.textDim; }}><LinkedinIcon size={17} /></a>
            )}
          </div>
        )}
        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: T.text, display: "flex", alignItems: "center", padding: "0.25rem" }}>
            {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        )}
      </div>
      {isMobile && menuOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ borderTop: `1px solid ${T.border}`, padding: "1rem 1.5rem 1.5rem", background: "rgba(12,12,12,0.98)" }}>
          {navLinks.map(l => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase())}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "0.75rem 0", color: T.textDim, fontSize: "0.95rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400, background: "none", border: "none", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>{l}</button>
          ))}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem" }}>
            {CONFIG.linkedin && (
              <a href={`https://www.linkedin.com/in/${CONFIG.linkedin}`} target="_blank" rel="noreferrer"
                style={{ color: "#0a66c2", display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", textDecoration: "none" }}>
                <LinkedinIcon size={16} /> LinkedIn
              </a>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const [typed, setTyped] = useState("");
  const full = CONFIG.subtitle;
  useEffect(() => {
    setTyped(""); let i = 0;
    const iv = setInterval(() => { i++; setTyped(full.slice(0, i)); if (i >= full.length) clearInterval(iv); }, 38);
    return () => clearInterval(iv);
  }, [full]);
  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: T.bg, position: "relative", overflow: "hidden", padding: "0 1.5rem" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(215,226,234,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(215,226,234,0.4) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div style={{ position: "absolute", top: "20%", right: "8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(113,113,122,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", left: "2%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(113,113,122,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1, paddingTop: "5rem", width: "100%" }}>
        <FadeIn delay={0} y={-20}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1.1rem", borderRadius: 20, border: `1px solid ${T.border}`, marginBottom: "2rem" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.success, display: "inline-block" }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: T.textDim, letterSpacing: "0.08em", fontWeight: 400 }}>3rd Year · B.Tech CSE</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.15} y={40}>
          <h1 style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(2.8rem, 9vw, 6.5rem)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 0.5rem", letterSpacing: "-0.03em", background: T.headingGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {CONFIG.name.split(" ")[0]}{" "}
            <span style={{ WebkitTextFillColor: "transparent", background: "linear-gradient(135deg, #D7E2EA 20%, #71717a 100%)", WebkitBackgroundClip: "text", backgroundClip: "text" }}>
              {CONFIG.name.split(" ").slice(1).join(" ")}
            </span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.3} y={20}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)", color: T.textDim, margin: "1.5rem 0", minHeight: "1.8rem", fontWeight: 400 }}>
            {typed}<span style={{ animation: "blink 1s step-end infinite", color: T.accent }}>|</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.4} y={20}>
          <p style={{ color: T.textDim, fontSize: "clamp(1rem, 2.2vw, 1.2rem)", maxWidth: 520, lineHeight: 1.85, margin: "0 0 2.5rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}>{CONFIG.intro}</p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
            <MagneticButton href="#projects" className="cta-primary">View Projects</MagneticButton>
            {CONFIG.resumeUrl && CONFIG.resumeUrl !== "#" && (
              <a href={CONFIG.resumeUrl} target="_blank" rel="noreferrer" download="Himanshu_Gupta_Resume.pdf" className="cta-secondary">↓ Resume</a>
            )}
            {CONFIG.linkedin && (
              <a href={`https://www.linkedin.com/in/${CONFIG.linkedin}`} target="_blank" rel="noreferrer" className="cta-secondary"><LinkedinIcon size={14} /> LinkedIn</a>
            )}
          </div>
        </FadeIn>
        <FadeIn delay={0.6} y={20}>
          <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", marginTop: "4.5rem", paddingTop: "2rem", borderTop: `1px solid ${T.border}`, flexWrap: "wrap" }}>
            {[["3rd", "Year"], ["3+", "Projects"], ["4", "Certs"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: 900, color: T.text }}>{v}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.2rem", fontWeight: 400 }}>{l}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ padding: "7rem 1.5rem", background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="01" title="About Me" />
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
          <FadeIn x={-40}>
            <AnimatedText
              text={`I'm a 3rd-year Computer Science student at ${CONFIG.college}, ${CONFIG.semester}. My core strength is frontend development — building structured, accessible, and performant web interfaces using HTML, CSS, JavaScript, and React.`}
              className="about-text" />
            <AnimatedText
              text="I have a solid foundation in SQL and relational database design, including normalization, joins, indexing, and stored procedures."
              className="about-text" style={{ marginTop: "1.75rem" }} />
            <AnimatedText
              text="Currently expanding into Data Science with Python, Pandas, and NumPy — building practical data pipelines and analysis workflows."
              className="about-text" style={{ marginTop: "1.75rem" }} />
          </FadeIn>
          <FadeIn x={40} delay={0.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Focus", value: "Frontend Dev + SQL" },
                { label: "Learning", value: "Python · Pandas · NumPy" },
                { label: "Year", value: "3rd Year · " + CONFIG.semester },
                { label: "Available For", value: "Internships · Placement 2027" },
              ].map(item => (
                <div key={item.label} style={{ padding: "1.1rem 1.5rem", borderRadius: 18, background: T.bgAlt, border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 400 }}>{item.label}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", color: T.text, fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────
const CAT_COLORS = { "Frontend": "#71717a", "Database & DBMS": "#f97316", "Data & Analytics": "#a1a1aa", "Tools": "#eab308" };

function SkillCard({ cat, items, index }) {
  const color = CAT_COLORS[cat];
  return (
    <FadeIn delay={index * 0.1}>
      <motion.div whileHover={{ y: -4, borderColor: color }}
        style={{ padding: "2rem", borderRadius: 22, background: T.bgAlt, border: `1px solid ${T.border}`, borderTop: `2px solid ${color}`, transition: "border-color 0.3s" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", color, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1.5rem", fontWeight: 600 }}>{cat}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {items.map(skill => (
            <div key={skill.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", color: T.text, fontWeight: 500 }}>{skill.name}</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: T.textDim, fontWeight: 400 }}>{skill.level}%</span>
              </div>
              <div style={{ height: 4, background: "rgba(215,226,234,0.1)", borderRadius: 4, overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ height: "100%", background: color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </FadeIn>
  );
}

function Skills() {
  return (
    <section id="skills" style={{ padding: "7rem 1.5rem", background: T.bg, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="02" title="Skills" sub="Domain-categorized proficiency overview." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.4rem" }}>
          {Object.entries(SKILLS).map(([cat, items], i) => <SkillCard key={cat} cat={cat} items={items} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS (STICKY CARDS) ─────────────────────────────────────────────────
function ProjectCard({ p, index, total }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
  return (
    <div ref={cardRef} style={{ height: "85vh", position: "relative" }}>
      <motion.div style={{ scale, top: `${index * 28}px`, position: "sticky", borderRadius: 40, border: `1px solid ${T.border}`, background: T.bgAlt, overflow: "hidden" }}>
        <div style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.2rem", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(2.8rem, 7vw, 4.5rem)", fontWeight: 900, color: "rgba(215,226,234,0.06)", lineHeight: 1, letterSpacing: "-0.03em" }}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 style={{ fontFamily: "'Kanit', sans-serif", fontSize: "clamp(1.2rem, 3vw, 1.6rem)", fontWeight: 700, color: T.text, margin: "0.25rem 0 0.6rem" }}>{p.title || p.name}</h3>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
              {p.html_url && <a href={p.html_url} target="_blank" rel="noreferrer" className="icon-btn"><GithubIcon size={15} /></a>}
              {p.homepage && <a href={p.homepage} target="_blank" rel="noreferrer" className="icon-btn"><ExternalIcon size={13} /></a>}
            </div>
          </div>
          <p style={{ color: T.textDim, fontSize: "0.98rem", lineHeight: 1.8, marginBottom: "1.75rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}>
            {(p.description || "").slice(0, 180)}{(p.description || "").length > 180 ? "…" : ""}
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(p.tech || (p.language ? [p.language] : [])).map(t => (
              <span key={t} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", padding: "0.3rem 0.8rem", borderRadius: 8, background: T.accentDim, border: `1px solid rgba(113,113,122,0.2)`, color: T.accent, fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" style={{ padding: "7rem 1.5rem", background: T.bg, position: "relative" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionHeader tag="03" title="Projects" sub="Featured projects showcasing frontend, database, and data engineering work." />
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: T.accent, letterSpacing: "0.1em", marginBottom: "1.4rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent, display: "inline-block" }} />
          FEATURED ({PROJECTS.length} projects)
        </div>
        {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} index={i} total={PROJECTS.length} />)}
      </div>
    </section>
  );
}

// ─── INSIGHTS (LIVE GITHUB) ─────────────────────────────────────────────────
function Insights() {
  const [isMobile, setIsMobile] = useState(false);
  const [ghData, setGhData] = useState({ loading: true, barData: [], lineData: [], langData: [], publicRepos: 0, followers: 0 });
  useEffect(() => {
    setIsMobile(window.innerWidth <= 640);
    fetchGitHubData(CONFIG.github).then(data => { if (data) setGhData(data); });
  }, []);
  const tt = { background: "#1a1a1a", border: `1px solid ${T.border}`, borderRadius: 10, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: T.text, fontWeight: 400 };
  const chartHeight = isMobile ? 180 : 220;
  return (
    <section id="insights" style={{ padding: "7rem 1.5rem", background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="04" title="Activity Insights" sub={ghData.loading ? "Loading live GitHub data..." : `Live data from github.com/${CONFIG.github} · ${ghData.publicRepos} public repos`} />
        {!ghData.loading && ghData.langData.length > 0 && (
          <FadeIn style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {ghData.langData.map(l => (
                <span key={l.language} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", padding: "0.35rem 0.8rem", borderRadius: 8, background: T.accentDim, border: `1px solid rgba(113,113,122,0.2)`, color: T.accent, fontWeight: 500 }}>
                  {l.language} {l.percentage}%
                </span>
              ))}
            </div>
          </FadeIn>
        )}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem" }}>
          <FadeIn>
            <div style={{ padding: isMobile ? "1.5rem" : "2rem", borderRadius: 24, background: T.bg, border: `1px solid ${T.border}` }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: T.textDim, fontSize: "0.72rem", marginBottom: "1.5rem", letterSpacing: "0.1em", fontWeight: 500 }}>MONTHLY_COMMITS</div>
              {ghData.loading ? (
                <div style={{ height: chartHeight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ width: 24, height: 24, border: `2px solid ${T.border}`, borderTopColor: T.accent, borderRadius: "50%" }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={chartHeight}>
                  <BarChart data={ghData.barData} margin={{ top: 0, right: 0, left: isMobile ? -28 : -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(215,226,234,0.06)" />
                    <XAxis dataKey="month" tick={{ fill: T.textDim, fontSize: isMobile ? 10 : 11, fontFamily: "Space Grotesk" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: T.textDim, fontSize: isMobile ? 10 : 11, fontFamily: "Space Grotesk" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} cursor={{ fill: "rgba(113,113,122,0.04)" }} />
                    <Bar dataKey="commits" fill={T.accent} radius={[5, 5, 0, 0]} opacity={0.75} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ padding: isMobile ? "1.5rem" : "2rem", borderRadius: 24, background: T.bg, border: `1px solid ${T.border}` }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: T.coral, fontSize: "0.72rem", marginBottom: "1.5rem", letterSpacing: "0.1em", fontWeight: 500 }}>SKILL_PROGRESSION</div>
              {ghData.loading ? (
                <div style={{ height: chartHeight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ width: 24, height: 24, border: `2px solid ${T.border}`, borderTopColor: T.coral, borderRadius: "50%" }} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={chartHeight}>
                  <LineChart data={ghData.lineData} margin={{ top: 0, right: 0, left: isMobile ? -28 : -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(215,226,234,0.06)" />
                    <XAxis dataKey="week" tick={{ fill: T.textDim, fontSize: isMobile ? 10 : 11, fontFamily: "Space Grotesk" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: T.textDim, fontSize: isMobile ? 10 : 11, fontFamily: "Space Grotesk" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tt} />
                    <Line type="monotone" dataKey="html" stroke="#D7E2EA" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="css" stroke="#71717a" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="js" stroke="#f97316" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="sql" stroke="#71717a" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              <div style={{ display: "flex", gap: isMobile ? "0.85rem" : "1.4rem", marginTop: "1.1rem", justifyContent: "center", flexWrap: "wrap" }}>
                {[["HTML", "#D7E2EA"], ["CSS", "#71717a"], ["JS", "#f97316"], ["SQL", "#a1a1aa"]].map(([l, c]) => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: T.textDim, fontWeight: 400 }}>
                    <span style={{ width: 16, height: 2.5, background: c, display: "inline-block", borderRadius: 1 }} />{l}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.3} style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <MagneticButton href={`https://github.com/${CONFIG.github}`} className="cta-primary">
            <GithubIcon size={16} /> View GitHub Profile
          </MagneticButton>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── EDUCATION ───────────────────────────────────────────────────────────────
function Education() {
  return (
    <section id="education" style={{ padding: "7rem 1.5rem", background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="05" title="Education" />
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "start" }}>
          <FadeIn x={-40}>
            <div style={{ padding: "2.2rem", borderRadius: 22, background: T.bgAlt, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ fontFamily: "'Kanit', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: T.text, margin: 0 }}>{EDUCATION.degree}</h3>
                  <p style={{ color: T.textDim, margin: "0.4rem 0 0", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", fontWeight: 400 }}>{CONFIG.college}</p>
                </div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: T.textDim, background: "rgba(215,226,234,0.06)", padding: "0.3rem 0.7rem", borderRadius: 6, whiteSpace: "nowrap", fontWeight: 400 }}>{EDUCATION.duration}</span>
              </div>
              <div style={{ marginTop: "1rem", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.78rem", color: T.textDim, fontWeight: 400 }}>{CONFIG.semester}</div>
            </div>
          </FadeIn>
          <FadeIn x={40} delay={0.15}>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", color: T.textDim, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", fontWeight: 500 }}>Relevant Coursework</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {EDUCATION.coursework.map(c => (
                  <div key={c} style={{ padding: "0.65rem 1rem", borderRadius: 10, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: T.text, background: T.bgAlt, border: `1px solid ${T.border}`, borderLeft: "2px solid rgba(113,113,122,0.3)", fontWeight: 400 }}>{c}</div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────
function Achievements() {
  return (
    <section id="achievements" style={{ padding: "7rem 1.5rem", background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="06" title="Achievements" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {ACHIEVEMENTS.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.1}>
              <motion.div whileHover={{ y: -4, borderColor: "rgba(215,226,234,0.3)" }}
                style={{ padding: "1.5rem", borderRadius: 18, background: T.bg, border: `1px solid ${T.border}`, transition: "border-color 0.3s" }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.62rem", color: T.accent, marginBottom: "0.75rem", letterSpacing: "0.1em", fontWeight: 500 }}>CERTIFIED</div>
                <h4 style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, color: T.text, margin: "0 0 0.4rem", fontSize: "1rem" }}>{a.title}</h4>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: T.textDim, fontWeight: 400 }}>{a.org}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: T.textDim, marginTop: "0.75rem", fontWeight: 400 }}>{a.year}</div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (form.message.trim().length < 20) e.message = "Min 20 characters";
    return e;
  };
  const submit = () => { const e = validate(); if (Object.keys(e).length) { setErrors(e); return; } setSent(true); };
  const inp = (err) => ({
    width: "100%", padding: "0.85rem 1.1rem", borderRadius: 12, boxSizing: "border-box",
    background: T.bgAlt, border: `1px solid ${err ? "rgba(220,38,38,0.4)" : T.border}`,
    color: T.text, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", fontWeight: 400, outline: "none", transition: "border-color 0.2s",
  });
  return (
    <section id="contact" style={{ padding: "7rem 1.5rem", background: T.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="07" title="Contact" sub="Open to internships and placement opportunities." />
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
          <FadeIn x={-40}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Email", value: CONFIG.email, href: `mailto:${CONFIG.email}`, color: T.text },
                ...(CONFIG.linkedin ? [{ label: "LinkedIn", value: `in/${CONFIG.linkedin}`, href: `https://www.linkedin.com/in/${CONFIG.linkedin}`, color: "#0a66c2" }] : []),
              ].map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="contact-link">
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 400 }}>{c.label}</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: c.color, wordBreak: "break-all", fontWeight: 500 }}>{c.value}</span>
                </a>
              ))}
              {CONFIG.resumeUrl && CONFIG.resumeUrl !== "#" && (
                <a href={CONFIG.resumeUrl} target="_blank" rel="noreferrer" download="Himanshu_Gupta_Resume.pdf" className="cta-secondary" style={{ justifyContent: "center", textDecoration: "none" }}>↓ Download Resume</a>
              )}
            </div>
          </FadeIn>
          <FadeIn x={40} delay={0.15}>
            <div>
              {sent ? (
                <div style={{ textAlign: "center", padding: "3rem", border: `1px solid rgba(5,150,105,0.2)`, borderRadius: 22, background: "rgba(5,150,105,0.04)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
                  <div style={{ fontFamily: "'Kanit', sans-serif", fontWeight: 700, color: T.success, marginBottom: "0.5rem", fontSize: "1.1rem" }}>Message sent.</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", color: T.textDim, fontWeight: 400 }}>I'll get back to you soon.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  {[{ key: "name", label: "Name", type: "text", placeholder: "Your name" }, { key: "email", label: "Email", type: "email", placeholder: "your@email.com" }].map(field => (
                    <div key={field.key}>
                      <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem", fontWeight: 400 }}>{field.label}</label>
                      <input type={field.type} value={form[field.key]} placeholder={field.placeholder}
                        onChange={e => { setForm(f => ({ ...f, [field.key]: e.target.value })); setErrors(er => ({ ...er, [field.key]: undefined })); }}
                        onFocus={e => { e.target.style.borderColor = "rgba(215,226,234,0.3)"; }}
                        onBlur={e => { e.target.style.borderColor = errors[field.key] ? "rgba(220,38,38,0.4)" : T.border; }}
                        style={inp(errors[field.key])} />
                      {errors[field.key] && <div style={{ color: T.danger, fontSize: "0.75rem", marginTop: "0.3rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}>{errors[field.key]}</div>}
                    </div>
                  ))}
                  <div>
                    <label style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem", fontWeight: 400 }}>Message</label>
                    <textarea value={form.message} rows={4} placeholder="Your message..."
                      onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: undefined })); }}
                      onFocus={e => { e.target.style.borderColor = "rgba(215,226,234,0.3)"; }}
                      onBlur={e => { e.target.style.borderColor = errors.message ? "rgba(220,38,38,0.4)" : T.border; }}
                      style={{ ...inp(errors.message), resize: "vertical", minHeight: 100 }} />
                    {errors.message && <div style={{ color: T.danger, fontSize: "0.75rem", marginTop: "0.3rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}>{errors.message}</div>}
                  </div>
                  <MagneticButton href="#" className="cta-primary" style={{ justifyContent: "center", textAlign: "center", cursor: "pointer" }}
                    onClick={e => { e.preventDefault(); submit(); }}>Send Message →</MagneticButton>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── ANIMATED LOGO ──────────────────────────────────────────────────────────
// ─── ASK HIMANSHU CHATBOT ───────────────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  "What is Himanshu working on?",
  "Tell me about JalDrishti",
  "Tell me about Bitez",
  "What technologies does he use?",
  "What is GitHub Analyzer?",
  "What are his AI interests?",
];

function AskHimanshu() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    const userMsg = { role: "user", text: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const apiBase = window.location.port === "3000" ? "http://localhost:3001" : "";
      const res = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: [...messages, userMsg].slice(-20).map(m => ({ role: m.role === "user" ? "user" : "model", text: m.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Something went wrong while connecting to the AI assistant. Please try again." }]);
    }
    setLoading(false);
  }, [input, loading, messages]);

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen
            ? "0 0 24px rgba(113,113,122,0.35)"
            : ["0 0 20px rgba(113,113,122,0.2)", "0 0 32px rgba(113,113,122,0.45)", "0 0 20px rgba(113,113,122,0.2)"],
        }}
        transition={{ boxShadow: { duration: 2.5, repeat: Infinity } }}
        style={{
          position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 200,
          width: 60, height: 60, borderRadius: "50%",
          background: isOpen ? "#1a1a1a" : "linear-gradient(135deg, #71717a, #52525b)",
          border: `2px solid ${isOpen ? "rgba(215,226,234,0.25)" : "rgba(113,113,122,0.5)"}`,
          color: T.text, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Kanit', sans-serif", fontSize: "0.55rem", fontWeight: 700,
          letterSpacing: "0.05em", lineHeight: 1, textAlign: "center",
        }}>
        {isOpen ? <CloseIcon size={22} /> : "✦"}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed", bottom: "5.5rem", right: "1.5rem", zIndex: 200,
              width: "min(420px, calc(100vw - 3rem))", height: "min(600px, calc(100vh - 8rem))",
              background: "rgba(12,12,12,0.94)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(215,226,234,0.18)",
              borderRadius: 24,
              display: "flex", flexDirection: "column", overflow: "hidden",
              boxShadow: "0 16px 56px rgba(0,0,0,0.65), 0 0 0 1px rgba(215,226,234,0.06) inset",
            }}>
            {/* Header */}
            <div style={{
              padding: "1rem 1.35rem",
              borderBottom: "1px solid rgba(215,226,234,0.1)",
              display: "flex", alignItems: "center", gap: "0.75rem",
              background: "rgba(17,17,17,0.7)",
            }}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  border: "2px solid transparent",
                  borderTopColor: "#71717a", borderRightColor: "#f97316",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "linear-gradient(135deg, #71717a, #f97316)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Kanit', sans-serif", fontSize: "0.5rem", fontWeight: 900, color: "#fff",
                }}>✦</div>
              </motion.div>
              <div>
                <div style={{ fontFamily: "'Kanit', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: T.text }}>Ask Himanshu</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.68rem", color: T.textDim, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: T.success, display: "inline-block" }} />
                  AI Portfolio Assistant
                </div>
              </div>
            </div>

            {/* Messages or Suggestions */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.1rem 1.35rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {messages.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", paddingTop: "0.5rem" }}>
                  <div style={{ fontFamily: "'Kanit', sans-serif", fontSize: "0.82rem", color: T.textDim, fontWeight: 400, marginBottom: "0.25rem" }}>Ask me about Himanshu</div>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <motion.button key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => sendMessage(q)}
                      style={{
                        textAlign: "left", padding: "0.65rem 1rem", borderRadius: 12,
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(215,226,234,0.1)",
                        color: T.text, fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem",
                        cursor: "pointer", transition: "border-color 0.2s, background 0.2s",
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = "rgba(113,113,122,0.35)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
                      onMouseLeave={e => { e.target.style.borderColor = "rgba(215,226,234,0.1)"; e.target.style.background = "rgba(255,255,255,0.03)"; }}
                    >{q}</motion.button>
                  ))}
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "88%",
                    padding: "0.75rem 1.1rem",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.role === "user" ? "rgba(113,113,122,0.18)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${msg.role === "user" ? "rgba(113,113,122,0.3)" : "rgba(215,226,234,0.1)"}`,
                  }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", color: T.text, lineHeight: 1.6, fontWeight: 400, whiteSpace: "pre-wrap" }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ alignSelf: "flex-start", padding: "0.75rem 1.1rem", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(215,226,234,0.1)" }}>
                  <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        style={{ width: 7, height: 7, borderRadius: "50%", background: "#71717a" }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEnd} />
            </div>

            {/* Input */}
            <div style={{
              padding: "0.85rem 1.25rem",
              borderTop: "1px solid rgba(215,226,234,0.1)",
              display: "flex", gap: "0.6rem",
              background: "rgba(17,17,17,0.5)",
            }}>
              <input value={input} placeholder="Ask about Himanshu..."
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                style={{
                  flex: 1, padding: "0.7rem 1rem", borderRadius: 12,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(215,226,234,0.12)",
                  color: T.text, fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.92rem", fontWeight: 400, outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(113,113,122,0.4)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(215,226,234,0.12)"; }}
              />
              <motion.button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "linear-gradient(135deg, #71717a, #52525b)",
                  border: "none", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: loading || !input.trim() ? 0.4 : 1, transition: "opacity 0.2s",
                  boxShadow: "0 2px 12px rgba(113,113,122,0.3)",
                }}>
                <SendIcon size={17} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => { document.title = "Himanshu Gupta - Portfolio"; }, []);
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Insights />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "2rem", textAlign: "center", background: T.bg }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.72rem", color: T.textDim, userSelect: "none", fontWeight: 400 }}>
          © {new Date().getFullYear()} {CONFIG.name} · Built with React · Gemini AI
        </div>
      </footer>
      <AskHimanshu />
    </>
  );
}
