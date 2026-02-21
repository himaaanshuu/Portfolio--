import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#ffffff", bgAlt: "#f7f7f8", bgCard: "#ffffff",
  bgCardHover: "rgba(0,0,0,0.03)", border: "rgba(0,0,0,0.08)",
  borderAccent: "rgba(0,0,0,0.14)", accent: "#000000", accentBright: "#111111",
  accentGlow: "rgba(0,0,0,0.04)", amber: "#b45309", amberBright: "#d97706",
  amberDim: "rgba(180,83,9,0.06)", text: "#0a0a0a", textMid: "#4b5563",
  textDim: "#6b7280", success: "#059669", danger: "#dc2626",
};

// ─── HARDCODED CONFIG ─────────────────────────────────────────────────────────
const CONFIG = {
  name: "Himanshu Gupta",
  title: "B.Tech CSE Student",
  subtitle: "Frontend Developer · SQL Specialist · Aspiring Data Analyst",
  intro: "2nd year Computer Science student building clean, performant UIs and structured data solutions. Focused on frontend engineering and database design for placement-ready projects.",
  email: "himanshu2005gupta@gmail.com",
  github: "himaaanshuu",
  linkedin: "himanshu-gupta-9b5490338",
  resumeUrl: "file:///Users/himanshu/Downloads/Himanshu%20Gupta.pdf",
  college: "Galgotias University",
  semester: "4th Semester (2024–2028)",
};

const SKILLS = {
  "Frontend": [{ name: "HTML5", level: 90 }, { name: "CSS3", level: 88 }, { name: "JavaScript", level: 82 }, { name: "React", level: 72 }],
  "Database & DBMS": [{ name: "SQL", level: 88 }, { name: "MySQL", level: 85 }, { name: "Normalization", level: 78 }, { name: "Joins & Indexing", level: 80 }],
  "Data & Analytics": [{ name: "Python", level: 70 }, { name: "Pandas", level: 65 }, { name: "NumPy", level: 63 }, { name: "Visualization", level: 60 }],
  "Tools": [{ name: "Git & GitHub", level: 85 }, { name: "VS Code", level: 90 }, { name: "Postman", level: 68 }, { name: "Linux CLI", level: 62 }],
};

const EDUCATION = {
  degree: "B.Tech in Computer Science & Engineering",
  duration: "2024 – 2028",
  coursework: ["Data Structures & Algorithms", "Database Management Systems", "Operating Systems", "Computer Networks", "Object-Oriented Programming", "Discrete Mathematics"],
};

const PROJECTS = [
  {
    id: "p1",
    name: "Bitez",
    title: "Bitez",
    description: "Campus food ordering experience with a Vite + React frontend and an Express + MongoDB backend. Student and admin authentication (OTP + JWT), order management, and a developer-friendly structure.",
    language: "React",
    tech: ["Vite", "React", "Express", "MongoDB", "JWT"],
    html_url: "https://github.com/himaaanshuu/BItz",
    homepage: "https://b-itz-web4.vercel.app",
    stargazers_count: 0,
  },
  {
    id: "p2",
    name: "Student Performance Analysis",
    title: "Student Performance Analysis",
    description: "End-to-end student performance analysis pipeline built with Python and MySQL. Ingests student marks from CSV files, cleans and processes data, stores it in MySQL, and computes per-student performance summaries with SQL views.",
    language: "Python",
    tech: ["Python", "Pandas", "MySQL"],
    html_url: "https://github.com/himaaanshuu/Student-Performance-Analysis",
    homepage: null,
    stargazers_count: 0,
  },
  {
    id: "p3",
    name: "Hospital Management System",
    title: "Hospital Management System",
    description: "A Java Swing application for managing hospital operations with PostgreSQL database, multithreading, and a professional GUI for handling patients, staff, and appointments.",
    language: "Java",
    tech: ["Java", "Swing", "PostgreSQL"],
    html_url: "https://github.com/himaaanshuu/Healthcare-Management-System",
    homepage: null,
    stargazers_count: 0,
  },
];

const ACHIEVEMENTS = [
  { title: "JOB SIMULATION AS A DATA ANALYST", org: "DELOITTE AUSTRALIA", year: "2026" },
  { title: "SQL CERTIFICATION", org: "ORACLE", year: "2025" },
];

