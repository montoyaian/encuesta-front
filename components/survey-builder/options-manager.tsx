"use client";

import {
  useFieldArray,
  useWatch,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";

import { SurveyQuestionTypeEnum, type SurveyBuilderFormValues } from "@/types/survey";

type OptionsManagerProps = {
  questionIndex: number;
  control: Control<SurveyBuilderFormValues>;
  register: UseFormRegister<SurveyBuilderFormValues>;
  setValue: UseFormSetValue<SurveyBuilderFormValues>;
};

export function OptionsManager({
  questionIndex,
  control,
  register,
  setValue,
}: OptionsManagerProps) {
  const questionType = useWatch({
    control,
    name: `questions.${questionIndex}.type`,
  });

  const allowOther = useWatch({
    control,
    name: `questions.${questionIndex}.metadata.allowOther`,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
    keyName: "rhfId",
  });

  const supportsOptions =
    questionType === SurveyQuestionTypeEnum.SELECT || questionType === SurveyQuestionTypeEnum.RADIO;

  if (!supportsOptions) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200/60 bg-zinc-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Opciones</p>
        <button
          type="button"
          onClick={() => append({ text: "" })}
          className="rounded-lg border border-zinc-200/70 bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-800 shadow-sm transition-all duration-200 hover:bg-zinc-200/70 active:scale-[0.98]"
        >
          Anadir opcion
        </button>
      </div>

      <div className="space-y-2">
        {fields.map((field, optionIndex) => (
          <div key={field.rhfId} className="rounded-lg border border-zinc-200/60 bg-white p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">{optionIndex + 1}.</span>

              {field.id && (
                <span className="rounded-md border border-zinc-200/60 bg-zinc-50 px-2 py-1 text-[11px] text-zinc-500">
                  id {String(field.id)}
                </span>
              )}

              <input
                type="hidden"
                {...register(`questions.${questionIndex}.options.${optionIndex}.id`)}
                defaultValue={field.id ? String(field.id) : ""}
              />

              <input
                type="text"
                placeholder="Texto de la opcion"
                {...register(`questions.${questionIndex}.options.${optionIndex}.text`)}
                className="min-w-44 flex-1 rounded-lg border border-zinc-200/60 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all duration-200 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />

              <button
                type="button"
                onClick={() => remove(optionIndex)}
                className="rounded-lg border border-red-200/60 px-3 py-1.5 text-xs font-medium text-red-600 transition-all duration-200 hover:bg-red-50 active:scale-[0.98]"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-5 text-center">
          <p className="text-sm text-zinc-600">
            No hay opciones. Haz clic en &quot;Anadir opcion&quot; para comenzar.
          </p>
        </div>
      )}

      {allowOther && (
        <div className="rounded-lg border border-emerald-200/60 bg-emerald-50 p-4">
          <p className="mb-2 text-xs font-medium text-emerald-600">Vista previa de opcion Otros</p>
          <input
            type="text"
            disabled
            value="Otros..."
            onChange={() => undefined}
            className="w-full rounded-lg border border-emerald-200/60 bg-white px-4 py-2.5 text-sm text-zinc-500"
          />
          <button
            type="button"
            onClick={() =>
              setValue(`questions.${questionIndex}.metadata.allowOther`, false, {
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            className="mt-3 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-600 transition-all duration-200 hover:bg-emerald-100 active:scale-[0.98]"
          >
            Quitar opcion Otros
          </button>
        </div>
      )}
    </div>
  );
}
