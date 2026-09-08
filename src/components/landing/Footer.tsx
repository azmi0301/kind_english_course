"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, ArrowRight, MessageCircle } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import InfoModal, { ModalType } from "./InfoModal";

export default function Footer() {
  const [modalType, setModalType] = useState<ModalType>(null);

  return (
    <>
      {/* Modal Popup Container */}
      <InfoModal type={modalType} onClose={() => setModalType(null)} />

      {/* CTA Banner */}
      <section className="gradient-primary py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-800 text-white mb-4">
            Siap Ikuti Tes TOEFL ITP Resmi?
          </h2>
          <p className="text-white/85 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Bergabung dengan ribuan peserta yang mempercayakan tes TOEFL ITP mereka bersama Kind English Course.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#007D07] font-bold rounded-2xl hover:bg-neutral-50 shadow-lg transition-all text-sm hover:-translate-y-0.5"
            >
              Daftar &amp; Mulai Tes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/50 text-white font-bold rounded-2xl hover:bg-white/10 transition-all text-sm"
            >
              Masuk ke Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand & Socials */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BrandLogo size="md" className="shadow-xs" />
                <div>
                  <span className="font-heading font-800 text-white text-base block leading-tight">Kind English</span>
                  <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">Course</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed mb-5 text-neutral-400">
                Penyelenggara tes TOEFL ITP terstandarisasi secara online. Dilengkapi analitik skor instan dan sertifikat digital ber-barcode resmi.
              </p>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com/kindenglishcourse"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Kind English Course"
                  className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:border-transparent transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <a
                  href="https://facebook.com/kindenglishcourse"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Kind English Course"
                  className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-neutral-300 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20Kind%20English%20Course,%20saya%20ingin%20tanya%20seputar%20tes%20TOEFL%20ITP"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Admin"
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-400 text-xs font-semibold hover:bg-[#007D07] hover:text-white transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-heading font-700 text-white text-sm mb-4">Platform</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <Link href="/auth/login" className="hover:text-emerald-400 transition-colors">
                    Mulai Ujian TOEFL ITP
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                    Dashboard Peserta
                  </Link>
                </li>
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors">
                    Fitur &amp; Keunggulan
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                    Alur &amp; Langkah Tes
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources / Modals */}
            <div>
              <h4 className="font-heading font-700 text-white text-sm mb-4">Panduan &amp; Info</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => setModalType("panduan")}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    Panduan Format TOEFL ITP
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType("tips")}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    Tips &amp; Strategi Tes
                  </button>
                </li>
                <li>
                  <a href="#faq" className="hover:text-emerald-400 transition-colors">
                    Pertanyaan Umum (FAQ)
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setModalType("privasi")}
                    className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                  >
                    Kebijakan Privasi
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-heading font-700 text-white text-sm mb-4">Layanan Kontak</h4>
              <ul className="space-y-3 text-xs sm:text-sm">
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#007D07] flex-shrink-0" />
                  <a href="mailto:info@kindenglish.id" className="hover:text-white transition-colors">
                    info@kindenglish.id
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#007D07] flex-shrink-0" />
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    +62 812-3456-7890 (WA)
                  </a>
                </li>
                <li className="text-xs text-neutral-500 pt-1">
                  Senin – Sabtu, 08:00 – 21:00 WIB
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <span>© {new Date().getFullYear()} Kind English Course. All rights reserved.</span>
            <div className="flex gap-6">
              <button
                onClick={() => setModalType("privasi")}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Kebijakan Privasi
              </button>
              <button
                onClick={() => setModalType("syarat")}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Syarat &amp; Ketentuan
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

