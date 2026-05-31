import { CreateReportForm } from "@/components/reports/create-report-form";
import { requireUserProfile } from "@/lib/auth";

export default async function NewReportPage() {
  await requireUserProfile();

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold text-emerald-700">Laporan Baru</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Buat Laporan Lokasi
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Ambil lokasi saat kamu siap, pilih titik manual jika izin lokasi ditolak,
          lalu kirim bukti untuk memudahkan verifikasi.
        </p>
      </div>
      <CreateReportForm />
    </div>
  );
}
