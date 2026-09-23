"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import BrandLogo from "@/components/ui/BrandLogo";

function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch {
      setError("Gagal memperbarui kata sandi. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-9">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6">
            <BrandLogo size="lg" className="shadow-brand mb-4" />
            <h1 className="font-heading font-800 text-slate-900 text-2xl tracking-tight">
              Buat Kata Sandi Baru
            </h1>
            <p className="text-xs text-slate-500 mt-1 text-center">
              Masukkan kata sandi baru untuk akun Kind English Course Anda.
            </p>
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-4 mb-5 text-center">
              <CheckCircle2 className="w-8 h-8 text-[#007D07] mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">Kata Sandi Berhasil Diperbarui!</p>
              <p className="text-xs text-slate-600 mt-1">
                Mengarahkan Anda ke Dashboard...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  id="confirm-password"
                  type={showPass ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#007D07] text-white font-bold rounded-2xl hover:bg-[#006A06] transition-all shadow-brand disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? "Menyimpan Kata Sandi..." : "Simpan Kata Sandi & Masuk"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-xs text-slate-500 hover:text-[#007D07] font-semibold transition-colors"
            >
              ← Kembali ke Halaman Masuk
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense>
      <UpdatePasswordForm />
    </Suspense>
  );
}
