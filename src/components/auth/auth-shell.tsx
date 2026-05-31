import Link from "next/link";
import { ArrowLeft, CheckCircle2, MapPinned, RadioTower } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const authHighlights = [
  "Laporan berbasis titik peta",
  "Role warga, admin, dan petugas",
  "Update status realtime",
];

export function AuthShell({
  eyebrow,
  title,
  description,
  tone = "emerald",
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  tone?: "emerald" | "blue" | "amber";
  children: React.ReactNode;
}) {
  const toneClasses = {
    emerald: "text-emerald-700 bg-emerald-50 border-emerald-200",
    blue: "text-blue-700 bg-blue-50 border-blue-200",
    amber: "text-amber-700 bg-amber-50 border-amber-200",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8">
        <section className="relative hidden overflow-hidden rounded-lg border border-slate-200 bg-white p-8 shadow-sm lg:grid">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,.07)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
          <div className="relative z-10 flex flex-col justify-between">
            <Logo />
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                <RadioTower className="size-4" />
                SignalWarga
              </div>
              <h2 className="mt-6 text-5xl font-black tracking-tight text-slate-950">
                Tandai masalahnya, bantu perbaiki kotamu.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-slate-600">
                Masuk untuk mengelola laporan lingkungan, titik lokasi, bukti foto,
                dan progres penanganan dalam satu ruang kerja.
              </p>
              <div className="mt-8 grid gap-3">
                {authHighlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <CheckCircle2 className="size-5 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-52 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,.07)_1px,transparent_1px),linear-gradient(0deg,rgba(15,23,42,.07)_1px,transparent_1px)] bg-[size:34px_34px]" />
              <div className="absolute left-[18%] top-[28%] grid size-10 place-items-center rounded-full border-4 border-white bg-amber-500 text-white shadow-lg">
                <MapPinned className="size-5" />
              </div>
              <div className="absolute left-[54%] top-[48%] grid size-10 place-items-center rounded-full border-4 border-white bg-emerald-600 text-white shadow-lg">
                <MapPinned className="size-5" />
              </div>
              <div className="absolute left-[76%] top-[22%] grid size-10 place-items-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg">
                <MapPinned className="size-5" />
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center">
          <div className="mb-8 flex items-center justify-between">
            <Logo />
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white hover:text-emerald-700"
            >
              <ArrowLeft className="size-4" />
              Beranda
            </Link>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <span
              className={cn(
                "inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase",
                toneClasses[tone],
              )}
            >
              {eyebrow}
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
            <div className="mt-7">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
