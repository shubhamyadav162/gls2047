import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import bookBg from "@/assets/book-now-bg.jpg";

const TICKETS_URL = "/exhibition/";

export default function BookNowSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <img src={bookBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/90" />
      </div>

      {/* Geometric overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "linear-gradient(45deg, transparent 40%, hsl(38 45% 60%) 40%, hsl(38 45% 60%) 41%, transparent 41%)",
        backgroundSize: "60px 60px",
      }} />

      <div className={`relative container-gls text-center px-4 md:px-0 fade-up ${isVisible ? "visible" : ""}`}>
        <p className="label-upper text-gold-muted mb-4 md:mb-6 text-[10px] md:text-sm">Don't Miss This</p>
        <h2 className="heading-section text-ivory mb-6 max-w-3xl mx-auto">
          Secure Your Place at <span className="text-saffron">GLS Vision 2047</span>
        </h2>
        <div className="gold-divider" />
        <p className="text-base md:text-lg text-ivory/70 mt-6 mb-10 max-w-xl mx-auto leading-relaxed">
          This is not just an event. It is a national platform where the future is shaped. Reserve your seat among India's most consequential gathering.
        </p>
        <a
          href={TICKETS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-base md:text-lg !px-8 md:!px-12 !py-4 md:!py-5 w-full sm:w-auto"
        >
          Book Your Pass Now
        </a>
      </div>
    </section>
  );
}
