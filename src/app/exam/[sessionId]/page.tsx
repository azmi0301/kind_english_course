import { EXAM_PACKAGES, FULL_ITP_EXAM } from "@/lib/examData";
import type { ExamPackage } from "@/lib/examData";
import ExamEngine from "@/components/exam/ExamEngine";

export function generateStaticParams() {
  return EXAM_PACKAGES.map((pkg) => ({ sessionId: pkg.id }));
}

// Nonaktifkan static generation agar selalu fetch data terbaru dari DB
export const dynamic = "force-dynamic";

interface ExamPageProps {
  params: Promise<{ sessionId: string }>;
}

async function fetchExamFromDB(packageId: string): Promise<ExamPackage | null> {
  try {
    // Gunakan absolute URL karena ini server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/exam/${packageId}`, {
      cache: "no-store", // selalu ambil data terbaru
    });
    if (!res.ok) return null;
    const { exam } = await res.json();
    return exam ?? null;
  } catch {
    return null;
  }
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { sessionId } = await params;

  // Coba ambil soal dari database dulu
  const dbExam = await fetchExamFromDB(sessionId);

  // Fallback ke hardcoded jika DB kosong (belum ada soal yang diisi admin)
  const hardcodedExam = EXAM_PACKAGES.find((p) => p.id === sessionId) ?? FULL_ITP_EXAM;
  const exam = dbExam ?? hardcodedExam;

  return <ExamEngine exam={exam} sessionId={sessionId} />;
}

export const metadata = {
  title: "TOEFL Exam — Kind English Course",
  description: "TOEFL institutional exam engine. Full-screen, distraction-free.",
};
