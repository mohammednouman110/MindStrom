"use client";

import { useState } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useAppContext } from "@/context/app-context";
import { assistantChatRequest, hasBackendApi } from "@/lib/api";
import { generateMockAssistantReply } from "@/lib/mock-ai";
import { AssistantMode, AssistantReply } from "@/lib/types";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

const modes: AssistantMode[] = ["story", "technical", "visual", "analytical"];

export default function AssistantPage() {
  const { locale, selectedTopicId, topics } = useAppContext();
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];
  const [mode, setMode] = useState<AssistantMode>("story");
  const [prompt, setPrompt] = useState("Explain gradient descent like I am designing a study routine.");
  const [reply, setReply] = useState<AssistantReply | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  async function handleAsk() {
    setLoading(true);
    try {
      let nextReply: AssistantReply;
      if (hasBackendApi()) {
        const response = (await assistantChatRequest({
          topic: selectedTopic.title,
          prompt,
          mode,
          language: locale,
        })) as { reply: AssistantReply };
        nextReply = response.reply;
      } else {
        nextReply = generateMockAssistantReply({
          topic: selectedTopic.title,
          prompt,
          mode,
          locale,
        });
      }
      setReply(nextReply);
    } finally {
      setLoading(false);
    }
  }

  function handleVoiceInput() {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setPrompt("Voice input is best experienced in a browser with SpeechRecognition support.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = locale === "hi" ? "hi-IN" : "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setPrompt(transcript);
    };
    recognition.onend = () => {
      setListening(false);
    };
    setListening(true);
    recognition.start();
  }

  function handleSpeak() {
    if (!reply || !("speechSynthesis" in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(reply.response);
    utterance.lang = locale === "hi" ? "hi-IN" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Multi-mode AI tutor"
        title="Switch explanation styles in real time and respond to confusion immediately."
        description="Use story, technical, visual, or analytical modes. Voice input and browser speech output are supported for hands-free learning."
      />

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Tutor controls</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {modes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`rounded-full px-4 py-2 text-sm transition ${mode === item ? "bg-cyan-300 text-slate-950" : "border border-white/10 bg-white/[0.04] text-slate-200"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="mt-5 min-h-[180px] w-full rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
          />
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAsk}
              disabled={loading}
              className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
            >
              {loading ? "Thinking..." : "Ask tutor"}
            </button>
            <button
              type="button"
              onClick={handleVoiceInput}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-100 transition hover:bg-white/[0.05]"
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {listening ? "Listening..." : "Voice input"}
            </button>
            <button
              type="button"
              onClick={handleSpeak}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-100 transition hover:bg-white/[0.05]"
            >
              <Volume2 className="h-4 w-4" />
              Speak answer
            </button>
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Understanding tracker</p>
          <div className="mt-5 space-y-5">
            {[
              ["Mastery", selectedTopic.retentionScore],
              ["Confusion", selectedTopic.confusionScore],
              ["Difficulty", selectedTopic.difficultyScore],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-sm text-slate-300">{value}%</p>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-lime-300"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-lg font-semibold text-white">{reply?.title ?? "Awaiting tutor prompt"}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {reply?.response ?? "Ask for an explanation, analogy, visual flow, or step-by-step reasoning."}
            </p>
            {reply ? (
              <>
                <div className="mt-5">
                  <p className="text-sm font-semibold text-cyan-200">Examples</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    {reply.examples.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-5">
                  <p className="text-sm font-semibold text-cyan-200">Next steps</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    {reply.nextSteps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
