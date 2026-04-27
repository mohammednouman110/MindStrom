"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useAppContext } from "@/context/app-context";

export default function SignupPage() {
  const router = useRouter();
  const { signup, notice } = useAppContext();
  const [name, setName] = useState("Aarav Mehta");
  const [email, setEmail] = useState("aarav@mindstrom.ai");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup({ name, email, password });
      router.push("/dashboard");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#071120_0%,_#030710_100%)] px-6 py-10 text-white">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-8">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">Adaptive onboarding</p>
          <h1 className="mt-6 text-4xl font-semibold">Start your intelligent learning profile.</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            MindStrom AI personalizes review timing, quiz difficulty, AI explanation style, and automation actions from the first session.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-200" htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500"
                required
              />
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : <p className="text-sm text-slate-300">{notice}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </Card>
      </div>
    </main>
  );
}
