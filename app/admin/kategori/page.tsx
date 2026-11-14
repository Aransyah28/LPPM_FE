"use client";

import { useMemo, useState } from "react";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCatalogStore } from "@/stores/catalog-store";
import type { Category } from "@/lib/types";

export default function KelolaKategoriPage() {
  const categories = useCatalogStore((state) => state.categories);
  const addCategory = useCatalogStore((state) => state.addCategory);
  const updateCategory = useCatalogStore((state) => state.updateCategory);
  const deleteCategory = useCatalogStore((state) => state.deleteCategory);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [namaKategori, setNamaKategori] = useState("");
  const [deskripsiKategori, setDeskripsiKategori] = useState("");

  // Delete confirmation dialog
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) =>
        c.nama.toLowerCase().includes(q) ||
        c.deskripsi.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setNamaKategori("");
    setDeskripsiKategori("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setNamaKategori(cat.nama);
    setDeskripsiKategori(cat.deskripsi);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKategori.trim()) {
      toast.error("Nama kategori wajib diisi.");
      return;
    }

    if (editingCategory) {
      const res = updateCategory(editingCategory.id, {
        nama: namaKategori.trim(),
        deskripsi: deskripsiKategori.trim(),
      });
      if (res.ok) toast.success(res.message);
    } else {
      const res = addCategory({
        nama: namaKategori.trim(),
        deskripsi: deskripsiKategori.trim(),
      });
      if (!res.ok) {
        toast.error(res.message);
        return;
      }
      toast.success(res.message);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingCategory) return;
    const res = deleteCategory(deletingCategory.id);
    if (!res.ok) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
    setDeletingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Kelola Kategori
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Kelola master kategori yang digunakan pada seluruh produk UPNVJ Press.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAddModal}
          className="h-10 self-start sm:self-auto rounded-lg bg-[#2563eb] px-4 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
        >
          <Plus className="mr-1.5 size-4" />
          Tambah Kategori
        </Button>
      </div>

      {/* Main Table Card Container */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:p-6">
        {/* Search & Counter Toolbar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nama kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-lg border-slate-200 bg-white pl-9 text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
            />
          </div>

          <div className="text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{filteredCategories.length}</span> kategori
          </div>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pr-4 font-semibold w-1/4">NAMA KATEGORI</th>
                <th className="pb-3 px-4 font-semibold w-1/2">DESKRIPSI</th>
                <th className="pb-3 pl-4 text-right font-semibold w-1/4">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-slate-400">
                    Tidak ada kategori yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-4 font-semibold text-slate-800 whitespace-nowrap">
                      {cat.nama}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {cat.deskripsi || "-"}
                    </td>
                    <td className="py-3.5 pl-4 text-right whitespace-nowrap space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditModal(cat)}
                        className="h-8 rounded-lg border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        Ubah
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingCategory(cat)}
                        className="h-8 rounded-lg border-slate-200 px-3 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200"
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Kategori */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {editingCategory ? "Ubah Kategori" : "Tambah Kategori Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kategori ini akan digunakan sebagai pengelompokan karya publikasi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCategory} className="space-y-4 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nama Kategori *</label>
              <Input
                placeholder="Contoh: Hukum, Sains, Bisnis..."
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
                className="h-9 rounded-lg border-slate-200 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Deskripsi</label>
              <Input
                placeholder="Penjelasan singkat mengenai kategori ini..."
                value={deskripsiKategori}
                onChange={(e) => setDeskripsiKategori(e.target.value)}
                className="h-9 rounded-lg border-slate-200 text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
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

      {/* Alert Dialog Konfirmasi Hapus Kategori */}
      <AlertDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900">
              Hapus Kategori?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              Apakah Anda yakin ingin menghapus kategori &quot;{deletingCategory?.nama}&quot;? Kategori yang sedang digunakan oleh buku di katalog tidak dapat dihapus demi konsistensi data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg text-xs">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-lg bg-rose-600 text-xs font-semibold text-white hover:bg-rose-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

