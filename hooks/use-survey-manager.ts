"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";

import { actions } from "@/actions";
import {
  buildCreateSurveyPayload,
  buildUpdateSurveyPayload,
  createEmptySurveyForm,
  normalizeSurveyToForm,
} from "@/lib/survey-builder";
import {
  SurveyQuestionTypeEnum,
  type Survey,
  type SurveyActionState,
  type SurveyBuilderFormValues,
} from "@/types/survey";
import { surveyBuilderSchema } from "@/validations/survey";

const EMPTY_ACTION_STATE: SurveyActionState = {
  success: false,
  message: "",
  formErrors: [],
  apiError: null,
};

type UseSurveyManagerOptions = {
  initialSurvey?: Survey;
};

export function useSurveyManager(options?: UseSurveyManagerOptions) {
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();
  const selectedSurveyId = options?.initialSurvey ? String(options.initialSurvey.id) : "";

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SurveyBuilderFormValues>({
    resolver: zodResolver(surveyBuilderSchema),
    defaultValues: options?.initialSurvey
      ? normalizeSurveyToForm(options.initialSurvey)
      : createEmptySurveyForm(),
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
    keyName: "rhfId",
  });

  const [createState, createActionDispatch] = useActionState(
    actions.survey.createSurveyAction,
    EMPTY_ACTION_STATE,
  );
  const [updateState, updateActionDispatch] = useActionState(
    actions.survey.updateSurveyAction,
    EMPTY_ACTION_STATE,
  );

  const activeState = selectedSurveyId ? updateState : createState;

  useEffect(() => {
    if (activeState?.success) {
      router.refresh();
    }
  }, [activeState?.success, router]);

  function submitBuilder(values: SurveyBuilderFormValues) {
    const payload = selectedSurveyId
      ? buildUpdateSurveyPayload(values)
      : buildCreateSurveyPayload(values);

    const formData = new FormData();
    formData.set("payload", JSON.stringify(payload));

    if (selectedSurveyId) {
      formData.set("surveyId", selectedSurveyId);
    }

    const dispatchAction = selectedSurveyId ? updateActionDispatch : createActionDispatch;

    startTransition(() => {
      dispatchAction(formData);
    });
  }

  function appendEmptyQuestion() {
    appendQuestion({
      text: "",
      type: SurveyQuestionTypeEnum.TEXT,
      options: [],
      metadata: {
        required: false,
        minLength: undefined,
        maxLength: undefined,
        isNumeric: false,
        allowOther: false,
      },
    });
  }

  return {
    control,
    register,
    handleSubmit,
    setValue,
    errors,
    questionFields,
    removeQuestion,
    appendEmptyQuestion,
    activeState,
    selectedSurveyId,
    isSubmitting,
    submitBuilder,
  };
}
