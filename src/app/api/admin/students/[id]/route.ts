import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  // 1. Hapus riwayat ujian
  await supabase.from("exam_results").delete().eq("user_id", id);

  // 2. Hapus profile
  await supabase.from("profiles").delete().eq("id", id);

  // 3. Hapus user dari Supabase Auth
  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    console.error("[delete student] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