const BAR_DATA = [
  { month: "Aug", commits: 12 }, { month: "Sep", commits: 28 }, { month: "Oct", commits: 19 },
  { month: "Nov", commits: 44 }, { month: "Dec", commits: 31 }, { month: "Jan", commits: 57 },
];
const LINE_DATA = [
  { week: "W1", html: 40, css: 30, js: 20, sql: 25 },
  { week: "W2", html: 45, css: 38, js: 28, sql: 32 },
  { week: "W3", html: 50, css: 45, js: 35, sql: 40 },
  { week: "W4", html: 55, css: 52, js: 45, sql: 48 },
  { week: "W5", html: 58, css: 58, js: 54, sql: 55 },
  { week: "W6", html: 62, css: 63, js: 62, sql: 60 },
];

const CAT_COLORS = { "Frontend": "#6d28d9", "Database & DBMS": "#0891b2", "Data & Analytics": "#b45309", "Tools": "#be185d" };

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
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useIntersect(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") return window.matchMedia(query).matches;
    return false;
  });
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({ tag, title, sub }) {
  const [ref, visible] = useIntersect();
  return (
    <div ref={ref} style={{ marginBottom: "3rem", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
      <div style={{ fontFamily: "'Space Mono', monospace", color: T.textDim, fontSize: "0.68rem", marginBottom: "0.5rem", letterSpacing: "0.12em" }}>{`// ${tag}`}</div>
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, color: T.text, margin: 0, letterSpacing: "-0.025em" }}>{title}</h2>
      {sub && <p style={{ color: T.textMid, marginTop: "0.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.93rem", maxWidth: 600 }}>{sub}</p>}
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = ["About", "Skills", "Projects", "Insights", "Education", "Contact"];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled || menuOpen ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "none",
        transition: "all 0.3s ease", padding: "0 1.5rem",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <a href="#hero" style={{ fontFamily: "'Space Mono', monospace", color: T.text, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", letterSpacing: "-0.02em" }}>
            {CONFIG.name.split(" ")[0]}<span style={{ opacity: 0.35 }}>.dev</span>
          </a>

          {!isMobile && (
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              {navLinks.map(l => (
                <button key={l} onClick={() => scrollTo(l.toLowerCase())}
                  style={{ color: T.textMid, fontSize: "0.75rem", fontFamily: "'Space Mono', monospace", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => { e.target.style.color = T.text; }}
                  onMouseLeave={e => { e.target.style.color = T.textMid; }}>
                  {l}
                </button>
              ))}
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                {CONFIG.github && (
                  <a href={`https://github.com/${CONFIG.github}`} target="_blank" rel="noreferrer"
                    style={{ color: T.textMid, transition: "color 0.2s", display: "flex" }}
                    onMouseEnter={e => { e.currentTarget.style.color = T.text; }}
                    onMouseLeave={e => { e.currentTarget.style.color = T.textMid; }}>
                    <GithubIcon size={17} />
                  </a>
                )}
                {CONFIG.linkedin && (
                  <a href={`https://www.linkedin.com/in/${CONFIG.linkedin}`} target="_blank" rel="noreferrer"
                    style={{ color: T.textMid, transition: "color 0.2s", display: "flex" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#0a66c2"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = T.textMid; }}>
                    <LinkedinIcon size={17} />
                  </a>
                )}
              </div>
            </div>
          )}

          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ background: "none", border: "none", cursor: "pointer", color: T.text, display: "flex", alignItems: "center", padding: "0.25rem" }}>
              {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          )}
        </div>

        {/* Mobile Dropdown */}
        {isMobile && menuOpen && (
          <div style={{ borderTop: `1px solid ${T.border}`, padding: "1rem 1.5rem 1.5rem" }}>
            {navLinks.map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "0.75rem 0", color: T.textMid, fontSize: "0.85rem", fontFamily: "'Space Mono', monospace", background: "none", border: "none", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
                {l}
              </button>
            ))}
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem" }}>
              {CONFIG.github && (
                <a href={`https://github.com/${CONFIG.github}`} target="_blank" rel="noreferrer"
                  style={{ color: T.textMid, display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", textDecoration: "none" }}>
                  <GithubIcon size={16} /> GitHub
                </a>
              )}
              {CONFIG.linkedin && (
                <a href={`https://www.linkedin.com/in/${CONFIG.linkedin}`} target="_blank" rel="noreferrer"
                  style={{ color: "#0a66c2", display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", textDecoration: "none" }}>
                  <LinkedinIcon size={16} /> LinkedIn
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const [typed, setTyped] = useState("");
  const full = CONFIG.subtitle;

  useEffect(() => {
    setTyped("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(iv);
    }, 38);
    return () => clearInterval(iv);
  }, [full]);

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      background: `radial-gradient(ellipse 90% 70% at 60% 40%, rgba(109,40,217,0.06) 0%, transparent 65%), ${T.bg}`,
      position: "relative", overflow: "hidden", padding: "0 1.5rem",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`, backgroundSize: "72px 72px", maskImage: "radial-gradient(ellipse 85% 85% at 60% 40%, black 20%, transparent 80%)" }} />
      <div style={{ position: "absolute", top: "18%", right: "10%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "22%", left: "2%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,83,9,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1, paddingTop: "5rem", width: "100%" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 1rem", borderRadius: 20, background: T.amberDim, border: "1px solid rgba(180,83,9,0.18)", marginBottom: "1.75rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.amberBright, display: "inline-block" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.64rem", color: T.amber, letterSpacing: "0.08em" }}>2nd Year · B.Tech CSE</span>
        </div>

        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2.4rem, 8vw, 5.5rem)", fontWeight: 900, color: T.text, lineHeight: 1.05, margin: "0 0 0.5rem", letterSpacing: "-0.03em" }}>
          {CONFIG.name.split(" ")[0]}{" "}
          <span style={{ WebkitTextFillColor: "transparent", background: "linear-gradient(135deg, #000 20%, #6d28d9 100%)", WebkitBackgroundClip: "text" }}>
            {CONFIG.name.split(" ").slice(1).join(" ")}
          </span>
        </h1>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(0.68rem, 1.5vw, 0.9rem)", color: T.textMid, margin: "1.25rem 0", minHeight: "1.5rem" }}>
          {typed}<span style={{ animation: "blink 1s step-end infinite", color: T.amberBright }}>|</span>
        </div>

        <p style={{ color: T.textMid, fontSize: "clamp(0.88rem, 2vw, 1rem)", maxWidth: 500, lineHeight: 1.8, margin: "0 0 2.5rem", fontFamily: "'DM Sans', sans-serif" }}>{CONFIG.intro}</p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "0.78rem 1.75rem", borderRadius: 8, border: "none", cursor: "pointer", background: T.text, color: "#fff", fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", fontWeight: 700, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
            View Projects
          </button>

          {CONFIG.resumeUrl && CONFIG.resumeUrl !== "#" && (
            <a href={CONFIG.resumeUrl} target="_blank" rel="noreferrer"
              style={{ padding: "0.78rem 1.5rem", borderRadius: 8, textDecoration: "none", background: "transparent", border: `1px solid ${T.border}`, color: T.textMid, fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.text; e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}>
              ↓ Resume
            </a>
          )}

          {CONFIG.github && (
            <a href={`https://github.com/${CONFIG.github}`} target="_blank" rel="noreferrer"
              style={{ padding: "0.78rem 1.25rem", borderRadius: 8, textDecoration: "none", background: "transparent", border: `1px solid ${T.border}`, color: T.textMid, display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.textMid; e.currentTarget.style.borderColor = T.border; }}>
              <GithubIcon size={16} /> GitHub
            </a>
          )}

          {CONFIG.linkedin && (
            <a href={`https://www.linkedin.com/in/${CONFIG.linkedin}`} target="_blank" rel="noreferrer"
              style={{ padding: "0.78rem 1.25rem", borderRadius: 8, textDecoration: "none", background: "rgba(10,102,194,0.06)", border: "1px solid rgba(10,102,194,0.18)", color: "#3b82f6", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(10,102,194,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(10,102,194,0.06)"; }}>
              <LinkedinIcon size={16} /> LinkedIn
            </a>
          )}
        </div>

        <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", marginTop: "4rem", paddingTop: "2rem", borderTop: `1px solid ${T.border}`, flexWrap: "wrap" }}>
          {[["2nd", "Year"], ["3+", "Projects"], ["4", "Certs"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 900, color: T.text }}>{v}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.15rem" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About() {
  const [ref, visible] = useIntersect();
  return (
    <section id="about" style={{ padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="01" title="About Me" />
        <div ref={ref} className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: "all 0.6s ease" }}>
          <div>
            <p style={{ color: T.textMid, lineHeight: 1.85, marginBottom: "1.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: "1rem" }}>
              I'm a 2nd-year Computer Science student at <strong style={{ color: T.text }}>{CONFIG.college}</strong>, {CONFIG.semester}. My core strength is <strong style={{ color: T.text }}>frontend development</strong> — building structured, accessible, and performant web interfaces using HTML, CSS, JavaScript, and React.
            </p>
            <p style={{ color: T.textMid, lineHeight: 1.85, marginBottom: "1.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: "1rem" }}>
              I have a solid foundation in <strong style={{ color: T.text }}>SQL and relational database design</strong>, including normalization, joins, indexing, and stored procedures.
            </p>
            <p style={{ color: T.textMid, lineHeight: 1.85, fontFamily: "'DM Sans', sans-serif", fontSize: "1rem" }}>
              Currently expanding into <strong style={{ color: T.text }}>Data Science</strong> with Python, Pandas, and NumPy — building practical data pipelines and analysis workflows.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {[
              { label: "Focus", value: "Frontend Dev + SQL" },
              { label: "Learning", value: "Python · Pandas · NumPy" },
              { label: "Year", value: "2nd Year · " + CONFIG.semester },
              { label: "Available For", value: "Internships · Placement 2027" },
            ].map(item => (
              <div key={item.label} style={{ padding: "1rem 1.4rem", borderRadius: 8, background: "#fafafa", border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: T.textMid }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────
function SkillCard({ cat, items, index }) {
  const [ref, visible] = useIntersect();
  const color = CAT_COLORS[cat];
  return (
    <div ref={ref} style={{ padding: "1.75rem", borderRadius: 12, background: "#fff", border: `1px solid ${T.border}`, borderTop: `2px solid ${color}`, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: `all 0.5s ease ${index * 0.08}s` }}>
      <div style={{ fontFamily: "'Space Mono', monospace", color, fontSize: "0.63rem", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1.4rem" }}>{cat}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map(skill => (
          <div key={skill.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: T.textMid }}>{skill.name}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", color: T.textDim }}>{skill.level}%</span>
            </div>
            <div style={{ height: 2, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: visible ? `${skill.level}%` : "0%", background: color, borderRadius: 2, transition: `width 1s ease ${index * 0.08 + 0.3}s` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Skills() {
  return (
    <section id="skills" style={{ padding: "6rem 1.5rem", background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="02" title="Skills" sub="Domain-categorized proficiency overview." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {Object.entries(SKILLS).map(([cat, items], i) => <SkillCard key={cat} cat={cat} items={items} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
function ProjectCard({ p, i }) {
  const [ref, visible] = useIntersect();
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ padding: "1.75rem", borderRadius: 12, position: "relative", background: hover ? T.bgCardHover : "#fff", border: `1px solid ${hover ? T.borderAccent : T.border}`, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: `opacity 0.5s ease ${(i % 4) * 0.07}s, transform 0.5s ease ${(i % 4) * 0.07}s, background 0.2s, border 0.2s` }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.8rem" }}>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", fontWeight: 700, color: T.text, margin: 0 }}>{p.title || p.name}</h3>
        <div style={{ display: "flex", gap: "0.4rem", marginLeft: "0.5rem", flexShrink: 0 }}>
          {p.html_url && (
            <a href={p.html_url} target="_blank" rel="noreferrer"
              style={{ color: T.textDim, transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.textDim; }}>
              <GithubIcon size={15} />
            </a>
          )}
          {p.homepage && (
            <a href={p.homepage} target="_blank" rel="noreferrer"
              style={{ color: T.textDim, transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.textDim; }}>
              <ExternalIcon size={13} />
            </a>
          )}
        </div>
      </div>
      <p style={{ color: T.textMid, fontSize: "0.84rem", lineHeight: 1.68, marginBottom: "1.2rem", fontFamily: "'DM Sans', sans-serif" }}>
        {(p.description || "").slice(0, 120)}{(p.description || "").length > 120 ? "…" : ""}
      </p>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
        {(p.tech || (p.language ? [p.language] : [])).map(t => (
          <span key={t} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", padding: "0.25rem 0.6rem", borderRadius: 4, background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.12)", color: "#6d28d9" }}>{t}</span>
        ))}
        {p.stargazers_count > 0 && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", padding: "0.25rem 0.6rem", borderRadius: 4, background: T.amberDim, border: "1px solid rgba(180,83,9,0.12)", color: T.amber, marginLeft: "auto" }}>⭐ {p.stargazers_count}</span>
        )}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" style={{ padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="03" title="Projects" sub="Featured projects showcasing frontend, database, and data engineering work." />
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", color: T.amber, letterSpacing: "0.1em", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.amberBright, display: "inline-block" }} />
          FEATURED ({PROJECTS.length} projects)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.1rem" }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── INSIGHTS ────────────────────────────────────────────────────────────────
function Insights() {
  const [ref, visible] = useIntersect();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const tt = {
    background: "#1f2937", border: `1px solid ${T.border}`,
    borderRadius: 6, fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#f9fafb",
  };

  const chartHeight = isMobile ? 160 : 200;

  return (
    <section id="insights" style={{ padding: "6rem 1.5rem", background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="04" title="Activity Insights" sub="Developer activity metrics — last 6 months." />
        <div
          ref={ref}
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "1.5rem",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          {/* Commits Chart */}
          <div style={{ padding: isMobile ? "1.25rem" : "1.75rem", borderRadius: 12, background: "#fff", border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'Space Mono', monospace", color: T.textDim, fontSize: "0.63rem", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>MONTHLY_COMMITS</div>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={BAR_DATA} margin={{ top: 0, right: 0, left: isMobile ? -28 : -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fill: T.textDim, fontSize: isMobile ? 9 : 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textDim, fontSize: isMobile ? 9 : 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tt} cursor={{ fill: "rgba(109,40,217,0.04)" }} />
                <Bar dataKey="commits" fill={T.text} radius={[3, 3, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Skill Progression Chart */}
          <div style={{ padding: isMobile ? "1.25rem" : "1.75rem", borderRadius: 12, background: "#fff", border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'Space Mono', monospace", color: T.amber, fontSize: "0.63rem", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>SKILL_PROGRESSION</div>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={LINE_DATA} margin={{ top: 0, right: 0, left: isMobile ? -28 : -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="week" tick={{ fill: T.textDim, fontSize: isMobile ? 9 : 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textDim, fontSize: isMobile ? 9 : 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tt} />
                <Line type="monotone" dataKey="html" stroke={T.text} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="css" stroke="#0891b2" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="js" stroke={T.amberBright} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sql" stroke="#be185d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: isMobile ? "0.75rem" : "1.25rem", marginTop: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {[["HTML", T.text], ["CSS", "#0891b2"], ["JS", T.amberBright], ["SQL", "#be185d"]].map(([l, c]) => (
                <span key={l} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim }}>
                  <span style={{ width: 14, height: 2, background: c, display: "inline-block", borderRadius: 1 }} />{l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── EDUCATION ───────────────────────────────────────────────────────────────
function Education() {
  const [ref, visible] = useIntersect();
  return (
    <section id="education" style={{ padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="05" title="Education" />
        <div ref={ref} className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.6s ease" }}>
          <div style={{ padding: "2rem", borderRadius: 12, background: "#fff", border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.text}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: T.text, margin: 0 }}>{EDUCATION.degree}</h3>
                <p style={{ color: T.textMid, margin: "0.4rem 0 0", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem" }}>{CONFIG.college}</p>
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", color: T.textMid, background: "#f3f4f6", padding: "0.3rem 0.7rem", borderRadius: 4, whiteSpace: "nowrap" }}>{EDUCATION.duration}</span>
            </div>
            <div style={{ marginTop: "1rem", fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", color: T.textDim }}>{CONFIG.semester}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", color: T.textDim, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Relevant Coursework</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {EDUCATION.coursework.map(c => (
                <div key={c} style={{ padding: "0.6rem 1rem", borderRadius: 7, fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: T.textMid, background: "#fff", border: `1px solid ${T.border}`, borderLeft: "2px solid rgba(109,40,217,0.3)" }}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────
function Achievements() {
  const [ref, visible] = useIntersect();
  return (
    <section id="achievements" style={{ padding: "6rem 1.5rem", background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="06" title="Achievements" />
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.6s ease" }}>
          {ACHIEVEMENTS.map(a => (
            <div
              key={a.title}
              style={{ padding: "1.5rem", borderRadius: 10, background: "#fff", border: `1px solid ${T.border}`, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderAccent; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.56rem", color: T.amber, marginBottom: "0.75rem", letterSpacing: "0.1em" }}>CERTIFIED</div>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: T.text, margin: "0 0 0.4rem", fontSize: "0.93rem" }}>{a.title}</h4>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: T.textMid }}>{a.org}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim, marginTop: "0.75rem" }}>{a.year}</div>
            </div>
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
  const [ref, visible] = useIntersect();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (form.message.trim().length < 20) e.message = "Min 20 characters";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSent(true);
  };

  const inp = (err) => ({
    width: "100%", padding: "0.8rem 1rem", borderRadius: 7, boxSizing: "border-box",
    background: "#fafafa", border: `1px solid ${err ? "rgba(220,38,38,0.4)" : T.border}`,
    color: T.text, fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", outline: "none", transition: "border-color 0.2s",
  });

  return (
    <section id="contact" style={{ padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="07" title="Contact" sub="Open to internships and placement opportunities." />
        <div ref={ref} className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.6s ease" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {[
              { label: "Email", value: CONFIG.email, href: `mailto:${CONFIG.email}`, color: T.text },
              ...(CONFIG.github ? [{ label: "GitHub", value: `@${CONFIG.github}`, href: `https://github.com/${CONFIG.github}`, color: T.text }] : []),
              ...(CONFIG.linkedin ? [{ label: "LinkedIn", value: `in/${CONFIG.linkedin}`, href: `https://www.linkedin.com/in/${CONFIG.linkedin}`, color: "#0a66c2" }] : []),
            ].map(c => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                style={{ padding: "1.1rem 1.4rem", borderRadius: 8, textDecoration: "none", background: "#fafafa", border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s", gap: "1rem", flexWrap: "wrap" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderAccent; e.currentTarget.style.background = T.bgCardHover; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = "#fafafa"; }}
              >
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.label}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: c.color, wordBreak: "break-all" }}>{c.value}</span>
              </a>
            ))}
            {CONFIG.resumeUrl && CONFIG.resumeUrl !== "#" && (
              <a
                href={CONFIG.resumeUrl}
                target="_blank"
                rel="noreferrer"
                style={{ padding: "0.8rem 1.4rem", borderRadius: 8, textDecoration: "none", textAlign: "center", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.15)", color: "#6d28d9", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(109,40,217,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(109,40,217,0.06)"; }}
              >
                ↓ Download Resume
              </a>
            )}
          </div>

          <div>
            {sent ? (
              <div style={{ textAlign: "center", padding: "3rem", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 12, background: "rgba(5,150,105,0.04)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: T.success, marginBottom: "0.5rem" }}>Message sent.</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: T.textMid }}>I'll get back to you soon.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { key: "name", label: "Name", type: "text", placeholder: "Your name" },
                  { key: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem" }}>{field.label}</label>
                    <input
                      type={field.type}
                      value={form[field.key]}
                      placeholder={field.placeholder}
                      onChange={e => { setForm(f => ({ ...f, [field.key]: e.target.value })); setErrors(er => ({ ...er, [field.key]: undefined })); }}
                      onFocus={e => { e.target.style.borderColor = T.borderAccent; }}
                      onBlur={e => { e.target.style.borderColor = errors[field.key] ? "rgba(220,38,38,0.4)" : T.border; }}
                      style={inp(errors[field.key])}
                    />
                    {errors[field.key] && <div style={{ color: T.danger, fontSize: "0.7rem", marginTop: "0.3rem", fontFamily: "'Space Mono', monospace" }}>{errors[field.key]}</div>}
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem" }}>Message</label>
                  <textarea
                    value={form.message}
                    rows={4}
                    placeholder="Your message…"
                    onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: undefined })); }}
                    onFocus={e => { e.target.style.borderColor = T.borderAccent; }}
                    onBlur={e => { e.target.style.borderColor = errors.message ? "rgba(220,38,38,0.4)" : T.border; }}
                    style={{ ...inp(errors.message), resize: "vertical", minHeight: 100 }}
                  />
                  {errors.message && <div style={{ color: T.danger, fontSize: "0.7rem", marginTop: "0.3rem", fontFamily: "'Space Mono', monospace" }}>{errors.message}</div>}
                </div>
                <button
                  onClick={submit}
                  style={{ padding: "0.85rem", borderRadius: 8, cursor: "pointer", background: T.text, border: "none", color: "#fff", fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", fontWeight: 700, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  Send Message →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => { document.title = "Himanshu Gupta - Portfolio"; }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800;900&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${T.bg}; color: ${T.text}; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 2px; }
        textarea { font-family: inherit; }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

        /* ── Responsive two-col layout ── */
        @media (max-width: 768px) {
          .two-col {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }

        /* ── Extra small screens ── */
        @media (max-width: 480px) {
          section { padding-left: 1rem !important; padding-right: 1rem !important; }
        }
      `}</style>

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

      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "2rem", textAlign: "center" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", color: T.textDim, userSelect: "none" }}>
          © {new Date().getFullYear()} {CONFIG.name} · Built with ❤
        </div>
      </footer>
    </>
  );
}