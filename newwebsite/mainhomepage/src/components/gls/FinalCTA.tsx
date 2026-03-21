import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TICKETS_URL = "/exhibition/";

export default function FinalCTA() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="section-dark py-24 md:py-32 relative overflow-hidden">
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "radial-gradient(circle, hsl(38 45% 60%) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className={`container-gls text-center px-4 md:px-0 relative fade-up ${isVisible ? "visible" : ""}`}>
        <p className="label-upper text-gold-muted mb-4 md:mb-6 text-[10px] md:text-sm">Final Call</p>
        <h2 className="heading-display text-ivory mb-6 max-w-4xl mx-auto leading-tight">
          Your Presence Here Is Not Incidental.{" "}
          <span className="text-saffron">It Is Essential.</span>
        </h2>
        <div className="gold-divider" />
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
          <a href={TICKETS_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-base md:text-lg !px-8 md:!px-10 !py-4 md:!py-5 w-full sm:w-auto shadow-xl">
            Book Your Pass
          </a>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-outline-light text-base md:text-lg !px-8 md:!px-10 !py-4 md:!py-5 w-full sm:w-auto"
          >
            Partner With Us
          </button>
        </div>
      </div>
    </section>
  );
}
