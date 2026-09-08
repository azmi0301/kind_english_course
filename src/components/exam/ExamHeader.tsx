"use client";
import Link from "next/link";
import { BookOpen, Flag, ChevronLeft, ChevronRight, Send } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

interface ExamHeaderProps {
  examTitle: string;
  sectionTitle: string;
  sectionIndex: number;
  totalSections: number;
  durationSeconds: number;
  onTimeUp: () => void;
  isFlagged: boolean;
  onFlag: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
}

export default function ExamHeader({
  examTitle,
  sectionTitle,
  sectionIndex,
  totalSections,
  durationSeconds,
  onTimeUp,
  isFlagged,
  onFlag,
  onPrev,
  onNext,
  onSubmit,
  canGoPrev,
  canGoNext,
  currentQuestion,
  totalQuestions,
  answeredCount,
}: ExamHeaderProps) {
  const answeredPct = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between px-4 h-14 gap-4">
        {/* Brand + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#007D07] flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-neutral-500 truncate hidden sm:block">{examTitle}</div>
            <div className="font-heading font-700 text-neutral-900 text-sm truncate">{sectionTitle}</div>
          </div>
        </div>

        {/* Section progress pills */}
        <div className="hidden md:flex items-center gap-1.5">
          {Array.from({ length: totalSections }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < sectionIndex
                  ? "w-8 bg-[#007D07]"
                  : i === sectionIndex
                  ? "w-8 bg-[#007D07]/60"
                  : "w-8 bg-neutral-200"
              }`}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="flex-shrink-0">
          <CountdownTimer totalSeconds={durationSeconds} onTimeUp={onTimeUp} />
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          {/* Flag */}
          <button
            id="btn-flag"
            onClick={onFlag}
            title={isFlagged ? "Hapus tandai" : "Tandai untuk ditinjau"}
            className={`p-2 rounded-lg transition-all hover:scale-105 ${
              isFlagged
                ? "bg-amber-100 text-amber-600 border border-amber-300"
                : "bg-neutral-100 text-neutral-500 hover:bg-amber-50 hover:text-amber-600"
            }`}
          >
            <Flag className={`w-4 h-4 ${isFlagged ? "fill-amber-400" : ""}`} />
          </button>

          {/* Prev */}
          <button
            id="btn-prev"
            onClick={onPrev}
            disabled={!canGoPrev}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-neutral-100 text-neutral-600 text-xs font-semibold hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Q counter */}
          <span className="text-xs font-mono text-neutral-500 px-1 hidden sm:block">
            {currentQuestion}/{totalQuestions}
          </span>

          {/* Next */}
          <button
            id="btn-next"
            onClick={onNext}
            disabled={!canGoNext}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#007D07]/10 text-[#007D07] text-xs font-semibold hover:bg-[#007D07]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Submit */}
          <button
            id="btn-submit"
            onClick={onSubmit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#007D07] text-white text-xs font-semibold hover:bg-[#006A06] transition-all shadow-sm ml-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kumpulkan</span>
          </button>
        </div>
      </div>

      {/* Progress bar jawaban */}
      <div className="h-1.5 bg-neutral-100 relative">
        <div
          className="h-full bg-[#007D07] transition-all duration-500"
          style={{ width: `${answeredPct}%` }}
        />
        {/* Label persentase */}
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-neutral-400 leading-none"
        >
          {answeredCount}/{totalQuestions} dijawab
        </span>
      </div>
    </header>
  );
}



