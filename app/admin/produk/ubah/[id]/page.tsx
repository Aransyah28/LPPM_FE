"use client";

import { use, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Image as ImageIcon,
  Plus,
  Trash2,
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
import type { Book, ProductStatus } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UbahProdukPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = decodeURIComponent(resolvedParams.id);

  const books = useCatalogStore((state) => state.books);
  const categories = useCatalogStore((state) => state.categories);
  const updateBook = useCatalogStore((state) => state.updateBook);

  const targetBook = useMemo(() => {
    return books.find((b) => b.id === productId);
  }, [books, productId]);

  // Form states
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [isbn, setIsbn] = useState("");
  const [tahunTerbit, setTahunTerbit] = useState("");
  const [status, setStatus] = useState<ProductStatus>("published");
  const [berat, setBerat] = useState("");
  const [panjang, setPanjang] = useState("");
  const [lebar, setLebar] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [inputKataKunci, setInputKataKunci] = useState("");
  const [kataKunciList, setKataKunciList] = useState<string[]>([]);
  const [penulisList, setPenulisList] = useState<string[]>([""]);
  const [gambarList, setGambarList] = useState<string[]>([]);
  const [primaryCoverIndex, setPrimaryCoverIndex] = useState(0);

  // Errors state
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Sync state with targetBook
  useEffect(() => {
    if (targetBook) {
      setJudul(targetBook.judul || "");
      setKategori(targetBook.kategori || "");
      setHarga(targetBook.harga ? String(targetBook.harga) : "");
      setDeskripsi(targetBook.deskripsi || "");
      setIsbn(targetBook.isbn || "");
      setTahunTerbit(targetBook.tahunTerbit || "");
      setStatus(targetBook.status || "published");
      setBerat(targetBook.berat ? String(targetBook.berat) : "0.65");
      setPanjang(targetBook.panjang ? String(targetBook.panjang) : "24");
      setLebar(targetBook.lebar ? String(targetBook.lebar) : "16");
      setTinggi(targetBook.tinggi ? String(targetBook.tinggi) : "3");

      if (targetBook.kataKunci && targetBook.kataKunci.length > 0) {
        setKataKunciList(targetBook.kataKunci);
      } else {
        setKataKunciList(["Pendidikan", "Transformasi digital", "Teknologi & Pendidikan"]);
      }

      if (targetBook.daftarPenulis && targetBook.daftarPenulis.length > 0) {
        setPenulisList(targetBook.daftarPenulis);
      } else if (targetBook.penulis) {
        setPenulisList([targetBook.penulis]);
      } else {
        setPenulisList(["Dr. Andika Pratama, S.Kom., M.T.", "Rina Kusumawati, S.E., M.M."]);
      }

      if (targetBook.gambarProduk && targetBook.gambarProduk.length > 0) {
        setGambarList(targetBook.gambarProduk);
      } else {
        setGambarList([
          targetBook.coverUrl || "/books/book-1.webp",
          "/books/book-2.webp",
        ]);
      }
    }
  }, [targetBook]);

  if (!targetBook) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/produk"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Katalog
        </Link>
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
          Produk dengan ID &quot;{productId}&quot; tidak ditemukan.
        </div>
      </div>
    );
  }

  // Check if anything has changed
  const hasChanges = true; // Always allow save or changes detect

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
    toast.success("Gambar berhasil ditambahkan.");
  };

  // Submit update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};

    if (!judul.trim()) newErrors.judul = true;
    if (!kategori) newErrors.kategori = true;
    if (!harga.trim()) newErrors.harga = true;
    if (!deskripsi.trim()) newErrors.deskripsi = true;
    if (!isbn.trim()) newErrors.isbn = true;
    if (!tahunTerbit.trim()) newErrors.tahunTerbit = true;
    if (!berat.trim()) newErrors.berat = true;
    if (!panjang.trim()) newErrors.panjang = true;
    if (!lebar.trim()) newErrors.lebar = true;
    if (!tinggi.trim()) newErrors.tinggi = true;

    const filteredAuthors = penulisList.map((p) => p.trim()).filter(Boolean);
    if (filteredAuthors.length === 0) newErrors.penulis = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Semua formulir wajib diisi sebelum menyimpan perubahan.");
      return;
    }

    setErrors({});

    const hargaNum = parseInt(harga.replace(/\D/g, ""), 10) || 0;
    const beratNum = parseFloat(berat) || 0;
    const panjangNum = parseFloat(panjang) || 0;
    const lebarNum = parseFloat(lebar) || 0;
    const tinggiNum = parseFloat(tinggi) || 0;

    const primaryAuthor = filteredAuthors[0] || targetBook.penulis;

    updateBook(targetBook.id, {
      judul: judul.trim(),
      penulis: primaryAuthor,
      harga: hargaNum,
      kategori: kategori,
      deskripsi: deskripsi.trim(),
      isbn: isbn.trim(),
      tahunTerbit: tahunTerbit.trim(),
      status: status,
      berat: beratNum,
      panjang: panjangNum,
      lebar: lebarNum,
      tinggi: tinggiNum,
      kataKunci: kataKunciList,
      daftarPenulis: filteredAuthors,
      gambarProduk: gambarList,
      coverUrl: gambarList[primaryCoverIndex] || targetBook.coverUrl,
      terakhirDiubah: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
    });

    toast.success("Perubahan produk berhasil disimpan!");
    router.push("/admin/produk");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Ubah Produk
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Periksa seluruh informasi produk, lakukan perubahan yang diperlukan, lalu simpan secara eksplisit.
          </p>
        </div>

        <div className="flex items-center gap-4 self-start sm:self-auto">
          <div className="text-right hidden sm:block">
            <span className="block text-[11px] text-slate-400">Terakhir diubah</span>
            <span className="text-xs font-semibold text-slate-700">
              {targetBook.terakhirDiubah || "04 Jun 2025"}
            </span>
          </div>
          <Link
            href="/admin/produk"
            className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            Kembali ke Katalog
          </Link>
        </div>
      </div>

      {/* Main Form Container Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Informasi Produk</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Perbarui setiap kelompok informasi sesuai tujuan penggunaannya.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-8">
          {/* Sub 1: Informasi Dasar */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold text-slate-800">Informasi Dasar</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Identitas utama yang tampil dan membantu pembeli mengenali produk.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Judul Produk <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Judul produk"
                  value={judul}
                  onChange={(e) => {
                    setJudul(e.target.value);
                    if (errors.judul) setErrors({ ...errors, judul: false });
                  }}
                  className={`h-9 rounded-md bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 ${
                    errors.judul ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"
                  }`}
                />
                {errors.judul && (
                  <p className="text-[11px] text-rose-500">Judul produk wajib diisi.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Kategori <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={kategori}
                    onValueChange={(val) => {
                      setKategori(val ?? "");
                      if (errors.kategori) setErrors({ ...errors, kategori: false });
                    }}
                  >
                    <SelectTrigger
                      className={`h-9 w-full rounded-md bg-white text-xs ${
                        errors.kategori ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"
                      }`}
                    >
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
                  {errors.kategori && (
                    <p className="text-[11px] text-rose-500">Kategori wajib dipilih.</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Harga <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={harga}
                    onChange={(e) => {
                      setHarga(e.target.value);
                      if (errors.harga) setErrors({ ...errors, harga: false });
                    }}
                    className={`h-9 rounded-md bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 ${
                      errors.harga ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"
                    }`}
                  />
                  {errors.harga && (
                    <p className="text-[11px] text-rose-500">Harga wajib diisi.</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Deskripsi Produk <span className="text-rose-500">*</span>
                </label>
                <Textarea
                  rows={4}
                  value={deskripsi}
                  onChange={(e) => {
                    setDeskripsi(e.target.value);
                    if (errors.deskripsi) setErrors({ ...errors, deskripsi: false });
                  }}
                  className={`rounded-md bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 ${
                    errors.deskripsi ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"
                  }`}
                />
                {errors.deskripsi && (
                  <p className="text-[11px] text-rose-500">Deskripsi wajib diisi.</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Sub 2: Metadata Produk */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold text-slate-800">Metadata Produk</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Kelola kata kunci dan penulis untuk pencarian serta atribusi.
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
                <label className="text-xs font-medium text-slate-700">
                  Daftar Penulis <span className="text-rose-500">*</span>
                </label>
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
                        onChange={(e) => {
                          handleAuthorChange(idx, e.target.value);
                          if (errors.penulis) setErrors({ ...errors, penulis: false });
                        }}
                        className={`h-9 flex-1 rounded-md bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 ${
                          errors.penulis && !penulis.trim()
                            ? "border-rose-500 ring-1 ring-rose-500"
                            : "border-slate-200"
                        }`}
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

          <div className="border-t border-slate-100" />

          {/* Sub 3: Informasi Penerbitan dan Penjualan */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold text-slate-800">
                Informasi Penerbitan dan Penjualan
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Kelola data bibliografi dan ketersediaan produk pada katalog.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  ISBN <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="ISBN"
                  value={isbn}
                  onChange={(e) => {
                    setIsbn(e.target.value);
                    if (errors.isbn) setErrors({ ...errors, isbn: false });
                  }}
                  className={`h-9 rounded-md bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 ${
                    errors.isbn ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"
                  }`}
                />
                {errors.isbn && (
                  <p className="text-[11px] text-rose-500">ISBN wajib diisi.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Tahun Terbit <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="2025"
                    value={tahunTerbit}
                    onChange={(e) => {
                      setTahunTerbit(e.target.value);
                      if (errors.tahunTerbit) setErrors({ ...errors, tahunTerbit: false });
                    }}
                    className={`h-9 rounded-md bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 ${
                      errors.tahunTerbit ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"
                    }`}
                  />
                  {errors.tahunTerbit && (
                    <p className="text-[11px] text-rose-500">Tahun terbit wajib diisi.</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Status Publikasi</label>
                  <Select
                    value={status}
                    onValueChange={(val) => setStatus((val as ProductStatus) ?? "published")}
                  >
                    <SelectTrigger className="h-9 w-full rounded-md border-slate-200 bg-white text-xs capitalize">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
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
                Kelola berat dan ukuran fisik produk untuk kebutuhan pengiriman.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Berat (kg) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.0"
                  value={berat}
                  onChange={(e) => {
                    setBerat(e.target.value);
                    if (errors.berat) setErrors({ ...errors, berat: false });
                  }}
                  className={`h-9 rounded-md bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 ${
                    errors.berat ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"
                  }`}
                />
                {errors.berat && (
                  <p className="text-[11px] text-rose-500">Berat wajib diisi.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Panjang (cm) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={panjang}
                  onChange={(e) => {
                    setPanjang(e.target.value);
                    if (errors.panjang) setErrors({ ...errors, panjang: false });
                  }}
                  className={`h-9 rounded-md bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 ${
                    errors.panjang ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"
                  }`}
                />
                {errors.panjang && (
                  <p className="text-[11px] text-rose-500">Panjang wajib diisi.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Lebar (cm) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={lebar}
                  onChange={(e) => {
                    setLebar(e.target.value);
                    if (errors.lebar) setErrors({ ...errors, lebar: false });
                  }}
                  className={`h-9 rounded-md bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 ${
                    errors.lebar ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"
                  }`}
                />
                {errors.lebar && (
                  <p className="text-[11px] text-rose-500">Lebar wajib diisi.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Tinggi (cm) <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={tinggi}
                  onChange={(e) => {
                    setTinggi(e.target.value);
                    if (errors.tinggi) setErrors({ ...errors, tinggi: false });
                  }}
                  className={`h-9 rounded-md bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500 ${
                    errors.tinggi ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"
                  }`}
                />
                {errors.tinggi && (
                  <p className="text-[11px] text-rose-500">Tinggi wajib diisi.</p>
                )}
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
              Kelola gambar, crop, dan sampul utama produk.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">
            {gambarList.length} gambar
          </span>
        </div>

        {/* Dropzone Box */}
        <div
          onClick={handleSimulateUpload}
          className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/30"
        >
          <Button
            type="button"
            variant="ghost"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-transparent"
          >
            Tambah Beberapa Gambar
          </Button>
          <p className="text-[11px] text-slate-400 mt-1">
            JPG, PNG, atau WEBP - maksimum 5 MB per gambar
          </p>
        </div>

        {/* Image items with Sampul Utama badge and controls */}
        {gambarList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {gambarList.map((src, i) => (
              <div
                key={i}
                className="group relative flex flex-col rounded-md border border-slate-200 bg-slate-50/50 p-2.5 space-y-2"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Preview" className="h-full w-full object-cover" />
                  {primaryCoverIndex === i && (
                    <span className="absolute left-2 top-2 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      Sampul Utama
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = gambarList.filter((_, idx) => idx !== i);
                      setGambarList(updated);
                      if (primaryCoverIndex >= updated.length) {
                        setPrimaryCoverIndex(0);
                      }
                    }}
                    className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-600"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-500 truncate max-w-[120px]">
                    {i === 0 ? "Sampul utama.jpg" : `Pratinjau isi-${i}.jpg`}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {primaryCoverIndex !== i && (
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => setPrimaryCoverIndex(i)}
                        className="h-6 text-[10px] px-2 rounded-md"
                      >
                        Jadikan Utama
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => toast.info("Crop pratinjau berhasil disesuaikan.")}
                      className="h-6 text-[10px] px-2 rounded-md text-slate-500"
                    >
                      Periksa
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <span className="text-xs text-slate-400">
          Perubahan akan langsung diperbarui di etalase dan katalog.
        </span>
        <Button
          type="submit"
          className="h-10 rounded-md bg-[#2563eb] px-6 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
        >
          Simpan Perubahan
        </Button>
      </div>
    </form>
  );
}

