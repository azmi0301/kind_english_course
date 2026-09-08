import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("exam_sessions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[delete session] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
