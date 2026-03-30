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
import { ProfileEnum, type RegisterFormState } from "@/types/auth";

const INITIAL_STATE: RegisterFormState = {
  success: false,
  message: "",
  zodErrors: null,
  apiError: null,
  data: {
    email: "",
    password: "",
    fullName: "",
    profile: ProfileEnum.ESTUDIANTE,
  },
};

export function SignUpForm() {
  const [formState, formAction] = useActionState(
    actions.auth.registerUserAction,
    INITIAL_STATE,
  );

  return (
    <div className={formShellClassName}>
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-zinc-900">
          Crear cuenta
        </h1>
        <p className="text-sm text-zinc-600">
          Registra un nuevo usuario
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="fullName" className={formLabelClassName}>
            Nombre completo
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Tu nombre"
            defaultValue={formState.data?.fullName ?? ""}
            className={formInputClassName}
          />
          <FormError error={formState.zodErrors?.fullName} />
        </div>

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

        <div className="space-y-2">
          <label htmlFor="profile" className={formLabelClassName}>
            Perfil
          </label>
          <select
            id="profile"
            name="profile"
            defaultValue={formState.data?.profile ?? ProfileEnum.ESTUDIANTE}
            className={formInputClassName}
          >
            <option value={ProfileEnum.ADMINISTRATIVO}>Administrativo</option>
            <option value={ProfileEnum.PROFESOR}>Profesor</option>
            <option value={ProfileEnum.ESTUDIANTE}>Estudiante</option>
          </select>
          <FormError error={formState.zodErrors?.profile} />
        </div>

        {formState.apiError && (
          <div className="rounded-lg border border-red-200/60 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{formState.apiError.message}</p>
          </div>
        )}

        {formState.success && (
          <div className="rounded-lg border border-emerald-200/60 bg-emerald-50 px-4 py-3">
            <p className="text-sm text-emerald-600">{formState.message}</p>
          </div>
        )}

        <button
          type="submit"
          className={formSubmitButtonClassName}
        >
          Registrarme
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-600">
        Ya tienes cuenta?{" "}
        <Link href="/signin" className={formLinkClassName}>
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}
