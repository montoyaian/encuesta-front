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

const AUTH_COOKIE_NAME = "JWT_TOKEN";

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

function extractCookieToken(setCookieHeader: string | null) {
  if (!setCookieHeader) {
    return null;
  }

  const cookieMatch = setCookieHeader.match(
    new RegExp(`${AUTH_COOKIE_NAME}=([^;]+)`),
  );

  return cookieMatch?.[1] ?? null;
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

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          message:"Credenciales invalidas o sesion no autorizada",
        },
      };
    }

    const setCookies = response.headers.getSetCookie 
      ? response.headers.getSetCookie().join("; ") 
      : response.headers.get("set-cookie");
      
    let token = extractCookieToken(setCookies);


    if (!token) {
      return {
        error: {
          message: "La API no devolvio la cookie de sesion",
        },
      };
    }

    return { data: { token } };
  } catch {
    return {
      error: {
        message: "Error de red al intentar iniciar sesion",
      },
    };
  }
}

export async function logoutUserService(token: string): Promise<ServiceResponse<unknown>> {
  try {
    const response = await fetch(buildApiUrl("/auth/logout"), {
      method: "POST",
      headers: {
        Cookie: `${AUTH_COOKIE_NAME}=${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await safeJsonParse(response);

      return {
        error: {
          status: response.status,
          message: data?.message ?? "No fue posible cerrar sesion",
        },
      };
    }

    return { data: null };
  } catch {
    return {
      error: {
        message: "Error de red al intentar cerrar sesion",
      },
    };
  }
}
