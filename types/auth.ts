export enum ProfileEnum {
  ADMINISTRATIVO = "administrativo",
  PROFESOR = "profesor",
  ESTUDIANTE = "estudiante",
}

export type AuthError = {
  status?: number;
  message: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
  profile: ProfileEnum;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};

export type CurrentUser = {
  id: number | string;
  fullName: string;
  profile: ProfileEnum;
};

export type JwtTokenPayload = {
  sub: number | string;
  profile: ProfileEnum | string;
  fullName?: string;
  iat?: number;
  exp?: number;
};

export function hasAccessByProfile(
  profile: ProfileEnum | string | undefined,
  allowedProfiles: ProfileEnum[],
) {
  if (!profile) {
    return false;
  }

  return allowedProfiles.includes(profile as ProfileEnum);
}

export type RegisterFormState = {
  success?: boolean;
  message?: string;
  data?: {
    email?: string;
    password?: string;
    fullName?: string;
    profile?: ProfileEnum;
  };
  zodErrors?: {
    email?: string[];
    password?: string[];
    fullName?: string[];
    profile?: string[];
  } | null;
  apiError?: AuthError | null;
};

export type LoginFormState = {
  success?: boolean;
  message?: string;
  data?: {
    email?: string;
    password?: string;
  };
  zodErrors?: {
    email?: string[];
    password?: string[];
  } | null;
  apiError?: AuthError | null;
};