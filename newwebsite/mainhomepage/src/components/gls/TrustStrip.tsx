import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShieldCheck, MapPin, Compass, Network } from "lucide-react";

const items = [
  { label: "Powered by IIT Alumni", icon: ShieldCheck },
  { label: "Hosted in New Delhi", icon: MapPin },
  { label: "Leadership • Innovation • Governance • Diplomacy", icon: Compass },
  { label: "National-Scale Convening Platform", icon: Network },
];

export default function TrustStrip() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-warm border-y border-border">
      <div className="container-gls py-6 md:py-8">
        <div className={`flex flex-wrap justify-center items-center gap-5 md:gap-10 fade-up ${isVisible ? "visible" : ""}`}>
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-2.5">
                <Icon className="text-saffron" size={16} strokeWidth={1.8} />
                <span className="label-upper text-slate-text text-xs">{item.label}</span>
                {i < items.length - 1 && (
                  <span className="hidden md:block w-1 h-1 rounded-full bg-gold ml-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
