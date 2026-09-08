"use client";
import AudioPlayer from "./AudioPlayer";
import type { Question } from "@/lib/examData";

interface ListeningModuleProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | undefined;
  onAnswer: (choiceId: string) => void;
}

export default function ListeningModule({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
}: ListeningModuleProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-neutral-50 flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-2xl">
        {/* Section badge */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded-full">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-xs text-neutral-400">Listening Comprehension</span>
        </div>

        {/* Audio instruction */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-amber-700 font-medium">
            📢 <strong>Important:</strong> Listen to the audio carefully. Each audio track can only be played{" "}
            <strong>once</strong>, as in the real TOEFL exam.
          </p>
        </div>

        {/* Part Directions Box (if question has special directions like Part B / Part C) */}
        {question.passage && (
          <div className="bg-purple-50 border border-purple-200/90 rounded-2xl p-5 mb-6 text-xs text-purple-950 shadow-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-purple-900 text-sm">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              <span>
                {questionNumber <= 30
                  ? "Part A — Directions"
                  : questionNumber <= 38
                  ? "Part B — Directions"
                  : "Part C — Directions"}
              </span>
            </div>
            <p className="leading-relaxed whitespace-pre-line text-purple-900 font-medium">
              {question.passage}
            </p>
          </div>
        )}

        {/* Audio Player */}
        <div className="mb-8">
          <AudioPlayer key={question.audioUrl || "no-audio"} audioUrl={question.audioUrl ?? ""} />
        </div>

        {/* Question */}
        <p className="text-neutral-900 font-semibold text-base leading-relaxed mb-6">
          {question.question}
        </p>

        {/* Choices */}
        <div className="space-y-3">
          {question.choices.map((choice) => {
            const isSelected = selectedAnswer === choice.id;
            return (
              <label
                key={choice.id}
                id={`listen-choice-${question.id}-${choice.id}`}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                  isSelected
                    ? "border-[#007D07] bg-[#E8F5E9]"
                    : "border-neutral-200 bg-white hover:border-[#007D07]/40"
                }`}
                htmlFor={`radio-l-${question.id}-${choice.id}`}
              >
                <input
                  type="radio"
                  id={`radio-l-${question.id}-${choice.id}`}
                  name={`question-${question.id}`}
                  value={choice.id}
                  checked={isSelected}
                  onChange={() => onAnswer(choice.id)}
                  className="sr-only"
                />
                <span
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-heading font-700 text-xs flex-shrink-0 mt-0.5 transition-all ${
                    isSelected
                      ? "border-[#007D07] bg-[#007D07] text-white"
                      : "border-neutral-300 text-neutral-500"
                  }`}
                >
                  {choice.id}
                </span>
                <span className={`text-sm leading-relaxed ${isSelected ? "text-[#005505] font-medium" : "text-neutral-700"}`}>
                  {choice.text}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
