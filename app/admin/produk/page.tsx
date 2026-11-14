"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Filter,
  Plus,
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

export default function KelolaProdukPage() {
  const books = useCatalogStore((state) => state.books);
  const categories = useCatalogStore((state) => state.categories);
  const addBook = useCatalogStore((state) => state.addBook);
  const updateBook = useCatalogStore((state) => state.updateBook);
  const setProductStatus = useCatalogStore((state) => state.setProductStatus);

  const [activeTab, setActiveTab] = useState<"all" | "published" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"judul" | "harga" | "kategori">("judul");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form inputs
  const [formJudul, setFormJudul] = useState("");
  const [formPenulis, setFormPenulis] = useState("");
  const [formKategori, setFormKategori] = useState("");
  const [formHarga, setFormHarga] = useState("");
  const [formStok, setFormStok] = useState("10");
  const [formStatus, setFormStatus] = useState<ProductStatus>("published");

  // Counters
  const countPublished = useMemo(() => books.filter((b) => b.status === "published").length, [books]);
  const countArchived = useMemo(() => books.filter((b) => b.status === "archived").length, [books]);
  const countDraft = useMemo(() => books.filter((b) => b.status === "draft").length, [books]);

  // Filtered & Sorted books (Excludes draft from main catalog view)
  const displayBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Main catalog only shows published and archived
        if (book.status === "draft") return false;

        if (activeTab === "published" && book.status !== "published") return false;
        if (activeTab === "archived" && book.status !== "archived") return false;

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
  }, [books, activeTab, searchQuery, sortField, sortDirection]);

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setFormJudul("");
    setFormPenulis("");
    setFormKategori(categories[0]?.nama || "Hukum");
    setFormHarga("");
    setFormStok("10");
    setFormStatus("published");
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setFormJudul(book.judul);
    setFormPenulis(book.penulis);
    setFormKategori(book.kategori);
    setFormHarga(book.harga.toString());
    setFormStok(book.stok.toString());
    setFormStatus(book.status);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul || !formKategori || !formHarga) {
      toast.error("Judul, kategori, dan harga wajib diisi.");
      return;
    }

    const hargaNum = parseInt(formHarga, 10);
    const stokNum = parseInt(formStok, 10) || 0;

    if (editingBook) {
      updateBook(editingBook.id, {
        judul: formJudul,
        penulis: formPenulis || "Tim LPPM UPNVJ",
        kategori: formKategori,
        harga: hargaNum,
        stok: stokNum,
        status: formStatus,
      });
      toast.success("Produk berhasil diperbarui.");
    } else {
      addBook({
        judul: formJudul,
        penulis: formPenulis || "Tim LPPM UPNVJ",
        kategori: formKategori,
        harga: hargaNum,
        stok: stokNum,
        coverUrl: "/books/book-1.webp",
        status: formStatus,
      });
      toast.success("Produk baru berhasil ditambahkan.");
    }

    setIsFormOpen(false);
  };

  const handleToggleArchive = (book: Book) => {
    if (book.status === "published") {
      setProductStatus(book.id, "archived");
      toast.info(`Produk "${book.judul}" telah diarsipkan.`);
    } else {
      setProductStatus(book.id, "published");
      toast.success(`Produk "${book.judul}" kembali dipublikasikan.`);
    }
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
      {/* Header and Top Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Katalog Produk
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Kelola produk yang telah dipublikasikan maupun diarsipkan pada katalog UPNVJ Press.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/admin/produk/draft"
            className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <span>Draft Produk</span>
            <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
              {countDraft}
            </span>
          </Link>

          <Button
            type="button"
            onClick={handleOpenAddModal}
            className="h-10 rounded-lg bg-[#2563eb] px-4 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
          >
            <Plus className="mr-1.5 size-4" />
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:p-6">
        {/* Navigation Tabs (Semua, Published, Archived) */}
        <div className="flex gap-6 border-b border-slate-100 pb-3 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 pb-2 transition-colors ${activeTab === "all"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            Semua
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
              {countPublished + countArchived}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("published")}
            className={`flex items-center gap-2 pb-2 transition-colors ${activeTab === "published"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            Published
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
              {countPublished}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("archived")}
            className={`flex items-center gap-2 pb-2 transition-colors ${activeTab === "archived"
              ? "border-b-2 border-blue-600 font-semibold text-blue-600"
              : "text-slate-500 hover:text-slate-900"
              }`}
          >
            Archived
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
              {countArchived}
            </span>
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        {/* Product Table */}
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
                <th className="pb-3 px-4 font-semibold">STATUS</th>
                <th className="pb-3 px-4 font-semibold">TERAKHIR DIUBAH</th>
                <th className="pb-3 pl-4 text-right font-semibold">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {displayBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Tidak ada produk yang ditemukan.
                  </td>
                </tr>
              ) : (
                displayBooks.map((book) => {
                  const isPublished = book.status === "published";
                  const isArchived = book.status === "archived";

                  return (
                    <tr key={book.id} className="group hover:bg-slate-50/70 transition-colors">
                      {/* Produk: Thumbnail + Title */}
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

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                            <span className="size-1.5 rounded-full bg-emerald-600" />
                            Published
                          </span>
                        ) : isArchived ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-700">
                            <span className="size-1.5 rounded-full bg-amber-600" />
                            Archived
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                            <span className="size-1.5 rounded-full bg-slate-400" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Terakhir Diubah */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {book.terakhirDiubah || "30 Mei 2025"}
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 pl-4 text-right whitespace-nowrap space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditModal(book)}
                          className="h-8 rounded-lg border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          Ubah
                        </Button>

                        {isPublished ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleArchive(book)}
                            className="h-8 rounded-lg border-slate-200 px-3 text-xs text-slate-600 hover:bg-slate-50"
                          >
                            Arsipkan
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleToggleArchive(book)}
                            className="h-8 rounded-lg bg-[#2563eb] px-3 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Publikasikan Kembali
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
          Menampilkan <span className="font-semibold text-slate-800">{displayBooks.length}</span> produk
        </div>
      </div>

      {/* Modal Tambah / Ubah Produk */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {editingBook ? "Ubah Informasi Produk" : "Tambah Produk Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Lengkapi data karya sebelum disimpan atau dipublikasikan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Judul Karya *</label>
              <Input
                placeholder="Masukkan judul buku..."
                value={formJudul}
                onChange={(e) => setFormJudul(e.target.value)}
                className="h-9 rounded-lg border-slate-200 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Penulis</label>
              <Input
                placeholder="Nama penulis karya..."
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
                <label className="font-semibold text-slate-700">Status</label>
                <Select
                  value={formStatus}
                  onValueChange={(val) => setFormStatus(val as ProductStatus)}
                >
                  <SelectTrigger className="h-9 rounded-lg border-slate-200 text-xs">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published" className="text-xs">
                      Published
                    </SelectItem>
                    <SelectItem value="archived" className="text-xs">
                      Archived
                    </SelectItem>
                    <SelectItem value="draft" className="text-xs">
                      Draft
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Harga (Rp) *</label>
                <Input
                  type="number"
                  placeholder="Contoh: 120000"
                  value={formHarga}
                  onChange={(e) => setFormHarga(e.target.value)}
                  className="h-9 rounded-lg border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Stok</label>
                <Input
                  type="number"
                  placeholder="Jumlah stok..."
                  value={formStok}
                  onChange={(e) => setFormStok(e.target.value)}
                  className="h-9 rounded-lg border-slate-200 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

