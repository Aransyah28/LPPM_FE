"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { useSubmissionStore } from "@/stores/submission-store";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PengajuanDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const submissionId = decodeURIComponent(resolvedParams.id);

  const getSubmissionById = useSubmissionStore((state) => state.getSubmissionById);
  const markAsProcessed = useSubmissionStore((state) => state.markAsProcessed);

  const submission = useMemo(() => {
    return getSubmissionById(submissionId);
  }, [getSubmissionById, submissionId]);

  if (!submission) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/pengajuan"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Daftar
        </Link>
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
          Data pengajuan dengan ID &quot;{submissionId}&quot; tidak ditemukan.
        </div>
      </div>
    );
  }

  const handleBuatProduk = () => {
    markAsProcessed(submission.id);
    toast.success(`Pengajuan ${submission.id} siap diproses menjadi produk katalog!`);
    router.push("/admin/produk");
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Back Button and Buat Produk CTA */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/pengajuan"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Daftar
        </Link>

        <Button
          type="button"
          onClick={handleBuatProduk}
          className="h-10 rounded-lg bg-[#2563eb] px-5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99]"
        >
          Buat Produk
        </Button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px]">
        {/* Left Column: Informasi Karya */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h2 className="text-base font-bold text-slate-900">Informasi Karya</h2>
            <p className="text-xs text-slate-500">
              Informasi yang diterima dari formulir pengajuan.
            </p>
          </div>

          <div className="space-y-6 text-xs">
            {/* Nomor Pengajuan */}
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Nomor Pengajuan</span>
              <p className="text-sm font-semibold text-slate-800">{submission.id}</p>
            </div>

            {/* Tanggal Pengajuan */}
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Tanggal Pengajuan</span>
              <p className="text-sm font-semibold text-slate-800">{submission.tanggalPengajuan}</p>
            </div>

            {/* Kategori */}
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Kategori</span>
              <p className="text-sm font-semibold text-slate-800">{submission.kategori}</p>
            </div>

            {/* ISBN */}
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">ISBN</span>
              <p className="text-sm font-semibold text-slate-800">{submission.isbn || "-"}</p>
            </div>

            {/* Tahun Terbit */}
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Tahun Terbit</span>
              <p className="text-sm font-semibold text-slate-800">{submission.tahunTerbit || "-"}</p>
            </div>

            {/* Harga */}
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Harga</span>
              <p className="text-sm font-semibold text-slate-800">
                {submission.harga ? formatRupiah(submission.harga) : "-"}
              </p>
            </div>

            {/* Judul Karya */}
            <div className="space-y-1">
              <span className="text-slate-400 font-medium">Judul Karya</span>
              <p className="text-sm font-semibold text-slate-800 leading-snug">
                {submission.judulKarya}
              </p>
            </div>

            {/* Deskripsi Karya */}
            <div className="space-y-1.5">
              <span className="text-slate-400 font-medium">Deskripsi Karya</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {submission.deskripsi || "-"}
              </p>
            </div>

            {/* Kata Kunci */}
            <div className="space-y-2">
              <span className="text-slate-400 font-medium">Kata Kunci</span>
              <div className="flex flex-wrap gap-2">
                {(submission.kataKunci || []).length > 0 ? (
                  submission.kataKunci?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50/70 px-3 py-1 text-[11px] font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">Tidak ada kata kunci</span>
                )}
              </div>
            </div>

            {/* Daftar Penulis */}
            <div className="space-y-2">
              <span className="text-slate-400 font-medium">Daftar Penulis</span>
              <ul className="space-y-1.5 pl-1">
                {(submission.daftarPenulis || [submission.penulis || "Penulis"]).map((author) => (
                  <li key={author} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="size-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>{author}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Aset yang Dikirim */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Aset yang Dikirim</h3>
              <p className="text-xs text-slate-500">
                {(submission.aset || []).length || 3} berkas dilampirkan pada pengajuan.
              </p>
            </div>

            <div className="space-y-3">
              {(
                submission.aset || [
                  { nama: "Sampul_Depan.png", tipe: "PNG", ukuran: "1.1 MB" },
                  { nama: "Gambar_Produk.png", tipe: "PNG", ukuran: "0.9 MB" },
                  { nama: "Gambar_Produk2.png", tipe: "PNG", ukuran: "0.6 MB" },
                ]
              ).map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FileText className="size-4" />
                    </div>
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {file.nama}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {file.tipe} · {file.ukuran}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      title="Lihat Berkas"
                      onClick={() => toast.info(`Melihat pratinjau ${file.nama}`)}
                      className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-2xs transition-colors"
                    >
                      <Eye className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Unduh Berkas"
                      onClick={() => toast.success(`Mengunduh ${file.nama}`)}
                      className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-2xs transition-colors"
                    >
                      <Download className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
