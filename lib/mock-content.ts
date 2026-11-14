import type { Book, Category } from "@/lib/types";

export const CATEGORY_LIST: Category[] = [
  {
    id: "cat-1",
    nama: "Teknologi & Pendidikan",
    deskripsi: "Karya mengenai teknologi, inovasi, dan pendidikan tinggi.",
  },
  {
    id: "cat-2",
    nama: "Hukum",
    deskripsi: "Kajian hukum, regulasi, dan kebijakan hukum.",
  },
  {
    id: "cat-3",
    nama: "Ekonomi & Bisnis",
    deskripsi: "Ekonomi, kewirausahaan, dan pengelolaan bisnis.",
  },
  {
    id: "cat-4",
    nama: "Ilmu Sosial",
    deskripsi: "Kajian sosial, kebijakan publik, dan masyarakat.",
  },
  {
    id: "cat-5",
    nama: "Metodologi Penelitian",
    deskripsi: "Metode dan pendekatan penelitian akademik.",
  },
  {
    id: "cat-6",
    nama: "Komunikasi",
    deskripsi: "Komunikasi strategis dan media digital.",
  },
];

export const BOOK_LIST: Book[] = [
  {
    id: "book-1",
    judul: "Hukum Siber dan Perlindungan Data Pribadi di Indonesia",
    penulis: "Dr. Siti Rahmawati, S.H., M.H.",
    harga: 148000,
    stok: 12,
    coverUrl: "/books/book-1.webp",
    kategori: "Hukum",
    status: "published",
    terakhirDiubah: "30 Mei 2025",
  },
  {
    id: "book-2",
    judul: "Pengantar Ekonomi Kreatif dan Kewirausahaan Berkelanjutan",
    penulis: "M. Faisal Akbar, S.E., M.M.",
    harga: 112000,
    stok: 8,
    coverUrl: "/books/book-2.webp",
    kategori: "Ekonomi & Bisnis",
    status: "published",
    terakhirDiubah: "28 Mei 2025",
  },
  {
    id: "book-3",
    judul: "Metodologi Penelitian Sosial Kontemporer",
    penulis: "Dr. Anisa Lestari, M.A.",
    harga: 135000,
    stok: 5,
    coverUrl: "/books/book-3.webp",
    kategori: "Metodologi Penelitian",
    status: "archived",
    terakhirDiubah: "18 Mei 2025",
  },
  {
    id: "book-4",
    judul: "Komunikasi Strategis di Era Media Digital",
    penulis: "A. M. Firman, M.I.Kom.",
    harga: 118000,
    stok: 7,
    coverUrl: "/books/book-4.webp",
    kategori: "Komunikasi",
    status: "archived",
    terakhirDiubah: "14 Mei 2025",
  },
  {
    id: "book-5",
    judul: "Transformasi Digital dalam Pengelolaan Perguruan Tinggi",
    penulis: "Prof. Dr. Ir. Wahyudi, M.Kom.",
    harga: 160000,
    stok: 15,
    coverUrl: "/books/book-5.webp",
    kategori: "Teknologi & Pendidikan",
    status: "draft",
    terakhirDiubah: "2 Juni 2025",
  },
  {
    id: "book-6",
    judul: "Kebijakan Publik: Teori, Analisis, dan Praktik",
    penulis: "Drs. Hendro Wibowo, M.Si.",
    harga: 125000,
    stok: 10,
    coverUrl: "/books/book-6.webp",
    kategori: "Ilmu Sosial",
    status: "draft",
    terakhirDiubah: "1 Juni 2025",
  },
  {
    id: "book-7",
    judul: "Pengantar Ilmu Komputer & AI",
    penulis: "J. Glenn Brookshear",
    harga: 150000,
    stok: 12,
    coverUrl: "/books/book-1.webp",
    kategori: "Teknologi & Pendidikan",
    status: "published",
    terakhirDiubah: "25 Mei 2025",
  },
  {
    id: "book-8",
    judul: "Dasar-Dasar Manajemen Bisnis Modern",
    penulis: "M. K. Hartono",
    harga: 120000,
    stok: 8,
    coverUrl: "/books/book-2.webp",
    kategori: "Ekonomi & Bisnis",
    status: "published",
    terakhirDiubah: "20 Mei 2025",
  },
];

export const UI_IMAGE_ASSETS = {
  dashboard: {
    heroSlides: [
      {
        title: "Wawasan riset kini lebih mudah dijelajahi dan dikoleksi.",
        description:
          "Jelajahi jurnal ilmiah, buku ajar dosen, dan laporan riset dari LPPM UPN Veteran Jakarta dalam satu etalase.",
        imageUrl:
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1600&q=80&fm=webp",
      },
      {
        title: "Publikasi kampus pilihan dengan alur jelajah yang lebih rapi dan modern.",
        description:
          "Temukan terbitan unggulan, karya dosen, dan referensi akademik lebih cepat lewat etalase yang fokus pada konten.",
        imageUrl:
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80&fm=webp",
      },
      {
        title: "Jurnal, laporan, dan buku tersusun dalam satu pengalaman etalase.",
        description:
          "Telusuri publikasi terbaru, koleksi unggulan, dan penawaran terbatas tanpa berpindah antar tampilan katalog.",
        imageUrl:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80&fm=webp",
      },
    ],
    disciplineImage:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1400&q=80&fm=webp",
    cardImages: [
      "/books/book-3.webp",
      "/books/book-4.webp",
      "/books/book-5.webp",
      "/books/book-6.webp",
      "/books/book-7.webp",
    ],
    productMeta: ["Jurnal", "Buku Ajar", "Laporan", "Monograf", "Prosiding"],
  },
  bookDetail: {
    fallbackGalleryImages: [
      "/books/book-8.webp",
      "/books/book-5.webp",
    ],
  },
} as const;

export const AUTH_BRANDING_ASSETS = {
  backgroundImageUrl: "/images/universitas.webp",
  campusIconBasePaths: ["/icon_campus", "/images/icon_campus"],
  campusIconExtensions: ["png", "svg", "webp", "jpg", "jpeg", "ico"],
} as const;

export function buildBookImageGallery(
  coverUrl: string,
  additionalImages: readonly string[] = UI_IMAGE_ASSETS.bookDetail.fallbackGalleryImages
): string[] {
  // Keep gallery unique while preserving order.
  return [...new Set([coverUrl, ...additionalImages])];
}

export function getCampusIconSources(): string[] {
  return AUTH_BRANDING_ASSETS.campusIconBasePaths.flatMap((basePath) =>
    AUTH_BRANDING_ASSETS.campusIconExtensions.map((ext) => `${basePath}.${ext}`)
  );
}
