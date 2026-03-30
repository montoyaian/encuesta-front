export default function SurveyResponderLoadingPage() {
  return (
    <div className="bg-zinc-50 p-8">
      <div className="space-y-8">
        <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-8 shadow-sm">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mt-4 h-4 w-96 animate-pulse rounded-lg bg-zinc-200" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-zinc-200/60 bg-white p-5 shadow-sm"
            >
              <div className="h-5 w-40 animate-pulse rounded-lg bg-zinc-100" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-lg bg-zinc-100" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded-lg bg-zinc-100" />
              <div className="mt-6 h-8 w-24 animate-pulse rounded-lg bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
