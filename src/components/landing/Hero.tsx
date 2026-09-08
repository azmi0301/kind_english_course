import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#007D07]/6 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#007D07]/4 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-[#007D07]/8 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#007D07]/10 border border-[#007D07]/20 mb-6">
              <Star className="w-3.5 h-3.5 text-[#007D07] fill-[#007D07]" />
              <span className="text-xs font-semibold text-[#007D07] tracking-wide">#1 TOEFL ITP Test Platform in Indonesia</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-900 text-neutral-900 leading-[1.1] mb-6">
              Raih Skor{" "}
              <span className="relative inline-block">
                <span className="text-[#007D07]">TOEFL Terbaik</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6 Q100 2 198 6" stroke="#007D07" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4"/>
                </svg>
              </span>{" "}
              Bersama Kind English Course
            </h1>

            <p className="text-lg text-neutral-600 leading-relaxed mb-8 max-w-lg">
              Ikuti tes TOEFL ITP resmi secara online dengan kondisi ujian nyata,
              timer otomatis, analitik skor lengkap, dan sertifikat digital.
              Mulai perjalananmu menuju skor 550+.
            </p>

            {/* Trust bullets */}
            <div className="space-y-2.5 mb-10">
              {[
                "Tes TOEFL ITP resmi — Listening, Structure & Reading lengkap",
                "Skor instan per section + progress tracking terpadu",
                "Sertifikat digital PDF otomatis setelah tes selesai",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#007D07] flex-shrink-0" />
                  <span className="text-sm text-neutral-600 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#007D07] text-white font-semibold rounded-xl hover:bg-[#006A06] shadow-brand transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
              >
                Daftar &amp; Mulai Tes
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-neutral-700 font-semibold rounded-xl border border-neutral-200 hover:border-[#007D07] hover:text-[#007D07] transition-all text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                Lihat Fitur Ujian
              </Link>
            </div>
          </div>

          {/* Right — Exam UI Preview Card */}
          <div className="animate-fade-in-up delay-300 lg:pl-8">
            <div className="relative">
              {/* Floating card — showing the exam interface */}
              <div className="rounded-2xl shadow-2xl border border-neutral-200 bg-white overflow-hidden">
                {/* Exam Header Preview */}
                <div className="bg-neutral-900 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-white text-xs font-mono font-semibold">TOEFL ITP — Kind English Course</div>
                  <div className="text-red-400 text-xs font-mono font-bold animate-pulse">35:42</div>
                </div>

                <div className="p-5">
                  {/* Section badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#007D07] uppercase tracking-widest bg-[#E8F5E9] px-2.5 py-1 rounded-full">Section 3 — Reading</span>
                    <span className="text-xs text-neutral-500 font-medium">Question 12 of 50</span>
                  </div>

                  {/* Mini reading passage preview */}
                  <div className="bg-neutral-50 rounded-lg p-3 mb-4 border border-neutral-100">
                    <div className="space-y-1.5">
                      <div className="h-2.5 bg-neutral-200 rounded w-full" />
                      <div className="h-2.5 bg-neutral-200 rounded w-11/12" />
                      <div className="h-2.5 bg-neutral-200 rounded w-10/12" />
                      <div className="h-2.5 bg-[#007D07]/20 rounded w-9/12" />
                      <div className="h-2.5 bg-neutral-200 rounded w-full" />
                      <div className="h-2.5 bg-neutral-200 rounded w-8/12" />
                    </div>
                  </div>

                  {/* Mock question */}
                  <p className="text-xs font-semibold text-neutral-700 mb-3">
                    According to the passage, what is the primary cause of coral bleaching?
                  </p>

                  {/* Mock options */}
                  <div className="space-y-2">
                    {["Rising ocean temperatures", "Ocean acidification", "Overfishing of reef species", "Increased sedimentation"].map((opt, i) => (
                      <div
                        key={opt}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs cursor-default transition-all ${
                          i === 0
                            ? "bg-[#007D07] text-white font-semibold"
                            : "bg-neutral-50 text-neutral-600 border border-neutral-100"
                        }`}
                      >
                        <span className={`w-4.5 h-4.5 text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? "bg-white/20 text-white" : "bg-neutral-200 text-neutral-500"}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question palette mini */}
                <div className="border-t border-neutral-100 px-5 py-3 flex gap-1.5 flex-wrap">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 text-[10px] font-bold rounded flex items-center justify-center cursor-default ${
                        i < 11 ? "bg-[#007D07] text-white" :
                        i === 11 ? "bg-[#007D07] text-white ring-2 ring-[#007D07] ring-offset-1" :
                        i === 15 ? "bg-amber-100 text-amber-800 border border-amber-300" :
                        "bg-white text-neutral-400 border border-neutral-200"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating score badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-card border border-neutral-100 px-4 py-3 animate-scale-in delay-500">
                <div className="text-2xl font-heading font-900 text-[#007D07]">567</div>
                <div className="text-[10px] text-neutral-500 font-medium">TOEFL ITP Score</div>
              </div>

              {/* Floating cert badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card border border-neutral-100 px-4 py-3 animate-scale-in delay-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                    <span className="text-lg">🏅</span>
                  </div>
                  <div>
                    <div className="text-sm font-heading font-700 text-neutral-900">Sertifikat Resmi</div>
                    <div className="text-[10px] text-neutral-500">PDF otomatis tersedia</div>
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
