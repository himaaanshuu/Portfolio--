import { useState, useEffect, useRef, useCallback } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#ffffff", bgAlt: "#f7f7f8", bgCard: "#ffffff",
  bgCardHover: "rgba(0,0,0,0.03)", border: "rgba(0,0,0,0.08)",
  borderAccent: "rgba(0,0,0,0.14)", accent: "#000000", accentBright: "#111111",
  accentGlow: "rgba(0,0,0,0.04)", amber: "#b45309", amberBright: "#d97706",
  amberDim: "rgba(180,83,9,0.06)", text: "#0a0a0a", textMid: "#4b5563",
  textDim: "#6b7280", success: "#059669", danger: "#dc2626",
};

// ─── PERSISTENT STORAGE HELPERS ──────────────────────────────────────────────
const store = {
  async get(key) {
    try {
      if (window.storage) {
        const res = await window.storage.get(key);
        return res ? JSON.parse(res.value) : null;
      }
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  },
  async set(key, val) {
    try {
      if (window.storage) {
        await window.storage.set(key, JSON.stringify(val));
      } else {
        localStorage.setItem(key, JSON.stringify(val));
      }
    } catch { }
  },
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  name: "Himanshu Gupta",
  title: "B.Tech CSE Student",
  subtitle: "Frontend Developer · SQL Specialist · Aspiring Data Analyst",
  intro: "2nd year Computer Science student building clean, performant UIs and structured data solutions. Focused on frontend engineering and database design for placement-ready projects.",
  email: "himanshu2005gupta@gmail.com",
  github: "himaaanshuu",
  linkedin: "himanshu-gupta-9b549033",
  resumeUrl: "#",
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
  degree: "B.Tech in Computer Science & Engineering", duration: "2023 – 2027",
  coursework: ["Data Structures & Algorithms", "Database Management Systems", "Operating Systems", "Computer Networks", "Object-Oriented Programming", "Discrete Mathematics"],
};

const DEFAULT_PROJECTS = [
  {
    id: "default_1",
    name: "Bitez",
    title: "Bitez",
    description: "Bitez is a campus food ordering experience with a Vite + React frontend and an Express + MongoDB backend. It provides student and admin authentication (OTP + JWT), order management, and a developer-friendly structure split into frontend and backend packages.",
    language: "React",
    tech: ["Vite", "React", "Express", "MongoDB", "JWT"],
    html_url: "https://github.com/himaaanshuu/BItz",
    homepage: "https://b-itz-web4.vercel.app",
    stargazers_count: 0,
    _default: true,
  },
  {
    id: "default_2",
    name: "Student Performance Analysis",
    title: "Student Performance Analysis",
    description: "An end-to-end student performance analysis pipeline built with Python and MySQL. Ingests student marks from CSV files, cleans and processes data, stores it in MySQL, and computes per-student performance summaries with pass/average/fail status using SQL views.",
    language: "Python",
    tech: ["Python", "Pandas", "MySQL"],
    html_url: "https://github.com/himaaanshuu/Student-Performance-Analysis",
    homepage: null,
    stargazers_count: 0,
    _default: true,
  },
  {
    id: "default_3",
    name: "Hospital Management System",
    title: "Hospital Management System",
    description: "A Java Swing application for managing hospital operations with PostgreSQL database, multithreading, and a professional GUI for handling patients, staff, and appointments.",
    language: "Java",
    tech: ["Java", "Swing", "PostgreSQL"],
    html_url: "https://github.com/himaaanshuu/Healthcare-Management-System",
    homepage: null,
    stargazers_count: 0,
    _default: true,
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
  { week: "W1", html: 40, css: 30, js: 20, sql: 25 }, { week: "W2", html: 45, css: 38, js: 28, sql: 32 },
  { week: "W3", html: 50, css: 45, js: 35, sql: 40 }, { week: "W4", html: 55, css: 52, js: 45, sql: 48 },
  { week: "W5", html: 58, css: 58, js: 54, sql: 55 }, { week: "W6", html: 62, css: 63, js: 62, sql: 60 },
];

const LANG_COLORS = { JavaScript: "#f7df1e", Python: "#3572A5", HTML: "#e34c26", CSS: "#264de4", TypeScript: "#3178c6", SQL: "#336791", Java: "#b07219" };
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
const SettingsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const ExternalIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);
const TrashIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const CheckIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const EditIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
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

// ─── STORAGE HOOK — FIX: use useRef to avoid defaultValue reference instability ──
function usePersistedState(storageKey, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);
  // FIX: store defaultValue in a ref so it doesn't trigger useEffect re-runs
  const defaultRef = useRef(defaultValue);

  useEffect(() => {
    store.get(storageKey).then(saved => {
      const def = defaultRef.current;
      if (saved !== null) {
        setValue(prev => Array.isArray(def) ? saved : { ...prev, ...saved });
      }
      setLoaded(true);
    });
  }, [storageKey]); // FIX: removed defaultValue from deps — using ref instead

  const setAndPersist = useCallback((updater) => {
    setValue(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      store.set(storageKey, next);
      return next;
    });
  }, [storageKey]);

  return [value, setAndPersist, loaded];
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const FIELD_STYLE = {
  width: "100%", padding: "0.65rem 0.9rem", borderRadius: 6, boxSizing: "border-box",
  background: "#fafafa", border: `1px solid ${T.border}`, color: T.text,
  fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", outline: "none", transition: "border-color 0.2s",
};
const LABEL_STYLE = {
  display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
  color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem",
};

function Field({ fkey, label, placeholder, type = "text", form, setForm }) {
  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <input
        type={type}
        value={form[fkey] || ""}
        placeholder={placeholder}
        onChange={e => setForm(f => ({ ...f, [fkey]: e.target.value }))}
        onFocus={e => { e.target.style.borderColor = T.borderAccent; }}
        onBlur={e => { e.target.style.borderColor = T.border; }}
        style={FIELD_STYLE}
      />
    </div>
  );
}

