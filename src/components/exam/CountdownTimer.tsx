"use client";
import { useEffect, useState, useCallback } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  onLowTime?: (secondsLeft: number) => void;
  isPaused?: boolean;
}

export default function CountdownTimer({
  totalSeconds,
  onTimeUp,
  onLowTime,
  isPaused = false,
}: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        onLowTime?.(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, secondsLeft, onTimeUp, onLowTime]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isDanger  = secondsLeft <= 60;
  const isWarning = secondsLeft <= 300 && !isDanger;
  const progress  = (secondsLeft / totalSeconds) * 100;

  const containerCls = isDanger
    ? "bg-red-50 border border-red-200 text-red-700 animate-pulse"
    : isWarning
    ? "bg-amber-50 border border-amber-200 text-amber-700"
    : "bg-[#E8F5E9] border border-[#007D07]/20 text-[#007D07]";

  const barColor = isDanger ? "#EF4444" : isWarning ? "#F59E0B" : "#007D07";

  return (
    <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl font-mono transition-all ${containerCls}`}>
      <Clock className="w-4 h-4 flex-shrink-0" />
      <div className="flex flex-col items-center">
        <span className={`text-base font-bold leading-none tracking-wider ${isDanger ? "text-red-600" : ""}`}>
          {formatted}
        </span>
        {/* Mini progress bar */}
        <div className="w-14 h-1 bg-black/10 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${progress}%`, background: barColor }}
          />
        </div>
      </div>
      {isDanger && (
        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide hidden sm:block">
          Segera!
        </span>
      )}
    </div>
  );
}

