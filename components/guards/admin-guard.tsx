"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore } from "@/stores/auth-store";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const getCurrentUser = useAuthStore((state) => state.getCurrentUser);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (hydrated) {
      if (!currentUser || currentUser.role !== "ADMIN") {
        router.replace("/admin/login");
      }
    }
  }, [currentUser, hydrated, router]);

  if (!hydrated || !currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Memverifikasi sesi admin...
      </div>
    );
  }

  return <>{children}</>;
}

