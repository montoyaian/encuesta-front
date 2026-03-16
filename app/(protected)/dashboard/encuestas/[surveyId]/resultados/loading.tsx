export default function SurveyResultsLoadingPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm">
        <div className="h-8 w-72 animate-pulse rounded bg-zinc-200" />
        <div className="mt-4 h-4 w-96 animate-pulse rounded bg-zinc-200" />
      </div>

      {[1, 2].map((item) => (
        <div key={item} className="rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm">
          <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-6 w-2/3 animate-pulse rounded bg-zinc-200" />
          <div className="mt-5 h-64 w-full animate-pulse rounded-xl bg-zinc-100" />
        </div>
      ))}
    </div>
  );
}
