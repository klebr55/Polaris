export default function EducationSkeleton() {
  return (
    <section className="px-6">
      <div className="mx-auto w-full max-w-6xl rounded-4xl border border-glass-border bg-glass/50 px-8 py-12 shadow-glass backdrop-blur-xl">
        <div className="flex flex-col gap-4">
          <div className="h-3 w-12 rounded-full bg-white/10" />
          <div className="h-8 w-72 rounded-full bg-white/10" />
          <div className="h-4 w-full max-w-2xl rounded-full bg-white/10" />
          <div className="h-4 w-2/3 max-w-xl rounded-full bg-white/10" />
        </div>

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
          <div className="h-64 w-full animate-pulse rounded-xl bg-white/5" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`edu-skeleton-${index}`}
              className="h-20 rounded-2xl border border-glass-border bg-white/5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
