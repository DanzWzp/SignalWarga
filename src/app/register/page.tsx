import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { getCurrentUserProfile, getRoleHome } from "@/lib/auth";

export default async function RegisterPage() {
  const current = await getCurrentUserProfile();
  if (current) redirect(getRoleHome(current.profile.role));

  return (
    <AuthShell
      eyebrow="Akun Warga"
      title="Daftar SignalWarga"
      description="Buat akun untuk mengirim laporan berbasis lokasi dan memantau statusnya."
      tone="blue"
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
