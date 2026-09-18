"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield, User, Search, Loader2, CheckCircle2, XCircle, Crown, RefreshCw,
  UserCheck, ShieldAlert, Sparkles, AlertCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserRow {
  id: string;
  name: string | null;
  full_name?: string | null;
  email: string;
  role: "admin" | "student";
  created_at: string;
}

export default function AdminsPage() {
  const router = useRouter();
  const [users, setUsers]       = useState<UserRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{ user: UserRow; action: "promote" | "demote" } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      setCurrentUserId(session.user.id);

      const res = await fetch("/api/admin/admins");
      const json = await res.json();
      setUsers(json.users ?? []);
    } catch {
      showToast("Gagal memuat data administrator.", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const executeToggleRole = async (user: UserRow) => {
    const newRole = user.role === "admin" ? "student" : "admin";
    setUpdating(user.id);
    setConfirmTarget(null);

    const res = await fetch("/api/admin/admins", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, role: newRole, requesterId: currentUserId }),
    });
    const json = await res.json();
    if (json.success) {
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
      showToast(`Berhasil: ${user.email} sekarang berstatus ${newRole === "admin" ? "Administrator" : "Student"}`, true);
    } else {
      showToast(json.error ?? "Gagal mengubah role pengguna.", false);
    }
    setUpdating(null);
  };

  const filtered = users.filter((u) =>
    !search ||
    (u.name ?? u.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const admins   = filtered.filter((u) => u.role === "admin");
  const students = filtered.filter((u) => u.role === "student");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-xl text-xs font-bold text-white transition-all animate-fade-in ${
          toast.ok ? "bg-emerald-600" : "bg-red-600"
        }`}>
          {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Security & Role Access
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Kelola Hak Akses Administrator
          </h1>
          <p className="text-xs text-slate-500">
            Atur pengguna yang memiliki wewenang mengelola bank soal, melihat hasil tes, dan mengatur jadwal login.
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

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#007D07]" />
          Memuat data administrator...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Info Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 text-xs text-blue-900 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="font-bold text-sm text-blue-950">Panduan Menambah Admin Baru</h2>
              <p className="text-blue-800 leading-relaxed">
                1. Minta calon admin mendaftar akun terlebih dahulu melalui halaman register siswa.<br />
                2. Cari akun emailnya pada tabel <strong>Daftar Akun Terdaftar (Siswa)</strong> di bawah ini, lalu klik tombol <strong>"Jadikan Admin"</strong>.
              </p>
            </div>
          </div>

          {/* Section 1: Daftar Administrator */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Crown className="w-4 h-4 text-amber-500" />
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Administrator Aktif ({admins.length})
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Nama & Email</th>
                    <th className="py-4 px-4">Role Akses</th>
                    <th className="py-4 px-4">Terdaftar Sejak</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((u) => {
                    const isSelf = u.id === currentUserId;
                    const displayName = u.name || u.full_name || u.email.split("@")[0];
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate">
                                {displayName} {isSelf && <span className="text-[10px] text-emerald-600 font-semibold">(Akun Anda)</span>}
                              </span>
                              <span className="text-[11px] text-slate-400 block truncate">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                            <Crown className="w-3 h-3 text-amber-600" />
                            Administrator
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500">
                          {new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          {!isSelf && (
                            <button
                              onClick={() => setConfirmTarget({ user: u, action: "demote" })}
                              disabled={updating === u.id}
                              className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer"
                            >
                              Cabut Hak Admin
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Siswa yang dapat dijadikan Admin */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <User className="w-4 h-4 text-slate-400" />
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Daftar Akun Terdaftar (Siswa) ({students.length})
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              {students.length === 0 ? (
                <p className="p-8 text-center text-xs text-slate-400">Tidak ada akun siswa yang sesuai dengan filter.</p>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6">Nama &amp; Email Siswa</th>
                      <th className="py-4 px-4">Role Saat Ini</th>
                      <th className="py-4 px-4">Bergabung</th>
                      <th className="py-4 px-6 text-right">Aksi Promosi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.slice(0, 15).map((u) => {
                      const displayName = u.name || u.full_name || u.email.split("@")[0];
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                {displayName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 block truncate">
                                  {displayName}
                                </span>
                                <span className="text-[11px] text-slate-400 block truncate">{u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              Student
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            {new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <button
                              onClick={() => setConfirmTarget({ user: u, action: "promote" })}
                              disabled={updating === u.id}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-[#007D07] hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition-all disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Crown className="w-3.5 h-3.5" />
                              Jadikan Admin
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmTarget && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 text-center animate-scale-in">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
              confirmTarget.action === "promote" ? "bg-emerald-50 text-[#007D07]" : "bg-red-50 text-red-600"
            }`}>
              {confirmTarget.action === "promote" ? <Crown className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {confirmTarget.action === "promote" ? "Jadikan Administrator?" : "Cabut Hak Administrator?"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {confirmTarget.action === "promote"
                  ? `Akun ${confirmTarget.user.email} akan diberikan akses penuh ke seluruh menu admin.`
                  : `Hak admin untuk ${confirmTarget.user.email} akan dicabut dan kembali menjadi siswa biasa.`}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={() => executeToggleRole(confirmTarget.user)}
                className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm ${
                  confirmTarget.action === "promote" ? "bg-[#007D07] hover:bg-[#006A06]" : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
