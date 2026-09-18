"use client";
import { useState, useCallback } from "react";
import { Loader2, Download, Lock } from "lucide-react";
import type { TestResult } from "@/lib/scoreCalculator";

interface CertificateDownloaderProps {
  result: TestResult;
  studentName?: string;
  /** If true, always render the button (ignores certificateReady flag from DB) */
  showAlways?: boolean;
  /** If true, button takes full width */
  fullWidth?: boolean;
}

export default function CertificateDownloader({
  result,
  studentName = "Student Name",
  showAlways = false,
  fullWidth = false,
}: CertificateDownloaderProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Coba unduh dari Server API yang memiliki header No-Cache
      const apiUrl = `/api/certificate/${result.id}?t=${Date.now()}`;
      const res = await fetch(apiUrl);

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `KEC-Official-Certificate-${studentName.replace(/\s+/g, "_")}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setLoading(false);
        return;
      }

      // 2. Fallback Client-side jsPDF jika offline / fallback
      const { jsPDF } = await import("jspdf");
      const QRCode = (await import("qrcode")).default;
      const verifyUrl = `${window.location.origin}/verify/${result.id}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        margin: 1,
        width: 300,
        color: { dark: "#0f172a", light: "#ffffff" },
      });

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      // Clean White Background Canvas
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, "F");

      // Subtle Background Watermark Concentric Waves (Left & Right)
      doc.setDrawColor(241, 238, 230);
      doc.setLineWidth(0.25);
      for (let r = 25; r <= 95; r += 10) {
        doc.ellipse(0, H / 2, r, r * 1.5);
        doc.ellipse(W, H / 2, r, r * 1.5);
      }

      // --- Top-Left Luxury Corner Ribbons ---
      doc.setFillColor(212, 175, 55); // Gold base
      doc.triangle(0, 0, 52, 0, 0, 52, "F");

      doc.setFillColor(15, 23, 42); // Navy primary triangle
      doc.triangle(0, 0, 44, 0, 0, 44, "F");

      doc.setDrawColor(212, 175, 55); // Gold stripe
      doc.setLineWidth(1.4);
      doc.line(0, 56, 56, 0);

      doc.setDrawColor(15, 23, 42); // Navy accent stripe
      doc.setLineWidth(3);
      doc.line(0, 63, 63, 0);

      doc.setDrawColor(212, 175, 55); // Thin gold accent
      doc.setLineWidth(0.7);
      doc.line(0, 68, 68, 0);

      // --- Bottom-Right Luxury Corner Ribbons ---
      doc.setFillColor(212, 175, 55); // Gold base
      doc.triangle(W, H, W - 52, H, W, H - 52, "F");

      doc.setFillColor(15, 23, 42); // Navy primary triangle
      doc.triangle(W, H, W - 44, H, W, H - 44, "F");

      doc.setDrawColor(212, 175, 55); // Gold stripe
      doc.setLineWidth(1.4);
      doc.line(W, H - 56, W - 56, H);

      doc.setDrawColor(15, 23, 42); // Navy accent stripe
      doc.setLineWidth(3);
      doc.line(W, H - 63, W - 63, H);

      doc.setDrawColor(212, 175, 55); // Thin gold accent
      doc.setLineWidth(0.7);
      doc.line(W, H - 68, W - 68, H);

      // --- Thin Gold Inner Margin Border ---
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.6);
      doc.rect(10, 10, W - 20, H - 20);

      // --- TOP HEADER (Left & Right) ---
      // Left: Logo + Vertical Line + Institutional Branding
      const headerY = 16;
      try {
        const logoRes = await fetch("/logo.png");
        if (logoRes.ok) {
          const logoBlob = await logoRes.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(logoBlob);
          });
          doc.addImage(base64, "PNG", 24, headerY - 3, 20, 20);
        }
      } catch {}

      // Vertical Separator Bar
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.8);
      doc.line(48, headerY - 2, 48, headerY + 18);

      // Institution Text Stack
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("KIND ENGLISH COURSE", 52, headerY + 2.5);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 140, 50); // Gold
      doc.text("CENTER FOR LANGUAGE ASSESSMENT", 52, headerY + 7.5);

      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(197, 160, 89);
      doc.text("OFFICIAL TOEFL ITP TEST REPORT & CERTIFICATE", 52, headerY + 12);

      // Right Header: Document Ref Box
      const certNo = `KEC-ITP-${result.id.slice(0, 8).toUpperCase()}`;
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("Document Ref:", W - 24, headerY + 2.5, { align: "right" });

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(certNo, W - 24, headerY + 7.5, { align: "right" });

      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.5);
      doc.line(W - 48, headerY + 10, W - 24, headerY + 10);

      // --- MAIN CERTIFICATE TITLE ---
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(23);
      doc.setFont("helvetica", "bold");
      doc.text("CERTIFICATE OF ACHIEVEMENT", W / 2, 46, { align: "center" });

      // Elegant Gold Center Ornament
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.7);
      doc.line(W / 2 - 42, 51, W / 2 - 4, 51);
      doc.line(W / 2 + 4, 51, W / 2 + 42, 51);
      doc.setFillColor(197, 160, 89);
      // Diamond in center
      doc.triangle(W / 2, 49.5, W / 2 - 2, 51, W / 2 + 2, 51, "F");
      doc.triangle(W / 2, 52.5, W / 2 - 2, 51, W / 2 + 2, 51, "F");

      // Statement text
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("This is to certify that the individual named below has successfully completed", W / 2, 57, { align: "center" });
      doc.text("the official examination", W / 2, 61, { align: "center" });

      // --- PARTICIPANT NAME ---
      doc.setFontSize(21);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      const uppercaseName = studentName.toUpperCase();
      doc.text(uppercaseName, W / 2, 72, { align: "center" });

      // Refined Gold Underline for Name
      const nameWidth = Math.min(doc.getTextWidth(uppercaseName), 140);
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.9);
      doc.line(W / 2 - nameWidth / 2 - 6, 75.5, W / 2 + nameWidth / 2 + 6, 75.5);

      // Exam Name
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("TOEFL ITP INSTITUTIONAL TEST", W / 2, 83, { align: "center" });

      // --- CENTRAL QR CODE & SCORE REPORT CARD (Exact user layout) ---
      const boxX = 36;
      const boxY = 89;
      const boxW = W - 72; // 225 mm
      const boxH = 48;

      // Outer Rounded Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "FD");

      // Left QR Code Frame with Gold Border
      const qrX = boxX + 6;
      const qrY = boxY + 5.5;
      const qrSize = 37;
      doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.6);
      doc.roundedRect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2, 1, 1);

      // Vertical Gold Accent Line next to QR Code
      const textLeft = qrX + qrSize + 8;
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.8);
      doc.line(textLeft - 3, boxY + 8, textLeft - 3, boxY + 40);

      // Box Header Text
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("OFFICIAL DIGITAL SCORE REPORT & VERIFICATION", textLeft, boxY + 12);

      // Explanation Text
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text("Scan this QR barcode to access the authenticated score report,", textLeft, boxY + 18);
      doc.text("including full section breakdown (Listening, Structure, Reading),", textLeft, boxY + 23);
      doc.text("total scaled score (310-677), and CEFR proficiency evaluation.", textLeft, boxY + 28);

      // Verification Pill Badge
      const pillY = boxY + 33;
      const pillW = 120;
      const pillH = 7.5;
      doc.setFillColor(254, 243, 199); // Warm Gold/Amber Tint
      doc.setDrawColor(245, 158, 11);
      doc.setLineWidth(0.3);
      doc.roundedRect(textLeft, pillY, pillW, pillH, 2, 2, "FD");

      // Checkmark circle in badge
      doc.setFillColor(15, 23, 42);
      doc.circle(textLeft + 4.5, pillY + 3.75, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(4.5);
      doc.setFont("helvetica", "bold");
      doc.text("✓", textLeft + 3.6, pillY + 4.6);

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`Verification Portal: kindenglish.id/verify/${result.id.slice(0, 8)}`, textLeft + 9, pillY + 5);

      // --- FOOTER SECTION ---
      const footerY = 153;
      const dateStr = new Date(result.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Left Column: Issued Date & Security
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);

      // Date icon box
      doc.setDrawColor(203, 213, 225);
      doc.rect(24, footerY + 1.5, 4.5, 4.5);
      doc.text(`Issued Date: ${dateStr}`, 32, footerY + 5);

      // Lock icon box
      doc.rect(24, footerY + 8.5, 4.5, 4.5);
      doc.text("Security: ENCRYPTED DIGITAL HASH", 32, footerY + 12);

      // Center Column: Elegant Script Motto
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.5);
      doc.line(W / 2 - 32, footerY + 5, W / 2 - 18, footerY + 5);
      doc.line(W / 2 + 18, footerY + 5, W / 2 + 32, footerY + 5);

      doc.setFont("times", "italic");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Kind English", W / 2, footerY + 6.5, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text("LEARN   •   GROW   •   SUCCEED", W / 2, footerY + 12, { align: "center" });

      // Right Column: Signature
      const sigX = W - 66;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text("Authorized Signature:", sigX, footerY + 1);

      // Load custom signature image if available
      let sigLoaded = false;
      try {
        const sigRes = await fetch("/signature.png");
        if (sigRes.ok) {
          const sigBlob = await sigRes.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(sigBlob);
          });
          doc.addImage(base64, "PNG", sigX, footerY + 2, 38, 12);
          sigLoaded = true;
        }
      } catch {}

      // Fallback signature flourish if image not uploaded yet
      if (!sigLoaded) {
        doc.setFont("times", "italic");
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.text("Afis", sigX + 10, footerY + 10);
      }

      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.5);
      doc.line(sigX - 4, footerY + 14, sigX + 42, footerY + 14);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(15, 23, 42);
      doc.text("KIND ENGLISH COURSE", sigX + 19, footerY + 18, { align: "center" });

      doc.save(`KEC-Official-Certificate-${studentName.replace(/\s+/g, "_")}.pdf`);
    } catch (e) {
      console.error("Certificate error:", e);
    } finally {
      setLoading(false);
    }
  }, [result, studentName]);

  // Non-ITP exams don't have certificates
  if (result.examType !== "ITP") {
    if (!showAlways) return null;
    return (
      <button
        disabled
        className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 text-xs font-medium flex items-center gap-1 cursor-not-allowed"
      >
        <Lock className="w-3.5 h-3.5" />
        No Certificate
      </button>
    );
  }

  const isEligible = result.certificateReady || showAlways;

  if (!isEligible) {
    return (
      <button
        disabled
        className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 text-xs font-medium flex items-center gap-1 cursor-not-allowed"
        title="Sertifikat tersedia untuk skor minimal 450"
      >
        <Lock className="w-3.5 h-3.5" />
        Skor &lt; 450
      </button>
    );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#007D07] text-white text-xs font-bold hover:bg-[#006A06] transition-all shadow-sm disabled:opacity-60 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      {loading ? "Menyiapkan PDF..." : "Unduh Sertifikat"}
    </button>
  );
}
