import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const endpoints = [
  "POST /api/v1/learning/generate-pack",
  "POST /api/v1/assistant/chat",
  "POST /api/v1/automation/trigger",
  "GET /api/v1/analytics/dashboard",
  "GET /api/v1/analytics/heatmap",
  "GET /health",
];

const structure = [
  "src/app -> Landing, auth, workspace routes",
  "src/components -> Shell, cards, charts, workflow builder",
  "src/context -> Global state via Context API",
  "src/lib -> Firebase, API clients, adaptive learning logic, mock AI",
  "src/data -> Demo seed data",
  "backend/app -> FastAPI routes, schemas, services",
];

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Architecture + API"
        title="Deployment-ready reference for the MindStrom AI stack."
        description="This workspace includes frontend route structure, FastAPI service endpoints, Firebase integration hooks, and demo-first fallbacks for local development."
      />

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Folder structure</p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            {structure.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">API routes</p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            {endpoints.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-slate-300">
            FastAPI exposes interactive docs at <code>/docs</code> and <code>/redoc</code> when the backend is running.
          </div>
        </Card>
      </div>

      <Card>
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Environment variables</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 text-sm text-slate-300">
          <p>NEXT_PUBLIC_API_BASE_URL</p>
          <p>NEXT_PUBLIC_FIREBASE_API_KEY</p>
          <p>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</p>
          <p>NEXT_PUBLIC_FIREBASE_PROJECT_ID</p>
          <p>NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID</p>
          <p>OPENAI_API_KEY</p>
          <p>N8N_WEBHOOK_URL</p>
        </div>
      </Card>
    </div>
  );
}
