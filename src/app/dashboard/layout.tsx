import { AppShell } from "@/components/layout/app-shell";
import { requireUserProfile } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireUserProfile();

  return <AppShell profile={profile}>{children}</AppShell>;
}
