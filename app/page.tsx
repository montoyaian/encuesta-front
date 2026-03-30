export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <section className="w-full max-w-md rounded-2xl border border-zinc-200/60 bg-white p-10 shadow-sm">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-zinc-900">
            Survey Builder
          </h1>
          <p className="text-zinc-600">
            Plataforma de creacion de encuestas
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
          >
            Crear cuenta
          </a>
          <a
            href="/signin"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200/60 bg-zinc-50 px-5 py-3.5 text-sm font-medium text-zinc-900 transition-all duration-200 hover:bg-zinc-100"
          >
            Iniciar sesion
          </a>
        </div>
      </section>
    </main>
  );
}
