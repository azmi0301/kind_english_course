"use client";
import { useEffect, useState } from "react";
import type { QuestionType } from "@/lib/examData";
import {
  PlusCircle, Pencil, Trash2, X, Save, Search,
  Headphones, AlignLeft, FileText, ChevronDown, Loader2,
  Sparkles, CheckCircle2, Music, Upload, Layers, Radio, BookOpen
} from "lucide-react";

interface DBQuestion {
  id: string;
  package_id: string;
  section: QuestionType;
  number: number;
  text: string;
  options: Record<string, string>; // { A, B, C, D }
  answer: string;
  passage?: string;
  audio_url?: string;
  points: number;
}

type FilterType = "all" | QuestionType;

const TYPE_CONFIG: Record<QuestionType, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  listening: { label: "Listening", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: Headphones },
  structure: { label: "Structure", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: AlignLeft },
  reading:   { label: "Reading",   color: "#007D07", bg: "#f0fdf4", border: "#bbf7d0", icon: FileText },
};

const PACKAGES = [
  { id: "itp-full-sim-01", label: "TOEFL ITP Institutional Test" },
  { id: "diagnostic-01",   label: "TOEFL Diagnostic Test" },
];

const EMPTY_FORM = {
  packageId: "itp-full-sim-01",
  section: "listening" as QuestionType,
  number: 1,
  text: "",
  passage: "",
  audioUrl: "",
  options: { A: "", B: "", C: "", D: "" } as Record<string, string>,
  answer: "A",
  points: 1,
};

