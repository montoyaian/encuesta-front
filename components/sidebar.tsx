"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { actions } from "@/actions";
import { hasAccessByProfile, ProfileEnum } from "@/types/auth";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  allowedProfiles?: ProfileEnum[];
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
  },
  {
    label: "Ver mis encuestas",
    href: "/dashboard/encuestas",
    allowedProfiles: [ProfileEnum.PROFESOR, ProfileEnum.ADMINISTRATIVO],
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
        />
      </svg>
    ),
  },
  {
    label: "Responder encuestas",
    href: "/dashboard/responder",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
  },
];

type SidebarProps = {
  currentUser: {
    fullName: string;
    profile: ProfileEnum;
  };
};

function getProfileLabel(profile: ProfileEnum) {
  if (profile === ProfileEnum.ADMINISTRATIVO) {
    return "Administrativo";
  }

  if (profile === ProfileEnum.PROFESOR) {
    return "Profesor";
  }

  return "Estudiante";
}

function getInitials(fullName: string) {
  const cleanName = fullName.trim();

  if (!cleanName) {
    return "U";
  }

  const parts = cleanName.split(/\s+/).filter(Boolean);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");

  return initials || "U";
}

export function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const profileLabel = getProfileLabel(currentUser.profile);
  const userInitials = getInitials(currentUser.fullName);
  const availableNavItems = navItems.filter((item) => {
    if (!item.allowedProfiles) {
      return true;
    }

    return hasAccessByProfile(currentUser.profile, item.allowedProfiles);
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? "5rem" : "16rem",
    );

    return () => {
      document.documentElement.style.setProperty("--sidebar-width", "16rem");
    };
  }, [isCollapsed]);

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-zinc-200/60 bg-white/70 backdrop-blur-md transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div
        className={`flex h-16 items-center border-b border-zinc-200/60 ${
          isCollapsed ? "justify-center px-2" : "justify-between px-6"
        }`}
      >
        {!isCollapsed && (
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
            Mis encuestas
          </h1>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? "Expandir sidebar" : "Plegar sidebar"}
          className="rounded-md p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          {/* Icono hamburguesa */}
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <line x1="4" y1="7" x2="20" y2="7" strokeLinecap="round" />
            <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
            <line x1="4" y1="17" x2="20" y2="17" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-1 py-6 ${isCollapsed ? "px-2" : "px-4"}`}>
        {availableNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                isCollapsed ? "justify-center px-2" : "gap-3 px-4"
              } ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isCollapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer - Logout */}
      <div className={`mt-auto border-t border-zinc-200/60 ${isCollapsed ? "p-2" : "p-4"}`}>
        <div
          className={`mb-3 flex items-center rounded-lg border border-zinc-200/70 bg-zinc-50/80 ${
            isCollapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2.5"
          }`}
          title={isCollapsed ? `${currentUser.fullName} - ${profileLabel}` : undefined}
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {userInitials}
          </span>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">{currentUser.fullName}</p>
              <p className="truncate text-xs text-zinc-500">{profileLabel}</p>
            </div>
          )}
        </div>

        <form action={actions.auth.logoutUserAction}>
          <button
            type="submit"
            className={`flex w-full items-center rounded-lg py-2.5 text-sm font-medium text-zinc-600 transition-all duration-200 hover:bg-red-50 hover:text-destructive ${
              isCollapsed ? "justify-center px-2" : "gap-3 px-4"
            }`}
            title={isCollapsed ? "Cerrar sesion" : undefined}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            {!isCollapsed && "Cerrar sesion"}
          </button>
        </form>
      </div>
    </aside>
  );
}
