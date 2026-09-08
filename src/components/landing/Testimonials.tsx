import { Star, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Siti Rahayu",
    role: "Scholarship Applicant",
    university: "UI Depok",
    avatar: "SR",
    avatarBg: "bg-pink-100 text-pink-700",
    before: 487,
    after: 563,
    quote:
      "Saya latihan di Kind English selama 6 minggu sebelum tes resmi. Simulasinya mirip banget sama soal asli. Alhamdulillah score saya naik 76 poin dan dapat beasiswa!",
    stars: 5,
  },
  {
    name: "Budi Santoso",
    role: "Graduate Student",
    university: "ITS Surabaya",
    avatar: "BS",
    avatarBg: "bg-blue-100 text-blue-700",
    before: 510,
    after: 580,
    quote:
      "The listening module is incredibly realistic. The single-play restriction really forces you to focus, just like the real TOEFL. My listening score jumped from 47 to 60.",
    stars: 5,
  },
  {
    name: "Dewi Lestari",
    role: "Company Scholarship",
    university: "Bandung, West Java",
    avatar: "DL",
    avatarBg: "bg-purple-100 text-purple-700",
    before: 527,
    after: 597,
    quote:
      "Fitur auto-save dan timer alert-nya sangat membantu. Saya bisa fokus belajar tanpa khawatir kehilangan jawaban. Score struktur saya naik drastis.",
    stars: 5,
  },
  {
    name: "Rizki Pratama",
    role: "University Entrance",
    university: "UGM Yogyakarta",
    avatar: "RP",
    avatarBg: "bg-amber-100 text-amber-700",
    before: 467,
    after: 550,
    quote:
      "Dari score 467 bisa tembus 550+ dalam 2 bulan. Dashboard analytics-nya bagus banget — saya tau persis bagian mana yang harus diperkuat.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#007D07]/10 border border-[#007D07]/20 mb-4">
            <Star className="w-3.5 h-3.5 text-[#007D07]" />
            <span className="text-xs font-semibold text-[#007D07] tracking-wide">Student Success Stories</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-800 text-neutral-900 mb-4">
            Real Students,{" "}
            <span className="text-[#007D07]">Real Results</span>
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto">
            Join thousands of students who have achieved their target TOEFL score with Kind English Course.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-neutral-100 p-6 hover:border-[#007D07]/30 hover:shadow-lg transition-all duration-300 animate-fade-in-up flex flex-col"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-neutral-600 leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Score progression */}
              <div className="flex items-center gap-2 mb-5 p-3 bg-[#E8F5E9] rounded-xl">
                <TrendingUp className="w-4 h-4 text-[#007D07]" />
                <span className="text-neutral-500 text-xs font-medium">{t.before}</span>
                <span className="text-neutral-400 text-xs">→</span>
                <span className="text-[#007D07] text-sm font-heading font-800">{t.after}</span>
                <span className="text-xs font-semibold text-[#007D07] ml-auto">+{t.after - t.before}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-700 text-sm flex-shrink-0 ${t.avatarBg}`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{t.name}</div>
                  <div className="text-xs text-neutral-500">{t.role} · {t.university}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
