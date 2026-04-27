"use client";

import { useState } from "react";
import { CheckCircle2, Workflow } from "lucide-react";
import { WorkflowBuilder } from "@/components/automation/workflow-builder";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useAppContext } from "@/context/app-context";
import { buildSuggestedWorkflow } from "@/lib/learning-intelligence";
import { triggerAutomationRequest, hasBackendApi } from "@/lib/api";
import { WorkflowNode } from "@/lib/types";

export default function AutomationsPage() {
  const { selectedTopicId, topics } = useAppContext();
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];
  const [workflowDrafts, setWorkflowDrafts] = useState<Record<string, WorkflowNode[]>>({});
  const [status, setStatus] = useState("Ready to map knowledge into action.");
  const nodes = workflowDrafts[selectedTopic.id] ?? buildSuggestedWorkflow(selectedTopic);

  async function handleRun() {
    if (hasBackendApi()) {
      await triggerAutomationRequest({
        topic: selectedTopic.title,
        steps: nodes.map((node) => node.label),
      });
      setStatus("Workflow request sent to the backend automation service.");
      return;
    }

    setStatus(`Preview mode: ${selectedTopic.title} would create a task, calendar block, and reminder workflow.`);
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Automation integration"
        title="Turn learning progress into tasks, reminders, and operational workflows."
        description="Build n8n-style flows that react to quiz regressions, confusion spikes, or completed topics."
      />

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Action engine</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{selectedTopic.title}</h3>
          <div className="mt-5 space-y-4">
            {selectedTopic.automationIdeas.map((idea) => (
              <div key={idea} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm leading-7 text-slate-200">{idea}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              "Email digest",
              "Calendar blocks",
              "Task board sync",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleRun}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            <Workflow className="h-4 w-4" />
            Run workflow
          </button>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
            {status}
          </div>
        </Card>

        <WorkflowBuilder
          nodes={nodes}
          onChange={(nextNodes) =>
            setWorkflowDrafts((current) => ({
              ...current,
              [selectedTopic.id]: nextNodes,
            }))
          }
        />
      </div>
    </div>
  );
}
