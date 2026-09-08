"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Loader2, Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    // Demo: simulate sending reset email
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-100 p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#007D07] flex items-center justify-center mb-4 shadow-brand">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-heading font-800 text-neutral-900 text-xl">
              {sent ? "Check Your Email" : "Forgot Password?"}
            </h1>
            <p className="text-sm text-neutral-500 mt-1 text-center">
              {sent
                ? `We've sent a reset link to ${email}`
                : "No worries — we'll send you a reset link."}
            </p>
          </div>

          {/* Success state */}
          {sent ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-[#007D07]" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-neutral-600">
                    A password reset link has been sent to:
                  </p>
                  <p className="text-sm font-semibold text-neutral-900 bg-neutral-50 px-4 py-2 rounded-lg border border-neutral-200">
                    {email}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Didn&apos;t receive it? Check your spam folder or try again.
                  </p>
                </div>
              </div>

              {/* Demo notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-700">
                  <strong>Demo Mode:</strong> Email sending is simulated. Connect a mail service (e.g. Resend, SendGrid) for real reset emails.
                </p>
              </div>

              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-sm hover:bg-neutral-50 transition-colors"
              >
                Try a different email
              </button>

              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#007D07] text-white font-semibold text-sm hover:bg-[#006A06] transition-all shadow-brand"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {/* Demo notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
                <p className="text-xs text-amber-700">
                  <strong>Demo Mode:</strong> Enter any email and we&apos;ll simulate sending a reset link.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-xs text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#007D07] focus:ring-2 focus:ring-[#007D07]/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  id="btn-reset"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#007D07] text-white font-semibold rounded-xl hover:bg-[#006A06] transition-all shadow-brand disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  {loading ? "Sending reset link..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#007D07] transition-colors font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          <Link href="/" className="hover:text-[#007D07] transition-colors">← Back to Kind English Course</Link>
        </p>
      </div>
    </div>
  );
}
