import { AppShell } from "@/components/layout/app-shell";
import { LocationCapture } from "@/components/location/location-capture";
import { requireUserProfile } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireUserProfile();

  return (
    <AppShell profile={profile}>
      {profile.role === "citizen" ? <LocationCapture /> : null}
      {children}
    </AppShell>
  );
}
