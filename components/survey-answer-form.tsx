"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useRef, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { actions } from "@/actions";
import { formCheckboxContainerClassName, formCheckboxInputClassName } from "@/components/ui/form-styles";
import { useToast } from "@/components/ui/toast-provider";
import { type Survey, SurveyQuestionTypeEnum } from "@/types/survey";

type SurveyAnswerFormProps = {
  survey: Survey;
};

type AnswerFormValue = string | string[];
type AnswerFormValues = Record<string, AnswerFormValue>;

const EMPTY_ACTION_STATE = {
  success: false,
  message: "",
  formErrors: [],
  apiError: null,
};

const OTHER_OPTION_VALUE = "__other__";

function asQuestionKey(questionId: string | number) {
  return `q_${String(questionId)}`;
}

function asOtherQuestionKey(questionId: string | number) {
  return `q_${String(questionId)}_other`;
}

function normalizeOption(option: string | { text: string }) {
  if (typeof option === "string") {
    return option;
  }

  return option.text;
}

function getTextPlaceholder(metadata: { isNumeric?: boolean; minLength?: number; maxLength?: number }) {
  if (metadata.isNumeric) {
    return "Ej: 123";
  }

  if (typeof metadata.minLength === "number" && typeof metadata.maxLength === "number") {
    return `Escribe entre ${metadata.minLength} y ${metadata.maxLength} caracteres`;
  }

  if (typeof metadata.maxLength === "number") {
    return `Escribe tu respuesta (max. ${metadata.maxLength} caracteres)`;
  }

  if (typeof metadata.minLength === "number") {
    return `Escribe al menos ${metadata.minLength} caracteres`;
  }

  return "Describe tu respuesta";
}

function normalizeToStringArray(value: AnswerFormValue | undefined) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value];
  }

  return [];
}

