import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

export default async function LandingPage() {
  // Check auth server-side — kalau sudah login, langsung redirect ke dashboard
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      redirect("/dashboard");
    }
  } catch {
    // Jika error (misal env belum diset), tetap tampilkan landing page
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  );
}
