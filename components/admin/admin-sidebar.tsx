"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FolderTree,
  LayoutDashboard,
  Library,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const currentUser = getCurrentUser();

  const [isKatalogOpen, setIsKatalogOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col border-r border-slate-200/80 bg-white select-none shrink-0",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BookOpen className="size-5" />
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-bold text-slate-900">UPNVJ Press</h1>
            <p className="text-[11px] text-slate-500">Admin E-Commerce</p>
          </div>
        </div>
        <button
          type="button"
          className="text-slate-400 hover:text-slate-600"
          aria-label="Toggle Collapse"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Dashboard */}
        <Link
          href="/admin/pengajuan"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
            pathname === "/admin/dashboard"
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>

        {/* Katalog & Publikasi Section */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsKatalogOpen(!isKatalogOpen)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <Library className="size-4 text-slate-600" />
              <span>Katalog & Publikasi</span>
            </div>
            {isKatalogOpen ? (
              <ChevronDown className="size-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="size-3.5 text-slate-400" />
            )}
          </button>

          {isKatalogOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-slate-100 pl-3">
              <Link
                href="/admin/pengajuan"
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors",
                  pathname === "/admin/pengajuan"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <BookOpen className="size-3.5" />
                Pengajuan Publish
              </Link>

              <Link
                href="/admin/produk"
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors",
                  pathname === "/admin/produk"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Package className="size-3.5" />
                Kelola Produk
              </Link>

              <Link
                href="/admin/kategori"
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors",
                  pathname === "/admin/kategori"
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <FolderTree className="size-3.5" />
                Kelola Kategori
              </Link>
            </div>
          )}
        </div>

        {/* Other Sections */}
        <div className="pt-2 space-y-1">
          <Link
            href="/admin/pesanan"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              pathname === "/admin/pesanan"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <ShoppingCart className="size-4" />
            Pesanan
          </Link>

          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 cursor-not-allowed"
          >
            <TrendingUp className="size-4" />
            Laporan
          </Link>
        </div>
      </div>

      {/* User Footer Profile & Settings/Logout */}
      <div className="border-t border-slate-100 p-3 space-y-1">
        {/* Profile Card */}
        <div className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-slate-50">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
            AU
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-semibold text-slate-900">
              {currentUser?.nama || "Admin UPNVJ"}
            </p>
            <p className="truncate text-[11px] text-slate-400">
              {currentUser?.email || "admin@upnvj.ac.id"}
            </p>
          </div>
        </div>

        {/* Pengaturan */}
        <Link
          href="/admin/pengaturan"
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-xs font-medium transition-colors",
            pathname === "/admin/pengaturan"
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Settings className="size-4 text-slate-500" />
          Pengaturan
        </Link>

        {/* Keluar */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="size-4 text-rose-600" />
          Keluar
        </button>
      </div>
    </aside>
  );
}

