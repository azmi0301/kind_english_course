"use client";
import { Flag } from "lucide-react";

interface QuestionPaletteProps {
  total: number;
  current: number;
  answered: Set<string>;
  flagged: Set<string>;
  questionIds: string[];
  onNavigate: (index: number) => void;
}

export default function QuestionPalette({
  total,
  current,
  answered,
  flagged,
  questionIds,
  onNavigate,
}: QuestionPaletteProps) {
  const answeredCount = answered.size;
  const flaggedCount = flagged.size;
  const unansweredCount = total - answeredCount;

  return (
    <div className="bg-white border-t border-neutral-200 px-4 py-3">
      {/* Legend */}
      <div className="flex items-center gap-5 mb-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-[#007D07]" />
          <span className="text-xs text-neutral-600">{answeredCount} Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-white border-2 border-neutral-300" />
          <span className="text-xs text-neutral-600">{unansweredCount} Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-amber-100 border-2 border-amber-400" />
          <span className="text-xs text-neutral-600">{flaggedCount} Flagged</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap gap-1.5">
        {questionIds.map((qId, idx) => {
          const isAnswered = answered.has(qId);
          const isFlagged = flagged.has(qId);
          const isCurrent = idx === current;

          let btnClass = "q-btn-unanswered";
          if (isAnswered) btnClass = "q-btn-answered";
          if (isFlagged) btnClass = "q-btn-flagged";

          return (
            <button
              key={qId}
              id={`q-palette-${idx + 1}`}
              onClick={() => onNavigate(idx)}
              aria-label={`Go to question ${idx + 1}${isAnswered ? ", answered" : ""}${isFlagged ? ", flagged" : ""}`}
              className={`relative w-8 h-8 text-xs font-bold rounded-lg transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007D07] ${btnClass} ${isCurrent ? "q-btn-current" : ""}`}
            >
              {idx + 1}
              {isFlagged && (
                <Flag className="absolute -top-1 -right-1 w-2.5 h-2.5 text-amber-500 fill-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
