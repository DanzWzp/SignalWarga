import { AppShell } from "@/components/layout/app-shell";
import { requireUserProfile } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireUserProfile(["admin"]);

  return (
    <AppShell profile={profile} variant="admin">
      {children}
    </AppShell>
  );
}
