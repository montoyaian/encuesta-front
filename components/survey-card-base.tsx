import { type ReactNode } from "react";

import { formatSurveyDate, getRoleLabel } from "@/lib/survey-presentation";
import { type Survey } from "@/types/survey";

type SurveyCardBaseProps = {
  survey: Survey;
  actions: ReactNode;
};

export function SurveyCardBase({ survey, actions }: SurveyCardBaseProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_8px_24px_-18px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/70 hover:shadow-[0_20px_35px_-22px_rgba(37,99,235,0.55)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 opacity-80" />

      <header className="flex-1">
        <h3 className="text-lg font-semibold text-zinc-900">{survey.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-700">{survey.description}</p>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {survey.targetRole.map((role) => (
          <span
            key={role}
            className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700"
          >
            {getRoleLabel(role)}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-200/80 pt-4">
        <span className="text-xs font-medium text-zinc-500">{formatSurveyDate(survey.createdAt)}</span>

        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </article>
  );
}
