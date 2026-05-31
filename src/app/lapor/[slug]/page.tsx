import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  MapPin,
  MapPinned,
} from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import {
  CategoryBadge,
  StatusBadge,
} from "@/components/reports/report-badges";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { categoryLabels } from "@/lib/constants";
import { getCachedPublicReports } from "@/lib/data/public-reports";
import {
  absoluteUrl,
  getPublicCategoryPage,
  publicCategoryPages,
} from "@/lib/seo";
import { compactDate } from "@/lib/utils";
import type { PublicReport } from "@/types/database";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return publicCategoryPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPublicCategoryPage(slug);

  if (!page) {
    return {
      title: "Kategori Tidak Ditemukan",
    };
  }

  return {
    title: page.metaTitle,
    description: page.description,
    keywords: [...page.keywords],
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.description,
      url: page.path,
      images: ["/signalwarga-logo.png"],
    },
  };
}

function getLocationText(report: PublicReport) {
  return (
    [
      report.address,
      report.rt ? `RT ${report.rt}` : null,
      report.rw ? `RW ${report.rw}` : null,
      report.kelurahan,
      report.kecamatan,
    ]
      .filter(Boolean)
      .join(", ") ||
    `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`
  );
}

function LatestReportItem({ report }: { report: PublicReport }) {
  return (
    <article className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={report.status} />
        <CategoryBadge category={report.category} />
      </div>
      <div>
        <h3 className="line-clamp-2 text-sm font-bold text-slate-950">
          {report.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {report.description}
        </p>
      </div>
      <div className="grid gap-2 text-xs text-slate-500">
        <span className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          {getLocationText(report)}
        </span>
        <span className="flex items-center gap-2">
          <Clock3 className="size-4 text-blue-600" />
          {compactDate(report.created_at)}
        </span>
      </div>
    </article>
  );
}

export default async function PublicCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const page = getPublicCategoryPage(slug);

  if (!page) notFound();

  const reports = await getCachedPublicReports({
    category: page.category,
    limit: 6,
  });
  const areaCount = new Set(
    reports.map((report) => report.kecamatan).filter(Boolean),
  ).size;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.metaTitle,
    url: absoluteUrl(page.path),
    description: page.description,
    inLanguage: "id-ID",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "SignalWarga",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.title,
          item: absoluteUrl(page.path),
        },
      ],
    },
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
            <div>
              <CategoryBadge category={page.category} />
              <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                {page.title} lewat titik peta yang akurat.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                {page.description} SignalWarga membantu warga mengirim laporan
                lengkap dengan foto, alamat, RT/RW, kelurahan, dan kecamatan.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/register">Mulai Lapor</ButtonLink>
                <ButtonLink
                  href={`/peta-laporan?category=${page.category}`}
                  variant="outline"
                >
                  Lihat Peta Kategori
                </ButtonLink>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <MapPinned className="size-5 text-emerald-600" />
                <p className="mt-3 text-2xl font-black text-slate-950">
                  {reports.length}
                </p>
                <p className="text-sm text-slate-500">
                  laporan {categoryLabels[page.category].toLowerCase()}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <CheckCircle2 className="size-5 text-blue-600" />
                <p className="mt-3 text-2xl font-black text-slate-950">
                  {areaCount || 0}
                </p>
                <p className="text-sm text-slate-500">kecamatan terpantau</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Alur Laporan</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              Data lokasi membuat tindak lanjut lebih cepat.
            </h2>
            <div className="mt-6 grid gap-3">
              {[
                {
                  title: "Pilih titik masalah",
                  description: "Gunakan peta agar RT/RW dan kecamatan terbaca.",
                  icon: MapPin,
                },
                {
                  title: "Tambahkan bukti",
                  description: "Foto membantu admin dan petugas memverifikasi laporan.",
                  icon: Camera,
                },
                {
                  title: "Pantau status",
                  description: "Status laporan bisa berubah dari menunggu sampai selesai.",
                  icon: CheckCircle2,
                },
              ].map((step) => (
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

          <div>
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Laporan Publik
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  Laporan terbaru di kategori ini.
                </h2>
              </div>
              <Link
                href={`/peta-laporan?category=${page.category}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800"
              >
                Buka peta
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <LatestReportItem key={report.id} report={report} />
                ))
              ) : (
                <div className="md:col-span-2">
                  <EmptyState
                    title="Belum ada laporan publik"
                    description="Jadilah laporan pertama untuk kategori ini lewat dashboard warga."
                    action={<ButtonLink href="/register">Daftar Warga</ButtonLink>}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