// ─── PIN GATE ────────────────────────────────────────────────────────────────
const OWNER_PIN = "1234";

function PinGate({ onSuccess, onCancel }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const attempt = useCallback(() => {
    if (pin === OWNER_PIN) {
      onSuccess();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 1500);
    }
  }, [pin, onSuccess]);

  // FIX: stable keydown handler with proper deps
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Enter") attempt(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [attempt]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ width: 340, background: "#fff", border: `1px solid ${error ? "rgba(220,38,38,0.3)" : T.border}`, borderRadius: 16, padding: "2rem", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", transition: "border-color 0.3s" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.amber, letterSpacing: "0.12em", marginBottom: "0.5rem" }}>{`// OWNER_ACCESS`}</div>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: T.text, fontSize: "1.3rem", margin: "0 0 0.35rem" }}>Enter PIN</h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: T.textMid, marginBottom: "1.5rem" }}>Settings are restricted to the site owner.</p>
        <input
          autoFocus
          type="password"
          value={pin}
          placeholder="••••"
          maxLength={8}
          onChange={e => { setPin(e.target.value); setError(false); }}
          style={{ ...FIELD_STYLE, textAlign: "center", fontSize: "1.3rem", letterSpacing: "0.5em", border: `1px solid ${error ? "rgba(220,38,38,0.5)" : T.border}`, marginBottom: "0.5rem" }}
        />
        {error && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", color: T.danger, textAlign: "center", marginBottom: "0.5rem" }}>Incorrect PIN</div>}
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
          <button onClick={attempt} style={{ flex: 1, padding: "0.75rem", borderRadius: 7, cursor: "pointer", background: T.text, border: "none", color: "#fff", fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", fontWeight: 700 }}>Unlock</button>
          <button onClick={onCancel} style={{ padding: "0.75rem 1rem", borderRadius: 7, cursor: "pointer", background: "transparent", border: `1px solid ${T.border}`, color: T.textMid, fontFamily: "'Space Mono', monospace", fontSize: "0.75rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PANEL ──────────────────────────────────────────────────────────
function SettingsPanel({ config, onSave, open, setOpen, unlocked, showPin, setShowPin }) {
  const [form, setForm] = useState(config);
  const [saved, setSaved] = useState(false);

  // FIX: config as dep is fine here since we only want to sync form when config changes externally
  useEffect(() => { setForm(config); }, [config]);

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  if (!open) {
    if (!unlocked) return null;
    return (
      <>
        {showPin && (
          <PinGate
            onSuccess={() => { setShowPin(false); setOpen(true); }}
            onCancel={() => setShowPin(false)}
          />
        )}
        <button
          onClick={() => setOpen(true)}
          title="Portfolio Settings (Ctrl+Shift+S)"
          style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 200, width: 52, height: 52, borderRadius: 12, cursor: "pointer", background: "#fff", border: `1px solid ${T.border}`, color: T.text, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", transition: "transform 0.2s, box-shadow 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
        >
          <SettingsIcon size={19} />
        </button>
      </>
    );
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div
        style={{ width: "100%", maxWidth: 520, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 14, padding: "2rem", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: T.amber, letterSpacing: "0.12em", marginBottom: "0.25rem" }}>{`// PORTFOLIO_SETTINGS`}</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: T.text, fontSize: "1.4rem", margin: 0 }}>Customize</h3>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: T.textMid, cursor: "pointer", fontSize: "1.5rem", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <SectionDivider>Personal Info</SectionDivider>
          <Field fkey="name" label="Full Name" placeholder="Your full name" form={form} setForm={setForm} />
          <Field fkey="email" label="Email Address" placeholder="your@email.com" type="email" form={form} setForm={setForm} />
          <Field fkey="college" label="College / University" placeholder="Institute name" form={form} setForm={setForm} />
          <Field fkey="semester" label="Current Semester" placeholder="e.g. 3rd Semester (2023–2027)" form={form} setForm={setForm} />
          <Field fkey="intro" label="Bio / Intro" placeholder="Brief intro about yourself" form={form} setForm={setForm} />
          <SectionDivider>Social Links</SectionDivider>
          <GithubField form={form} setForm={setForm} />
          <LinkedinField form={form} setForm={setForm} />
          <Field fkey="resumeUrl" label="Resume URL (Google Drive or PDF)" placeholder="https://drive.google.com/..." form={form} setForm={setForm} />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem" }}>
          <button
            onClick={handleSave}
            style={{ flex: 1, padding: "0.85rem", borderRadius: 8, cursor: "pointer", background: saved ? T.success : T.text, border: "none", color: "#fff", fontFamily: "'Space Mono', monospace", fontSize: "0.78rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background 0.3s" }}
          >
            {saved ? <><CheckIcon size={15} /> Saved!</> : "Save Changes"}
          </button>
          <button onClick={() => setOpen(false)} style={{ padding: "0.85rem 1.25rem", borderRadius: 8, cursor: "pointer", background: "transparent", border: `1px solid ${T.border}`, color: T.textMid, fontFamily: "'Space Mono', monospace", fontSize: "0.78rem" }}>Cancel</button>
        </div>

        <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: 8, background: "rgba(5,150,105,0.05)", border: "1px solid rgba(5,150,105,0.15)", fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#059669" }}>
          ✓ Changes are saved persistently and will survive page reloads
        </div>
      </div>
    </div>
  );
}

function SectionDivider({ children }) {
  return (
    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.12em", padding: "0.5rem 0", borderBottom: `1px solid ${T.border}`, marginTop: "0.5rem" }}>
      {children}
    </div>
  );
}

function GithubField({ form, setForm }) {
  return (
    <div>
      <label style={{ ...LABEL_STYLE, display: "flex", alignItems: "center", gap: "0.4rem" }}><GithubIcon size={11} /> GitHub Username</label>
      <div style={{ display: "flex" }}>
        <span style={{ padding: "0.65rem 0.75rem", background: "#f5f5f5", border: `1px solid ${T.border}`, borderRight: "none", borderRadius: "6px 0 0 6px", fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: T.textDim, whiteSpace: "nowrap" }}>github.com/</span>
        <input
          value={form.github || ""}
          placeholder="username"
          onChange={e => setForm(f => ({ ...f, github: e.target.value }))}
          onFocus={e => { e.target.style.borderColor = T.borderAccent; }}
          onBlur={e => { e.target.style.borderColor = T.border; }}
          style={{ ...FIELD_STYLE, borderRadius: "0 6px 6px 0", flex: 1 }}
        />
      </div>
      {form.github && (
        <a
          href={`https://github.com/${form.github}`}
          target="_blank"
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ fontSize: "0.72rem", color: "#fff", background: T.text, fontFamily: "'Space Mono', monospace", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "0.5rem", padding: "0.35rem 0.8rem", borderRadius: 5, cursor: "pointer" }}
        >
          <ExternalIcon size={11} /> View GitHub Profile ↗
        </a>
      )}
    </div>
  );
}

function LinkedinField({ form, setForm }) {
  return (
    <div>
      <label style={{ ...LABEL_STYLE, display: "flex", alignItems: "center", gap: "0.4rem" }}><LinkedinIcon size={11} /> LinkedIn Username</label>
      <div style={{ display: "flex" }}>
        <span style={{ padding: "0.65rem 0.75rem", background: "#f5f5f5", border: `1px solid ${T.border}`, borderRight: "none", borderRadius: "6px 0 0 6px", fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: T.textDim, whiteSpace: "nowrap" }}>linkedin.com/in/</span>
        <input
          value={form.linkedin || ""}
          placeholder="username"
          onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
          onFocus={e => { e.target.style.borderColor = T.borderAccent; }}
          onBlur={e => { e.target.style.borderColor = T.border; }}
          style={{ ...FIELD_STYLE, borderRadius: "0 6px 6px 0", flex: 1 }}
        />
      </div>
      {form.linkedin && (
        <a
          href={`https://www.linkedin.com/in/${form.linkedin}`}
          target="_blank"
          rel="noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ fontSize: "0.72rem", color: "#fff", background: "#0a66c2", fontFamily: "'Space Mono', monospace", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginTop: "0.5rem", padding: "0.35rem 0.8rem", borderRadius: 5, cursor: "pointer" }}
        >
          <ExternalIcon size={11} /> View LinkedIn Profile ↗
        </a>
      )}
    </div>
  );
}

// ─── GITHUB IMPORTER ─────────────────────────────────────────────────────────
const BLANK_MANUAL = { name: "", description: "", language: "", html_url: "", homepage: "", stargazers_count: 0 };

function GitHubImporter({ config, addedProjects, onAdd }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("manual");
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [manual, setManual] = useState(BLANK_MANUAL);
  const [manualError, setManualError] = useState("");
  const [manualSuccess, setManualSuccess] = useState(false);

  // FIX: wrap fetchRepos in useCallback so it can be a stable dep
  const fetchRepos = useCallback(() => {
    if (!config.github) { setFetchError("Set your GitHub username in Settings first."); return; }
    setLoading(true); setFetchError("");
    fetch(`https://api.github.com/users/${config.github}/repos?per_page=100&sort=updated`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        if (Array.isArray(data)) setRepos(data.filter(r => !r.fork));
        else setFetchError("Unexpected response from GitHub API.");
        setLoading(false);
      })
      .catch(err => {
        setFetchError(`GitHub API unreachable (${err.message}). Use Manual Entry instead.`);
        setLoading(false);
      });
  }, [config.github]);

  // FIX: proper deps — fetchRepos is now stable via useCallback
  useEffect(() => {
    if (open && tab === "auto" && config.github && repos.length === 0 && !loading) {
      fetchRepos();
    }
  }, [open, tab, config.github, repos.length, loading, fetchRepos]);

  const handleManualAdd = () => {
    setManualError("");
    if (!manual.name.trim()) { setManualError("Project name is required."); return; }
    if (!manual.description.trim()) { setManualError("Description is required."); return; }
    const project = {
      id: `manual_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: manual.name.trim(),
      description: manual.description.trim(),
      language: manual.language.trim() || null,
      html_url: manual.html_url.trim() || null,
      homepage: manual.homepage.trim() || null,
      stargazers_count: parseInt(manual.stargazers_count, 10) || 0,
      _manual: true,
    };
    onAdd(project);
    setManual(BLANK_MANUAL);
    setManualSuccess(true);
    setTimeout(() => setManualSuccess(false), 2000);
  };

  const addedIds = new Set(addedProjects.map(p => p.id));
  const filtered = repos.filter(r =>
    !addedIds.has(r.id) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) || (r.description || "").toLowerCase().includes(search.toLowerCase()))
  );

  const inpStyle = { width: "100%", padding: "0.6rem 0.85rem", borderRadius: 6, boxSizing: "border-box", background: "#fafafa", border: `1px solid ${T.border}`, color: T.text, fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", outline: "none", transition: "border-color 0.2s" };
  const lblStyle = { display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.3rem", borderRadius: 8, cursor: "pointer", background: T.amberDim, border: `1px solid rgba(180,83,9,0.2)`, color: T.amber, fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", fontWeight: 700, transition: "all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(180,83,9,0.12)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = T.amberDim; }}
      >
        <PlusIcon size={13} /> Add Project
      </button>

      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{ width: "100%", maxWidth: 640, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, padding: "2rem", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem", flexShrink: 0 }}>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: T.amber, letterSpacing: "0.12em", marginBottom: "0.25rem" }}>{`// ADD_PROJECT`}</div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: T.text, fontSize: "1.2rem", margin: 0 }}>Add a Project</h3>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: T.textMid, cursor: "pointer", fontSize: "1.5rem", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", flexShrink: 0 }}>
              {[["manual", "✏ Manual Entry"], ["auto", "⚡ From GitHub API"]].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{ padding: "0.5rem 1.1rem", borderRadius: 6, cursor: "pointer", fontSize: "0.72rem", fontFamily: "'Space Mono', monospace", border: "none", transition: "all 0.2s", background: tab === key ? T.text : "#f3f4f6", color: tab === key ? "#fff" : T.textMid, fontWeight: tab === key ? 700 : 400 }}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "manual" && (
              <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ padding: "0.75rem 1rem", borderRadius: 8, background: "rgba(109,40,217,0.04)", border: "1px solid rgba(109,40,217,0.12)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: T.textMid, lineHeight: 1.6 }}>
                  Fill in your project details. <strong style={{ color: T.text }}>Name</strong> and <strong style={{ color: T.text }}>Description</strong> are required.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={lblStyle}>Project Name *</label>
                    <input value={manual.name} placeholder="e.g. my-portfolio" onChange={e => setManual(m => ({ ...m, name: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = T.borderAccent; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inpStyle} />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={lblStyle}>Description *</label>
                    <textarea value={manual.description} placeholder="What does this project do?" rows={2}
                      onChange={e => setManual(m => ({ ...m, description: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = T.borderAccent; }} onBlur={e => { e.target.style.borderColor = T.border; }}
                      style={{ ...inpStyle, resize: "vertical", minHeight: 60 }} />
                  </div>
                  <div>
                    <label style={lblStyle}>Primary Language</label>
                    <input value={manual.language} placeholder="e.g. JavaScript" onChange={e => setManual(m => ({ ...m, language: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = T.borderAccent; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inpStyle} />
                  </div>
                  <div>
                    <label style={lblStyle}>Stars</label>
                    <input type="number" min="0" value={manual.stargazers_count} onChange={e => setManual(m => ({ ...m, stargazers_count: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = T.borderAccent; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inpStyle} />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={lblStyle}>GitHub Repo URL (optional)</label>
                    <input value={manual.html_url} placeholder="https://github.com/you/repo" onChange={e => setManual(m => ({ ...m, html_url: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = T.borderAccent; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inpStyle} />
                  </div>
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={lblStyle}>Live Demo URL (optional)</label>
                    <input value={manual.homepage} placeholder="https://yourproject.vercel.app" onChange={e => setManual(m => ({ ...m, homepage: e.target.value }))}
                      onFocus={e => { e.target.style.borderColor = T.borderAccent; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inpStyle} />
                  </div>
                </div>
                {manualError && <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: T.danger }}>{manualError}</div>}
                <button
                  onClick={handleManualAdd}
                  style={{ padding: "0.8rem", borderRadius: 8, cursor: "pointer", border: "none", background: manualSuccess ? T.success : T.text, color: "#fff", fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background 0.3s" }}
                >
                  {manualSuccess ? <><CheckIcon size={15} /> Added!</> : <><PlusIcon size={14} /> Add Project</>}
                </button>
              </div>
            )}

            {tab === "auto" && (
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", flex: 1 }}>
                {!config.github ? (
                  <div style={{ textAlign: "center", padding: "2.5rem 1.5rem", background: T.amberDim, borderRadius: 10, border: "1px dashed rgba(180,83,9,0.2)" }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: T.amber, marginBottom: "0.5rem" }}>⚠ No GitHub username set</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: T.textMid }}>Add your GitHub username in Settings first, then return here.</div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", flexShrink: 0 }}>
                      <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search repositories…"
                        style={{ ...inpStyle, flex: 1 }}
                        onFocus={e => { e.target.style.borderColor = "rgba(180,83,9,0.4)"; }}
                        onBlur={e => { e.target.style.borderColor = T.border; }}
                      />
                      <button onClick={fetchRepos} style={{ padding: "0.6rem 1rem", borderRadius: 6, cursor: "pointer", background: "#f3f4f6", border: `1px solid ${T.border}`, color: T.textMid, fontFamily: "'Space Mono', monospace", fontSize: "0.7rem" }}>
                        {loading ? "…" : "Refresh"}
                      </button>
                    </div>

                    {fetchError && (
                      <div style={{ padding: "0.85rem 1rem", borderRadius: 8, background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.15)", marginBottom: "0.75rem", flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", color: T.danger, marginBottom: "0.3rem" }}>⚠ Cannot reach GitHub API</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.79rem", color: T.textMid, marginBottom: "0.5rem" }}>{fetchError}</div>
                        <button onClick={() => setTab("manual")} style={{ padding: "0.35rem 0.85rem", borderRadius: 5, cursor: "pointer", background: T.amberDim, border: "1px solid rgba(180,83,9,0.2)", color: T.amber, fontFamily: "'Space Mono', monospace", fontSize: "0.67rem" }}>
                          Switch to Manual Entry →
                        </button>
                      </div>
                    )}

                    <div style={{ overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {loading && <div style={{ textAlign: "center", padding: "3rem", fontFamily: "'Space Mono', monospace", fontSize: "0.78rem", color: T.textDim }}>Fetching repos from GitHub…</div>}
                      {!loading && !fetchError && filtered.length === 0 && (
                        <div style={{ textAlign: "center", padding: "3rem", fontFamily: "'Space Mono', monospace", fontSize: "0.78rem", color: T.textDim }}>
                          {repos.length === 0 ? "No repositories loaded. Click Refresh." : "No repos match your search."}
                        </div>
                      )}
                      {!loading && filtered.map(repo => (
                        <div
                          key={repo.id}
                          style={{ padding: "0.9rem 1.1rem", borderRadius: 10, background: "#fff", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: "1rem", transition: "border-color 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(180,83,9,0.25)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: T.text, fontSize: "0.9rem", marginBottom: "0.15rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{repo.name}</div>
                            <div style={{ color: T.textMid, fontSize: "0.76rem", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "0.35rem" }}>{repo.description || <em style={{ opacity: 0.5 }}>No description</em>}</div>
                            <div style={{ display: "flex", gap: "0.9rem" }}>
                              {repo.language && (
                                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim }}>
                                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: LANG_COLORS[repo.language] || "#8892a4", display: "inline-block" }} />{repo.language}
                                </span>
                              )}
                              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim }}>⭐ {repo.stargazers_count}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => onAdd(repo)}
                            style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.45rem 0.9rem", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", background: T.amberDim, border: "1px solid rgba(180,83,9,0.2)", color: T.amber, fontFamily: "'Space Mono', monospace", fontSize: "0.66rem", fontWeight: 700, flexShrink: 0 }}
                          >
                            <PlusIcon size={11} /> Add
                          </button>
                        </div>
                      ))}
                    </div>
                    {!loading && repos.length > 0 && (
                      <div style={{ marginTop: "0.6rem", fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim, textAlign: "center", flexShrink: 0 }}>
                        {filtered.length} repos shown · {addedProjects.length} added to portfolio
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
function SectionHeader({ tag, title, sub, action }) {
  const [ref, visible] = useIntersect();
  return (
    <div ref={ref} style={{ marginBottom: "3rem", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(20px)", transition: "all 0.6s ease" }}>
      <div style={{ fontFamily: "'Space Mono', monospace", color: T.textDim, fontSize: "0.68rem", marginBottom: "0.5rem", letterSpacing: "0.12em" }}>{`// ${tag}`}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 900, color: T.text, margin: 0, letterSpacing: "-0.025em" }}>{title}</h2>
        {action}
      </div>
      {sub && <p style={{ color: T.textMid, marginTop: "0.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.93rem", maxWidth: 600 }}>{sub}</p>}
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ config, onOpenSettings }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []); // FIX: no deps needed, fn is defined inside effect
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.96)" : "transparent", backdropFilter: scrolled ? "blur(10px)" : "none", borderBottom: scrolled ? `1px solid ${T.border}` : "none", transition: "all 0.3s ease", padding: "0 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="#hero" style={{ fontFamily: "'Space Mono', monospace", color: T.text, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", letterSpacing: "-0.02em" }}>
          {config.name.split(" ")[0]}<span style={{ opacity: 0.35 }}>.dev</span>
        </a>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          {["About", "Skills", "Projects", "Insights", "Education", "Contact"].map(l => (
            <button
              key={l}
              onClick={() => document.getElementById(l.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
              style={{ color: T.textMid, fontSize: "0.75rem", fontFamily: "'Space Mono', monospace", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              onMouseEnter={e => { e.target.style.color = T.text; }}
              onMouseLeave={e => { e.target.style.color = T.textMid; }}
            >
              {l}
            </button>
          ))}
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            {config.github && (
              <a href={`https://github.com/${config.github}`} target="_blank" rel="noreferrer" style={{ color: T.textMid, transition: "color 0.2s", display: "flex" }}
                onMouseEnter={e => { e.currentTarget.style.color = T.text; }} onMouseLeave={e => { e.currentTarget.style.color = T.textMid; }}>
                <GithubIcon size={17} />
              </a>
            )}
            {config.linkedin && (
              <a href={`https://www.linkedin.com/in/${config.linkedin}`} target="_blank" rel="noreferrer" style={{ color: T.textMid, transition: "color 0.2s", display: "flex" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#0a66c2"; }} onMouseLeave={e => { e.currentTarget.style.color = T.textMid; }}>
                <LinkedinIcon size={17} />
              </a>
            )}
            <button
              onClick={onOpenSettings}
              title="Settings"
              style={{ background: "none", border: "none", color: T.textMid, cursor: "pointer", display: "flex", alignItems: "center", padding: "0.25rem", borderRadius: 4, transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.textMid; }}
            >
              <SettingsIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero({ config, onOpenSettings }) {
  const [typed, setTyped] = useState("");
  const full = config.subtitle;

  useEffect(() => {
    setTyped("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(iv);
    }, 38);
    return () => clearInterval(iv);
  }, [full]); // FIX: full is a string derived from config.subtitle — safe dep

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: `radial-gradient(ellipse 90% 70% at 60% 40%, rgba(109,40,217,0.06) 0%, transparent 65%), ${T.bg}`, position: "relative", overflow: "hidden", padding: "0 2rem" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`, backgroundSize: "72px 72px", maskImage: "radial-gradient(ellipse 85% 85% at 60% 40%, black 20%, transparent 80%)" }} />
      <div style={{ position: "absolute", top: "18%", right: "10%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "22%", left: "2%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(180,83,9,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1, paddingTop: "4rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 1rem", borderRadius: 20, background: T.amberDim, border: "1px solid rgba(180,83,9,0.18)", marginBottom: "1.75rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.amberBright, display: "inline-block" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.64rem", color: T.amber, letterSpacing: "0.08em" }}>2nd Year · B.Tech CSE</span>
        </div>

        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2.8rem, 8vw, 5.5rem)", fontWeight: 900, color: T.text, lineHeight: 1.05, margin: "0 0 0.5rem", letterSpacing: "-0.03em" }}>
          {config.name.split(" ")[0]}{" "}
          <span style={{ WebkitTextFillColor: "transparent", background: "linear-gradient(135deg, #000 20%, #6d28d9 100%)", WebkitBackgroundClip: "text" }}>
            {config.name.split(" ").slice(1).join(" ")}
          </span>
        </h1>

        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "clamp(0.75rem, 1.5vw, 0.9rem)", color: T.textMid, margin: "1.25rem 0", minHeight: "1.5rem" }}>
          {typed}<span style={{ animation: "blink 1s step-end infinite", color: T.amberBright }}>|</span>
        </div>

        <p style={{ color: T.textMid, fontSize: "1rem", maxWidth: 500, lineHeight: 1.8, margin: "0 0 2.5rem", fontFamily: "'DM Sans', sans-serif" }}>{config.intro}</p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "0.78rem 1.75rem", borderRadius: 8, border: "none", cursor: "pointer", background: T.text, color: "#fff", fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", fontWeight: 700, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            View Projects
          </button>

          {config.resumeUrl && config.resumeUrl !== "#" ? (
            <a href={config.resumeUrl} target="_blank" rel="noreferrer" style={{ padding: "0.78rem 1.5rem", borderRadius: 8, textDecoration: "none", background: "transparent", border: `1px solid ${T.border}`, color: T.textMid, fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.text; e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMid; }}>
              ↓ Resume
            </a>
          ) : (
            <button onClick={onOpenSettings} style={{ padding: "0.78rem 1.5rem", borderRadius: 8, background: T.amberDim, border: "1px dashed rgba(180,83,9,0.3)", color: T.amber, fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", cursor: "pointer" }}>↑ Add Resume</button>
          )}

          {config.github ? (
            <a href={`https://github.com/${config.github}`} target="_blank" rel="noreferrer" style={{ padding: "0.78rem 1.25rem", borderRadius: 8, textDecoration: "none", background: "transparent", border: `1px solid ${T.border}`, color: T.textMid, display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.textMid; e.currentTarget.style.borderColor = T.border; }}>
              <GithubIcon size={16} /> GitHub
            </a>
          ) : (
            <button onClick={onOpenSettings} style={{ padding: "0.78rem 1.25rem", borderRadius: 8, background: T.amberDim, border: "1px dashed rgba(180,83,9,0.3)", color: T.amber, display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", cursor: "pointer" }}>
              <GithubIcon size={15} /> Add GitHub
            </button>
          )}

          {config.linkedin ? (
            <a href={`https://www.linkedin.com/in/${config.linkedin}`} target="_blank" rel="noreferrer" style={{ padding: "0.78rem 1.25rem", borderRadius: 8, textDecoration: "none", background: "rgba(10,102,194,0.06)", border: "1px solid rgba(10,102,194,0.18)", color: "#3b82f6", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(10,102,194,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(10,102,194,0.06)"; }}>
              <LinkedinIcon size={16} /> LinkedIn
            </a>
          ) : (
            <button onClick={onOpenSettings} style={{ padding: "0.78rem 1.25rem", borderRadius: 8, background: "rgba(10,102,194,0.05)", border: "1px dashed rgba(10,102,194,0.25)", color: "#3b82f6", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", cursor: "pointer" }}>
              <LinkedinIcon size={15} /> Add LinkedIn
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "3rem", marginTop: "4rem", paddingTop: "2rem", borderTop: `1px solid ${T.border}` }}>
          {[["2nd", "Year"], ["3+", "Projects"], ["4", "Certs"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.2rem", fontWeight: 900, color: T.text }}>{v}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "0.15rem" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About({ config }) {
  const [ref, visible] = useIntersect();
  return (
    <section id="about" style={{ padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="01" title="About Me" />
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: "all 0.6s ease" }}>
          <div>
            <p style={{ color: T.textMid, lineHeight: 1.85, marginBottom: "1.5rem", fontFamily: "'DM Sans', sans-serif", fontSize: "1rem" }}>
              I'm a 2nd-year Computer Science student at <strong style={{ color: T.text }}>{config.college}</strong>, {config.semester}. My core strength is <strong style={{ color: T.text }}>frontend development</strong> — building structured, accessible, and performant web interfaces using HTML, CSS, JavaScript, and React.
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
              { label: "Year", value: "2nd Year · " + config.semester },
              { label: "Available For", value: "Internships · Placement 2027" },
            ].map(item => (
              <div key={item.label} style={{ padding: "1rem 1.4rem", borderRadius: 8, background: "#fafafa", border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
    <section id="skills" style={{ padding: "6rem 2rem", background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="02" title="Skills" sub="Domain-categorized proficiency overview." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          {Object.entries(SKILLS).map(([cat, items], i) => <SkillCard key={cat} cat={cat} items={items} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── EDIT PROJECT MODAL ──────────────────────────────────────────────────────
function EditProjectModal({ project, onSave, onClose }) {
  const [form, setForm] = useState({
    name: project.name || project.title || "",
    description: project.description || "",
    language: project.language || "",
    html_url: project.html_url || project.github || "",
    homepage: project.homepage || project.demo || "",
    stargazers_count: project.stargazers_count || 0,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ ...project, ...form, title: form.name, name: form.name });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  const inpStyle = { width: "100%", padding: "0.6rem 0.85rem", borderRadius: 6, boxSizing: "border-box", background: "#fafafa", border: `1px solid ${T.border}`, color: T.text, fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", outline: "none", transition: "border-color 0.2s" };
  const lblStyle = { display: "block", fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem" };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{ width: "100%", maxWidth: 560, background: "#fff", border: `1px solid ${T.border}`, borderRadius: 16, padding: "2rem", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "#6d28d9", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>{`// EDIT_PROJECT`}</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, color: T.text, fontSize: "1.2rem", margin: 0 }}>Edit Project</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMid, cursor: "pointer", fontSize: "1.5rem", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lblStyle}>Project Name *</label>
            <input value={form.name} placeholder="Project name" onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = "#6d28d9"; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inpStyle} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lblStyle}>Description *</label>
            <textarea value={form.description} placeholder="What does this project do?" rows={3}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = "#6d28d9"; }} onBlur={e => { e.target.style.borderColor = T.border; }}
              style={{ ...inpStyle, resize: "vertical", minHeight: 72 }} />
          </div>
          <div>
            <label style={lblStyle}>Primary Language</label>
            <input value={form.language} placeholder="e.g. JavaScript" onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = "#6d28d9"; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inpStyle} />
          </div>
          <div>
            <label style={lblStyle}>Stars</label>
            <input type="number" min="0" value={form.stargazers_count} onChange={e => setForm(f => ({ ...f, stargazers_count: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = "#6d28d9"; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inpStyle} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lblStyle}>GitHub Repo URL</label>
            <input value={form.html_url} placeholder="https://github.com/you/repo" onChange={e => setForm(f => ({ ...f, html_url: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = "#6d28d9"; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inpStyle} />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lblStyle}>Live Demo URL</label>
            <input value={form.homepage} placeholder="https://yourproject.vercel.app" onChange={e => setForm(f => ({ ...f, homepage: e.target.value }))}
              onFocus={e => { e.target.style.borderColor = "#6d28d9"; }} onBlur={e => { e.target.style.borderColor = T.border; }} style={inpStyle} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button
            onClick={handleSave}
            style={{ flex: 1, padding: "0.8rem", borderRadius: 8, cursor: "pointer", border: "none", background: saved ? T.success : "#6d28d9", color: "#fff", fontFamily: "'Space Mono', monospace", fontSize: "0.76rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background 0.3s" }}
          >
            {saved ? <><CheckIcon size={15} /> Saved!</> : <><CheckIcon size={15} /> Save Changes</>}
          </button>
          <button onClick={onClose} style={{ padding: "0.8rem 1.2rem", borderRadius: 8, cursor: "pointer", background: "transparent", border: `1px solid ${T.border}`, color: T.textMid, fontFamily: "'Space Mono', monospace", fontSize: "0.76rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
function ProjectCard({ p, i, unlocked, onRemove, onEdit }) {
  const [ref, visible] = useIntersect();
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ padding: "1.75rem", borderRadius: 12, position: "relative", background: hover ? T.bgCardHover : "#fff", border: `1px solid ${hover ? T.borderAccent : T.border}`, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(28px)", transition: `opacity 0.5s ease ${(i % 4) * 0.07}s, transform 0.5s ease ${(i % 4) * 0.07}s, background 0.2s, border 0.2s` }}
    >
      {unlocked && (
        <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", gap: "0.4rem" }}>
          <button
            onClick={onEdit}
            title="Edit project"
            style={{ background: "rgba(109,40,217,0.07)", border: "1px solid rgba(109,40,217,0.18)", color: "#6d28d9", borderRadius: 6, cursor: "pointer", padding: "0.3rem 0.45rem", display: "flex", alignItems: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(109,40,217,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(109,40,217,0.07)"; }}
          >
            <EditIcon size={13} />
          </button>
          <button
            onClick={onRemove}
            title="Remove project"
            style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", color: T.danger, borderRadius: 6, cursor: "pointer", padding: "0.3rem 0.45rem", display: "flex", alignItems: "center", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(220,38,38,0.06)"; }}
          >
            <TrashIcon size={13} />
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.8rem", paddingRight: unlocked ? "5rem" : 0 }}>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", fontWeight: 700, color: T.text, margin: 0 }}>{p.title || p.name}</h3>
        <div style={{ display: "flex", gap: "0.4rem", marginLeft: "0.5rem", flexShrink: 0 }}>
          {(p.github || p.html_url) && (
            <a href={p.github || p.html_url} target="_blank" rel="noreferrer" style={{ color: T.textDim, transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.text; }} onMouseLeave={e => { e.currentTarget.style.color = T.textDim; }}>
              <GithubIcon size={15} />
            </a>
          )}
          {(p.demo || p.homepage) && (
            <a href={p.demo || p.homepage} target="_blank" rel="noreferrer" style={{ color: T.textDim, transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.text; }} onMouseLeave={e => { e.currentTarget.style.color = T.textDim; }}>
              <ExternalIcon size={13} />
            </a>
          )}
        </div>
      </div>
      <p style={{ color: T.textMid, fontSize: "0.84rem", lineHeight: 1.68, marginBottom: "1.2rem", fontFamily: "'DM Sans', sans-serif" }}>
        {(p.description || "").slice(0, 110)}{(p.description || "").length > 110 ? "…" : ""}
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

function Projects({ config, unlocked }) {
  const [extraProjects, setExtraProjects, loaded] = usePersistedState("hg_added_projects", []);
  const [editingProject, setEditingProject] = useState(null);

  // Merge hardcoded defaults with any user-added extras
  const displayProjects = [
    ...DEFAULT_PROJECTS.map(d => {
      const override = extraProjects.find(e => e.id === d.id);
      return override || d;
    }),
    ...extraProjects.filter(p => !DEFAULT_PROJECTS.find(d => d.id === p.id)),
  ];

  const handleAdd = useCallback((repo) => {
    setExtraProjects(prev => [...prev, repo]);
  }, [setExtraProjects]);

  const handleRemove = useCallback((id) => {
    // Default projects cannot be removed, only extras
    if (DEFAULT_PROJECTS.find(p => p.id === id)) return;
    setExtraProjects(prev => prev.filter(p => p.id !== id));
  }, [setExtraProjects]);

  const handleEdit = useCallback((updated) => {
    setExtraProjects(prev => {
      const exists = prev.find(p => p.id === updated.id);
      if (exists) return prev.map(p => p.id === updated.id ? updated : p);
      return [...prev, updated];
    });
  }, [setExtraProjects]);

  return (
    <section id="projects" style={{ padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader
          tag="03"
          title="Projects"
          sub="Featured projects — add more via the button below."
          action={
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {unlocked && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.8rem", borderRadius: 6, background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.15)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6d28d9", display: "inline-block" }} />
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#6d28d9" }}>Owner Mode</span>
                </div>
              )}
              <GitHubImporter config={config} addedProjects={extraProjects} onAdd={handleAdd} />
            </div>
          }
        />

        {editingProject && (
          <EditProjectModal
            project={editingProject}
            onSave={handleEdit}
            onClose={() => setEditingProject(null)}
          />
        )}

        {!loaded ? (
          <div style={{ textAlign: "center", padding: "3rem", fontFamily: "'Space Mono', monospace", fontSize: "0.78rem", color: T.textDim }}>Loading projects…</div>
        ) : (
          <>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", color: T.amber, letterSpacing: "0.1em", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.amberBright, display: "inline-block" }} />
              FEATURED ({displayProjects.length} project{displayProjects.length !== 1 ? "s" : ""})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.1rem" }}>
              {displayProjects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  p={p}
                  i={i}
                  unlocked={unlocked}
                  onRemove={() => handleRemove(p.id)}
                  onEdit={() => setEditingProject(p)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ─── INSIGHTS ────────────────────────────────────────────────────────────────
function Insights() {
  const [ref, visible] = useIntersect();
  const tt = { background: "#1f2937", border: `1px solid ${T.border}`, borderRadius: 6, fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#f9fafb" };
  return (
    <section id="insights" style={{ padding: "6rem 2rem", background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="04" title="Activity Insights" sub="Developer activity metrics — last 6 months." />
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}>
          <div style={{ padding: "1.75rem", borderRadius: 12, background: "#fff", border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'Space Mono', monospace", color: T.textDim, fontSize: "0.63rem", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>MONTHLY_COMMITS</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={BAR_DATA} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fill: T.textDim, fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textDim, fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tt} cursor={{ fill: "rgba(109,40,217,0.04)" }} />
                <Bar dataKey="commits" fill={T.text} radius={[3, 3, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding: "1.75rem", borderRadius: 12, background: "#fff", border: `1px solid ${T.border}` }}>
            <div style={{ fontFamily: "'Space Mono', monospace", color: T.amber, fontSize: "0.63rem", marginBottom: "1.5rem", letterSpacing: "0.1em" }}>SKILL_PROGRESSION</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={LINE_DATA} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="week" tick={{ fill: T.textDim, fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: T.textDim, fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tt} />
                <Line type="monotone" dataKey="html" stroke={T.text} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="css" stroke="#0891b2" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="js" stroke={T.amberBright} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="sql" stroke="#be185d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: "1.25rem", marginTop: "1rem", justifyContent: "center" }}>
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
function Education({ config }) {
  const [ref, visible] = useIntersect();
  return (
    <section id="education" style={{ padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="05" title="Education" />
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.6s ease" }}>
          <div style={{ padding: "2rem", borderRadius: 12, background: "#fff", border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.text}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.1rem", fontWeight: 800, color: T.text, margin: 0 }}>{EDUCATION.degree}</h3>
                <p style={{ color: T.textMid, margin: "0.4rem 0 0", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem" }}>{config.college}</p>
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", color: T.textMid, background: "#f3f4f6", padding: "0.3rem 0.7rem", borderRadius: 4, whiteSpace: "nowrap" }}>{EDUCATION.duration}</span>
            </div>
            <div style={{ marginTop: "1rem", fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", color: T.textDim }}>{config.semester}</div>
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
    <section id="achievements" style={{ padding: "6rem 2rem", background: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
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
function Contact({ config }) {
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
    <section id="contact" style={{ padding: "6rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionHeader tag="07" title="Contact" sub="Open to internships and placement opportunities." />
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.6s ease" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {[
              { label: "Email", value: config.email, href: `mailto:${config.email}`, color: T.text },
              ...(config.github ? [{ label: "GitHub", value: `@${config.github}`, href: `https://github.com/${config.github}`, color: T.text }] : []),
              ...(config.linkedin ? [{ label: "LinkedIn", value: `in/${config.linkedin}`, href: `https://www.linkedin.com/in/${config.linkedin}`, color: "#0a66c2" }] : []),
            ].map(c => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                style={{ padding: "1.1rem 1.4rem", borderRadius: 8, textDecoration: "none", background: "#fafafa", border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderAccent; e.currentTarget.style.background = T.bgCardHover; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = "#fafafa"; }}
              >
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>{c.label}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: c.color }}>{c.value}</span>
              </a>
            ))}
            <a
              href={config.resumeUrl && config.resumeUrl !== "#" ? config.resumeUrl : undefined}
              target="_blank"
              rel="noreferrer"
              style={{ padding: "0.8rem 1.4rem", borderRadius: 8, textDecoration: "none", textAlign: "center", background: "rgba(109,40,217,0.06)", border: "1px solid rgba(109,40,217,0.15)", color: "#6d28d9", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", transition: "all 0.2s", opacity: config.resumeUrl && config.resumeUrl !== "#" ? 1 : 0.45, cursor: config.resumeUrl && config.resumeUrl !== "#" ? "pointer" : "not-allowed" }}
              onMouseEnter={e => { if (config.resumeUrl && config.resumeUrl !== "#") e.currentTarget.style.background = "rgba(109,40,217,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(109,40,217,0.06)"; }}
            >
              ↓ Download Resume
            </a>
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
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                >
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
  const [config, setConfig, configLoaded] = usePersistedState("hg_config", DEFAULT_CONFIG);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => { document.title = "Himanshu Gupta - Portfolio"; }, []);

  // FIX: wrap handler in useCallback so useEffect dep is stable
  const handleOpenSettings = useCallback(() => {
    if (!unlocked) setShowPin(true);
    else setSettingsOpen(true);
  }, [unlocked]);

  // FIX: all deps properly declared
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "S") {
        e.preventDefault();
        handleOpenSettings();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleOpenSettings]);

  const handleSaveConfig = useCallback((newConfig) => {
    setConfig(newConfig);
  }, [setConfig]);

  if (!configLoaded) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontSize: "0.8rem", color: "#9ca3af" }}>
        Loading portfolio…
      </div>
    );
  }

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
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .two-col { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>

      <Navbar config={config} onOpenSettings={handleOpenSettings} unlocked={unlocked} />

      {showPin && !unlocked && (
        <PinGate
          onSuccess={() => { setUnlocked(true); setShowPin(false); setSettingsOpen(true); }}
          onCancel={() => setShowPin(false)}
        />
      )}

      <SettingsPanel
        config={config}
        onSave={handleSaveConfig}
        open={settingsOpen}
        setOpen={setSettingsOpen}
        unlocked={unlocked}
        showPin={showPin}
        setShowPin={setShowPin}
      />

      <main>
        <Hero config={config} onOpenSettings={handleOpenSettings} />
        <About config={config} />
        <Skills />
        <Projects config={config} unlocked={unlocked} />
        <Insights />
        <Education config={config} />
        <Achievements />
        <Contact config={config} />
      </main>

      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "2rem", textAlign: "center" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.63rem", color: T.textDim, userSelect: "none" }}>
          © {new Date().getFullYear()} {config.name} · Built with ❤
        </div>
      </footer>
    </>
  );
}