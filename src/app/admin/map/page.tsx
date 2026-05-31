import { MapExplorer } from "@/components/map/map-explorer";
import { requireUserProfile } from "@/lib/auth";
import { getCachedAdminReports } from "@/lib/data/reports";

export default async function AdminMapPage() {
  await requireUserProfile(["admin"]);
  const reports = await getCachedAdminReports();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold text-emerald-700">Peta Admin</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Monitoring Lokasi Laporan
        </h1>
      </div>
      <MapExplorer initialReports={reports} detailBasePath="/admin/reports" />
    </div>
  );
}
