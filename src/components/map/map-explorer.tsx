"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { toast } from "sonner";

import { ReportMap } from "@/components/map/report-map";
import { ReportCard } from "@/components/reports/report-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, Input, Select } from "@/components/ui/field";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  categories,
  categoryLabels,
  statuses,
  statusLabels,
} from "@/lib/constants";
import type { ReportCategory, ReportStatus, ReportWithProfile } from "@/types/database";

export function MapExplorer({
  initialReports,
  detailBasePath,
}: {
  initialReports: ReportWithProfile[];
  detailBasePath: "/dashboard/reports" | "/admin/reports";
}) {
  const [reports, setReports] = useState(initialReports);
  const [category, setCategory] = useState<ReportCategory | "all">("all");
  const [status, setStatus] = useState<ReportStatus | "all">("all");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function refreshReports() {
      const { data, error } = await supabase
        .from("reports")
        .select(
          "*, profiles:profiles!reports_created_by_fkey(id, full_name, avatar_url, role)",
        )
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Realtime aktif, tapi refresh laporan gagal.");
        return;
      }

      setReports((data || []) as unknown as ReportWithProfile[]);
    }

    const channel = supabase
      .channel("reports-map")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        () => {
          void refreshReports();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const filteredReports = useMemo(() => {
    const needle = deferredSearch.trim().toLowerCase();

    return reports.filter((report) => {
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
  }, [category, deferredSearch, reports, status]);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="grid gap-4">
        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_190px_190px]">
          <Field label="Search lokasi/laporan">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari judul, alamat, deskripsi"
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
        <ReportMap
          reports={filteredReports}
          detailBasePath={detailBasePath}
          heightClassName="h-[620px]"
        />
      </section>

      <aside className="grid max-h-[760px] gap-3 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2 px-1 text-sm font-semibold text-slate-700">
          <Filter className="size-4 text-emerald-600" />
          {filteredReports.length} laporan tampil
        </div>
        {filteredReports.length > 0 ? (
          filteredReports
            .slice(0, 12)
            .map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                href={`${detailBasePath}/${report.id}`}
              />
            ))
        ) : (
          <EmptyState
            title="Tidak ada laporan"
            description="Coba ubah filter atau kata kunci pencarian."
          />
        )}
      </aside>
    </div>
  );
}
