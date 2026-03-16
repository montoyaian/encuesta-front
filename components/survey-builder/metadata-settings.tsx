"use client";

import { useWatch, type Control, type UseFormRegister, type UseFormSetValue } from "react-hook-form";

import { formCheckboxContainerClassName, formCheckboxInputClassName } from "@/components/ui/form-styles";
import { SurveyQuestionTypeEnum, type SurveyBuilderFormValues } from "@/types/survey";

type MetadataSettingsProps = {
  questionIndex: number;
  control: Control<SurveyBuilderFormValues>;
  register: UseFormRegister<SurveyBuilderFormValues>;
  setValue: UseFormSetValue<SurveyBuilderFormValues>;
};

const QUESTION_TYPE_LABELS: Record<SurveyQuestionTypeEnum, string> = {
  [SurveyQuestionTypeEnum.TEXT]: "Texto",
  [SurveyQuestionTypeEnum.SELECT]: "Seleccion multiple",
  [SurveyQuestionTypeEnum.RADIO]: "Radio",
};

const OTHER_OPTION_TOOLTIP_MESSAGE =
  "Si esta opcion esta activada, el usuario podra ingresar su propia respuesta. Si no desea este comportamiento, agregue la opcion \"Otros\" manualmente desde el formulario";

export function MetadataSettings({
  questionIndex,
  control,
  register,
  setValue,
}: MetadataSettingsProps) {
  const questionType = useWatch({
    control,
    name: `questions.${questionIndex}.type`,
  });

  const allowOther = useWatch({
    control,
    name: `questions.${questionIndex}.metadata.allowOther`,
  });

  const isTextQuestion = questionType === SurveyQuestionTypeEnum.TEXT;
  const supportsOther =
    questionType === SurveyQuestionTypeEnum.SELECT || questionType === SurveyQuestionTypeEnum.RADIO;

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200/60 bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Configuracion</p>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        <label className="grid gap-1.5 text-sm text-zinc-700">
          <span className="text-xs font-medium">Tipo de pregunta</span>
          <select
            {...register(`questions.${questionIndex}.type`, {
              onChange: (event) => {
                const nextType = event.target.value as SurveyQuestionTypeEnum;

                if (nextType === SurveyQuestionTypeEnum.TEXT) {
                  setValue(`questions.${questionIndex}.options`, [], {
                    shouldDirty: true,
                  });
                  setValue(`questions.${questionIndex}.metadata.allowOther`, false, {
                    shouldDirty: true,
                  });
                }
              },
            })}
            defaultValue={questionType}
            className="rounded-lg border border-zinc-200/60 bg-white px-3 py-2 text-sm text-zinc-900 transition-all duration-200 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {Object.values(SurveyQuestionTypeEnum).map((type) => (
              <option key={type} value={type}>
                {QUESTION_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>

        <label className={`${formCheckboxContainerClassName} self-end py-2`}>
          <input
            type="checkbox"
            {...register(`questions.${questionIndex}.metadata.required`)}
            className={formCheckboxInputClassName}
          />
          Obligatorio
        </label>

        {supportsOther && (
          <div className="self-end">
            <button
              type="button"
              onClick={() =>
                setValue(`questions.${questionIndex}.metadata.allowOther`, !allowOther, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              className={`w-full rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 active:scale-[0.98] ${
                allowOther
                  ? "border-emerald-200/60 bg-emerald-50 text-emerald-600"
                  : "border-zinc-200/70 bg-white text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <span className="inline-flex items-center justify-center gap-1.5">
                {allowOther ? "Opcion Otros activada" : "Anadir opcion Otros"}
                <span
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-zinc-500 transition-colors duration-200 hover:text-zinc-700"
                  title={OTHER_OPTION_TOOLTIP_MESSAGE}
                  aria-label={OTHER_OPTION_TOOLTIP_MESSAGE}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>
                </span>
              </span>
            </button>
          </div>
        )}
      </div>

      {isTextQuestion && (
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <label className="grid gap-1.5 text-sm text-zinc-700">
            <span className="text-xs font-medium">Min. caracteres</span>
            <input
              type="number"
              min={0}
              placeholder="0"
              {...register(`questions.${questionIndex}.metadata.minLength`, {
                setValueAs: (value) => (value === "" ? undefined : Number(value)),
              })}
              className="rounded-lg border border-zinc-200/60 bg-white px-3 py-2 text-sm text-zinc-900 transition-all duration-200 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="grid gap-1.5 text-sm text-zinc-700">
            <span className="text-xs font-medium">Max. caracteres</span>
            <input
              type="number"
              min={0}
              placeholder="Sin limite"
              {...register(`questions.${questionIndex}.metadata.maxLength`, {
                setValueAs: (value) => (value === "" ? undefined : Number(value)),
              })}
              className="rounded-lg border border-zinc-200/60 bg-white px-3 py-2 text-sm text-zinc-900 transition-all duration-200 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className={`${formCheckboxContainerClassName} self-end py-2`}>
            <input
              type="checkbox"
              {...register(`questions.${questionIndex}.metadata.isNumeric`)}
              className={formCheckboxInputClassName}
            />
            Solo numeros
          </label>
        </div>
      )}
    </div>
  );
}
