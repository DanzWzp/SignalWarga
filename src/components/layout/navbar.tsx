import Link from "next/link";
import { MapPinned, Plus, ShieldCheck } from "lucide-react";

import { getCurrentUserProfile, getRoleHome } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { signOutAction } from "@/app/actions/auth";

export async function Navbar() {
  const current = await getCurrentUserProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#cara-kerja" className="hover:text-emerald-700">
            Cara Kerja
          </Link>
          <Link href="/#kategori" className="hover:text-emerald-700">
            Kategori
          </Link>
          <Link href="/peta-laporan" className="hover:text-emerald-700">
            Peta Publik
          </Link>
          <Link href="/privacy" className="hover:text-emerald-700">
            Privasi
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {current ? (
            <>
              <ButtonLink
                href="/dashboard/map"
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <MapPinned className="size-4" />
                Peta
              </ButtonLink>
              <ButtonLink href={getRoleHome(current.profile.role)} size="sm">
                {current.profile.role === "admin" ? (
                  <ShieldCheck className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
                Dashboard
              </ButtonLink>
              <form action={signOutAction} className="hidden sm:block">
                <button className="h-9 rounded-lg px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="outline" size="sm">
                Masuk
              </ButtonLink>
              <ButtonLink href="/register" size="sm">
                Daftar
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
