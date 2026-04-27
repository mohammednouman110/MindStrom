"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  Bell,
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  Eye,
  Home,
  Map,
  MessageSquare,
  RotateCcw,
  Send,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import {
  getNeuroAchievements,
  getNeuroFlashcards,
  getNeuroHeatmap,
  getNeuroProfile,
  getNeuroRetentionCurve,
  getNeuroTopics,
  hasBackendApi,
  postNeuroReview,
  postNeuroTutorChat,
} from "@/lib/api";
import type {
  NeuroAchievement,
  NeuroCurvePoint,
  NeuroFlashcard,
  NeuroHeatmap,
  NeuroProfile,
  NeuroTopic,
  NeuroTutorMessage,
} from "@/lib/types";

const T = {
  bg: "#04080F",
  bg1: "#080F1E",
  bg2: "#0D1929",
  bg3: "#122035",
  border: "rgba(0,229,255,0.12)",
  borderHi: "rgba(0,229,255,0.32)",
  cyan: "#00E5FF",
  cyanDim: "rgba(0,229,255,0.13)",
  purple: "#7B2FBE",
  purpleDim: "rgba(123,47,190,0.18)",
  pink: "#FF2D78",
  pinkDim: "rgba(255,45,120,0.13)",
  green: "#00FF9D",
  greenDim: "rgba(0,255,157,0.13)",
  gold: "#FFB800",
  goldDim: "rgba(255,184,0,0.13)",
  text: "#E8F4F8",
  textSub: "#8BA8C0",
  textMuted: "#4A6A85",
  ff: "'Syne', sans-serif",
  fb: "'Plus Jakarta Sans', sans-serif",
  fm: "'DM Mono', monospace",
} as const;

const TOPICS_FALLBACK: NeuroTopic[] = [
  { id: 1, name: "JavaScript", icon: "⚡", color: T.gold, strength: 78, cards: 24, next: "2h", cat: "Programming" },
  { id: 2, name: "Machine Learning", icon: "🧠", color: T.cyan, strength: 45, cards: 31, next: "4h", cat: "AI" },
  { id: 3, name: "DevOps", icon: "🔧", color: T.purple, strength: 62, cards: 18, next: "Tomorrow", cat: "Ops" },
  { id: 4, name: "System Design", icon: "🏗️", color: T.pink, strength: 33, cards: 27, next: "6h", cat: "Architecture" },
  { id: 5, name: "Python", icon: "🐍", color: T.green, strength: 89, cards: 20, next: "3 days", cat: "Programming" },
  { id: 6, name: "React", icon: "⚛️", color: "#61DAFB", strength: 71, cards: 16, next: "1 day", cat: "Frontend" },
];

const FLASHCARDS_FALLBACK: NeuroFlashcard[] = [
  {
    id: 1,
    topic: "Machine Learning",
    tc: T.cyan,
    q: "What is the Ebbinghaus Forgetting Curve?",
    a: "A mathematical model showing memory retention decays exponentially over time without reinforcement. Formula: R = e^(-t/S) where R = retention, t = time, S = memory strength.",
    diff: "medium",
    last: "3d ago",
    str: 45,
  },
  {
    id: 2,
    topic: "JavaScript",
    tc: T.gold,
    q: "Difference between let, const, and var?",
    a: "var is function-scoped and hoisted. let is block-scoped, not hoisted, mutable. const is block-scoped, not hoisted, and immutable (though referenced objects can be mutated).",
    diff: "easy",
    last: "1d ago",
    str: 78,
  },
  {
    id: 3,
    topic: "System Design",
    tc: T.pink,
    q: "Explain the CAP Theorem.",
    a: "In a distributed system you can only guarantee 2 of 3: Consistency (every read sees latest write), Availability (every request gets a response), Partition tolerance (operates despite network splits).",
    diff: "hard",
    last: "5d ago",
    str: 33,
  },
  {
    id: 4,
    topic: "DevOps",
    tc: T.purple,
    q: "What is a Kubernetes Pod?",
    a: "The smallest deployable unit in Kubernetes. A Pod encapsulates one or more containers, storage resources, a unique network IP, and options that govern how containers should run.",
    diff: "medium",
    last: "2d ago",
    str: 62,
  },
];

const CURVE_FALLBACK: NeuroCurvePoint[] = [
  { d: "D1", ret: 100, no: 100 },
  { d: "D2", ret: 58, no: 55 },
  { d: "D3", ret: 44, no: 40 },
  { d: "D5", ret: 71, no: 28 },
  { d: "D8", ret: 52, no: 60 },
  { d: "D12", ret: 82, no: 45 },
  { d: "D15", ret: 68, no: 75 },
  { d: "D20", ret: 89, no: 60 },
];

