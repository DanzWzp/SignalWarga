import { z } from "zod";

import { categories, priorities, statuses } from "@/lib/constants";

export const MAX_REPORT_PHOTO_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_REPORT_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const createReportSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter").max(120).trim(),
  description: z
    .string()
    .min(15, "Deskripsi minimal 15 karakter")
    .max(1200)
    .trim(),
  category: z.enum(categories),
  priority: z.enum(priorities),
  latitude: z.coerce
    .number({ error: "Latitude wajib diisi" })
    .min(-90)
    .max(90),
  longitude: z.coerce
    .number({ error: "Longitude wajib diisi" })
    .min(-180)
    .max(180),
  address: z.string().max(180).optional().or(z.literal("")),
});

export const reportFilterSchema = z.object({
  category: z.enum(categories).optional(),
  status: z.enum(statuses).optional(),
  search: z.string().max(120).optional(),
});

export const updateReportStatusSchema = z.object({
  report_id: z.string().uuid(),
  status: z.enum(statuses),
  note: z.string().max(500).optional().or(z.literal("")),
});

export const assignReportSchema = z.object({
  report_id: z.string().uuid(),
  officer_id: z.string().uuid(),
});
