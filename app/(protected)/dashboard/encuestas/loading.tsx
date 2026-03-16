export default function SurveysLoadingPage() {
  return (
    <div className="p-8">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-100" />
          <div className="mt-4 h-4 w-96 animate-pulse rounded-lg bg-zinc-100" />
        </div>

        {/* Content skeleton */}
        <div className="grid gap-8 lg:grid-cols-[360px,1fr]">
          <div className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="h-5 w-24 animate-pulse rounded-lg bg-zinc-100" />
              <div className="h-8 w-16 animate-pulse rounded-lg bg-zinc-100" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-100" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm">
            <div className="h-6 w-32 animate-pulse rounded-lg bg-zinc-100" />
            <div className="mt-8 space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