const HEATMAP_FALLBACK: NeuroHeatmap = {
  JavaScript: {
    concepts: ["Variables", "Functions", "Closures", "Promises", "Async/Await", "Prototypes", "Classes", "Modules", "DOM", "Events", "Errors", "Regex"],
    vals: [85, 90, 72, 78, 68, 45, 82, 95, 88, 76, 65, 80],
  },
  "Machine Learning": {
    concepts: ["Linear Reg", "Neural Nets", "Backprop", "Gradient Desc", "Overfitting", "Cross-val", "CNN", "RNN", "Transformers", "Embeddings", "Loss Fns", "Optimization"],
    vals: [55, 40, 28, 48, 35, 62, 22, 18, 15, 30, 45, 38],
  },
  "System Design": {
    concepts: ["Load Balancing", "Caching", "CDN", "DB Sharding", "CAP Theorem", "Microservices", "Msg Queues", "API Gateway", "Rate Limiting", "Consistent Hash", "Replication", "Indexing"],
    vals: [42, 38, 65, 28, 35, 22, 48, 30, 55, 18, 40, 45],
  },
};

const ACHIEVEMENTS_FALLBACK: NeuroAchievement[] = [
  { id: 1, name: "First Blood", desc: "Complete first review session", icon: "⚔️", unlocked: true },
  { id: 2, name: "Week Warrior", desc: "7-day learning streak", icon: "🔥", unlocked: true },
  { id: 3, name: "Neural Architect", desc: "Create 50+ flashcards", icon: "🧠", unlocked: true },
  { id: 4, name: "Speed Learner", desc: "Review 20 cards in 5 min", icon: "⚡", unlocked: false },
  { id: 5, name: "Perfect Score", desc: "Get all Easy in a session", icon: "💎", unlocked: false },
  { id: 6, name: "Knowledge Master", desc: "Reach 90% on any topic", icon: "🏆", unlocked: false },
];

const PROFILE_FALLBACK: NeuroProfile = {
  name: "Mohammed",
  role: "BCA Student · Lifelong Learner",
  xp: 2450,
  xpMax: 3000,
  level: 7,
  streak: 12,
  cards_reviewed: "847",
  avg_retention: "73%",
  active_topics: "6",
  total_hours: "42h",
};

const INITIAL_ASSISTANT_MESSAGE =
  "Hi Mohammed! 👋 I'm **NeuroTutor**, your AI learning companion.\n\nI can help you:\n• Explain complex concepts clearly\n• Quiz you on your weak topics\n• Generate practice questions\n• Give personalized revision tips\n\nYour weakest areas right now are **System Design (33%)** and **Machine Learning (45%)** — want to tackle those?";

const QUICK_PROMPTS = ["Quiz me on ML", "Explain CAP Theorem", "What's my weakest topic?", "Make 3 DevOps questions"];

type Screen = "dashboard" | "learn" | "chat" | "heatmap" | "profile";

function sc(s: number) {
  return s >= 80 ? T.green : s >= 60 ? T.cyan : s >= 40 ? T.gold : s >= 20 ? T.pink : "#FF4444";
}

function shortStrengthLabel(value: number) {
  if (value >= 80) return "Strong";
  if (value >= 60) return "Good";
  if (value >= 40) return "Fair";
  return "Weak";
}

function radarLabel(topic: string) {
  const labels: Record<string, string> = {
    JavaScript: "JS",
    "Machine Learning": "ML",
    "System Design": "SysD",
    Python: "Python",
    React: "React",
    DevOps: "DevOps",
  };

  return labels[topic] ?? topic;
}

function buildRadarData(topics: NeuroTopic[]) {
  return topics.map((topic) => ({
    s: radarLabel(topic.name),
    v: topic.strength,
  }));
}

