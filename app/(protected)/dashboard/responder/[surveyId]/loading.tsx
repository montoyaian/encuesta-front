export default function SurveyResponderDetailLoadingPage() {
  return (
    <div className="bg-zinc-50 p-8">
      <div className="space-y-8">
        <div className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-8 shadow-sm">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mt-4 h-4 w-96 animate-pulse rounded-lg bg-zinc-200" />
        </div>

        <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-xl border border-zinc-200/60 bg-zinc-50 p-5">
                <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
                <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-zinc-200" />
                <div className="mt-5 h-10 w-full animate-pulse rounded bg-zinc-200" />
              </div>
            ))}
            <div className="h-11 w-44 animate-pulse rounded-lg bg-zinc-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
