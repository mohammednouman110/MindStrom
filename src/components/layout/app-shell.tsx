"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Bot,
  BrainCircuit,
  Gauge,
  Languages,
  MoonStar,
  Network,
  SunMedium,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/app-context";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";

const navItems = [
  { href: "/dashboard", label: "dashboard", icon: Gauge },
  { href: "/learn", label: "learn", icon: BookOpenText },
  { href: "/memory", label: "memory", icon: BrainCircuit },
  { href: "/assistant", label: "assistant", icon: Bot },
  { href: "/automations", label: "automations", icon: Network },
  { href: "/docs", label: "docs", icon: BookOpenText },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, notice, setLocale, setTheme, syncCloud, theme, user, isSyncing } = useAppContext();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_30%),radial-gradient(circle_at_85%_10%,_rgba(163,230,53,0.12),_transparent_25%),linear-gradient(180deg,_#08111f_0%,_#060913_100%)] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="relative mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[290px_1fr]">
        <aside className="hidden border-r border-white/8 bg-slate-950/40 px-6 py-8 backdrop-blur-xl lg:flex lg:flex-col">
          <Link href="/" className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">MindStrom AI</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight">
              Memory, mastery, and action in one adaptive workspace.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">{t(locale, "hero")}</p>
          </Link>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition",
                    active
                      ? "border-cyan-400/30 bg-cyan-400/12 text-white"
                      : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.03] hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(locale, item.label)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Sync state</p>
                <p className="mt-2 text-sm text-slate-200">{isSyncing ? "Syncing..." : notice}</p>
              </div>
              <button
                type="button"
                onClick={syncCloud}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
              >
                {t(locale, "syncReady")}
              </button>
            </div>
          </div>
        </aside>

        <div className="relative">
          <header className="sticky top-0 z-30 border-b border-white/8 bg-slate-950/50 px-4 py-4 backdrop-blur-xl md:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.36em] text-cyan-300">Adaptive learning platform</p>
                <p className="mt-1 text-sm text-slate-300">{user ? `${user.name} • Level ${user.level}` : "Guest mode"}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLocale(locale === "en" ? "hi" : "en")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08]"
                >
                  <Languages className="h-4 w-4" />
                  {locale === "en" ? "EN" : "HI"}
                </button>
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08]"
                >
                  {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                  {theme === "dark" ? "Light" : "Dark"}
                </button>
              </div>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                      active
                        ? "border-cyan-400/30 bg-cyan-400/12 text-white"
                        : "border-white/10 bg-white/[0.03] text-slate-300",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t(locale, item.label)}
                  </Link>
                );
              })}
            </div>
          </header>

          <motion.main
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="px-4 py-6 md:px-8 md:py-8"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
