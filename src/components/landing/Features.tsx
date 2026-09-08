import { Timer, BarChart3, Headphones, Award, Save, Shield, Smartphone, Zap } from "lucide-react";

const features = [
  {
    icon: Timer,
    title: "Timer Countdown Otomatis",
    description: "Countdown visual dengan peringatan kuning di 5 menit dan merah di 1 menit — persis seperti kondisi ujian asli.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Analitik Skor Lengkap",
    description: "Skor ITP terstandarisasi (310–677) dengan breakdown per section, persentase benar, dan penilaian level.",
    color: "bg-[#E8F5E9] text-[#007D07]",
  },
  {
    icon: Headphones,
    title: "Modul Listening Terintegrasi",
    description: "Audio player terintegrasi dengan pembatasan satu kali putar — sesuai standar tes TOEFL ITP resmi.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Award,
    title: "Sertifikat Digital Otomatis",
    description: "Sertifikat PDF siap unduh dengan nama, skor, tanggal, dan branding resmi Kind English Course.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Save,
    title: "Auto-Save Setiap 5 Detik",
    description: "Jawaban tersimpan otomatis untuk mencegah kehilangan data dari gangguan koneksi atau perangkat.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: Shield,
    title: "Mode Ujian Anti-Gangguan",
    description: "Tampilan fullscreen menyembunyikan semua navigasi. Lingkungan fokus untuk peserta tes yang serius.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Smartphone,
    title: "Desain Responsif",
    description: "Optimal untuk sesi ujian di desktop, dengan dukungan mobile untuk review hasil dan pantau progress.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Zap,
    title: "Hasil Instan",
    description: "Skor dan feedback detail langsung muncul setelah submit — tanpa menunggu, tanpa penundaan.",
    color: "bg-orange-50 text-orange-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#007D07]/10 border border-[#007D07]/20 mb-4">
            <Zap className="w-3.5 h-3.5 text-[#007D07]" />
            <span className="text-xs font-semibold text-[#007D07] tracking-wide">Fitur Platform</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-800 text-neutral-900 mb-4">
            Semua yang Kamu Butuhkan untuk{" "}
            <span className="text-[#007D07]">Sukses TOEFL</span>
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto">
            Dibangun dengan standar tinggi untuk menghadirkan pengalaman tes TOEFL ITP yang profesional, akurat, dan terpercaya.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group p-6 rounded-2xl border border-neutral-100 bg-white hover:border-[#007D07]/30 hover:shadow-lg transition-all duration-300 cursor-default animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${feat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-700 text-neutral-900 text-sm mb-2 leading-tight">{feat.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
