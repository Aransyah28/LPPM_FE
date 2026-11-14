"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/lib/format";
import { useOrderStore } from "@/stores/order-store";
import type { OrderStatus } from "@/lib/types";

const STATUS_MAP: Record<
  string,
  { label: string; dot: string; bg: string; text: string }
> = {
  menunggu_pembayaran: {
    label: "Menunggu Pembayaran",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  pending_payment: {
    label: "Menunggu Pembayaran",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  menunggu_pengiriman: {
    label: "Menunggu Pengiriman",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  paid: {
    label: "Menunggu Pengiriman",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  sedang_dikirim: {
    label: "Sedang Dikirim",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  selesai: {
    label: "Selesai",
    dot: "bg-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  gagal: {
    label: "Gagal",
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
};

const ITEMS_PER_PAGE = 5;

export default function AdminPesananPage() {
  const orders = useOrderStore((state) => state.orders);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchId = order.id.toLowerCase().includes(q);
        const matchName = order.customerName?.toLowerCase().includes(q);
        const matchProduct = order.firstProductTitle?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchProduct) return false;
      }

      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) return false;

      // Date filter
      if (startDate || endDate) {
        const orderDate = new Date(order.createdAt).getTime();
        if (startDate) {
          const start = new Date(startDate).setHours(0, 0, 0, 0);
          if (orderDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate).setHours(23, 59, 59, 999);
          if (orderDate > end) return false;
        }
      }

      return true;
    });
  }, [orders, searchQuery, statusFilter, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE));
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleResetFilter = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const formatOrderDate = (isoStr: string) => {
    const d = new Date(isoStr);
    const day = String(d.getDate()).padStart(2, "0");
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatOrderTime = (isoStr: string) => {
    const d = new Date(isoStr);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m} WIB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Pesanan
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Pantau pembayaran dan pengiriman pesanan. Seluruh status diperbarui otomatis oleh Midtrans dan layanan ekspedisi.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-md border-slate-200 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 self-start sm:self-auto"
        >
          <Eye className="mr-1.5 size-3.5 text-slate-500" />
          Mode pemantauan
        </Button>
      </div>

      {/* Filter Bar Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] sm:p-6">
        {/* Filter Controls */}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nomor, pembeli, atau produk..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 rounded-md border-slate-200 bg-white pl-9 text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
            />
          </div>

          {/* Status, Date Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-500 shrink-0">Status</label>
              <Select
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val ?? "all");
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-[160px] rounded-md border-slate-200 bg-white text-xs">
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="menunggu_pembayaran">Menunggu Pembayaran</SelectItem>
                  <SelectItem value="menunggu_pengiriman">Menunggu Pengiriman</SelectItem>
                  <SelectItem value="sedang_dikirim">Sedang Dikirim</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="gagal">Gagal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-500 shrink-0">Dari tanggal</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 rounded-md border-slate-200 bg-white px-2.5 text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-500 shrink-0">Sampai tanggal</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 rounded-md border-slate-200 bg-white px-2.5 text-xs"
              />
            </div>

            {(searchQuery || statusFilter !== "all" || startDate || endDate) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilter}
                className="h-9 text-xs text-slate-500 hover:text-slate-800"
              >
                <RotateCcw className="mr-1 size-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pr-4 font-semibold">Nomor Pesanan</th>
                <th className="pb-3 px-4 font-semibold">Tanggal &amp; Waktu</th>
                <th className="pb-3 px-4 font-semibold">Pembeli</th>
                <th className="pb-3 px-4 font-semibold">Produk</th>
                <th className="pb-3 px-4 font-semibold text-center">Jumlah</th>
                <th className="pb-3 px-4 font-semibold">Total Pembayaran</th>
                <th className="pb-3 px-4 font-semibold">Status</th>
                <th className="pb-3 pl-4 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada pesanan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.selesai;
                  const totalItems = order.items.reduce((sum, i) => sum + i.qty, 0);

                  return (
                    <tr
                      key={order.id}
                      className="group hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Nomor Pesanan */}
                      <td className="py-3.5 pr-4 font-semibold text-blue-600 whitespace-nowrap">
                        {order.id}
                      </td>

                      {/* Tanggal & Waktu */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">
                          {formatOrderDate(order.createdAt)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {formatOrderTime(order.createdAt)}
                        </div>
                      </td>

                      {/* Pembeli */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-slate-800 font-medium">
                          {order.customerName || order.address?.namaPenerima || "—"}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                          {order.customerEmail || "—"}
                        </div>
                      </td>

                      {/* Produk */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="font-medium text-slate-800 truncate">
                          {order.firstProductTitle ||
                            `Produk #${order.items[0]?.bookId || "?"}`}
                        </div>
                        {(order.otherProductsCount ?? 0) > 0 && (
                          <div className="text-[11px] text-slate-400">
                            +{order.otherProductsCount} produk lainnya
                          </div>
                        )}
                      </td>

                      {/* Jumlah */}
                      <td className="py-3.5 px-4 text-center font-medium text-slate-800">
                        {totalItems}
                      </td>

                      {/* Total Pembayaran */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {formatRupiah(order.total)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${statusInfo.dot}`}
                          />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-md border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-50"
                          onClick={() => { }}
                        >
                          Lihat Detail
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <p>
            Menampilkan{" "}
            <span className="font-semibold text-slate-800">
              {paginatedOrders.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-slate-800">
              {filteredOrders.length}
            </span>{" "}
            pesanan
          </p>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 rounded-md border-slate-200 px-2.5 text-xs"
            >
              <ChevronLeft className="size-3.5" />
              Sebelumnya
            </Button>

            <span className="text-xs font-medium text-slate-700">
              Halaman {currentPage} dari {totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 rounded-md border-slate-200 px-2.5 text-xs"
            >
              Berikutnya
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

