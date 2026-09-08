import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { calculateITPScore } from "@/lib/scoreCalculator";

/**
 * POST /api/exam/submit
 * Menyimpan hasil ujian ke Supabase
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      sessionId,
      packageId,
      examTitle,
      examType,
      answers,
      listeningRaw, listeningTotal,
      structureRaw, structureTotal,
      readingRaw, readingTotal,
      durationMinutes,
      startedAt,
    } = body;

    if (!userId || !examTitle || !answers) {
      return NextResponse.json(
        { error: "Missing required fields: userId, examTitle, answers" },
        { status: 400 }
      );
    }

    // Hitung skor TOEFL ITP
    const score = calculateITPScore(
      listeningRaw ?? 0, listeningTotal ?? 0,
      structureRaw ?? 0, structureTotal ?? 0,
      readingRaw ?? 0, readingTotal ?? 0,
    );

    const supabase = createServiceClient();

    // Hitung durasi real dari startedAt sampai sekarang
    const submittedAt = new Date();
    const realDurationMinutes = startedAt
      ? Math.max(1, Math.round((submittedAt.getTime() - new Date(startedAt).getTime()) / 60000))
      : (durationMinutes ?? 115);

    const { data, error } = await supabase
      .from("exam_results")
      .insert({
        user_id: userId,
        session_id: sessionId ?? null,
        package_id: packageId ?? null,
        exam_title: examTitle,
        exam_type: examType ?? "ITP",
        answers,
        listening_raw: score.listening.raw,
        listening_total: score.listening.total,
        listening_scaled: score.listening.scaled,
        structure_raw: score.structure.raw,
        structure_total: score.structure.total,
        structure_scaled: score.structure.scaled,
        reading_raw: score.reading.raw,
        reading_total: score.reading.total,
        reading_scaled: score.reading.scaled,
        total_score: score.total,
        level: score.level,
        duration_minutes: realDurationMinutes,
        certificate_ready: score.total >= 450,
        started_at: startedAt ? new Date(startedAt).toISOString() : null,
        submitted_at: submittedAt.toISOString(),
      })

      .select()
      .single();

    if (error) {
      console.error("[API] Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      result: data,
      score,
    });
  } catch (error) {
    console.error("[API] Submit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
