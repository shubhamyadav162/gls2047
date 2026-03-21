import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Quote } from "lucide-react";

const leaders = [
  { name: "Narendra Modi", role: "Prime Minister of India" },
  { name: "Manmohan Singh", role: "Former Prime Minister" },
  { name: "APJ Abdul Kalam", role: "Former President of India" },
  { name: "Bill Clinton", role: "Former President, USA" },
  { name: "Bill Gates", role: "Gates Foundation" },
  { name: "Pratibha Patil", role: "Former President of India" },
  { name: "N R Narayana Murthy", role: "Founder, Infosys" },
  { name: "Arvind Krishna", role: "CEO, IBM" },
  { name: "Nandan Nilekani", role: "Co-Founder, Infosys" },
  { name: "Amartya Sen", role: "Nobel Laureate" },
  { name: "Nitin Gadkari", role: "Union Minister" },
  { name: "A S Kiran Kumar", role: "Former Chairman, ISRO" },
];

export default function LegacySection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="legacy" className="section-padding section-dark" ref={ref}>
      <div className="container-gls">
        <div className={`text-center mb-16 fade-up ${isVisible ? "visible" : ""}`}>
          <p className="label-upper text-gold-muted mb-4">Our Heritage</p>
          <h2 className="heading-section text-ivory">A Legacy That Commands Respect</h2>
          <div className="gold-divider mt-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {leaders.map((leader, i) => (
            <div
              key={leader.name}
              className={`rounded-xl p-5 md:p-6 border border-ivory/8 transition-all duration-500 hover:-translate-y-1 fade-up stagger-${i + 1} ${isVisible ? "visible" : ""}`}
              style={{ background: "hsl(210 50% 16%)" }}
            >
              <div className="w-11 h-11 rounded-xl bg-ivory/5 flex items-center justify-center mb-4">
                <Quote className="text-gold-muted" size={18} strokeWidth={1.5} />
              </div>
              <h3 className="font-sora font-semibold text-ivory text-sm md:text-base mb-1">{leader.name}</h3>
              <p className="text-ivory/50 text-xs">{leader.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
