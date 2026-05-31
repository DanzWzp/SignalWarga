import { ReportFilters } from "@/components/reports/report-filters";
import { ReportTable } from "@/components/reports/report-table";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUserProfile } from "@/lib/auth";
import { categories, statuses } from "@/lib/constants";
import { getCachedAdminReports } from "@/lib/data/reports";
import type { ReportCategory, ReportStatus } from "@/types/database";

type AdminReportsPageProps = {
  searchParams: Promise<{
    category?: string;
    status?: string;
    search?: string;
  }>;
};

export default async function AdminReportsPage({
  searchParams,
}: AdminReportsPageProps) {
  await requireUserProfile(["admin"]);
  const params = await searchParams;
  const category = categories.includes(params.category as ReportCategory)
    ? (params.category as ReportCategory)
    : "all";
  const status = statuses.includes(params.status as ReportStatus)
    ? (params.status as ReportStatus)
    : "all";
  const reports = await getCachedAdminReports({
    category,
    status,
    search: params.search,
  });

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-semibold text-emerald-700">Admin</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Kelola Laporan
        </h1>
      </div>
      <ReportFilters />
      {reports.length > 0 ? (
        <ReportTable
          reports={reports}
          detailBasePath="/admin/reports"
          canDelete
        />
      ) : (
        <EmptyState
          title="Tidak ada laporan"
          description="Belum ada laporan yang cocok dengan filter admin."
        />
      )}
    </div>
  );
}
