import { UserCheck, Laptop, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    number: "01",
    icon: UserCheck,
    title: "Buat Akun & Masuk",
    description:
      "Daftarkan akun peserta Anda dalam 1 menit. Akses langsung ruang ujian online kapan saja sesuai jadwal yang ditentukan.",
    tag: "Langkah 1",
  },
  {
    number: "02",
    icon: Laptop,
    title: "Kerjakan Tes TOEFL ITP",
    description:
      "Ujian terdiri dari 3 seksi standar (Listening, Structure, Reading) dengan timer resmi, audio player terintegrasi, dan auto-save.",
    tag: "Langkah 2",
  },
  {
    number: "03",
    icon: Award,
    title: "Skor Instan & Sertifikat Barcode",
    description:
      "Hasil skor (310–677) langsung keluar seketika. Unduh sertifikat resmi PDF lengkap dengan QR Barcode verifikasi online.",
    tag: "Langkah 3",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#007D07]/10 border border-[#007D07]/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#007D07] animate-pulse" />
            <span className="text-xs font-bold text-[#007D07] tracking-wider uppercase">Alur Ujian Mudah</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Cara Mengikuti Ujian di <span className="text-[#007D07]">Kind English Course</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Hanya butuh 3 langkah sederhana untuk menyelesaikan tes TOEFL ITP resmi dan mendapatkan sertifikat digital tervalidasi.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#007D07] border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black font-mono text-slate-200 group-hover:text-emerald-300 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider mb-3">
                    {step.tag}
                  </span>

                  <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* TOEFL ITP Format Breakdown Card */}
        <div className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#007D07]" />
                <span className="text-xs font-bold text-[#007D07] uppercase tracking-wider">Format Standar Resmi</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Struktur 3 Sesi Ujian TOEFL ITP
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-[#E8F5E9] px-4 py-2 rounded-2xl border border-emerald-200">
              <span className="text-xs text-slate-700 font-semibold">Total:</span>
              <span className="text-xs font-bold text-[#007D07] font-mono">140 Soal • 115 Menit • Skor 310–677</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 font-heading">Section 1</span>
                <span className="text-[11px] font-bold text-[#007D07] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  50 Soal • ~35 Menit
                </span>
              </div>
              <div className="font-bold text-slate-800 text-sm mb-1">Listening Comprehension</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Short Dialogues, Long Conversations, dan Academic Talks. Audio diputar otomatis 1 kali.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 font-heading">Section 2</span>
                <span className="text-[11px] font-bold text-[#007D07] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  40 Soal • 25 Menit
                </span>
              </div>
              <div className="font-bold text-slate-800 text-sm mb-1">Structure &amp; Written Expr.</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Melengkapi kalimat rumpang (Structure) &amp; mengidentifikasi kata yang salah (Written Expression).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 font-heading">Section 3</span>
                <span className="text-[11px] font-bold text-[#007D07] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  50 Soal • 55 Menit
                </span>
              </div>
              <div className="font-bold text-slate-800 text-sm mb-1">Reading Comprehension</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                5 bacaan akademis ilmiah, main idea, vocabulary in context, inference, dan factual questions.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#007D07] hover:bg-[#006A06] text-white text-xs font-bold rounded-2xl shadow-brand transition-all hover:scale-105 active:scale-95"
          >
            Mulai Ujian Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
