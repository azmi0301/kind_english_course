"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, Star, Award, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden gradient-hero pt-20 pb-12 lg:py-16">
      {/* Background glow decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-[#007D07]/8 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full bg-[#007D07]/6 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left — Content (7 cols on lg) */}
          <div className="lg:col-span-7 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#007D07]/10 border border-[#007D07]/20 mb-4 shadow-2xs">
              <Star className="w-3.5 h-3.5 text-[#007D07] fill-[#007D07]" />
              <span className="text-xs font-bold text-[#007D07] tracking-wide">
                Platform Ujian TOEFL ITP Resmi
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] mb-4 tracking-tight">
              Raih Skor{" "}
              <span className="relative inline-block text-[#007D07]">
                TOEFL Terbaik
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6 Q100 2 198 6" stroke="#007D07" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4"/>
                </svg>
              </span>{" "}
              Bersama Kind English Course
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-5 max-w-xl">
              Ikuti ujian TOEFL ITP terstandarisasi dengan timer otomatis, audio listening terintegrasi, analitik skor instan (310–677), dan sertifikat digital ber-barcode verifikasi online.
            </p>

            {/* Trust bullets */}
            <div className="grid sm:grid-cols-2 gap-2.5 mb-7 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007D07] flex-shrink-0" />
                <span>Listening, Structure & Reading Lengkap</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007D07] flex-shrink-0" />
                <span>Skor Instan Standar CEFR (310–677)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007D07] flex-shrink-0" />
                <span>Sertifikat Digital PDF + Barcode Verifikasi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007D07] flex-shrink-0" />
                <span>Auto-Save Aman Setiap 5 Detik</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#007D07] text-white font-bold rounded-2xl hover:bg-[#006A06] shadow-brand transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
                  Masuk ke Dashboard Ujian
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#007D07] text-white font-bold rounded-2xl hover:bg-[#006A06] shadow-brand transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
                >
                  Daftar &amp; Mulai Tes
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <a
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:border-[#007D07] hover:text-[#007D07] transition-all text-sm shadow-2xs hover:shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#007D07]" />
                Lihat Alur Ujian
              </a>
            </div>
          </div>

          {/* Right — Exam UI Preview Card (5 cols on lg) */}
          <div className="lg:col-span-5 animate-fade-in-up delay-200">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Preview Card */}
              <div className="rounded-3xl shadow-xl border border-slate-200/90 bg-white overflow-hidden">
                {/* Header Preview */}
                <div className="bg-slate-950 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-white text-[11px] font-mono font-bold tracking-tight">
                    TOEFL ITP — Kind English Course
                  </div>
                  <div className="text-emerald-400 text-xs font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60 animate-pulse">
                    35:42
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* Section Badge & Question Info */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#007D07] uppercase tracking-wider bg-[#E8F5E9] px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                      Section 3 — Reading
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold font-mono">
                      Soal No. 12 dari 50
                    </span>
                  </div>

                  {/* Reading Passage Preview Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-200 rounded w-11/12" />
                    <div className="h-2 bg-[#007D07]/20 rounded w-9/12" />
                    <div className="h-2 bg-slate-200 rounded w-10/12" />
                  </div>

                  {/* Question Text */}
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    According to the passage, what is the primary cause of coral bleaching?
                  </p>

                  {/* Choices Preview */}
                  <div className="space-y-1.5">
                    {[
                      { id: "A", text: "Rising ocean temperatures", selected: true },
                      { id: "B", text: "Ocean acidification", selected: false },
                      { id: "C", text: "Overfishing of reef species", selected: false },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
                          opt.selected
                            ? "bg-[#007D07] text-white font-bold shadow-2xs"
                            : "bg-slate-50 text-slate-600 border border-slate-200/70"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 text-[10px] font-black rounded-lg flex items-center justify-center flex-shrink-0 ${
                            opt.selected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="truncate">{opt.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mini Palette preview */}
                  <div className="border-t border-slate-100 pt-3 flex gap-1 flex-wrap">
                    {Array.from({ length: 14 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-5 h-5 text-[9px] font-bold rounded flex items-center justify-center ${
                          i < 11
                            ? "bg-[#007D07] text-white"
                            : i === 11
                            ? "bg-[#007D07] text-white ring-2 ring-[#007D07] ring-offset-1"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Top-Right Score Badge */}
              <div className="absolute -top-3.5 -right-3 bg-white rounded-2xl shadow-lg border border-slate-200/90 px-3.5 py-2 animate-scale-in">
                <div className="flex items-center gap-2">
                  <div className="text-xl font-black text-[#007D07]">567</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-tight">
                    TOEFL ITP<br /><span className="text-emerald-600">Verified</span>
                  </div>
                </div>
              </div>

              {/* Floating Bottom-Left Cert Badge */}
              <div className="absolute -bottom-3.5 -left-3 bg-white rounded-2xl shadow-lg border border-slate-200/90 px-3.5 py-2 animate-scale-in">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-sm flex-shrink-0">
                    🏆
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Sertifikat Digital</div>
                    <div className="text-[10px] text-slate-500 font-medium">QR Barcode Resmi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
