import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// POST /api/admin/questions/bulk-passage — atur 1 teks bacaan/cerita (passage) ke rentang nomor soal reading (misal No. 1 s/d 10)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packageId, section = "reading", startNumber, endNumber, passage } = body;

    if (!packageId || startNumber === undefined || endNumber === undefined || !passage) {
      return NextResponse.json(
        { error: "Lengkapi paket soal, rentang nomor awal & akhir, serta teks cerita (passage)." },
        { status: 400 }
      );
    }

    const start = Number(startNumber);
    const end = Number(endNumber);

    if (start > end) {
      return NextResponse.json({ error: "Nomor awal tidak boleh lebih besar dari nomor akhir." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("questions")
      .update({ passage })
      .eq("package_id", packageId)
      .eq("section", section)
      .gte("number", start)
      .lte("number", end)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      updatedCount: data?.length ?? 0,
      message: `Berhasil menerapkan teks cerita (passage) ke ${data?.length ?? 0} soal Reading (No. ${start} s/d ${end})`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
