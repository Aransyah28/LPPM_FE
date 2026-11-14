export type UserRole = "PENGGUNA" | "ADMIN";

export type PublishSubmissionStatus = "menunggu" | "diproses" | "selesai";

export interface SubmissionAsset {
  nama: string;
  tipe: string;
  ukuran: string;
  url?: string;
}

export interface PublishSubmission {
  id: string; // e.g. "PUB-2025-0034"
  judulKarya: string;
  kategori: string;
  tanggalPengajuan: string; // e.g. "28 Mei 2025"
  penulis?: string;
  status: PublishSubmissionStatus;
  isbn?: string;
  tahunTerbit?: string;
  harga?: number;
  deskripsi?: string;
  kataKunci?: string[];
  daftarPenulis?: string[];
  aset?: SubmissionAsset[];
}

export interface Address {
  id: string;
  namaPenerima: string;
  telepon: string;
  alamatLengkap: string;
  provinsi: string;
  kota: string;
  kodePos: string;
}

export interface User {
  id: string;
  nama: string;
  email: string;
  passwordHashMock: string;
  role: UserRole;
  alamatList: Address[];
  createdAt: string;
}

export type ProductStatus = "draft" | "published" | "archived";

export interface Category {
  id: string;
  nama: string;
  deskripsi: string;
}

export interface Book {
  id: string;
  judul: string;
  penulis: string;
  harga: number;
  stok: number;
  coverUrl: string;
  kategori: string;
  status: ProductStatus;
  terakhirDiubah?: string;
  deskripsi?: string;
  isbn?: string;
  tahunTerbit?: string;
  berat?: number;
  panjang?: number;
  lebar?: number;
  tinggi?: number;
  kataKunci?: string[];
  daftarPenulis?: string[];
  gambarProduk?: string[];
}

export interface CartItem {
  bookId: string;
  qty: number;
  hargaSnapshot: number;
}

export type PaymentMethod = "BCA_VA" | "BNI_VA" | "BRI_VA";
export type OrderStatus = "pending_payment" | "paid";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  biayaLayanan: number;
  total: number;
  address: Address;
  paymentMethod: PaymentMethod;
  vaNumber?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface ForgotPasswordToken {
  email: string;
  otp: string;
  expiresAt: string;
  verified: boolean;
}
