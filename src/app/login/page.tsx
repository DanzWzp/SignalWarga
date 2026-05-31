import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, UserCheck } from "lucide-react";

import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getCurrentUserProfile, getRoleHome } from "@/lib/auth";

export default async function LoginPage() {
  const current = await getCurrentUserProfile();
  if (current) redirect(getRoleHome(current.profile.role));

  return (
    <AuthShell
      eyebrow="Akses Warga"
      title="Masuk ke SignalWarga"
      description="Kelola laporanmu, pantau progres, dan lihat titik masalah di sekitar kota."
    >
      <AuthForm mode="login" />
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
    </AuthShell>
  );
}
