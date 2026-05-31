import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { SITE_URL } from "@/lib/supabase/env";
import type { ReportCategory } from "@/types/database";

export type PublicCategoryPage = {
  category: ReportCategory;
  slug: string;
  path: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: readonly string[];
};

export const publicCategoryPages = [
  {
    category: "jalan_rusak",
    slug: "jalan-rusak",
    path: "/lapor/jalan-rusak",
    title: "Lapor Jalan Rusak",
    metaTitle: "Lapor Jalan Rusak di Sekitar Anda",
    description:
      "Laporkan jalan berlubang, retak, atau rusak dengan titik lokasi peta agar perbaikan dapat diprioritaskan.",
    keywords: ["lapor jalan rusak", "jalan berlubang", "laporan warga"],
  },
  {
    category: "banjir",
    slug: "banjir",
    path: "/lapor/banjir",
    title: "Lapor Banjir",
    metaTitle: "Lapor Banjir dan Genangan Air",
    description:
      "Tandai lokasi banjir, genangan, atau drainase tersumbat agar petugas bisa memantau area terdampak.",
    keywords: ["lapor banjir", "genangan air", "drainase tersumbat"],
  },
  {
    category: "sampah",
    slug: "sampah",
    path: "/lapor/sampah",
    title: "Lapor Sampah",
    metaTitle: "Lapor Sampah Menumpuk di Lingkungan",
    description:
      "Kirim laporan sampah menumpuk, TPS penuh, atau pembuangan liar lengkap dengan foto dan lokasi.",
    keywords: ["lapor sampah", "sampah menumpuk", "pembuangan liar"],
  },
  {
    category: "lampu_mati",
    slug: "lampu-jalan-mati",
    path: "/lapor/lampu-jalan-mati",
    title: "Lapor Lampu Jalan Mati",
    metaTitle: "Lapor Lampu Jalan Mati",
    description:
      "Laporkan penerangan jalan yang padam atau rusak untuk membantu keamanan lingkungan pada malam hari.",
    keywords: ["lapor lampu jalan mati", "pju mati", "penerangan jalan"],
  },
  {
    category: "pohon_tumbang",
    slug: "pohon-tumbang",
    path: "/lapor/pohon-tumbang",
    title: "Lapor Pohon Tumbang",
    metaTitle: "Lapor Pohon Tumbang atau Berisiko",
    description:
      "Beri tahu lokasi pohon tumbang, dahan patah, atau pohon berisiko yang mengganggu jalan dan fasilitas umum.",
    keywords: ["lapor pohon tumbang", "dahan patah", "pohon berisiko"],
  },
  {
    category: "fasilitas_rusak",
    slug: "fasilitas-rusak",
    path: "/lapor/fasilitas-rusak",
    title: "Lapor Fasilitas Rusak",
    metaTitle: "Lapor Fasilitas Umum Rusak",
    description:
      "Laporkan trotoar, taman, halte, drainase, atau fasilitas publik lain yang perlu ditindaklanjuti.",
    keywords: ["lapor fasilitas umum", "fasilitas rusak", "laporan publik"],
  },
  {
    category: "lainnya",
    slug: "lainnya",
    path: "/lapor/lainnya",
    title: "Lapor Masalah Lainnya",
    metaTitle: "Lapor Masalah Lingkungan Lainnya",
    description:
      "Gunakan kategori lainnya untuk masalah lingkungan yang belum masuk kategori utama SignalWarga.",
    keywords: ["lapor masalah lingkungan", "laporan warga", "aduan warga"],
  },
] as const satisfies readonly PublicCategoryPage[];

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function getPublicCategoryPage(slug: string) {
  return publicCategoryPages.find((page) => page.slug === slug);
}

export const defaultSeo = {
  title: APP_NAME,
  description: APP_TAGLINE,
  keywords: [
    "SignalWarga",
    "lapor warga",
    "aplikasi laporan warga",
    "peta laporan warga",
    "lapor masalah lingkungan",
  ],
};
