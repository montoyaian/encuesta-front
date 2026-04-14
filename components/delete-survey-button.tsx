"use client";

import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type DeleteSurveyButtonProps = {
  surveyId: string;
  deleteAction: (formData: FormData) => Promise<void>;
};

export function DeleteSurveyButton({ surveyId, deleteAction }: DeleteSurveyButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleOpenConfirm = () => setIsConfirmOpen(true);
  const handleCancel = () => setIsConfirmOpen(false);

  const handleConfirmDelete = () => {
    setIsConfirmOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <form ref={formRef} action={deleteAction}>
        <input type="hidden" name="surveyId" value={surveyId} />
        <button
          type="button"
          onClick={handleOpenConfirm}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
        >
          Eliminar
        </button>
      </form>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Eliminar encuesta"
        description="Esta acción eliminará la encuesta de forma permanente y no podrá deshacerse. ¿Deseas continuar?"
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
      />
    </>
  );
}