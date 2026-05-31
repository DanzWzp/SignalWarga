import { redirect } from "next/navigation";

import { RoleLoginForm } from "@/components/auth/role-login-form";
import { Logo } from "@/components/layout/logo";
import { getCurrentUserProfile, getRoleHome } from "@/lib/auth";

export default async function OfficerLoginPage() {
  const current = await getCurrentUserProfile();
  if (current) redirect(getRoleHome(current.profile.role));

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Logo />
        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-blue-700">Akses Petugas</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Masuk Officer
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Gunakan akun petugas yang sudah ditetapkan role officer oleh admin.
          </p>
          <div className="mt-6">
            <RoleLoginForm role="officer" />
          </div>
        </section>
      </div>
    </main>
  );
}
