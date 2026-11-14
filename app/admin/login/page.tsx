"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AdminGuestGuard } from "@/components/guards/admin-guest-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuthStore } from "@/stores/auth-store";

const adminLoginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const loginAdmin = useAuthStore((state) => state.loginAdmin);

  const form = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: AdminLoginInput) => {
    const result = loginAdmin(values.email, values.password);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Login berhasil. Selamat datang di Panel Admin.");
    router.push("/admin/pengajuan");
  };

  return (
    <AdminGuestGuard>
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f8fafc] p-4 sm:p-6">
        <Card className="w-full max-w-[430px] rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)]">
          <CardContent className="space-y-6 p-6 sm:p-8">
            {/* Header: Logo & Subtitle */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen className="size-6 stroke-[1.8]" />
              </div>
              <div className="leading-tight">
                <h2 className="text-base font-bold text-slate-900">UPNVJ Press</h2>
                <p className="text-xs text-slate-500">Admin E-Commerce</p>
              </div>
            </div>

            {/* Title & Instructions */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Login Admin
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Masuk untuk mengelola katalog dan publikasi.
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-xs font-semibold text-slate-800">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="nama@upnvj.ac.id"
                          className="h-10 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-semibold text-slate-800">
                          Password
                        </FormLabel>
                        <Link
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            toast.info("Hubungi Administrator LPPM untuk reset password admin.");
                          }}
                          className="text-xs font-medium text-blue-600 hover:underline"
                        >
                          Lupa Password?
                        </Link>
                      </div>
                      <FormControl>
                        <PasswordInput
                          placeholder="Masukkan password"
                          className="h-10 rounded-md border-slate-200 bg-white text-xs placeholder:text-slate-400 focus-visible:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="h-10 w-full rounded-md bg-[#2563eb] text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99]"
                  >
                    Masuk
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminGuestGuard>
  );
}

