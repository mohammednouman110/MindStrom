export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.34em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">{description}</p>
    </div>
  );
}
