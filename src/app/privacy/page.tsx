import { Navbar } from "@/components/layout/navbar";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-3xl gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Privacy Notice</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Pemberitahuan Privasi
          </h1>
        </div>
        <section className="grid gap-4 text-sm leading-7 text-slate-600">
          <p>
            SignalWarga hanya meminta lokasi saat kamu menekan tombol lokasi atau
            memilih titik pada peta ketika membuat laporan.
          </p>
          <p>
            Data laporan, foto bukti, alamat, dan koordinat dipakai untuk verifikasi
            dan tindak lanjut masalah lingkungan. Aplikasi tidak melakukan pelacakan
            lokasi di latar belakang.
          </p>
          <p>
            Admin dapat melihat laporan untuk kebutuhan operasional. Kunci rahasia
            Supabase service role tidak digunakan di client dan harus disimpan sebagai
            environment variable server.
          </p>
        </section>
      </main>
    </>
  );
}
