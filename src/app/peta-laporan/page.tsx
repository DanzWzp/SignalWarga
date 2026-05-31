import type { Metadata } from "next";
import { BarChart3, MapPinned, ShieldCheck } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { PublicMapExplorer } from "@/components/map/public-map-explorer";
import { ButtonLink } from "@/components/ui/button";
import { categories, statuses } from "@/lib/constants";
import { getCachedPublicReports } from "@/lib/data/public-reports";
import { absoluteUrl } from "@/lib/seo";
import type { ReportCategory, ReportStatus } from "@/types/database";

export const metadata: Metadata = {
  title: "Peta Laporan Publik",
  description:
    "Lihat peta laporan warga SignalWarga berdasarkan kategori, status, dan lokasi tanpa membuka identitas pelapor.",
  alternates: {
    canonical: "/peta-laporan",
  },
  openGraph: {
    title: "Peta Laporan Publik SignalWarga",
    description:
      "Pantau sebaran laporan warga berdasarkan titik peta, kategori, dan status tindak lanjut.",
    url: "/peta-laporan",
    images: ["/signalwarga-logo.png"],
  },
};

type PublicMapPageProps = {
  searchParams: Promise<{
    category?: string;
    status?: string;
  }>;
};

function parseCategory(value?: string): ReportCategory | "all" {
  return categories.includes(value as ReportCategory)
    ? (value as ReportCategory)
    : "all";
}

function parseStatus(value?: string): ReportStatus | "all" {
  return statuses.includes(value as ReportStatus) ? (value as ReportStatus) : "all";
}

export default async function PublicReportMapPage({
  searchParams,
}: PublicMapPageProps) {
  const params = await searchParams;
  const initialCategory = parseCategory(params.category);
  const initialStatus = parseStatus(params.status);
  const reports = await getCachedPublicReports({ limit: 250 });
  const resolvedCount = reports.filter((report) => report.status === "resolved").length;
  const activeCount = reports.filter(
    (report) => report.status !== "resolved" && report.status !== "rejected",
  ).length;
  const areaCount = new Set(
    reports.map((report) => report.kecamatan).filter(Boolean),
  ).size;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Peta Laporan Publik SignalWarga",
    url: absoluteUrl("/peta-laporan"),
    description:
      "Peta publik anonim untuk memantau laporan warga berdasarkan lokasi dan status.",
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                <ShieldCheck className="size-4" />
                Data publik anonim
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Peta laporan warga yang bisa dipantau bersama.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                Lihat sebaran laporan berdasarkan titik peta, kategori, dan status
                tindak lanjut. Identitas pelapor dan data akun tidak ditampilkan.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/register">Buat Laporan</ButtonLink>
                <ButtonLink href="/login" variant="outline">
                  Masuk Dashboard
                </ButtonLink>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <MapPinned className="size-5 text-emerald-600" />
                <p className="mt-3 text-2xl font-black text-slate-950">
                  {reports.length}
                </p>
                <p className="text-sm text-slate-500">laporan publik</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <BarChart3 className="size-5 text-blue-600" />
                <p className="mt-3 text-2xl font-black text-slate-950">
                  {activeCount}
                </p>
                <p className="text-sm text-slate-500">sedang berjalan</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <ShieldCheck className="size-5 text-emerald-600" />
                <p className="mt-3 text-2xl font-black text-slate-950">
                  {resolvedCount}
                </p>
                <p className="text-sm text-slate-500">
                  selesai di {areaCount || 0} kecamatan
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PublicMapExplorer
            initialReports={reports}
            initialCategory={initialCategory}
            initialStatus={initialStatus}
          />
        </section>
      </main>
    </>
  );
}
