"use client";

import { Card } from "@/components/ui/card";
import { Heatmap } from "@/components/ui/heatmap";
import { SectionHeading } from "@/components/ui/section-heading";
import { useAppContext } from "@/context/app-context";
import { buildHeatmap, formatRelativeWindow, rankDifficulty } from "@/lib/learning-intelligence";

export default function MemoryPage() {
  const { topics } = useAppContext();
  const heatmap = buildHeatmap(topics);
  const ranking = rankDifficulty(topics);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Adaptive memory engine"
        title="See how retention, confusion, and difficulty evolve together."
        description="The memory layer predicts forgetting, surfaces confusion zones, and recommends revision windows using a per-user learning model."
      />

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Combined memory + confusion heatmap</p>
          <div className="mt-5">
            <Heatmap cells={heatmap} />
          </div>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Difficulty ranking</p>
          <div className="mt-5 space-y-4">
            {ranking.map((topic) => (
              <div key={topic.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{topic.title}</p>
                    <p className="mt-2 text-sm text-slate-300">Weakest zone: {topic.confusionZones[0]?.concept ?? "Stable"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-cyan-200">{topic.difficultyScore}%</p>
                    <p className="mt-1 text-xs text-slate-400">difficulty</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Future forget prediction</p>
          <div className="mt-5 space-y-4">
            {topics
              .slice()
              .sort((left, right) => left.retentionScore - right.retentionScore)
              .map((topic) => (
                <div key={topic.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{topic.title}</p>
                      <p className="mt-2 text-sm text-slate-300">Next review {formatRelativeWindow(topic.nextReviewAt)}</p>
                    </div>
                    <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs text-rose-200">
                      Risk {100 - topic.retentionScore}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Retention curves</p>
          <div className="mt-5 space-y-5">
            {topics.map((topic) => (
              <div key={topic.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{topic.title}</p>
                  <span className="text-sm text-slate-300">{topic.retentionScore}% retention</span>
                </div>
                <div className="mt-3 flex items-end gap-2">
                  {topic.retentionCurve.map((point, index) => (
                    <div key={`${topic.id}-${index}`} className="flex-1">
                      <div
                        className="rounded-t-2xl bg-gradient-to-t from-cyan-400 via-teal-300 to-lime-300"
                        style={{ height: `${Math.max(point, 16) * 1.2}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
