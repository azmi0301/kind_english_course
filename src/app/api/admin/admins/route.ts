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

// POST /api/admin/admins — buat admin baru langsung
export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Nama lengkap, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // 1. Buat user di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password,
      email_confirm: true,
      user_metadata: { name: name.trim() },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Gagal membuat akun admin." }, { status: 500 });
    }

    // 2. Upsert profile dengan role: "admin"
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: authData.user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "admin",
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "admin",
        created_at: authData.user.created_at || new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}

