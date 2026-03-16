import { ProfileEnum } from "@/types/auth";
import {
  SurveyQuestionTypeEnum,
  type Survey,
  type SurveyBuilderFormValues,
  type SurveyCreatePayload,
  type SurveyQuestion,
  type SurveyQuestionMetadata,
  type SurveyUpdatePayload,
} from "@/types/survey";

type SurveyFormQuestion = SurveyBuilderFormValues["questions"][number];

function isChoiceQuestion(type: SurveyQuestionTypeEnum) {
  return type === SurveyQuestionTypeEnum.SELECT || type === SurveyQuestionTypeEnum.RADIO;
}

function normalizeQuestionMetadata(metadata?: SurveyQuestionMetadata): SurveyQuestionMetadata {
  return {
    required: Boolean(metadata?.required),
    minLength: typeof metadata?.minLength === "number" ? metadata.minLength : undefined,
    maxLength: typeof metadata?.maxLength === "number" ? metadata.maxLength : undefined,
    isNumeric: Boolean(metadata?.isNumeric),
    allowOther: Boolean(metadata?.allowOther),
  };
}

function mapPayloadMetadata(
  type: SurveyQuestionTypeEnum,
  metadata?: SurveyQuestionMetadata,
): SurveyQuestionMetadata {
  const choiceQuestion = isChoiceQuestion(type);

  return {
    required: Boolean(metadata?.required),
    minLength: type === SurveyQuestionTypeEnum.TEXT ? metadata?.minLength : undefined,
    maxLength: type === SurveyQuestionTypeEnum.TEXT ? metadata?.maxLength : undefined,
    isNumeric: type === SurveyQuestionTypeEnum.TEXT ? Boolean(metadata?.isNumeric) : undefined,
    allowOther: choiceQuestion ? Boolean(metadata?.allowOther) : undefined,
  };
}

function toOptionTextList(options?: Array<{ text: string }>) {
  return (options ?? []).map((option) => option.text);
}

function normalizeQuestionOptions(options?: SurveyQuestion["options"]) {
  return (options ?? []).map((option) => {
    if (typeof option === "string") {
      return { text: option };
    }

    return {
      id: option.id,
      text: option.text,
    };
  });
}

function mapQuestionToPayload(
  question: SurveyFormQuestion,
  includeQuestionId: boolean,
) {
  const choiceQuestion = isChoiceQuestion(question.type);

  return {
    ...(includeQuestionId && question.id ? { id: question.id } : {}),
    text: question.text,
    type: question.type,
    options: choiceQuestion ? toOptionTextList(question.options) : undefined,
    metadata: mapPayloadMetadata(question.type, question.metadata),
  };
}

export function createEmptySurveyForm(): SurveyBuilderFormValues {
  return {
    title: "",
    description: "",
    targetRole: [ProfileEnum.ESTUDIANTE],
    allowMultipleResponses: false,
    questions: [
      {
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
      },
    ],
  };
}

export function normalizeSurveyToForm(survey: Survey): SurveyBuilderFormValues {
  const normalizedQuestions = [...(survey.questions ?? [])]
    .sort((left, right) => {
      const leftOrder =
        typeof left.questionOrder === "number" ? left.questionOrder : Number.MAX_SAFE_INTEGER;
      const rightOrder =
        typeof right.questionOrder === "number" ? right.questionOrder : Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    })
    .map((question) => ({
      id: question.id,
      text: question.text,
      type: question.type,
      options: normalizeQuestionOptions(question.options),
      metadata: normalizeQuestionMetadata(question.metadata),
    }));

  return {
    id: survey.id,
    title: survey.title,
    description: survey.description,
    targetRole: survey.targetRole,
    allowMultipleResponses: survey.allowMultipleResponses,
    questions: normalizedQuestions,
  };
}

export function buildCreateSurveyPayload(model: SurveyBuilderFormValues): SurveyCreatePayload {
  return {
    title: model.title,
    description: model.description,
    targetRole: model.targetRole,
    allowMultipleResponses: model.allowMultipleResponses,
    syncMode: "final-state",
    questions: model.questions.map((question) => mapQuestionToPayload(question, false)),
  };
}

export function buildUpdateSurveyPayload(model: SurveyBuilderFormValues): SurveyUpdatePayload {
  return {
    title: model.title,
    description: model.description,
    targetRole: model.targetRole,
    allowMultipleResponses: model.allowMultipleResponses,
    questions: model.questions.map((question) => mapQuestionToPayload(question, true)),
  };
}
