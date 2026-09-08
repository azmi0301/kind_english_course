"use client";
import { useEffect, useState } from "react";
import {
  PlusCircle, Trash2, X, Save, CalendarDays,
  Users, Clock, CheckCircle2, PlayCircle, Hourglass, Loader2,
  Sparkles, Calendar, Layers
} from "lucide-react";

export interface ExamSession {
  id: string;
  title: string;
  packageId: string;
  packageTitle: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
  participantCount: number;
  createdAt: string;
}

const STATUS_CONFIG = {
  active: { label: "Sedang Aktif", color: "#007D07", bg: "#f0fdf4", border: "#bbf7d0", icon: PlayCircle },
  upcoming: { label: "Akan Datang", color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: Hourglass },
  completed: { label: "Selesai", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", icon: CheckCircle2 },
};

const PACKAGES = [
  { id: "itp-full-sim-01", title: "TOEFL ITP Institutional Test", description: "Complete official test package with Listening, Structure, Reading" },
  { id: "diagnostic-01", title: "TOEFL Diagnostic Test", description: "Assessment test for skill levels" },
];

const EMPTY_FORM = {
  title: "",
  packageId: "itp-full-sim-01",
  packageTitle: "TOEFL ITP Institutional Test",
  startDate: "",
  endDate: "",
  status: "upcoming" as ExamSession["status"],
};

export default function SessionsPage() {
  const [sessions, setSessions]           = useState<ExamSession[]>([]);
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [showModal, setShowModal]         = useState(false);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [savedMsg, setSavedMsg]           = useState("");
  const [filterStatus, setFilterStatus]   = useState<"all" | ExamSession["status"]>("all");

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sessions");
      const json = await res.json();
      setSessions(json.sessions ?? []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const filtered =
    filterStatus === "all" ? sessions : sessions.filter((s) => s.status === filterStatus);

  const handleSave = async () => {
    if (!form.title.trim() || !form.packageId || !form.startDate || !form.endDate) return;
    setSaving(true);
    const pkg = PACKAGES.find((p) => p.id === form.packageId);

    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          packageId: form.packageId,
          packageTitle: pkg?.title ?? form.packageId,
          startDate: form.startDate,
          endDate: form.endDate,
          status: form.status,
        }),
      });

      if (res.ok) {
        setSavedMsg("✓ Sesi ujian berhasil disimpan ke database.");
        setShowModal(false);
        setForm(EMPTY_FORM);
        loadSessions();
        setTimeout(() => setSavedMsg(""), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/sessions/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      loadSessions();
      setSavedMsg("Sesi ujian berhasil dihapus.");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const counts = {
    all: sessions.length,
    active: sessions.filter((s) => s.status === "active").length,
    upcoming: sessions.filter((s) => s.status === "upcoming").length,
    completed: sessions.filter((s) => s.status === "completed").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider">
            <CalendarDays className="w-3.5 h-3.5" />
            Session Scheduling
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Sesi Ujian TOEFL ITP
          </h1>
          <p className="text-xs text-slate-500">
            Jadwalkan periode tes, pilih paket soal, dan pantau status pelaksanaan ujian di platform.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#007D07] hover:bg-[#006A06] text-white text-xs font-bold rounded-2xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          Buat Sesi Baru
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {savedMsg}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs w-fit">
        {(["all", "active", "upcoming", "completed"] as const).map((st) => {
          const active = filterStatus === st;
          const label = st === "all" ? "Semua Sesi" : STATUS_CONFIG[st].label;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                active
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
              }`}>
                {counts[st]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#007D07]" />
          Memuat jadwal sesi ujian...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center text-slate-400 space-y-3">
          <CalendarDays className="w-12 h-12 text-slate-200 mx-auto" />
          <p className="font-semibold text-slate-600">Belum ada sesi ujian dalam kategori ini.</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#007D07] text-white text-xs font-bold rounded-xl"
          >
            <PlusCircle className="w-4 h-4" /> Buat Sesi Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((session) => {
            const cfg = STATUS_CONFIG[session.status];
            const StatusIcon = cfg.icon;
            return (
              <div
                key={session.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-lg hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border"
                      style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>
                    <button
                      onClick={() => setDeleteConfirm(session.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus Sesi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{session.title}</h3>
                    <span className="text-xs font-semibold text-[#007D07] mt-1 block">
                      {session.packageTitle}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Tanggal Mulai
                    </span>
                    <span className="font-semibold text-slate-800">{session.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Tanggal Selesai
                    </span>
                    <span className="font-semibold text-slate-800">{session.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> Peserta Terdaftar
                    </span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                      {session.participantCount ?? 0} Siswa
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Buat Sesi */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Buat Sesi Ujian Baru</h3>
                <p className="text-xs text-slate-500">Tentukan nama sesi, paket soal, dan jadwal pelaksanaan.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Sesi Ujian *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="misal: TOEFL ITP September 2026 Batch 1"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#007D07] bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pilih Paket Soal *
                </label>
                <select
                  value={form.packageId}
                  onChange={(e) => {
                    const p = PACKAGES.find((pkg) => pkg.id === e.target.value);
                    setForm((f) => ({
                      ...f,
                      packageId: e.target.value,
                      packageTitle: p?.title ?? e.target.value,
                    }));
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#007D07] bg-slate-50"
                >
                  {PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#007D07] bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Tanggal Selesai *
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#007D07] bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Status Pelaksanaan
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ExamSession["status"] }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#007D07] bg-slate-50"
                >
                  <option value="active">🟢 Sedang Aktif (Dapat Diakses)</option>
                  <option value="upcoming">🟡 Akan Datang (Dijadwalkan)</option>
                  <option value="completed">⚪ Selesai</option>
                </select>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#007D07] hover:bg-[#006A06] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Sesi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Hapus Sesi Ujian?</h3>
              <p className="text-xs text-slate-500 mt-1">Sesi ujian ini akan dihapus dari sistem.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm"
              >
                Hapus Sesi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
