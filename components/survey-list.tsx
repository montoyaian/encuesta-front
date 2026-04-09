import Link from "next/link";
import { type ReactNode } from "react";

import { actions } from "@/actions";
import { DeleteSurveyButton } from "@/components/delete-survey-button";
import { SurveyCardBase } from "@/components/survey-card-base";
import { type Survey } from "@/types/survey";

type SurveyListProps = {
  surveys: Survey[];
};

type SurveyCardProps = {
  survey: Survey;
  actions: ReactNode;
};

export function SurveyCard({ survey, actions }: SurveyCardProps) {
  return <SurveyCardBase survey={survey} actions={actions} />;
}

export function SurveyList({ surveys }: SurveyListProps) {
  return (
    <section className="space-y-8">
      <header className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Encuestas</h1>
            <p className="mt-3 text-zinc-600">
              Consulta las encuestas registradas y crea una nueva desde el formulario dedicado.
            </p>
          </div>
          <Link
            href="/dashboard/encuestas/nueva"
            className="rounded-lg bg-[#007AFF] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#006ee6] active:scale-[0.98]"
          >
            Nueva encuesta
          </Link>
        </div>
      </header>

      {surveys.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <p className="text-zinc-600">No hay encuestas registradas.</p>
          <Link
            href="/dashboard/encuestas/nueva"
            className="mt-4 inline-block rounded-lg bg-[#007AFF] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#006ee6]"
          >
            Crear primera encuesta
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {surveys.map((survey) => (
            <SurveyCard
              key={String(survey.id)}
              survey={survey}
              actions={
                <>
                  <DeleteSurveyButton
                    surveyId={String(survey.id)}
                    surveyTitle={survey.title}
                    deleteAction={actions.survey.deleteSurveyAction}
                  />
                  <Link
                    href={`/dashboard/encuestas/${survey.id}/editar`}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/dashboard/encuestas/${survey.id}/resultados`}
                    className="rounded-lg bg-[#007AFF] px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:bg-[#006ee6] active:scale-[0.98]"
                  >
                    Ver Resultados
                  </Link>
                </>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
