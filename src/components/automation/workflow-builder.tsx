"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WorkflowNode } from "@/lib/types";

export function WorkflowBuilder({
  nodes,
  onChange,
}: {
  nodes: WorkflowNode[];
  onChange: (nodes: WorkflowNode[]) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  function reorder(targetId: string) {
    if (!draggingId || draggingId === targetId) {
      return;
    }

    const next = [...nodes];
    const sourceIndex = next.findIndex((node) => node.id === draggingId);
    const targetIndex = next.findIndex((node) => node.id === targetId);
    const [source] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, source);
    onChange(next);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Drag-and-drop flow</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Workflow canvas</h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">n8n-style</span>
        </div>
        <div className="mt-6 space-y-3">
          {nodes.map((node, index) => (
            <motion.div
              layout
              key={node.id}
              draggable
              onDragStart={() => setDraggingId(node.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => reorder(node.id)}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-2xl border border-white/10 bg-white/[0.06] p-2 text-slate-300">
                  <GripVertical className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">
                      {index + 1}. {node.label}
                    </p>
                    <span className="rounded-full bg-white/[0.07] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-300">
                      {node.kind}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{node.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
      <Card>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Suggested automation</p>
        <h3 className="mt-2 text-xl font-semibold text-white">Why this matters</h3>
        <ul className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
          <li>Capture weak concepts and convert them into task reminders automatically.</li>
          <li>Schedule the next spaced review at the learner’s strongest focus window.</li>
          <li>Push quiz regressions into email, calendar, Slack, or project workflows.</li>
        </ul>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/20"
        >
          <Plus className="h-4 w-4" />
          Add node to flow
        </button>
      </Card>
    </div>
  );
}
