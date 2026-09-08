import Link from "next/link";
import { CheckCircle2, ArrowRight, Zap, BookOpen, Headphones } from "lucide-react";

const packages = [
  {
    id: "diagnostic",
    icon: Zap,
    tag: "Gratis",
    tagColor: "text-[#007D07] bg-[#E8F5E9]",
    title: "Diagnostic Test",
    subtitle: "Ukur kemampuan awalmu",
    price: "Gratis",
    priceNote: "Perlu akun",
    duration: "30 menit",
    href: "/auth/login",
    features: [
      "4 soal Reading + 4 soal Structure",
      "Skor instan dengan penilaian level",
      "Rekomendasi area yang perlu ditingkatkan",
      "Hasil langsung setelah tes selesai",
    ],
    cta: "Mulai Diagnostic Test",
    ctaStyle: "border border-[#007D07] text-[#007D07] hover:bg-[#E8F5E9]",
    cardStyle: "border border-neutral-200 bg-white",
    popular: false,
  },
  {
    id: "full-itp",
    icon: BookOpen,
    tag: "Paling Populer",
    tagColor: "text-white bg-[#007D07]",
    title: "TOEFL ITP Full Test",
    subtitle: "Tes resmi kondisi ujian nyata",
    price: "Tersedia",
    priceNote: "Hubungi kami",
    duration: "115 menit",
    href: "/auth/login",
    features: [
      "3 section: Listening, Structure, Reading",
      "Timer & kondisi persis seperti ujian asli",
      "Skor ITP terstandarisasi (310–677)",
      "Breakdown skor detail per section",
      "Sertifikat digital PDF otomatis",
      "Auto-save setiap 5 detik",
    ],
    cta: "Ikuti Tes TOEFL ITP",
    ctaStyle: "bg-[#007D07] text-white hover:bg-[#006A06] shadow-brand",
    cardStyle: "border-2 border-[#007D07] bg-white shadow-brand",
    popular: true,
  },
];

export default function TestPackages() {
  return (
    <section id="packages" className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#007D07]/10 border border-[#007D07]/20 mb-4">
            <Headphones className="w-3.5 h-3.5 text-[#007D07]" />
            <span className="text-xs font-semibold text-[#007D07] tracking-wide">Paket Tes</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-800 text-neutral-900 mb-4">
            Pilih Paket Tes{" "}
            <span className="text-[#007D07]">TOEFL Kamu</span>
          </h2>
          <p className="text-neutral-600 max-w-xl mx-auto">
            Dari diagnostic test cepat hingga tes TOEFL ITP penuh — semua tersedia dalam satu platform resmi.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 items-start max-w-3xl mx-auto">
          {packages.map((pkg, i) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl duration-300 ${pkg.cardStyle} animate-fade-in-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#007D07] text-white text-xs font-bold px-4 py-1 rounded-full shadow-brand">
                    ⭐ Paling Populer
                  </div>
                )}

                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-5 ${pkg.tagColor}`}>
                  {pkg.tag}
                </div>

                <div className="w-12 h-12 rounded-xl bg-[#007D07]/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#007D07]" />
                </div>

                <h3 className="font-heading text-xl font-700 text-neutral-900 mb-1">{pkg.title}</h3>
                <p className="text-sm text-neutral-500 mb-5">{pkg.subtitle}</p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-heading font-900 text-neutral-900">{pkg.price}</span>
                  <span className="text-sm text-neutral-500">{pkg.priceNote}</span>
                </div>

                <div className="text-xs text-neutral-400 font-medium mb-5 flex items-center gap-1">
                  ⏱ {pkg.duration}
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#007D07] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-neutral-600">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={pkg.href}
                  className={`group w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm transition-all ${pkg.ctaStyle}`}
                >
                  {pkg.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
