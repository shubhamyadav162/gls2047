import logo from "@/assets/logo.png";
import mologLogo from "@/assets/molog-logo.png";

const TICKETS_URL = "/exhibition/";

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Who Gathers", href: "#who-gathers" },
  { label: "Agenda", href: "#agenda" },
  { label: "Zones", href: "#zones" },

  { label: "Awards", href: "#awards" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-navy border-t border-ivory/10">
      <div className="container-gls py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="h-10 w-auto mb-6 flex items-center">
              <img src={logo} alt="GLS Vision 2047" className="h-[32px] md:h-full w-auto object-contain" />
            </div>
            <p className="text-ivory/50 text-sm leading-relaxed mb-6 max-w-xs">
              India's most consequential gathering of leaders, innovators & nation-builders.
            </p>
            <a
              href={TICKETS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !text-sm !py-2.5 !px-6 w-full sm:w-auto"
            >
              Book Now
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="label-upper text-gold-muted mb-4 md:mb-6 text-[10px] md:text-xs">Quick Links</h4>
            <nav className="flex flex-col gap-3 md:gap-4">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-ivory/60 hover:text-saffron text-sm transition-colors duration-300"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-upper text-gold-muted mb-4 md:mb-6 text-[10px] md:text-xs">Contact</h4>
            <div className="flex flex-col gap-3">
              <p className="text-ivory/60 text-sm">
                <a href="mailto:secretariat@glsvision2047.com" className="hover:text-saffron transition-colors">
                  secretariat@glsvision2047.com
                </a>
              </p>
              <p className="text-ivory/60 text-sm">
                <a href="tel:+917291907708" className="hover:text-saffron transition-colors">
                  +91 7291907708
                </a>
              </p>
              <p className="text-ivory/40 text-xs mt-2 leading-relaxed">
                Yashobhoomi Convention Centre, New Delhi
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-ivory/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-ivory/30 text-[10px] md:text-xs text-center md:text-left order-2 md:order-1">
            © 2026 Global Leadership Summit Vision 2047. All rights reserved.
          </p>
          <div className="flex items-center gap-3 order-1 md:order-2">
            <span className="text-ivory/30 text-[10px] md:text-xs">Organised by</span>
            <div className="h-6 w-auto flex items-center bg-white/10 rounded px-2 py-0.5">
              <img src={mologLogo} alt="MOLOG" className="h-full w-auto object-contain opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
