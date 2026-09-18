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

      const totalScore = result.score.total;
      const listeningScaled = result.score.listening.scaled;
      const structureScaled = result.score.structure.scaled;
      const readingScaled = result.score.reading.scaled;
      const cefrLevel = result.score.level;

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      // Background Canvas
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, "F");

      // Warm Ivory Certificate Background
      doc.setFillColor(253, 253, 250);
      doc.rect(5, 5, W - 10, H - 10, "F");

      // Triple Ornate Borders (Navy, Gold, Green)
      doc.setDrawColor(15, 23, 42); // Navy
      doc.setLineWidth(1.2);
      doc.rect(8, 8, W - 16, H - 16);

      doc.setDrawColor(197, 160, 89); // Gold
      doc.setLineWidth(0.6);
      doc.rect(10.5, 10.5, W - 21, H - 21);

      doc.setDrawColor(0, 125, 7); // Emerald Green Accent
      doc.setLineWidth(0.3);
      doc.rect(12, 12, W - 24, H - 24);

      // Ornate Corner Accents
      const cornerSize = 7;
      const corners = [
        [12, 12],
        [W - 12 - cornerSize, 12],
        [12, H - 12 - cornerSize],
        [W - 12 - cornerSize, H - 12 - cornerSize],
      ];
      doc.setFillColor(197, 160, 89);
      corners.forEach(([cx, cy]) => {
        doc.rect(cx, cy, cornerSize, cornerSize, "F");
        doc.setFillColor(15, 23, 42);
        doc.rect(cx + 1.5, cy + 1.5, cornerSize - 3, cornerSize - 3, "F");
        doc.setFillColor(197, 160, 89);
      });

      // --- HEADER SECTION ---
      // Logo on Left
      try {
        const logoRes = await fetch("/logo.png");
        if (logoRes.ok) {
          const logoBlob = await logoRes.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(logoBlob);
          });
          doc.addImage(base64, "PNG", 18, 15, 18, 18);
        }
      } catch {}

      // Header Institution Title (Centered)
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("KIND ENGLISH COURSE", W / 2, 21, { align: "center" });

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 140, 50); // Gold
      doc.text("CENTER FOR LANGUAGE ASSESSMENT & CERTIFICATION", W / 2, 26, { align: "center" });

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Kampung Inggris Pare • Kediri, Jawa Timur • Website: kindenglish.id", W / 2, 30, { align: "center" });

      // Document Reference ID (Top Right)
      const certNo = `KEC-ITP-${result.id.slice(0, 8).toUpperCase()}`;
      doc.setFontSize(7.5);
      doc.setFont("courier", "bold");
      doc.setTextColor(71, 85, 105);
      doc.text(`Document Ref: ${certNo}`, W - 18, 20, { align: "right" });
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 125, 7);
      doc.text("STATUS: AUTHENTICATED", W - 18, 24.5, { align: "right" });

      // Divider Line Under Header
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.7);
      doc.line(18, 34, W - 18, 34);

      // --- CERTIFICATE MAIN TITLE ---
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(21);
      doc.setFont("helvetica", "bold");
      doc.text("CERTIFICATE OF ACHIEVEMENT", W / 2, 43, { align: "center" });

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 140, 50);
      doc.text("TEST OF ENGLISH AS A FOREIGN LANGUAGE (TOEFL ITP® SIMULATION)", W / 2, 48, { align: "center" });

      // Statement Intro
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("This is to certify that the individual named below has successfully completed the examination:", W / 2, 55, { align: "center" });

      // --- PARTICIPANT NAME ---
      doc.setFontSize(19);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      const uppercaseName = studentName.toUpperCase();
      doc.text(uppercaseName, W / 2, 64, { align: "center" });

      const nameWidth = Math.min(doc.getTextWidth(uppercaseName), 180);
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.6);
      doc.line(W / 2 - nameWidth / 2 - 8, 66.5, W / 2 + nameWidth / 2 + 8, 66.5);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("has demonstrated English language proficiency with the following official scaled scores:", W / 2, 72, { align: "center" });

      // --- SCORE REPORT & QR CODE BENTO BOX (Y: 76 to 134) ---
      const boxX = 18;
      const boxY = 76;
      const boxW = W - 36; // 261 mm
      const boxH = 58;

      // Box background
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "FD");

      // Inner Box Title
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(boxX, boxY, boxW, 8.5, 3, 3, "F");
      doc.rect(boxX, boxY + 4, boxW, 4.5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("OFFICIAL SECTION SCORE BREAKDOWN & PERFORMANCE REPORT", boxX + 6, boxY + 5.8);
      doc.setFontSize(7);
      doc.setTextColor(197, 160, 89);
      doc.text("STANDARD ITP SCALING (310 - 677)", boxX + boxW - 6, boxY + 5.8, { align: "right" });

      // 3 Section Cards + 1 Total Score Card
      const colW = 44;
      const colGap = 4;
      const startCardX = boxX + 6;
      const cardY = boxY + 12;
      const cardH = 39;

      // Section 1: Listening
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.roundedRect(startCardX, cardY, colW, cardH, 2, 2, "FD");
      doc.setFillColor(147, 51, 234); // Purple top accent
      doc.rect(startCardX, cardY, colW, 2.5, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(147, 51, 234);
      doc.text("SECTION 1", startCardX + colW / 2, cardY + 7, { align: "center" });
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text("Listening", startCardX + colW / 2, cardY + 11.5, { align: "center" });
      doc.text("Comprehension", startCardX + colW / 2, cardY + 15, { align: "center" });
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(147, 51, 234);
      doc.text(`${listeningScaled}`, startCardX + colW / 2, cardY + 25, { align: "center" });
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Scaled Score (Max 68)", startCardX + colW / 2, cardY + 31, { align: "center" });
      doc.text("50 Questions • 35 Min", startCardX + colW / 2, cardY + 35, { align: "center" });

      // Section 2: Structure
      const card2X = startCardX + colW + colGap;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(card2X, cardY, colW, cardH, 2, 2, "FD");
      doc.setFillColor(37, 99, 235); // Blue top accent
      doc.rect(card2X, cardY, colW, 2.5, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("SECTION 2", card2X + colW / 2, cardY + 7, { align: "center" });
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text("Structure & Written", card2X + colW / 2, cardY + 11.5, { align: "center" });
      doc.text("Expression", card2X + colW / 2, cardY + 15, { align: "center" });
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text(`${structureScaled}`, card2X + colW / 2, cardY + 25, { align: "center" });
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Scaled Score (Max 68)", card2X + colW / 2, cardY + 31, { align: "center" });
      doc.text("40 Questions • 25 Min", card2X + colW / 2, cardY + 35, { align: "center" });

      // Section 3: Reading
      const card3X = card2X + colW + colGap;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(card3X, cardY, colW, cardH, 2, 2, "FD");
      doc.setFillColor(5, 150, 105); // Emerald top accent
      doc.rect(card3X, cardY, colW, 2.5, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(5, 150, 105);
      doc.text("SECTION 3", card3X + colW / 2, cardY + 7, { align: "center" });
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text("Reading", card3X + colW / 2, cardY + 11.5, { align: "center" });
      doc.text("Comprehension", card3X + colW / 2, cardY + 15, { align: "center" });
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(5, 150, 105);
      doc.text(`${readingScaled}`, card3X + colW / 2, cardY + 25, { align: "center" });
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Scaled Score (Max 67)", card3X + colW / 2, cardY + 31, { align: "center" });
      doc.text("50 Questions • 55 Min", card3X + colW / 2, cardY + 35, { align: "center" });

      // Total Score Card (Grand Gold Badge)
      const card4X = card3X + colW + colGap;
      const card4W = 54;
      doc.setFillColor(255, 251, 235); // Warm gold tint
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.8);
      doc.roundedRect(card4X, cardY, card4W, cardH, 2, 2, "FD");
      doc.setFillColor(180, 140, 50);
      doc.rect(card4X, cardY, card4W, 2.5, "F");
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 140, 50);
      doc.text("TOTAL ITP SCORE", card4X + card4W / 2, cardY + 7, { align: "center" });
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 125, 7);
      doc.text(`${totalScore}`, card4X + card4W / 2, cardY + 17, { align: "center" });

      doc.setFillColor(0, 125, 7);
      doc.roundedRect(card4X + 4, cardY + 20, card4W - 8, 7, 1.5, 1.5, "F");
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(cefrLevel.toUpperCase(), card4X + card4W / 2, cardY + 24.5, { align: "center" });

      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Official CEFR Equivalent", card4X + card4W / 2, cardY + 32, { align: "center" });
      doc.text("Score Range: 310 - 677", card4X + card4W / 2, cardY + 35.5, { align: "center" });

      // QR Code & Security Column (Far Right inside Box)
      const qrX = card4X + card4W + 5;
      const qrSize = 29;
      doc.addImage(qrDataUrl, "PNG", qrX, cardY + 1, qrSize, qrSize);
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.4);
      doc.rect(qrX - 0.5, cardY + 0.5, qrSize + 1, qrSize + 1);

      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("SCAN TO VERIFY", qrX + qrSize / 2, cardY + 33, { align: "center" });
      doc.setFontSize(5.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 125, 7);
      doc.text(`ID: ${result.id.slice(0, 8)}`, qrX + qrSize / 2, cardY + 36, { align: "center" });

      // --- FOOTER & SIGNATURE SECTION (Y: 140 to 195) ---
      const footerY = 144;
      const dateStr = new Date(result.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Left Column: Credentials & Security Info
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Verification & Validity Details:", 20, footerY + 5);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`Issue Date        : ${dateStr}`, 20, footerY + 10);
      doc.text(`Center Code     : KEC-PARE-ID01`, 20, footerY + 14.5);
      doc.text(`Security Hash  : SHA256-ENCRYPTED-VERIFIED`, 20, footerY + 19);
      doc.text(`Online Portal    : kindenglish.id/verify/${result.id.slice(0, 8)}`, 20, footerY + 23.5);

      // Center Column: Gold Embossed Seal
      const sealX = W / 2;
      const sealY = footerY + 15;
      doc.setFillColor(197, 160, 89);
      doc.setDrawColor(180, 140, 50);
      doc.circle(sealX, sealY, 14, "FD");
      doc.setFillColor(15, 23, 42);
      doc.circle(sealX, sealY, 11.5, "F");
      doc.setFillColor(255, 255, 255);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.text("KIND ENGLISH", sealX, sealY - 4, { align: "center" });
      doc.setFontSize(5.5);
      doc.setTextColor(197, 160, 89);
      doc.text("★ OFFICIAL ★", sealX, sealY, { align: "center" });
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text("SEAL & STAMP", sealX, sealY + 4, { align: "center" });
      doc.setFontSize(5);
      doc.setTextColor(197, 160, 89);
      doc.text("PARE - KEDIRI", sealX, sealY + 7.5, { align: "center" });

      // Right Column: Authorized Signature
      const sigX = W - 78;
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Authorized Signature:", sigX, footerY + 5);

      // Check if custom signature image exists in /signature.png
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
          doc.addImage(base64, "PNG", sigX + 5, footerY + 6, 42, 14);
          sigLoaded = true;
        }
      } catch {}

      if (!sigLoaded) {
        doc.setFont("times", "italic");
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("Kind English Director", sigX + 12, footerY + 15);
      }

      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.5);
      doc.line(sigX, footerY + 21, sigX + 60, footerY + 21);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Academic Director", sigX, footerY + 26);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Kind English Course Assessment Board", sigX, footerY + 30);

      // Bottom Notice
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "This certificate is issued as an authenticated report of English proficiency test results administered by Kind English Course. Verification available online.",
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
