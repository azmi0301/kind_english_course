"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    router.push("/");
  };

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-md"
          : "bg-white/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandLogo size="sm" className="shadow-brand group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-heading font-800 text-neutral-900 text-sm leading-tight block">
                Kind English
              </span>
              <span className="text-[10px] text-[#007D07] font-semibold leading-tight block tracking-wide uppercase">
                Course
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            <a href="#how-it-works" className="text-xs font-bold text-slate-600 hover:text-[#007D07] transition-colors">
              Alur Ujian
            </a>
            <a href="#features" className="text-xs font-bold text-slate-600 hover:text-[#007D07] transition-colors">
              Fitur
            </a>
            <a href="#testimonials" className="text-xs font-bold text-slate-600 hover:text-[#007D07] transition-colors">
              Testimoni
            </a>
            <a href="#faq" className="text-xs font-bold text-slate-600 hover:text-[#007D07] transition-colors">
              FAQ
            </a>
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-xs font-bold text-white bg-[#007D07] hover:bg-[#006A06] px-4 py-2.5 rounded-xl shadow-brand transition-all hover:scale-105"
                  title="Buka Dashboard Siswa"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Ujian ({displayName})</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-60"
                  title="Keluar dari akun"
                >
                  <LogOut className="w-4 h-4" />
                  {signingOut ? "..." : "Keluar"}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-[#007D07] border border-[#007D07] px-4 py-2 rounded-lg hover:bg-[#E8F5E9] transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-white bg-[#007D07] px-4 py-2 rounded-lg hover:bg-[#006A06] transition-colors shadow-brand hover:-translate-y-0.5 transition-transform"
                >
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-neutral-600 hover:text-[#007D07] hover:bg-[#E8F5E9] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pb-4 pt-2 space-y-2 animate-fade-in">
          <a href="#how-it-works" className="block py-2 text-sm font-semibold text-neutral-600 hover:text-[#007D07]" onClick={() => setOpen(false)}>Alur Ujian</a>
          <a href="#features" className="block py-2 text-sm font-semibold text-neutral-600 hover:text-[#007D07]" onClick={() => setOpen(false)}>Fitur</a>
          <a href="#testimonials" className="block py-2 text-sm font-semibold text-neutral-600 hover:text-[#007D07]" onClick={() => setOpen(false)}>Testimoni</a>
          <a href="#faq" className="block py-2 text-sm font-semibold text-neutral-600 hover:text-[#007D07]" onClick={() => setOpen(false)}>FAQ</a>
          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="w-full text-center text-xs font-bold text-white bg-[#007D07] px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-brand"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard Ujian ({displayName})
                </Link>
                <button
                  onClick={() => { setOpen(false); handleSignOut(); }}
                  disabled={signingOut}
                  className="w-full text-center text-sm font-semibold text-red-600 border border-red-200 px-4 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <LogOut className="w-4 h-4" />
                  {signingOut ? "Keluar..." : "Keluar"}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="w-full text-center text-sm font-semibold text-[#007D07] border border-[#007D07] px-4 py-2 rounded-lg" onClick={() => setOpen(false)}>Masuk</Link>
                <Link href="/auth/login" className="w-full text-center text-sm font-semibold text-white bg-[#007D07] px-4 py-2 rounded-lg" onClick={() => setOpen(false)}>Daftar Sekarang</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
