import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// GET /api/admin/auth/check?userId=xxx — verifikasi apakah user adalah admin
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ isAdmin: false, reason: "no_user_id" });
  }

  const supabase = createServiceClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return NextResponse.json({ isAdmin: profile?.role === "admin" });
}
