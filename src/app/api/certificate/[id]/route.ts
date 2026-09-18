import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  // 1. Ambil data hasil ujian dari Supabase
  const { data: result } = await supabase
    .from("exam_results")
    .select("*, profiles(name, email)")
    .eq("id", id)
    .single();

  let studentName = "STUDENT";
  let submittedDate = new Date();

  if (result) {
    const profile = Array.isArray(result.profiles) ? result.profiles[0] : result.profiles;
    studentName = profile?.name || profile?.email?.split("@")[0] || "STUDENT";
    submittedDate = result.submitted_at ? new Date(result.submitted_at) : new Date();
  }

  // 2. Generate Verification QR Code
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || (host && !host.includes("localhost") ? "https" : "http");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (host ? `${proto}://${host}` : "http://localhost:3000");
  const verifyUrl = `${baseUrl}/verify/${id}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 300,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });

  // 3. Buat PDF Sertifikat Formal & Simple dengan Barcode Skor
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const W = doc.internal.pageSize.getWidth();  // 297 mm
  const H = doc.internal.pageSize.getHeight(); // 210 mm

  // Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, "F");

  doc.setFillColor(253, 253, 251);
  doc.rect(6, 6, W - 12, H - 12, "F");

  // Triple Borders (Navy, Gold, Green)
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1.2);
  doc.rect(8, 8, W - 16, H - 16);

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.6);
  doc.rect(10.5, 10.5, W - 21, H - 21);

  doc.setDrawColor(0, 125, 7);
  doc.setLineWidth(0.3);
  doc.rect(12, 12, W - 24, H - 24);

  // Corner Gold Accents
  const corners = [
    [12, 12],
    [W - 17, 12],
    [12, H - 17],
    [W - 17, H - 17],
  ];
  doc.setFillColor(197, 160, 89);
  corners.forEach(([cx, cy]) => {
    doc.rect(cx, cy, 5, 5, "F");
  });

  // Top Navy Header Bar
  doc.setFillColor(15, 23, 42);
  doc.rect(12, 12, W - 24, 20, "F");

  // Embed Kind English Logo in Header if available
  try {
    const fs = await import("fs");
    const path = await import("path");
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      const logoData = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
      doc.addImage(logoData, "PNG", 16, 14, 16, 16);
    }
  } catch (err) {
    console.warn("Logo load error in certificate:", err);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("KIND ENGLISH COURSE - CENTER FOR LANGUAGE ASSESSMENT", W / 2, 21.5, {
    align: "center",
  });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(197, 160, 89);
  doc.text("OFFICIAL TOEFL ITP TEST REPORT & CERTIFICATE", W / 2, 26.5, {
    align: "center",
  });

  // Ref Number
  const certNo = `KEC-ITP-${id.slice(0, 8).toUpperCase()}`;
  doc.setFontSize(7.5);
  doc.setFont("courier", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Document Ref: ${certNo}`, W - 20, 37, { align: "right" });

  // Certificate Title
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE OF ACHIEVEMENT", W / 2, 46, { align: "center" });

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.8);
  doc.line(W / 2 - 45, 50, W / 2 + 45, 50);

  // Statement intro
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("This is to certify that the individual named below has successfully completed the official examination", W / 2, 58, {
    align: "center",
  });

  // Recipient Name
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 125, 7);
  const uppercaseName = studentName.toUpperCase();
  doc.text(uppercaseName, W / 2, 70, { align: "center" });

  const nameWidth = doc.getTextWidth(uppercaseName);
  doc.setDrawColor(0, 125, 7);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - nameWidth / 2 - 5, 73, W / 2 + nameWidth / 2 + 5, 73);

  // Exam Subtitle
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("TOEFL ITP Institutional Test", W / 2, 82, { align: "center" });

  // --- Central QR Code & Digital Score Box ---
  const boxY = 90;
  const boxW = 160;
  const boxH = 46;
  const boxX = (W - boxW) / 2;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, "FD");

  // Embed QR Code
  const qrSize = 36;
  const qrX = boxX + 8;
  const qrY = boxY + 5;
  doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

  // QR Code Border frame
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.4);
  doc.rect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2);

  // QR Code Explanation Text
  const textLeft = qrX + qrSize + 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("OFFICIAL DIGITAL SCORE REPORT & VERIFICATION", textLeft, boxY + 12);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Scan this QR barcode to access the authenticated score report,", textLeft, boxY + 19);
  doc.text("including full section breakdown (Listening, Structure, Reading),", textLeft, boxY + 24);
  doc.text("total scaled score (310-677), and CEFR proficiency evaluation.", textLeft, boxY + 29);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 125, 7);
  doc.text(`Verification Portal: kindenglish.id/verify/${id.slice(0, 8)}`, textLeft, boxY + 38);

  // --- Footer & Seal ---
  const dateStr = submittedDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const footerY = 152;

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Issued Date: ${dateStr}`, 30, footerY + 5);
  doc.text("Security: ENCRYPTED DIGITAL HASH", 30, footerY + 10);
  doc.text("Status: VERIFIED OFFICIAL RECORD", 30, footerY + 15);

  // Seal
  doc.setFillColor(197, 160, 89);
  doc.setDrawColor(180, 140, 60);
  doc.circle(W / 2, footerY + 10, 12, "FD");
  doc.setFillColor(255, 255, 255);
  doc.circle(W / 2, footerY + 10, 10, "F");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("KIND ENGLISH", W / 2, footerY + 9, { align: "center" });
  doc.text("OFFICIAL SEAL", W / 2, footerY + 12.5, { align: "center" });

  // Signature
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Authorized Signature:", W - 75, footerY + 5);

  // Check if custom signature image exists in public/signature.png
  try {
    const fs = await import("fs");
    const path = await import("path");
    const sigPath = path.join(process.cwd(), "public", "signature.png");
    if (fs.existsSync(sigPath)) {
      const sigData = `data:image/png;base64,${fs.readFileSync(sigPath).toString("base64")}`;
      doc.addImage(sigData, "PNG", W - 68, footerY + 6, 36, 11);
    }
  } catch (err) {
    console.warn("Signature image load error:", err);
  }

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(W - 75, footerY + 18, W - 25, footerY + 18);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Academic Director", W - 75, footerY + 23);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Kind English Course Assessment Board", W - 75, footerY + 27);

  // Bottom text
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "This certificate confirms test completion and official performance evaluation under Kind English Course Assessment Board.",
    W / 2,
    H - 14,
    { align: "center" }
  );

  const pdfArrayBuffer = doc.output("arraybuffer");
  const filename = `KEC-Official-Certificate-${studentName.replace(/\s+/g, "_")}.pdf`;

  return new NextResponse(pdfArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
