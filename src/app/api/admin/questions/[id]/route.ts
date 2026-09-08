import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// PUT /api/admin/questions/[id] — update soal
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { section, number, text, options, answer, passage, audioUrl, points } = body;

  const supabase = createServiceClient();
  const updateData: Record<string, any> = {
    section,
    text,
    options,
    answer,
    passage: passage ?? null,
    audio_url: audioUrl ?? null,
    points: points ?? 1,
  };

  if (number !== undefined && number !== null) {
    updateData.number = Number(number);
  }

  const { data, error } = await supabase
    .from("questions")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, question: data });
}

// DELETE /api/admin/questions/[id] — hapus soal
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = createServiceClient();
  const { error } = await supabase.from("questions").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
