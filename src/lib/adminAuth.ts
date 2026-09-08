import { createServiceClient } from "./supabase";
import { NextResponse } from "next/server";

/**
 * Verifikasi apakah userId yang dikirim memiliki role admin.
 * Gunakan bersama getSession() di client side.
 */
export async function verifyAdminById(userId: string | null | undefined): Promise<
  { ok: true; userId: string } | { ok: false; response: NextResponse }
> {
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const supabase = createServiceClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profile?.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden: admin only" }, { status: 403 }),
    };
  }

  return { ok: true, userId };
}

// Alias untuk backward compatibility
export const verifyAdmin = verifyAdminById;
