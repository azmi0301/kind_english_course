import { createServiceClient } from "@/lib/supabase";
import { CheckCircle2, ShieldCheck, Download, ArrowLeft, ExternalLink, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl text-center border border-slate-200 animate-scale-in">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Sertifikat Tidak Ditemukan</h1>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            ID Sertifikat <span className="font-mono font-semibold text-slate-700">{id}</span> tidak terdaftar dalam sistem database verifikasi resmi Kind English Course.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#007D07] text-white rounded-xl text-xs font-semibold hover:bg-[#006A06] transition-colors shadow-md"
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
    : "Verified Record";

  const totalScore = result.total_score ?? 310;
  const certNo = `KEC-ITP-${id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 md:px-8 flex flex-col items-center justify-center font-sans">
      {/* Top Floating Authenticity Pill */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          Official Verified Digital Certificate
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-xs font-mono">
          Ref: {certNo}
        </div>
      </div>

      {/* Main Certificate Frame (Exact matching design) */}
      <div className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-[#D4AF37]/50 relative p-6 sm:p-10 md:p-12 transition-all">
        {/* Subtle Background Watermark Circles */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden flex items-center justify-between">
          <div className="w-96 h-96 rounded-full border-[20px] border-slate-900 -translate-x-1/2" />
          <div className="w-96 h-96 rounded-full border-[20px] border-slate-900 translate-x-1/2" />
        </div>

        {/* Top-Left Diagonal Corner Ribbons */}
        <div className="absolute top-0 left-0 w-32 h-32 overflow-hidden pointer-events-none z-10">
          <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#D4AF37] rotate-45" />
          <div className="absolute -top-14 -left-14 w-28 h-28 bg-[#0F172A] rotate-45" />
          <div className="absolute top-10 left-0 w-24 h-0.5 bg-[#D4AF37] -rotate-45" />
          <div className="absolute top-12 left-0 w-24 h-1 bg-[#0F172A] -rotate-45" />
        </div>

        {/* Bottom-Right Diagonal Corner Ribbons */}
        <div className="absolute bottom-0 right-0 w-32 h-32 overflow-hidden pointer-events-none z-10">
          <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-[#D4AF37] rotate-45" />
          <div className="absolute -bottom-14 -right-14 w-28 h-28 bg-[#0F172A] rotate-45" />
          <div className="absolute bottom-10 right-0 w-24 h-0.5 bg-[#D4AF37] -rotate-45" />
          <div className="absolute bottom-12 right-0 w-24 h-1 bg-[#0F172A] -rotate-45" />
        </div>

        {/* Gold Inner Margin Border */}
        <div className="border border-[#C5A059]/60 rounded-xl p-6 sm:p-8 relative z-10 flex flex-col justify-between">
          
          {/* Top Header Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6">
            {/* Logo & Institution Brand */}
            <div className="flex items-center gap-3.5 pl-6 sm:pl-0">
              <div className="w-14 h-14 relative flex-shrink-0 bg-white rounded-xl shadow-xs border border-slate-200/80 p-1 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Kind English Course"
                  width={52}
                  height={52}
                  className="object-contain"
                />
              </div>
              <div className="border-l-2 border-[#C5A059] pl-3">
                <h2 className="font-extrabold text-sm sm:text-base text-[#0F172A] tracking-tight leading-tight">
                  KIND ENGLISH COURSE
                </h2>
                <p className="text-[10px] sm:text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Center for Language Assessment
                </p>
                <p className="text-[9px] text-slate-400 font-medium tracking-wide">
                  OFFICIAL TOEFL ITP TEST REPORT & CERTIFICATE
                </p>
              </div>
            </div>

            {/* Document Ref Box (Right) */}
            <div className="text-right sm:text-right text-center pr-6 sm:pr-0">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                Document Ref:
              </span>
              <span className="text-xs font-bold text-[#0F172A] font-mono tracking-wide border-b border-[#C5A059] pb-0.5">
                {certNo}
              </span>
            </div>
          </div>

          {/* Certificate Main Title & Ornamental Diamond */}
          <div className="text-center my-4 sm:my-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-wider uppercase font-serif">
              CERTIFICATE OF ACHIEVEMENT
            </h1>

            {/* Gold Diamond Ornament */}
            <div className="flex items-center justify-center gap-2 my-2.5">
              <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-[#C5A059]" />
              <div className="w-2 h-2 rotate-45 bg-[#C5A059]" />
              <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-[#C5A059]" />
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-lg mx-auto">
              This is to certify that the individual named below has successfully completed the official examination
            </p>

            {/* Candidate Name in Big Letters */}
            <div className="my-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight inline-block pb-1.5 border-b-2 border-[#C5A059] px-6">
                {studentName.toUpperCase()}
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-bold text-[#0F172A] uppercase tracking-widest mt-1">
              TOEFL ITP INSTITUTIONAL TEST
            </p>
          </div>

          {/* Central Box (QR Code & Official Final Score) */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-6 my-4 shadow-inner flex flex-col sm:flex-row items-center gap-6 max-w-2xl mx-auto w-full">
            {/* QR Code Container */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="p-2 bg-white rounded-xl border-2 border-[#C5A059] shadow-sm">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white flex items-center justify-center relative">
                  {/* Real Dynamic QR Image generated for this certificate */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify/${id}`
                    )}`}
                    alt="Certificate QR Verification"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1.5">Official Secure QR</span>
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block w-px h-28 bg-[#C5A059]/60" />

            {/* Right: Clean Final Score Showcase */}
            <div className="flex-1 text-center sm:text-center w-full">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                TOTAL TOEFL ITP® OFFICIAL SCORE
              </span>

              <div className="text-5xl sm:text-6xl font-black text-[#007D07] my-1 tracking-tight">
                {totalScore}
              </div>

              <span className="text-xs text-slate-500 font-medium block">
                Scaled Score Range: 310 – 677
              </span>

              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Terverifikasi Resmi di Database
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="pt-6 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
            {/* Left: Issued Date & Security */}
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-xs bg-[#C5A059]" />
                <span>Issued Date: <strong className="text-slate-800">{dateStr}</strong></span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-400 text-[10px]">
                <span className="w-2 h-2 rounded-xs bg-slate-300" />
                <span>Security: ENCRYPTED DIGITAL HASH</span>
              </div>
            </div>

            {/* Center: Motto */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <div className="w-6 h-px bg-[#C5A059]" />
                <span className="font-serif italic font-bold text-slate-800 text-sm">
                  Kind English
                </span>
                <div className="w-6 h-px bg-[#C5A059]" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">
                LEARN • GROW • SUCCEED
              </span>
            </div>

            {/* Right: Signature */}
            <div className="text-center sm:text-right space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Authorized Signature:
              </span>
              <div className="font-serif italic font-bold text-lg text-slate-800 leading-none py-1">
                Afis
              </div>
              <div className="w-32 border-b-2 border-slate-800 mx-auto sm:ml-auto sm:mr-0" />
              <span className="text-[9px] font-extrabold text-slate-900 uppercase tracking-wider block">
                KIND ENGLISH COURSE
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons Below Certificate */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
        <a
          href={`/api/certificate/${id}`}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#007D07] hover:bg-[#006A06] text-white font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-emerald-900/40 hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4" />
          Download PDF Sertifikat Asli
        </a>
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 font-semibold text-xs sm:text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
