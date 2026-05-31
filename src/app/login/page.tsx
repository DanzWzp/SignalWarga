import { redirect } from "next/navigation";

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
        </section>
      </div>
    </main>
  );
}
