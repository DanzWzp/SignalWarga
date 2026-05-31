import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UserCheck } from "lucide-react";

import { AuthForm } from "@/components/auth/auth-form";
import { Logo } from "@/components/layout/logo";
import { getCurrentUserProfile, getRoleHome } from "@/lib/auth";

export default async function LoginPage() {
  const current = await getCurrentUserProfile();
  if (current) redirect(getRoleHome(current.profile.role));

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Logo />
        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Masuk</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Masuk untuk membuat laporan, melihat progres, dan memantau peta warga.
          </p>
          <div className="mt-6">
            <AuthForm mode="login" />
          </div>
          <div className="mt-5 grid gap-2 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <Link
              href="/login/admin"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ShieldCheck className="size-4" />
              Login Admin
            </Link>
            <Link
              href="/login/officer"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <UserCheck className="size-4" />
              Login Officer
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