function renderInlineMarkdown(line: string) {
  const parts = line.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${part}-${index}`}>{part || "\u00A0"}</span>;
  });
}

function fallbackTutorReply(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("cap theorem")) {
    return "**CAP Theorem** says a distributed system can reliably optimize only two of these three during a network partition: **Consistency**, **Availability**, and **Partition Tolerance**.\n\nA quick memory trick: if the network splits, you usually choose between always-correct answers and always-available answers.";
  }
  if (normalized.includes("weakest")) {
    return "Your weakest topics right now are **System Design (33%)** and **Machine Learning (45%)**.\n\nThose are the best places to review first because they are closest to slipping.";
  }
  if (normalized.includes("quiz")) {
    return "Let's do one.\n\n**Question:** In machine learning, what problem does **overfitting** describe?";
  }
  return "Let's work through that together.\n\nStart by explaining the idea in **one sentence**, then test yourself with one example and one counterexample. That sequence is great for retention.";
}

type CardProps = {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  glow?: boolean;
};

function Card({ children, style = {}, onClick, glow }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: T.bg2,
        border: `1px solid ${glow ? T.borderHi : T.border}`,
        borderRadius: 16,
        padding: 16,
        cursor: onClick ? "pointer" : "default",
        boxShadow: glow ? "0 0 22px rgba(0,229,255,0.14)" : "none",
        transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Badge({ color, children, style = {} }: { color: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <span
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
        borderRadius: 20,
        padding: "2px 10px",
        fontSize: 11,
        fontFamily: T.fb,
        fontWeight: 600,
        letterSpacing: 0.4,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function ProgressBar({ val, color, height = 6 }: { val: number; color: string; height?: number }) {
  return (
    <div style={{ height, background: T.bg3, borderRadius: height / 2, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${val}%`,
          background: `linear-gradient(90deg,${color},${color}88)`,
          borderRadius: height / 2,
          transition: "width 0.8s ease",
        }}
      />
    </div>
  );
}

