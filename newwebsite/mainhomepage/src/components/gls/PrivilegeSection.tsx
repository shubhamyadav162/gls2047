import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Crown, Target, Sparkles } from "lucide-react";

const values = [
  {
    title: "A Room Unlike Any Other",
    text: "Where the distance between an idea and its execution is measured in handshakes, not years.",
    icon: Crown,
  },
  {
    title: "Outcomes, Not Optics",
    text: "Every session, every meeting, every conversation is structured for tangible results — partnerships, capital, policy shifts.",
    icon: Target,
  },
  {
    title: "A National Moment",
    text: "When leaders, investors, policymakers, and entrepreneurs gather in one room, conversations become capital, policy, partnerships, and action.",
    icon: Sparkles,
  },
];

export default function PrivilegeSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-padding section-warm" ref={ref}>
      <div className="container-gls">
        <div className={`text-center mb-16 fade-up ${isVisible ? "visible" : ""}`}>
          <p className="label-upper text-saffron mb-4">Why This Matters</p>
          <h2 className="heading-section text-navy mb-4">The Privilege of Being Here</h2>
          <div className="gold-divider" />
          <p className="body-large text-slate-text mt-6 max-w-2xl mx-auto italic">
            "Some events are attended. This one is earned."
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className={`card-premium text-center fade-up stagger-${i + 1} ${isVisible ? "visible" : ""}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-saffron/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="text-saffron" size={26} strokeWidth={1.5} />
                </div>
                <h3 className="heading-card text-navy mb-3">{v.title}</h3>
                <p className="text-slate-text leading-relaxed">{v.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
