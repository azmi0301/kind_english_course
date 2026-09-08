import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";


// GET /api/admin/stats — ambil statistik untuk dashboard admin
export async function GET() {
  const supabase = createServiceClient();


  // Fetch semua stats secara paralel
  const [questionsResult, usersResult, recentQuestionsResult] = await Promise.all([
    // Total soal per section & package
    supabase
      .from("questions")
      .select("id, section, package_id, text, created_at")
      .order("created_at", { ascending: false }),

    // Total siswa (user dengan role student)
    supabase
      .from("profiles")
      .select("id, email, name, created_at, role")
      .eq("role", "student")
      .order("created_at", { ascending: false }),

    // 5 soal terbaru untuk ditampilkan di dashboard
    supabase
      .from("questions")
      .select("id, section, package_id, text, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const questions = questionsResult.data ?? [];
  const users = usersResult.data ?? [];
  const recentQuestions = recentQuestionsResult.data ?? [];

  const stats = {
    totalQuestions: questions.length,
    bySection: {
      listening: questions.filter((q) => q.section === "listening").length,
      structure: questions.filter((q) => q.section === "structure").length,
      reading: questions.filter((q) => q.section === "reading").length,
    },
    byPackage: {
      "itp-full-sim-01": questions.filter((q) => q.package_id === "itp-full-sim-01").length,
      "diagnostic-01": questions.filter((q) => q.package_id === "diagnostic-01").length,
    },
    totalStudents: users.length,
    recentQuestions: recentQuestions.map((q) => ({
      id: q.id,
      section: q.section,
      package_id: q.package_id,
      text: q.text,
      created_at: q.created_at,
    })),
    recentStudents: users.slice(0, 5).map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      created_at: u.created_at,
    })),
  };

  return NextResponse.json({ success: true, stats });
}

