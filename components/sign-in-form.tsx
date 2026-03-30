"use client";

import Link from "next/link";
import { useActionState } from "react";

import { actions } from "@/actions";
import { FormError } from "@/components/form-error";
import {
  formInputClassName,
  formLabelClassName,
  formLinkClassName,
  formShellClassName,
  formSubmitButtonClassName,
} from "@/components/ui/form-styles";
import { type LoginFormState } from "@/types/auth";

const INITIAL_STATE: LoginFormState = {
  success: false,
  message: "",
  zodErrors: null,
  apiError: null,
  data: {
    email: "",
    password: "",
  },
};

export function SignInForm() {
  const [formState, formAction] = useActionState(
    actions.auth.loginUserAction,
    INITIAL_STATE,
  );

  return (
    <div className={formShellClassName}>
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-zinc-900">
          Iniciar sesion
        </h1>
        <p className="text-sm text-zinc-600">
          Ingresa con tu correo y contrasena
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className={formLabelClassName}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            defaultValue={formState.data?.email ?? ""}
            className={formInputClassName}
          />
          <FormError error={formState.zodErrors?.email} />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className={formLabelClassName}>
            Contrasena
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Tu contrasena"
            defaultValue={formState.data?.password ?? ""}
            className={formInputClassName}
          />
          <FormError error={formState.zodErrors?.password} />
        </div>

        {formState.apiError && (
          <div className="rounded-lg border border-red-200/60 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{formState.apiError.message}</p>
          </div>
        )}

        <button
          type="submit"
          className={formSubmitButtonClassName}
        >
          Entrar
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-600">
        No tienes cuenta?{" "}
        <Link href="/signup" className={formLinkClassName}>
          Registrate
        </Link>
      </p>
    </div>
  );
}
