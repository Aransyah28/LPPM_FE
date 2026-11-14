"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  PlusCircle,
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
import { useSubmissionStore } from "@/stores/submission-store";
import type { PublishSubmission } from "@/lib/types";

export default function PengajuanPublishPage() {
  const submissions = useSubmissionStore((state) => state.submissions);
  const markAsProcessed = useSubmissionStore((state) => state.markAsProcessed);

  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<PublishSubmission | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Helper to parse dates like "28 Mei 2025" or ISO strings
  const parseIndonesianDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    const months: Record<string, number> = {
      jan: 0, januari: 0,
      feb: 1, februari: 1,
      mar: 2, maret: 2,
      apr: 3, april: 3,
      mei: 4, may: 4,
      jun: 5, juni: 5,
      jul: 6, juli: 6,
      agu: 7, agustus: 7, aug: 7,
      sep: 8, september: 8,
      okt: 9, oktober: 9, oct: 9,
      nov: 10, november: 10,
      des: 11, desember: 11, dec: 11,
    };

    const parts = dateStr.trim().split(" ");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthStr = parts[1].toLowerCase();
      const year = parseInt(parts[2], 10);
      const month = months[monthStr] ?? 0;
      return new Date(year, month, day).getTime();
    }

    const parsed = new Date(dateStr).getTime();
    return isNaN(parsed) ? 0 : parsed;
  };

  // Filter Submissions
  const filteredSubmissions = useMemo(() => {
    const startTimestamp = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const endTimestamp = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    return submissions.filter((item) => {
      const matchQuery =
        !searchQuery ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.judulKarya.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchQuery) return false;

      if (startTimestamp || endTimestamp) {
        const itemTime = parseIndonesianDate(item.tanggalPengajuan);
        if (startTimestamp && itemTime < startTimestamp) return false;
        if (endTimestamp && itemTime > endTimestamp) return false;
      }

      return true;
    });
  }, [submissions, searchQuery, startDate, endDate]);

  const handleResetFilter = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const handleOpenDetail = (submission: PublishSubmission) => {
    setSelectedSubmission(submission);
    setIsDetailOpen(true);
  };

  const handleBuatProduk = (submission: PublishSubmission) => {
    markAsProcessed(submission.id);
    toast.success(`Pengajuan ${submission.id} siap diproses menjadi draft produk!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Pengajuan Publish
        </h1>
        <p className="text-xs text-slate-500 sm:text-sm">
          Daftar pengajuan publish yang diterima dari tim LPPM. Admin memeriksa informasi dan aset pengajuan sebelum membuat produk untuk ditampilkan dalam katalog.
        </p>
      </div>

      {/* Main Table Card Container */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:p-6">
        {/* Filters Toolbar */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nomor atau judul karya..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-lg border-slate-200 bg-white pl-9 text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
            />
          </div>

          {/* Date Filter Range & Reset */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Dari</span>
              <div className="relative">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 rounded-lg border-slate-200 bg-white px-3 text-xs text-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Sampai</span>
              <div className="relative">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-10 rounded-lg border-slate-200 bg-white px-3 text-xs text-slate-700"
                />
              </div>
            </div>

            {(searchQuery || startDate || endDate) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilter}
                className="h-10 text-xs text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="mr-1.5 size-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pr-4 font-semibold">Nomor Pengajuan</th>
                <th className="pb-3 px-4 font-semibold">Judul Karya</th>
                <th className="pb-3 px-4 font-semibold">Kategori</th>
                <th className="pb-3 px-4 font-semibold">Tanggal Pengajuan</th>
                <th className="pb-3 pl-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    Tidak ada data pengajuan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-4 font-semibold text-slate-800 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs md:max-w-sm truncate">
                      {item.judulKarya}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {item.kategori}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {item.tanggalPengajuan}
                    </td>
                    <td className="py-3.5 pl-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        href={`/admin/pengajuan/${item.id}`}
                        className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Lihat Detail
                      </Link>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleBuatProduk(item)}
                        className="h-8 rounded-lg bg-[#2563eb] px-3 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Buat Produk
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <p>
            Menampilkan <span className="font-semibold text-slate-800">{filteredSubmissions.length}</span> dari{" "}
            <span className="font-semibold text-slate-800">{submissions.length}</span> pengajuan
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled
              className="h-8 rounded-lg border-slate-200 px-2.5 text-xs text-slate-400"
            >
              <ChevronLeft className="mr-1 size-3.5" />
              Sebelumnya
            </Button>
            <span className="px-2 font-medium text-slate-600">Halaman 1 dari 1</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled
              className="h-8 rounded-lg border-slate-200 px-2.5 text-xs text-slate-400"
            >
              Berikutnya
              <ChevronRight className="ml-1 size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Detail Pengajuan */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Detail Pengajuan Publikasi
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              ID Pengajuan: {selectedSubmission?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-500">Judul Karya:</span>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedSubmission.judulKarya}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-semibold text-slate-500">Penulis:</span>
                  <p className="text-slate-800 font-medium">{selectedSubmission.penulis || "Tim Riset LPPM"}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">Kategori:</span>
                  <p className="text-slate-800 font-medium">{selectedSubmission.kategori}</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-500">Tanggal Pengajuan:</span>
                <p className="text-slate-800 font-medium">{selectedSubmission.tanggalPengajuan}</p>
              </div>

              <div className="rounded-lg bg-blue-50/60 p-3 text-slate-700">
                <p className="font-semibold text-blue-900">Catatan Editorial LPPM:</p>
                <p className="mt-0.5 text-blue-700">
                  Naskah telah lolos proses editorial dan peer-review internal. Aset cover dan naskah PDF telah diverifikasi kelengkapannya.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDetailOpen(false)}
              className="rounded-lg text-xs"
            >
              Tutup
            </Button>
            {selectedSubmission && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  handleBuatProduk(selectedSubmission);
                  setIsDetailOpen(false);
                }}
                className="rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Lanjutkan Buat Produk
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

