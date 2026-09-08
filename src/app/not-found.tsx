import Link from "next/link";
import { BookOpen, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#007D07] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-neutral-800 text-lg">Kind English Course</span>
        </div>

        {/* 404 */}
        <div className="text-9xl font-black text-[#007D07]/10 leading-none mb-2 select-none">
          404
        </div>
        <h1 className="font-bold text-2xl text-neutral-900 mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
          Coba kembali ke beranda atau dashboard.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-neutral-200 text-neutral-700 font-semibold text-sm hover:bg-neutral-100 transition-colors"
          >
            <Home className="w-4 h-4" />
            Beranda
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#007D07] text-white font-semibold text-sm hover:bg-[#006A06] transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
