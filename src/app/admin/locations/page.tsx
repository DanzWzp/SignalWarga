import { WargaLocationExplorer } from "@/components/location/warga-location-explorer";
import { requireUserProfile } from "@/lib/auth";
import { getWargaLocations } from "@/lib/data/locations";

export default async function AdminLocationsPage() {
  await requireUserProfile(["admin"]);
  const locations = await getWargaLocations();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold text-emerald-700">Lokasi Warga</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Verifikasi Lokasi Login Warga
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Titik lokasi yang dibagikan warga saat login lewat email. Akurasi
          bergantung perangkat &amp; izin lokasi—gunakan sebagai indikator, bukan
          bukti mutlak posisi warga.
        </p>
      </div>
      <WargaLocationExplorer initialLocations={locations} />
    </div>
  );
}
