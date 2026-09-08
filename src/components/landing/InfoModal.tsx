"use client";
import { useEffect } from "react";
import { X, BookOpen, Lightbulb, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export type ModalType = "panduan" | "tips" | "privasi" | "syarat" | null;

interface InfoModalProps {
  type: ModalType;
  onClose: () => void;
}

export default function InfoModal({ type, onClose }: InfoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (type) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scale-in z-10">
        {/* Header Modal */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            {type === "panduan" && (
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#007D07] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
            )}
            {type === "tips" && (
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
            )}
            {type === "privasi" && (
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            {type === "syarat" && (
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {type === "panduan" && "Panduan Lengkap Tes TOEFL ITP"}
                {type === "tips" && "Tips & Strategi Pengerjaan Tes"}
                {type === "privasi" && "Kebijakan Privasi Peserta"}
                {type === "syarat" && "Syarat & Ketentuan Layanan"}
              </h3>
              <p className="text-xs text-slate-500">Kind English Course Official Standard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 leading-relaxed">
          {/* PANDUAN */}
          {type === "panduan" && (
            <div className="space-y-5">
              <p>
                Tes TOEFL ITP di Kind English Course diselenggarakan dengan standar institusional dan format 3 sesi ujian terstruktur:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Section 1: Listening Comprehension
                    </span>
                    <span className="text-xs font-semibold text-[#007D07] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      50 Soal • ~35 Menit
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Menguji kemampuan memahami percakapan pendek (Part A), percakapan panjang (Part B), dan kuliah akademis (Part C). Audio diputar 1 kali sesuai standar resmi TOEFL ITP.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Section 2: Structure & Written Expression
                    </span>
                    <span className="text-xs font-semibold text-[#007D07] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      40 Soal • 25 Menit
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Menguji penguasaan tata bahasa baku bahasa Inggris (Structure 1-15 dan Written Expression 16-40 yang mencari kata/frasa yang salah).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Section 3: Reading Comprehension
                    </span>
                    <span className="text-xs font-semibold text-[#007D07] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      50 Soal • 55 Menit
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Menguji kemampuan membaca dan memahami teks bacaan akademis ilmiah, kosakata dalam konteks, dan ide pokok bacaan.
                  </p>
                </div>
              </div>

              <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#007D07] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <strong className="text-[#007D07] block font-bold mb-0.5">Sistem Penilaian Resmi (310 – 677)</strong>
                  Skor akhir dihitung berdasarkan konversi skala terstandarisasi. Sertifikat PDF resmi lengkap dengan QR code verifikasi online langsung tersedia setelah Anda menekan tombol Selesai Ujian.
                </div>
              </div>
            </div>
          )}

          {/* TIPS */}
          {type === "tips" && (
            <div className="space-y-4">
              <p>
                Berikut adalah strategi teruji untuk memaksimalkan skor TOEFL ITP Anda:
              </p>

              <div className="space-y-3">
                <div className="border-l-4 border-[#007D07] pl-3 py-1">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">1. Strategi Listening (Fokus Pembicara Kedua)</h4>
                  <p className="text-xs text-slate-600">
                    Pada Part A, petunjuk jawaban hampir selalu ada pada kalimat pembicara kedua. Cari sinonim atau parafrasa di pilihan jawaban.
                  </p>
                </div>

                <div className="border-l-4 border-[#007D07] pl-3 py-1">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">2. Strategi Structure (Subjek & Verb Utama)</h4>
                  <p className="text-xs text-slate-600">
                    Temukan Subject dan Verb utama dalam kalimat terlebih dahulu. Pastikan klausa, konektor (kata hubung), dan agreement subjek-predikat sudah tepat.
                  </p>
                </div>

                <div className="border-l-4 border-[#007D07] pl-3 py-1">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">3. Strategi Reading (Skim & Scan)</h4>
                  <p className="text-xs text-slate-600">
                    Jangan membaca seluruh bacaan kata demi kata di awal. Baca soal terlebih dahulu, lalu cari kata kunci di paragraf terkait untuk menghemat waktu.
                  </p>
                </div>

                <div className="border-l-4 border-amber-500 pl-3 py-1">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">4. Tidak Ada Sistem Minus (Jawab Semua Soal)</h4>
                  <p className="text-xs text-slate-600">
                    TOEFL ITP tidak memberlakukan pengurangan poin untuk jawaban salah. Pastikan seluruh 140 soal terjawab sebelum waktu habis!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PRIVASI */}
          {type === "privasi" && (
            <div className="space-y-4 text-xs">
              <p>
                Kind English Course berkomitmen penuh menjaga kerahasiaan dan keamanan data pribadi setiap peserta tes:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Data Identitas:</strong> Nama lengkap, email, dan instansi Anda hanya digunakan untuk kebutuhan administrasi pembuatan akun dan penerbitan sertifikat digital resmi.
                </li>
                <li>
                  <strong>Hasil & Skor Ujian:</strong> Hasil tes dan histori ujian bersifat pribadi dan hanya dapat diakses melalui akun peserta dan admin verifikator resmi.
                </li>
                <li>
                  <strong>Verifikasi QR Code:</strong> Halaman verifikasi publik (`/verify/[id]`) hanya menampilkan nama peserta, tanggal tes, nomor sertifikat, dan skor valid untuk keperluan validasi keaslian dokumen oleh pihak universitas/institusi kerja.
                </li>
                <li>
                  <strong>Keamanan Server:</strong> Semua data tersimpan dengan standar enkripsi modern pada infrastruktur database berkeamanan tinggi.
                </li>
              </ul>
            </div>
          )}

          {/* SYARAT */}
          {type === "syarat" && (
            <div className="space-y-4 text-xs">
              <p>
                Dengan mendaftar dan mengikuti ujian TOEFL ITP di Kind English Course, peserta menyetujui ketentuan berikut:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Integritas Ujian:</strong> Peserta wajib mengerjakan seluruh sesi ujian secara mandiri tanpa bantuan pihak ketiga atau perangkat curang.
                </li>
                <li>
                  <strong>Koneksi & Perangkat:</strong> Peserta bertanggung jawab atas kestabilan koneksi internet dan kelayakan perangkat (laptop/PC disarankan) selama sesi tes berlangsung.
                </li>
                <li>
                  <strong>Sistem Auto-Save:</strong> Jawaban disimpan secara berkala. Jika terjadi kendala jaringan sesaat, peserta dapat melanjutkan kembali selama batas waktu sesi belum berakhir.
                </li>
                <li>
                  <strong>Keabsahan Sertifikat:</strong> Sertifikat yang diterbitkan adalah dokumen resmi berbasis hasil simulasi & tes terstandarisasi yang dapat diverifikasi secara online.
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#007D07] hover:bg-[#006A06] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
