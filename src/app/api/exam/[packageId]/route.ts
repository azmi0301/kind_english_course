import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import type { ExamPackage, ExamSection, Question, QuestionType } from "@/lib/examData";

const PACKAGE_META: Record<string, { title: string; description: string }> = {
  "itp-full-sim-01": {
    title: "TOEFL ITP Institutional Test",
    description: "Official TOEFL ITP test package with Listening, Structure, and Reading sections.",
  },
  "diagnostic-01": {
    title: "TOEFL Diagnostic Test",
    description: "Diagnostic test to assess student skill level.",
  },
};

const SECTION_META: Record<QuestionType, { id: string; title: string; durationSeconds: number; instructions: string }> = {
  listening: {
    id: "listening",
    title: "Section 1: Listening Comprehension",
    durationSeconds: 35 * 60,
    instructions:
      "In this section of the test, you will have an opportunity to demonstrate your ability to understand conversations and talks in English. There are two parts to this section with special directions for each part. Answer all questions on the basis of what is stated or implied by the speakers.",
  },
  structure: {
    id: "structure",
    title: "Section 2: Structure and Written Expression",
    durationSeconds: 25 * 60,
    instructions:
      "This section is designed to measure your ability to recognize language that is appropriate for standard written English. Choose the one word or phrase that best completes the sentence.",
  },
  reading: {
    id: "reading",
    title: "Section 3: Reading Comprehension",
    durationSeconds: 55 * 60,
    instructions:
      "In this section of the test, you will read several passages. Each one is followed by a number of questions about it. Choose the one best answer, (A), (B), (C), or (D), to each question.",
  },
};

// GET /api/exam/[packageId] — ambil soal dari DB dan konvert ke ExamPackage
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ packageId: string }> }
) {
  const { packageId } = await params;

  const supabase = createServiceClient();

  // Ambil pengaturan durasi dari DB
  const { data: settingsData } = await supabase
    .from("exam_settings")
    .select("listening_minutes, structure_minutes, reading_minutes")
    .eq("id", "default")
    .single();

  const durationMap: Record<QuestionType, number> = {
    listening: (settingsData?.listening_minutes ?? 35) * 60,
    structure: (settingsData?.structure_minutes ?? 25) * 60,
    reading:   (settingsData?.reading_minutes   ?? 55) * 60,
  };

  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("package_id", packageId)
    .order("section")
    .order("number", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Jika tidak ada soal di DB, kembalikan null agar client bisa fallback ke hardcoded
  if (!data || data.length === 0) {
    return NextResponse.json({ exam: null });
  }

  // Kelompokkan soal per section
  const sectionOrder: QuestionType[] = ["listening", "structure", "reading"];
  const grouped: Record<string, typeof data> = {};
  for (const q of data) {
    if (!grouped[q.section]) grouped[q.section] = [];
    grouped[q.section].push(q);
  }

  const sections: ExamSection[] = sectionOrder
    .filter((type) => grouped[type]?.length > 0)
    .map((type) => {
      const meta = SECTION_META[type];
      const questions: Question[] = grouped[type].map((q) => ({
        id: q.id,
        number: q.number,
        type: q.section as QuestionType,
        passage: q.passage ?? undefined,
        audioUrl: q.audio_url ?? undefined,
        question: q.text,
        choices: Object.entries(q.options as Record<string, string>).map(([id, text]) => ({
          id,
          text,
        })),
        correctAnswer: q.answer,
      }));

      return {
        id: meta.id,
        title: meta.title,
        type,
        durationSeconds: durationMap[type],
        instructions: meta.instructions,
        questions,
      };
    });

  const pkgMeta = PACKAGE_META[packageId] ?? {
    title: packageId,
    description: "TOEFL exam package.",
  };

  const exam: ExamPackage = {
    id: packageId,
    title: pkgMeta.title,
    description: pkgMeta.description,
    sections,
  };

  return NextResponse.json({ exam });
}
