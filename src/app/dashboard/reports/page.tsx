import { PlusCircle } from "lucide-react";

import { ReportFilters } from "@/components/reports/report-filters";
import { ReportTable } from "@/components/reports/report-table";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUserProfile } from "@/lib/auth";
import { categories, statuses } from "@/lib/constants";
import { getReports } from "@/lib/data/reports";
import type { ReportCategory, ReportStatus } from "@/types/database";

type ReportsPageProps = {
  searchParams: Promise<{
    category?: string;
    status?: string;
    search?: string;
  }>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const { profile } = await requireUserProfile();
  const params = await searchParams;
  const category = categories.includes(params.category as ReportCategory)
    ? (params.category as ReportCategory)
    : "all";
  const status = statuses.includes(params.status as ReportStatus)
    ? (params.status as ReportStatus)
    : "all";
  const reports = await getReports({
    category,
    status,
    search: params.search,
    createdBy: profile.role === "citizen" ? profile.id : undefined,
    assignedTo: profile.role === "officer" ? profile.id : undefined,
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Laporan</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Daftar Laporan
          </h1>
        </div>
        <ButtonLink href="/dashboard/reports/new">
          <PlusCircle className="size-4" />
          Buat Laporan
        </ButtonLink>
      </div>

      <ReportFilters />

      {reports.length > 0 ? (
        <ReportTable reports={reports} detailBasePath="/dashboard/reports" />
      ) : (
        <EmptyState
          title="Laporan tidak ditemukan"
          description="Belum ada laporan yang cocok dengan filter saat ini."
          action={
            <ButtonLink href="/dashboard/reports/new">
              <PlusCircle className="size-4" />
              Buat Laporan
            </ButtonLink>
          }
        />
      )}
    </div>
  );
}
