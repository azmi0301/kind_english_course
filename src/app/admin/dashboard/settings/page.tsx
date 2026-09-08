"use client";
import { useEffect, useState } from "react";
import {
  Loader2, Save, Clock, Calendar, Lock, Unlock,
  AlertCircle, Settings, ShieldCheck, CheckCircle2,
  Sparkles, ToggleLeft, ToggleRight
} from "lucide-react";

interface Settings {
  listening_minutes: number;
  structure_minutes: number;
  reading_minutes: number;
  login_schedule_enabled: boolean;
  login_start_time: string | null;
  login_end_time: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    listening_minutes: 35,
    structure_minutes: 25,
    reading_minutes: 55,
    login_schedule_enabled: false,
    login_start_time: "",
    login_end_time: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [toastError, setToastError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then(({ settings: s }) => {
        if (s) {
          const formatISOToLocal = (isoStr: string | null) => {
            if (!isoStr) return "";
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return "";
            const pad = (n: number) => String(n).padStart(2, "0");
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          };

          setSettings({
            listening_minutes: s.listening_minutes ?? 35,
            structure_minutes: s.structure_minutes ?? 25,
            reading_minutes: s.reading_minutes ?? 55,
            login_schedule_enabled: !!s.login_schedule_enabled,
            login_start_time: formatISOToLocal(s.login_start_time),
            login_end_time: formatISOToLocal(s.login_end_time),
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = (msg: string, isError = false) => {
    setToast(msg);
    setToastError(isError);
    setTimeout(() => setToast(""), 4000);
  };

  const handleSave = async () => {
    if (settings.login_schedule_enabled) {
      if (!settings.login_start_time || !settings.login_end_time) {
        showToast("Mohon lengkapi Waktu Mulai dan Waktu Selesai jadwal login.", true);
        return;
      }
      if (new Date(settings.login_start_time) >= new Date(settings.login_end_time)) {
        showToast("Waktu Selesai harus setelah Waktu Mulai.", true);
        return;
      }
    }

    setSaving(true);

    const payload = {
      listening_minutes: settings.listening_minutes,
      structure_minutes: settings.structure_minutes,
      reading_minutes: settings.reading_minutes,
      login_schedule_enabled: settings.login_schedule_enabled,
      login_start_time: settings.login_start_time
        ? new Date(settings.login_start_time).toISOString()
        : null,
      login_end_time: settings.login_end_time
        ? new Date(settings.login_end_time).toISOString()
        : null,
    };

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setSaving(false);

    if (json.error) {
      showToast("Gagal menyimpan: " + json.error, true);
    } else {
      showToast("Pengaturan berhasil disimpan ke sistem ✓");
    }
  };

  const sections = [
    {
      key: "listening_minutes" as const,
      label: "Listening Comprehension",
      desc: "Seksi 1 • Standar TOEFL ITP: 35 menit",
      color: "border-purple-200 bg-purple-50/40 text-purple-700",
    },
    {
      key: "structure_minutes" as const,
      label: "Structure & Written Expression",
      desc: "Seksi 2 • Standar TOEFL ITP: 25 menit",
      color: "border-blue-200 bg-blue-50/40 text-blue-700",
    },
    {
      key: "reading_minutes" as const,
      label: "Reading Comprehension",
      desc: "Seksi 3 • Standar TOEFL ITP: 55 menit",
      color: "border-emerald-200 bg-emerald-50/40 text-emerald-700",
    },
  ];

  const total = settings.listening_minutes + settings.structure_minutes + settings.reading_minutes;

  const now = new Date();
  const startTime = settings.login_start_time ? new Date(settings.login_start_time) : null;
  const endTime = settings.login_end_time ? new Date(settings.login_end_time) : null;

  const isLockedNow =
    settings.login_schedule_enabled &&
    (!!(startTime && now < startTime) || !!(endTime && now > endTime));

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            <Settings className="w-3.5 h-3.5" />
            System Configuration
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Pengaturan Ujian & Jadwal Login
          </h1>
          <p className="text-xs text-slate-500">
            Atur durasi per section dan jadwal ketat pembatasan akses login siswa saat ujian berlangsung.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#007D07] hover:bg-[#006A06] text-white text-xs font-bold rounded-2xl shadow-sm transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>

      {toast && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 shadow-xs animate-fade-in ${
          toastError ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-800"
        }`}>
          {toastError ? <AlertCircle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {toast}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#007D07]" />
          Memuat konfigurasi...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card 1: Pembatasan Jadwal Login Siswa */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h2 className="text-base font-bold text-slate-900">Pembatasan Jadwal Login Siswa</h2>
                </div>
                <p className="text-xs text-slate-500">
                  Jika aktif, akun siswa HANYA dapat login selama rentang waktu yang ditentukan di bawah ini (Akun admin tetap bisa login kapan saja).
                </p>
              </div>

              {/* Modern Switch Toggle */}
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, login_schedule_enabled: !s.login_schedule_enabled }))}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-xs font-bold transition-all ${
                  settings.login_schedule_enabled
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}
              >
                {settings.login_schedule_enabled ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                {settings.login_schedule_enabled ? "Jadwal Dibatasi (Aktif)" : "Bebas Login (24 Jam)"}
              </button>
            </div>

            {settings.login_schedule_enabled && (
              <div className="space-y-4 animate-fade-in">
                {/* Live Status Banner */}
                <div className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
                  isLockedNow
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}>
                  {isLockedNow ? <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" /> : <Unlock className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                  <div>
                    <span className="font-bold block">
                      {isLockedNow ? "Saat ini portal siswa TERKUNCI" : "Saat ini portal siswa DIBUKA"}
                    </span>
                    <span className="text-[11px] opacity-80">
                      {isLockedNow
                        ? "Siswa di luar jadwal akan dialihkan keluar jika mencoba login."
                        : "Siswa yang terdaftar dapat login dan mengerjakan ujian."}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Waktu Mulai Akses Login *
                    </label>
                    <input
                      type="datetime-local"
                      value={settings.login_start_time ?? ""}
                      onChange={(e) => setSettings((s) => ({ ...s, login_start_time: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#007D07] bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Waktu Selesai Akses Login *
                    </label>
                    <input
                      type="datetime-local"
                      value={settings.login_end_time ?? ""}
                      onChange={(e) => setSettings((s) => ({ ...s, login_end_time: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#007D07] bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Durasi Waktu Pengerjaan per Seksi */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Durasi Ujian per Seksi</h2>
                <p className="text-xs text-slate-500">Standar resmi TOEFL ITP adalah 115 menit.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                Total: {total} Menit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sections.map((sec) => (
                <div key={sec.key} className={`p-4 rounded-2xl border ${sec.color} space-y-3`}>
                  <span className="text-xs font-bold block">{sec.label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={settings[sec.key]}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, [sec.key]: Number(e.target.value) }))
                      }
                      className="w-20 px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-900 text-center focus:outline-none focus:border-[#007D07]"
                    />
                    <span className="text-xs font-semibold text-slate-600">Menit</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">{sec.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
