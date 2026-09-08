import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

/**
 * GET /api/exam/results?userId=xxx
 * GET /api/exam/results?sessionId=xxx
 * Mengambil hasil ujian dari Supabase
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const sessionId = searchParams.get("sessionId");

  if (!userId && !sessionId) {
    return NextResponse.json(
      { error: "Missing userId or sessionId query parameter" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  let query = supabase
    .from("exam_results")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (userId) query = query.eq("user_id", userId);
  if (sessionId) query = query.eq("session_id", sessionId);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, results: data });
}
