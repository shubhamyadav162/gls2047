import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { DoorOpen, Lightbulb, Building2, LayoutGrid } from "lucide-react";

const zones = [
  {
    title: "The Investors Lounge",
    desc: "Invitation-only. Where high-potential founders meet marquee investors for one-on-one meetings, closed-door insight sessions, and deal-making conversations that move capital.",
    icon: DoorOpen,
    accent: "bg-saffron",
    iconBg: "bg-saffron/10",
  },
  {
    title: "The Startups Pavilion",
    desc: "A launchpad for founders, developers, and innovators. Hackathons, demos, prototypes, and institutional visibility — where bold ideas meet the decision-makers who can scale them.",
    icon: Lightbulb,
    accent: "bg-gold",
    iconBg: "bg-gold/10",
  },
  {
    title: "The SME Growth Pavilion",
    desc: "Focused on growth companies, pre-IPO strategy, capital raising, and pathways to listing. Designed for high-growth SMEs, merchant bankers, HNIs, and family offices.",
    icon: Building2,
    accent: "bg-navy",
    iconBg: "bg-navy/10",
  },
  {
    title: "The Exhibition — 15,000 SQM",
    desc: "800+ companies. 10 industries. 5,000+ decision-makers. Deeptech, EVs, fintech, clean energy, healthcare, defence, edtech, manufacturing, infrastructure, and logistics — a place to buy, invest, partner, and influence.",
    icon: LayoutGrid,
    accent: "bg-saffron",
    iconBg: "bg-saffron/10",
  },
];

export default function BeyondTheStage() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="zones" className="section-padding section-warm" ref={ref}>
      <div className="container-gls">
        <div className={`text-center mb-16 fade-up ${isVisible ? "visible" : ""}`}>
          <p className="label-upper text-saffron mb-4">Experience Zones</p>
          <h2 className="heading-section text-navy">Beyond the Stage</h2>
          <div className="gold-divider mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {zones.map((zone, i) => {
            const Icon = zone.icon;
            return (
              <div
                key={zone.title}
                className={`card-premium relative overflow-hidden fade-up stagger-${i + 1} ${isVisible ? "visible" : ""}`}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                  <div className={`w-14 h-14 rounded-xl ${zone.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className="text-saffron" size={26} strokeWidth={1.6} />
                  </div>
                  <div>
                    <div className={`w-10 h-1 ${zone.accent} rounded-full mb-4 mx-auto md:mx-0`} />
                    <h3 className="heading-card text-navy mb-3">{zone.title}</h3>
                    <p className="text-slate-text leading-relaxed text-sm">{zone.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
