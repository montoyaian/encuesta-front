import Link from "next/link";

import { getServerSessionUser } from "@/lib/auth-session";
import { hasAccessByProfile, ProfileEnum } from "@/types/auth";

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const forbidden = params.forbidden === "1";
  const user = await getServerSessionUser();
  const canManageSurveys = hasAccessByProfile(user?.profile, [
    ProfileEnum.PROFESOR,
    ProfileEnum.ADMINISTRATIVO,
  ]);

  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-2 text-zinc-600">
          Bienvenido a tu panel de control
        </p>
      </header>

      {/* Alert for forbidden access */}
      {forbidden && (
        <div className="mb-8 rounded-2xl border border-amber-200/60 bg-amber-50 px-6 py-4">
          <p className="text-sm font-medium text-amber-700">
            Tu perfil no tiene permiso para gestionar encuestas.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {canManageSurveys && (
          <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-zinc-600">Gestion</h3>
            <p className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">
              Ver mis encuestas
            </p>
            <Link
              href="/dashboard/encuestas"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/80"
            >
              Ir a mis encuestas
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        )}

        <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
            <svg
              className="h-6 w-6 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-zinc-600">Participacion</h3>
          <p className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">
            Responder encuestas
          </p>
          <Link
            href="/dashboard/responder"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition-colors duration-200 hover:text-emerald-600"
          >
            Ir a responder
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
