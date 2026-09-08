import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// POST /api/admin/verify — cek apakah user adalah admin
export async function POST(request: Request) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ isAdmin: false }, { status: 400 });
  }

  // Gunakan service role agar bypass RLS
  const supabase = createServiceClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return NextResponse.json({ isAdmin: profile?.role === "admin" });
}
