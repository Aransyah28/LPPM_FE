# Frontend Code Quality & Style Guide (LPPM UPNVJ Store)

Dokumen ini merupakan panduan otoritatif untuk integritas arsitektur, konsistensi gaya visual, dan standar kode di **Toko Buku LPPM UPN Veteran Jakarta (LPPM Store)**.

---

## 1. Arsitektur & Prinsip Desain LPPM Store

### 1.1. Lingkup Aplikasi
- **Scope Saat Ini:** Frontend E-Commerce publik & Admin Toko (Book Commerce) untuk LPPM UPNVJ.
- **State & Data:** Menggunakan **Zustand store** dengan persistence `localStorage` (belum terhubung ke backend langsung; fokus saat ini adalah menyelesaikan Frontend & UI Flows termasuk Sprint 1).
- **Domain Terpisah:**
  - `(shop)`: Pengunjung / Pembeli publik (Etalase, Detail Buku, Keranjang, Checkout, Pembayaran VA, Lacak Pesanan, Profil).
  - `(admin)`: Pengelola Toko / Admin E-Commerce (Login Admin, Dashboard Admin, Kelola Produk, Kelola Kategori, Pengajuan Publish, Kelola Pesanan).
  - `(auth)`: Autentikasi Pengguna & Admin dengan guard terisolasi.

### 1.2. Component & Layout Conventions
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript.
- **Styling:** Tailwind CSS v4 + `shadcn/ui` + `tw-animate-css`.
- **Form Management:** `react-hook-form` + `@hookform/resolvers/zod` + `zod`.
- **Feedback:** `sonner` untuk toast notification (`toast.success`, `toast.error`).
- **Icons:** `lucide-react`.

---

## 2. Design System & Token Warna (OKLCH - LPPM Theme)

Proyek ini menggunakan palet modern **OKLCH** bernuansa akademik elegan (deep cyan/teal slate), didefinisikan di `app/globals.css`.

### 2.1. Token Semantik Utama

| Token Semantik | Nilai OKLCH / CSS Variable | Penggunaan |
| :--- | :--- | :--- |
| `bg-background` | `oklch(0.985 0.005 210)` | Latar belakang halaman |
| `text-foreground` | `oklch(0.24 0.02 240)` | Teks utama |
| `bg-card` | `oklch(0.995 0.002 220)` | Kartu, container konten |
| `bg-primary` | `oklch(0.58 0.13 208)` | Warna aksen utama (Deep Ocean / Cyan Akademik) |
| `text-primary-foreground` | `oklch(0.99 0 0)` | Teks di atas tombol primary |
| `bg-muted` | `oklch(0.96 0.008 225)` | Background kontras rendah, strip tabel |
| `text-muted-foreground` | `oklch(0.52 0.02 235)` | Teks sekunder, label pembantu, placeholder |
| `border-border` | `oklch(0.9 0.01 225)` | Garis pemisah, border kartu |
| `bg-destructive` | `oklch(0.577 0.245 27.325)` | Aksi hapus/bahaya |

### 2.2. Aturan Bentuk & Geometri (Border Radius)
- **Tombol (Button):** `rounded-md` (Crisp & slightly rounded corner ~6px, sesuai desain Figma LPPM Press). Tombol filter, aksi tabel ("Ubah", "Arsipkan", "Publikasikan Kembali"), CTA ("+ Tambah Produk", "Simpan Produk", "Masuk") menggunakan geometri kotak yang rapi (`rounded-md`).
- **Kartu (Card/Panel):** `rounded-lg` atau `rounded-xl` (`--radius: 0.5rem`).
- **Input Fields & Dropdown:** `rounded-md` dengan tinggi proporsional (`h-9` atau `h-10`).
- **Badge / Chip:** `rounded-md` atau `rounded-full`.

### 2.3. Form Field Standard
Semua input wajib menggunakan komponen berbasis **Shadcn UI**:
- `@/components/ui/form` (`<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>`)
- `@/components/ui/input` (`<Input />`)
- `@/components/ui/password-input` (`<PasswordInput />` dengan tombol toggle intip password)
- `@/components/ui/textarea` (`<Textarea />`)
- `@/components/ui/select` (`<Select />`)

---

## 3. Aturan State Management (Zustand Stores)

1. Semua data persist menggunakan `persist` middleware ke `localStorage`:
   - `auth-store` → `lppm-auth` (Akun pembeli & admin, sesi aktif)
   - `cart-store` → `lppm-cart` (Keranjang belanja & subtotal)
   - `order-store` → `lppm-order` (Pesanan, alamat checkout, status bayar & kirim)
   - `profile-store` → `lppm-profile` (Alamat & profil pengguna)
   - `catalog-store` → State buku katalog & kategori (dapat dimutasi oleh admin pada Sprint 1)
2. Gunakan hook `useHydrated()` untuk mencegah hydration mismatch saat membaca localStorage di client component.

---

## 4. Standar Kode & Aksesibilitas (A11y)

1. **Aksesibilitas:**
   - Semua elemen interaktif wajib memiliki focus ring yang jelas (`outline-ring/50`).
   - Tombol ikon murni wajib menyertakan `aria-label` atau `<span className="sr-only">`.
   - Warna teks wajib kontras dan lulus WCAG AA (`text-foreground` / `text-muted-foreground`).
2. **Format Standar:**
   - Mata uang: Wajib gunakan `formatRupiah(number)` dari `@/lib/format`.
   - Tanggal: Wajib gunakan `formatDate(string)` dari `@/lib/format`.
   - Metode Pembayaran & Status: Gunakan helper label dari `@/lib/format`.
3. **Responsivitas:**
   - Desain fleksibel Mobile-first hingga Desktop max width `max-w-[1440px]`.

---

## 5. Ringkasan Checklist Kualitas

| Kategori | Wajib Dipenuhi | Dilarang |
| :--- | :--- | :--- |
| **Styling** | Token semantik (`bg-card`, `bg-primary`, `border-border`) | Hardcoded color hex/rgb/hsl di luar theme |
| **Bentuk** | Card `rounded-xl`, tombol `rounded-md` | Desain tidak konsisten |
| **Form** | React Hook Form + Zod + Shadcn Form primitives | Raw `<input>` tanpa styling & aksesibilitas |
| **Data** | Types terpusat di `@/lib/types.ts` & store Zustand | Mutasi state langsung tanpa setter |
| **UX** | Notifikasi via `toast` (Sonner), konfirmasi dialog untuk aksi destruktif | Alert browser bawaan (`window.alert`) |

---
**LPPM UPN Veteran Jakarta E-Commerce Guidelines**
