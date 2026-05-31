import { notFound } from "next/navigation";
import { CalendarClock, MapPin, UserRound } from "lucide-react";

import { ReportMap } from "@/components/map/report-map";
import { AssignOfficerForm } from "@/components/reports/assign-officer-form";
import { DeleteReportButton } from "@/components/reports/delete-report-button";
import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/components/reports/report-badges";
import { StatusUpdateForm } from "@/components/reports/status-update-form";
import { requireUserProfile } from "@/lib/auth";
import { getOfficers, getReportById } from "@/lib/data/reports";
import { formatDate } from "@/lib/utils";

type AdminReportDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminReportDetailPage({
  params,
}: AdminReportDetailPageProps) {
  await requireUserProfile(["admin"]);
  const { id } = await params;
  const [report, officers] = await Promise.all([getReportById(id), getOfficers()]);

  if (!report) notFound();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <article className="grid gap-5">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={report.status} />
            <CategoryBadge category={report.category} />
            <PriorityBadge priority={report.priority} />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
            {report.title}
          </h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
            {report.description}
          </p>
          <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <UserRound className="size-4 text-emerald-600" />
              {report.profiles?.full_name || "Warga"}
            </span>
            <span className="flex items-center gap-2">
              <CalendarClock className="size-4 text-blue-600" />
              {formatDate(report.created_at)}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4 text-amber-600" />
              {report.address || "Alamat belum diisi"}
            </span>
          </div>
        </div>

        {report.photo_url ? (
          <div
            aria-label="Foto bukti laporan"
            className="h-80 rounded-lg border border-slate-200 bg-cover bg-center shadow-sm"
            style={{ backgroundImage: `url(${report.photo_url})` }}
          />
        ) : null}

        <ReportMap
          reports={[report]}
          detailBasePath="/admin/reports"
          heightClassName="h-[420px]"
        />

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Timeline Status</h2>
          <div className="mt-4 grid gap-4">
            {(report.report_updates || []).map((item) => (
              <div key={item.id} className="border-l-2 border-emerald-200 pl-4">
                <p className="text-sm font-semibold text-slate-950">
                  {item.status ? <StatusBadge status={item.status} /> : "Update"}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.note || "Tidak ada catatan."}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(item.created_at)} oleh{" "}
                  {item.profiles?.full_name || "Sistem"}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>

      <aside className="grid gap-5 self-start">
        <div className="rounded-lg border border-red-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Aksi Admin</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Hapus laporan jika duplikat, salah kirim, atau tidak relevan.
          </p>
          <div className="mt-4">
            <DeleteReportButton
              reportId={report.id}
              reportTitle={report.title}
              redirectTo="/admin/reports"
              size="md"
            />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Alamat Administratif</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">RT/RW</p>
              <p className="mt-1 font-semibold text-slate-900">
                {report.rt || "-"} / {report.rw || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Kelurahan / Desa</p>
              <p className="mt-1 font-semibold text-slate-900">
                {report.kelurahan || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Kecamatan</p>
              <p className="mt-1 font-semibold text-slate-900">
                {report.kecamatan || "-"}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Kota / Provinsi</p>
              <p className="mt-1 font-semibold text-slate-900">
                {[report.city, report.province].filter(Boolean).join(", ") || "-"}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Update Status</h2>
          <StatusUpdateForm reportId={report.id} currentStatus={report.status} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Penugasan</h2>
          <AssignOfficerForm
            reportId={report.id}
            officers={officers}
            assignedTo={report.assigned_to}
          />
        </div>
      </aside>
    </div>
  );
}
