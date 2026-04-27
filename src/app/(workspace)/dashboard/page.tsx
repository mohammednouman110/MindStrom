"use client";

import { Activity, AlarmClockCheck, Brain, Flame, Sparkles } from "lucide-react";
import { demoLeaderboard } from "@/data/demo-data";
import { useAppContext } from "@/context/app-context";
import { buildDashboardMetrics, buildDailyPlan, formatRelativeWindow } from "@/lib/learning-intelligence";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

export default function DashboardPage() {
  const { topics, user } = useAppContext();
  const metrics = buildDashboardMetrics(topics);
  const dailyPlan = buildDailyPlan(topics);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Personalized dashboard"
        title="Your next best study moves are already prioritized."
        description="Retention analytics, smart revision windows, gamification, and future-forget prediction sit in one adaptive command center."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Retention" value={`${metrics.averageRetention}%`} hint="Average recall strength across active topics." icon={<Brain className="h-5 w-5" />} />
        <MetricCard label="Confusion" value={`${metrics.averageConfusion}%`} hint="Live measure of hesitation, wrong patterns, and weak understanding." icon={<Activity className="h-5 w-5" />} />
        <MetricCard label="Due today" value={`${metrics.dueToday}`} hint="Topics that need a spaced-repetition touch today." icon={<AlarmClockCheck className="h-5 w-5" />} />
        <MetricCard label="XP + streak" value={`${user?.xp ?? 0}`} hint={`${user?.streak ?? 0} day learning streak.`} icon={<Flame className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Daily learning plan</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">Smart time optimization</h3>
            </div>
            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              Focus score {metrics.focusScore}
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            {dailyPlan.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.action}</p>
                  </div>
                  <div className="text-right text-sm text-slate-300">
                    <p>{item.focus}</p>
                    <p className="mt-1 text-cyan-300">{item.revisionWindow}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Real-time learning intelligence</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">What likely slips next week</h3>
          <div className="mt-6 space-y-4">
            {topics
              .slice()
              .sort((left, right) => left.retentionScore - right.retentionScore)
              .slice(0, 3)
              .map((topic) => (
                <div key={topic.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{topic.title}</p>
                      <p className="mt-2 text-sm text-slate-300">Forget risk: {100 - topic.retentionScore}%</p>
                    </div>
                    <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs text-rose-200">
                      {formatRelativeWindow(topic.predictedForgetAt)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm leading-7 text-cyan-100">
            MindStrom AI predicts forgetting risk by blending review history, confusion spikes, and difficulty scores instead of relying on a static forgetting curve.
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Gamification</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Momentum and achievements</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">Current level</p>
              <p className="mt-2 text-4xl font-semibold text-white">{user?.level ?? 1}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">Daily streak</p>
              <p className="mt-2 text-4xl font-semibold text-white">{user?.streak ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">Unlocked badges</p>
              <p className="mt-2 text-4xl font-semibold text-white">{user?.achievements.length ?? 0}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {user?.achievements.map((item) => (
              <span key={item} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                {item}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-cyan-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Leaderboard</p>
              <h3 className="mt-1 text-2xl font-semibold text-white">Community consistency</h3>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {demoLeaderboard.map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div>
                  <p className="font-semibold text-white">
                    #{index + 1} {entry.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{entry.streak} day streak</p>
                </div>
                <p className="text-lg font-semibold text-cyan-200">{entry.xp} XP</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
