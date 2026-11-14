"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Address, ForgotPasswordToken, User } from "@/lib/types";

type Result = { ok: boolean; message: string };
type ResetResult = Result & { otp?: string; expiresAt?: string };

type RegisterInput = {
  nama: string;
  email: string;
  password: string;
};

type AuthState = {
  users: User[];
  currentUserId: string | null;
  forgotPasswordToken: ForgotPasswordToken | null;
  register: (payload: RegisterInput) => Result;
  login: (email: string, password: string) => Result;
  loginAdmin: (email: string, password: string) => Result;
  logout: () => void;
  requestPasswordReset: (email: string) => ResetResult;
  verifyOtp: (email: string, otp: string) => Result;
  resetPassword: (email: string, password: string) => Result;
  updateCurrentUserProfile: (payload: { nama: string; email: string }) => Result;
  updateCurrentUserPassword: (password: string) => Result;
  changeAdminPassword: (currentPassword: string, newPassword: string) => Result;
  addAddress: (address: Omit<Address, "id">) => Result;
  updateAddress: (address: Address) => Result;
  removeAddress: (addressId: string) => Result;
  getCurrentUser: () => User | null;
};

function makePasswordHash(password: string): string {
  return `mock_hash:${password}`;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function randomOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const DEFAULT_ADMIN: User = {
  id: "admin-default-id",
  nama: "Admin UPNVJ",
  email: "admin@upnvj.ac.id",
  passwordHashMock: "mock_hash:admin123",
  role: "ADMIN",
  alamatList: [],
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [DEFAULT_ADMIN],
      currentUserId: null,
      forgotPasswordToken: null,
      register: ({ nama, email, password }) => {
        const cleanEmail = normalizeEmail(email);
        const exists = get().users.some((user) => user.email === cleanEmail);

        if (exists) {
          return { ok: false, message: "Email sudah digunakan." };
        }

        const user: User = {
          id: crypto.randomUUID(),
          nama: nama.trim(),
          email: cleanEmail,
          passwordHashMock: makePasswordHash(password),
          role: "PENGGUNA",
          alamatList: [],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          users: [...state.users, user],
          currentUserId: user.id,
        }));

        return { ok: true, message: "Akun berhasil dibuat." };
      },
      login: (email, password) => {
        const cleanEmail = normalizeEmail(email);
        const user = get().users.find(
          (item) =>
            item.email === cleanEmail &&
            item.passwordHashMock === makePasswordHash(password),
        );

        if (!user) {
          return { ok: false, message: "Email atau kata sandi salah." };
        }

        set({ currentUserId: user.id });
        return { ok: true, message: "Login berhasil." };
      },
      loginAdmin: (email, password) => {
        const cleanEmail = normalizeEmail(email);
        let user = get().users.find((item) => item.email === cleanEmail);

        // Fallback default admin if users array was previously initialized without it
        if (!user && cleanEmail === DEFAULT_ADMIN.email) {
          user = DEFAULT_ADMIN;
          set((state) => ({ users: [...state.users, DEFAULT_ADMIN] }));
        }

        if (!user || user.passwordHashMock !== makePasswordHash(password)) {
          return { ok: false, message: "Kredensial admin tidak valid." };
        }

        if (user.role !== "ADMIN") {
          return { ok: false, message: "Akses ditolak: Akun tidak memiliki hak akses admin." };
        }

        set({ currentUserId: user.id });
        return { ok: true, message: "Login admin berhasil." };
      },
      logout: () => set({ currentUserId: null }),
      requestPasswordReset: (email) => {
        const cleanEmail = normalizeEmail(email);
        const user = get().users.find((item) => item.email === cleanEmail);

        if (!user) {
          return { ok: false, message: "Email tidak ditemukan." };
        }

        const otp = randomOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        set({
          forgotPasswordToken: {
            email: cleanEmail,
            otp,
            expiresAt,
            verified: false,
          },
        });
        return {
          ok: true,
          message: "OTP reset kata sandi berhasil dibuat.",
          otp,
          expiresAt,
        };
      },
      verifyOtp: (email, otp) => {
        const cleanEmail = normalizeEmail(email);
        const token = get().forgotPasswordToken;
        if (!token || token.email !== cleanEmail) {
          return { ok: false, message: "Token reset tidak ditemukan." };
        }
        if (new Date(token.expiresAt).getTime() < Date.now()) {
          return { ok: false, message: "OTP sudah kedaluwarsa." };
        }
        if (token.otp !== otp) {
          return { ok: false, message: "OTP tidak valid." };
        }

        set({ forgotPasswordToken: { ...token, verified: true } });
        return { ok: true, message: "OTP valid." };
      },
      resetPassword: (email, password) => {
        const cleanEmail = normalizeEmail(email);
        const token = get().forgotPasswordToken;
        if (!token || token.email !== cleanEmail || !token.verified) {
          return { ok: false, message: "Silakan verifikasi OTP terlebih dulu." };
        }

        set((state) => ({
          users: state.users.map((user) =>
            user.email === cleanEmail
              ? { ...user, passwordHashMock: makePasswordHash(password) }
              : user,
          ),
          forgotPasswordToken: null,
        }));

        return { ok: true, message: "Kata sandi berhasil diperbarui." };
      },
      updateCurrentUserProfile: ({ nama, email }) => {
        const user = get().getCurrentUser();
        if (!user) {
          return { ok: false, message: "Pengguna tidak ditemukan." };
        }

        const cleanEmail = normalizeEmail(email);
        const emailExists = get().users.some(
          (item) => item.email === cleanEmail && item.id !== user.id,
        );

        if (emailExists) {
          return { ok: false, message: "Email sudah digunakan akun lain." };
        }

        set((state) => ({
          users: state.users.map((item) =>
            item.id === user.id
              ? { ...item, nama: nama.trim(), email: cleanEmail }
              : item,
          ),
        }));

        return { ok: true, message: "Profil berhasil diperbarui." };
      },
      updateCurrentUserPassword: (password) => {
        const user = get().getCurrentUser();
        if (!user) {
          return { ok: false, message: "Pengguna tidak ditemukan." };
        }

        set((state) => ({
          users: state.users.map((item) =>
            item.id === user.id
              ? { ...item, passwordHashMock: makePasswordHash(password) }
              : item,
          ),
        }));

        return { ok: true, message: "Kata sandi berhasil diperbarui." };
      },
      changeAdminPassword: (currentPassword, newPassword) => {
        const user = get().getCurrentUser();
        if (!user) {
          return { ok: false, message: "Pengguna tidak ditemukan." };
        }
        if (user.role !== "ADMIN") {
          return { ok: false, message: "Hanya admin yang dapat mengubah password di sini." };
        }
        if (user.passwordHashMock !== makePasswordHash(currentPassword)) {
          return { ok: false, message: "Password saat ini salah." };
        }

        set((state) => ({
          users: state.users.map((item) =>
            item.id === user.id
              ? { ...item, passwordHashMock: makePasswordHash(newPassword) }
              : item,
          ),
        }));

        return { ok: true, message: "Password berhasil diperbarui." };
      },
      addAddress: (address) => {
        const user = get().getCurrentUser();
        if (!user) return { ok: false, message: "Pengguna tidak ditemukan." };
        const currentList = user.alamatList ?? [];
        if (currentList.length >= 5) {
          return { ok: false, message: "Maksimal 5 alamat tersimpan." };
        }

        const newAddress: Address = { ...address, id: crypto.randomUUID() };
        set((state) => ({
          users: state.users.map((item) =>
            item.id === user.id
              ? { ...item, alamatList: [...(item.alamatList ?? []), newAddress] }
              : item,
          ),
        }));

        return { ok: true, message: "Alamat berhasil ditambahkan." };
      },
      updateAddress: (address) => {
        const user = get().getCurrentUser();
        if (!user) return { ok: false, message: "Pengguna tidak ditemukan." };

        set((state) => ({
          users: state.users.map((item) =>
            item.id === user.id
              ? {
                  ...item,
                  alamatList: (item.alamatList ?? []).map((a) =>
                    a.id === address.id ? address : a,
                  ),
                }
              : item,
          ),
        }));

        return { ok: true, message: "Alamat berhasil diperbarui." };
      },
      removeAddress: (addressId) => {
        const user = get().getCurrentUser();
        if (!user) return { ok: false, message: "Pengguna tidak ditemukan." };

        set((state) => ({
          users: state.users.map((item) =>
            item.id === user.id
              ? {
                  ...item,
                  alamatList: (item.alamatList ?? []).filter((a) => a.id !== addressId),
                }
              : item,
          ),
        }));

        return { ok: true, message: "Alamat berhasil dihapus." };
      },
      getCurrentUser: () => {
        const state = get();
        if (!state.currentUserId) return null;
        return state.users.find((user) => user.id === state.currentUserId) ?? null;
      },
    }),
    {
      name: "lppm-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
