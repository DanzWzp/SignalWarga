import { BarChart3, CheckCircle2, ClipboardList, Clock3, XCircle } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { ReportTable } from "@/components/reports/report-table";
import { ButtonLink } from "@/components/ui/button";
import { categories, categoryLabels } from "@/lib/constants";
import { requireUserProfile } from "@/lib/auth";
import { getDashboardStats } from "@/lib/data/reports";

export default async function AdminPage() {
  const { profile } = await requireUserProfile(["admin"]);
  const stats = await getDashboardStats(profile);
  const maxCategory = Math.max(1, ...Object.values(stats.byCategory));

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Dashboard Admin</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Monitor Laporan Kota
          </h1>
        </div>
        <ButtonLink href="/admin/reports" variant="secondary">
          Kelola Semua Laporan
        </ButtonLink>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total" value={stats.total} icon={ClipboardList} />
        <StatCard title="Pending" value={stats.byStatus.pending} icon={Clock3} tone="amber" />
        <StatCard title="Diproses" value={stats.byStatus.in_progress} icon={BarChart3} tone="blue" />
        <StatCard title="Selesai" value={stats.byStatus.resolved} icon={CheckCircle2} tone="emerald" />
        <StatCard title="Ditolak" value={stats.byStatus.rejected} icon={XCircle} tone="red" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Grafik Kategori</h2>
          <div className="mt-5 grid gap-4">
            {categories.map((category) => {
              const value = stats.byCategory[category] || 0;
              return (
                <div key={category}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {categoryLabels[category]}
                    </span>
                    <span className="text-slate-500">{value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${(value / maxCategory) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-950">Laporan Terbaru</h2>
            <ButtonLink href="/admin/reports" variant="outline" size="sm">
              Lihat Semua
            </ButtonLink>
          </div>
          <ReportTable reports={stats.latest} detailBasePath="/admin/reports" />
        </div>
      </section>
    </div>
  );
}
