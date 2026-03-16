"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  type LoginFormState,
  type RegisterFormState,
  ProfileEnum,
} from "@/types/auth";
import { loginUserService, registerUserService } from "@/services/auth.service";
import { LoginFormSchema, RegisterFormSchema } from "@/validations/auth";

const AUTH_COOKIE_NAME = "auth_token";

const AUTH_COOKIE_CONFIG = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function registerUserAction(
  _prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const fields = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    fullName: String(formData.get("fullName") ?? ""),
    profile: String(formData.get("profile") ?? "") as ProfileEnum,
  };

  const validatedFields = RegisterFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      message: "Error de validacion",
      data: fields,
      zodErrors: flattenedErrors.fieldErrors,
      apiError: null,
    };
  }

  const response = await registerUserService(validatedFields.data);

  if (response.error) {
    return {
      success: false,
      message: "No fue posible completar el registro",
      data: validatedFields.data,
      zodErrors: null,
      apiError: response.error,
    };
  }

  return {
    success: true,
    message: "Registro completado. Ya puedes iniciar sesion.",
    data: {
      email: validatedFields.data.email,
      fullName: validatedFields.data.fullName,
      profile: validatedFields.data.profile,
      password: "",
    },
    zodErrors: null,
    apiError: null,
  };
}

export async function loginUserAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const fields = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const validatedFields = LoginFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      message: "Error de validacion",
      data: fields,
      zodErrors: flattenedErrors.fieldErrors,
      apiError: null,
    };
  }

  const response = await loginUserService(validatedFields.data);

  if (response.error || !response.data?.access_token) {
    return {
      success: false,
      message: "No fue posible iniciar sesion",
      data: validatedFields.data,
      zodErrors: null,
      apiError: response.error ?? { message: "Token no disponible" },
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, response.data.access_token, AUTH_COOKIE_CONFIG);

  redirect("/dashboard");
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/signin");
}