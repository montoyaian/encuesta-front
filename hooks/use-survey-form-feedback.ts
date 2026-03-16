"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { type FieldErrors } from "react-hook-form";

import { useToast } from "@/components/ui/toast-provider";
import { collectNestedErrorMessages } from "@/lib/form-errors";
import {
  type SurveyActionState,
  type SurveyBuilderFormValues,
} from "@/types/survey";

type UseSurveyFormFeedbackParams = {
  activeState: SurveyActionState;
  errors: FieldErrors<SurveyBuilderFormValues>;
  redirectTo: string;
};

export function useSurveyFormFeedback({
  activeState,
  errors,
  redirectTo,
}: UseSurveyFormFeedbackParams) {
  const router = useRouter();
  const { notifyError, notifySuccess } = useToast();
  const lastHandledStateKeyRef = useRef<string>("");

  useEffect(() => {
    if (!activeState.message) {
      return;
    }

    const stateKey = `${activeState.success}:${activeState.message}:${activeState.apiError ?? ""}`;

    if (lastHandledStateKeyRef.current === stateKey) {
      return;
    }

    lastHandledStateKeyRef.current = stateKey;

    if (activeState.success) {
      notifySuccess(activeState.message);
      router.push(redirectTo);
      return;
    }

    if (activeState.apiError || activeState.formErrors?.length) {
      notifyError(activeState.apiError ?? activeState.message);
    }
  }, [
    activeState.apiError,
    activeState.formErrors,
    activeState.message,
    activeState.success,
    notifyError,
    notifySuccess,
    redirectTo,
    router,
  ]);

  const nestedValidationErrors = useMemo(() => collectNestedErrorMessages(errors), [errors]);

  return {
    nestedValidationErrors,
    apiErrors: activeState.apiError ? [activeState.apiError] : [],
    formErrors: activeState.formErrors ?? [],
  };
}
