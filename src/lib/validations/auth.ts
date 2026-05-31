import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid").trim().toLowerCase(),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter").max(80).trim(),
  email: z.string().email("Email tidak valid").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Za-z]/, "Password harus memiliki huruf")
    .regex(/[0-9]/, "Password harus memiliki angka"),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, "Nama minimal 2 karakter").max(80).trim(),
  phone: z.string().max(24).optional().or(z.literal("")),
});
