import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{label}</p>
          <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-300">{hint}</p>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200">{icon}</div>
      </div>
    </Card>
  );
}
