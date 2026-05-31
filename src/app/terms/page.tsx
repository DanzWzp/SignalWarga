import { Navbar } from "@/components/layout/navbar";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-3xl gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Terms of Use</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Ketentuan Penggunaan
          </h1>
        </div>
        <section className="grid gap-4 text-sm leading-7 text-slate-600">
          <p>
            Gunakan SignalWarga untuk laporan yang benar, relevan, dan dilengkapi
            informasi lokasi yang dapat diverifikasi.
          </p>
          <p>
            Pengguna bertanggung jawab atas foto dan teks yang dikirim. Admin berhak
            menolak laporan yang tidak sesuai, duplikat, atau mengandung data sensitif
            yang tidak perlu.
          </p>
          <p>
            Status laporan menunjukkan progres operasional dan dapat berubah sesuai
            hasil verifikasi serta tindak lanjut petugas.
          </p>
        </section>
      </main>
    </>
  );
}
