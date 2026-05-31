"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Filter, MapPin, Search } from "lucide-react";

import { ReportMap } from "@/components/map/report-map";
import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/reports/report-badges";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select } from "@/components/ui/field";
import {
  categories,
  categoryLabels,
  statuses,
  statusLabels,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { PublicReport, ReportCategory, ReportStatus } from "@/types/database";

function getLocationText(report: PublicReport) {
  return (
    [
      report.address,
      report.rt ? `RT ${report.rt}` : null,
      report.rw ? `RW ${report.rw}` : null,
      report.kelurahan,
      report.kecamatan,
      report.city,
    ]
      .filter(Boolean)
      .join(", ") ||
    `${report.latitude.toFixed(5)}, ${report.longitude.toFixed(5)}`
  );
}

function PublicReportSummary({ report }: { report: PublicReport }) {
  return (
    <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={report.status} />
        <CategoryBadge category={report.category} />
        <PriorityBadge priority={report.priority} />
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
          <CalendarClock className="size-4 text-blue-600" />
          {formatDate(report.created_at)}
        </span>
      </div>
    </article>
  );
}

export function PublicMapExplorer({
  initialReports,
  initialCategory = "all",
  initialStatus = "all",
}: {
  initialReports: PublicReport[];
  initialCategory?: ReportCategory | "all";
  initialStatus?: ReportStatus | "all";
}) {
  const [category, setCategory] =
    useState<ReportCategory | "all">(initialCategory);
  const [status, setStatus] = useState<ReportStatus | "all">(initialStatus);
  const [search, setSearch] = useState("");

  const filteredReports = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return initialReports.filter((report) => {
      const categoryMatch = category === "all" || report.category === category;
      const statusMatch = status === "all" || report.status === status;
      const searchMatch =
        !needle ||
        report.title.toLowerCase().includes(needle) ||
        report.description.toLowerCase().includes(needle) ||
        (report.address || "").toLowerCase().includes(needle) ||
        (report.kelurahan || "").toLowerCase().includes(needle) ||
        (report.kecamatan || "").toLowerCase().includes(needle) ||
        (report.city || "").toLowerCase().includes(needle);

      return categoryMatch && statusMatch && searchMatch;
    });
  }, [category, initialReports, search, status]);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid gap-4">
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_190px_190px]">
          <Field label="Cari lokasi/laporan">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Judul, alamat, kecamatan"
                className="pl-9"
              />
            </div>
          </Field>
          <Field label="Kategori">
            <Select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as ReportCategory | "all")
              }
            >
              <option value="all">Semua kategori</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {categoryLabels[item]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ReportStatus | "all")
              }
            >
              <option value="all">Semua status</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {statusLabels[item]}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <ReportMap reports={filteredReports} heightClassName="h-[640px]" />
      </section>

      <aside className="grid max-h-[780px] gap-3 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-700">
          <Filter className="size-4 text-emerald-600" />
          {filteredReports.length} laporan publik
        </div>
        {filteredReports.length > 0 ? (
          filteredReports
            .slice(0, 12)
            .map((report) => (
              <PublicReportSummary key={report.id} report={report} />
            ))
        ) : (
          <EmptyState
            title="Belum ada laporan"
            description="Coba ubah filter, atau buat laporan baru dari dashboard warga."
          />
        )}
      </aside>
    </div>
  );
}
