"use client";
import type { Question } from "@/lib/examData";

interface StructureModuleProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | undefined;
  onAnswer: (choiceId: string) => void;
}

export default function StructureModule({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
}: StructureModuleProps) {
  // Highlight blank markers
  const renderQuestion = (text: string) => {
    return text.replace(/_{3,}/g, "________");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-50 flex flex-col items-center justify-start p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-full">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-xs text-neutral-400">Structure & Written Expression</span>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-blue-700 font-medium">
            📝 Choose the one word or phrase that best completes the sentence, or identify the underlined portion that is incorrect.
          </p>
        </div>

        {/* Question */}
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-6 mb-6">
          <p className="text-neutral-900 font-semibold text-base leading-relaxed text-center">
            {renderQuestion(question.question)}
          </p>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-2 gap-3">
          {question.choices.map((choice) => {
            const isSelected = selectedAnswer === choice.id;
            return (
              <label
                key={choice.id}
                id={`struct-choice-${question.id}-${choice.id}`}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all group ${
                  isSelected
                    ? "border-[#007D07] bg-[#E8F5E9]"
                    : "border-neutral-200 bg-white hover:border-[#007D07]/40"
                }`}
                htmlFor={`radio-s-${question.id}-${choice.id}`}
              >
                <input
                  type="radio"
                  id={`radio-s-${question.id}-${choice.id}`}
                  name={`question-${question.id}`}
                  value={choice.id}
                  checked={isSelected}
                  onChange={() => onAnswer(choice.id)}
                  className="sr-only"
                />
                <span
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-heading font-700 text-sm flex-shrink-0 transition-all ${
                    isSelected
                      ? "border-[#007D07] bg-[#007D07] text-white"
                      : "border-neutral-300 text-neutral-500"
                  }`}
                >
                  {choice.id}
                </span>
                <span className={`text-sm ${isSelected ? "text-[#005505] font-semibold" : "text-neutral-700"}`}>
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
