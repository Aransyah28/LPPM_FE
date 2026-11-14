"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Image as ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogStore } from "@/stores/catalog-store";
import { useSubmissionStore } from "@/stores/submission-store";

function BuatProdukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const submissionId = searchParams.get("fromSubmission");

  const categories = useCatalogStore((state) => state.categories);
  const addBook = useCatalogStore((state) => state.addBook);
  const getSubmissionById = useSubmissionStore((state) => state.getSubmissionById);
  const markAsProcessed = useSubmissionStore((state) => state.markAsProcessed);

  // Form states
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [isbn, setIsbn] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [harga, setHarga] = useState("");
  const [berat, setBerat] = useState("");
  const [panjang, setPanjang] = useState("");
  const [lebar, setLebar] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [inputKataKunci, setInputKataKunci] = useState("");
  const [kataKunciList, setKataKunciList] = useState<string[]>([]);
  const [penulisList, setPenulisList] = useState<string[]>([""]);
  const [gambarList, setGambarList] = useState<string[]>([]);

  // Pre-fill if coming from a submission
  useEffect(() => {
    if (submissionId) {
      const sub = getSubmissionById(submissionId);
      if (sub) {
        setJudul(sub.judulKarya || "");
        setKategori(sub.kategori || "");
        setDeskripsi(sub.deskripsi || "");
        setIsbn(sub.isbn || "");
        setTahunTerbit(sub.tahunTerbit || "");
        setHarga(sub.harga ? String(sub.harga) : "");
        if (sub.kataKunci && sub.kataKunci.length > 0) {
          setKataKunciList(sub.kataKunci);
        }
        if (sub.daftarPenulis && sub.daftarPenulis.length > 0) {
          setPenulisList(sub.daftarPenulis);
        } else if (sub.penulis) {
          setPenulisList([sub.penulis]);
        }
        toast.info(`Form telah terisi otomatis dari pengajuan ${sub.id}`);
      }
    }
  }, [submissionId, getSubmissionById]);

  // Keyword handlers
  const handleAddKataKunci = () => {
    const trimmed = inputKataKunci.trim();
    if (!trimmed) return;
    if (kataKunciList.includes(trimmed)) {
      toast.warning("Kata kunci sudah ada di daftar.");
      return;
    }
    setKataKunciList([...kataKunciList, trimmed]);
    setInputKataKunci("");
  };

  const handleRemoveKataKunci = (tag: string) => {
    setKataKunciList(kataKunciList.filter((k) => k !== tag));
  };

  // Author handlers
  const handleAuthorChange = (index: number, val: string) => {
    const updated = [...penulisList];
    updated[index] = val;
    setPenulisList(updated);
  };

  const handleAddAuthor = () => {
    setPenulisList([...penulisList, ""]);
  };

  const handleRemoveAuthor = (index: number) => {
    if (penulisList.length <= 1) {
      setPenulisList([""]);
      return;
    }
    setPenulisList(penulisList.filter((_, i) => i !== index));
  };

  const handleMoveAuthor = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === penulisList.length - 1) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const updated = [...penulisList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setPenulisList(updated);
  };

  // Image mockup picker
  const handleSimulateUpload = () => {
    const sampleImages = [
      "/books/book-1.webp",
      "/books/book-2.webp",
      "/books/book-3.webp",
    ];
    const nextImg = sampleImages[gambarList.length % sampleImages.length];
    setGambarList([...gambarList, nextImg]);
    toast.success("Gambar berhasil ditambahkan ke daftar pratinjau.");
  };

  // Submit form -> Save as draft
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!judul.trim()) {
      toast.error("Judul produk wajib diisi.");
      return;
    }

    const hargaNum = parseInt(harga.replace(/\D/g, ""), 10) || 0;
    const beratNum = parseFloat(berat) || 0;
    const panjangNum = parseFloat(panjang) || 0;
    const lebarNum = parseFloat(lebar) || 0;
    const tinggiNum = parseFloat(tinggi) || 0;

    const filteredAuthors = penulisList.map((p) => p.trim()).filter(Boolean);
    const primaryAuthor = filteredAuthors.length > 0 ? filteredAuthors[0] : "Admin LPPM";

    const newProduct = {
      judul: judul.trim(),
      penulis: primaryAuthor,
      harga: hargaNum,
      stok: 10,
      coverUrl: gambarList[0] || "/books/book-1.webp",
      kategori: kategori || "Umum",
      status: "draft" as const,
      deskripsi: deskripsi.trim(),
      isbn: isbn.trim(),
      tahunTerbit: tahunTerbit.trim(),
      berat: beratNum,
      panjang: panjangNum,
      lebar: lebarNum,
      tinggi: tinggiNum,
      kataKunci: kataKunciList,
      daftarPenulis: filteredAuthors,
      gambarProduk: gambarList,
      terakhirDiubah: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
    };

    addBook(newProduct);

    if (submissionId) {
      markAsProcessed(submissionId);
    }

    toast.success("Produk berhasil disimpan dalam status Draft!");
    router.push("/admin/produk/draft");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Header and Back Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Buat Produk
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Lengkapi informasi dan aset untuk membuat produk baru.
          </p>
        </div>

        <Link
          href="/admin/produk"
          className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          Kembali
        </Link>
      </div>

      {/* Section 1: Informasi Produk Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Informasi Produk</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Isi setiap kelompok informasi secara berurutan agar produk siap dipublikasikan.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-8">
          {/* Sub 1: Informasi Dasar */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold text-slate-800">Informasi Dasar</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Identitas utama yang membantu pembeli mengenali produk.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Judul Produk</label>
                <Input
                  type="text"
                  placeholder="Contoh: Transformasi Digital dalam Pengelolaan Perguruan Tinggi"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="h-9 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Kategori</label>
                <Select value={kategori} onValueChange={(val) => setKategori(val ?? "")}>
                  <SelectTrigger className="h-9 w-full rounded-md border-slate-200 bg-white text-xs">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.nama}>
                        {cat.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Deskripsi Produk</label>
                <Textarea
                  placeholder="Tuliskan deskripsi lengkap mengenai buku, bab materi, atau keunggulan produk..."
                  rows={4}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Sub 2: Detail Penerbitan */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold text-slate-800">Detail Penerbitan</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Data bibliografi produk yang diterbitkan.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">ISBN</label>
                <Input
                  type="text"
                  placeholder="Contoh: 978-623-93350-1-6"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="h-9 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Tahun Terbit</label>
                <Input
                  type="text"
                  placeholder="Contoh: 2025"
                  value={tahunTerbit}
                  onChange={(e) => setTahunTerbit(e.target.value)}
                  className="h-9 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Sub 3: Harga dan Penjualan */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold text-slate-800">Harga dan Penjualan</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Tentukan harga jual produk pada katalog.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="space-y-1.5 max-w-xs">
                <label className="text-xs font-medium text-slate-700">Harga</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    Rp
                  </span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    className="h-9 rounded-md border-slate-200 bg-white pl-9 text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Sub 4: Dimensi dan Pengiriman */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold text-slate-800">Dimensi dan Pengiriman</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Masukkan berat dan ukuran fisik produk untuk kebutuhan pengiriman.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Berat (kg)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.0"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value)}
                  className="h-9 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Panjang (cm)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={panjang}
                  onChange={(e) => setPanjang(e.target.value)}
                  className="h-9 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Lebar (cm)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={lebar}
                  onChange={(e) => setLebar(e.target.value)}
                  className="h-9 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Tinggi (cm)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={tinggi}
                  onChange={(e) => setTinggi(e.target.value)}
                  className="h-9 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Sub 5: Metadata Produk */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold text-slate-800">Metadata Produk</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Tambahkan kata kunci dan penulis untuk mempermudah pencarian serta atribusi.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-6">
              {/* Kata Kunci */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Kata Kunci</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Tulis kata kunci"
                    value={inputKataKunci}
                    onChange={(e) => setInputKataKunci(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKataKunci();
                      }
                    }}
                    className="h-9 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddKataKunci}
                    className="h-9 rounded-md border-slate-200 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Tambah
                  </Button>
                </div>

                {kataKunciList.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {kataKunciList.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveKataKunci(tag)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Daftar Penulis */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Daftar Penulis</label>
                <div className="space-y-2">
                  {penulisList.map((penulis, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-semibold text-blue-600">
                        {idx + 1}
                      </span>
                      <Input
                        type="text"
                        placeholder="Nama penulis"
                        value={penulis}
                        onChange={(e) => handleAuthorChange(idx, e.target.value)}
                        className="h-9 flex-1 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveAuthor(idx, "up")}
                          disabled={idx === 0}
                          className="size-8 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ArrowUp className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveAuthor(idx, "down")}
                          disabled={idx === penulisList.length - 1}
                          className="size-8 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ArrowDown className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveAuthor(idx)}
                          className="h-8 rounded-md border-rose-200 px-2.5 text-xs text-rose-600 hover:bg-rose-50"
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddAuthor}
                    className="h-9 w-full rounded-md border-dashed border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Plus className="mr-1.5 size-3.5" />
                    Tambah Penulis
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Gambar Produk Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Gambar Produk</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Unggah beberapa gambar. Setiap gambar memiliki konfigurasi crop tersendiri.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">
            {gambarList.length} gambar
          </span>
        </div>

        {/* Dropzone Box */}
        <div
          onClick={handleSimulateUpload}
          className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/30"
        >
          <Button
            type="button"
            variant="ghost"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-transparent"
          >
            Pilih Beberapa Gambar
          </Button>
          <p className="text-[11px] text-slate-400 mt-1">
            JPG, PNG, atau WEBP - maksimum 5 MB per gambar
          </p>
        </div>

        {/* Preview Grid if images exist */}
        {gambarList.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-2">
            {gambarList.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-[3/4] overflow-hidden rounded-md border border-slate-200 bg-slate-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setGambarList(gambarList.filter((_, idx) => idx !== i));
                  }}
                  className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-600"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="flex items-center justify-end rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <Button
          type="submit"
          className="h-10 rounded-md bg-[#2563eb] px-6 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
        >
          Simpan Produk
        </Button>
      </div>
    </form>
  );
}

export default function BuatProdukPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500">
          Memuat formulir produk...
        </div>
      }
    >
      <BuatProdukForm />
    </Suspense>
  );
}

