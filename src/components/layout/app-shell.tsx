import Link from "next/link";
import {
  ClipboardList,
  Home,
  MapPinned,
  Navigation,
  PlusCircle,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { signOutAction } from "@/app/actions/auth";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

const citizenLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/reports", label: "Laporan", icon: ClipboardList },
  { href: "/dashboard/reports/new", label: "Buat Laporan", icon: PlusCircle },
  { href: "/dashboard/map", label: "Peta", icon: MapPinned },
  { href: "/profile", label: "Profil", icon: UserRound },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard Admin", icon: ShieldCheck },
  { href: "/admin/reports", label: "Kelola Laporan", icon: ClipboardList },
  { href: "/admin/map", label: "Peta Admin", icon: MapPinned },
  { href: "/admin/locations", label: "Lokasi Warga", icon: Navigation },
  { href: "/profile", label: "Profil", icon: UserRound },
];

export function AppShell({
  profile,
  children,
  variant = "citizen",
}: {
  profile: Profile;
  children: React.ReactNode;
  variant?: "citizen" | "admin";
}) {
  const links = variant === "admin" ? adminLinks : citizenLinks;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <Logo />
        <div className="mt-8 rounded-lg bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-950">
            {profile.full_name || "Warga SignalWarga"}
          </p>
          <p className="mt-1 text-xs capitalize text-slate-500">{profile.role}</p>
        </div>
        <nav className="mt-6 grid gap-1">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOutAction} className="absolute inset-x-4 bottom-5">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            <Settings className="size-4" />
            Keluar
          </button>
        </form>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Logo />
            <ButtonLink href="/dashboard/reports/new" size="sm">
              <PlusCircle className="size-4" />
              Lapor
            </ButtonLink>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
