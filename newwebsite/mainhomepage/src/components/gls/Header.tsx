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
    const onScroll = () => setScrolled(window.scrollY > 50);
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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.4s ease",
        background: scrolled
          ? "rgba(0,45,98,0.97)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        boxShadow: scrolled ? "0 2px 30px rgba(0,45,98,0.25)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 76,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNav("#home")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: "50%",
              padding: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={logo} alt="GLS Vision 2047" style={{ height: 42, width: "auto", objectFit: "contain" }} />
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="gls-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.85)", fontSize: 13,
                fontWeight: 600, letterSpacing: "0.02em",
                transition: "color 0.2s", padding: "4px 0", whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#D4AF37")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.85)")}
            >
              {link.label}
            </button>
          ))}
          <a
            href={TICKETS_URL}
            style={{
              background: "#D4AF37", color: "#002D62", fontWeight: 800,
              fontSize: 13, padding: "10px 24px", borderRadius: 30,
              textDecoration: "none", letterSpacing: "0.03em",
              boxShadow: "0 4px 16px rgba(212,175,55,0.4)",
              transition: "all 0.2s", whiteSpace: "nowrap", display: "inline-block",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#c3a033";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#D4AF37";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            Book Now
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="gls-hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{
            display: "none", flexDirection: "column", gap: 5,
            padding: 10, background: "rgba(255,255,255,0.15)", borderRadius: 10,
            border: "none", cursor: "pointer",
          }}
        >
          <span style={{ display: "block", width: 24, height: 2.5, background: "#fff", borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: 24, height: 2.5, background: "#fff", borderRadius: 2, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 24, height: 2.5, background: "#fff", borderRadius: 2, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed", top: 76, left: 0, right: 0, bottom: 0,
            background: "rgba(0,45,98,0.98)", backdropFilter: "blur(24px)",
            zIndex: 49, display: "flex", flexDirection: "column",
            padding: "32px 24px", overflowY: "auto",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#fff", fontSize: 26, fontWeight: 800,
                textAlign: "left", padding: "16px 0",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                letterSpacing: "-0.01em",
              }}
            >
              {link.label}
            </button>
          ))}
          <a
            href={TICKETS_URL}
            onClick={() => setMobileOpen(false)}
            style={{
              marginTop: 32, background: "#D4AF37", color: "#002D62",
              fontWeight: 900, fontSize: 18, padding: "18px 24px",
              borderRadius: 16, textDecoration: "none", textAlign: "center",
              letterSpacing: "0.02em", boxShadow: "0 8px 30px rgba(212,175,55,0.4)",
              display: "block",
            }}
          >
            Book Now
          </a>
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 1024px) {
          .gls-desktop-nav { display: flex !important; }
          .gls-hamburger { display: none !important; }
        }
        @media (max-width: 1023px) {
          .gls-desktop-nav { display: none !important; }
          .gls-hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
