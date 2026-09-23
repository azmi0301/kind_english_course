"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, CheckCircle2, ArrowLeft, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import BrandLogo from "@/components/ui/BrandLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Mohon masukkan alamat email Anda.");
      return;
    }

    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/auth/update-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setSent(true);
    } catch {
      setError("Terjadi kesalahan saat mengirim tautan reset. Silakan coba lagi.");
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
              {sent ? "Periksa Email Anda" : "Lupa Kata Sandi?"}
            </h1>
            <p className="text-xs text-slate-500 mt-1 text-center">
              {sent
                ? `Kami telah mengirimkan tautan reset kata sandi ke email Anda`
                : "Masukkan email terdaftar untuk menerima tautan pemulihan kata sandi."}
            </p>
          </div>

          {/* Success state */}
          {sent ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-[#007D07]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">
                    Tautan pemulihan kata sandi telah dikirim ke:
                  </p>
                  <p className="text-sm font-bold text-slate-900 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 font-mono">
                    {email}
                  </p>
                  <p className="text-[11px] text-slate-500 pt-2 leading-relaxed">
                    Silakan buka kotak masuk email (atau folder <strong>Spam / Promosi</strong>), lalu klik tautan di dalamnya untuk membuat kata sandi baru.
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={() => { setSent(false); setEmail(""); }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Gunakan Email Lain
                </button>

                <Link
                  href="/auth/login"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#007D07] text-white font-semibold text-xs hover:bg-[#006A06] transition-all shadow-brand"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Halaman Masuk
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Alamat Email Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  id="btn-reset"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#007D07] text-white font-bold rounded-2xl hover:bg-[#006A06] transition-all shadow-brand disabled:opacity-60 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  {loading ? "Mengirim Tautan..." : "Kirim Tautan Reset Kata Sandi"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#007D07] font-bold hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Ingat kata sandi? Masuk di sini
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          <Link href="/" className="hover:text-[#007D07] transition-colors">← Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  );
}

