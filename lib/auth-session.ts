import { cookies } from "next/headers";

import { ProfileEnum, type CurrentUser, type JwtTokenPayload } from "@/types/auth";

export const AUTH_COOKIE_NAME = "auth_token";

export async function getServerAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

function isValidProfile(profile: unknown): profile is ProfileEnum {
  return Object.values(ProfileEnum).includes(profile as ProfileEnum);
}

function isTokenExpired(exp: number | undefined) {
  if (!exp) {
    return false;
  }

  return exp <= Math.floor(Date.now() / 1000);
}

function decodeJwtPayload(token: string): JwtTokenPayload | null {
  try {
    const tokenParts = token.split(".");

    if (tokenParts.length < 2) {
      return null;
    }

    const payloadBase64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = payloadBase64.padEnd(Math.ceil(payloadBase64.length / 4) * 4, "=");
    const decodedPayload = Buffer.from(paddedBase64, "base64").toString("utf-8");

    return JSON.parse(decodedPayload) as JwtTokenPayload;
  } catch {
    return null;
  }
}

function resolveFullNameFromPayload(payload: JwtTokenPayload) {
  const candidateValues = [payload.fullName];

  for (const candidate of candidateValues) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  return "Usuario";
}

export async function getServerSessionUser() {
  const token = await getServerAuthToken();

  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  if (typeof payload.sub === "undefined" || !isValidProfile(payload.profile)) {
    return null;
  }

  if (isTokenExpired(payload.exp)) {
    return null;
  }

  const user: CurrentUser = {
    id: payload.sub,
    fullName: resolveFullNameFromPayload(payload),
    profile: payload.profile,
  };

  return user;
}