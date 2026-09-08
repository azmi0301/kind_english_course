"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ExamPackage } from "@/lib/examData";
import { saveSession, loadSession, createSession } from "@/lib/autoSave";
import { calculateITPScore } from "@/lib/scoreCalculator";
import { supabase } from "@/lib/supabase";
import ExamHeader from "./ExamHeader";
import ReadingModule from "./ReadingModule";
import ListeningModule from "./ListeningModule";
import StructureModule from "./StructureModule";
import QuestionPalette from "./QuestionPalette";
import { AlertTriangle, CheckCircle2, X, ClipboardList, Flag, ShieldAlert } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ExamEngineProps {
  exam: ExamPackage;
  sessionId: string;
}

// ─── Submit Confirmation Dialog ───────────────────────────────────────────────
function SubmitDialog({
  unanswered,
  onConfirm,
  onCancel,
}: {
  unanswered: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="font-heading font-700 text-neutral-900 text-lg mb-2">Kumpulkan Ujian?</h2>

        {unanswered > 0 ? (
          <p className="text-neutral-600 text-sm mb-6">
            Kamu masih memiliki{" "}
            <strong className="text-amber-600">{unanswered} soal belum dijawab</strong>.
            Soal yang tidak dijawab akan dianggap salah. Yakin ingin mengumpulkan?
          </p>
        ) : (
          <p className="text-neutral-600 text-sm mb-6">
            Semua soal sudah dijawab. Kumpulkan ujian dan lihat hasilmu?
          </p>
        )}

        <div className="flex gap-3">
          <button
            id="confirm-cancel"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-sm hover:bg-neutral-50 transition-colors"
          >
            Lanjut Mengerjakan
          </button>
          <button
            id="confirm-submit"
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-[#007D07] text-white font-semibold text-sm hover:bg-[#006A06] transition-colors shadow-sm"
          >
            Ya, Kumpulkan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Exit Confirmation Dialog ─────────────────────────────────────────────────
function ExitDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="font-heading font-700 text-neutral-900 text-lg mb-2">Keluar dari Ujian?</h2>
        <p className="text-neutral-600 text-sm mb-6">
          Ujian sedang berlangsung. Jika kamu keluar sekarang,{" "}
          <strong className="text-red-600">progres dan jawaban kamu akan hilang</strong>.
          Yakin ingin keluar?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-sm hover:bg-neutral-50 transition-colors"
          >
            Tetap di Ujian
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors shadow-sm"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── Section Instructions Screen ─────────────────────────────────────────────
function SectionInstructions({
  title,
  instructions,
  questionCount,
  durationSeconds,
  onBegin,
  onBack,
}: {
  title: string;
  instructions: string;
  questionCount: number;
  durationSeconds: number;
  onBegin: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-neutral-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl border border-neutral-200 shadow-card p-8 animate-scale-in">
        <div className="w-14 h-14 rounded-2xl bg-[#007D07]/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-7 h-7 text-[#007D07]" />
        </div>
        <h2 className="font-heading font-800 text-neutral-900 text-2xl mb-2">{title}</h2>
        <div className="flex gap-4 mb-6">
          <span className="text-xs font-semibold text-[#007D07] bg-[#E8F5E9] px-2.5 py-1 rounded-full">
            {questionCount} Questions
          </span>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            {Math.round(durationSeconds / 60)} Minutes
          </span>
        </div>
        <div className="bg-neutral-50 rounded-xl p-5 mb-8 border border-neutral-100">
          <h3 className="font-semibold text-neutral-700 text-sm mb-3">Instructions</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">{instructions}</p>
        </div>
        <button
          id="btn-begin-section"
          onClick={onBegin}
          className="w-full py-3.5 bg-[#007D07] text-white font-semibold rounded-xl hover:bg-[#006A06] transition-all shadow-brand text-sm mb-3"
        >
          Begin Section →
        </button>
        <button
          onClick={onBack}
          className="w-full py-3.5 border border-neutral-200 text-neutral-600 font-semibold rounded-xl hover:bg-neutral-50 hover:border-neutral-300 transition-all text-sm"
        >
          ← Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}

// ─── Review Dialog sebelum Submit ────────────────────────────────────────────
function ReviewDialog({
  sections,
  answers,
  flagged,
  onConfirm,
  onCancel,
}: {
  sections: ExamPackage["sections"];
  answers: Record<string, string>;
  flagged: Record<string, boolean>;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const allQuestions = sections.flatMap((s) => s.questions.map((q) => ({ ...q, sectionTitle: s.title })));
  const unanswered = allQuestions.filter((q) => !answers[q.id]);
  const flaggedList = allQuestions.filter((q) => flagged[q.id]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-heading font-700 text-neutral-900 text-base">Review Sebelum Kumpulkan</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Periksa jawaban kamu sebelum submit</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-[#E8F5E9] rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-[#007D07]">{allQuestions.length - unanswered.length}</div>
            <div className="text-[10px] text-[#007D07] font-semibold mt-0.5">Terjawab</div>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{unanswered.length}</div>
            <div className="text-[10px] text-red-600 font-semibold mt-0.5">Belum dijawab</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{flaggedList.length}</div>
            <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Ditandai</div>
          </div>
        </div>

        {/* Unanswered list */}
        {unanswered.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">Soal belum dijawab</p>
            <div className="flex flex-wrap gap-1.5">
              {unanswered.slice(0, 20).map((q, i) => (
                <span key={q.id} className="px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-lg">
                  No.{sections.flatMap(s => s.questions).findIndex(sq => sq.id === q.id) + 1}
                </span>
              ))}
              {unanswered.length > 20 && (
                <span className="px-2 py-1 text-neutral-400 text-xs">+{unanswered.length - 20} lainnya</span>
              )}
            </div>
          </div>
        )}

        {/* Flagged list */}
        {flaggedList.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Flag className="w-3 h-3" /> Soal yang ditandai
            </p>
            <div className="flex flex-wrap gap-1.5">
              {flaggedList.map((q) => (
                <span key={q.id} className="px-2 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-lg">
                  No.{sections.flatMap(s => s.questions).findIndex(sq => sq.id === q.id) + 1}
                </span>
              ))}
            </div>
          </div>
        )}

        {unanswered.length === 0 && flaggedList.length === 0 && (
          <div className="flex items-center gap-2 bg-[#E8F5E9] rounded-xl p-4 mb-5">
            <CheckCircle2 className="w-5 h-5 text-[#007D07]" />
            <p className="text-sm text-[#007D07] font-semibold">Semua soal sudah dijawab! 🎉</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-sm hover:bg-neutral-50 transition-colors"
          >
            Kembali & Cek
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-[#007D07] text-white font-semibold text-sm hover:bg-[#006A06] transition-colors shadow-sm"
          >
            Ya, Kumpulkan →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ExamEngine ──────────────────────────────────────────────────────────
export default function ExamEngine({ exam, sessionId }: ExamEngineProps) {
  const router = useRouter();

  // Load or create session
  const { success: toastSuccess } = useToast();

  const [session, setSession] = useState(() => {
    // Selalu mulai sesi baru — tidak restore sesi lama
    return createSession(sessionId, exam.id);
  });


  const [sectionStarted, setSectionStarted] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // ─── Anti-cheat state ────────────────────────────────────────────────────────
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  // ─── Cek auth — wajib login untuk mengerjakan exam ───────────────────────
  const [authChecked, setAuthChecked] = useState(false);
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: authSession } }) => {
      if (!authSession?.user) {
        router.replace(`/auth/login?redirect=/exam/${sessionId}`);
      } else {
        setAuthUserId(authSession.user.id);
        setAuthChecked(true);
      }
    });
  }, [router, sessionId]);

  // ─── Fullscreen ──────────────────────────────────────────────────────────────
  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  // Deteksi keluar fullscreen → blokir ujian
  useEffect(() => {
    if (!sectionStarted) return;
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        setBlockReason("Kamu keluar dari mode fullscreen.");
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
        setBlockReason("");
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [sectionStarted]);

  // Deteksi pindah tab / minimize → blokir ujian
  useEffect(() => {
    if (!sectionStarted) return;
    const onVisibility = () => {
      if (document.hidden) {
        setBlockReason("Kamu berpindah tab atau meminimize browser.");
        setIsBlocked(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [sectionStarted]);

  // Block klik kanan selama ujian
  useEffect(() => {
    if (!sectionStarted) return;
    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", onContextMenu);
    return () => document.removeEventListener("contextmenu", onContextMenu);
  }, [sectionStarted]);

  const currentSection = exam.sections[session.currentSectionIndex];
  const currentQuestion = currentSection?.questions[session.currentQuestionIndex];

  // Jumlah soal yang sudah dijawab di section ini
  const answeredCount = currentSection
    ? currentSection.questions.filter((q) => session.answers[q.id]).length
    : 0;

  // ─── Cegah tutup/refresh tab saat ujian aktif ────────────────────────────
  useEffect(() => {
    if (!sectionStarted) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sectionStarted]);

  // ─── Auto-save every 5 seconds ────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setSession((prev) => {
        const updated = { ...prev, lastSavedAt: new Date().toISOString() };
        saveSession(updated);
        return updated;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ─── Handler keluar dengan konfirmasi ────────────────────────────────────
  const handleExitRequest = useCallback(() => {
    if (sectionStarted) {
      setShowExitDialog(true);
    } else {
      router.back();
    }
  }, [sectionStarted, router]);

  const handleExitConfirmed = useCallback(() => {
    setShowExitDialog(false);
    router.push("/dashboard");
  }, [router]);

  // ─── Answer handler ───────────────────────────────────────────────────────
  const handleAnswer = useCallback((choiceId: string) => {
    setSession((prev) => ({
      ...prev,
      answers: { ...prev.answers, [currentQuestion.id]: choiceId },
    }));
  }, [currentQuestion]);

  // ─── Flag handler ─────────────────────────────────────────────────────────
  const handleFlag = useCallback(() => {
    setSession((prev) => {
      const flagged = { ...prev.flagged };
      if (flagged[currentQuestion.id]) {
        delete flagged[currentQuestion.id];
      } else {
        flagged[currentQuestion.id] = true;
      }
      return { ...prev, flagged };
    });
  }, [currentQuestion]);

  // ─── Navigation ───────────────────────────────────────────────────────────
  const goTo = useCallback((index: number) => {
    setSession((prev) => ({ ...prev, currentQuestionIndex: index }));
  }, []);

  const handlePrev = useCallback(() => {
    goTo(Math.max(0, session.currentQuestionIndex - 1));
  }, [goTo, session.currentQuestionIndex]);

  const handleNext = useCallback(() => {
    goTo(Math.min(currentSection.questions.length - 1, session.currentQuestionIndex + 1));
  }, [goTo, session.currentQuestionIndex, currentSection]);

  // Pindah ke section berikutnya
  const handleNextSection = useCallback(() => {
    const nextSectionIndex = session.currentSectionIndex + 1;
    if (nextSectionIndex < exam.sections.length) {
      setSession((prev) => ({
        ...prev,
        currentSectionIndex: nextSectionIndex,
        currentQuestionIndex: 0,
      }));
      setSectionStarted(false); // tampilkan intro section berikutnya
    } else {
      // Sudah section terakhir → tampilkan review untuk submit
      setShowReviewDialog(true);
    }
  }, [session.currentSectionIndex, exam.sections.length]);

  const isLastQuestionInSection =
    session.currentQuestionIndex === currentSection?.questions.length - 1;
  const isLastSection = session.currentSectionIndex === exam.sections.length - 1;


  // ─── Time up ─────────────────────────────────────────────────────────────
  const handleTimeUp = useCallback(() => {
    handleSubmitConfirmed();
  }, []);

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmitConfirmed = useCallback(async () => {
    const finalSession = { ...session, status: "completed" as const, lastSavedAt: new Date().toISOString() };
    saveSession(finalSession);

    // Hitung skor per section
    const getSectionScore = (type: string) => {
      const section = exam.sections.find((s) => s.type === type);
      if (!section) return { raw: 0, total: 0 };
      const raw = section.questions.filter(
        (q) => finalSession.answers[q.id] === q.correctAnswer
      ).length;
      return { raw, total: section.questions.length };
    };

    const L = getSectionScore("listening");
    const S = getSectionScore("structure");
    const R = getSectionScore("reading");

    // Kirim ke API route (pakai service key → bypass RLS & FK issue)
    if (authUserId) {
      try {
        const res = await fetch("/api/exam/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: authUserId,
            packageId: exam.id,
            examTitle: exam.title,
            examType: exam.type ?? "ITP",
            answers: finalSession.answers,
            listeningRaw: L.raw, listeningTotal: L.total,
            structureRaw: S.raw, structureTotal: S.total,
            readingRaw: R.raw, readingTotal: R.total,
            durationMinutes: exam.durationMinutes ?? 115,
            startedAt: finalSession.startedAt,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          console.warn("Failed to save result:", err);
        }
      } catch (err) {
        console.warn("Failed to save result to API:", err);
      }
    }

    router.push(`/exam/${sessionId}/results`);
  }, [session, sessionId, router, exam, authUserId]);

  const unansweredCount = currentSection
    ? currentSection.questions.filter((q) => !session.answers[q.id]).length
    : 0;

  // Tampilkan loading saat cek auth
  if (!authChecked) {
    return (
      <div className="exam-fullscreen items-center justify-center">
        <p className="text-neutral-500">Memeriksa sesi login...</p>
      </div>
    );
  }

  if (!currentSection || !currentQuestion) {
    return (
      <div className="exam-fullscreen items-center justify-center">
        <p className="text-neutral-500">Loading exam...</p>
      </div>
    );
  }

  return (
    <div className="exam-fullscreen" role="main" aria-label="TOEFL Examination">
      {/* Section Instructions Screen */}
      {!sectionStarted ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="bg-white border-b border-neutral-200 px-6 py-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#007D07] flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="font-heading font-700 text-neutral-700 text-sm">{exam.title}</span>
          </div>
          <SectionInstructions
            title={currentSection.title}
            instructions={currentSection.instructions}
            questionCount={currentSection.questions.length}
            durationSeconds={currentSection.durationSeconds}
            onBegin={() => {
              enterFullscreen();
              setSectionStarted(true);
            }}
            onBack={handleExitRequest}
          />
        </div>
      ) : (
        <>
          {/* ── BLOCKING OVERLAY — muncul saat user keluar fullscreen / pindah tab ── */}
          {isBlocked && (
            <div className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center text-white select-none">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center mb-6">
                <ShieldAlert className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-center">Akses Diblokir</h2>
              <p className="text-neutral-400 text-sm mb-1 text-center max-w-sm">
                {blockReason}
              </p>
              <p className="text-neutral-500 text-xs mb-8 text-center max-w-sm">
                Selama ujian berlangsung kamu tidak diperbolehkan keluar dari halaman ini.
              </p>
              <button
                onClick={() => {
                  enterFullscreen();
                  // Unblock setelah masuk fullscreen (fallback jika tab kembali)
                  if (!document.fullscreenElement) {
                    setIsBlocked(false);
                    setBlockReason("");
                  }
                }}
                className="px-8 py-3 bg-[#007D07] text-white font-bold rounded-xl hover:bg-[#006A06] transition-all"
              >
                Kembali ke Ujian (Fullscreen)
              </button>
            </div>
          )}

          {/* Exam Header */}
          <ExamHeader
            examTitle={exam.title}
            sectionTitle={currentSection.title}
            sectionIndex={session.currentSectionIndex}
            totalSections={exam.sections.length}
            durationSeconds={currentSection.durationSeconds}
            onTimeUp={handleTimeUp}
            isFlagged={!!session.flagged[currentQuestion.id]}
            onFlag={handleFlag}
            onPrev={handlePrev}
            onNext={handleNext}
            onSubmit={() => setShowReviewDialog(true)}
            canGoPrev={session.currentQuestionIndex > 0}
            canGoNext={session.currentQuestionIndex < currentSection.questions.length - 1}
            currentQuestion={session.currentQuestionIndex + 1}
            totalQuestions={currentSection.questions.length}
            answeredCount={answeredCount}
          />

          {/* Question Module */}
          {currentSection.type === "reading" && (
            <ReadingModule
              question={currentQuestion}
              questionNumber={session.currentQuestionIndex + 1}
              totalQuestions={currentSection.questions.length}
              selectedAnswer={session.answers[currentQuestion.id]}
              onAnswer={handleAnswer}
            />
          )}
          {currentSection.type === "listening" && (
            <ListeningModule
              question={currentQuestion}
              questionNumber={session.currentQuestionIndex + 1}
              totalQuestions={currentSection.questions.length}
              selectedAnswer={session.answers[currentQuestion.id]}
              onAnswer={handleAnswer}
            />
          )}
          {currentSection.type === "structure" && (
            <StructureModule
              question={currentQuestion}
              questionNumber={session.currentQuestionIndex + 1}
              totalQuestions={currentSection.questions.length}
              selectedAnswer={session.answers[currentQuestion.id]}
              onAnswer={handleAnswer}
            />
          )}

          {/* Tombol Lanjut Section — muncul di soal terakhir tiap section */}
          {isLastQuestionInSection && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <button
                onClick={handleNextSection}
                className="flex items-center gap-2 px-6 py-3 bg-[#007D07] text-white font-bold rounded-xl shadow-lg hover:bg-[#006A06] transition-all text-sm"
              >
                {isLastSection ? "Kumpulkan Ujian →" : `Lanjut ke Section Berikutnya →`}
              </button>
            </div>
          )}

          {/* Question Palette */}

          <QuestionPalette
            total={currentSection.questions.length}
            current={session.currentQuestionIndex}
            answered={new Set(currentSection.questions.filter((q) => session.answers[q.id]).map((q) => q.id))}
            flagged={new Set(Object.keys(session.flagged).filter((k) => session.flagged[k]))}
            questionIds={currentSection.questions.map((q) => q.id)}
            onNavigate={goTo}
          />
        </>
      )}

      {/* Review Dialog */}
      {showReviewDialog && (
        <ReviewDialog
          sections={exam.sections}
          answers={session.answers}
          flagged={session.flagged}
          onConfirm={() => { setShowReviewDialog(false); setShowSubmitDialog(true); }}
          onCancel={() => setShowReviewDialog(false)}
        />
      )}

      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <SubmitDialog
          unanswered={unansweredCount}
          onConfirm={async () => {
            await handleSubmitConfirmed();
            toastSuccess("Ujian berhasil dikumpulkan!");
          }}
          onCancel={() => setShowSubmitDialog(false)}
        />
      )}

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <ExitDialog
          onConfirm={handleExitConfirmed}
          onCancel={() => setShowExitDialog(false)}
        />
      )}
    </div>
  );
}