export function SurveyAnswerForm({ survey }: SurveyAnswerFormProps) {
  const router = useRouter();
  const { notifyError, notifySuccess } = useToast();
  const lastHandledStateKeyRef = useRef<string>("");
  const [isPending, startTransition] = useTransition();
  const [submitState, submitActionDispatch] = useActionState(
    actions.survey.submitSurveyAnswersAction,
    EMPTY_ACTION_STATE,
  );
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnswerFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
  });
  const watchedValues = useWatch({ control });

  const orderedQuestions = useMemo(
    () => [...survey.questions].sort((a, b) => (a.questionOrder ?? 0) - (b.questionOrder ?? 0)),
    [survey.questions],
  );

  useEffect(() => {
    if (!submitState.message) {
      return;
    }

    const stateKey = `${submitState.success}:${submitState.message}:${submitState.apiError ?? ""}`;

    if (lastHandledStateKeyRef.current === stateKey) {
      return;
    }

    lastHandledStateKeyRef.current = stateKey;

    if (submitState.success) {
      notifySuccess(submitState.message);
      router.push("/dashboard/responder");
      return;
    }

    if (submitState.apiError || submitState.formErrors?.length) {
      notifyError(submitState.apiError ?? submitState.message);
    }
  }, [
    notifyError,
    notifySuccess,
    router,
    submitState.apiError,
    submitState.formErrors,
    submitState.message,
    submitState.success,
  ]);

  const onSubmit = (values: AnswerFormValues) => {
    const answers = orderedQuestions.map((question) => {
      const questionKey = asQuestionKey(question.id ?? question.text);
      const otherKey = asOtherQuestionKey(question.id ?? question.text);
      const rawValue = values[questionKey];
      const otherValue = typeof values[otherKey] === "string" ? values[otherKey] : "";

      if (question.type === SurveyQuestionTypeEnum.SELECT) {
        const selectedValues = normalizeToStringArray(rawValue).map((selected) => {
          if (selected === OTHER_OPTION_VALUE) {
            return otherValue.trim();
          }

          return selected.trim();
        });

        return {
          surveyQuestionId: question.id ?? question.text,
          value: selectedValues.filter((selected) => selected.length > 0),
        };
      }

      const baseValue = typeof rawValue === "string" ? rawValue : "";
      const isOther = baseValue === OTHER_OPTION_VALUE;

      return {
        surveyQuestionId: question.id ?? question.text,
        value: isOther ? otherValue.trim() : baseValue.trim(),
      };
    });

    const payload = {
      surveyId: survey.id,
      answers,
    };

    const formData = new FormData();
    formData.set("payload", JSON.stringify(payload));

    startTransition(() => {
      submitActionDispatch(formData);
    });
  };

  return (
    <section className="space-y-8">
      <header className="rounded-2xl border border-zinc-200/60 bg-zinc-50 p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">{survey.title}</h1>
            <p className="mt-3 text-zinc-600">{survey.description}</p>
          </div>
          <Link
            href="/dashboard/responder"
            className="rounded-lg border border-zinc-200/70 bg-white px-4 py-2 text-xs font-medium text-zinc-800 shadow-sm transition-all duration-200 hover:bg-zinc-100 active:scale-[0.98]"
          >
            Volver al listado
          </Link>
        </div>
      </header>

      <article className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {orderedQuestions.map((question, index) => {
            const questionId = question.id ?? question.text;
            const questionKey = asQuestionKey(questionId);
            const otherKey = asOtherQuestionKey(questionId);
            const metadata = question.metadata ?? {};
            const isRequired = Boolean(metadata.required);
            const allowOther = Boolean(metadata.allowOther);
            const selectedValue = watchedValues?.[questionKey];
            const selectedValues = normalizeToStringArray(selectedValue);
            const showOtherInput =
              allowOther &&
              (question.type === SurveyQuestionTypeEnum.SELECT
                ? selectedValues.includes(OTHER_OPTION_VALUE)
                : selectedValue === OTHER_OPTION_VALUE);
            const options = (question.options ?? []).map(normalizeOption).filter(Boolean);

            return (
              <div key={String(questionId)} className="rounded-xl border border-zinc-200/60 bg-zinc-50 p-5">
                <p className="text-sm font-medium text-zinc-500">Pregunta {index + 1}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-zinc-900">{question.text}</p>
                  {isRequired && <span className="text-xs font-medium text-zinc-400">(Requerido)</span>}
                </div>

                {question.type === SurveyQuestionTypeEnum.TEXT && (
                  <div className="mt-4 space-y-2">
                    {(() => {
                      const currentValue = watchedValues?.[questionKey] ?? "";
                      const currentLength = String(currentValue).length;
                      const minLength =
                        typeof metadata.minLength === "number" ? metadata.minLength : undefined;
                      const maxLength =
                        typeof metadata.maxLength === "number" ? metadata.maxLength : undefined;

                      return (
                        <>
                          <div className="relative">
                            <input
                              type="text"
                              inputMode={metadata.isNumeric ? "numeric" : "text"}
                              placeholder={getTextPlaceholder(metadata)}
                              minLength={minLength}
                              maxLength={maxLength}
                              {...register(questionKey, {
                                required: isRequired ? "Este campo es obligatorio" : false,
                                minLength:
                                  typeof metadata.minLength === "number"
                                    ? {
                                        value: metadata.minLength,
                                        message: `Debes ingresar al menos ${metadata.minLength} caracteres`,
                                      }
                                    : undefined,
                                maxLength:
                                  typeof metadata.maxLength === "number"
                                    ? {
                                        value: metadata.maxLength,
                                        message: `No puedes superar ${metadata.maxLength} caracteres`,
                                      }
                                    : undefined,
                                validate: {
                                  numeric: (value) => {
                                    if (!metadata.isNumeric || typeof value !== "string" || !value) {
                                      return true;
                                    }

                                    return /^\d+$/.test(value) || "Solo se permiten numeros";
                                  },
                                },
                                onChange: (event) => {
                                  if (metadata.isNumeric) {
                                    const onlyDigits = String(event.target.value).replace(/\D+/g, "");
                                    event.target.value = onlyDigits;
                                  }
                                },
                              })}
                              className="w-full rounded-lg border border-zinc-200/60 bg-white px-4 py-2.5 pr-24 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all duration-200 focus:border-[#007AFF]/40 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-zinc-400">
                              {typeof maxLength === "number"
                                ? `${currentLength}/${maxLength}`
                                : typeof minLength === "number"
                                  ? `${currentLength} (min ${minLength})`
                                  : `${currentLength}`}
                            </span>
                          </div>
                          {typeof minLength === "number" && typeof maxLength === "number" && (
                            <p className="text-xs text-zinc-500">
                              Min {minLength} · Max {maxLength} caracteres
                            </p>
                          )}
                        </>
                      );
                    })()}
                    {errors[questionKey]?.message && (
                      <p className="text-sm text-red-600">{String(errors[questionKey]?.message)}</p>
                    )}
                  </div>
                )}

                {(question.type === SurveyQuestionTypeEnum.RADIO ||
                  question.type === SurveyQuestionTypeEnum.SELECT) && (
                  <div className="mt-4 space-y-3">
                    {question.type === SurveyQuestionTypeEnum.RADIO && (
                      <div className="space-y-2">
                        {options.map((option) => (
                          <label
                            key={option}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200/60 bg-white px-3 py-2 text-sm text-zinc-800 transition-all duration-200 hover:border-[#007AFF]/40"
                          >
                            <input
                              type="radio"
                              value={option}
                              {...register(questionKey, {
                                required: isRequired ? "Debes seleccionar una opcion" : false,
                              })}
                              className="h-4 w-4 border-zinc-300 text-[#007AFF] focus:ring-[#007AFF]/30"
                            />
                            {option}
                          </label>
                        ))}

                        {allowOther && (
                          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200/60 bg-white px-3 py-2 text-sm text-zinc-800 transition-all duration-200 hover:border-[#007AFF]/40">
                            <input
                              type="radio"
                              value={OTHER_OPTION_VALUE}
                              {...register(questionKey, {
                                required: isRequired ? "Debes seleccionar una opcion" : false,
                              })}
                              className="h-4 w-4 border-zinc-300 text-[#007AFF] focus:ring-[#007AFF]/30"
                            />
                            Otros
                          </label>
                        )}
                      </div>
                    )}

                    {question.type === SurveyQuestionTypeEnum.SELECT && (
                      <div className="flex flex-col gap-2">
                        {options.map((option) => (
                          <label key={option} className={formCheckboxContainerClassName}>
                            <input
                              type="checkbox"
                              value={option}
                              {...register(questionKey, {
                                validate: (value) => {
                                  if (!isRequired) return true;
                                  return (
                                    normalizeToStringArray(value).length > 0 ||
                                    "Debes seleccionar al menos una opcion"
                                  );
                                },
                              })}
                              className={formCheckboxInputClassName}
                            />
                            {option}
                          </label>
                        ))}

                        {allowOther && (
                          <label className={formCheckboxContainerClassName}>
                            <input
                              type="checkbox"
                              value={OTHER_OPTION_VALUE}
                              {...register(questionKey, {
                                validate: (value) => {
                                  if (!isRequired) return true;
                                  return (
                                    normalizeToStringArray(value).length > 0 ||
                                    "Debes seleccionar al menos una opcion"
                                  );
                                },
                              })}
                              className={formCheckboxInputClassName}
                            />
                            Otros
                          </label>
                        )}
                      </div>
                    )}

                    {showOtherInput && (
                      <div className="space-y-1">
                        {(() => {
                          const otherValue = watchedValues?.[otherKey] ?? "";
                          const otherLength = String(otherValue).length;
                          const otherMax = 120;

                          return (
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Describe la opcion esperada"
                                maxLength={otherMax}
                                {...register(otherKey, {
                                  validate: (value) => {
                                    if (!showOtherInput) return true;
                                    if (typeof value !== "string" || value.trim().length === 0) {
                                      return "Debes especificar la opcion Otros";
                                    }

                                    return true;
                                  },
                                })}
                                className="w-full rounded-lg border border-zinc-200/60 bg-white px-4 py-2.5 pr-24 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all duration-200 focus:border-[#007AFF]/40 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                              />
                              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-zinc-400">
                                {otherLength}/{otherMax}
                              </span>
                            </div>
                          );
                        })()}
                        {errors[otherKey]?.message && (
                          <p className="text-sm text-red-600">{String(errors[otherKey]?.message)}</p>
                        )}
                      </div>
                    )}

                    {errors[questionKey]?.message && (
                      <p className="text-sm text-red-600">{String(errors[questionKey]?.message)}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="rounded-lg bg-[#007AFF] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#006ee6] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting || isPending ? "Enviando..." : "Enviar respuestas"}
            </button>
          </div>

          {submitState.formErrors && submitState.formErrors.length > 0 && (
            <div className="rounded-2xl border border-red-200/60 bg-red-50 p-5">
              <ul className="space-y-1 text-sm text-red-600">
                {submitState.formErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {submitState.apiError && (
            <div className="rounded-2xl border border-red-200/60 bg-red-50 p-5">
              <p className="text-sm text-red-600">{submitState.apiError}</p>
            </div>
          )}

          {submitState.success && (
            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50 p-5">
              <p className="text-sm text-emerald-700">
                {submitState.message ?? "Respuestas enviadas correctamente"}
              </p>
            </div>
          )}
        </form>
      </article>
    </section>
  );
}
