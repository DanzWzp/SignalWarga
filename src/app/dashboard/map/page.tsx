import { MapExplorer } from "@/components/map/map-explorer";
import { requireUserProfile } from "@/lib/auth";
import { getReports } from "@/lib/data/reports";

export default async function DashboardMapPage() {
  await requireUserProfile();
  const reports = await getReports();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold text-emerald-700">Peta Laporan</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Laporan Warga di Peta
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Marker diperbarui realtime saat laporan baru masuk atau status berubah.
        </p>
      </div>
      <MapExplorer initialReports={reports} detailBasePath="/dashboard/reports" />
    </div>
  );
}
