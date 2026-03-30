"use client";

import { useRouter } from "next/navigation";

import { SurveyCardBase } from "@/components/survey-card-base";
import { type Survey } from "@/types/survey";

type SurveyAnswerListProps = {
  surveys: Survey[];
};

export function SurveyAnswerList({ surveys }: SurveyAnswerListProps) {
  const router = useRouter();

  const handleRespondClick = (surveyId: string | number) => {
    // Ruta reservada para la experiencia de respuesta de encuestas.
    router.push(`/dashboard/responder/${surveyId}`);
  };

  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-sm sm:p-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Responder encuestas
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-700">
            Revisa las encuestas disponibles para tu perfil y responde en un solo clic.
          </p>
        </div>
      </header>

      {surveys.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white/90 p-12 text-center shadow-sm">
          <p className="text-zinc-700">No hay encuestas disponibles para responder.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {surveys.map((survey) => (
            <SurveyCardBase
              key={String(survey.id)}
              survey={survey}
              actions={
                <button
                  type="button"
                  onClick={() => handleRespondClick(survey.id)}
                  className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold tracking-wide text-white shadow-[0_8px_20px_-12px_rgba(37,99,235,0.9)] transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
                >
                  Responder
                </button>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
