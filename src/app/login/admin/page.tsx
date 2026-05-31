import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { RoleLoginForm } from "@/components/auth/role-login-form";
import { getCurrentUserProfile, getRoleHome } from "@/lib/auth";

export default async function AdminLoginPage() {
  const current = await getCurrentUserProfile();
  if (current) redirect(getRoleHome(current.profile.role));

  return (
    <AuthShell
      eyebrow="Akses Pengelola"
      title="Masuk Admin"
      description="Masuk untuk memverifikasi laporan, mengubah status, dan menugaskan petugas."
    >
      <RoleLoginForm role="admin" />
    </AuthShell>
  );
}
