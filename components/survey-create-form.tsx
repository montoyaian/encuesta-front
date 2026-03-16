"use client";

import Link from "next/link";

import { SurveyAlert } from "@/components/survey-builder/survey-alert";
import { QuestionCard } from "@/components/survey-builder/question-card";
import {
  formCheckboxContainerClassName,
  formCheckboxInputClassName,
  formInputClassName,
  formLabelClassName,
  formSecondaryButtonClassName,
} from "@/components/ui/form-styles";
import { useSurveyFormFeedback } from "@/hooks/use-survey-form-feedback";
import { useSurveyManager } from "@/hooks/use-survey-manager";
import { ProfileEnum } from "@/types/auth";
import { type Survey } from "@/types/survey";

type SurveyCreateFormProps = {
  initialSurvey?: Survey;
};

export function SurveyCreateForm({ initialSurvey }: SurveyCreateFormProps) {
  const isEditMode = Boolean(initialSurvey);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    errors,
    questionFields,
    removeQuestion,
    appendEmptyQuestion,
    activeState,
    isSubmitting,
    submitBuilder,
  } = useSurveyManager({ initialSurvey });
  const { nestedValidationErrors, apiErrors, formErrors } = useSurveyFormFeedback({
    activeState,
    errors,
    redirectTo: "/dashboard/encuestas",
  });

  return (
    <section className="space-y-8">
      <header className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              {isEditMode ? "Editar encuesta" : "Nueva encuesta"}
            </h1>
            <p className="mt-3 text-zinc-600">
              {isEditMode
                ? "Edita los datos de la encuesta y guarda los cambios para actualizarla en el listado."
                : "Diligencia los datos y guarda la encuesta para que quede disponible en el listado."}
            </p>
          </div>
          <Link
            href="/dashboard/encuestas"
            className={`${formSecondaryButtonClassName} text-xs`}
          >
            Volver al listado
          </Link>
        </div>
      </header>

      <article className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(submitBuilder)} className="space-y-8">
          <div className="space-y-2">
            <label className={formLabelClassName} htmlFor="title">
              Titulo
            </label>
            <input
              id="title"
              type="text"
              placeholder="Nombre de la encuesta"
              {...register("title")}
              className={formInputClassName}
            />
            {errors.title?.message && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={formLabelClassName} htmlFor="description">
              Descripcion
            </label>
            <textarea
              id="description"
              placeholder="Describe el proposito de esta encuesta"
              {...register("description")}
              className={`${formInputClassName} min-h-28 resize-none`}
            />
            {errors.description?.message && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-sm font-medium text-zinc-900">Roles objetivo</p>
              <div className="flex flex-wrap gap-3">
                {Object.values(ProfileEnum).map((role) => (
                  <label key={role} className={formCheckboxContainerClassName}>
                    <input
                      type="checkbox"
                      value={role}
                      {...register("targetRole")}
                      className={formCheckboxInputClassName}
                    />
                    {role}
                  </label>
                ))}
              </div>
              {errors.targetRole?.message && (
                <p className="text-sm text-red-600">{errors.targetRole.message}</p>
              )}
            </div>

            <label className={`${formCheckboxContainerClassName} mt-7 shrink-0`}>
              <input
                type="checkbox"
                {...register("allowMultipleResponses")}
                className={formCheckboxInputClassName}
              />
              Permitir multiples respuestas
            </label>
          </div>

          <div className="space-y-4 rounded-2xl border border-zinc-200/60 bg-zinc-50 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold tracking-tight text-zinc-900">Preguntas</h3>
              <button
                type="button"
                onClick={appendEmptyQuestion}
                className={`${formSecondaryButtonClassName} text-xs`}
              >
                Agregar pregunta
              </button>
            </div>

            <div className="space-y-3">
              {questionFields.map((field, questionIndex) => (
                <QuestionCard
                  key={field.rhfId}
                  questionIndex={questionIndex}
                  control={control}
                  register={register}
                  setValue={setValue}
                  removeQuestion={removeQuestion}
                />
              ))}
            </div>

            {questionFields.length === 0 && (
              <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center">
                <p className="text-sm text-zinc-600">
                  No hay preguntas. Haz clic en &quot;Agregar pregunta&quot; para comenzar.
                </p>
              </div>
            )}

            {errors.questions?.message && (
              <p className="text-sm text-red-600">{errors.questions.message}</p>
            )}
          </div>

          <SurveyAlert messages={formErrors} />

          <SurveyAlert messages={nestedValidationErrors} />

          <SurveyAlert messages={apiErrors} />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#007AFF] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#006ee6] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : isEditMode ? "Guardar cambios" : "Crear encuesta"}
          </button>
        </form>
      </article>
    </section>
  );
}
