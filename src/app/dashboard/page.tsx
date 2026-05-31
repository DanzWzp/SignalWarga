import { ClipboardList, Clock3, CheckCircle2, PlusCircle } from "lucide-react";

import { ReportCard } from "@/components/reports/report-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getDashboardStats } from "@/lib/data/reports";
import { requireUserProfile } from "@/lib/auth";

export default async function DashboardPage() {
  const { profile } = await requireUserProfile();
  const stats = await getDashboardStats(profile);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Dashboard Warga</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Halo, {profile.full_name || "Warga"}.
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Pantau laporanmu dan bantu kota bergerak lebih cepat.
          </p>
        </div>
        <ButtonLink href="/dashboard/reports/new" size="lg">
          <PlusCircle className="size-4" />
          Buat Laporan
        </ButtonLink>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Laporan" value={stats.total} icon={ClipboardList} />
        <StatCard
          title="Menunggu"
          value={stats.byStatus.pending}
          icon={Clock3}
          tone="amber"
        />
        <StatCard
          title="Diproses"
          value={stats.byStatus.in_progress + stats.byStatus.verified}
          icon={ClipboardList}
          tone="blue"
        />
        <StatCard
          title="Selesai"
          value={stats.byStatus.resolved}
          icon={CheckCircle2}
          tone="emerald"
        />
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-950">Laporan Terbaru</h2>
          <ButtonLink href="/dashboard/reports" variant="outline" size="sm">
            Lihat Semua
          </ButtonLink>
        </div>
        {stats.latest.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.latest.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                href={`/dashboard/reports/${report.id}`}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada laporan"
            description="Mulai dari masalah di sekitar rumahmu. Pilih titik di peta dan kirim bukti foto."
            action={
              <ButtonLink href="/dashboard/reports/new">
                <PlusCircle className="size-4" />
                Buat Laporan
              </ButtonLink>
            }
          />
        )}
      </section>
    </div>
  );
}
