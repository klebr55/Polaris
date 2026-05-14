export default function InternetAccessSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.4em] text-slate-500">
        <div className="h-3 w-28 rounded-full bg-white/10" />
        <div className="h-3 w-16 rounded-full bg-white/10" />
      </div>

      <div className="h-4 w-56 rounded-full bg-white/10" />

      <div className="relative h-56 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-r from-white/5 via-white/15 to-white/5 opacity-70" />
        <div className="absolute inset-0 animate-pulse bg-white/5" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="h-20 rounded-2xl border border-glass-border bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}