export default function QuestionsPage() {
  const [questions, setQuestions]         = useState<DBQuestion[]>([]);
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [uploading, setUploading]         = useState(false);
  const [uploadError, setUploadError]     = useState("");
  const [filter, setFilter]               = useState<FilterType>("all");
  const [search, setSearch]               = useState("");
  const [showModal, setShowModal]         = useState(false);
  const [editingQ, setEditingQ]           = useState<DBQuestion | null>(null);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast]                 = useState("");

  // ── State Bulk Audio Modal (Listening) ──────────────────────────────────────
  const [showBulkAudioModal, setShowBulkAudioModal] = useState(false);
  const [bulkAudioForm, setBulkAudioForm] = useState({
    packageId: "itp-full-sim-01",
    section: "listening" as QuestionType,
    startNumber: 1,
    endNumber: 20,
    audioUrl: "",
  });
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkSaving, setBulkSaving]       = useState(false);
  const [bulkError, setBulkError]         = useState("");

  // ── State Bulk Passage Modal (Reading) ──────────────────────────────────────
  const [showBulkPassageModal, setShowBulkPassageModal] = useState(false);
  const [bulkPassageForm, setBulkPassageForm] = useState({
    packageId: "itp-full-sim-01",
    section: "reading" as QuestionType,
    startNumber: 1,
    endNumber: 10,
    passage: "",
  });
  const [bulkPassageSaving, setBulkPassageSaving] = useState(false);
  const [bulkPassageError, setBulkPassageError]   = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/questions");
      const json = await res.json();
      const list: DBQuestion[] = json.questions ?? [];
      list.sort((a, b) => (a.number || 0) - (b.number || 0));
      setQuestions(list);
    } catch {
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  const filtered = questions.filter((q) => {
    const matchType   = filter === "all" || q.section === filter;
    const matchSearch = !search || q.text.toLowerCase().includes(search.toLowerCase()) || (q.passage && q.passage.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  const counts: Record<FilterType, number> = {
    all:       questions.length,
    reading:   questions.filter((q) => q.section === "reading").length,
    structure: questions.filter((q) => q.section === "structure").length,
    listening: questions.filter((q) => q.section === "listening").length,
  };

  const openAdd = () => {
    const activeSec = filter === "all" ? "listening" : filter;
    const sectionQs = questions.filter((q) => q.section === activeSec);
    const nextNum = sectionQs.length > 0 ? Math.max(...sectionQs.map((q) => q.number || 0)) + 1 : 1;

    setEditingQ(null);
    setForm({
      ...EMPTY_FORM,
      section: activeSec,
      number: nextNum,
    });
    setUploadError("");
    setShowModal(true);
  };

  const openEdit = (q: DBQuestion) => {
    setEditingQ(q);
    setForm({
      packageId: q.package_id,
      section:   q.section,
      number:    q.number ?? 1,
      text:      q.text,
      passage:   q.passage ?? "",
      audioUrl:  q.audio_url ?? "",
      options:   { ...q.options },
      answer:    q.answer,
      points:    q.points ?? 1,
    });
    setUploadError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.text.trim() || Object.values(form.options).some((v) => !v.trim())) return;
    setSaving(true);

    const payload = {
      packageId: form.packageId,
      section:   form.section,
      number:    Number(form.number),
      text:      form.text,
      options:   form.options,
      answer:    form.answer,
      passage:   form.passage ? form.passage : undefined,
      audioUrl:  form.section === "listening" ? form.audioUrl : undefined,
      points:    form.points,
    };

    if (editingQ) {
      await fetch(`/api/admin/questions/${editingQ.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    await fetchQuestions();
    setSaving(false);
    setShowModal(false);
    showToast(editingQ ? `Soal No. ${form.number} berhasil diperbarui ✓` : `Soal No. ${form.number} berhasil ditambahkan ✓`);
  };

  const handleSaveAndAddMore = async () => {
    if (!form.text.trim() || Object.values(form.options).some((v) => !v.trim())) return;
    setSaving(true);
    await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        packageId: form.packageId,
        section:   form.section,
        number:    Number(form.number),
        text:      form.text,
        options:   form.options,
        answer:    form.answer,
        passage:   form.passage ? form.passage : undefined,
        audioUrl:  form.section === "listening" ? form.audioUrl : undefined,
        points:    form.points,
      }),
    });
    await fetchQuestions();
    setSaving(false);

    // Pertahankan audioUrl dan passage, otomatis naikkan nomor soal + 1
    const nextNum = Number(form.number) + 1;
    setForm((prev) => ({
      ...EMPTY_FORM,
      packageId: prev.packageId,
      section: prev.section,
      number: nextNum,
      audioUrl: prev.section === "listening" ? prev.audioUrl : "",
      passage: prev.passage || "",
      points: prev.points,
    }));
    showToast(`✓ Soal No. ${form.number} tersimpan! Lanjut input Soal No. ${nextNum}`);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    await fetchQuestions();
    setDeleteConfirm(null);
    showToast("Soal berhasil dihapus dari database.");
  };

  const handleAudioUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) {
      setUploadError(json.error ?? "Upload gagal");
    } else {
      setForm((f) => ({ ...f, audioUrl: json.url }));
    }
  };

  const handleBulkAudioUpload = async (file: File) => {
    setBulkUploading(true);
    setBulkError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    setBulkUploading(false);
    if (!res.ok) {
      setBulkError(json.error ?? "Upload gagal");
    } else {
      setBulkAudioForm((f) => ({ ...f, audioUrl: json.url }));
    }
  };

  const handleApplyBulkAudio = async () => {
    if (!bulkAudioForm.audioUrl.trim()) {
      setBulkError("Harap upload file MP3 atau masukkan link URL audio.");
      return;
    }
    setBulkSaving(true);
    setBulkError("");
    try {
      const res = await fetch("/api/admin/questions/bulk-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bulkAudioForm),
      });
      const json = await res.json();
      if (res.ok) {
        showToast(json.message || "Audio berhasil diterapkan ke rentang soal!");
        setShowBulkAudioModal(false);
        await fetchQuestions();
      } else {
        setBulkError(json.error || "Gagal menerapkan audio");
      }
    } catch {
      setBulkError("Terjadi gangguan koneksi");
    } finally {
      setBulkSaving(false);
    }
  };

  const handleApplyBulkPassage = async () => {
    if (!bulkPassageForm.passage.trim()) {
      setBulkPassageError("Harap masukkan teks cerita/passage.");
      return;
    }
    setBulkPassageSaving(true);
    setBulkPassageError("");
    try {
      const res = await fetch("/api/admin/questions/bulk-passage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bulkPassageForm),
      });
      const json = await res.json();
      if (res.ok) {
        showToast(json.message || "Teks cerita berhasil diterapkan ke rentang soal Reading!");
        setShowBulkPassageModal(false);
        await fetchQuestions();
      } else {
        setBulkPassageError(json.error || "Gagal menerapkan teks cerita");
      }
    } catch {
      setBulkPassageError("Terjadi gangguan koneksi");
    } finally {
      setBulkPassageSaving(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Supabase Question Repository
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Bank Soal Ujian TOEFL ITP
          </h1>
          <p className="text-xs text-slate-500">
            Kelola seluruh butir soal Listening, Structure, dan Reading dengan opsi audio stream, cerita/passage, nomor soal, dan batch update.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tombol Atur Audio Rentang Soal (Listening) */}
          <button
            onClick={() => {
              setBulkError("");
              setShowBulkAudioModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold rounded-2xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Terapkan 1 file audio ke banyak nomor soal sekaligus (Listening)"
          >
            <Radio className="w-4 h-4 text-purple-600" />
            Atur Audio Rentang Soal
          </button>

          {/* Tombol Atur Cerita Rentang Soal (Reading) */}
          <button
            onClick={() => {
              setBulkPassageError("");
              setShowBulkPassageModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-[#007D07] border border-emerald-200 text-xs font-bold rounded-2xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Terapkan 1 teks cerita/passage ke banyak nomor soal sekaligus (Reading)"
          >
            <BookOpen className="w-4 h-4 text-[#007D07]" />
            Atur Cerita Rentang Soal
          </button>

          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#007D07] hover:bg-[#006A06] text-white text-xs font-bold rounded-2xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            Tambah Soal Baru
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {toast}
        </div>
      )}

      {/* Controls Bar: Section Pills & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "listening", "structure", "reading"] as FilterType[]).map((t) => {
            const cfg = t !== "all" ? TYPE_CONFIG[t] : null;
            const active = filter === t;
            return (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t === "all" ? "Semua Seksi" : cfg!.label}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  active ? "bg-white/20 text-white" : "bg-white text-slate-700"
                }`}>
                  {counts[t]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari teks soal atau passage..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:border-[#007D07] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Questions Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 w-16">No.</th>
                <th className="py-4 px-4 w-36">Seksi</th>
                <th className="py-4 px-4">Pertanyaan & Konten</th>
                <th className="py-4 px-4 text-center w-24">Poin</th>
                <th className="py-4 px-4 text-center w-24">Kunci</th>
                <th className="py-4 px-6 text-right w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#007D07]" />
                    Memuat bank soal dari Supabase...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 space-y-3">
                    <FileText className="w-10 h-10 text-slate-200 mx-auto" />
                    <p className="font-semibold text-slate-600">Tidak ada soal yang sesuai dengan filter.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((q) => {
                  const cfg  = TYPE_CONFIG[q.section];
                  const Icon = cfg.icon;
                  return (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-700 text-xs">
                        No. {q.number || "-"}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border"
                          style={{ backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 max-w-md">
                        <p className="font-semibold text-slate-900 leading-snug line-clamp-2">{q.text}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                          {q.passage && (
                            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-medium text-[10px]">
                              <FileText className="w-3 h-3 text-[#007D07]" /> Cerita / Passage Terpasang
                            </span>
                          )}
                          {q.audio_url && (
                            <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md font-mono text-[10px]" title={q.audio_url}>
                              <Music className="w-3 h-3 text-purple-600" /> Audio Stream Aktif
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-700">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px]">
                          {q.points ?? 1} pt
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs inline-flex items-center justify-center border border-emerald-200">
                          {q.answer}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(q)}
                            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Soal"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(q.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Soal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Add / Edit Question ────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 border border-slate-200 overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {editingQ ? `Edit Butir Soal No. ${form.number}` : "Tambah Soal Baru"}
                </h3>
                <p className="text-xs text-slate-500">Atur nomor soal, seksi ujian, konten soal, pilihan jawaban & kunci resmi.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Seksi, Nomor Soal & Poin */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Seksi Ujian *
                  </label>
                  <select
                    value={form.section}
                    onChange={(e) => {
                      const newSec = e.target.value as QuestionType;
                      const secQs = questions.filter((q) => q.section === newSec);
                      const nextNum = secQs.length > 0 ? Math.max(...secQs.map((q) => q.number || 0)) + 1 : 1;
                      setForm((f) => ({ ...f, section: newSec, number: editingQ ? f.number : nextNum }));
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#007D07] bg-slate-50"
                  >
                    <option value="listening">Listening Comprehension</option>
                    <option value="structure">Structure & Expression</option>
                    <option value="reading">Reading Comprehension</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nomor Urut Soal *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={form.number}
                    onChange={(e) => setForm((f) => ({ ...f, number: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#007D07] bg-slate-50 text-slate-900"
                    placeholder="Contoh: 1, 2, 31..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Bobot Poin
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.points}
                    onChange={(e) => setForm((f) => ({ ...f, points: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#007D07] bg-slate-50"
                  />
                </div>
              </div>

              {/* Passage (Khusus Reading) */}
              {form.section === "reading" && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Teks Cerita / Passage (Reading)
                  </label>
                  <textarea
                    rows={5}
                    value={form.passage}
                    onChange={(e) => setForm((f) => ({ ...f, passage: e.target.value }))}
                    placeholder="Tempel teks bacaan / passage di sini. Cerita ini akan tampil di samping soal saat siswa mengerjakan ujian..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#007D07] bg-slate-50 font-sans leading-relaxed"
                  />
                  <div className="text-[11px] text-emerald-800 bg-emerald-50/80 border border-emerald-200 p-3 rounded-2xl leading-relaxed">
                    💡 <strong>Tips 1 Cerita untuk Banyak Soal (Reading):</strong> Masukkan teks cerita di sini, lalu klik <strong>"Simpan & Tambah Lagi"</strong> di bawah. Teks cerita akan otomatis tetap terisi untuk soal-soal berikutnya tanpa perlu Anda ketik ulang, atau gunakan tombol <strong>"Atur Cerita Rentang Soal"</strong> di halaman utama.
                  </div>
                </div>
              )}

              {/* Audio URL / Upload (Khusus Listening) */}
              {form.section === "listening" && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Audio Stream URL (Listening)
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={form.audioUrl}
                      onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
                      placeholder="https://... / audio file url"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#007D07] bg-slate-50 font-mono"
                    />
                    <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      {uploading ? "Uploading..." : "Upload MP3"}
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0])}
                      />
                    </label>
                  </div>
                  <div className="text-[11px] text-purple-800 bg-purple-50/80 border border-purple-100 p-3 rounded-2xl leading-relaxed">
                    💡 <strong>Tips 1 Audio untuk Banyak Soal (Listening):</strong> Masukkan file audio di sini, lalu klik <strong>"Simpan & Tambah Lagi"</strong> di bawah (URL audio akan otomatis tersimpan untuk nomor berikutnya), atau gunakan tombol <strong>"Atur Audio Rentang Soal"</strong> di halaman utama.
                  </div>
                  {uploadError && <p className="text-xs text-red-500 font-semibold">{uploadError}</p>}

                  {/* Teks Petunjuk / Directions Khusus (Part B / Part C) */}
                  <div className="pt-2 space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Teks Petunjuk / Directions Part (Opsional, misal Part B / Part C)
                    </label>
                    <textarea
                      rows={3}
                      value={form.passage}
                      onChange={(e) => setForm((f) => ({ ...f, passage: e.target.value }))}
                      placeholder="Contoh: In this part of the test, you will hear longer conversations. Questions 31 through 34..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#007D07] bg-slate-50 font-sans leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-500">
                      Jika diisi, teks ini akan tampil otomatis dalam kotak petunjuk Part (misal Part B / Part C) di atas pemutar audio saat siswa mengerjakan soal ini.
                    </p>
                  </div>
                </div>
              )}

              {/* Teks Pertanyaan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Teks Pertanyaan / Soal *
                </label>
                <textarea
                  rows={3}
                  value={form.text}
                  onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                  placeholder="Tuliskan pertanyaan soal..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#007D07] bg-slate-50"
                />
              </div>

              {/* Pilihan Jawaban A, B, C, D */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Pilihan Jawaban & Kunci * (Klik huruf untuk kunci jawaban)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(["A", "B", "C", "D"] as const).map((opt) => (
                    <div
                      key={opt}
                      className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                        form.answer === opt ? "border-emerald-500 bg-emerald-50/40" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, answer: opt }))}
                        className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center flex-shrink-0 transition-all ${
                          form.answer === opt
                            ? "bg-[#007D07] text-white shadow-xs"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                        title="Jadikan Kunci Jawaban"
                      >
                        {opt}
                      </button>
                      <input
                        value={form.options[opt] ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            options: { ...f.options, [opt]: e.target.value },
                          }))
                        }
                        placeholder={`Opsi ${opt}...`}
                        className="w-full bg-transparent text-xs font-medium focus:outline-none text-slate-900"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              {!editingQ && (
                <button
                  type="button"
                  onClick={handleSaveAndAddMore}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Simpan & Tambah No. {Number(form.number) + 1}
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#007D07] hover:bg-[#006A06] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Soal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Bulk Audio (Atur 1 Audio ke Rentang Soal) ──────────────────── */}
      {showBulkAudioModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 border border-slate-200 overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-purple-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Atur Audio Rentang Soal</h3>
                  <p className="text-xs text-slate-500">Terapkan 1 file audio ke banyak nomor soal Listening sekaligus.</p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkAudioModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-5">
              {/* Rentang Nomor Soal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rentang Nomor Soal Listening
                </label>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">Dari Nomor:</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={bulkAudioForm.startNumber}
                      onChange={(e) => setBulkAudioForm((f) => ({ ...f, startNumber: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-purple-600 bg-slate-50 text-slate-900"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">Sampai Nomor:</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={bulkAudioForm.endNumber}
                      onChange={(e) => setBulkAudioForm((f) => ({ ...f, endNumber: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-purple-600 bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Contoh: Dari Nomor <strong>1</strong> sampai Nomor <strong>20</strong>, atau Dari Nomor <strong>31</strong> sampai <strong>34</strong>.
                </p>
              </div>

              {/* Upload / Paste Audio */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  File / URL Audio MP3
                </label>
                <div className="flex gap-2">
                  <input
                    value={bulkAudioForm.audioUrl}
                    onChange={(e) => setBulkAudioForm((f) => ({ ...f, audioUrl: e.target.value }))}
                    placeholder="https://... atau klik tombol upload"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600 bg-slate-50 font-mono"
                  />
                  <label className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {bulkUploading ? "Uploading..." : "Upload MP3"}
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleBulkAudioUpload(e.target.files[0])}
                    />
                  </label>
                </div>
                {bulkError && <p className="text-xs text-red-500 font-semibold">{bulkError}</p>}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 space-y-1">
                <p className="font-bold">⚡ Informasi Otomatis:</p>
                <p className="text-[11px] leading-relaxed">
                  Semua soal seksi Listening dari No. <strong>{bulkAudioForm.startNumber}</strong> s/d <strong>{bulkAudioForm.endNumber}</strong> akan diupdate dengan file audio ini. Saat siswa ujian, suara audio akan terus memutar tanpa putus selagi siswa berpindah-pindah nomor tersebut.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBulkAudioModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyBulkAudio}
                disabled={bulkSaving || bulkUploading}
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {bulkSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menerapkan...
                  </>
                ) : (
                  `Terapkan ke Soal No. ${bulkAudioForm.startNumber} s/d ${bulkAudioForm.endNumber}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Bulk Passage (Atur 1 Cerita ke Rentang Soal Reading) ─────────── */}
      {showBulkPassageModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-8 border border-slate-200 overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#007D07] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Atur Cerita Rentang Soal (Reading)</h3>
                  <p className="text-xs text-slate-500">Terapkan 1 teks bacaan/passage ke banyak nomor soal Reading sekaligus.</p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkPassageModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-5">
              {/* Rentang Nomor Soal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rentang Nomor Soal Reading
                </label>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">Dari Nomor:</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={bulkPassageForm.startNumber}
                      onChange={(e) => setBulkPassageForm((f) => ({ ...f, startNumber: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#007D07] bg-slate-50 text-slate-900"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">Sampai Nomor:</span>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={bulkPassageForm.endNumber}
                      onChange={(e) => setBulkPassageForm((f) => ({ ...f, endNumber: Number(e.target.value) }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#007D07] bg-slate-50 text-slate-900"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Contoh: Dari Nomor <strong>1</strong> sampai Nomor <strong>10</strong> (Passage 1), Nomor <strong>11</strong> sampai <strong>20</strong> (Passage 2), dst.
                </p>
              </div>

              {/* Teks Cerita / Passage */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Teks Cerita / Passage Reading
                </label>
                <textarea
                  rows={6}
                  value={bulkPassageForm.passage}
                  onChange={(e) => setBulkPassageForm((f) => ({ ...f, passage: e.target.value }))}
                  placeholder="Tempel teks cerita / bacaan panjang di sini..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#007D07] bg-slate-50 font-sans leading-relaxed"
                />
                {bulkPassageError && <p className="text-xs text-red-500 font-semibold">{bulkPassageError}</p>}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold">⚡ Informasi Otomatis:</p>
                <p className="text-[11px] leading-relaxed">
                  Semua soal Reading dari No. <strong>{bulkPassageForm.startNumber}</strong> s/d <strong>{bulkPassageForm.endNumber}</strong> akan menampilkan teks cerita ini di sebelah kiri layar soal secara terus-menerus.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBulkPassageModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyBulkPassage}
                disabled={bulkPassageSaving}
                className="px-6 py-2.5 rounded-xl bg-[#007D07] hover:bg-[#006A06] text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {bulkPassageSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Menerapkan...
                  </>
                ) : (
                  `Terapkan ke Soal Reading No. ${bulkPassageForm.startNumber} s/d ${bulkPassageForm.endNumber}`
                )}
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
              <h3 className="font-bold text-slate-900 text-base">Hapus Soal Ini?</h3>
              <p className="text-xs text-slate-500 mt-1">Soal akan dihapus permanen dari basis data Supabase.</p>
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
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
