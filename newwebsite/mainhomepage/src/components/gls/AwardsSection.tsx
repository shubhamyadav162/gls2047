import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Trophy, Cpu, Landmark, Leaf, Heart, Rocket } from "lucide-react";

const awards = [
  { label: "Economy & Industry Excellence", icon: Trophy },
  { label: "Technology & Innovation Leadership", icon: Cpu },
  { label: "Governance & Public Service Impact", icon: Landmark },
  { label: "Sustainability & Climate Action", icon: Leaf },
  { label: "Social Impact & Global Outreach", icon: Heart },
  { label: "Startup & Entrepreneurship", icon: Rocket },
];

export default function AwardsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="awards" className="section-padding section-ivory" ref={ref}>
      <div className="container-gls">
        <div className={`text-center mb-16 fade-up ${isVisible ? "visible" : ""}`}>
          <p className="label-upper text-saffron mb-4">Recognition</p>
          <h2 className="heading-section text-navy">India 2047 Leadership Awards</h2>
          <div className="gold-divider mt-6" />
          <p className="body-large text-slate-text mt-6 max-w-2xl mx-auto">
            Honouring the builders of India's future — those who are shaping the next 25 years of national progress through excellence, innovation, and service.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {awards.map((award, i) => {
            const Icon = award.icon;
            return (
              <div
                key={award.label}
                className={`relative card-premium group fade-up stagger-${i + 1} ${isVisible ? "visible" : ""}`}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-saffron rounded-l-xl" />
                <div className="pl-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center shrink-0">
                    <Icon className="text-saffron" size={20} strokeWidth={1.8} />
                  </div>
                  <h3 className="font-sora font-semibold text-navy text-sm md:text-base">{award.label}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
