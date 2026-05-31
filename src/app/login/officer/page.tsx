import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { RoleLoginForm } from "@/components/auth/role-login-form";
import { getCurrentUserProfile, getRoleHome } from "@/lib/auth";

export default async function OfficerLoginPage() {
  const current = await getCurrentUserProfile();
  if (current) redirect(getRoleHome(current.profile.role));

  return (
    <AuthShell
      eyebrow="Akses Petugas"
      title="Masuk Officer"
      description="Masuk untuk melihat laporan yang ditugaskan dan memperbarui progres lapangan."
      tone="blue"
    >
      <RoleLoginForm role="officer" />
    </AuthShell>
  );
}
