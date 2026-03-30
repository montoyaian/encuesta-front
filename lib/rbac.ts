import { redirect } from "next/navigation";

import { getServerSessionUser } from "@/lib/auth-session";
import { hasAccessByProfile, ProfileEnum } from "@/types/auth";

export async function requireProfiles(allowedProfiles: ProfileEnum[]) {
  const user = await getServerSessionUser();

  if (!user) {
    redirect("/signin");
  }

  if (!hasAccessByProfile(user.profile, allowedProfiles)) {
    redirect("/dashboard?forbidden=1");
  }

  return user;
}