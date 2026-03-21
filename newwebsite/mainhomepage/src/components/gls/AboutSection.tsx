import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Gem, Target, Flag } from "lucide-react";

const cards = [
  {
    title: "A Room Unlike Any Other",
    text: "Where IIT engineers sit alongside diplomats, where founders meet policymakers, and where capital finds purpose. A curated ecosystem of India's most influential minds.",
    icon: Gem,
  },
  {
    title: "Outcomes, Not Optics",
    text: "This is not a conference of panels and pleasantries. It is a structured platform for deals, partnerships, policy dialogue, and strategic collaboration.",
    icon: Target,
  },
  {
    title: "A National Moment",
    text: "Some gatherings reflect the times. This one shapes them. GLS Vision 2047 is where India's next chapter is being written — together.",
    icon: Flag,
  },
];

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="section-padding section-ivory" ref={ref}>
      <div className="container-gls">
        <div className={`max-w-3xl mb-12 md:mb-16 mx-auto text-center md:text-left md:mx-0 fade-up ${isVisible ? "visible" : ""}`}>
          <p className="label-upper text-saffron mb-4">About the Summit</p>
          <h2 className="heading-section text-navy mb-6">
            A Platform Built for India's Next Chapter
          </h2>
          <div className="gold-divider mx-auto md:mx-0" />
          <p className="body-large text-slate-text mt-8">
            GLS Vision 2047 is not a conference. It is a curated national convening where the country's most
            influential minds come together to shape outcomes, not conversations. It brings together IIT alumni,
            IIM alumni, IAS and IPS officers, diplomats, investors, entrepreneurs, CXOs, policymakers,
            academicians, media leaders, think tanks, and sustainability champions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`card-premium fade-up stagger-${i + 1} ${isVisible ? "visible" : ""}`}
              >
                <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center mb-5">
                  <Icon className="text-saffron" size={24} strokeWidth={1.6} />
                </div>
                <h3 className="heading-card text-navy mb-3">{card.title}</h3>
                <p className="text-slate-text leading-relaxed">{card.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
