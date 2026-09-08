// ─── Admin Data Store (localStorage) ─────────────────────────────────────────
// Provides CRUD for questions, students, and exam sessions.
// Replace with real DB calls in production.

import {
  Question,
  ExamPackage,
  FULL_ITP_EXAM,
  DIAGNOSTIC_EXAM,
} from "./examData";
import { MOCK_TEST_RESULTS, TestResult } from "./scoreCalculator";

// ─── Keys ──────────────────────────────────────────────────────────────────────
const QUESTIONS_KEY = "kind_admin_questions";
const STUDENTS_KEY = "kind_admin_students";
const SESSIONS_KEY = "kind_admin_sessions";
const PACKAGES_KEY = "kind_admin_packages";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  results: TestResult[];
}

export interface ExamSession {
  id: string;
  title: string;
  packageId: string;
  packageTitle: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
  participantCount: number;
  createdAt: string;
}

// ─── Seed Helpers ──────────────────────────────────────────────────────────────
function seedQuestions(): Question[] {
  const allQuestions: Question[] = [];
  [FULL_ITP_EXAM, DIAGNOSTIC_EXAM].forEach((pkg) => {
    pkg.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        if (!allQuestions.find((x) => x.id === q.id)) {
          allQuestions.push(q);
        }
      });
    });
  });
  return allQuestions;
}

function seedStudents(): StudentRecord[] {
  return [
    {
      id: "stu-001",
      name: "Budi Santoso",
      email: "budi@student.com",
      joinDate: "2024-10-01",
      results: MOCK_TEST_RESULTS,
    },
    {
      id: "stu-002",
      name: "Siti Rahayu",
      email: "siti@student.com",
      joinDate: "2024-10-15",
      results: MOCK_TEST_RESULTS.slice(0, 3),
    },
    {
      id: "stu-003",
      name: "Ahmad Fauzi",
      email: "ahmad@student.com",
      joinDate: "2024-11-01",
      results: MOCK_TEST_RESULTS.slice(0, 2),
    },
    {
      id: "stu-004",
      name: "Dewi Lestari",
      email: "dewi@student.com",
      joinDate: "2024-11-20",
      results: MOCK_TEST_RESULTS.slice(3),
    },
  ];
}

function seedSessions(): ExamSession[] {
  return [
    {
      id: "ses-001",
      title: "TOEFL ITP Batch November 2024",
      packageId: "itp-full-sim-01",
      packageTitle: "TOEFL ITP Institutional Test",
      startDate: "2024-11-10",
      endDate: "2024-11-10",
      status: "completed",
      participantCount: 25,
      createdAt: "2024-11-01",
    },
    {
      id: "ses-002",
      title: "TOEFL ITP Batch Desember 2024",
      packageId: "itp-full-sim-01",
      packageTitle: "TOEFL ITP Institutional Test",
      startDate: "2024-12-18",
      endDate: "2024-12-18",
      status: "completed",
      participantCount: 30,
      createdAt: "2024-12-01",
    },
    {
      id: "ses-003",
      title: "Diagnostic Test Januari 2025",
      packageId: "diagnostic-01",
      packageTitle: "TOEFL Diagnostic Test",
      startDate: "2025-01-08",
      endDate: "2025-01-08",
      status: "active",
      participantCount: 18,
      createdAt: "2025-01-02",
    },
    {
      id: "ses-004",
      title: "TOEFL ITP Batch Agustus 2026",
      packageId: "itp-full-sim-01",
      packageTitle: "TOEFL ITP Institutional Test",
      startDate: "2026-08-20",
      endDate: "2026-08-20",
      status: "upcoming",
      participantCount: 0,
      createdAt: "2026-08-08",
    },
  ];
}

function seedPackages(): Pick<ExamPackage, "id" | "title" | "description">[] {
  return [FULL_ITP_EXAM, DIAGNOSTIC_EXAM].map(({ id, title, description }) => ({
    id,
    title,
    description,
  }));
}

// ─── Generic Helpers ──────────────────────────────────────────────────────────
function getStore<T>(key: string, seedFn: () => T[]): T[] {
  if (typeof window === "undefined") return seedFn();
  const raw = localStorage.getItem(key);
  if (!raw) {
    const seeded = seedFn();
    localStorage.setItem(key, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return seedFn();
  }
}

function saveStore<T>(key: string, data: T[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// ─── Questions API ─────────────────────────────────────────────────────────────
export function getQuestions(): Question[] {
  return getStore<Question>(QUESTIONS_KEY, seedQuestions);
}

export function saveQuestions(questions: Question[]): void {
  saveStore(QUESTIONS_KEY, questions);
}

export function addQuestion(q: Omit<Question, "id" | "number">): Question {
  const questions = getQuestions();
  const typeQuestions = questions.filter((x) => x.type === q.type);
  const newQ: Question = {
    ...q,
    id: `${q.type[0]}${Date.now()}`,
    number: typeQuestions.length + 1,
  };
  saveQuestions([...questions, newQ]);
  return newQ;
}

export function updateQuestion(updated: Question): void {
  const questions = getQuestions().map((q) =>
    q.id === updated.id ? updated : q
  );
  saveQuestions(questions);
}

export function deleteQuestion(id: string): void {
  const questions = getQuestions().filter((q) => q.id !== id);
  saveQuestions(questions);
}

// ─── Students API ──────────────────────────────────────────────────────────────
export function getStudents(): StudentRecord[] {
  return getStore<StudentRecord>(STUDENTS_KEY, seedStudents);
}

export function saveStudents(students: StudentRecord[]): void {
  saveStore(STUDENTS_KEY, students);
}

// ─── Sessions API ─────────────────────────────────────────────────────────────
export function getSessions(): ExamSession[] {
  return getStore<ExamSession>(SESSIONS_KEY, seedSessions);
}

export function saveSessions(sessions: ExamSession[]): void {
  saveStore(SESSIONS_KEY, sessions);
}

export function addSession(s: Omit<ExamSession, "id" | "createdAt" | "participantCount">): ExamSession {
  const sessions = getSessions();
  const newS: ExamSession = {
    ...s,
    id: `ses-${Date.now()}`,
    participantCount: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
  saveSessions([...sessions, newS]);
  return newS;
}

export function deleteSession(id: string): void {
  const sessions = getSessions().filter((s) => s.id !== id);
  saveSessions(sessions);
}

// ─── Packages API ─────────────────────────────────────────────────────────────
export function getPackages() {
  return getStore(PACKAGES_KEY, seedPackages);
}
