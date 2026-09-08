import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

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
        id: "default",
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

export async function PUT(request: Request) {
  const supabase = createServiceClient();
  const body = await request.json();

  const {
    listening_minutes,
    structure_minutes,
    reading_minutes,
    login_schedule_enabled,
    login_start_time,
    login_end_time,
  } = body;

  const payload: Record<string, unknown> = {
    id: "default",
    listening_minutes,
    structure_minutes,
    reading_minutes,
    updated_at: new Date().toISOString(),
  };

  if (typeof login_schedule_enabled !== "undefined") {
    payload.login_schedule_enabled = login_schedule_enabled;
  }
  if (typeof login_start_time !== "undefined") {
    payload.login_start_time = login_start_time;
  }
  if (typeof login_end_time !== "undefined") {
    payload.login_end_time = login_end_time;
  }

  const { data, error } = await supabase
    .from("exam_settings")
    .upsert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}
