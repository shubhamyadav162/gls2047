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
      <div className="container-gls py-12 md:py-20 lg:py-24">
        <div className="grid md:grid-cols-3 gap-16 md:gap-8 text-center">
          {/* Brand */}
          <div className="flex flex-col items-center">
            <div className="h-20 w-auto mb-10 flex items-center group">
              <div className="bg-white/95 rounded-full p-3 shadow-2xl group-hover:scale-110 transition-all">
                <img src={logo} alt="GLS Vision 2047" className="h-[64px] w-auto object-contain" />
              </div>
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
            <h4 className="label-upper text-gold-muted mb-4 md:mb-6 text-[10px] md:text-xs">Event Details</h4>
            <div className="flex flex-col gap-3">
              <p className="text-ivory/60 text-sm">
                <a href="mailto:chair@glsvision2047.com" className="hover:text-saffron transition-colors">
                  chair@glsvision2047.com
                </a>
              </p>
              <p className="text-ivory/60 text-sm">
                <a href="tel:+919911155588" className="hover:text-saffron transition-colors">
                  +91 9911155588
                </a>
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                 <p className="text-saffron font-bold text-sm">
                   18–19 July 2026
                 </p>
                 <p className="text-ivory/80 text-xs leading-relaxed font-medium">
                   Yashobhoomi Convention Centre<br />
                   New Delhi, India
                 </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-ivory/10 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-ivory/30 text-[10px] md:text-xs text-center order-2 md:order-1">
            © 2026 Global Leadership Summit Vision 2047. All rights reserved.
          </p>
          <div className="flex items-center gap-3 order-1 md:order-2">
            <span className="text-ivory/30 text-[10px] md:text-xs">Organised by</span>
            <div className="h-8 w-auto flex items-center bg-white/95 rounded-lg px-2.5 py-1 shadow-sm">
              <img src={mologLogo} alt="MOLOG" className="h-full w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
