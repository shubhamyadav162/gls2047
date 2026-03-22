import heroBg from "@/assets/hero-abstract.jpg";
import { Users, BarChart3, Award, Mic } from "lucide-react";

const TICKETS_URL = "/exhibition/";

const stats = [
  { value: "5,000+", label: "Leaders & Visionaries", icon: Users },
  { value: "200+", label: "Global Investors & VCs", icon: BarChart3 },
  { value: "500+", label: "CXOs & Senior Officials", icon: Award },
  { value: "100+", label: "Speakers & Policymakers", icon: Mic },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <style>{`
          @keyframes slow-zoom {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-hero-zoom {
            animation: slow-zoom 20s ease-in-out infinite;
          }
        `}</style>
        <img src={heroBg} alt="" className="w-full h-full object-cover animate-hero-zoom" />
        <div className="absolute inset-0 bg-navy/85" />
      </div>

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle, hsl(38 45% 60%) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />

      <div className="relative container-gls pt-24 pb-16 md:pt-40 md:pb-28 flex flex-col items-center">
        <div className="max-w-4xl text-center">
        <>
          <style>{`
            @keyframes date-glow {
              0%, 100% { text-shadow: 0 0 8px rgba(212,175,55,0.4), 0 0 20px rgba(212,175,55,0.15); opacity: 0.92; }
              50% { text-shadow: 0 0 16px rgba(212,175,55,0.9), 0 0 40px rgba(212,175,55,0.45), 0 0 60px rgba(212,175,55,0.2); opacity: 1; }
            }
            @keyframes date-shimmer {
              0% { background-position: -200% center; }
              100% { background-position: 200% center; }
            }
            .date-animate {
              animation: date-glow 2.5s ease-in-out infinite;
              background: linear-gradient(90deg, #D4AF37 20%, #fff8e1 40%, #D4AF37 60%, #f0c040 80%, #D4AF37 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              animation: date-shimmer 3s linear infinite, date-glow 2.5s ease-in-out infinite;
              font-weight: 700 !important;
              letter-spacing: 0.08em !important;
            }
          `}</style>
          <p className="label-upper mb-4 md:mb-6 animate-fade-in text-xs md:text-sm date-animate">
            18–19 July 2026 • Yashobhoomi Convention Centre • New Delhi, India
          </p>
        </>
          <h1 className="heading-display text-ivory mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Global Leadership Summit<br />
            <span className="text-saffron">Vision 2047</span>
          </h1>
          <p className="text-lg md:text-2xl text-ivory/80 font-light leading-relaxed mb-4 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            India's most consequential gathering of leaders, innovators & nation-builders
          </p>
          <p className="text-sm md:text-base text-ivory/60 leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            A national platform where leadership, capital, governance, and innovation converge to shape India's future.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <a href={TICKETS_URL} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto">
              Book Your Pass
            </a>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="btn-outline-light w-full sm:w-auto">
              Partner With Us
            </button>
            <button onClick={() => document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" })} className="btn-outline-light w-full sm:w-auto">
              View Agenda
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2 md:gap-4 p-4 rounded-xl bg-ivory/[0.03] border border-ivory/[0.05] md:bg-transparent md:border-none md:p-0">
                <div className="w-10 h-10 rounded-lg bg-ivory/5 flex items-center justify-center shrink-0">
                  <Icon className="text-saffron" size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-xl md:text-3xl font-bold font-sora text-saffron mb-0.5">{stat.value}</div>
                  <div className="text-[10px] md:text-xs text-ivory/60 leading-tight">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
