import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";

const day1 = [
  { time: "09:00", title: "Registration & Welcome High Tea" },
  { time: "10:00", title: "Inaugural Ceremony — Union Minister, State CM & Alumni Leadership" },
  { time: "10:30", title: "Opening Keynote — Senior Industry Leader" },
  { time: "11:30", title: "Parallel: Global Investors Meet | Vision 2047: $50 Trillion India" },
  { time: "12:30", title: "Parallel: Policy & Governance | IIT & IAS Officers in Nation Building" },
  { time: "13:30", title: "Power Lunch & Structured Networking" },
  { time: "15:00", title: "Parallel: Global Trade & Diplomacy | Defence & Geo-Politics" },
  { time: "17:00", title: "Cultural Show & Musical Evening" },
  { time: "19:30", title: "India 2047 Awards Ceremony & Gala Networking Dinner" },
];

const day2 = [
  { time: "09:00", title: "Registration & Networking High Tea" },
  { time: "10:00", title: "Sarasvati Vandana & Dignitaries' Welcome Address" },
  { time: "10:30", title: "Keynote: India's Next Entrepreneurial Frontier" },
  { time: "11:30", title: "Sessions: Unicorns & Startups | VC & Funding India's Future" },
  { time: "12:30", title: "Sessions: Clean Energy & Climate Action | Digital India & AI" },
  { time: "13:30", title: "Lunch & Startup Showcase Walkthrough" },
  { time: "15:00", title: "Felicitation Ceremony — Distinguished Leaders" },
  { time: "16:00", title: "GLS Awards — Indian Leaders 2047" },
  { time: "17:00", title: "Closing Ceremony by Eminent Personality" },
];

export default function AgendaSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  const agenda = activeDay === 1 ? day1 : day2;
  const focus = activeDay === 1
    ? "Investors | Leaders | Governance | Geo-Politics"
    : "Entrepreneurship | Technology | Innovation | Sustainability";

  return (
    <section id="agenda" className="section-padding section-ivory" ref={ref}>
      <div className="container-gls">
        <div className={`text-center mb-12 fade-up ${isVisible ? "visible" : ""}`}>
          <p className="label-upper text-saffron mb-4">The Programme</p>
          <h2 className="heading-section text-navy">Two Days That Matter</h2>
          <div className="gold-divider mt-6" />
        </div>

        {/* Day Toggle */}
        <div className={`flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-10 fade-up stagger-1 ${isVisible ? "visible" : ""}`}>
          <button
            onClick={() => setActiveDay(1)}
            className={`px-6 py-3 rounded-lg font-sora font-semibold text-sm transition-all duration-300 w-full sm:w-auto ${
              activeDay === 1 ? "bg-navy text-ivory shadow-lg scale-105" : "bg-muted text-charcoal hover:bg-muted/80"
            }`}
          >
            Day 1 — 18th July
          </button>
          <button
            onClick={() => setActiveDay(2)}
            className={`px-6 py-3 rounded-lg font-sora font-semibold text-sm transition-all duration-300 w-full sm:w-auto ${
              activeDay === 2 ? "bg-navy text-ivory shadow-lg scale-105" : "bg-muted text-charcoal hover:bg-muted/80"
            }`}
          >
            Day 2 — 19th July
          </button>
        </div>

        {/* Focus */}
        <p className={`text-center label-upper text-slate-text text-[10px] md:text-sm mb-8 px-4 fade-up stagger-2 ${isVisible ? "visible" : ""}`}>
          {focus}
        </p>

        {/* Timeline */}
        <div className={`max-w-3xl mx-auto px-4 md:px-0 fade-up stagger-3 ${isVisible ? "visible" : ""}`}>
          {agenda.map((item, i) => (
            <div
              key={`${activeDay}-${i}`}
              className="flex items-start gap-4 md:gap-10 py-5 border-b border-border last:border-0 group"
            >
              <div className="font-sora font-bold text-saffron text-base md:text-lg w-14 md:w-16 shrink-0 pt-0.5">
                {item.time}
              </div>
              <div className="text-charcoal text-sm md:text-base font-medium group-hover:text-navy transition-colors leading-relaxed">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
