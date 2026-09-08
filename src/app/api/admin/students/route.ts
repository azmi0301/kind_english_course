import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// GET /api/admin/students
export async function GET() {
  const supabase = createServiceClient();

  // 1. Ambil semua auth users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error("[students] auth.admin.listUsers error:", authError.message);
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const authUsers = authData?.users ?? [];

  // 2. Ambil semua profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*");

  const profileMap = new Map((profiles ?? []).map((p: { id: string }) => [p.id, p]));

  // 3. Untuk auth users yang belum punya profile, buat otomatis
  const missingUsers = authUsers.filter((u) => !profileMap.has(u.id));
  if (missingUsers.length > 0) {
    const inserts = missingUsers.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      name: u.user_metadata?.name ?? u.user_metadata?.full_name ?? u.email ?? "",
      role: "student",
    }));
    const { data: inserted } = await supabase.from("profiles").insert(inserts).select();
    (inserted ?? []).forEach((p: { id: string }) => profileMap.set(p.id, p));
  }

  // 4. Ambil semua exam results
  const { data: results } = await supabase
    .from("exam_results")
    .select("id, user_id, exam_title, exam_type, total_score, listening_scaled, structure_scaled, reading_scaled, submitted_at")
    .order("submitted_at", { ascending: false });

  // 5. Gabungkan: hanya tampilkan non-admin
  const students = authUsers
    .map((u) => {
      const profile = profileMap.get(u.id) as Record<string, unknown> | undefined;
      return {
        id: u.id,
        email: u.email ?? "",
        name: profile?.name ?? u.user_metadata?.name ?? u.email ?? "",
        role: profile?.role ?? "student",
        created_at: profile?.created_at ?? u.created_at,
        results: (results ?? []).filter((r) => r.user_id === u.id),
      };
    })
    .filter((u) => u.role !== "admin")
    .sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime());

  return NextResponse.json({ students });
}
