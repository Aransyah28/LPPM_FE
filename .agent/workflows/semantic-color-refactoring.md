---
description: Refactor component colors using LPPM Store semantic tokens and OKLCH color scheme
---

# Semantic Color Workflow — LPPM UPNVJ Store

Alur kerja ini memastikan seluruh styling komponen dan halaman di Toko Buku LPPM UPNVJ konsisten menggunakan semantic token OKLCH dari `app/globals.css`.

---

## STEP 1: TOKEN PALETTE AUDIT

### 1.1 LPPM Store Color Tokens (Reference: `globals.css`)

| Semantic Token          | Nilai OKLCH / CSS Variable | Peran di Toko LPPM |
| ----------------------- | -------------------------- | ------------------ |
| `bg-background`         | `oklch(0.985 0.005 210)`   | Latar belakang halaman utama |
| `bg-card`               | `oklch(0.995 0.002 220)`   | Kartu produk, panel order summary, form card |
| `bg-muted`              | `oklch(0.96 0.008 225)`    | Container abu-abu muda, strip list, info box |
| `bg-primary`            | `oklch(0.58 0.13 208)`     | Warna aksen utama kampus (Deep Ocean / Cyan) |
| `text-foreground`       | `oklch(0.24 0.02 240)`     | Teks teks judul dan isi konten utama |
| `text-muted-foreground` | `oklch(0.52 0.02 235)`     | Teks deskripsi, label, tanggal, placeholder |
| `border-border`         | `oklch(0.9 0.01 225)`      | Border kartu, divider, separator |
| `bg-destructive`        | `oklch(0.577 0.245 27.325)`| Tombol hapus/batal (merah peringatan) |

### 1.2 Pola yang Dilarang (Anti-Patterns)

```tsx
// ❌ DILARANG: Arbitrary hex atau palet hardcoded di luar tema
className = "bg-[#0f172a] text-[#ffffff]";
className = "bg-red-600 text-white"; // Kecuali badge diskon khusus yang terdefinisi

// ✅ WAJIB: Gunakan semantic token
className = "bg-card text-foreground border border-border";
className = "bg-primary text-primary-foreground";
className = "text-muted-foreground";
```

### 1.3 Pemetaan Elemen ke Token

| Elemen Antarmuka | Background Token | Text Token | Border Token |
| --- | --- | --- | --- |
| Container Halaman | `bg-background` | `text-foreground` | — |
| Kartu Produk / Form Card | `bg-card` | `text-foreground` | `border-border` |
| Sidebar / Filter Box | `bg-card` atau `bg-muted/30` | `text-foreground` | `border-border` |
| Badge Kategori | `bg-muted` | `text-muted-foreground` | `border-border` |
| Badge Diskon | `bg-red-100 dark:bg-red-950/40` | `text-red-700 dark:text-red-400` | — |
| Tombol Utama (Beli/Bayar) | `bg-primary` | `text-primary-foreground` | — |
| Tombol Sekunder / Outline | `bg-transparent` | `text-foreground` | `border-border` |
| Input Form | `bg-background` | `text-foreground` | `border-input` |
