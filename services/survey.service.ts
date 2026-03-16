import {
  type Survey,
  type SurveyAnswerPayload,
  type SurveyChartsResponse,
  type SurveyCreatePayload,
  type SurveyUpdatePayload,
} from "@/types/survey";

const API_BASE_URL =
  process.env.API_BASE_URL ?? "https://encuestas-backend-f8d1.onrender.com";

type ServiceResponse<T> = {
  data?: T;
  error?: {
    status?: number;
    message: string;
  };
};

function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function listSurveysService(token: string): Promise<ServiceResponse<Survey[]>> {
  try {
    const response = await fetch(buildApiUrl("/surveys/created/by-me"), {
      headers: authHeaders(token),
      cache: "no-store",
    });

    const data = await parseJson(response);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: data?.message ?? "No fue posible obtener las encuestas",
        },
      };
    }

    return { data: Array.isArray(data) ? data : data?.items ?? [] };
  } catch {
    return { error: { message: "Error de red al consultar encuestas" } };
  }
}

export async function listAvailableSurveysService(
  token: string,
): Promise<ServiceResponse<Survey[]>> {
  try {
    const response = await fetch(buildApiUrl("/surveys"), {
      headers: authHeaders(token),
      cache: "no-store",
    });

    const data = await parseJson(response);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: data?.message ?? "No fue posible obtener las encuestas disponibles",
        },
      };
    }

    return { data: Array.isArray(data) ? data : data?.items ?? [] };
  } catch {
    return { error: { message: "Error de red al consultar encuestas disponibles" } };
  }
}

export async function createSurveyService(
  token: string,
  payload: SurveyCreatePayload,
): Promise<ServiceResponse<Survey>> {
  try {
    const response = await fetch(buildApiUrl("/surveys"), {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await parseJson(response);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: data?.message ?? "No fue posible crear la encuesta",
        },
      };
    }

    return { data };
  } catch {
    return { error: { message: "Error de red al crear encuesta" } };
  }
}

export async function getSurveyByIdService(
  token: string,
  surveyId: string,
): Promise<ServiceResponse<Survey>> {
  try {
    const response = await fetch(buildApiUrl(`/surveys/${surveyId}`), {
      headers: authHeaders(token),
      cache: "no-store",
    });

    const data = await parseJson(response);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: data?.message ?? "No fue posible obtener la encuesta",
        },
      };
    }

    return { data };
  } catch {
    return { error: { message: "Error de red al consultar la encuesta" } };
  }
}

export async function updateSurveyService(
  token: string,
  surveyId: string,
  payload: SurveyUpdatePayload,
): Promise<ServiceResponse<Survey>> {
  try {
    const response = await fetch(buildApiUrl(`/surveys/${surveyId}`), {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await parseJson(response);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: data?.message ?? "No fue posible actualizar la encuesta",
        },
      };
    }

    return { data };
  } catch {
    return { error: { message: "Error de red al actualizar encuesta" } };
  }
}

export async function deleteSurveyService(
  token: string,
  surveyId: string,
): Promise<ServiceResponse<null>> {
  try {
    const response = await fetch(buildApiUrl(`/surveys/${surveyId}`), {
      method: "DELETE",
      headers: authHeaders(token),
      cache: "no-store",
    });

    const data = await parseJson(response);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: data?.message ?? "No fue posible eliminar la encuesta",
        },
      };
    }

    return { data: null };
  } catch {
    return { error: { message: "Error de red al eliminar encuesta" } };
  }
}

export async function submitSurveyAnswersService(
  token: string,
  payload: SurveyAnswerPayload,
): Promise<ServiceResponse<null>> {
  try {
    const response = await fetch(buildApiUrl("/responses"), {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await parseJson(response);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: data?.message ?? "No fue posible enviar las respuestas",
        },
      };
    }

    return { data: null };
  } catch {
    return { error: { message: "Error de red al enviar respuestas" } };
  }
}

export async function getSurveyChartsByIdService(
  token: string,
  surveyId: string,
): Promise<ServiceResponse<SurveyChartsResponse>> {
  try {
    const response = await fetch(buildApiUrl(`/charts/${surveyId}`), {
      headers: authHeaders(token),
      cache: "no-store",
    });

    const data = await parseJson(response);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message: data?.message ?? "No fue posible obtener los resultados de la encuesta",
        },
      };
    }

    return { data };
  } catch {
    return { error: { message: "Error de red al consultar resultados" } };
  }
}