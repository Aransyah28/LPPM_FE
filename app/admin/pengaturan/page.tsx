"use client";

import { useState } from "react";
import { Check, Circle } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

export default function PengaturanPage() {
  const changeAdminPassword = useAuthStore((s) => s.changeAdminPassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Masukkan password saat ini.");
      return;
    }

    if (!hasMinLength || !hasUpperLower || !hasNumber) {
      toast.error("Password baru belum memenuhi semua ketentuan keamanan.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);

    const result = changeAdminPassword(currentPassword, newPassword);

    if (result.ok) {
      toast.success(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-xs text-slate-500 sm:text-sm">
          Kelola keamanan akun admin Anda dengan memperbarui password secara
          berkala.
        </p>
      </div>

      {/* Change Password Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Ganti Password
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">
            Masukkan password saat ini dan buat password baru yang memenuhi
            ketentuan keamanan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
          {/* Current Password */}
          <div className="space-y-2">
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password Saat Ini
            </label>
            <PasswordInput
              id="current-password"
              placeholder="Masukkan password saat ini"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              onClick={() =>
                toast.info(
                  "Fitur lupa password admin akan tersedia di versi mendatang.",
                )
              }
            >
              Lupa Password?
            </button>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password Baru
            </label>
            <PasswordInput
              id="new-password"
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {/* Validation indicators */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              <PasswordRule met={hasMinLength} label="Minimal 8 karakter" />
              <PasswordRule met={hasUpperLower} label="Huruf besar & kecil" />
              <PasswordRule met={hasNumber} label="Minimal 1 angka" />
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Konfirmasi Password Baru
            </label>
            <PasswordInput
              id="confirm-password"
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="rounded-md bg-blue-600 px-8 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Small helper component ─── */

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${met ? "text-green-600" : "text-gray-400"
        }`}
    >
      {met ? (
        <Check className="size-3" />
      ) : (
        <Circle className="size-3" />
      )}
      {label}
    </span>
  );
}
