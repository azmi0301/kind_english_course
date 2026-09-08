import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export interface ExamSessionDB {
  id: string;
  title: string;
  package_id: string;
  package_title: string;
  start_date: string;
  end_date: string;
  status: "upcoming" | "active" | "completed";
  participant_count: number;
  created_at: string;
}

// GET /api/admin/sessions — ambil daftar sesi ujian real dari Supabase DB
export async function GET() {
  const supabase = createServiceClient();

  const { data: sessions, error } = await supabase
    .from("exam_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // Jika tabel exam_sessions belum dibuat di Supabase, kembalikan array kosong
    return NextResponse.json({ sessions: [] });
  }

  // Hitung status otomatis berdasarkan waktu saat ini
  const now = new Date();
  const formatted = (sessions ?? []).map((s) => {
    const start = new Date(s.start_date);
    const end = new Date(s.end_date);
    let status: "upcoming" | "active" | "completed" = s.status;

    if (now < start) status = "upcoming";
    else if (now >= start && now <= end) status = "active";
    else status = "completed";

    return {
      id: s.id,
      title: s.title,
      packageId: s.package_id,
      packageTitle: s.package_title,
      startDate: s.start_date,
      endDate: s.end_date,
      status,
      participantCount: s.participant_count ?? 0,
      createdAt: s.created_at,
    };
  });

  return NextResponse.json({ sessions: formatted });
}

// POST /api/admin/sessions — buat sesi ujian baru di Supabase DB
export async function POST(request: Request) {
  const supabase = createServiceClient();
  const body = await request.json();

  const { title, packageId, packageTitle, startDate, endDate, status } = body;

  const { data, error } = await supabase
    .from("exam_sessions")
    .insert({
      title,
      package_id: packageId ?? "itp-full-sim-01",
      package_title: packageTitle ?? "TOEFL ITP Institutional Test",
      start_date: startDate,
      end_date: endDate,
      status: status ?? "upcoming",
      participant_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("[sessions POST] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}
