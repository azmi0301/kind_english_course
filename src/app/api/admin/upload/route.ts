import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";


// POST /api/admin/upload — upload file audio ke Supabase Storage
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;


  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Validasi tipe file
  const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/mp4"];
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
    return NextResponse.json({ error: "File harus berupa audio (MP3, WAV, OGG, M4A)" }, { status: 400 });
  }

  // Validasi ukuran (max 50MB)
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "Ukuran file maksimal 50MB" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Nama file unik agar tidak bertabrakan
  const ext = file.name.split(".").pop() ?? "mp3";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `listening/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from("audio")
    .upload(filePath, buffer, {
      contentType: file.type || "audio/mpeg",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Ambil public URL
  const { data: urlData } = supabase.storage.from("audio").getPublicUrl(filePath);

  return NextResponse.json({ success: true, url: urlData.publicUrl });
}
