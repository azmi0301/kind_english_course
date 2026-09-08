import Link from "next/link";
import { BookOpen, Mail, Phone, Share2, PlayCircle, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <>
      {/* CTA Banner */}
      <section className="gradient-primary py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-800 text-white mb-4">
            Siap Ikuti Tes TOEFL ITP Resmi?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Bergabung dengan ribuan peserta yang mempercayakan tes TOEFL ITP mereka kepada Kind English Course.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#007D07] font-semibold rounded-xl hover:bg-neutral-50 transition-all text-sm hover:-translate-y-0.5"
            >
              Daftar &amp; Ikuti Tes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm"
            >
              Masuk ke Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#007D07] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-heading font-800 text-white text-sm block leading-tight">Kind English</span>
                  <span className="text-[10px] text-[#007D07] font-semibold tracking-wide uppercase">Course</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-5">
                Penyelenggara tes TOEFL ITP resmi secara online. Profesional, terstandarisasi, dan terpercaya.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-[#007D07] transition-colors">
                  <Share2 className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-[#007D07] transition-colors">
                  <PlayCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-heading font-700 text-white text-sm mb-5">Platform</h4>
              <ul className="space-y-3 text-sm">
                {["TOEFL ITP Test", "Student Dashboard", "Sertifikat Digital", "Verifikasi Online"].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-[#007D07] transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-heading font-700 text-white text-sm mb-5">Informasi</h4>
              <ul className="space-y-3 text-sm">
                {["Panduan TOEFL ITP", "Cara Daftar", "Tips Tes", "FAQ", "Kebijakan Privasi"].map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-[#007D07] transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-heading font-700 text-white text-sm mb-5">Kontak</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#007D07]" />
                  <span>info@kindenglish.id</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#007D07]" />
                  <span>+62 812-3456-7890</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <span>© {new Date().getFullYear()} Kind English Course. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#007D07] transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-[#007D07] transition-colors">Syarat &amp; Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
