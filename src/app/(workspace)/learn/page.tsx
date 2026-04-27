"use client";

import { FormEvent, useState } from "react";
import { UploadCloud, WandSparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useAppContext } from "@/context/app-context";
import { generateLearningPackRequest, hasBackendApi } from "@/lib/api";
import { getAdaptiveQuiz, questionTypeLabel } from "@/lib/learning-intelligence";
import { generateMockPack } from "@/lib/mock-ai";
import { LearningPack } from "@/lib/types";

export default function LearnPage() {
  const { addPack, answerQuestion, locale, selectedTopicId, topics } = useAppContext();
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? topics[0];
  const [title, setTitle] = useState("Systems Design for Scalable APIs");
  const [content, setContent] = useState(
    "Explain load balancing, caching, message queues, and eventual consistency in practical terms.",
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<LearningPack | null>(null);
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      let pack: LearningPack;

      if (hasBackendApi()) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("language", locale);
        if (file) {
          formData.append("file", file);
        }
        const response = (await generateLearningPackRequest(formData)) as { pack: LearningPack };
        pack = response.pack;
      } else {
        pack = generateMockPack({ title, content: file ? `${content}\n${file.name}` : content, language: locale });
      }

      addPack(pack, file ? "pdf" : "notes");
      setGenerated(pack);
      setFile(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Smart learning system"
        title="Upload material, generate structured lessons, and test understanding immediately."
        description="Paste notes, attach a PDF, or seed a topic. The platform turns raw material into summaries, flashcards, micro-lessons, and adaptive quizzes."
      />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <form className="space-y-5" onSubmit={handleGenerate}>
            <div>
              <label className="block text-sm font-medium text-slate-200" htmlFor="title">
                Topic title
              </label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
                placeholder="Enter a topic"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200" htmlFor="content">
                Notes or source text
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="mt-2 min-h-[180px] w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white"
                placeholder="Paste notes, ideas, or raw text here."
              />
            </div>
            <label className="flex cursor-pointer items-center justify-between rounded-3xl border border-dashed border-white/12 bg-white/[0.03] px-5 py-4">
              <div className="flex items-center gap-3">
                <UploadCloud className="h-5 w-5 text-cyan-300" />
                <span className="text-sm text-slate-300">{file ? file.name : "Attach a PDF for backend parsing"}</span>
              </div>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
            >
              <WandSparkles className="h-4 w-4" />
              {loading ? "Generating..." : "Generate learning pack"}
            </button>
          </form>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Output preview</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{generated?.title ?? selectedTopic.title}</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">{generated?.summary ?? selectedTopic.summary}</p>
          <div className="mt-5 space-y-3">
            {(generated?.keyPoints ?? selectedTopic.keyPoints).map((point) => (
              <div key={point} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
                {point}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Micro-learning modules</p>
          <div className="mt-5 space-y-4">
            {selectedTopic.microLessons.map((lesson) => (
              <div key={lesson.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-white">{lesson.title}</p>
                  <span className="rounded-full bg-white/[0.07] px-3 py-1 text-xs text-slate-300">{lesson.duration}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{lesson.content}</p>
                <p className="mt-4 text-sm text-cyan-200">{lesson.action}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Adaptive mini quiz</p>
          <div className="mt-5 space-y-5">
            {getAdaptiveQuiz(selectedTopic).map((question) => (
              <div key={question.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-white">{question.prompt}</p>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                    {questionTypeLabel(question.type)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        const result = answerQuestion(selectedTopic.id, question.id, option);
                        if (result) {
                          setFeedback((current) => ({
                            ...current,
                            [question.id]: `${result.correct ? "Correct" : "Needs revision"}: ${result.explanation}`,
                          }));
                        }
                      }}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {feedback[question.id] ? <p className="mt-4 text-sm text-slate-300">{feedback[question.id]}</p> : null}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
