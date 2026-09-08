import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// GET /api/admin/admins — ambil semua user (admin & student)
export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data ?? [] });
}

// PATCH /api/admin/admins — ubah role user
export async function PATCH(request: Request) {
  const { userId, role, requesterId } = await request.json();

  if (!["admin", "student"].includes(role)) {
    return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });
  }

  // Tidak boleh ubah role diri sendiri
  if (userId === requesterId) {
    return NextResponse.json({ error: "Tidak bisa mengubah role akun sendiri." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

