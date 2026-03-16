import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { getServerSessionUser } from "@/lib/auth-session";

export default async function ProtectedLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/signin");
  }

  const user = await getServerSessionUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar currentUser={{ fullName: user.fullName, profile: user.profile }} />
      <main className="ml-[var(--sidebar-width,16rem)] min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