function BottomNav({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
  const items = [
    { id: "dashboard" as const, Icon: Home, label: "Home" },
    { id: "learn" as const, Icon: BookOpen, label: "Learn" },
    { id: "chat" as const, Icon: MessageSquare, label: "Tutor" },
    { id: "heatmap" as const, Icon: Map, label: "Memory" },
    { id: "profile" as const, Icon: Trophy, label: "Profile" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: T.bg1,
        borderTop: `1px solid ${T.border}`,
        display: "flex",
        padding: "8px 4px 18px",
        zIndex: 100,
      }}
    >
      {items.map(({ id, Icon, label }) => {
        const active = screen === id;
        return (
          <button
            key={id}
            onClick={() => setScreen(id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? T.cyanDim : "transparent",
                transition: "all 0.2s",
              }}
            >
              <Icon size={20} color={active ? T.cyan : T.textMuted} />
            </div>
            <span style={{ fontSize: 10, fontFamily: T.fb, fontWeight: active ? 600 : 400, color: active ? T.cyan : T.textMuted }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DashboardScreen({
  profile,
  topics,
  curve,
  setScreen,
}: {
  profile: NeuroProfile;
  topics: NeuroTopic[];
  curve: NeuroCurvePoint[];
  setScreen: (screen: Screen) => void;
}) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "0 16px", animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 13, color: T.textSub, fontFamily: T.fb, margin: 0 }}>
            {greet}, {profile.name} 👋
          </p>
          <h1 style={{ fontSize: 22, fontFamily: T.ff, fontWeight: 800, color: T.text, margin: "4px 0 0", letterSpacing: -0.5 }}>
            Your Neural Hub
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              background: T.goldDim,
              border: "1px solid rgba(255,184,0,0.3)",
              borderRadius: 20,
              padding: "5px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 16, display: "inline-block", animation: "flicker 1.2s ease-in-out infinite" }}>🔥</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.gold, fontFamily: T.fm }}>{profile.streak}</span>
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `linear-gradient(135deg,${T.cyan},${T.purple})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🎓
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Due Today", val: "14", Icon: Clock, color: T.cyan },
          { label: "Retention", val: profile.avg_retention, Icon: Target, color: T.green },
          { label: "XP Today", val: "+240", Icon: Zap, color: T.gold },
        ].map((stat) => (
          <Card key={stat.label} style={{ padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
              <stat.Icon size={13} color={stat.color} />
              <span style={{ fontSize: 10, color: T.textMuted, fontFamily: T.fb }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: T.fm }}>{stat.val}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontFamily: T.ff, fontWeight: 700, color: T.text, margin: 0 }}>Memory Retention</h3>
            <p style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fb, margin: "2px 0 0" }}>Ebbinghaus curve + spaced reviews</p>
          </div>
          <Badge color={T.cyan}>Last 20 days</Badge>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={curve} margin={{ top: 5, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.cyan} stopOpacity={0.3} />
                <stop offset="95%" stopColor={T.cyan} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.purple} stopOpacity={0.2} />
                <stop offset="95%" stopColor={T.purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="d" tick={{ fontSize: 9, fill: T.textMuted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: T.textMuted }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 11 }} itemStyle={{ color: T.text }} labelStyle={{ color: T.textSub }} />
            <Area type="monotone" dataKey="ret" stroke={T.cyan} fill="url(#gA)" strokeWidth={2} dot={{ fill: T.cyan, r: 3 }} name="With Reviews" />
            <Area type="monotone" dataKey="no" stroke={T.purple} fill="url(#gB)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Without Reviews" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          {[{ label: "With Reviews", color: T.cyan }, { label: "Without Reviews", color: T.purple }].map((legend) => (
            <div key={legend.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: legend.color }} />
              <span style={{ fontSize: 10, color: T.textMuted, fontFamily: T.fb }}>{legend.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 18, border: "1px solid rgba(255,45,120,0.25)", background: `linear-gradient(135deg,${T.bg2},rgba(255,45,120,0.05))` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: T.pinkDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertCircle size={20} color={T.pink} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 13, fontFamily: T.ff, fontWeight: 700, color: T.text, margin: 0 }}>⚠️ Future Forget Prediction</h3>
              <Badge color={T.pink}>AI</Badge>
            </div>
            <p style={{ fontSize: 12, color: T.textSub, fontFamily: T.fb, margin: "6px 0 10px", lineHeight: 1.6 }}>
              AI predicts you&apos;ll forget <strong style={{ color: T.pink }}>CAP Theorem</strong> and <strong style={{ color: T.pink }}>Neural Networks</strong> within 3 days. Review now to prevent loss.
            </p>
            <button
              onClick={() => setScreen("learn")}
              style={{
                background: T.pinkDim,
                border: "1px solid rgba(255,45,120,0.4)",
                borderRadius: 8,
                padding: "6px 14px",
                color: T.pink,
                fontSize: 12,
                fontFamily: T.fb,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Review Now →
            </button>
          </div>
        </div>
      </Card>

      <h3 style={{ fontSize: 14, fontFamily: T.ff, fontWeight: 700, color: T.text, margin: "0 0 12px" }}>📋 Today&apos;s Review Plan</h3>
      {topics.slice(0, 4).map((topic) => (
        <Card key={topic.id} style={{ marginBottom: 10, padding: 12 }} onClick={() => setScreen("learn")}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: `${topic.color}22`,
                border: `1px solid ${topic.color}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {topic.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontFamily: T.ff, fontWeight: 600, color: T.text }}>{topic.name}</span>
                <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fm }}>{topic.next}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <div style={{ flex: 1 }}>
                  <ProgressBar val={topic.strength} color={sc(topic.strength)} />
                </div>
                <span style={{ fontSize: 11, color: sc(topic.strength), fontFamily: T.fm, fontWeight: 600, minWidth: 30 }}>{topic.strength}%</span>
              </div>
            </div>
            <ChevronRight size={16} color={T.textMuted} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function LearnScreen({ flashcards }: { flashcards: NeuroFlashcard[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [ratings, setRatings] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  const card = flashcards[idx] ?? FLASHCARDS_FALLBACK[0];

  const rate = async (rating: keyof typeof ratings) => {
    setRatings((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));
    void postNeuroReview(card.id, rating).catch(() => undefined);

    if (idx < flashcards.length - 1) {
      setIdx((current) => current + 1);
      setFlipped(false);
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <div style={{ padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "75vh" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontFamily: T.ff, fontSize: 24, fontWeight: 800, color: T.text, textAlign: "center", margin: "0 0 8px" }}>Session Complete!</h2>
        <p style={{ color: T.textSub, fontFamily: T.fb, textAlign: "center", marginBottom: 24 }}>You reviewed {flashcards.length} cards. Great work!</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", marginBottom: 20 }}>
          {[{ l: "Again", color: T.pink }, { l: "Hard", color: T.gold }, { l: "Good", color: T.cyan }, { l: "Easy", color: T.green }].map((rating) => (
            <Card key={rating.l} style={{ textAlign: "center", padding: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: rating.color, fontFamily: T.fm }}>{ratings[rating.l.toLowerCase() as keyof typeof ratings]}</div>
              <div style={{ fontSize: 12, color: T.textMuted, fontFamily: T.fb }}>{rating.l}</div>
            </Card>
          ))}
        </div>
        <div style={{ background: T.cyanDim, border: "1px solid rgba(0,229,255,0.3)", borderRadius: 10, padding: "10px 16px", width: "100%", textAlign: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 14, color: T.cyan, fontFamily: T.fb, fontWeight: 600 }}>+120 XP earned! 🌟</span>
        </div>
        <button
          onClick={() => {
            setIdx(0);
            setFlipped(false);
            setDone(false);
            setRatings({ again: 0, hard: 0, good: 0, easy: 0 });
          }}
          style={{
            background: "none",
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: "10px 24px",
            color: T.textSub,
            fontSize: 13,
            fontFamily: T.fb,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <RotateCcw size={14} /> Restart Session
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 16px", animation: "fadeUp 0.4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontFamily: T.ff, fontWeight: 800, color: T.text, margin: 0 }}>Review Session</h2>
        <Badge color={T.cyan}>
          {idx + 1} / {flashcards.length}
        </Badge>
      </div>
      <div style={{ height: 4, background: T.bg3, borderRadius: 2, marginBottom: 18, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(idx / flashcards.length) * 100}%`, background: `linear-gradient(90deg,${T.cyan},${T.purple})`, borderRadius: 2, transition: "width 0.3s ease" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Badge color={card.tc}>{card.topic}</Badge>
        <Badge color={card.diff === "hard" ? T.pink : card.diff === "easy" ? T.green : T.gold}>{card.diff}</Badge>
        <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fb, marginLeft: "auto" }}>
          <Clock size={11} style={{ marginRight: 3, verticalAlign: "middle" }} />
          {card.last}
        </span>
      </div>

      <div style={{ perspective: "1200px", marginBottom: 20, minHeight: 260 }} onClick={() => setFlipped((current) => !current)}>
        <div
          style={{
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: 260,
          }}
        >
          <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", cursor: "pointer", position: "relative" }}>
            <div style={{ position: "absolute", top: 14, right: 14 }}>
              <Eye size={16} color={T.textMuted} />
            </div>
            <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fb, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>❓ Question</span>
            <p style={{ fontSize: 16, color: T.text, fontFamily: T.fb, fontWeight: 500, textAlign: "center", lineHeight: 1.65, margin: 0 }}>{card.q}</p>
            <p style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fb, marginTop: 20 }}>Tap to reveal answer</p>
          </div>
          <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(135deg,${T.bg2},rgba(0,229,255,0.05))`, border: "1px solid rgba(0,229,255,0.25)", borderRadius: 20, padding: 28, minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T.cyan, fontFamily: T.fb, marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>✅ Answer</span>
            <p style={{ fontSize: 14, color: T.text, fontFamily: T.fb, fontWeight: 400, textAlign: "center", lineHeight: 1.7, margin: 0 }}>{card.a}</p>
          </div>
        </div>
      </div>

      {flipped ? (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <p style={{ fontSize: 12, color: T.textMuted, fontFamily: T.fb, textAlign: "center", marginBottom: 12 }}>How well did you know this?</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[{ l: "Again", c: T.pink, e: "😰" }, { l: "Hard", c: T.gold, e: "😅" }, { l: "Good", c: T.cyan, e: "😊" }, { l: "Easy", c: T.green, e: "🚀" }].map((rating) => (
              <button key={rating.l} onClick={() => void rate(rating.l.toLowerCase() as keyof typeof ratings)} style={{ background: `${rating.c}18`, border: `1px solid ${rating.c}44`, borderRadius: 12, padding: "10px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 18 }}>{rating.e}</span>
                <span style={{ fontSize: 11, color: rating.c, fontFamily: T.fb, fontWeight: 600 }}>{rating.l}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 12, color: T.textMuted, fontFamily: T.fb, textAlign: "center" }}>
          <Brain size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
          Think before flipping
        </p>
      )}

      <Card style={{ marginTop: 20, padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: T.textSub, fontFamily: T.fb }}>Memory Strength</span>
          <span style={{ fontSize: 12, color: sc(card.str), fontFamily: T.fm, fontWeight: 600 }}>{card.str}%</span>
        </div>
        <ProgressBar val={card.str} color={sc(card.str)} height={7} />
      </Card>
    </div>
  );
}

function ChatScreen() {
  const [messages, setMessages] = useState<NeuroTutorMessage[]>([{ role: "assistant", content: INITIAL_ASSISTANT_MESSAGE }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<NeuroTutorMessage[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || loading) {
      return;
    }

    const userMessage: NeuroTutorMessage = { role: "user", content: message };
    const newHistory = [...history, userMessage];

    setInput("");
    setMessages((current) => [...current, userMessage]);
    setLoading(true);

    try {
      const response = hasBackendApi() ? await postNeuroTutorChat(newHistory, newHistory) : { reply: "" };
      const reply = response.reply || fallbackTutorReply(message);
      const assistantMessage: NeuroTutorMessage = { role: "assistant", content: reply };
      setHistory([...newHistory, assistantMessage]);
      setMessages((current) => [...current, assistantMessage]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", animation: "fadeUp 0.4s ease" }}>
      <div style={{ padding: "0 16px 12px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: `linear-gradient(135deg,${T.cyan}33,${T.purple}33)`, border: `1px solid ${T.cyan}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            🧠
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontFamily: T.ff, fontWeight: 700, color: T.text, margin: 0 }}>NeuroTutor</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
              <span style={{ fontSize: 11, color: T.green, fontFamily: T.fb }}>Online · Powered by backend AI</span>
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ padding: "4px 10px", background: T.cyanDim, border: `1px solid ${T.border}`, borderRadius: 20 }}>
              <span style={{ fontSize: 11, color: T.cyan, fontFamily: T.fb }}>AI Active</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length <= 1 && (
          <div style={{ marginBottom: 4 }}>
            <p style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fb, marginBottom: 8 }}>Quick start:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {QUICK_PROMPTS.map((prompt) => (
                <button key={prompt} onClick={() => void send(prompt)} style={{ background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 20, padding: "6px 12px", color: T.textSub, fontSize: 11, fontFamily: T.fb, cursor: "pointer" }}>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} style={{ display: "flex", justifyContent: message.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp 0.3s ease" }}>
            {message.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${T.cyan}33,${T.purple}33)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginRight: 8, alignSelf: "flex-end" }}>
                🧠
              </div>
            )}
            <div style={{ maxWidth: "78%", background: message.role === "user" ? `linear-gradient(135deg,${T.cyan}22,${T.purple}22)` : T.bg2, border: `1px solid ${message.role === "user" ? `${T.cyan}44` : T.border}`, borderRadius: message.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px", padding: "10px 14px", fontSize: 13, color: T.text, fontFamily: T.fb, lineHeight: 1.65 }}>
              {message.content.split("\n").map((line, lineIndex) => (
                <p key={`${index}-${lineIndex}`} style={{ margin: "2px 0", lineHeight: 1.65 }}>
                  {renderInlineMarkdown(line)}
                </p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, animation: "fadeUp 0.3s ease" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${T.cyan}33,${T.purple}33)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
              🧠
            </div>
            <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: "4px 16px 16px 16px", padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map((dot) => (
                <div key={dot} style={{ width: 6, height: 6, borderRadius: "50%", background: T.cyan, animation: "dot 1.2s ease infinite", animationDelay: `${dot * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "10px 16px 0", borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", gap: 8, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 16, padding: "8px 8px 8px 14px", alignItems: "center" }}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
            placeholder="Ask me anything..."
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: T.text, fontSize: 13, fontFamily: T.fb }}
          />
          <button onClick={() => void send()} disabled={loading || !input.trim()} style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() && !loading ? `linear-gradient(135deg,${T.cyan},${T.purple})` : T.bg3, border: "none", cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
            <Send size={16} color={input.trim() && !loading ? "#000" : T.textMuted} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HeatmapScreen({ heatmap, topics }: { heatmap: NeuroHeatmap; topics: NeuroTopic[] }) {
  const initialTopic = Object.keys(heatmap)[0] ?? "JavaScript";
  const [topic, setTopic] = useState(initialTopic);
  const activeTopic = heatmap[topic] ? topic : (Object.keys(heatmap)[0] ?? "JavaScript");
  const data = heatmap[activeTopic] ?? HEATMAP_FALLBACK.JavaScript;
  const radarData = buildRadarData(topics);

  return (
    <div style={{ padding: "0 16px", animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontFamily: T.ff, fontWeight: 800, color: T.text, margin: "0 0 4px" }}>Memory Heatmap</h2>
        <p style={{ fontSize: 12, color: T.textMuted, fontFamily: T.fb, margin: 0 }}>Visual map of your knowledge depth</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
        {Object.keys(heatmap).map((heatmapTopic) => (
          <button key={heatmapTopic} onClick={() => setTopic(heatmapTopic)} style={{ background: activeTopic === heatmapTopic ? T.cyanDim : T.bg2, border: `1px solid ${activeTopic === heatmapTopic ? `${T.cyan}66` : T.border}`, borderRadius: 20, padding: "6px 14px", color: activeTopic === heatmapTopic ? T.cyan : T.textSub, fontSize: 12, fontFamily: T.fb, fontWeight: activeTopic === heatmapTopic ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
            {heatmapTopic}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fb }}>Weak</span>
        {["#FF4444", T.pink, T.gold, T.cyan, T.green].map((color) => (
          <div key={color} style={{ width: 22, height: 12, borderRadius: 3, background: color }} />
        ))}
        <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fb }}>Strong</span>
      </div>

      <Card style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 13, fontFamily: T.ff, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>{activeTopic} — Concept Map</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {data.concepts.map((concept, index) => {
            const strength = data.vals[index];
            const color = sc(strength);
            return (
              <div key={concept} style={{ background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 10, padding: "10px 6px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, height: `${strength}%`, width: "100%", background: `${color}10` }} />
                <span style={{ fontSize: 10, color: T.text, fontFamily: T.fb, fontWeight: 500, display: "block", marginBottom: 4, position: "relative" }}>{concept}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: T.fm, position: "relative" }}>{strength}%</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 13, fontFamily: T.ff, fontWeight: 700, color: T.text, margin: "0 0 12px" }}>📡 Topic Strength Radar</h3>
        <ResponsiveContainer width="100%" height={210}>
          <RadarChart data={radarData}>
            <PolarGrid stroke={T.border} />
            <PolarAngleAxis dataKey="s" tick={{ fontSize: 11, fill: T.textSub, fontFamily: T.fb }} />
            <Radar name="Strength" dataKey="v" stroke={T.cyan} fill={T.cyan} fillOpacity={0.15} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <h3 style={{ fontSize: 14, fontFamily: T.ff, fontWeight: 700, color: T.text, margin: "0 0 12px" }}>All Topics</h3>
      {topics.map((topicItem) => (
        <Card key={topicItem.id} style={{ marginBottom: 10, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>{topicItem.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontFamily: T.ff, fontWeight: 600, color: T.text }}>{topicItem.name}</span>
                <span style={{ fontSize: 12, color: sc(topicItem.strength), fontFamily: T.fm, fontWeight: 600 }}>{topicItem.strength}%</span>
              </div>
              <ProgressBar val={topicItem.strength} color={sc(topicItem.strength)} height={6} />
            </div>
            <Badge color={sc(topicItem.strength)} style={{ fontSize: 10, padding: "2px 8px" }}>
              {shortStrengthLabel(topicItem.strength)}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ProfileScreen({ profile, achievements }: { profile: NeuroProfile; achievements: NeuroAchievement[] }) {
  const streak = Array.from({ length: 21 }, (_, index) => ({ day: index + 1, on: index < profile.streak && index !== 4 && index !== 9 }));

  return (
    <div style={{ padding: "0 16px", animation: "fadeUp 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 22, padding: "16px 0", background: `radial-gradient(circle at 50% 0%,${T.cyan}12,transparent 70%)` }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: `linear-gradient(135deg,${T.cyan},${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px", boxShadow: `0 0 28px ${T.cyan}44` }}>🎓</div>
        <h2 style={{ fontSize: 20, fontFamily: T.ff, fontWeight: 800, color: T.text, margin: "0 0 4px" }}>{profile.name}</h2>
        <p style={{ fontSize: 12, color: T.textSub, fontFamily: T.fb, margin: "0 0 12px" }}>{profile.role}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <Badge color={T.gold}>⭐ Level {profile.level}</Badge>
          <Badge color={T.cyan}>🔥 {profile.streak}-day streak</Badge>
          <Badge color={T.purple}>🧠 Neural Pro</Badge>
        </div>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 13, fontFamily: T.ff, fontWeight: 700, color: T.text }}>
              Level {profile.level} → {profile.level + 1}
            </span>
            <p style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fb, margin: "2px 0 0" }}>{profile.xpMax - profile.xp} XP to next level</p>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: T.gold, fontFamily: T.fm }}>{profile.xp} XP</span>
        </div>
        <div style={{ height: 8, background: T.bg3, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(profile.xp / profile.xpMax) * 100}%`, background: `linear-gradient(90deg,${T.gold},${T.pink})`, borderRadius: 4, boxShadow: `0 0 10px ${T.gold}66` }} />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { l: "Cards Reviewed", v: profile.cards_reviewed, e: "📚", c: T.cyan },
          { l: "Avg Retention", v: profile.avg_retention, e: "🎯", c: T.green },
          { l: "Active Topics", v: profile.active_topics, e: "🗂️", c: T.purple },
          { l: "Total Hours", v: profile.total_hours, e: "⏱️", c: T.gold },
        ].map((stat) => (
          <Card key={stat.l} style={{ padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.e}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: stat.c, fontFamily: T.fm }}>{stat.v}</div>
            <div style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fb, marginTop: 2 }}>{stat.l}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontFamily: T.ff, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>🔥 Streak Calendar (Last 21 Days)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5 }}>
          {streak.map(({ day, on }) => (
            <div key={day} style={{ height: 30, borderRadius: 6, background: on ? `linear-gradient(135deg,${T.gold}66,${T.pink}44)` : T.bg3, border: `1px solid ${on ? `${T.gold}44` : T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {on && <span style={{ fontSize: 13 }}>🔥</span>}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: T.textMuted, fontFamily: T.fb, textAlign: "center", marginTop: 10, margin: "10px 0 0" }}>{profile.streak} active days · Best streak: 15 days</p>
      </Card>

      <h3 style={{ fontSize: 14, fontFamily: T.ff, fontWeight: 700, color: T.text, margin: "0 0 12px" }}>🏆 Achievements</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {achievements.map((achievement) => (
          <Card key={achievement.id} style={{ padding: 14, opacity: achievement.unlocked ? 1 : 0.5, border: achievement.unlocked ? `1px solid ${T.gold}44` : undefined, background: achievement.unlocked ? `linear-gradient(135deg,${T.bg2},${T.goldDim})` : T.bg2 }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{achievement.unlocked ? achievement.icon : "🔒"}</div>
            <div style={{ fontSize: 12, fontFamily: T.ff, fontWeight: 600, color: achievement.unlocked ? T.text : T.textMuted, marginBottom: 3 }}>{achievement.name}</div>
            <div style={{ fontSize: 10, color: T.textMuted, fontFamily: T.fb, lineHeight: 1.4, marginBottom: achievement.unlocked ? 6 : 0 }}>{achievement.desc}</div>
            {achievement.unlocked && (
              <Badge color={T.gold} style={{ fontSize: 9, padding: "1px 7px" }}>
                Unlocked ✓
              </Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function NeuroRecallAI() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [topics, setTopics] = useState<NeuroTopic[]>(TOPICS_FALLBACK);
  const [flashcards, setFlashcards] = useState<NeuroFlashcard[]>(FLASHCARDS_FALLBACK);
  const [curve, setCurve] = useState<NeuroCurvePoint[]>(CURVE_FALLBACK);
  const [achievements, setAchievements] = useState<NeuroAchievement[]>(ACHIEVEMENTS_FALLBACK);
  const [profile, setProfile] = useState<NeuroProfile>(PROFILE_FALLBACK);
  const [heatmap, setHeatmap] = useState<NeuroHeatmap>(HEATMAP_FALLBACK);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      *{box-sizing:border-box;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes dot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}
      @keyframes flicker{0%,100%{transform:scaleY(1) rotate(-3deg)}50%{transform:scaleY(1.15) rotate(3deg)}}
      ::-webkit-scrollbar{width:3px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:rgba(0,229,255,.18);border-radius:2px}
      input::placeholder{color:#4A6A85}
      button:active{transform:scale(0.97)}
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadNeuroData = async () => {
      try {
        const [topicsRes, flashcardsRes, curveRes, achievementsRes, profileRes, heatmapRes] = await Promise.all([
          getNeuroTopics(),
          getNeuroFlashcards(),
          getNeuroRetentionCurve(),
          getNeuroAchievements(),
          getNeuroProfile(),
          getNeuroHeatmap(),
        ]);

        if (cancelled) {
          return;
        }

        if (topicsRes.topics.length) setTopics(topicsRes.topics);
        if (flashcardsRes.flashcards.length) setFlashcards(flashcardsRes.flashcards);
        if (curveRes.curve.length) setCurve(curveRes.curve);
        if (achievementsRes.achievements.length) setAchievements(achievementsRes.achievements);
        if (profileRes) setProfile(profileRes);
        if (Object.keys(heatmapRes.heatmap).length) setHeatmap(heatmapRes.heatmap);
      } catch {
        if (!cancelled) {
          setTopics(TOPICS_FALLBACK);
          setFlashcards(FLASHCARDS_FALLBACK);
          setCurve(CURVE_FALLBACK);
          setAchievements(ACHIEVEMENTS_FALLBACK);
          setProfile(PROFILE_FALLBACK);
          setHeatmap(HEATMAP_FALLBACK);
        }
      }
    };

    void loadNeuroData();

    return () => {
      cancelled = true;
    };
  }, []);

  const screens: Record<Screen, ReactNode> = {
    dashboard: <DashboardScreen profile={profile} topics={topics} curve={curve} setScreen={setScreen} />,
    learn: <LearnScreen flashcards={flashcards} />,
    chat: <ChatScreen />,
    heatmap: <HeatmapScreen heatmap={heatmap} topics={topics} />,
    profile: <ProfileScreen profile={profile} achievements={achievements} />,
  };

  return (
    <div style={{ background: "#010508", minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 430, height: "100vh", background: T.bg, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", flexShrink: 0, background: `linear-gradient(180deg,${T.bg1} 0%,transparent 100%)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg,${T.cyan},${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, boxShadow: `0 0 14px ${T.cyan}44` }}>🧠</div>
            <span style={{ fontSize: 14, fontFamily: T.ff, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>
              Neuro<span style={{ color: T.cyan }}>Recall</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <Bell size={16} color={T.textMuted} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.pink, position: "absolute", top: -3, right: -3 }} />
            </div>
            <div style={{ padding: "3px 10px", background: T.goldDim, border: "1px solid rgba(255,184,0,0.3)", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
              <Zap size={11} color={T.gold} />
              <span style={{ fontSize: 11, fontFamily: T.fm, color: T.gold, fontWeight: 600 }}>{profile.xp} XP</span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: screen === "chat" ? 0 : 88, display: screen === "chat" ? "flex" : "block", flexDirection: screen === "chat" ? "column" : undefined }}>
          {screens[screen]}
        </div>

        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    </div>
  );
}
