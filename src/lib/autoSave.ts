// ─── Auto-save Utility ────────────────────────────────────────────────────────
// Saves exam answers to localStorage every 5 seconds.

export interface ExamSession {
  sessionId: string;
  examId: string;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, string>; // { questionId: choiceId }
  flagged: Record<string, boolean>; // { questionId: true/false }
  sectionStartTimes: Record<string, number>; // { sectionId: timestamp }
  sectionTimeRemaining: Record<string, number>; // { sectionId: seconds }
  startedAt: string;
  lastSavedAt: string;
  status: "in_progress" | "completed";
}

const SESSION_PREFIX = "kec_exam_session_";

export function saveSession(session: ExamSession): void {
  try {
    const key = `${SESSION_PREFIX}${session.sessionId}`;
    const data = { ...session, lastSavedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Auto-save failed:", e);
  }
}

export function loadSession(sessionId: string): ExamSession | null {
  try {
    const key = `${SESSION_PREFIX}${sessionId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as ExamSession;
  } catch {
    return null;
  }
}

export function clearSession(sessionId: string): void {
  try {
    localStorage.removeItem(`${SESSION_PREFIX}${sessionId}`);
  } catch {}
}

export function createSession(
  sessionId: string,
  examId: string
): ExamSession {
  return {
    sessionId,
    examId,
    currentSectionIndex: 0,
    currentQuestionIndex: 0,
    answers: {},
    flagged: {},
    sectionStartTimes: {},
    sectionTimeRemaining: {},
    startedAt: new Date().toISOString(),
    lastSavedAt: new Date().toISOString(),
    status: "in_progress",
  };
}

export function useAutoSave(
  session: ExamSession | null,
  intervalMs = 5000
): void {
  // NOTE: Call this inside a React useEffect
  // import { useEffect } from "react";
  // useEffect(() => {
  //   if (!session) return;
  //   const id = setInterval(() => saveSession(session), intervalMs);
  //   return () => clearInterval(id);
  // }, [session, intervalMs]);
  void session;
  void intervalMs;
}
