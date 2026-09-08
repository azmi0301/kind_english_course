"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
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
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(true);
  };

  const benefits = [
    "Track your score progress over time",
    "Download your TOEFL certificates",
    "Access institutional TOEFL exam tests",
  ];

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-100 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#007D07] flex items-center justify-center mb-4 shadow-brand">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-heading font-800 text-neutral-900 text-xl">Create Account</h1>
            <p className="text-sm text-neutral-500 mt-1">Kind English Course — Free to join</p>
          </div>

          {/* Benefits */}
          <div className="space-y-2 mb-6">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007D07] flex-shrink-0" />
                <span className="text-xs text-neutral-600">{b}</span>
              </div>
            ))}
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-4 mb-5 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-800">Account created!</p>
              <p className="text-xs text-green-700 mt-1">Check your email to verify your account, then <Link href="/auth/login" className="underline font-semibold">sign in</Link>.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-xs text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Email Address
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all"
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
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

            <div>
              <label htmlFor="reg-confirm" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Confirm Password
              </label>
              <input
                id="reg-confirm"
                name="confirm"
                type={showPass ? "text" : "password"}
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all"
              />
            </div>

            <button
              id="btn-register"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#007D07] text-white font-semibold rounded-xl hover:bg-[#006A06] transition-all shadow-brand disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? "Creating account..." : "Create Free Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#007D07] font-semibold hover:underline">
                Sign in
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
