"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import BrandLogo from "@/components/ui/BrandLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!data?.user) {
        setError("Akun tidak ditemukan. Silakan periksa kembali email & password Anda.");
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Cek role user
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const targetPath = profile?.role === "admin" ? "/admin" : redirectTo;

      // Beri waktu token tersimpan di browser lalu navigasi
      setTimeout(() => {
        router.push(targetPath);
        setTimeout(() => {
          window.location.href = targetPath;
        }, 400);
      }, 200);
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba beberapa saat lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-neutral-100 p-8 sm:p-9">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <BrandLogo size="lg" className="mb-4 shadow-brand" />
            <h1 className="font-heading font-800 text-neutral-900 text-2xl">Masuk Akun</h1>
            <p className="text-xs text-neutral-500 mt-1">Kind English Course</p>
          </div>

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-4 text-xs font-semibold text-[#007D07] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Berhasil masuk! Mengarahkan ke dashboard...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-4 text-xs font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-[#007D07]" />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-[#007D07] font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              id="btn-login"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#007D07] text-white font-semibold rounded-xl hover:bg-[#006A06] transition-all shadow-brand disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-[#007D07] font-semibold hover:underline">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          <Link href="/" className="hover:text-[#007D07] transition-colors">← Back to Kind English Course</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
