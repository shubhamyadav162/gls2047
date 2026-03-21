import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { MapPin, Building, Phone, Mail, Users, Handshake } from "lucide-react";

export default function ContactSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="contact" className="section-padding section-ivory" ref={ref}>
      <div className="container-gls">
        <div className={`text-center mb-16 fade-up ${isVisible ? "visible" : ""}`}>
          <p className="label-upper text-saffron mb-4">Get in Touch</p>
          <h2 className="heading-section text-navy">Venue & Contact</h2>
          <div className="gold-divider mt-6" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Venue */}
          <div className={`card-premium fade-up stagger-1 ${isVisible ? "visible" : ""}`}>
            <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center mb-5">
              <MapPin className="text-saffron" size={24} strokeWidth={1.6} />
            </div>
            <h3 className="heading-card text-navy mb-3">Venue</h3>
            <p className="text-slate-text leading-relaxed">
              Yashobhoomi Convention Centre<br />
              New Delhi, India
            </p>
          </div>

          {/* Office Addresses */}
          <div className={`card-premium fade-up stagger-2 ${isVisible ? "visible" : ""}`}>
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5">
              <Building className="text-gold" size={24} strokeWidth={1.6} />
            </div>
            <h3 className="heading-card text-navy mb-3">Office Addresses</h3>
            <p className="text-slate-text leading-relaxed text-sm mb-4">
              A-83, Ground Floor, Pocket-D, Okhla Phase-II<br />
              New Delhi-110020, India
            </p>
            <p className="text-slate-text leading-relaxed text-sm">
              112, Nalanda Apartments, IIT Delhi, Hauz Khas<br />
              New Delhi - 110016, India
            </p>
          </div>

          {/* Contact Info */}
          <div className={`card-premium fade-up stagger-3 ${isVisible ? "visible" : ""}`}>
            <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center mb-5">
              <Phone className="text-navy" size={24} strokeWidth={1.6} />
            </div>
            <h3 className="heading-card text-navy mb-3">Contact</h3>
            <p className="text-slate-text leading-relaxed text-sm mb-2 flex items-center gap-2">
              <Mail size={14} className="text-saffron shrink-0" />
              <a href="mailto:secretariat@glsvision2047.com" className="text-saffron hover:underline">
                secretariat@glsvision2047.com
              </a>
            </p>
            <p className="text-slate-text leading-relaxed text-sm mb-4 flex items-center gap-2">
              <Phone size={14} className="text-saffron shrink-0" />
              <a href="tel:+917291907708" className="text-saffron hover:underline">+91 7291907708</a>
            </p>
            <div className="border-t border-border pt-4 mt-4">
              <p className="label-upper text-charcoal text-[10px] mb-2 flex items-center gap-1.5">
                <Users size={12} className="text-slate-text" /> Organised by
              </p>
              <p className="text-sm text-slate-text">NextGen Ventures • MOLOG</p>
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <p className="label-upper text-charcoal text-[10px] mb-2 flex items-center gap-1.5">
                <Handshake size={12} className="text-slate-text" /> In Collaboration With
              </p>
              <p className="text-xs text-slate-text leading-relaxed">
                Ministry of Skill Development & Entrepreneurship • Ministry of Education • Ministry of Tourism • Ministry of Social Justice • Ministry of Coal
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
