"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, FileQuestion, CalendarDays, TrendingUp,
  PlusCircle, ArrowRight, BookOpen, Clock,
  Headphones, AlignLeft, FileText, Loader2,
  Sparkles, CheckCircle2, ChevronRight, ShieldCheck,
  Award, PlayCircle, Hourglass, UserPlus
} from "lucide-react";

interface DashboardStats {
  totalQuestions: number;
  bySection: { listening: number; structure: number; reading: number };
  byPackage: { "itp-full-sim-01": number; "diagnostic-01": number };
  totalStudents: number;
  recentQuestions: {
    id: string;
    section: string;
    package_id: string;
    text: string;
    created_at: string;
  }[];
  recentStudents: {
    id: string;
    email: string;
    full_name: string | null;
    created_at: string;
  }[];
}

const SECTION_CONFIG = {
  listening: { label: "Listening", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: Headphones },
  structure: { label: "Structure", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: AlignLeft },
  reading:   { label: "Reading",   color: "#007D07", bg: "#f0fdf4", border: "#bbf7d0", icon: FileText },
} as const;

export default function AdminDashboardPage() {
  const [stats, setStats]       = useState<DashboardStats | null>(null);
  const [loading, setLoading]   = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    // Fetch stats
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(({ stats }) => { setStats(stats); setLoading(false); })
      .catch(() => setLoading(false));

    // Fetch sessions
    fetch("/api/admin/sessions")
      .then((r) => r.json())
      .then(({ sessions }) => { setSessions(sessions ?? []); })
      .catch(() => {});
  }, []);

  const activeSessions   = sessions.filter((s) => s.status === "active").length;
  const upcomingSessions = sessions.filter((s) => s.status === "upcoming").length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Assessment Overview
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Ringkasan Sistem & Bank Soal
          </h1>
          <p className="text-xs text-slate-500">
            Monitoring performa database, soal ujian TOEFL ITP, aktivitas siswa, dan status sesi ujian secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/dashboard/questions"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#007D07] hover:bg-[#006A06] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Tambah Soal Baru
          </Link>
          <Link
            href="/admin/dashboard/sessions"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Buat Sesi Ujian
          </Link>
        </div>
      </div>

      {/* 4 Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Siswa</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : (stats?.totalStudents ?? 0)}
            </div>
            <span className="text-[11px] text-blue-600 font-semibold block mt-1">Akun Terdaftar di Sistem</span>
          </div>
        </div>

        {/* Soal */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bank Soal</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#007D07]">
              <FileQuestion className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : (stats?.totalQuestions ?? 0)}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">Tersimpan di Supabase DB</span>
          </div>
        </div>

        {/* Sesi Ujian */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sesi Ujian Aktif</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{activeSessions} Sesi</div>
            <span className="text-[11px] text-amber-600 font-semibold block mt-1">{upcomingSessions} Sesi Mendatang</span>
          </div>
        </div>

        {/* Status Sistem */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Validasi</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">Online 100%</div>
            <span className="text-[11px] text-purple-600 font-semibold block mt-1">Autentikasi Barcode Aktif</span>
          </div>
        </div>
      </div>

      {/* Grid: Bank Soal Breakdown + Recent Students & Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Bank Soal Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Distribusi Bank Soal</h2>
                <p className="text-xs text-slate-500">Jumlah soal terdaftar berdasarkan 3 seksi utama TOEFL ITP</p>
              </div>
              <Link
                href="/admin/dashboard/questions"
                className="text-xs font-bold text-[#007D07] hover:underline flex items-center gap-1"
              >
                Kelola Soal <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Memuat data bank soal...
              </div>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                {(["listening", "structure", "reading"] as const).map((type) => {
                  const cfg   = SECTION_CONFIG[type];
                  const count = stats?.bySection[type] ?? 0;
                  const total = stats?.totalQuestions || 1;
                  const pct   = Math.round((count / total) * 100);
                  const Icon  = cfg.icon;
                  return (
                    <div
                      key={type}
                      className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: cfg.color }}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">{pct}%</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">{cfg.label}</span>
                        <div className="text-2xl font-black text-slate-900 mt-0.5">{count} <span className="text-xs text-slate-400 font-normal">soal</span></div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cfg.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recent Questions List */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Soal Terbaru yang Ditambahkan</h3>
              <div className="space-y-2.5">
                {(stats?.recentQuestions ?? []).slice(0, 4).map((q) => (
                  <div key={q.id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase" style={{
                        backgroundColor: SECTION_CONFIG[q.section as keyof typeof SECTION_CONFIG]?.bg || "#f1f5f9",
                        color: SECTION_CONFIG[q.section as keyof typeof SECTION_CONFIG]?.color || "#475569"
                      }}>
                        {q.section}
                      </span>
                      <p className="text-xs font-medium text-slate-800 truncate">{q.text || "(Soal tanpa teks pertanyaan)"}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(q.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Students & Quick Actions */}
        <div className="space-y-6">
          {/* Siswa Terbaru */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Siswa Terbaru Terdaftar</h3>
              <Link href="/admin/dashboard/students" className="text-xs text-[#007D07] font-semibold hover:underline">
                Semua Siswa
              </Link>
            </div>

            <div className="space-y-3">
              {(stats?.recentStudents ?? []).slice(0, 5).map((st) => (
                <div key={st.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {(st.full_name || st.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 truncate block">
                      {st.full_name || st.email.split("@")[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">{st.email}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(st.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sesi Ujian Aktif */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Sesi Ujian Mendatang</h3>
              <Link href="/admin/dashboard/sessions" className="text-xs text-[#007D07] font-semibold hover:underline">
                Kelola Sesi
              </Link>
            </div>

            {sessions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada sesi ujian yang dijadwalkan.</p>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 3).map((ses) => (
                  <div key={ses.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{ses.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ses.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {ses.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {ses.startDate} • {ses.packageTitle}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
