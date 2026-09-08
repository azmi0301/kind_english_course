"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadSession } from "@/lib/autoSave";
import { EXAM_PACKAGES, FULL_ITP_EXAM, type ExamPackage } from "@/lib/examData";
import { calculateITPScore } from "@/lib/scoreCalculator";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle, BarChart3, Home, RefreshCw, Trophy, Loader2 } from "lucide-react";

export default function ResultsPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const [examFromDb, setExamFromDb] = useState<ExamPackage | null>(null);
  const [loadingExam, setLoadingExam] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  // Fetch exam dari DB agar ID soal cocok dengan session.answers
  useEffect(() => {
    if (!sessionId) return;
    const pkgId = sessionId as string;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    fetch(`${baseUrl}/api/exam/${pkgId}`, { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.exam) setExamFromDb(data.exam);
      })
      .catch(() => {})
      .finally(() => setLoadingExam(false));
  }, [sessionId]);

  // Fallback save: simpan ke DB dari results page jika ExamEngine gagal simpan
  useEffect(() => {
    if (!mounted || loadingExam || !examFromDb) return;
    const pkgId = sessionId as string;
    const localSession = loadSession(pkgId);
    if (!localSession || localSession.status !== "completed") return;

    async function trySave() {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession?.user) return;

      // Cek apakah hasil sudah tersimpan (cegah duplikat)
      const { data: existing } = await supabase
        .from("exam_results")
        .select("id")
        .eq("user_id", authSession.user.id)
        .eq("package_id", pkgId)
        .eq("started_at", localSession!.startedAt)
        .maybeSingle();

      if (existing) return; // sudah tersimpan, skip

      setSaving(true);
      const sections = examFromDb!.sections;
      const getScore = (type: string) => {
        const sec = sections.find((s) => s.type === type);
        if (!sec) return { raw: 0, total: 0 };
        const raw = sec.questions.filter((q) => localSession!.answers[q.id] === q.correctAnswer).length;
        return { raw, total: sec.questions.length };
      };
      const L = getScore("listening");
      const S = getScore("structure");
      const R = getScore("reading");
      const score = calculateITPScore(L.raw, L.total || 1, S.raw, S.total || 1, R.raw, R.total || 1);

      try {
        await supabase.from("exam_results").insert({
          user_id: authSession.user.id,
          package_id: pkgId,
          exam_title: examFromDb!.title,
          exam_type: (examFromDb as { type?: string }).type ?? "ITP",
          answers: localSession!.answers,
          listening_raw: L.raw, listening_total: L.total, listening_scaled: score.listening.scaled,
          structure_raw: S.raw, structure_total: S.total, structure_scaled: score.structure.scaled,
          reading_raw: R.raw, reading_total: R.total, reading_scaled: score.reading.scaled,
          total_score: score.total,
          level: score.level,
          duration_minutes: 115,
          certificate_ready: true,
          started_at: localSession!.startedAt,
          submitted_at: localSession!.lastSavedAt,
        });
        setSavedToDb(true);
      } catch (err) {
        console.warn("Fallback save failed:", err);
      } finally {
        setSaving(false);
      }
    }
    trySave();
  }, [mounted, loadingExam, examFromDb, sessionId]);

  if (!mounted || loadingExam) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#007D07] animate-spin" />
      </div>
    );
  }

  const session = loadSession(sessionId as string);
  // Pakai exam dari DB jika ada, fallback ke hardcoded
  const hardcodedExam = EXAM_PACKAGES.find((p) => p.id === (session?.examId ?? sessionId)) ?? FULL_ITP_EXAM;
  const exam = examFromDb ?? hardcodedExam;

  if (!session) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-neutral-600 mb-4">Sesi ujian tidak ditemukan.</p>
          <Link href="/" className="text-[#007D07] font-semibold underline">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  // Calculate scores per section
  const sectionResults = exam.sections.map((section) => {
    const correct = section.questions.filter(
      (q) => session.answers[q.id] === q.correctAnswer
    ).length;
    return {
      title: section.title,
      type: section.type,
      correct,
      total: section.questions.length,
      percentage: Math.round((correct / section.questions.length) * 100),
    };
  });

  const listening = sectionResults.find((s) => s.type === "listening");
  const structure = sectionResults.find((s) => s.type === "structure");
  const reading = sectionResults.find((s) => s.type === "reading");

  const score = calculateITPScore(
    listening?.correct ?? 0, listening?.total ?? 1,
    structure?.correct ?? 0, structure?.total ?? 1,
    reading?.correct ?? 0, reading?.total ?? 1
  );

  const sectionColors: Record<string, string> = {
    listening: "bg-purple-100 text-purple-700",
    structure: "bg-blue-100 text-blue-700",
    reading: "bg-[#E8F5E9] text-[#007D07]",
  };

  const sectionBarColors: Record<string, string> = {
    listening: "bg-purple-400",
    structure: "bg-blue-400",
    reading: "bg-[#007D07]",
  };

  const sectionLabels: Record<string, string> = {
    listening: "Listening",
    structure: "Structure",
    reading: "Reading",
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-[#007D07]/10 flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-10 h-10 text-[#007D07]" />
          </div>
          <h1 className="font-heading font-900 text-3xl text-neutral-900 mb-2">Hasil Ujianmu Sudah Siap!</h1>
          <p className="text-neutral-600">{exam.title}</p>
          {saving && (
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-neutral-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Menyimpan ke akunmu...
            </div>
          )}
          {savedToDb && (
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-[#007D07] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tersimpan ke dashboard
            </div>
          )}
        </div>

        {/* Total Score Card */}
        <div className="bg-white rounded-2xl border-2 border-[#007D07] shadow-brand p-8 text-center mb-6">
          <div className="text-6xl font-heading font-900 text-[#007D07] mb-2">{score.total}</div>
          <div className="text-neutral-500 text-sm mb-3">Total Skor TOEFL ITP (310–677)</div>
          <div className="inline-flex px-4 py-1.5 bg-[#E8F5E9] rounded-full text-[#007D07] font-semibold text-sm">
            {score.level}
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {sectionResults.map((sr) => (
            <div key={sr.type} className="bg-white rounded-2xl border border-neutral-200 p-5">
              <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold mb-3 ${sectionColors[sr.type] ?? "bg-neutral-100 text-neutral-600"}`}>
                {sectionLabels[sr.type] ?? sr.type}
              </div>
              <div className="text-2xl font-heading font-800 text-neutral-900 mb-1">
                {sr.correct}/{sr.total}
              </div>
              <div className="text-xs text-neutral-500 mb-3">{sr.percentage}% benar</div>
              {/* Progress bar */}
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${sectionBarColors[sr.type] ?? "bg-neutral-400"}`}
                  style={{ width: `${sr.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Question-by-question review */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6">
          <h2 className="font-heading font-700 text-neutral-900 text-base mb-5">Review Jawaban</h2>
          <div className="space-y-6">
            {exam.sections.map((section) => (
              <div key={section.id}>
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">{section.title}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {section.questions.map((q, idx) => {
                    const userAnswer = session.answers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                      <div
                        key={q.id}
                        className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
                          isCorrect ? "bg-[#E8F5E9] text-[#007D07]" : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span>No.{idx + 1}: {userAnswer ?? "–"} {!isCorrect && `→ ${q.correctAnswer}`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 flex-1 py-3 px-5 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-sm hover:bg-neutral-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 flex-1 py-3 px-5 rounded-xl border border-[#007D07] text-[#007D07] font-semibold text-sm hover:bg-[#E8F5E9] transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Lihat Dashboard
          </Link>
          <button
            onClick={() => router.push(`/exam/${exam.id}`)}
            className="flex items-center justify-center gap-2 flex-1 py-3 px-5 rounded-xl bg-[#007D07] text-white font-semibold text-sm hover:bg-[#006A06] transition-colors shadow-brand"
          >
            <RefreshCw className="w-4 h-4" />
            Ulangi Ujian
          </button>
        </div>
      </div>
    </div>
  );
}

