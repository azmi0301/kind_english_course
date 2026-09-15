"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import BrandLogo from "@/components/ui/BrandLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Mohon lengkapi semua kolom pendaftaran.");
      return;
    }
    if (form.password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name } },
      });

      if (signUpError) {
        setLoading(false);
        setError(signUpError.message);
        return;
      }

      // 2. Jika session langsung tersedia, langsung arahkan ke Dashboard
      if (data?.session) {
        router.push("/dashboard");
        return;
      }

      // 3. Jika session belum otomatis aktif, coba signInWithPassword langsung
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInData?.session && !signInError) {
        router.push("/dashboard");
        return;
      }

      // 4. Fallback jika Supabase mewajibkan konfirmasi email
      setLoading(false);
      setSuccess(true);
    } catch {
      setLoading(false);
      setError("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    }
  };

  const benefits = [
    "Akses langsung ke ruang simulasi & ujian TOEFL ITP resmi",
    "Analitik skor instan (310–677) dengan breakdown per section",
    "Unduh sertifikat digital PDF ber-barcode verifikasi online",
  ];

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-9">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center mb-6">
            <BrandLogo size="lg" className="shadow-brand mb-4" />
            <h1 className="font-heading font-800 text-slate-900 text-2xl tracking-tight">Daftar Akun Peserta</h1>
            <p className="text-xs text-slate-500 mt-1">Kind English Course — Ujian TOEFL ITP Online</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#007D07] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-600 leading-snug">{b}</span>
              </div>
            ))}
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-4 mb-5 text-center">
              <CheckCircle2 className="w-8 h-8 text-[#007D07] mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">Pendaftaran Berhasil!</p>
              <p className="text-xs text-slate-600 mt-1">
                Silakan cek email Anda untuk verifikasi atau{" "}
                <Link href="/auth/login" className="text-[#007D07] underline font-bold">
                  Masuk Sekarang
                </Link>
                .
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap Anda"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
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
              <label htmlFor="reg-confirm" className="block text-xs font-bold text-slate-700 mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <input
                id="reg-confirm"
                name="confirm"
                type={showPass ? "text" : "password"}
                value={form.confirm}
                onChange={handleChange}
                placeholder="Ulangi kata sandi Anda"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all"
              />
            </div>

            <button
              id="btn-register"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#007D07] text-white font-bold rounded-2xl hover:bg-[#006A06] transition-all shadow-brand disabled:opacity-60 disabled:cursor-not-allowed text-sm hover:-translate-y-0.5 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? "Mendaftarkan akun..." : "Daftar & Masuk ke Dashboard"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Sudah memiliki akun?{" "}
              <Link href="/auth/login" className="text-[#007D07] font-bold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          <Link href="/" className="hover:text-[#007D07] transition-colors">← Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  );
}

