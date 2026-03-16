import {
  type AuthError,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
} from "@/types/auth";

const API_BASE_URL =
  process.env.API_BASE_URL ?? "https://encuestas-backend-f8d1.onrender.com";

type ServiceResponse<T> = {
  data?: T;
  error?: AuthError;
};

function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

async function safeJsonParse(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function registerUserService(
  payload: RegisterRequest,
): Promise<ServiceResponse<unknown>> {
  try {
    const response = await fetch(buildApiUrl("/users"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message:"No fue posible registrar el usuario en este momento",
        },
      };
    }

    return { data };
  } catch {
    return {
      error: {
        message: "Error de red al intentar registrar el usuario",
      },
    };
  }
}

export async function loginUserService(
  payload: LoginRequest,
): Promise<ServiceResponse<LoginResponse>> {
  try {
    const response = await fetch(buildApiUrl("/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message:"Credenciales invalidas o sesion no autorizada",
        },
      };
    }

    if (!data?.access_token) {
      return {
        error: {
          message: "La API no devolvio access_token",
        },
      };
    }

    return { data: { access_token: data.access_token } };
  } catch {
    return {
      error: {
        message: "Error de red al intentar iniciar sesion",
      },
    };
  }
}
