"use client";
import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus digunakan dalam ToastProvider");
  return ctx;
}

// ─── Config per type ──────────────────────────────────────────────────────────
const config: Record<ToastType, { icon: React.ElementType; bg: string; border: string; text: string; iconCls: string }> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-white",
    border: "border-l-4 border-l-[#007D07]",
    text: "text-neutral-800",
    iconCls: "text-[#007D07]",
  },
  error: {
    icon: XCircle,
    bg: "bg-white",
    border: "border-l-4 border-l-red-500",
    text: "text-neutral-800",
    iconCls: "text-red-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-white",
    border: "border-l-4 border-l-amber-500",
    text: "text-neutral-800",
    iconCls: "text-amber-500",
  },
  info: {
    icon: Info,
    bg: "bg-white",
    border: "border-l-4 border-l-blue-500",
    text: "text-neutral-800",
    iconCls: "text-blue-500",
  },
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev.slice(-4), { id, type, message }]);
    timers.current[id] = setTimeout(() => remove(id), 3500);
  }, [remove]);

  const success = useCallback((msg: string) => toast(msg, "success"), [toast]);
  const error   = useCallback((msg: string) => toast(msg, "error"),   [toast]);
  const warning = useCallback((msg: string) => toast(msg, "warning"), [toast]);
  const info    = useCallback((msg: string) => toast(msg, "info"),    [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}

      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 items-end pointer-events-none"
      >
        {toasts.map((t) => {
          const { icon: Icon, bg, border, text, iconCls } = config[t.type];
          return (
            <div
              key={t.id}
              className={`
                flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg
                border border-neutral-200 ${bg} ${border}
                pointer-events-auto w-80 max-w-[90vw]
                animate-slide-in-right
              `}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconCls}`} />
              <p className={`text-sm font-medium flex-1 leading-snug ${text}`}>{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
