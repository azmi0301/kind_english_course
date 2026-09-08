"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  Users, Search, ChevronDown, ChevronUp, Loader2,
  RefreshCw, Trash2, Calendar, Trophy, Award,
  Sparkles, ExternalLink, CheckCircle2, QrCode
} from "lucide-react";
import Link from "next/link";

interface ExamResult {
  id: string;
  exam_title: string;
  exam_type: string;
  total_score: number;
  listening_scaled: number;
  structure_scaled: number;
  reading_scaled: number;
  submitted_at: string;
}

interface StudentRow {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  results: ExamResult[];
}

export default function StudentsPage() {
  const [students, setStudents]           = useState<StudentRow[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState("");
  const [expanded, setExpanded]           = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget]   = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting]           = useState(false);
  const [toast, setToast]                 = useState("");

  const loadData = () => {
    setLoading(true);
    fetch("/api/admin/students")
      .then((r) => r.json())
      .then(({ students }) => { setStudents(students ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/students/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast(`Akun ${deleteTarget.name} berhasil dihapus ✓`);
        loadData();
      } else {
        showToast("Gagal menghapus akun siswa.");
      }
    } catch {
      showToast("Terjadi kesalahan saat menghapus.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = students.filter((s) =>
    !search ||
    (s.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id: string) => setExpanded(expanded === id ? null : id);

  const studentsWithExams = students.filter((s) => s.results && s.results.length > 0).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            Student Directory
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Data Peserta & Hasil Ujian
          </h1>
          <p className="text-xs text-slate-500">
            Daftar seluruh siswa terdaftar, riwayat skor TOEFL ITP, dan tautan verifikasi sertifikat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:border-[#007D07] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {toast}
        </div>
      )}

      {/* Mini Stat Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Total Siswa Terdaftar</span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{students.length} Akun</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#007D07] flex items-center justify-center font-bold text-base">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Siswa Pernah Ujian</span>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{studentsWithExams} Siswa</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Status Database</span>
            <div className="text-xl font-bold text-slate-900 tracking-tight">Supabase Sync ✓</div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#007D07]" />
            Memuat data siswa dari database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            Belum ada siswa yang terdaftar atau cocok dengan pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Peserta</th>
                  <th className="py-4 px-4">Tanggal Bergabung</th>
                  <th className="py-4 px-4 text-center">Ujian Diikuti</th>
                  <th className="py-4 px-4 text-center">Skor Terakhir</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((student) => {
                  const displayName = student.name ?? student.email.split("@")[0];
                  const lastResult  = student.results[0];
                  const isExpanded  = expanded === student.id;

                  return (
                    <React.Fragment key={student.id}>
                      <tr
                        onClick={() => toggleExpand(student.id)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate">{displayName}</span>
                              <span className="text-[11px] text-slate-400 block truncate">{student.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                          {new Date(student.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px]">
                            {student.results.length} Sesi
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {lastResult ? (
                            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                              {lastResult.total_score} pt
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleExpand(student.id)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-[11px] flex items-center gap-1 transition-all"
                            >
                              Detail {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: student.id, name: displayName })}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Hapus Akun Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Results Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="bg-slate-50/80 p-6 border-b border-slate-200">
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Riwayat Ujian Lengkap: {displayName}
                              </h4>

                              {student.results.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">Siswa ini belum pernah menyelesaikan ujian.</p>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {student.results.map((r) => (
                                    <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-900 text-xs truncate">{r.exam_title}</span>
                                        <span className="text-sm font-black text-[#007D07]">{r.total_score}</span>
                                      </div>
                                      <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                                        <div className="bg-purple-50 text-purple-700 p-1.5 rounded-lg font-bold">
                                          L: {r.listening_scaled}
                                        </div>
                                        <div className="bg-blue-50 text-blue-700 p-1.5 rounded-lg font-bold">
                                          S: {r.structure_scaled}
                                        </div>
                                        <div className="bg-emerald-50 text-[#007D07] p-1.5 rounded-lg font-bold">
                                          R: {r.reading_scaled}
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                                        <span>{new Date(r.submitted_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                                        <Link
                                          href={`/verify/${r.id}`}
                                          target="_blank"
                                          className="text-[#007D07] font-bold hover:underline flex items-center gap-0.5"
                                        >
                                          <QrCode className="w-3 h-3" /> Verifikasi
                                        </Link>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Hapus Akun Siswa?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Akun <strong>{deleteTarget.name}</strong> dan seluruh riwayat ujiannya akan dihapus permanen.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm disabled:opacity-50"
              >
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
