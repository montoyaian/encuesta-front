import { z } from "zod";

import { ProfileEnum } from "@/types/auth";
import { SurveyQuestionTypeEnum } from "@/types/survey";

const metadataSchema = z
  .object({
    required: z.boolean().optional(),
    minLength: z.number().int().nonnegative().optional(),
    maxLength: z.number().int().nonnegative().optional(),
    isNumeric: z.boolean().optional(),
    allowOther: z.boolean().optional(),
  })
  .default({});

const surveyOptionSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  text: z.string().min(1, "Cada opcion debe tener texto"),
  metadata: metadataSchema,
});

type QuestionValidationInput = {
  type: SurveyQuestionTypeEnum;
  options?: unknown[];
  metadata?: z.infer<typeof metadataSchema>;
};

function refineQuestionRules(
  value: QuestionValidationInput,
  ctx: z.RefinementCtx,
) {
  const metadata = value.metadata ?? {};

  if (
    (value.type === SurveyQuestionTypeEnum.SELECT ||
      value.type === SurveyQuestionTypeEnum.RADIO) &&
    (!value.options || value.options.length === 0)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["options"],
      message: "Las preguntas de tipo select o radio requieren opciones",
    });
  }

  if (value.type === SurveyQuestionTypeEnum.TEXT && metadata.allowOther) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["metadata", "allowOther"],
      message: "allowOther solo aplica para preguntas select o radio",
    });
  }

  if (value.type !== SurveyQuestionTypeEnum.TEXT && (metadata.minLength || metadata.maxLength)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["metadata", "minLength"],
      message: "minLength y maxLength solo aplican para preguntas de texto",
    });
  }

  if (
    typeof metadata.minLength === "number" &&
    typeof metadata.maxLength === "number" &&
    metadata.minLength > metadata.maxLength
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["metadata", "maxLength"],
      message: "El maximo no puede ser menor que el minimo",
    });
  }
}

const createQuestionSchema = z
  .object({
    text: z.string().min(1, "Cada pregunta debe tener texto"),
    type: z.nativeEnum(SurveyQuestionTypeEnum),
    options: z.array(z.string().min(1, "Cada opcion debe tener texto")).optional(),
    metadata: metadataSchema,
  })
  .superRefine((value, ctx) => refineQuestionRules(value, ctx));

const surveyBuilderQuestionSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    text: z.string().min(1, "Cada pregunta debe tener texto"),
    type: z.nativeEnum(SurveyQuestionTypeEnum),
    options: z.array(surveyOptionSchema).default([]),
    metadata: metadataSchema,
  })
  .superRefine((value, ctx) => refineQuestionRules(value, ctx));

export const surveyBuilderSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().min(3, "El titulo debe tener al menos 3 caracteres"),
  description: z.string().min(3, "La descripcion debe tener al menos 3 caracteres"),
  targetRole: z.array(z.nativeEnum(ProfileEnum)).min(1, "Selecciona al menos un rol objetivo"),
  allowMultipleResponses: z.boolean(),
  questions: z.array(surveyBuilderQuestionSchema).min(1, "Agrega al menos una pregunta"),
});

const updateQuestionPayloadSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    text: z.string().min(1, "Cada pregunta debe tener texto"),
    type: z.nativeEnum(SurveyQuestionTypeEnum),
    options: z.array(z.string().min(1, "Cada opcion debe tener texto")).optional(),
    metadata: metadataSchema,
  })
  .superRefine((value, ctx) => refineQuestionRules(value, ctx));

const surveyBasePayloadSchema = z.object({
  title: z.string().min(3, "El titulo debe tener al menos 3 caracteres"),
  description: z.string().min(3, "La descripcion debe tener al menos 3 caracteres"),
  targetRole: z.array(z.nativeEnum(ProfileEnum)).min(1, "Selecciona al menos un rol objetivo"),
  allowMultipleResponses: z.boolean(),
});

const createSurveyBasePayloadSchema = surveyBasePayloadSchema.extend({
  syncMode: z.literal("final-state"),
});

export const createSurveyPayloadSchema = createSurveyBasePayloadSchema.extend({
  questions: z.array(createQuestionSchema).min(1, "Agrega al menos una pregunta"),
});

export const updateSurveyPayloadSchema = surveyBasePayloadSchema.extend({
  id: z.union([z.string(), z.number()]).optional(),
  questions: z.array(updateQuestionPayloadSchema).min(1, "Agrega al menos una pregunta"),
});

export const submitSurveyAnswersPayloadSchema = z.object({
  surveyId: z.union([z.string(), z.number()]),
  answers: z
    .array(
      z.object({
        surveyQuestionId: z.union([z.string(), z.number()]),
        value: z.union([
          z.string().trim(),
          z.array(z.string().trim()),
        ]),
      }),
    )
    .min(1, "Debes responder al menos una pregunta"),
});

export type SurveyCreatePayloadSchemaValues = z.infer<typeof createSurveyPayloadSchema>;
export type SurveyUpdatePayloadSchemaValues = z.infer<typeof updateSurveyPayloadSchema>;
export type SurveyBuilderSchemaValues = z.infer<typeof surveyBuilderSchema>;
export type SubmitSurveyAnswersPayloadSchemaValues = z.infer<
  typeof submitSurveyAnswersPayloadSchema
>;
