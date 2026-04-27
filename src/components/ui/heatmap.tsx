import { HeatmapCell } from "@/lib/types";

function heatColor(confusion: number) {
  if (confusion >= 65) {
    return "from-rose-500/70 to-amber-400/40";
  }
  if (confusion >= 40) {
    return "from-amber-400/60 to-lime-300/30";
  }
  return "from-emerald-400/60 to-cyan-300/30";
}

export function Heatmap({ cells }: { cells: HeatmapCell[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className={`rounded-3xl border border-white/10 bg-gradient-to-br ${heatColor(cell.confusion)} p-4 text-slate-950 shadow-lg shadow-black/10`}
        >
          <p className="text-sm font-semibold">{cell.label}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-700">Retention</p>
              <p className="mt-1 text-lg font-semibold">{cell.retention}%</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-700">Confusion</p>
              <p className="mt-1 text-lg font-semibold">{cell.confusion}%</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-700">Difficulty</p>
              <p className="mt-1 text-lg font-semibold">{cell.difficulty}%</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
