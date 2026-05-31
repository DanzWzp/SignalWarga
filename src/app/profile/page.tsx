import { Mail, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { ProfileForm } from "@/components/profile/profile-form";
import { Badge } from "@/components/ui/badge";
import { requireUserProfile } from "@/lib/auth";
import { roleLabels } from "@/lib/constants";

export default async function ProfilePage() {
  const { user, profile } = await requireUserProfile();

  return (
    <AppShell profile={profile} variant={profile.role === "admin" ? "admin" : "citizen"}>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Profil</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Akun Saya
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Perbarui data kontak yang membantu admin saat verifikasi laporan.
          </p>
          <div className="mt-6">
            <ProfileForm profile={profile} />
          </div>
        </div>
        <aside className="self-start rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Informasi Akun</h2>
          <div className="mt-5 grid gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-blue-600" />
              <span className="text-slate-600">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-emerald-600" />
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                {roleLabels[profile.role]}
              </Badge>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
