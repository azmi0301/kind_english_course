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

      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, "F");
      doc.setFillColor(253, 253, 251);
      doc.rect(6, 6, W - 12, H - 12, "F");

      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(1.2);
      doc.rect(8, 8, W - 16, H - 16);

      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.6);
      doc.rect(10.5, 10.5, W - 21, H - 21);

      doc.setDrawColor(0, 125, 7);
      doc.setLineWidth(0.3);
      doc.rect(12, 12, W - 24, H - 24);

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

      doc.setFillColor(15, 23, 42);
      doc.rect(12, 12, W - 24, 18, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("KIND ENGLISH COURSE - CENTER FOR LANGUAGE ASSESSMENT", W / 2, 22.5, { align: "center" });

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(197, 160, 89);
      doc.text("OFFICIAL TOEFL ITP TEST REPORT & CERTIFICATE", W / 2, 27, { align: "center" });

      const certNo = `KEC-ITP-${result.id.slice(0, 8).toUpperCase()}`;
      doc.setFontSize(7.5);
      doc.setFont("courier", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(`Document Ref: ${certNo}`, W - 20, 36, { align: "right" });

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(26);
      doc.setFont("helvetica", "bold");
      doc.text("CERTIFICATE OF ACHIEVEMENT", W / 2, 46, { align: "center" });

      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.8);
      doc.line(W / 2 - 45, 50, W / 2 + 45, 50);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("This is to certify that the individual named below has successfully completed the official examination", W / 2, 58, { align: "center" });

      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 125, 7);
      const uppercaseName = studentName.toUpperCase();
      doc.text(uppercaseName, W / 2, 70, { align: "center" });

      const nameWidth = doc.getTextWidth(uppercaseName);
      doc.setDrawColor(0, 125, 7);
      doc.setLineWidth(0.5);
      doc.line(W / 2 - nameWidth / 2 - 5, 73, W / 2 + nameWidth / 2 + 5, 73);

      doc.setFontSize(10.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("TOEFL ITP Institutional Test", W / 2, 82, { align: "center" });

      const boxY = 90;
      const boxW = 160;
      const boxH = 46;
      const boxX = (W - boxW) / 2;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, "FD");

      const qrSize = 36;
      const qrX = boxX + 8;
      const qrY = boxY + 5;
      doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.4);
      doc.rect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2);

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
      doc.text(`Verification Portal: kindenglish.id/verify/${result.id.slice(0, 8)}`, textLeft, boxY + 38);

      const footerY = 152;
      const dateStr = new Date(result.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`Issued Date: ${dateStr}`, 30, footerY + 5);
      doc.text("Security: ENCRYPTED DIGITAL HASH", 30, footerY + 10);
      doc.text("Status: VERIFIED OFFICIAL RECORD", 30, footerY + 15);

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

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      // Try loading signature image if available
      try {
        const sigRes = await fetch("/signature.png");
        if (sigRes.ok) {
          const sigBlob = await sigRes.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(sigBlob);
          });
          doc.addImage(base64, "PNG", W - 68, footerY + 6, 36, 11);
        }
      } catch {}

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

      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "This certificate confirms test completion and official performance evaluation under Kind English Course Assessment Board.",
        W / 2,
        H - 14,
        { align: "center" }
      );

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
