import type {
  ReportCategory,
  ReportPriority,
  ReportStatus,
  UserRole,
} from "@/types/database";

export const APP_NAME = "SignalWarga";
export const APP_TAGLINE = "Tandai masalahnya, bantu perbaiki kotamu.";
export const DEFAULT_MAP_CENTER = {
  latitude: -5.1477,
  longitude: 119.4327,
};

export const roles = ["citizen", "admin", "officer"] as const satisfies readonly UserRole[];

export const categories = [
  "jalan_rusak",
  "banjir",
  "sampah",
  "lampu_mati",
  "pohon_tumbang",
  "fasilitas_rusak",
  "lainnya",
] as const satisfies readonly ReportCategory[];

export const statuses = [
  "pending",
  "verified",
  "in_progress",
  "resolved",
  "rejected",
] as const satisfies readonly ReportStatus[];

export const priorities = [
  "low",
  "medium",
  "high",
  "urgent",
] as const satisfies readonly ReportPriority[];

export const roleLabels: Record<UserRole, string> = {
  citizen: "Warga",
  admin: "Admin",
  officer: "Petugas",
};

export const categoryLabels: Record<ReportCategory, string> = {
  jalan_rusak: "Jalan Rusak",
  banjir: "Banjir",
  sampah: "Sampah",
  lampu_mati: "Lampu Jalan Mati",
  pohon_tumbang: "Pohon Tumbang",
  fasilitas_rusak: "Fasilitas Rusak",
  lainnya: "Lainnya",
};

export const statusLabels: Record<ReportStatus, string> = {
  pending: "Menunggu",
  verified: "Terverifikasi",
  in_progress: "Diproses",
  resolved: "Selesai",
  rejected: "Ditolak",
};

export const priorityLabels: Record<ReportPriority, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
  urgent: "Darurat",
};

export const statusMarkerColors: Record<ReportStatus, string> = {
  pending: "#f59e0b",
  verified: "#2563eb",
  in_progress: "#10b981",
  resolved: "#16a34a",
  rejected: "#dc2626",
};

export const statusBadgeClasses: Record<ReportStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  verified: "border-blue-200 bg-blue-50 text-blue-700",
  in_progress: "border-emerald-200 bg-emerald-50 text-emerald-700",
  resolved: "border-green-200 bg-green-50 text-green-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

export const priorityBadgeClasses: Record<ReportPriority, string> = {
  low: "border-slate-200 bg-slate-50 text-slate-700",
  medium: "border-blue-200 bg-blue-50 text-blue-700",
  high: "border-amber-200 bg-amber-50 text-amber-700",
  urgent: "border-red-200 bg-red-50 text-red-700",
};

export const categoryBadgeClasses: Record<ReportCategory, string> = {
  jalan_rusak: "border-zinc-200 bg-zinc-50 text-zinc-700",
  banjir: "border-blue-200 bg-blue-50 text-blue-700",
  sampah: "border-emerald-200 bg-emerald-50 text-emerald-700",
  lampu_mati: "border-yellow-200 bg-yellow-50 text-yellow-700",
  pohon_tumbang: "border-lime-200 bg-lime-50 text-lime-700",
  fasilitas_rusak: "border-cyan-200 bg-cyan-50 text-cyan-700",
  lainnya: "border-slate-200 bg-slate-50 text-slate-700",
};
