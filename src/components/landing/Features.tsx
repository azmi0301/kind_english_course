import { Timer, BarChart3, Headphones, Award, ShieldCheck, Laptop } from "lucide-react";

const features = [
  {
    icon: Timer,
    number: "01",
    title: "Durasi & Timer Standar Resmi",
    description:
      "Timer countdown tersinkronisasi per section (Listening 35m, Structure 25m, Reading 55m) dengan visualisasi peringatan sisa waktu.",
  },
  {
    icon: Headphones,
    number: "02",
    title: "Audio Listening Terintegrasi",
    description:
      "Pemutaran audio otomatis dengan pembatasan satu kali putar — menjamin kepatuhan penuh terhadap standar ujian TOEFL ITP internasional.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Konversi Skor CEFR (310–677)",
    description:
      "Perhitungan skor instan dengan konversi skala resmi, analisis performa per bagian ujian, dan pemetaan tingkat kecakapan bahasa.",
  },
  {
    icon: Award,
    number: "04",
    title: "Sertifikat PDF & QR Verifikasi",
    description:
      "Sertifikat digital terbit otomatis lengkap dengan nomor identifikasi unik dan barcode yang dapat diverifikasi online oleh kampus/instansi.",
  },
  {
    icon: ShieldCheck,
    number: "05",
    title: "Sistem Keamanan & Auto-Save",
    description:
      "Jawaban tersimpan otomatis ke server secara berkala. Melindungi sesi ujian dari kendala koneksi atau perangkat secara aman.",
  },
  {
    icon: Laptop,
    number: "06",
    title: "Tampilan Ujian Terstandarisasi",
    description:
      "Antarmuka ramah pengguna yang dirancang khusus untuk kenyamanan membaca soal panjang dan navigasi cepat antar nomor soal.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#007D07]" />
            <span className="text-xs font-bold text-slate-700 tracking-wider uppercase">Standar Keunggulan</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Keunggulan Platform Ujian <span className="text-[#007D07]">Kind English</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Dirancang secara profesional untuk menghadirkan pengalaman tes TOEFL ITP yang presisi, aman, dan diakui.
          </p>
        </div>

        {/* Feature Grid - Clean 3 Columns Institutional Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.number}
                className="group p-7 rounded-3xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#007D07]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center group-hover:bg-[#E8F5E9] group-hover:text-[#007D07] group-hover:border-emerald-200 transition-colors shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-emerald-500 transition-colors">
                      {feat.number}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-slate-900 text-base mb-2.5 leading-snug group-hover:text-[#007D07] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

