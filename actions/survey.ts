"use server";

import { revalidatePath } from "next/cache";

import { getServerAuthToken, getServerSessionUser } from "@/lib/auth-session";
import {
  createSurveyService,
  deleteSurveyService,
  submitSurveyAnswersService,
  updateSurveyService,
} from "@/services/survey.service";
import { hasAccessByProfile, ProfileEnum } from "@/types/auth";
import { type SurveyActionState, type SurveyAnswerActionState } from "@/types/survey";
import {
  createSurveyPayloadSchema,
  type SurveyCreatePayloadSchemaValues,
  type SurveyUpdatePayloadSchemaValues,
  submitSurveyAnswersPayloadSchema,
  updateSurveyPayloadSchema,
} from "@/validations/survey";

function forbiddenState(): SurveyActionState {
  return {
    success: false,
    message: "Acceso denegado",
    apiError: "Solo perfiles administrativos o profesor pueden gestionar encuestas",
  };
}

async function ensureSurveyManagementAccess() {
  const [token, user] = await Promise.all([getServerAuthToken(), getServerSessionUser()]);

  if (!token || !user) {
    return { token: null, allowed: false };
  }

  const allowed = hasAccessByProfile(user.profile, [
    ProfileEnum.PROFESOR,
    ProfileEnum.ADMINISTRATIVO,
  ]);

  return { token, allowed };
}

async function ensureSurveyResponseAccess() {
  const [token, user] = await Promise.all([getServerAuthToken(), getServerSessionUser()]);

  if (!token || !user) {
    return { token: null, allowed: false };
  }

  const allowed = hasAccessByProfile(user.profile, [
    ProfileEnum.PROFESOR,
    ProfileEnum.ADMINISTRATIVO,
    ProfileEnum.ESTUDIANTE,
  ]);

  return { token, allowed };
}

function parsePayloadFromFormData<TPayload>(
  formData: FormData,
  schema: {
    safeParse: (input: unknown) =>
      | { success: true; data: TPayload }
      | { success: false; error: { issues: Array<{ message: string }> } };
  },
) {
  const payloadInput = String(formData.get("payload") ?? "");

  if (!payloadInput) {
    return {
      error: {
        success: false,
        message: "Payload invalido",
        apiError: "No se recibio el estado final de la encuesta",
      } satisfies SurveyActionState,
    };
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(payloadInput);
  } catch {
    return {
      error: {
        success: false,
        message: "Payload invalido",
        apiError: "El payload no es JSON valido",
      } satisfies SurveyActionState,
    };
  }

  const validated = schema.safeParse(parsedJson);

  if (!validated.success) {
    return {
      error: {
        success: false,
        message: "Error de validacion",
        formErrors: validated.error.issues.map((issue) => issue.message),
      } satisfies SurveyActionState,
    };
  }

  return { data: validated.data };
}

export async function createSurveyAction(
  _prevState: SurveyActionState,
  formData: FormData,
): Promise<SurveyActionState> {
  const access = await ensureSurveyManagementAccess();

  if (!access.allowed || !access.token) {
    return forbiddenState();
  }

  const parsed = parsePayloadFromFormData<SurveyCreatePayloadSchemaValues>(
    formData,
    createSurveyPayloadSchema,
  );

  if (parsed.error) {
    return parsed.error;
  }

  const response = await createSurveyService(access.token, parsed.data);

  if (response.error) {
    return {
      success: false,
      message: "No fue posible crear la encuesta",
      apiError: response.error.message,
    };
  }

  revalidatePath("/dashboard/encuestas");

  return {
    success: true,
    message: "Encuesta creada correctamente",
    apiError: null,
  };
}

export async function updateSurveyAction(
  _prevState: SurveyActionState,
  formData: FormData,
): Promise<SurveyActionState> {
  const access = await ensureSurveyManagementAccess();

  if (!access.allowed || !access.token) {
    return forbiddenState();
  }

  const surveyId = String(formData.get("surveyId") ?? "");

  if (!surveyId) {
    return {
      success: false,
      message: "Falta el id de la encuesta",
      apiError: "No se puede actualizar una encuesta sin id",
    };
  }

  const parsed = parsePayloadFromFormData<SurveyUpdatePayloadSchemaValues>(
    formData,
    updateSurveyPayloadSchema,
  );

  if (parsed.error) {
    return parsed.error;
  }

  const response = await updateSurveyService(access.token, surveyId, parsed.data);

  if (response.error) {
    return {
      success: false,
      message: "No fue posible actualizar la encuesta",
      apiError: response.error.message,
    };
  }

  revalidatePath("/dashboard/encuestas");

  return {
    success: true,
    message: "Encuesta actualizada con estrategia de estado final",
    apiError: null,
  };
}

export async function deleteSurveyAction(formData: FormData): Promise<void> {
  const access = await ensureSurveyManagementAccess();

  if (!access.allowed || !access.token) {
    return;
  }

  const surveyId = String(formData.get("surveyId") ?? "");

  if (!surveyId) {
    return;
  }

  await deleteSurveyService(access.token, surveyId);
  revalidatePath("/dashboard/encuestas");
}

export async function submitSurveyAnswersAction(
  _prevState: SurveyAnswerActionState,
  formData: FormData,
): Promise<SurveyAnswerActionState> {
  const access = await ensureSurveyResponseAccess();

  if (!access.allowed || !access.token) {
    return {
      success: false,
      message: "Acceso denegado",
      apiError: "No tienes permisos para responder encuestas",
    };
  }

  const payloadInput = String(formData.get("payload") ?? "");

  if (!payloadInput) {
    return {
      success: false,
      message: "Payload invalido",
      apiError: "No se recibio la respuesta de la encuesta",
    };
  }

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(payloadInput);
  } catch {
    return {
      success: false,
      message: "Payload invalido",
      apiError: "El payload no es JSON valido",
    };
  }

  const validated = submitSurveyAnswersPayloadSchema.safeParse(parsedJson);

  if (!validated.success) {
    return {
      success: false,
      message: "Error de validacion",
      formErrors: validated.error.issues.map((issue) => issue.message),
    };
  }

  const response = await submitSurveyAnswersService(access.token, validated.data);

  if (response.error) {
    return {
      success: false,
      message: "No fue posible enviar las respuestas",
      apiError: response.error.message,
    };
  }

  revalidatePath("/dashboard/responder");

  return {
    success: true,
    message: "Respuestas enviadas correctamente",
    apiError: null,
  };
}