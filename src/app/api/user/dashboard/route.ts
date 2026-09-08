import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

/**
 * GET /api/user/dashboard?userId=xxx
 * Mengambil data dashboard user dari Supabase
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId query parameter" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Ambil profile dan hasil ujian sekaligus
  const [profileRes, resultsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase
      .from("exam_results")
      .select("*")
      .eq("user_id", userId)
      .order("submitted_at", { ascending: false }),
  ]);

  if (profileRes.error) {
    return NextResponse.json({ error: profileRes.error.message }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    profile: profileRes.data,
    results: resultsRes.data ?? [],
  });
}
