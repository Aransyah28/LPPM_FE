"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Address, CartItem, Order, PaymentMethod } from "@/lib/types";

type OrderState = {
  orders: Order[];
  checkoutAddress: Address | null;
  selectedPaymentMethod: PaymentMethod | null;
  setCheckoutAddress: (address: Address) => void;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;
  createPendingOrder: (payload: {
    items: CartItem[];
    paymentMethod: PaymentMethod;
  }) => Order | null;
  markOrderPaid: (orderId: string) => void;
  clearCheckout: () => void;
  getOrderById: (orderId: string) => Order | undefined;
};

const BIAYA_LAYANAN = 4000;

function generateVANumber(method: PaymentMethod): string {
  const prefix = method === "BCA_VA" ? "014" : method === "BNI_VA" ? "009" : "002";
  const random = Math.floor(100000000 + Math.random() * 900000000).toString();
  return `${prefix}${random}`;
}

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2025-1058",
    items: [
      { bookId: "1", qty: 1, hargaSnapshot: 125000 },
      { bookId: "2", qty: 1, hargaSnapshot: 108000 },
    ],
    subtotal: 233000,
    biayaLayanan: 4000,
    total: 237000,
    address: {
      id: "addr-1",
      namaPenerima: "Nadia Puspitasari",
      telepon: "081234567890",
      alamatLengkap: "Jl. Fatmawati No. 45, Cilandak",
      provinsi: "DKI Jakarta",
      kota: "Jakarta Selatan",
      kodePos: "12430",
    },
    paymentMethod: "BCA_VA",
    vaNumber: "014982736152",
    status: "menunggu_pembayaran",
    createdAt: "2025-06-08T09:14:00Z",
    customerName: "Nadia Puspitasari",
    customerEmail: "nadia.puspitasari@example.com",
    firstProductTitle: "Transformasi Digital dalam Pengelolaan Pergu...",
    otherProductsCount: 1,
  },
  {
    id: "ORD-2025-1057",
    items: [
      { bookId: "1", qty: 2, hargaSnapshot: 148000 },
    ],
    subtotal: 296000,
    biayaLayanan: 0,
    total: 296000,
    address: {
      id: "addr-2",
      namaPenerima: "Rizky Maulana",
      telepon: "081298765432",
      alamatLengkap: "Jl. Margonda Raya No. 100",
      provinsi: "Jawa Barat",
      kota: "Depok",
      kodePos: "16424",
    },
    paymentMethod: "BNI_VA",
    vaNumber: "009182736451",
    status: "menunggu_pengiriman",
    createdAt: "2025-06-07T14:32:00Z",
    customerName: "Rizky Maulana",
    customerEmail: "rizky.maulana@example.com",
    firstProductTitle: "Hukum Siber dan Perlindungan Data Pribadi di...",
    otherProductsCount: 0,
  },
  {
    id: "ORD-2025-1056",
    items: [
      { bookId: "3", qty: 1, hargaSnapshot: 112000 },
    ],
    subtotal: 112000,
    biayaLayanan: 0,
    total: 112000,
    address: {
      id: "addr-3",
      namaPenerima: "Siti Rahmawati",
      telepon: "085712349876",
      alamatLengkap: "Komplek Dosen UPN Pondok Labu",
      provinsi: "DKI Jakarta",
      kota: "Jakarta Selatan",
      kodePos: "12450",
    },
    paymentMethod: "BRI_VA",
    vaNumber: "002876543219",
    status: "sedang_dikirim",
    createdAt: "2025-06-06T10:18:00Z",
    customerName: "Siti Rahmawati",
    customerEmail: "siti.rahmawati@example.com",
    firstProductTitle: "Pengantar Ekonomi Kreatif dan Kewirausahaa...",
    otherProductsCount: 0,
  },
  {
    id: "ORD-2025-1055",
    items: [
      { bookId: "1", qty: 1, hargaSnapshot: 135000 },
      { bookId: "2", qty: 1, hargaSnapshot: 138000 },
    ],
    subtotal: 273000,
    biayaLayanan: 0,
    total: 273000,
    address: {
      id: "addr-4",
      namaPenerima: "Bima Aditya",
      telepon: "081399887766",
      alamatLengkap: "Jl. Cinere Raya No. 12",
      provinsi: "Jawa Barat",
      kota: "Depok",
      kodePos: "16514",
    },
    paymentMethod: "BCA_VA",
    vaNumber: "014765432198",
    status: "selesai",
    createdAt: "2025-06-04T08:45:00Z",
    customerName: "Bima Aditya",
    customerEmail: "bima.aditya@example.com",
    firstProductTitle: "Transformasi Digital dalam Pengelolaan Pergu...",
    otherProductsCount: 1,
  },
  {
    id: "ORD-2025-1054",
    items: [
      { bookId: "1", qty: 1, hargaSnapshot: 148000 },
    ],
    subtotal: 148000,
    biayaLayanan: 0,
    total: 148000,
    address: {
      id: "addr-5",
      namaPenerima: "Dewi Lestari",
      telepon: "087812345678",
      alamatLengkap: "Jl. RS Fatmawati Kav. 1",
      provinsi: "DKI Jakarta",
      kota: "Jakarta Selatan",
      kodePos: "12430",
    },
    paymentMethod: "BNI_VA",
    vaNumber: "009654321987",
    status: "gagal",
    createdAt: "2025-06-03T17:05:00Z",
    customerName: "Dewi Lestari",
    customerEmail: "dewi.lestari@example.com",
    firstProductTitle: "Hukum Siber dan Perlindungan Data Pribadi di...",
    otherProductsCount: 0,
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_MOCK_ORDERS,
      checkoutAddress: null,
      selectedPaymentMethod: null,
      setCheckoutAddress: (address) => set({ checkoutAddress: address }),
      setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
      createPendingOrder: ({ items, paymentMethod }) => {
        const address = get().checkoutAddress;
        if (!address || items.length === 0) return null;

        const subtotal = items.reduce(
          (total, item) => total + item.hargaSnapshot * item.qty,
          0,
        );
        const total = subtotal + BIAYA_LAYANAN;

        const order: Order = {
          id: `ORD-${Date.now()}`,
          items,
          subtotal,
          biayaLayanan: BIAYA_LAYANAN,
          total,
          address,
          paymentMethod,
          vaNumber: generateVANumber(paymentMethod),
          status: "pending_payment",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [order, ...state.orders],
        }));

        return order;
      },
      markOrderPaid: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: "paid" } : order,
          ),
        }));
      },
      clearCheckout: () =>
        set({
          checkoutAddress: null,
          selectedPaymentMethod: null,
        }),
      getOrderById: (orderId) => get().orders.find((order) => order.id === orderId),
    }),
    {
      name: "lppm-order-v2",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
