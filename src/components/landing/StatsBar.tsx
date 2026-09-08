"use client";
import { useEffect, useRef, useState } from "react";
import { Users, Trophy, Star, Clock } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: string;
  numericEnd: number | null;
  suffix: string;
  label: string;
  iconColor: string;
}

const stats: StatItem[] = [
  { icon: Users, value: "5,000+", numericEnd: 5000, suffix: "+", label: "Active Students", iconColor: "text-[#4CAF50]" },
  { icon: Trophy, value: "92%", numericEnd: 92, suffix: "%", label: "Pass Rate", iconColor: "text-amber-400" },
  { icon: Star, value: "550+", numericEnd: 550, suffix: "+", label: "Avg. ITP Score", iconColor: "text-[#4CAF50]" },
  { icon: Clock, value: "3 Formats", numericEnd: null, suffix: "", label: "Test Types", iconColor: "text-blue-400" },
];

function AnimatedCounter({ end, suffix, duration = 1800 }: { end: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count >= 1000 ? `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k` : count}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="bg-neutral-900 py-12 relative overflow-hidden">
      {/* Subtle green glow decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#007D07]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#007D07]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, numericEnd, suffix, label, iconColor }) => (
            <div key={label} className="flex flex-col items-center text-center gap-3 group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#007D07]/20 group-hover:border-[#007D07]/30 transition-all duration-300">
                <Icon className={`w-6 h-6 ${iconColor} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="text-3xl font-heading font-900 text-white tracking-tight">
                {numericEnd !== null ? (
                  <AnimatedCounter end={numericEnd} suffix={suffix} />
                ) : (
                  value
                )}
              </div>
              <div className="text-sm text-neutral-400 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
