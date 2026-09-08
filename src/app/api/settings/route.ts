import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// GET /api/settings — Public endpoint untuk cek durasi & jadwal login
export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("exam_settings")
    .select("*")
    .eq("id", "default")
    .single();

  if (error) {
    return NextResponse.json({
      settings: {
        listening_minutes: 35,
        structure_minutes: 25,
        reading_minutes: 55,
        login_schedule_enabled: false,
        login_start_time: null,
        login_end_time: null,
      },
    });
  }

  return NextResponse.json({ settings: data });
}
