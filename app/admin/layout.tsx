"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/guards/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If on login page, render clean page without AdminGuard & Sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const getBreadcrumb = () => {
    if (pathname.includes("/admin/pengajuan/")) {
      return (
        <div className="flex items-center gap-2">
          <Link href="/admin/pengajuan" className="text-slate-400 hover:text-slate-700 transition-colors">
            Katalog & Publikasi
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/admin/pengajuan" className="text-slate-400 hover:text-slate-700 transition-colors">
            Pengajuan Publish
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">Detail</span>
        </div>
      );
    }
    if (pathname.includes("/admin/produk/ubah")) {
      return (
        <div className="flex items-center gap-2">
          <Link href="/admin/produk" className="text-slate-400 hover:text-slate-700 transition-colors">
            Katalog & Publikasi
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/admin/produk" className="text-slate-400 hover:text-slate-700 transition-colors">
            Kelola Produk
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">Ubah Produk</span>
        </div>
      );
    }
    if (pathname === "/admin/produk/buat") {
      return (
        <div className="flex items-center gap-2">
          <Link href="/admin/produk" className="text-slate-400 hover:text-slate-700 transition-colors">
            Katalog & Publikasi
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/admin/produk" className="text-slate-400 hover:text-slate-700 transition-colors">
            Kelola Produk
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">Buat Produk</span>
        </div>
      );
    }
    if (pathname === "/admin/produk/draft") {
      return (
        <div className="flex items-center gap-2">
          <Link href="/admin/produk" className="text-slate-400 hover:text-slate-700 transition-colors">
            Katalog & Publikasi
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/admin/produk" className="text-slate-400 hover:text-slate-700 transition-colors">
            Kelola Produk
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">Draft Produk</span>
        </div>
      );
    }
    if (pathname.includes("/admin/produk")) {
      return (
        <div className="flex items-center gap-2">
          <Link href="/admin/produk" className="text-slate-400 hover:text-slate-700 transition-colors">
            Katalog & Publikasi
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">Kelola Produk</span>
        </div>
      );
    }
    if (pathname.includes("/admin/kategori")) {
      return (
        <div className="flex items-center gap-2">
          <Link href="/admin/kategori" className="text-slate-400 hover:text-slate-700 transition-colors">
            Katalog & Publikasi
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">Kelola Kategori</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Link href="/admin/pengajuan" className="text-slate-400 hover:text-slate-700 transition-colors">
          Katalog & Publikasi
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-800">Pengajuan Publish</span>
      </div>
    );
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#f8fafc]">
        {/* Fixed/Sticky Admin Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6 sm:px-8">
            <div className="text-xs text-slate-500">
              {getBreadcrumb()}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                aria-label="Notifikasi"
              >
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>
            </div>
          </header>

          {/* Dynamic Page Body */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}

