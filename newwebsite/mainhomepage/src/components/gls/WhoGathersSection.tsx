import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Cpu, TrendingUp, Landmark, Globe, Rocket, BookOpen, Newspaper, Leaf, GraduationCap, Briefcase } from "lucide-react";

const categories = [
  { title: "IIT Alumni", desc: "The engineers, founders, and technologists who built India's modern digital and infrastructure backbone.", icon: Cpu },
  { title: "IIM Alumni", desc: "The business minds, corporate leaders, and financial strategists shaping institutions and markets.", icon: TrendingUp },
  { title: "IAS & IPS Officers", desc: "The architects of governance who translate policy into execution across the nation.", icon: Landmark },
  { title: "Global CEOs", desc: "The business leaders connecting India to global markets and driving economic scale.", icon: Briefcase },
  { title: "Investors & VCs", desc: "Capital allocators backing the next generation of India's most consequential companies.", icon: TrendingUp },
  { title: "Diplomats & Envoys", desc: "The voices shaping bilateral relationships and India's standing in the world.", icon: Globe },
  { title: "Entrepreneurs", desc: "Founders building the next wave of innovation across deeptech, fintech, and beyond.", icon: Rocket },
  { title: "Academicians", desc: "Researchers, professors, and thought leaders shaping India's leadership pipelines.", icon: GraduationCap },
  { title: "Media & Think Tanks", desc: "The narrators and analysts shaping public discourse and strategic conversation.", icon: Newspaper },
  { title: "Sustainability Leaders", desc: "ESG, climate, and clean-energy leaders driving the transition to net-zero India.", icon: Leaf },
];

export default function WhoGathersSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="who-gathers" className="section-padding section-warm" ref={ref}>
      <div className="container-gls">
        <div className={`text-center mb-16 fade-up ${isVisible ? "visible" : ""}`}>
          <p className="label-upper text-saffron mb-4">The Ecosystem</p>
          <h2 className="heading-section text-navy">Who Gathers Here</h2>
          <div className="gold-divider mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.title}
                className={`card-premium text-center fade-up stagger-${i + 1} ${isVisible ? "visible" : ""}`}
              >
                <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-saffron" size={22} strokeWidth={1.8} />
                </div>
                <h3 className="font-sora font-semibold text-navy text-sm mb-2">{cat.title}</h3>
                <p className="text-xs text-slate-text leading-relaxed">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
