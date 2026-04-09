"use client";

import { useEffect, useId, useState } from "react";

type DeleteSurveyButtonProps = {
  surveyId: string;
  surveyTitle: string;
  deleteAction: (formData: FormData) => Promise<void>;
};

export function DeleteSurveyButton({ surveyId, surveyTitle, deleteAction }: DeleteSurveyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalTitleId = useId();
  const modalDescriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
      >
        Eliminar
      </button>

      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "pointer-events-auto bg-slate-950/45 backdrop-blur-sm" : "pointer-events-none bg-slate-950/0"
        }`}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setIsOpen(false);
          }
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
          aria-describedby={modalDescriptionId}
          className={`w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_24px_70px_-24px_rgba(17,24,39,0.6)] backdrop-blur-sm transition-all duration-300 ${
            isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"
          }`}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-content-center rounded-xl bg-gradient-to-br from-red-100 to-rose-200 text-base font-bold text-rose-700 shadow-sm">
              !
            </div>
            <div>
              <h3 id={modalTitleId} className="text-lg font-semibold tracking-tight text-zinc-900">
                Confirmar eliminacion
              </h3>
              <p id={modalDescriptionId} className="mt-1 text-sm leading-relaxed text-zinc-600">
                Se eliminara la encuesta <span className="font-medium text-zinc-800">{surveyTitle}</span>. Esta accion
                no se puede deshacer.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-zinc-200 bg-zinc-100/70 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-200/70"
            >
              Cancelar
            </button>

            <form action={deleteAction}>
              <input type="hidden" name="surveyId" value={surveyId} />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(225,29,72,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-rose-700 hover:shadow-[0_12px_26px_-10px_rgba(190,18,60,0.75)] sm:w-auto"
              >
                Eliminar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}