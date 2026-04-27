export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_30%),radial-gradient(circle_at_80%_0%,_rgba(163,230,53,0.14),_transparent_25%),linear-gradient(180deg,_#071120_0%,_#030710_100%)] text-white">
      <div className="glass-grid absolute inset-0 opacity-20" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-cyan-300">MindStrom AI</p>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">
              Intelligent learning infrastructure for retention, comprehension, and real-world execution.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/[0.06]">
              Login
            </a>
            <a href="/dashboard" className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
              Launch workspace
            </a>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">
              Personal AI tutor + adaptive memory engine
            </span>
            <h1 className="mt-8 max-w-4xl font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-7xl">
              Learn faster, remember longer, and turn knowledge into action.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              MindStrom AI uses self-evolving forgetting curves, confusion detection, multi-mode tutoring, and automation flows to make every study session smarter.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/signup" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
                Create account
              </a>
              <a href="/docs" className="rounded-full border border-white/12 px-6 py-3 text-sm text-slate-100 transition hover:bg-white/[0.05]">
                Explore architecture
              </a>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["94%", "Recall uplift"],
                ["< 2 min", "AI lesson generation"],
                ["4 modes", "Adaptive explanations"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5">
                  <p className="text-3xl font-semibold">{value}</p>
                  <p className="mt-2 text-sm text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Live intelligence dashboard</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/[0.05] p-5">
                  <p className="text-sm text-slate-400">Future forget prediction</p>
                  <p className="mt-3 text-4xl font-semibold">3 topics</p>
                  <p className="mt-2 text-sm text-slate-300">Likely to decay in the next 7 days without review.</p>
                </div>
                <div className="rounded-3xl bg-white/[0.05] p-5">
                  <p className="text-sm text-slate-400">Confusion zones</p>
                  <p className="mt-3 text-4xl font-semibold">7</p>
                  <p className="mt-2 text-sm text-slate-300">Auto-prioritized weak concepts across engineering and AI topics.</p>
                </div>
              </div>
              <div className="mt-5 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <p className="text-sm text-cyan-100">Automation insight</p>
                <p className="mt-2 text-lg font-medium">
                  “DevOps Foundations” can trigger a revision task, calendar block, and Slack reminder automatically.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Upload notes or PDFs and get key points, flashcards, and quizzes instantly.",
                "Switch between story, technical, visual, and analytical tutor modes.",
                "Track understanding live with memory + confusion heatmaps.",
                "Sync with Firebase and convert learning into n8n workflows.",
              ].map((item) => (
                <div key={item} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-slate-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
