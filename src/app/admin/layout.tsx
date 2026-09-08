"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  BookOpen, LayoutDashboard, FileQuestion, Users,
  CalendarDays, LogOut, ChevronRight, Menu, X, Shield, Settings,
  Sparkles, ExternalLink, ShieldCheck, CheckCircle2
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard",           label: "Ringkasan",       desc: "Overview & Metrik",   icon: LayoutDashboard },
  { href: "/admin/dashboard/questions", label: "Bank Soal",      desc: "Kelola Soal Ujian",   icon: FileQuestion },
  { href: "/admin/dashboard/students",  label: "Data Siswa",     desc: "Hasil & Peserta",     icon: Users },
  { href: "/admin/dashboard/sessions",  label: "Sesi Ujian",     desc: "Jadwal & Kuota",      icon: CalendarDays },
  { href: "/admin/dashboard/admins",    label: "Kelola Admin",   desc: "Akses & Security",    icon: Shield },
  { href: "/admin/dashboard/settings",  label: "Pengaturan",     desc: "Jadwal Login & DB",   icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      if (pathname === "/admin/login") {
        setChecked(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });
      const { isAdmin } = await res.json();

      if (!isAdmin) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      setAdminEmail(session.user.email ?? "");
      setChecked(true);
    };
    checkAdmin();
  }, [router, pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono tracking-wider">Memverifikasi Hak Akses...</span>
        </div>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-slate-100/70 text-slate-900 font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col bg-slate-950 text-white border-r border-slate-800/80 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#007D07] flex items-center justify-center text-white shadow-lg shadow-emerald-950">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-white tracking-tight leading-tight">
                Kind English
              </h1>
              <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold tracking-widest uppercase mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Assessment Admin
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Menu Utama
          </div>
          {NAV_ITEMS.map(({ href, label, desc, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all group relative ${
                  isActive
                    ? "bg-[#007D07] text-white shadow-md shadow-emerald-950/60"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? "bg-white/15 text-white" : "bg-slate-900 text-slate-400 group-hover:text-emerald-400 group-hover:bg-slate-800"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="leading-tight">{label}</div>
                  <div className={`text-[10px] truncate ${isActive ? "text-emerald-100" : "text-slate-500"}`}>{desc}</div>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin Profile */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Administrator</span>
              <span className="text-xs text-slate-200 font-semibold truncate block">{adminEmail}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Siswa UI
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-950/40 text-red-400 hover:bg-red-900/40 hover:text-red-300 text-xs font-medium transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-base font-bold text-slate-900 leading-tight">Kind English Management System</h2>
              </div>
              <p className="text-xs text-slate-500">Panel Kontrol Ujian TOEFL ITP Resmi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sistem Aktif & Terlindungi
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
