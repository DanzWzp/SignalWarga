import { redirect } from "next/navigation";

import { RoleLoginForm } from "@/components/auth/role-login-form";
import { Logo } from "@/components/layout/logo";
import { getCurrentUserProfile, getRoleHome } from "@/lib/auth";

export default async function AdminLoginPage() {
  const current = await getCurrentUserProfile();
  if (current) redirect(getRoleHome(current.profile.role));

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Logo />
        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-emerald-700">Akses Pengelola</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Masuk Admin
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Gunakan akun Supabase Auth yang profilnya sudah diberi role admin.
          </p>
          <div className="mt-6">
            <RoleLoginForm role="admin" />
          </div>
        </section>
      </div>
    </main>
  );
}
