import {
  Camera,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  RadioTower,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { ButtonLink } from "@/components/ui/button";
import { categories, categoryLabels } from "@/lib/constants";

const steps = [
  {
    title: "Tandai lokasi",
    description: "Ambil lokasi dengan izin browser atau pilih titik manual di peta.",
    icon: MapPin,
  },
  {
    title: "Upload bukti",
    description: "Tambahkan foto dan deskripsi agar laporan mudah diverifikasi.",
    icon: Camera,
  },
  {
    title: "Pantau progres",
    description: "Status laporan diperbarui realtime oleh admin atau petugas.",
    icon: CheckCircle2,
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-slate-50">
        <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden border-b border-slate-200">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,23,42,.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,.08)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute inset-0 -z-10 bg-emerald-50/60" />
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl content-center gap-10 px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
                <RadioTower className="size-4" />
                SignalWarga
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Laporkan masalah di sekitarmu langsung dari peta.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Tandai lokasi, upload bukti, dan pantau progres laporan secara
                realtime.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/dashboard/reports/new" size="lg">
                  Laporkan Sekarang
                </ButtonLink>
                <ButtonLink href="/dashboard/map" variant="outline" size="lg">
                  Lihat Peta Laporan
                </ButtonLink>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <div className="relative min-h-72 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,.06)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,.06)_1px,transparent_1px)] bg-[size:36px_36px]" />
                <div className="absolute left-[18%] top-[22%] grid size-10 place-items-center rounded-full border-4 border-white bg-amber-500 text-white shadow-lg">
                  <MapPin className="size-5" />
                </div>
                <div className="absolute left-[52%] top-[44%] grid size-10 place-items-center rounded-full border-4 border-white bg-emerald-600 text-white shadow-lg">
                  <MapPin className="size-5" />
                </div>
                <div className="absolute left-[72%] top-[26%] grid size-10 place-items-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg">
                  <MapPin className="size-5" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
                  <p className="text-sm font-bold text-slate-950">Preview peta kota</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Marker warna menunjukkan status laporan yang sedang berjalan.
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                {steps.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <step.icon className="size-5 text-emerald-600" />
                    <h3 className="mt-3 font-bold text-slate-950">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="cara-kerja" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-emerald-700">Cara Kerja</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Dari titik masalah ke tindak lanjut.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <step.icon className="size-6 text-emerald-600" />
                <h3 className="mt-4 text-lg font-bold text-slate-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="kategori" className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Kategori</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Masalah lingkungan yang bisa dilaporkan.
                </h2>
              </div>
              <ButtonLink href="/register" variant="secondary">
                Mulai Daftar
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <div key={category} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <Sparkles className="size-5 text-amber-500" />
                  <p className="mt-3 font-semibold text-slate-900">
                    {categoryLabels[category]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Keamanan Data</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Dibangun dengan izin lokasi yang jelas.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Aplikasi tidak mengambil lokasi tanpa aksi user. Supabase Auth, protected
              route, dan RLS menjaga akses berdasarkan role warga, admin, dan petugas.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <LockKeyhole className="size-5 text-blue-600" />
              <h3 className="mt-3 font-bold text-slate-950">Protected routes</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Dashboard, admin, profile, dan mutasi data memverifikasi sesi user.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <ShieldCheck className="size-5 text-emerald-600" />
              <h3 className="mt-3 font-bold text-slate-950">Row Level Security</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                SQL policy disiapkan agar role memiliki akses sesuai kebutuhan.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>SignalWarga. Tandai masalahnya, bantu perbaiki kotamu.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-emerald-700">
              Privacy Notice
            </a>
            <a href="/terms" className="hover:text-emerald-700">
              Terms of Use
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
