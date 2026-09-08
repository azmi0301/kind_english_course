import { createServiceClient } from "@/lib/supabase";
import { CheckCircle2, ShieldCheck, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VerifyCertificatePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: result, error } = await supabase
    .from("exam_results")
    .select("*, profiles(name, email)")
    .eq("id", id)
    .single();

  if (error || !result) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center border border-slate-200">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Sertifikat Tidak Ditemukan</h1>
          <p className="text-sm text-slate-500 mb-6">
            ID Sertifikat <span className="font-mono font-semibold text-slate-700">{id}</span> tidak terdaftar dalam sistem validasi resmi Kind English Course.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#007D07] text-white rounded-xl text-sm font-semibold hover:bg-[#006A06] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const profile = Array.isArray(result.profiles) ? result.profiles[0] : result.profiles;
  const studentName = profile?.name || profile?.email?.split("@")[0] || "STUDENT";
  const dateStr = result.submitted_at
    ? new Date(result.submitted_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Verified";

  const certNo = `KEC-ITP-${id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Official Banner */}
        <div className="bg-slate-950 px-8 py-6 text-white text-center relative border-b-4 border-[#C5A059]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-4 h-4" />
            Official Verified Record
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white font-serif">
            KIND ENGLISH COURSE
          </h1>
          <p className="text-xs text-amber-300 font-semibold tracking-widest uppercase">
            Center for Language Assessment
          </p>
        </div>

        {/* Certificate Details */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="text-center pb-6 border-b border-slate-100">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
              Document Reference: {certNo}
            </span>
            <p className="text-xs text-slate-500 mb-2">Laporan Resmi Hasil Ujian:</p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#007D07] tracking-tight">
              {studentName.toUpperCase()}
            </h2>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              {result.exam_title || "TOEFL ITP Institutional Test"}
            </p>
          </div>

          {/* Main Score Display */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-200 text-center shadow-sm">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Total TOEFL ITP Official Score
            </span>
            <div className="text-5xl md:text-6xl font-black text-emerald-900 my-1">
              {result.total_score ?? 310}
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-emerald-700 font-medium mt-2">
              <span className="px-2.5 py-0.5 bg-white/80 rounded-full border border-emerald-200">
                Score Range: 310 - 677
              </span>
              {result.level && (
                <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full font-bold">
                  CEFR Level {result.level}
                </span>
              )}
            </div>
          </div>

          {/* Section Scores Breakdown */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Rincian Nilai Per Section
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Listening */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
                  Section 1
                </span>
                <p className="text-xs font-semibold text-slate-700 mb-2">Listening</p>
                <div className="text-2xl font-bold text-slate-900">
                  {result.listening_scaled ?? 31}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Scaled Score (31-68)</span>
              </div>

              {/* Structure */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                  Section 2
                </span>
                <p className="text-xs font-semibold text-slate-700 mb-2">Structure & Writing</p>
                <div className="text-2xl font-bold text-slate-900">
                  {result.structure_scaled ?? 31}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Scaled Score (31-68)</span>
              </div>

              {/* Reading */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Section 3
                </span>
                <p className="text-xs font-semibold text-slate-700 mb-2">Reading</p>
                <div className="text-2xl font-bold text-slate-900">
                  {result.reading_scaled ?? 31}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Scaled Score (31-68)</span>
              </div>
            </div>
          </div>

          {/* Validation Metadata */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-400">Tanggal Ujian</span>
              <span className="font-semibold text-slate-800">{dateStr}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
              <span className="text-slate-400">Status Autentikasi</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi Asli & Resmi
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Lembaga Penilai</span>
              <span className="font-semibold text-slate-800">Kind English Course Assessment Board</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href={`/api/certificate/${id}`}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#007D07] hover:bg-[#006A06] text-white font-semibold text-sm transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              Download PDF Sertifikat
            </a>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
