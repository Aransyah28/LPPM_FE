"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { BOOK_LIST, CATEGORY_LIST } from "@/lib/mock-content";
import type { Book, Category, ProductStatus } from "@/lib/types";

type CatalogState = {
  books: Book[];
  categories: Category[];
  getBookById: (bookId: string) => Book | undefined;
  getPublishedBooks: () => Book[];
  addBook: (book: Omit<Book, "id">) => { ok: boolean; message: string; book?: Book };
  updateBook: (id: string, updates: Partial<Book>) => { ok: boolean; message: string };
  setProductStatus: (id: string, status: ProductStatus) => void;
  deleteBook: (id: string) => void;
  // Category management
  addCategory: (category: Omit<Category, "id">) => { ok: boolean; message: string };
  updateCategory: (id: string, updates: Partial<Category>) => { ok: boolean; message: string };
  deleteCategory: (id: string) => { ok: boolean; message: string };
};

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set, get) => ({
      books: BOOK_LIST,
      categories: CATEGORY_LIST,

      getBookById: (bookId) => get().books.find((book) => book.id === bookId),

      // Only published books are visible to consumer shop
      getPublishedBooks: () =>
        get().books.filter((b) => b.status === "published"),

      addBook: (payload) => {
        const id = `book-${Date.now()}`;
        const newBook: Book = {
          ...payload,
          id,
          terakhirDiubah: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };

        set((state) => ({ books: [newBook, ...state.books] }));
        return { ok: true, message: "Produk berhasil ditambahkan.", book: newBook };
      },

      updateBook: (id, updates) => {
        const exists = get().books.some((b) => b.id === id);
        if (!exists) return { ok: false, message: "Buku tidak ditemukan." };

        set((state) => ({
          books: state.books.map((b) =>
            b.id === id
              ? {
                  ...b,
                  ...updates,
                  terakhirDiubah: new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                }
              : b
          ),
        }));

        return { ok: true, message: "Produk berhasil diperbarui." };
      },

      setProductStatus: (id, status) => {
        set((state) => ({
          books: state.books.map((b) =>
            b.id === id
              ? {
                  ...b,
                  status,
                  terakhirDiubah: new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }),
                }
              : b
          ),
        }));
      },

      deleteBook: (id) => {
        set((state) => ({
          books: state.books.filter((b) => b.id !== id),
        }));
      },

      addCategory: (payload) => {
        const id = `cat-${Date.now()}`;
        const cleanName = payload.nama.trim();
        const exists = get().categories.some(
          (c) => c.nama.toLowerCase() === cleanName.toLowerCase()
        );

        if (exists) {
          return { ok: false, message: "Kategori dengan nama tersebut sudah ada." };
        }

        const newCategory: Category = {
          id,
          nama: cleanName,
          deskripsi: payload.deskripsi.trim(),
        };

        set((state) => ({ categories: [...state.categories, newCategory] }));
        return { ok: true, message: "Kategori berhasil ditambahkan." };
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
        return { ok: true, message: "Kategori berhasil diperbarui." };
      },

      deleteCategory: (id) => {
        const cat = get().categories.find((c) => c.id === id);
        if (!cat) return { ok: false, message: "Kategori tidak ditemukan." };

        // Check if category is currently used by any book
        const isUsed = get().books.some((b) => b.kategori === cat.nama);
        if (isUsed) {
          return {
            ok: false,
            message: `Kategori "${cat.nama}" sedang digunakan oleh produk katalog.`,
          };
        }

        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
        return { ok: true, message: "Kategori berhasil dihapus." };
      },
    }),
    {
      name: "lppm-catalog-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
