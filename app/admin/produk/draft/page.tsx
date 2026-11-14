"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/lib/format";
import { useCatalogStore } from "@/stores/catalog-store";
import type { Book, ProductStatus } from "@/lib/types";

export default function DraftProdukPage() {
  const books = useCatalogStore((state) => state.books);
  const categories = useCatalogStore((state) => state.categories);
  const updateBook = useCatalogStore((state) => state.updateBook);
  const setProductStatus = useCatalogStore((state) => state.setProductStatus);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"judul" | "harga" | "kategori">("judul");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Edit modal state
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formJudul, setFormJudul] = useState("");
  const [formPenulis, setFormPenulis] = useState("");
  const [formKategori, setFormKategori] = useState("");
  const [formHarga, setFormHarga] = useState("");
  const [formStok, setFormStok] = useState("10");

  // Filter draft books
  const draftBooks = useMemo(() => {
    return books
      .filter((book) => {
        if (book.status !== "draft") return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const match =
            book.judul.toLowerCase().includes(q) ||
            book.kategori.toLowerCase().includes(q) ||
            book.penulis.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [books, searchQuery, sortField, sortDirection]);

  const handleOpenEdit = (book: Book) => {
    setEditingBook(book);
    setFormJudul(book.judul);
    setFormPenulis(book.penulis);
    setFormKategori(book.kategori);
    setFormHarga(book.harga.toString());
    setFormStok(book.stok.toString());
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    updateBook(editingBook.id, {
      judul: formJudul,
      penulis: formPenulis,
      kategori: formKategori,
      harga: parseInt(formHarga, 10) || 0,
      stok: parseInt(formStok, 10) || 0,
    });

    toast.success("Perubahan data draft berhasil disimpan.");
    setEditingBook(null);
  };

  const handlePublishNow = (book: Book) => {
    setProductStatus(book.id, "published");
    toast.success(`Karya "${book.judul}" berhasil dipublikasikan ke katalog!`);
  };

  const handleSort = (field: "judul" | "harga" | "kategori") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back to Catalog Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Draft Produk
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Kelola produk yang belum dipublikasikan dan lanjutkan proses publikasi setelah data lengkap.
          </p>
        </div>

        <Link
          href="/admin/produk"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          Kembali ke Katalog
        </Link>
      </div>

      {/* Main Table Container Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:p-6">
        {/* Search & Actions Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari judul, kategori, atau format..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-lg border-slate-200 bg-white pl-9 text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 rounded-lg border-slate-200 px-3 text-xs text-slate-600 hover:bg-slate-50"
            >
              <Filter className="mr-1.5 size-3.5 text-slate-400" />
              Filter
            </Button>
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="h-10 text-xs text-slate-500 hover:text-slate-800"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Draft Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th
                  onClick={() => handleSort("judul")}
                  className="pb-3 pr-4 font-semibold cursor-pointer hover:text-slate-700 select-none"
                >
                  PRODUK {sortField === "judul" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("kategori")}
                  className="pb-3 px-4 font-semibold cursor-pointer hover:text-slate-700 select-none"
                >
                  KATEGORI {sortField === "kategori" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("harga")}
                  className="pb-3 px-4 font-semibold cursor-pointer hover:text-slate-700 select-none"
                >
                  HARGA {sortField === "harga" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="pb-3 px-4 font-semibold">TERAKHIR DIUBAH ↓</th>
                <th className="pb-3 pl-4 text-right font-semibold">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {draftBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Tidak ada produk draft saat ini.
                  </td>
                </tr>
              ) : (
                draftBooks.map((book) => (
                  <tr key={book.id} className="group hover:bg-slate-50/70 transition-colors">
                    {/* Thumbnail & Judul */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                          <Image
                            src={book.coverUrl || "/books/book-1.webp"}
                            alt={book.judul}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs md:max-w-sm">
                          <p className="font-semibold text-slate-800 line-clamp-2">
                            {book.judul}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {book.penulis}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {book.kategori}
                    </td>

                    {/* Harga */}
                    <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {formatRupiah(book.harga)}
                    </td>

                    {/* Terakhir Diubah */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {book.terakhirDiubah || "02 Jun 2025"}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 pl-4 text-right whitespace-nowrap space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(book)}
                        className="h-8 rounded-lg border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Ubah
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handlePublishNow(book)}
                        className="h-8 rounded-lg bg-[#2563eb] px-3 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
                      >
                        Lanjutkan Publikasi
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
          Menampilkan <span className="font-semibold text-slate-800">{draftBooks.length}</span> produk
        </div>
      </div>

      {/* Modal Ubah Data Draft */}
      <Dialog open={Boolean(editingBook)} onOpenChange={(open) => !open && setEditingBook(null)}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Ubah Data Draft
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Perbarui rincian naskah sebelum dipublikasikan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Judul Karya *</label>
              <Input
                value={formJudul}
                onChange={(e) => setFormJudul(e.target.value)}
                className="h-9 rounded-lg border-slate-200 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Penulis</label>
              <Input
                value={formPenulis}
                onChange={(e) => setFormPenulis(e.target.value)}
                className="h-9 rounded-lg border-slate-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Kategori *</label>
                <Select value={formKategori} onValueChange={setFormKategori}>
                  <SelectTrigger className="h-9 rounded-lg border-slate-200 text-xs">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.nama} className="text-xs">
                        {cat.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Harga (Rp) *</label>
                <Input
                  type="number"
                  value={formHarga}
                  onChange={(e) => setFormHarga(e.target.value)}
                  className="h-9 rounded-lg border-slate-200 text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingBook(null)}
                className="rounded-lg text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Simpan Draft
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

