import { ProfileEnum } from "@/types/auth";

const ROLE_LABELS: Record<ProfileEnum, string> = {
  [ProfileEnum.ADMINISTRATIVO]: "Administrativo",
  [ProfileEnum.PROFESOR]: "Profesor",
  [ProfileEnum.ESTUDIANTE]: "Estudiante",
};

export function getRoleLabel(role: ProfileEnum): string {
  return ROLE_LABELS[role] ?? role;
}

export function formatSurveyDate(date: string | Date | undefined): string {
  if (!date) return "Sin fecha";
  const parsed = new Date(date);

  return parsed.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
