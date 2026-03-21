import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import pillarTech from "@/assets/pillar-technology.jpg";
import pillarInvest from "@/assets/pillar-investments.jpg";
import pillarGov from "@/assets/pillar-governance.jpg";
import pillarDip from "@/assets/pillar-diplomacy.jpg";
import { Cpu, TrendingUp, Landmark, Globe } from "lucide-react";

const pillars = [
  {
    title: "Technology",
    subtitle: "Building India's Capability Stack",
    image: pillarTech,
    icon: Cpu,
    text: "From AI and semiconductor design to space engineering and quantum computing — this pillar convenes the builders of India's technological sovereignty. IIT alumni and frontier technologists define the R&D agenda for the next two decades of digital infrastructure.",
  },
  {
    title: "Investments",
    subtitle: "Where Capital Meets Consequence",
    image: pillarInvest,
    icon: TrendingUp,
    text: "Venture capital, angel investing, institutional capital, and founder-investor networks converge. GLS Vision 2047 is where the next generation of unicorns, growth companies, and consequential ideas find the capital they need to scale.",
  },
  {
    title: "Governance",
    subtitle: "India's Competitive Advantage",
    image: pillarGov,
    icon: Landmark,
    text: "Public digital infrastructure, UPI-scale transformation, bureaucracy reform, and institutional execution. This pillar frames governance not as regulation but as India's most powerful national infrastructure for growth.",
  },
  {
    title: "Diplomacy",
    subtitle: "Shaping Global Opportunity",
    image: pillarDip,
    icon: Globe,
    text: "FTAs, trade architecture, bilateral partnerships, and strategic trust. India's rising influence demands a diplomatic framework that shapes opportunity, attracts foreign investment, and positions the nation at the centre of global ambition.",
  },
];

export default function SummitPillars() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="pillars" className="section-padding section-dark" ref={ref}>
      <div className="container-gls">
        <div className={`text-center mb-16 fade-up ${isVisible ? "visible" : ""}`}>
          <p className="label-upper text-gold-muted mb-4">The Framework</p>
          <h2 className="heading-section text-ivory">
            Four Pillars. One National Purpose.
          </h2>
          <div className="gold-divider mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`rounded-xl overflow-hidden border border-ivory/10 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl fade-up stagger-${i + 1} ${isVisible ? "visible" : ""}`}
                style={{ background: "hsl(210 50% 18%)" }}
              >
                <div className="h-40 md:h-48 overflow-hidden relative">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute bottom-4 left-6 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-navy/80 backdrop-blur-sm flex items-center justify-center border border-ivory/10">
                    <Icon className="text-saffron w-5 h-5 md:w-6 md:h-6" strokeWidth={1.6} />
                  </div>
                </div>
                <div className="p-5 md:p-8">
                  <h3 className="text-saffron font-sora font-bold text-xl md:text-2xl mb-1">{p.title}</h3>
                  <p className="text-gold-muted text-xs md:text-sm mb-4">{p.subtitle}</p>
                  <p className="text-ivory/70 leading-relaxed text-xs md:text-sm">{p.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
