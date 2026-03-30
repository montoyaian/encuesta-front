import { z } from "zod";

import { ProfileEnum } from "@/types/auth";

export const RegisterFormSchema = z.object({
  email: z.email("Ingresa un correo valido"),
  password: z
    .string()
    .min(6, "La contrasena debe tener al menos 6 caracteres")
    .max(100, "La contrasena no debe superar 100 caracteres"),
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(100, "El nombre completo no debe superar 100 caracteres"),
  profile: z.nativeEnum(ProfileEnum),
});

export const LoginFormSchema = z.object({
  email: z.email("Ingresa un correo valido"),
  password: z
    .string()
    .min(2, "La contrasena debe tener al menos 6 caracteres")
    .max(100, "La contrasena no debe superar 100 caracteres"),
});

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
export type LoginFormValues = z.infer<typeof LoginFormSchema>;