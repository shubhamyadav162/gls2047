import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

const TICKETS_URL = "/exhibition/";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Who Gathers", href: "#who-gathers" },
  { label: "Agenda", href: "#agenda" },
  { label: "Zones", href: "#zones" },

  { label: "Awards", href: "#awards" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "py-3 bg-ivory/90 backdrop-blur-xl shadow-sm"
          : "py-4 md:py-5 bg-transparent"
      }`}
    >
      <div className="container-gls px-4 md:px-6 flex items-center justify-between h-16 md:h-20">
        <button onClick={() => handleNav("#home")} className="relative h-10 md:h-12 w-auto flex items-center">
          <img src={logo} alt="GLS Vision 2047" className="h-[36px] md:h-full w-auto object-contain transition-all" />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-sm font-medium text-charcoal/70 hover:text-saffron transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-2.5 !px-6 !text-sm"
          >
            Book Now
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 bg-navy/5 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-navy transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-navy transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-navy transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={`lg:hidden fixed inset-0 top-[64px] bg-ivory/98 backdrop-blur-xl border-t border-border z-50 overflow-y-auto animate-fade-in`}>
          <nav className="container-gls py-10 px-6 flex flex-col gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-left text-2xl font-bold font-sora text-charcoal/90 hover:text-saffron transition-colors"
              >
                {link.label}
              </button>
            ))}
            <a
              href={TICKETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base py-4 px-8 mt-4 w-full shadow-lg"
            >
              Book Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
