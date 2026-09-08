import { Star, CheckCircle2, Award } from "lucide-react";

const testimonials = [
  {
    name: "Nabila Putri S.",
    role: "Mahasiswi Tingkat Akhir",
    institution: "Universitas Indonesia",
    tag: "Syarat Sidang Skripsi",
    avatar: "NP",
    avatarBg: "bg-emerald-100 text-[#007D07]",
    score: 543,
    target: "Target: 500",
    quote:
      "Awalnya sempat was-was karena butuh sertifikat cepat buat daftar sidang komprehensif. Begitu selesai tes, sertifikat digital langsung terbit dan QR code verifikasinya langsung valid pas dicek bagian akademik fakultas. Sangat ngebantu!",
  },
  {
    name: "Dimas Arya Pratama",
    role: "Fresh Graduate",
    institution: "Pendaftar Rekrutmen BUMN",
    tag: "Pemberkasan Kerja",
    avatar: "DA",
    avatarBg: "bg-blue-100 text-blue-700",
    score: 567,
    target: "Target: 525",
    quote:
      "Audio listening-nya jernih banget dan gak ada lag pas pindah-pindah soal reading yang panjang. Tampilannya bersih dan waktu pengerjaan per bagian bener-bener disiplin sesuai standar TOEFL resmi. Alhamdulillah lolos seleksi berkas.",
  },
  {
    name: "Farah Diba Anggraini",
    role: "Awardee Aspirant",
    institution: "Persiapan Beasiswa LPDP",
    tag: "Seleksi Beasiswa",
    avatar: "FD",
    avatarBg: "bg-purple-100 text-purple-700",
    score: 580,
    target: "Target: 550",
    quote:
      "Platform tes online paling terstruktur yang pernah saya coba. Format soal Structure & Written Expression-nya bener-bener akurat dengan standar ujian asli. Sertifikatnya resmi dan berformat institusional.",
  },
  {
    name: "Reza Kurniawan",
    role: "Calon Mahasiswa Pascasarjana",
    institution: "Universitas Gadjah Mada",
    tag: "Syarat Masuk S2",
    avatar: "RK",
    avatarBg: "bg-amber-100 text-amber-700",
    score: 553,
    target: "Target: 500",
    quote:
      "Petunjuk ujiannya jelas dari awal sampai akhir. Gak ribet dan sistem auto-save jawabannya bikin tenang pas ngerjain soal. Hasil breakdown nilai per section juga langsung kelihatan begitu tes selesai.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#007D07]/10 border border-[#007D07]/20 mb-4">
            <Award className="w-3.5 h-3.5 text-[#007D07]" />
            <span className="text-xs font-semibold text-[#007D07] tracking-wide">Pengalaman Peserta</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-800 text-neutral-900 mb-4">
            Cerita Nyata dari{" "}
            <span className="text-[#007D07]">Peserta Ujian</span>
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-base">
            Digunakan oleh mahasiswa, lulusan baru, dan profesional untuk keperluan sidang skripsi, beasiswa, hingga syarat seleksi kerja.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-neutral-200/80 p-6 hover:border-[#007D07]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header card: Tag & Rating */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {t.tag}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-[13.5px] text-neutral-600 leading-relaxed mb-6 font-normal">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              <div>
                {/* Result Score Pill */}
                <div className="flex items-center justify-between mb-5 px-3.5 py-2.5 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#007D07]" />
                    <span>{t.target}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block leading-tight">Skor Resmi</span>
                    <span className="text-sm font-heading font-800 text-[#007D07]">{t.score}</span>
                  </div>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-700 text-xs flex-shrink-0 ${t.avatarBg}`}>
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-900 truncate">{t.name}</div>
                    <div className="text-[11px] text-neutral-500 truncate">{t.role}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{t.institution}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

