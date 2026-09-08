"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "Berapa lama total durasi dan jumlah soal dalam ujian TOEFL ITP?",
    a: "Total durasi ujian adalah kurang lebih 115 menit dengan 140 butir soal, yang terbagi dalam 3 seksi: Listening Comprehension (50 soal, ~35 menit), Structure & Written Expression (40 soal, 25 menit), dan Reading Comprehension (50 soal, 55 menit).",
  },
  {
    q: "Kapan hasil skor dan sertifikat ujian saya keluar?",
    a: "Hasil skor keluar seketika (instan) segera setelah Anda menyelesaikan dan mengumpulkan ujian. Sertifikat digital resmi dalam format PDF ber-barcode juga langsung dapat diunduh dari dashboard siswa Anda.",
  },
  {
    q: "Bagaimana cara kerja barcode verifikasi pada sertifikat?",
    a: "Setiap sertifikat memiliki QR Code unik. Pihak universitas, perusahaan, atau instansi penerima cukup men-scan barcode tersebut menggunakan kamera HP untuk melihat halaman verifikasi resmi keaslian skor dan nama peserta.",
  },
  {
    q: "Bagaimana jika koneksi internet saya terputus di tengah ujian?",
    a: "Sistem dilengkapi fitur Auto-Save setiap 5 detik. Jawaban Anda tersimpan otomatis di cloud sehingga progres ujian Anda tetap aman.",
  },
  {
    q: "Apakah audio seksi Listening bisa diputar berulang-ulang?",
    a: "Sesuai dengan standar resmi ujian TOEFL ITP nyata, audio seksi Listening hanya dapat diputar 1 kali untuk melatih konsentrasi dan memastikan validitas penilaian.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#007D07]/10 border border-[#007D07]/20 mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#007D07]" />
            <span className="text-xs font-bold text-[#007D07] tracking-wider uppercase">Pertanyaan Umum</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Temukan jawaban cepat seputar pelaksanaan tes TOEFL ITP, format soal, dan sertifikat resmi.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-slate-50 border-emerald-300/80 shadow-xs"
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-sm text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "bg-[#007D07] text-white rotate-180" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
