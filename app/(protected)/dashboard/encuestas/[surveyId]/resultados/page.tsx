import Link from "next/link";
import { notFound } from "next/navigation";

import { SurveyResultsView } from "@/components/survey-results-view";
import { getServerAuthToken } from "@/lib/auth-session";
import { requireProfiles } from "@/lib/rbac";
import { getSurveyChartsByIdService } from "@/services/survey.service";
import { ProfileEnum } from "@/types/auth";

type SurveyResultsPageProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function SurveyResultsPage({ params }: SurveyResultsPageProps) {
  await requireProfiles([ProfileEnum.PROFESOR, ProfileEnum.ADMINISTRATIVO]);

  const token = await getServerAuthToken();

  if (!token) {
    return null;
  }

  const { surveyId } = await params;
  const response = await getSurveyChartsByIdService(token, surveyId);

  if (response.error) {
    if (response.error.status === 404) {
      notFound();
    }

    throw new Error(response.error.message);
  }

  if (!response.data) {
    notFound();
  }

  const questions = response.data.questions ?? [];

  return (
    <div className="min-h-screen bg-zinc-50/50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Header minimalista */}
        <header className="mb-8">
          <Link
            href="/dashboard/encuestas"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Volver al listado
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-800">
            Resultados de encuesta
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">
            Visualiza y analiza las respuestas recopiladas por cada pregunta.
          </p>
        </header>

        {/* Contenido */}
        {questions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100">
              <svg
                className="h-6 w-6 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <p className="text-sm text-zinc-500">
              Esta encuesta aún no tiene datos para visualizar.
            </p>
          </div>
        ) : (
          <SurveyResultsView questions={questions} />
        )}
      </div>
    </div>
  );
}
