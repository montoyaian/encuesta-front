import { type ProfileEnum } from "@/types/auth";

export enum SurveyQuestionTypeEnum {
  SELECT = "select",
  TEXT = "text",
  RADIO = "radio",
}

export type SurveyOption = {
  id?: string | number;
  text: string;
  value?: string;
  metadata?: Record<string, unknown>;
};

export type SurveyQuestionMetadata = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  isNumeric?: boolean;
  allowOther?: boolean;
};

export type SurveyQuestion = {
  id?: string | number;
  text: string;
  type: SurveyQuestionTypeEnum;
  options?: Array<SurveyOption | string> | null;
  metadata?: SurveyQuestionMetadata;
  questionOrder?: number;
};

export type Survey = {
  id: string | number;
  title: string;
  description: string;
  targetRole: ProfileEnum[];
  allowMultipleResponses: boolean;
  questions: SurveyQuestion[];
  createdAt?: string | Date;
};

export type SurveyCreatePayload = {
  id?: string | number;
  title: string;
  description: string;
  targetRole: ProfileEnum[];
  allowMultipleResponses: boolean;
  questions: Array<{
    text: string;
    type: SurveyQuestionTypeEnum;
    options?: string[];
    metadata?: SurveyQuestionMetadata;
  }>;
  syncMode: "final-state";
};

export type SurveyUpdatePayload = {
  id?: string | number;
  title: string;
  description: string;
  targetRole: ProfileEnum[];
  allowMultipleResponses: boolean;
  questions: Array<{
    id?: string | number;
    text: string;
    type: SurveyQuestionTypeEnum;
    options?: string[];
    metadata?: SurveyQuestionMetadata;
  }>;
};

export type SurveyFinalStatePayload = SurveyUpdatePayload;

export type SurveyActionState = {
  success?: boolean;
  message?: string;
  formErrors?: string[];
  apiError?: string | null;
};

export type SurveyAnswerPayload = {
  surveyId: string | number;
  answers: Array<{
    surveyQuestionId: string | number;
    value: string | string[];
  }>;
};

export type SurveyAnswerActionState = {
  success?: boolean;
  message?: string;
  formErrors?: string[];
  apiError?: string | null;
};

export type SurveyChartType = "pie" | "bar" | "feed";

export type SurveyQuestionChartData = {
  chartType: SurveyChartType;
  labels?: string[];
  values: Array<number | string>;
  totalResponses?: number;
  totalSelections?: number;
};

export type SurveyQuestionChart = {
  questionId: string | number;
  title: string;
  type: string;
  chartData: SurveyQuestionChartData;
};

export type SurveyChartsResponse = {
  surveyId: string | number;
  questions: SurveyQuestionChart[];
};

export type SurveyBuilderFormValues = {
  id?: string | number;
  title: string;
  description: string;
  targetRole: ProfileEnum[];
  allowMultipleResponses: boolean;
  questions: Array<{
    id?: string | number;
    text: string;
    type: SurveyQuestionTypeEnum;
    options?: Array<{
      id?: string | number;
      text: string;
    }>;
    metadata?: SurveyQuestionMetadata;
  }>;
};
