"use client";

import { useState } from "react";

import { useWatch, type Control, type UseFieldArrayRemove, type UseFormRegister, type UseFormSetValue } from "react-hook-form";

import { MetadataSettings } from "@/components/survey-builder/metadata-settings";
import { OptionsManager } from "@/components/survey-builder/options-manager";
import { type SurveyBuilderFormValues } from "@/types/survey";

type QuestionCardProps = {
  questionIndex: number;
  control: Control<SurveyBuilderFormValues>;
  register: UseFormRegister<SurveyBuilderFormValues>;
  setValue: UseFormSetValue<SurveyBuilderFormValues>;
  removeQuestion: UseFieldArrayRemove;
};

export function QuestionCard({
  questionIndex,
  control,
  register,
  setValue,
  removeQuestion,
}: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const questionText = useWatch({
    control,
    name: `questions.${questionIndex}.text`,
  });

  const persistedQuestionId = useWatch({
    control,
    name: `questions.${questionIndex}.id`,
  });

  const questionTitle = questionText?.trim() || "Pregunta sin titulo";

  return (
    <article className="rounded-xl border border-zinc-200/70 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <header className="space-y-2 border-b border-zinc-200/70 pb-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Pregunta {questionIndex + 1}
            {persistedQuestionId ? ` · id ${String(persistedQuestionId)}` : " · nueva"}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-200/70 active:scale-[0.98]"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Contraer pregunta" : "Expandir pregunta"}
            >
              {isExpanded ? "Contraer" : "Expandir"}
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                aria-hidden="true"
              >
                <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => removeQuestion(questionIndex)}
              className="rounded-lg border border-red-200/60 px-3 py-1.5 text-xs font-medium text-red-600 transition-all duration-200 hover:bg-red-50 active:scale-[0.98]"
            >
              Eliminar
            </button>
          </div>
        </div>

        <p className="truncate text-sm font-medium text-zinc-900">{questionTitle}</p>
      </header>

      <input
        type="hidden"
        {...register(`questions.${questionIndex}.id`)}
        defaultValue={persistedQuestionId ? String(persistedQuestionId) : ""}
      />

      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="min-h-0 pt-3">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-600">Pregunta</label>
              <textarea
                placeholder="Escribe la pregunta"
                rows={2}
                {...register(`questions.${questionIndex}.text`)}
                className="w-full resize-none rounded-lg border border-zinc-200/60 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all duration-200 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <MetadataSettings
              questionIndex={questionIndex}
              control={control}
              register={register}
              setValue={setValue}
            />

            <OptionsManager
              questionIndex={questionIndex}
              control={control}
              register={register}
              setValue={setValue}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
