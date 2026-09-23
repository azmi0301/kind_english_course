"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/ui/BrandLogo";
import { supabase } from "@/lib/supabase";
import { calculateITPScore } from "@/lib/scoreCalculator";
import type { TestResult } from "@/lib/scoreCalculator";
import ProgressChart from "@/components/dashboard/ProgressChart";
import CertificateDownloader from "@/components/dashboard/CertificateDownloader";
import {
  BookOpen, BarChart3, History, Award,
  Headphones, AlignLeft, FileText, Home,
  LogOut, Play, Clock, CheckCircle2, Star, Zap,
  Target, ChevronRight, Calendar, Trophy, Medal,
  QrCode, ExternalLink, ShieldCheck, Sparkles, User,
  Flame, TrendingUp, HelpCircle
} from "lucide-react";

type TabType = "dashboard" | "history" | "certificates";

// ─── Modern Skeleton Loader ───────────────────────────────────────────────────
function ModernSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-36 bg-slate-200/70 rounded-3xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs" />
        ))}
      </div>
      <div className="h-80 bg-white rounded-3xl border border-slate-200/80 shadow-xs" />
    </div>
  );
}

// ─── Section Info Configuration ───────────────────────────────────────────────
const ITP_SECTIONS = [
  {
    step: 1,
    icon: Headphones,
    color: "text-purple-600 bg-purple-50 border-purple-100",
    title: "Section 1",
    name: "Listening Comprehension",
    time: "35 Min",
    questions: "50 Questions",
    desc: "Short Dialogues & Academic Lectures",
  },
  {
    step: 2,
    icon: AlignLeft,
    color: "text-blue-600 bg-blue-50 border-blue-100",
    title: "Section 2",
    name: "Structure & Expression",
    time: "25 Min",
    questions: "40 Questions",
    desc: "Syntax, Grammar & Error Recognition",
  },
  {
    step: 3,
    icon: BookOpen,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    title: "Section 3",
    name: "Reading Comprehension",
    time: "55 Min",
    questions: "50 Questions",
    desc: "Academic Passages & Vocabulary",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [studentName, setStudentName] = useState("Student");
  const [studentEmail, setStudentEmail] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [results, setResults] = useState<TestResult[]>([]);
  const [signingOut, setSigningOut] = useState(false);
  const [scheduleActive, setScheduleActive] = useState(true);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchUserData(userId: string) {
      try {
        const res = await fetch(`/api/user/dashboard?userId=${userId}`);
        if (!res.ok) {
          if (isMounted) setLoading(false);
          return;
        }

        const { profile, results: rows } = await res.json();

        if (profile && isMounted) {
          setStudentName(profile.name || profile.email?.split("@")[0] || "Student");
          setStudentEmail(profile.email ?? "");
          setJoinDate(profile.join_date ?? "");

          // Check login schedule restriction
          if (profile.role !== "admin") {
            try {
              const sRes = await fetch("/api/settings");
              const { settings } = await sRes.json();
              if (settings?.login_schedule_enabled) {
                const now = new Date();
                const start = settings.login_start_time ? new Date(settings.login_start_time) : null;
                const end = settings.login_end_time ? new Date(settings.login_end_time) : null;
                if ((start && now < start) || (end && now > end)) {
                  setScheduleActive(false);
                  await supabase.auth.signOut();
                  window.location.href = "/auth/login";
                  return;
                }
              }
            } catch {
              // ignore
            }
          }
        }

        if (isMounted) {
          const mapped: TestResult[] = (rows ?? []).map((row: Record<string, unknown>) => ({
            id: row.id as string,
            date: (row.submitted_at ?? row.created_at) as string,
            examTitle: row.exam_title as string,
            examType: row.exam_type as "ITP" | "Diagnostic" | "Practice",
            score: calculateITPScore(
              (row.listening_raw as number) ?? 0, (row.listening_total as number) ?? 50,
              (row.structure_raw as number) ?? 0, (row.structure_total as number) ?? 40,
              (row.reading_raw as number) ?? 0, (row.reading_total as number) ?? 50,
            ),
            duration: (row.duration_minutes as number) ?? 115,
            certificateReady: (row.certificate_ready as boolean) ?? false,
          }));

          setResults(mapped);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    async function loadData() {
      // 1. Coba ambil session langsung
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        if (isMounted) fetchUserData(session.user.id);
        return;
      }

      // 2. Dengarkan event auth state change jika session sedang di-load dari storage
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (currentSession?.user && isMounted) {
          fetchUserData(currentSession.user.id);
        } else if (event === "SIGNED_OUT" && isMounted && !loading) {
          window.location.href = "/auth/login";
        }
      });

      // 3. Fallback pemeriksaan ulang setelah 3 detik
      const timeoutId = setTimeout(async () => {
        if (isMounted) {
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession?.user) {
            fetchUserData(retrySession.user.id);
          } else if (isMounted) {
            window.location.href = "/auth/login";
          }
        }
      }, 3000);

      return () => {
        authListener.subscription.unsubscribe();
        clearTimeout(timeoutId);
      };
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [router, loading]);

  const latest = results[0];
  const itpResults = results.filter((r) => r.examType === "ITP");
  const bestScore = itpResults.length > 0 ? Math.max(...itpResults.map((r) => r.score.total)) : 0;
  const avgScore = itpResults.length > 0
    ? Math.round(itpResults.reduce((acc, r) => acc + r.score.total, 0) / itpResults.length)
    : 0;

  // ─── TAB: OVERVIEW / DASHBOARD ───────────────────────────────────────────────
  const dashboardContent = (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-8 md:p-10 shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Official Institutional Assessment
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              <span className="text-white">Selamat Datang, </span>
              <span className="text-emerald-400">{studentName}</span>
              <span className="text-white">!</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              Persiapkan dirimu untuk mengikuti ujian resmi TOEFL ITP Institutional Test. Seluruh hasil tersimpan otomatis dan sertifikat resmi dapat langsung diunduh setelah ujian.
            </p>
          </div>

          {/* Quick Assessment Meta Pills on Right */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3.5 text-xs text-white shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-semibold leading-tight">Durasi Ujian Resmi</span>
                <span className="font-extrabold text-white text-xs">115 Menit • 140 Soal</span>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3.5 text-xs text-white shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                <Award className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-semibold leading-tight">Sertifikasi Nilai</span>
                <span className="font-extrabold text-white text-xs">Otomatis & QR Barcode</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ujian */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#007D07] flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-500 block">Total Ujian Selesai</span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{itpResults.length} Sesi</div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Terverifikasi
            </span>
          </div>
        </div>

        {/* Skor Tertinggi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all">
          <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-500 block">Skor Tertinggi</span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{bestScore || "—"}</div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              Skala TOEFL (310-677)
            </span>
          </div>
        </div>

        {/* Rata-rata Skor */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-500 block">Rata-rata Skor</span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{avgScore || "—"}</div>
            <span className="text-[11px] text-blue-600 font-medium block mt-0.5">
              Performa Keseluruhan
            </span>
          </div>
        </div>

        {/* Sertifikat Resmi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all">
          <div className="w-13 h-13 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-slate-500 block">Sertifikat Resmi</span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{itpResults.length} Berkas</div>
            <button
              onClick={() => setActiveTab("certificates")}
              className="text-[11px] text-purple-600 font-semibold hover:underline flex items-center gap-0.5 mt-0.5"
            >
              Lihat Sertifikat <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Section: Exam Structure Card + Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Exam Structure Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#007D07]" />
                <h3 className="text-lg font-bold text-slate-900">Struktur Ujian TOEFL ITP</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Format ujian resmi 115 menit dengan 3 seksi kemampuan bahasa Inggris
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold font-mono self-start sm:self-auto">
              Total 140 Soal • 115 Menit
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {ITP_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.step}
                  className="rounded-2xl border border-slate-200/80 p-5 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${sec.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {sec.title}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{sec.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{sec.desc}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 mt-4 flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5" /> {sec.time}
                    </span>
                    <span className="text-[#007D07]">{sec.questions}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs text-emerald-950 font-medium">
                Ujian menggunakan sistem autosave & timer real-time berstandar resmi.
              </p>
            </div>
            <Link
              href="/exam/itp-full-sim-01"
              className="px-5 py-2.5 bg-[#007D07] hover:bg-[#006A06] text-white text-xs font-bold rounded-xl shadow-sm transition-all whitespace-nowrap"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>

        {/* Right Col: Latest Result & Quick Summary */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Hasil Tes Terakhir</h3>
              <span className="text-xs text-slate-400">
                {latest ? new Date(latest.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—"}
              </span>
            </div>

            {latest ? (
              <div className="space-y-4">
                <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Total Scaled Score
                  </span>
                  <div className="text-5xl font-black text-[#007D07] tracking-tight my-1">
                    {latest.score.total}
                  </div>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    CEFR Level {latest.score.level}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
                    <span className="text-slate-500">Listening</span>
                    <span className="font-bold text-purple-700">{latest.score.listening.scaled} / 68</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
                    <span className="text-slate-500">Structure</span>
                    <span className="font-bold text-blue-700">{latest.score.structure.scaled} / 68</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-slate-500">Reading</span>
                    <span className="font-bold text-emerald-700">{latest.score.reading.scaled} / 68</span>
                  </div>
                </div>

                <div className="pt-2">
                  <CertificateDownloader result={latest} studentName={studentName} showAlways fullWidth />
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500">Belum ada tes yang diselesaikan.</p>
                <Link
                  href="/exam/itp-full-sim-01"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#007D07] text-white rounded-xl text-xs font-bold"
                >
                  <Play className="w-3.5 h-3.5 fill-white" /> Ambil Tes Pertama
                </Link>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/verify"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-between group"
            >
              <span>Portal Validasi Nilai Resmi</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── TAB: HISTORY ────────────────────────────────────────────────────────────
  const historyContent = (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Riwayat Ujian TOEFL ITP</h3>
            <p className="text-xs text-slate-500 mt-1">Daftar lengkap seluruh sesi tes yang pernah kamu ikuti</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-[#007D07] border border-emerald-200 text-xs font-bold self-start sm:self-auto">
            {results.length} Sesi Terdata
          </span>
        </div>

        {results.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
              <History className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Belum ada riwayat tes</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Selesaikan ujian TOEFL ITP untuk melihat grafik perkembangan dan rincian jawaban per bagian.
            </p>
            <Link
              href="/exam/itp-full-sim-01"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#007D07] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#006A06] transition-all"
            >
              <Play className="w-4 h-4 fill-white" /> Mulai Ujian Sekarang
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tanggal Ujian</th>
                  <th className="py-3.5 px-4">Paket Tes</th>
                  <th className="py-3.5 px-4 text-center">Listening</th>
                  <th className="py-3.5 px-4 text-center">Structure</th>
                  <th className="py-3.5 px-4 text-center">Reading</th>
                  <th className="py-3.5 px-4 text-center">Total Skor</th>
                  <th className="py-3.5 px-4 text-center">Level</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {results.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-700 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(r.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {r.examTitle}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold">
                        {r.score.listening.scaled}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">
                        {r.score.structure.scaled}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">
                        {r.score.reading.scaled}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-black text-slate-900">
                        {r.score.total}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {r.score.level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/verify/${r.id}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <QrCode className="w-3 h-3 text-emerald-600" /> Nilai
                        </Link>
                        <CertificateDownloader result={r} studentName={studentName} showAlways />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // ─── TAB: CERTIFICATES ───────────────────────────────────────────────────────
  const certificatesContent = (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 rounded-3xl p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-widest">
            <Award className="w-4 h-4" />
            Official Verified Credentials
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Sertifikat Resmi TOEFL ITP</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Sertifikat digital terenkripsi dilengkapi dengan QR Barcode resmi. Rincian nilai dapat divalidasi langsung oleh institusi atau universitas di portal verifikasi.
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 flex-shrink-0">
          <Medal className="w-8 h-8" />
        </div>
      </div>

      {itpResults.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Belum Ada Sertifikat</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Selesaikan minimal 1 ujian TOEFL ITP Institutional Test untuk menerbitkan sertifikat resmi ber-barcode.
          </p>
          <Link
            href="/exam/itp-full-sim-01"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#007D07] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#006A06] transition-all"
          >
            <Play className="w-4 h-4 fill-white" /> Mulai Ujian TOEFL ITP
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itpResults.map((result, idx) => (
            <div
              key={result.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
            >
              {/* Card Header Frame */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 relative overflow-hidden border-b-2 border-[#C5A059] text-center text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                    Kind English Course
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Ref: KEC-ITP-{result.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/20 text-amber-300">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest block">
                  Official Certificate of Achievement
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">{result.examTitle}</h4>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Barcode verification notice */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-amber-300 flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-slate-900 block">QR Barcode Verifikasi</span>
                    <span className="text-[11px] text-slate-500 block leading-snug">
                      Scan barcode di sertifikat untuk melihat rincian nilai & status asli.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(result.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px]">
                    Official ITP
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Link
                    href={`/verify/${result.id}`}
                    target="_blank"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    Buka Halaman Nilai Barcode
                  </Link>
                  <CertificateDownloader result={result} studentName={studentName} showAlways fullWidth />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex">
      {/* Sleek Vertical Navigation Bar */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 bg-slate-950 flex flex-col items-center py-6 z-40 border-r border-slate-800 justify-between">
        <div className="flex flex-col items-center gap-8">
          <Link href="/" className="hover:scale-105 transition-transform">
            <BrandLogo size="md" />
          </Link>

          <nav className="flex flex-col gap-3">
            {[
              { id: "dashboard" as TabType, icon: BarChart3, label: "Overview" },
              { id: "history" as TabType, icon: History, label: "Riwayat" },
              { id: "certificates" as TabType, icon: Award, label: "Sertifikat" },
            ].map(({ id, icon: Icon, label }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  title={label}
                  onClick={() => setActiveTab(id)}
                  className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                    active
                      ? "bg-[#007D07] text-white shadow-lg shadow-emerald-900/50"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] font-semibold">{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/"
            title="Beranda Utama"
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
          >
            <Home className="w-5 h-5" />
          </Link>
          <button
            title="Keluar"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-all disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="pl-20 flex-1 flex flex-col min-h-screen">
        {/* Modern Top Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/80 px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {activeTab === "dashboard" && "Dashboard Siswa"}
                  {activeTab === "history" && "Riwayat Hasil Ujian"}
                  {activeTab === "certificates" && "Sertifikat Resmi"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide border border-emerald-200">
                  Student Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kind English Course • Center for Language Assessment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Student Profile Tag */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                {studentName.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">{studentName}</span>
                <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">{studentEmail}</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-slate-700 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          {/* Navigation Pill Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl w-fit">
            {[
              { id: "dashboard" as TabType, label: "Ringkasan" },
              { id: "history" as TabType, label: `Riwayat (${results.length})` },
              { id: "certificates" as TabType, label: `Sertifikat (${itpResults.length})` },
            ].map(({ id, label }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {loading ? <ModernSkeleton /> : (
            <>
              {activeTab === "dashboard" && dashboardContent}
              {activeTab === "history" && historyContent}
              {activeTab === "certificates" && certificatesContent}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
