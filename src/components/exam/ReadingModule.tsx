"use client";
import { useRef } from "react";
import type { Question } from "@/lib/examData";

interface ReadingModuleProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | undefined;
  onAnswer: (choiceId: string) => void;
}

export default function ReadingModule({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
}: ReadingModuleProps) {
  const passageRef = useRef<HTMLDivElement>(null);

  // Split passage into paragraphs for marking
  const paragraphs = (question.passage ?? "").split("\n\n").filter(Boolean);

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Left Pane — Reading Passage */}
      <div
        ref={passageRef}
        className="w-1/2 overflow-y-auto border-r border-neutral-200 bg-white p-6 lg:p-8"
        aria-label="Reading Passage"
      >
        <div className="max-w-prose mx-auto">
          <h2 className="font-heading font-700 text-neutral-900 text-base mb-5 pb-3 border-b border-neutral-100">
            Reading Passage
          </h2>
          <div className="reading-passage">
            {paragraphs.map((para, i) => (
              <p key={i} className="mb-4 leading-relaxed text-neutral-700">
                <span className="paragraph-marker">{String.fromCharCode(65 + i)}</span>
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Pane — Question */}
      <div className="w-1/2 overflow-y-auto bg-neutral-50 p-6 lg:p-8 flex flex-col">
        <div className="max-w-lg mx-auto w-full flex flex-col flex-1">
          {/* Question number */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-bold text-[#007D07] uppercase tracking-widest bg-[#E8F5E9] px-2.5 py-1 rounded-full">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-xs text-neutral-400">Reading Comprehension</span>
          </div>

          {/* Question text */}
          <p className="text-neutral-900 font-semibold text-sm leading-relaxed mb-6">
            {question.question}
          </p>

          {/* Choices */}
          <div className="space-y-3 flex-1">
            {question.choices.map((choice) => {
              const isSelected = selectedAnswer === choice.id;
              return (
                <label
                  key={choice.id}
                  id={`choice-${question.id}-${choice.id}`}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                    isSelected
                      ? "border-[#007D07] bg-[#E8F5E9]"
                      : "border-neutral-200 bg-white hover:border-[#007D07]/40 hover:bg-[#F9FAFB]"
                  }`}
                  htmlFor={`radio-${question.id}-${choice.id}`}
                >
                  <input
                    type="radio"
                    id={`radio-${question.id}-${choice.id}`}
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
                        : "border-neutral-300 text-neutral-500 group-hover:border-[#007D07]/60"
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
    </div>
  );
}
