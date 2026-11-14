"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PublishSubmission } from "@/lib/types";

const INITIAL_SUBMISSIONS: PublishSubmission[] = [
  {
    id: "PUB-2025-0084",
    judulKarya: "Transformasi Digital dalam Pengelolaan Perguruan Tinggi",
    kategori: "Teknologi & Pendidikan",
    tanggalPengajuan: "28 Mei 2025",
    penulis: "Dr. Andika Pratama, S.Kom., M.T.",
    status: "menunggu",
    isbn: "978-623-93350-1-6",
    tahunTerbit: "2025",
    harga: 148000,
    deskripsi:
      "Buku ini membahas transformasi digital dalam tata kelola perguruan tinggi, mulai dari perencanaan strategis, pengembangan layanan akademik, hingga pemanfaatan data untuk pengambilan keputusan. Pembahasan disertai studi kasus dan pendekatan praktis yang relevan dengan institusi pendidikan tinggi di Indonesia.",
    kataKunci: [
      "Transformasi digital",
      "Perguruan tinggi",
      "Tata kelola",
      "Teknologi pendidikan",
    ],
    daftarPenulis: [
      "Dr. Andika Pratama, S.Kom., M.T.",
      "Rina Kusumawati, S.E., M.M.",
      "Prof. Dr. Hendra Wijaya, M.Sc.",
    ],
    aset: [
      {
        nama: "Sampul_Depan.png",
        tipe: "PNG",
        ukuran: "1.1 MB",
      },
      {
        nama: "Gambar_Produk.png",
        tipe: "PNG",
        ukuran: "0.9 MB",
      },
      {
        nama: "Gambar_Produk2.png",
        tipe: "PNG",
        ukuran: "0.6 MB",
      },
    ],
  },
  {
    id: "PUB-2025-0033",
    judulKarya: "Hukum Siber dan Perlindungan Data Pribadi di Indonesia",
    kategori: "Hukum",
    tanggalPengajuan: "27 Mei 2025",
    penulis: "Dr. Siti Rahmawati, S.H., M.H.",
    status: "menunggu",
    isbn: "978-602-12345-8-9",
    tahunTerbit: "2025",
    harga: 135000,
    deskripsi:
      "Kajian komprehensif mengenai regulasi perlindungan data pribadi dan kejahatan siber di era transformasi digital Indonesia.",
    kataKunci: ["Hukum siber", "Data pribadi", "Regulasi digital"],
    daftarPenulis: [
      "Dr. Siti Rahmawati, S.H., M.H.",
      "Ahmad Fauzi, S.H., LL.M.",
    ],
    aset: [
      { nama: "Sampul_Depan.png", tipe: "PNG", ukuran: "1.2 MB" },
      { nama: "Naskah_Final.pdf", tipe: "PDF", ukuran: "4.5 MB" },
    ],
  },
  {
    id: "PUB-2025-0032",
    judulKarya: "Pengantar Ekonomi Kreatif dan Kewirausahaan Berkelanjutan",
    kategori: "Ekonomi & Bisnis",
    tanggalPengajuan: "25 Mei 2025",
    penulis: "M. Faisal Akbar, S.E., M.M.",
    status: "menunggu",
    isbn: "978-602-98765-4-3",
    tahunTerbit: "2025",
    harga: 112000,
    deskripsi:
      "Prinsip-prinsip pengembangan kewirausahaan berbasis ekonomi kreatif dan keberlanjutan lingkungan bagi mahasiswa dan pelaku usaha.",
    kataKunci: ["Ekonomi kreatif", "Kewirausahaan", "Bisnis berkelanjutan"],
    daftarPenulis: ["M. Faisal Akbar, S.E., M.M."],
    aset: [{ nama: "Sampul_Depan.png", tipe: "PNG", ukuran: "1.0 MB" }],
  },
  {
    id: "PUB-2025-0031",
    judulKarya: "Kebijakan Publik: Teori, Analisis, dan Praktik",
    kategori: "Ilmu Sosial",
    tanggalPengajuan: "22 Mei 2025",
    penulis: "Drs. Hendro Wibowo, M.Si.",
    status: "menunggu",
    isbn: "978-623-11223-3-4",
    tahunTerbit: "2025",
    harga: 125000,
    deskripsi:
      "Pendekatan terpadu formulasi, implementasi, dan evaluasi kebijakan publik di tingkat daerah dan nasional.",
    kataKunci: ["Kebijakan publik", "Tata pemerintahan", "Analisis sosial"],
    daftarPenulis: ["Drs. Hendro Wibowo, M.Si."],
    aset: [{ nama: "Sampul_Depan.png", tipe: "PNG", ukuran: "0.8 MB" }],
  },
  {
    id: "PUB-2025-0030",
    judulKarya: "Metodologi Penelitian Sosial Kontemporer",
    kategori: "Metodologi Penelitian",
    tanggalPengajuan: "20 Mei 2025",
    penulis: "Dr. Anisa Lestari, M.A.",
    status: "menunggu",
    isbn: "978-623-44556-7-8",
    tahunTerbit: "2025",
    harga: 140000,
    deskripsi:
      "Panduan praktis dan teoritis metode riset kuantitatif dan kualitatif untuk civitas akademika perguruan tinggi.",
    kataKunci: ["Metodologi penelitian", "Riset sosial", "Kualitatif & Kuantitatif"],
    daftarPenulis: ["Dr. Anisa Lestari, M.A."],
    aset: [{ nama: "Sampul_Depan.png", tipe: "PNG", ukuran: "1.4 MB" }],
  },
];

type SubmissionState = {
  submissions: PublishSubmission[];
  getSubmissionById: (id: string) => PublishSubmission | undefined;
  markAsProcessed: (id: string) => void;
};

export const useSubmissionStore = create<SubmissionState>()(
  persist(
    (set, get) => ({
      submissions: INITIAL_SUBMISSIONS,
      getSubmissionById: (id) => get().submissions.find((s) => s.id === id),
      markAsProcessed: (id) =>
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? { ...s, status: "diproses" } : s
          ),
        })),
    }),
    {
      name: "lppm-admin-submissions-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

