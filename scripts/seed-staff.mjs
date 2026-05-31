// Seed / provisioning akun staff (admin & officer) untuk SignalWarga.
//
// Membuat user di Supabase Auth (email + password, langsung terkonfirmasi)
// lalu menyetel role di tabel `profiles`. Idempoten: jika email sudah ada,
// password & role-nya diperbarui (tidak membuat duplikat).
//
// Cara pakai (PowerShell):
//   $env:ADMIN_EMAIL="admin@contoh.com";    $env:ADMIN_PASSWORD="Rahasia#123"
//   $env:OFFICER_EMAIL="petugas@contoh.com"; $env:OFFICER_PASSWORD="Rahasia#456"
//   node scripts/seed-staff.mjs
//
// Cara pakai (bash):
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... OFFICER_EMAIL=... OFFICER_PASSWORD=... \
//     node scripts/seed-staff.mjs
//
// SUPABASE_URL & SERVICE_ROLE_KEY otomatis dibaca dari file .env.
// Anda bisa mengisi hanya admin saja, atau officer saja.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- muat .env (tanpa dependency) ---
function loadEnv() {
  try {
    const raw = readFileSync(resolve(__dirname, "..", ".env"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (!match) continue;
      const key = match[1];
      let value = match[2];
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // .env tidak ada — andalkan environment variable yang sudah ada.
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌ NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY tidak ditemukan (.env).",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  const target = email.toLowerCase();
  // Telusuri daftar user (paginasi) untuk menemukan email.
  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === target);
    if (found) return found;
    if (data.users.length < 200) break;
  }
  return null;
}

async function upsertStaff({ email, password, role, fullName }) {
  if (!email || !password) {
    console.log(`⏭️  Lewati ${role}: email/password tidak diisi.`);
    return;
  }

  let userId;

  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (createError) {
    const alreadyExists =
      /registered|already|exist/i.test(createError.message || "") ||
      createError.status === 422;
    if (!alreadyExists) throw createError;

    const existing = await findUserByEmail(email);
    if (!existing) throw createError;

    userId = existing.id;
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { password, email_confirm: true, user_metadata: { full_name: fullName } },
    );
    if (updateError) throw updateError;
    console.log(`♻️  ${role}: user sudah ada — password & data diperbarui.`);
  } else {
    userId = created.user.id;
    console.log(`✅ ${role}: user auth dibuat.`);
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    { id: userId, full_name: fullName, role },
    { onConflict: "id" },
  );
  if (profileError) throw profileError;

  console.log(`   → profiles.role = "${role}" untuk ${email}`);
}

async function main() {
  await upsertStaff({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: "admin",
    fullName: process.env.ADMIN_NAME || "Administrator",
  });

  await upsertStaff({
    email: process.env.OFFICER_EMAIL,
    password: process.env.OFFICER_PASSWORD,
    role: "officer",
    fullName: process.env.OFFICER_NAME || "Petugas Lapangan",
  });

  console.log("\nSelesai. Login admin: /login/admin — login officer: /login/officer");
}

main().catch((error) => {
  console.error("❌ Gagal:", error.message || error);
  process.exit(1);
});
