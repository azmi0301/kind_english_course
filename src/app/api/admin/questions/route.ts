import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// GET /api/admin/questions — ambil semua soal
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageId = searchParams.get("packageId");
  const type = searchParams.get("type");

  const supabase = createServiceClient();
  let query = supabase.from("questions").select("*").order("number", { ascending: true });

  if (packageId) query = query.eq("package_id", packageId);
  if (type) query = query.eq("section", type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, questions: data });
}

// POST /api/admin/questions — tambah soal baru
export async function POST(request: Request) {
  const body = await request.json();
  const { packageId, section, number, text, options, answer, passage, audioUrl, points } = body;

  if (!packageId || !section || !text || !options || !answer) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = createServiceClient();

  let questionNumber = number;
  if (!questionNumber) {
    const { count } = await supabase
      .from("questions")
      .select("*", { count: "exact", head: true })
      .eq("package_id", packageId)
      .eq("section", section);
    questionNumber = (count ?? 0) + 1;
  }

  const newId = crypto.randomUUID();

  const { data, error } = await supabase
    .from("questions")
    .insert({
      id:         newId,
      package_id: packageId,
      section,
      number:     questionNumber,
      text,
      options,
      answer,
      passage:   passage   ?? null,
      audio_url: audioUrl  ?? null,
      points:    points    ?? 1,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, question: data });
}
