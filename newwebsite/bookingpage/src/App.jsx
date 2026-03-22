import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, CheckCircle, X, Building2, Rocket, Map, CreditCard, Zap, Calendar, MapPin, Users, ArrowRight, BookOpen, Shield,
  Cpu, Factory, Smartphone, Building, Truck, Heart, Banknote, ShoppingBag, Sun, Globe, Landmark, ChevronRight, TrendingUp
} from 'lucide-react';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [headerMobileOpen, setHeaderMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  // Single page form state
  const [clientType, setClientType] = useState('corporate'); // 'corporate', 'startup', 'government', 'academia'
  const [selectedSize, setSelectedSize] = useState(9); // Default 9 sqm for corporate
  const [formData, setFormData] = useState({ 
    name: '', 
    company: '', 
    designation: '',
    industry: '',
    email: '', 
    whatsapp: '',
    city_country: '',
    website: '',
    description: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.whatsapp) {
      alert("Please fill in all required fields (Name, Email, WhatsApp)");
      return;
    }

    setIsProcessing(true);
    try {
      const vals = calculateVals();
      const response = await fetch('/exhibition_api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clientType,
          selectedSize,
          payable: vals.payable,
          currency: vals.currency
        })
      });

      const result = await response.json();
      
      if (result.success && result.payu_data) {
        // Create hidden form and submit to PayU
        const pData = result.payu_data;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = pData.action;

        const fields = [
          'key', 'hash', 'txnid', 'amount', 'firstname', 'email', 
          'phone', 'productinfo', 'surl', 'furl'
        ];

        fields.forEach(field => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = field;
          input.value = pData[field];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        alert("Booking Error: " + (result.message || "Unable to initialize payment"));
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const areaOptionsByClient = {
    corporate: [
      { label: '3x3', subLabel: '(9 sqm)', sqm: 9 },
      { label: '3x4', subLabel: '(12 sqm)', sqm: 12 },
      { label: '3x6', subLabel: '(18 sqm)', sqm: 18 },
      { label: '6x6', subLabel: '(36 sqm)', sqm: 36 },
      { label: '100 sqm', subLabel: 'Large Pavilion', sqm: 100 },
      { label: '200 sqm', subLabel: 'Large Pavilion', sqm: 200 },
      { label: '300 sqm', subLabel: 'Large Pavilion', sqm: 300 },
      { label: '400 sqm', subLabel: 'Large Pavilion', sqm: 400 },
      { label: '500 sqm', subLabel: 'Large Pavilion', sqm: 500 }
    ],
    startup: [
      { label: 'Startup POD', subLabel: '2x2 (4 sqm)', sqm: 4 },
      { label: 'Startup POD+', subLabel: '3x2 (6 sqm)', sqm: 6 },
      { label: 'Startup POD PRO', subLabel: '3x3 (9 sqm)', sqm: 9 }
    ],
    psu: [
      { label: '100 sqm', subLabel: 'Government Scale', sqm: 100 },
      { label: '200 sqm', subLabel: 'Government Scale', sqm: 200 },
      { label: '300 sqm', subLabel: 'Government Scale', sqm: 300 },
      { label: '400 sqm', subLabel: 'Government Scale', sqm: 400 },
      { label: '500 sqm', subLabel: 'Government Scale', sqm: 500 }
    ],
    government: [
      { label: '100 sqm', subLabel: 'Government Scale', sqm: 100 },
      { label: '200 sqm', subLabel: 'Government Scale', sqm: 200 },
      { label: '300 sqm', subLabel: 'Government Scale', sqm: 300 },
      { label: '400 sqm', subLabel: 'Government Scale', sqm: 400 },
      { label: '500 sqm', subLabel: 'Government Scale', sqm: 500 }
    ],
    academia: [
      { label: '3x4', subLabel: '(12 sqm)', sqm: 12 },
      { label: '6x6', subLabel: '(36 sqm)', sqm: 36 },
      { label: '100 sqm', subLabel: 'Large Pavilion', sqm: 100 },
      { label: '200 sqm', subLabel: 'Large Pavilion', sqm: 200 },
      { label: '300 sqm', subLabel: 'Large Pavilion', sqm: 300 },
      { label: '400 sqm', subLabel: 'Large Pavilion', sqm: 400 },
      { label: '500 sqm', subLabel: 'Large Pavilion', sqm: 500 }
    ],
    country: [
      { label: '50 sqm', subLabel: 'Diplomatic Pavilion', sqm: 50 },
      { label: '100 sqm', subLabel: 'Diplomatic Pavilion', sqm: 100 },
      { label: '200 sqm', subLabel: 'Diplomatic Pavilion', sqm: 200 },
      { label: '300 sqm', subLabel: 'Diplomatic Pavilion', sqm: 300 },
      { label: '400 sqm', subLabel: 'Diplomatic Pavilion', sqm: 400 },
      { label: '500 sqm', subLabel: 'Diplomatic Pavilion', sqm: 500 }
    ]
  };

  const defaultSizeByClient = {
    corporate: 9,
    startup: 9,
    psu: 100,
    government: 100,
    academia: 12,
    country: 50
  };

  const passMatrix = {
    corporate: {
      9: { vip: 2, delegate: 4, exhibitor: 3 },
      12: { vip: 2, delegate: 4, exhibitor: 3 },
      18: { vip: 3, delegate: 6, exhibitor: 4 },
      36: { vip: 4, delegate: 8, exhibitor: 6 },
      100: { vip: 6, delegate: 12, exhibitor: 12 },
      200: { vip: 10, delegate: 20, exhibitor: 20 },
      300: { vip: 14, delegate: 28, exhibitor: 28 },
      400: { vip: 18, delegate: 36, exhibitor: 36 },
      500: { vip: 22, delegate: 44, exhibitor: 44 }
    },
    psu: {
      100: { vip: 8, delegate: 16, exhibitor: 16 },
      200: { vip: 12, delegate: 24, exhibitor: 24 },
      300: { vip: 16, delegate: 32, exhibitor: 32 },
      400: { vip: 20, delegate: 40, exhibitor: 40 },
      500: { vip: 24, delegate: 48, exhibitor: 48 }
    },
    government: {
      100: { vip: 8, delegate: 16, exhibitor: 16 },
      200: { vip: 12, delegate: 24, exhibitor: 24 },
      300: { vip: 16, delegate: 32, exhibitor: 32 },
      400: { vip: 20, delegate: 40, exhibitor: 40 },
      500: { vip: 24, delegate: 48, exhibitor: 48 }
    },
    academia: {
      12: { vip: 1, delegate: 2, exhibitor: 2 },
      36: { vip: 2, delegate: 5, exhibitor: 4 },
      100: { vip: 4, delegate: 8, exhibitor: 8 },
      200: { vip: 8, delegate: 16, exhibitor: 16 },
      300: { vip: 12, delegate: 24, exhibitor: 24 },
      400: { vip: 16, delegate: 32, exhibitor: 32 },
      500: { vip: 20, delegate: 40, exhibitor: 40 }
    },
    startup: {
      4: { vip: 0, delegate: 2, exhibitor: 2 }, // POD (2x2)
      6: { vip: 1, delegate: 2, exhibitor: 2 }, // POD+ (3x2)
      9: { vip: 2, delegate: 2, exhibitor: 2 }  // POD PRO (3x3)
    },
    country: {
      50: { vip: 4, delegate: 8, exhibitor: 8 },
      100: { vip: 6, delegate: 12, exhibitor: 12 },
      200: { vip: 10, delegate: 20, exhibitor: 20 },
      300: { vip: 14, delegate: 28, exhibitor: 28 },
      400: { vip: 18, delegate: 36, exhibitor: 36 },
      500: { vip: 22, delegate: 44, exhibitor: 44 }
    }
  };

  const setClientAndSize = (type) => {
    setClientType(type);
    setSelectedSize(defaultSizeByClient[type] || 9);
  };

  const getPassAllocation = (type, sqm) => {
    const matrix = passMatrix[type];
    if (!matrix) return null;
    return matrix[sqm] || null;
  };

  const formatPassAllocation = (allocation) => {
    if (!allocation) return '';
    const parts = [];
    if (allocation.vip) parts.push(`${allocation.vip} VIP`);
    if (allocation.delegate) parts.push(`${allocation.delegate} Delegate`);
    if (allocation.exhibitor) parts.push(`${allocation.exhibitor} Exhibitor`);
    return parts.join(' + ');
  };

  const calculateVals = () => {
    let fixedPrice = 0;
    let pricePerSqm = 0;
    let currency = '₹';

    if (clientType === 'startup') {
      fixedPrice = 25000;
    } else if (clientType === 'corporate') {
      pricePerSqm = 20000;
    } else if (clientType === 'psu' || clientType === 'government') {
      pricePerSqm = 18000;
    } else if (clientType === 'academia') {
      pricePerSqm = 10000;
    } else if (clientType === 'country') {
      pricePerSqm = 200;
      currency = '$';
    }

    if (clientType === 'startup') {
      let total = 25000;
      let bookingToken = 10000;
      if (selectedSize === 6) {
        total = 50000;
        bookingToken = 20000;
      } else if (selectedSize === 9) {
        total = 100000;
        bookingToken = 30000;
      }
      const gst = 0; // The user said "₹XX,000 + GST" but also "Book Now amount (₹10k / ₹20k / ₹30k)". I'll follow the price logic.
      const payable = bookingToken;
      return {
        total,
        bookingToken,
        gst,
        payable,
        currency,
        isFull: false,
        gstIncluded: false, // Changed to false because user said "+ GST"
        bookingLabel: 'Booking Amount',
        tagLabel: 'Token',
        baseLabel: 'Total Price:',
        note: '+ GST applicable'
      };
    } else {
      const total = selectedSize * pricePerSqm;
      const bookingToken = total * 0.10; // 10% booking amount
      const gst = bookingToken * 0.18; // 18% GST on token
      const payable = bookingToken + gst;
      return {
        total,
        bookingToken,
        gst,
        payable,
        currency,
        isFull: false,
        gstIncluded: false,
        bookingLabel: 'Booking Amount (10%)',
        tagLabel: 'Token',
        baseLabel: 'Token Base:',
      };
    }
  };

  const benefits = {
    corporate: {
      desc: 'Showcase market-leading solutions and engage with 500+ global CXOs and top-tier IIT alumni.',
      features: ['2 VIP Passes (worth ₹35,000) included', '4 Delegate Passes (worth ₹30,000) included', 'Digital visibility on the official summit platform', 'Total Service Value: ₹2,45,000 for a 3x3 pod'],
      passes: 'Pass allocation scales with selected area',
      rate: '₹20,000 / sq.m'
    },
    startup: {
      desc: 'Exclusive Startup Hub designed for high-impact investor matchmaking and professional networking.',
      features: ['Book Your Startup Pod from ₹10,000', 'Limited Slots Available', 'POD PRO: Most Popular Choice', 'Complimentary VIP & Delegate passes'],
      passes: 'Passes included per plan type',
      rate: 'Starting ₹25,000 + GST'
    },
    psu: {
      desc: 'Demonstrate nation-building initiatives and large-scale infrastructure projects to a global audience.',
      features: ['Enhanced VIP & Delegate pass allocation', 'Strategic placement in Governance & Infrastructure Pavilion', 'Ministerial walkthroughs and official media coverage'],
      passes: 'Enhanced pass slabs for 100-500 sqm',
      rate: '₹18,000 / sq.m',
      minArea: 100
    },
    government: {
      desc: 'Showcase policy excellence and investment opportunities to global diplomats and industry leaders.',
      features: ['Premium branding across digital signage and EDMs', 'Opportunity to host focused investment roundtables', 'Inclusion in official summit press releases'],
      passes: 'Enhanced pass slabs for 100-500 sqm',
      rate: '₹18,000 / sq.m',
      minArea: 100
    },
    academia: {
      desc: 'Build strategic partnerships between research excellence and global industry leaders.',
      features: ['Integration into the Innovation & Talent Pavilion', 'Engagement with corporate HR and Global R&D heads', 'Special recognition in the summit directory'],
      passes: 'Passes scale by selected area slab',
      rate: '₹10,000 / sq.m'
    },
    country: {
      desc: 'Establish sovereign presence and facilitate cross-border trade and investment flows.',
      features: ['Exclusive International Pavilion branding', 'Facilitated meetings with Indian govt & industry heads', 'Special mention in Global Leadership report'],
      passes: 'Pass allocation scales with delegation area',
      rate: '$200 / sq.m'
    }
  };

  const vals = calculateVals();
  const selectedPassAllocation = getPassAllocation(clientType, selectedSize);
  const selectedPassText = formatPassAllocation(selectedPassAllocation);
  const closeModal = () => setIsBookingOpen(false);

  const handleBookSpace = (type) => {
    setClientAndSize(type);
    setIsBookingOpen(true);
  };

  const showcases = [
    { icon: <Cpu />, title: 'Technology & AI', desc: 'Next-gen compute and logic', img: 'assets/pavilions/tech_ai.jpg' },
    { icon: <Factory />, title: 'Smart Manufacturing', desc: 'Industry 4.0 and Automation', img: 'assets/pavilions/smart_manufacturing.jpg' },
    { icon: <Smartphone />, title: 'Consumer Tech', desc: 'Electronics & Wearables', img: 'assets/pavilions/consumer_tech.jpg' },
    { icon: <Rocket />, title: 'Startup Innovation Hub', desc: 'Early-stage growth & funding', img: 'assets/pavilions/startup.jpg' },
    { icon: <Building />, title: 'Infrastructure', desc: 'Smart Cities & Construction', img: 'assets/pavilions/infrastructure.jpg' },
    { icon: <Truck />, title: 'Supply Chain & Logistics', desc: 'Global mobility networks', img: 'assets/pavilions/supply_chain.jpg' },
    { icon: <Heart />, title: 'Med-Tech', desc: 'Healthcare & Biotech', img: 'assets/pavilions/med_tech.jpg' },
    { icon: <Banknote />, title: 'Fintech & Impact', desc: 'Financial Inclusion & Crypto', img: 'assets/pavilions/fintech.jpg' },
    { icon: <ShoppingBag />, title: 'Food Processing', desc: 'Agri-tech and FMCG', img: 'assets/pavilions/food_processing.jpg' },
    { icon: <Sun />, title: 'Renewable Energy', desc: 'Solar, EV, & Green Tech', img: 'assets/pavilions/renewable.jpg' },
    { icon: <Shield />, title: 'Defence', desc: 'Aero-space & Security', img: 'assets/pavilions/defence.jpg' },
    { icon: <Globe />, title: 'Diplomatic Pavilion', desc: 'International Relations', img: 'assets/pavilions/diplomatic.jpg' },
    { icon: <Landmark />, title: 'Ministerial Governance', desc: 'Policy & Public Admin', img: 'assets/pavilions/ministerial.jpg' },
    { icon: <Users />, title: 'Women Leaders Forum', desc: 'Empowerment & Enterprise', img: 'assets/pavilions/women.jpg' },
  ];

  const oppCards = [
    { id: 'corporate', title: 'Corporate (Domestic & Intl)', price: '₹20,000 / sq.m', img: 'assets/corporate.jpg', featureLead: 'Enterprise Market Leadership', features: ['Engagement with 500+ global CXOs', 'Platform for multi-sector innovation', 'Strategic branding to IIT leadership', 'Complimentary VIP & Delegate passes'] },
    { id: 'startup',   title: 'Startup Growth Pods',       price: 'From ₹25,000 + GST', img: 'assets/pavilions/startup.jpg', featureLead: '3 Flexible Space Options', features: ['POD 2x2m | POD+ 3x2m | PRO 3x3m', 'TV Screen + Table + Chairs included', 'VIP & Delegate Passes included', 'Low booking amount – balance later'], badge: 'Limited Slots' },
    { id: 'psu',       title: 'Public Sector Undertaking',  price: '₹18,000 / sq.m', img: 'assets/hero.png',                featureLead: 'Nation Building & Infrastructure', features: ['Showcase Vision 2047 initiatives', 'Govt-Industry synergy platform', 'Ministerial showcase opportunity', 'Complimentary VIP branding & passes'] },
    { id: 'government',title: 'Government (Ministries/States)', price: '₹18,000 / sq.m', img: 'assets/govt.jpg',            featureLead: 'Policy & Governance Excellence', features: ['Investment promotion platform', 'Bilateral & Diplomatic engagement', 'State-level innovation showcase', 'Elite networking with global leaders'] },
    { id: 'academia',  title: 'Academia & Institutions',   price: '₹10,000 / sq.m', img: 'assets/academia.jpg',            featureLead: 'Research & Talent Pathways', features: ['Collaborate with industry R&D', 'Talent exposure to global corporates', 'Showcase academic breakthroughs', 'Complimentary Delegate passes'] },
    { id: 'country',   title: 'Country Representation',    price: '$200 / sq.m',    img: 'assets/navigating.jpg',           featureLead: 'Trade Diplomacy & Global Trade', features: ['Cross-border investment gateway', 'Diplomatic branding & networking', 'National capability positioning', 'Elite access to Indian leadership'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative">

      {/* ═══════════════════ HEADER ═══════════════════ */}
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          transition: 'all 0.4s ease',
          background: headerScrolled
            ? 'rgba(0,45,98,0.97)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)',
          backdropFilter: headerScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: headerScrolled ? 'blur(20px)' : 'none',
          boxShadow: headerScrolled ? '0 2px 24px rgba(0,45,98,0.18)' : 'none',
          borderBottom: headerScrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '50%', padding: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="assets/vision2047logomain.png" alt="GLS Vision 2047" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
            </div>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em', lineHeight: 1.2, display: 'none' }} className="nav-brand-text">GLS Vision 2047</span>
          </a>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            {[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/#about' },
              { label: 'Agenda', href: '/#agenda' },
              { label: 'Zones', href: '/#zones' },
              { label: 'Contact', href: '/#contact' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#D4AF37'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.85)'}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { setIsBookingOpen(true); setClientAndSize('startup'); }}
              style={{ background: '#D4AF37', color: '#002D62', fontWeight: 800, fontSize: 14, padding: '10px 22px', borderRadius: 30, border: 'none', cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 4px 16px rgba(212,175,55,0.35)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { e.target.style.background = '#c3a033'; e.target.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.target.style.background = '#D4AF37'; e.target.style.transform = 'scale(1)'; }}
            >
              Book Now
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setHeaderMobileOpen(!headerMobileOpen)}
            aria-label="Toggle menu"
            style={{ display: 'none', flexDirection: 'column', gap: 5, padding: '10px', background: 'rgba(255,255,255,0.12)', borderRadius: 10, border: 'none', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
            className="mobile-hamburger"
          >
            <span style={{ display: 'block', width: 24, height: 2.5, background: '#fff', borderRadius: 2, transition: 'all 0.3s', transform: headerMobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 24, height: 2.5, background: '#fff', borderRadius: 2, transition: 'all 0.3s', opacity: headerMobileOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 24, height: 2.5, background: '#fff', borderRadius: 2, transition: 'all 0.3s', transform: headerMobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {headerMobileOpen && (
          <div style={{ position: 'fixed', top: 72, left: 0, right: 0, bottom: 0, background: 'rgba(0,45,98,0.98)', backdropFilter: 'blur(20px)', zIndex: 99, display: 'flex', flexDirection: 'column', padding: '32px 24px', gap: 0, overflowY: 'auto' }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/#about' },
              { label: 'Agenda', href: '/#agenda' },
              { label: 'Zones', href: '/#zones' },
              { label: 'Contact', href: '/#contact' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setHeaderMobileOpen(false)}
                style={{ color: '#fff', fontSize: 26, fontWeight: 800, textDecoration: 'none', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', letterSpacing: '-0.01em', display: 'block' }}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { setIsBookingOpen(true); setClientAndSize('startup'); setHeaderMobileOpen(false); }}
              style={{ marginTop: 32, background: '#D4AF37', color: '#002D62', fontWeight: 900, fontSize: 18, padding: '18px 24px', borderRadius: 16, border: 'none', cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 8px 30px rgba(212,175,55,0.4)', width: '100%' }}
            >
              Book Now
            </button>
          </div>
        )}

        {/* Responsive CSS for header */}
        <style>{`
          @media (min-width: 1024px) {
            .desktop-nav { display: flex !important; }
            .mobile-hamburger { display: none !important; }
          }
          @media (max-width: 1023px) {
            .desktop-nav { display: none !important; }
            .mobile-hamburger { display: flex !important; }
          }
        `}</style>
      </header>

      {/* FULL-SCREEN IMMERSIVE HERO SECTION */}
      <section className="w-full">
        <img src="assets/hero.png" alt="GLS Vision 2047 Hero" className="w-full h-auto block" />
      </section>

      {/* WHAT'S BEING SHOWCASED (Light Section) */}
      <section className="bg-white py-24 relative overflow-hidden border-b border-gray-100">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-left {
            animation: marquee-left 40s linear infinite;
          }
          .marquee-container:hover .animate-marquee-left {
            animation-play-state: paused;
          }
          /* MOBILE OPTIMIZATIONS (CRITICAL FIXES) */
          @media (max-width: 640px) {
            .gls-logo { height: 35px !important; }
            .partner-logo { height: 28px !important; }
            .header-sep { height: 20px !important; margin: 0 10px !important; }
            .book-btn { padding: 8px 16px !important; font-size: 12px !important; min-height: 48px !important; width: 100% !important; }
            
            /* Typography */
            h1 { font-size: 24px !important; }
            h2 { font-size: 20px !important; line-height: 1.3 !important; }
            h3 { font-size: 18px !important; }
            .card-title { font-size: 16px !important; }
            .price-text { font-size: 20px !important; line-height: 1.2 !important; }
            .desc-text { font-size: 13px !important; }
            .detail-text { font-size: 12px !important; word-wrap: break-word; overflow-wrap: break-word; }
            
            /* Layout */
            .grid-container { padding: 10px !important; }
            .plan-card { width: 100% !important; margin-bottom: 20px !important; padding: 15px !important; }
            .modal-content { flex-direction: column !important; }
            .modal-side-panel { display: none !important; }
            .full-width-mobile { width: 100% !important; display: block !important; }
            .line-break-format { display: block !important; }
            
            /* Button tap targets */
            button, a { min-height: 44px; display: flex; align-items: center; justify-content: center; }
          }
        `}} />
        
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#002D62] mb-4">Thematic Exhibition Zones</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">Where Innovation meets Capital. Discover 14 massive thematic pavilions specifically designed to empower high-impact sectors shaping India's Vision 2047.</p>
          </div>
        </div>

        {/* Marquee Container (Single) */}
        <div className="w-full relative marquee-container flex overflow-hidden py-4">
           <div className="flex w-max animate-marquee-left gap-6 px-3">
             {[...showcases, ...showcases].map((item, i) => (
                <div key={i} className="relative w-80 h-[380px] rounded-3xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 shadow-xl cursor-pointer shrink-0 border border-gray-200">
                  <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001f42] via-[#002D62]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 mb-4 shadow-lg group-hover:bg-[#D4AF37] transition-colors duration-300">
                      {React.cloneElement(item.icon, { size: 28 })}
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight mb-2">{item.title}</h3>
                    <p className="text-sm text-blue-100 font-medium group-hover:text-white transition-colors">{item.desc}</p>
                  </div>
                </div>
             ))}
           </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
          <div className="mt-16 text-center text-sm text-gray-500 italic max-w-4xl mx-auto font-medium">
            * Pavilions and zones are subject to availability. Book your space directly with our online portal.
          </div>
        </div>
      </section>

      {/* WHY EXHIBIT: STRATEGIC ROI SECTION */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-extrabold text-[#002D62] mb-4">Why Exhibit? The Ultimate Business ROI</h2>
             <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
               This is not just an exhibition—it is a launchpad. Secure unmatched access to capital, high-net-worth individuals, top-tier IIT alumni, and the policymakers shaping the future.
             </p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {/* Benefit 1 */}
             <div className="group bg-white border border-gray-200 rounded-[2rem] overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,45,98,0.15)] hover:-translate-y-2 transition-all duration-300 relative">
               <div className="h-48 relative overflow-hidden">
                 <img src="assets/benefits/capital.jpg" alt="Capital" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#001f42] via-[#001f42]/40 to-transparent opacity-90"></div>
                 <div className="absolute bottom-4 left-6 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white border border-white/20">
                    <TrendingUp size={28} />
                 </div>
               </div>
               <div className="p-8">
                 <h3 className="text-xl font-bold text-[#002D62] mb-3 group-hover:text-[#D4AF37] transition-colors">Direct Access to Capital</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Pitch directly to an exclusive network of 200+ global Hedge Funds, VCs, and Angel Investors seeking high-growth ventures and disruptive technologies across Technology, ESG, and Infrastructure.
                 </p>
               </div>
             </div>

             {/* Benefit 2 */}
             <div className="group bg-white border border-gray-200 rounded-[2rem] overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,45,98,0.15)] hover:-translate-y-2 transition-all duration-300 relative">
               <div className="h-48 relative overflow-hidden">
                 <img src="assets/benefits/network.png" alt="Inner Circle" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#001f42] via-[#001f42]/40 to-transparent opacity-90"></div>
                 <div className="absolute bottom-4 left-6 p-2 bg-[#D4AF37]/30 backdrop-blur-md rounded-xl text-[#FCE486] border border-[#D4AF37]/50">
                    <Users size={28} />
                 </div>
               </div>
               <div className="p-8">
                 <h3 className="text-xl font-bold text-[#002D62] mb-3 group-hover:text-[#D4AF37] transition-colors">The IIT Alumni Powerhouse</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Integrate your brand into the elite IIT alumni network of 5,00,000+ members. Engage in high-level networking with Global CEOs, Unicorn founders, and industry titans shaping the world economy.
                 </p>
               </div>
             </div>

             {/* Benefit 3 */}
             <div className="group bg-white border border-gray-200 rounded-[2rem] overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,45,98,0.15)] hover:-translate-y-2 transition-all duration-300 relative">
               <div className="h-48 relative overflow-hidden">
                 <img src="assets/benefits/insight.png" alt="Policy Makers" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#001f42] via-[#001f42]/40 to-transparent opacity-90"></div>
                 <div className="absolute bottom-4 left-6 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white border border-white/20">
                    <Landmark size={28} />
                 </div>
               </div>
               <div className="p-8">
                 <h3 className="text-xl font-bold text-[#002D62] mb-3 group-hover:text-[#D4AF37] transition-colors">Governance & Policy Insight</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Position your innovations directly before Union Ministers, State Leadership, and Public Administrators who are defining the regulatory and governance frameworks for India's 2047 roadmap.
                 </p>
               </div>
             </div>

             {/* Benefit 4 */}
             <div className="group bg-white border border-gray-200 rounded-[2rem] overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,45,98,0.15)] hover:-translate-y-2 transition-all duration-300 relative">
               <div className="h-48 relative overflow-hidden">
                 <img src="assets/benefits/prestige.png" alt="Global Prestige" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#001f42] via-[#001f42]/40 to-transparent opacity-90"></div>
                 <div className="absolute bottom-4 left-6 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white border border-white/20">
                    <Globe size={28} />
                 </div>
               </div>
               <div className="p-8">
                 <h3 className="text-xl font-bold text-[#002D62] mb-3 group-hover:text-[#D4AF37] transition-colors">Global Brand Prestige</h3>
                 <p className="text-gray-500 text-sm leading-relaxed">
                   Elevate your corporate identity from a participant to a market leader. Gain unparalleled media exposure and brand recognition on a global stage.
                 </p>
               </div>
             </div>
           </div>
           
           {/* Removed "Secure Your Investment" button */}
        </div>
      </section>

      {/* EXHIBITION OPPORTUNITIES (White Section) */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#002D62] mb-4">Exhibition Opportunities</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Select a tailor-made package that aligns with your organization's goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {oppCards.map(card => (
              <div key={card.id} className="bg-white rounded-[1.5rem] shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300 relative group">
                {/* Image */}
                <div className="h-48 relative overflow-hidden">
                   <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   {card.badge && (
                     <div className="absolute top-4 right-4 bg-[#D4AF37] text-[#002D62] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                       {card.badge}
                     </div>
                   )}
                </div>
                {/* Title Bar */}
                <div className="bg-[#002D62] text-white px-6 py-4">
                   <h3 className="font-bold text-lg card-title">{card.title}</h3>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex flex-col mb-4">
                     <span className="text-3xl font-black text-[#002D62] price-text leading-none">{card.price}</span>
                   </div>
                   
                   <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider mb-4">{card.featureLead}</p>
                   
                   <ul className="space-y-3 mb-6 flex-1">
                     {card.features.map((f, i) => (
                       <li key={i} className="flex gap-3 text-sm text-gray-600 detail-text">
                         <Check size={16} className="text-[#002D62] shrink-0 mt-0.5" /> 
                         <span className="leading-tight break-words">{f}</span>
                       </li>
                     ))}
                   </ul>

                   <button 
                     onClick={() => handleBookSpace(card.id)}
                     className="w-full py-4 rounded-xl bg-[#002D62] text-white font-bold hover:bg-[#003d82] transition-all active:scale-95 book-btn flex items-center justify-center gap-2"
                   >
                     Book Now
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* UNIFIED MODAL (Premium Style - Kept Intact) */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-[#002D62]/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full h-[100dvh] md:h-[90vh] md:max-h-[850px] md:max-w-[1200px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
            >
              
              {/* LEFT PANEL: Dynamic — shows startup benefits when startup tab active, else generic branding */}
              <div className="hidden md:flex md:w-[38%] lg:w-[35%] bg-[#002D62] relative flex-col text-white overflow-hidden">
                <div className="absolute inset-0">
                  <img src="assets/hero.png" alt="GLS" className="w-full h-full object-cover object-right opacity-40 mix-blend-screen block" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#001a3d] via-[#002D62]/95 to-[#002D62]"></div>
                </div>

                <div className="relative z-10 p-8 flex flex-col h-full overflow-y-auto">
                  {/* Logo always visible */}
                  <div className="flex items-center gap-3 mb-6 flex-shrink-0">
                    <div className="bg-white/95 p-2 rounded-full shadow-lg">
                      <img src="assets/vision2047logomain.png" alt="GLS" className="h-[32px] w-auto" />
                    </div>
                    <span className="text-white/70 text-xs font-bold uppercase tracking-widest">GLS Vision 2047</span>
                  </div>

                  {clientType === 'startup' ? (
                    /* ── STARTUP BENEFITS PANEL ── */
                    <div className="flex-1 flex flex-col">
                      <h2 className="text-2xl font-extrabold text-white mb-1 leading-tight">
                        {selectedSize === 4 ? 'Startup POD' : selectedSize === 6 ? 'Startup POD+' : 'Startup POD PRO'}
                      </h2>
                      <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-5">
                        {selectedSize === 4 ? '2×2 m · 4 sqm' : selectedSize === 6 ? '3×2 m · 6 sqm' : '3×3 m · 9 sqm'} · What you get
                      </p>

                      {/* Benefits list */}
                      {selectedSize === 4 && (
                        <div className="space-y-3 flex-1">
                          {[
                            { label: '4 sqm Area (2×2 m)', value: 'Worth ₹80,000', icon: '📐' },
                            { label: '2 Delegate Passes', value: 'Worth ₹5,000', icon: '🎫' },
                            { label: 'TV Screen + Table + Chairs', value: 'Worth ₹10,000', icon: '🖥️' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                              <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                              <div>
                                <p className="text-white font-semibold text-sm leading-tight">{item.label}</p>
                                <p className="text-[#D4AF37] text-xs font-bold mt-0.5">{item.value}</p>
                              </div>
                            </div>
                          ))}
                          <div className="mt-4 bg-white/5 border border-white/20 rounded-xl p-4">
                            <p className="text-white/50 text-xs line-through mb-1">Actual Value: ₹95,000 + taxes</p>
                            <p className="text-[#D4AF37] text-xl font-black">Early Bird: ₹25,000</p>
                            <p className="text-white/70 text-xs mt-1">Pay just <span className="text-white font-bold">₹10,000 + taxes</span> to book now</p>
                          </div>
                        </div>
                      )}
                      {selectedSize === 6 && (
                        <div className="space-y-3 flex-1">
                          {[
                            { label: '6 sqm Area (3×2 m)', value: 'Worth ₹1,20,000', icon: '📐' },
                            { label: '1 VIP + 2 Delegate Passes', value: 'Worth ₹30,000', icon: '🎫' },
                            { label: 'TV Screen + Table + Chairs', value: 'Worth ₹10,000', icon: '🖥️' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                              <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                              <div>
                                <p className="text-white font-semibold text-sm leading-tight">{item.label}</p>
                                <p className="text-[#D4AF37] text-xs font-bold mt-0.5">{item.value}</p>
                              </div>
                            </div>
                          ))}
                          <div className="mt-4 bg-white/5 border border-white/20 rounded-xl p-4">
                            <p className="text-white/50 text-xs line-through mb-1">Actual Value: ₹1,60,000 + taxes</p>
                            <p className="text-[#D4AF37] text-xl font-black">Early Bird: ₹50,000</p>
                            <p className="text-white/70 text-xs mt-1">Pay just <span className="text-white font-bold">₹20,000 + taxes</span> to book now</p>
                          </div>
                        </div>
                      )}
                      {selectedSize === 9 && (
                        <div className="space-y-3 flex-1">
                          {[
                            { label: '9 sqm Area (3×3 m)', value: 'Worth ₹1,80,000', icon: '📐' },
                            { label: '2 VIP + 2 Delegate Passes', value: 'Worth ₹55,000', icon: '🎫' },
                            { label: 'TV Screen + Table + Chairs', value: 'Worth ₹10,000', icon: '🖥️' },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                              <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                              <div>
                                <p className="text-white font-semibold text-sm leading-tight">{item.label}</p>
                                <p className="text-[#D4AF37] text-xs font-bold mt-0.5">{item.value}</p>
                              </div>
                            </div>
                          ))}
                          <div className="mt-4 bg-white/5 border border-white/20 rounded-xl p-4">
                            <p className="text-white/50 text-xs line-through mb-1">Actual Value: ₹2,45,000 + taxes</p>
                            <p className="text-[#D4AF37] text-xl font-black">Early Bird: ₹1,00,000</p>
                            <p className="text-white/70 text-xs mt-1">Pay just <span className="text-white font-bold">₹30,000 + taxes</span> to book now</p>
                          </div>
                        </div>
                      )}

                      {/* Venue at bottom */}
                      <div className="mt-6 flex-shrink-0 border-t border-white/10 pt-4 flex items-center gap-2">
                        <MapPin size={14} className="text-[#D4AF37] shrink-0" />
                        <p className="text-white/60 text-xs">Yashobhoomi, New Delhi · 18–19 July 2026</p>
                      </div>
                    </div>
                  ) : (
                    /* ── GENERIC BRANDING FOR NON-STARTUP ── */
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-3">Secure Your Pavilion Space</h2>
                        <p className="text-blue-100 text-sm leading-relaxed">Connect with 200+ global investors, government bodies, and 500+ CXOs under one roof.</p>
                        <ul className="mt-6 space-y-3">
                          {benefits[clientType]?.features?.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-blue-100">
                              <Check size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                        <div className="flex gap-3">
                          <div className="bg-[#D4AF37]/20 p-2.5 rounded-full h-fit text-[#D4AF37]"><MapPin size={20} /></div>
                          <div>
                            <h4 className="font-bold text-[#D4AF37] text-sm mb-0.5">Venue</h4>
                            <p className="text-blue-50 text-xs">Yashobhoomi Convention Centre, New Delhi · 18–19 July 2026</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL: Single Page Unified Form Layout */}
              <div className="flex-[1.5] lg:flex-1 flex flex-col bg-gray-50 relative h-full overflow-hidden">
                
                {/* Header for Mobile */}
                <div className="md:hidden flex-none flex items-center justify-between p-4 bg-white border-b border-gray-200 z-10 shadow-sm">
                   <h3 className="font-bold text-lg text-[#002D62]">Secure Space</h3>
                   <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                     <X size={24} />
                   </button>
                </div>
                
                {/* Close Button for Desktop */}
                <button onClick={closeModal} className="hidden md:flex absolute top-6 right-6 z-20 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors">
                  <X size={24} />
                </button>

                {/* SCROLLABLE FORM CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 w-full" id="scrollable-form">
                  <div className="space-y-8 max-w-2xl mx-auto w-full pb-8">
                    
                    {/* Header Text */}
                    <div className="hidden md:block">
                      <h3 className="text-2xl font-bold text-[#002D62] tracking-tight">Booking Details</h3>
                      <p className="text-gray-500 text-sm mt-1">Complete this single form to secure your spot.</p>
                    </div>

                    {/* PILL TOGGLE */}
                    <div className="bg-white p-1.5 rounded-2xl grid grid-cols-3 lg:grid-cols-6 gap-1 border border-gray-200 shadow-sm w-full mx-auto relative overflow-hidden">
                      <button onClick={() => setClientAndSize('corporate')} className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-xl text-xs transition-all duration-300 ${clientType === 'corporate' ? 'bg-[#002D62] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Building2 size={18} className={clientType === 'corporate' ? 'text-[#D4AF37]' : ''} /> 
                        <span className="font-bold whitespace-nowrap">Corporate</span>
                      </button>
                      <button onClick={() => setClientAndSize('startup')} className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-xl text-xs transition-all duration-300 ${clientType === 'startup' ? 'bg-[#002D62] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Rocket size={18} className={clientType === 'startup' ? 'text-[#D4AF37]' : ''} /> 
                        <span className="font-bold whitespace-nowrap">Startup</span>
                      </button>
                      <button onClick={() => setClientAndSize('psu')} className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-xl text-xs transition-all duration-300 ${clientType === 'psu' ? 'bg-[#002D62] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Factory size={18} className={clientType === 'psu' ? 'text-[#D4AF37]' : ''} /> 
                        <span className="font-bold whitespace-nowrap">PSU</span>
                      </button>
                      <button onClick={() => setClientAndSize('government')} className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-xl text-xs transition-all duration-300 ${clientType === 'government' ? 'bg-[#002D62] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Landmark size={18} className={clientType === 'government' ? 'text-[#D4AF37]' : ''} /> 
                        <span className="font-bold whitespace-nowrap">Government</span>
                      </button>
                      <button onClick={() => setClientAndSize('academia')} className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-xl text-xs transition-all duration-300 ${clientType === 'academia' ? 'bg-[#002D62] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <BookOpen size={18} className={clientType === 'academia' ? 'text-[#D4AF37]' : ''} /> 
                        <span className="font-bold whitespace-nowrap">Academia</span>
                      </button>
                      <button onClick={() => setClientAndSize('country')} className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-xl text-xs transition-all duration-300 ${clientType === 'country' ? 'bg-[#002D62] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <Globe size={18} className={clientType === 'country' ? 'text-[#D4AF37]' : ''} /> 
                        <span className="font-bold whitespace-nowrap">Country Rep.</span>
                      </button>
                    </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-widest flex items-center gap-2">
                          <Map size={18} className="text-[#D4AF37]" /> Select Area Plan
                        </h4>

                        {/* Non-startup Area Options */}
                        {clientType !== 'startup' && (
                          <div className="animate-in fade-in duration-300">
                            <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-tight">
                              Pricing: <span className="font-bold text-[#002D62]">{benefits[clientType].rate}</span> <span className="text-[10px] font-normal opacity-80">{['psu', 'government'].includes(clientType) ? '(Min. 100 sqm)' : '(excl. taxes)'}</span>
                            </p>
                            <div className={`grid grid-cols-2 ${['psu', 'government'].includes(clientType) ? 'lg:grid-cols-5' : 'lg:grid-cols-3'} gap-3`}>
                              {(areaOptionsByClient[clientType] || []).map(opt => (
                                <button
                                  key={opt.sqm}
                                  onClick={() => setSelectedSize(opt.sqm)}
                                  className={`py-4 px-3 border-2 rounded-xl text-sm transition-all text-center flex flex-col items-center justify-center gap-1 ${selectedSize === opt.sqm ? 'border-[#002D62] bg-[#002D62]/5 text-[#002D62] ring-1 ring-[#002D62] shadow-sm' : 'border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                                >
                                  <span className="font-bold">{opt.label}</span>
                                  <span className="text-xs opacity-70">{opt.subLabel}</span>
                                </button>
                              ))}
                            </div>
                            {['psu', 'government'].includes(clientType) && (
                              <p className="text-xs text-gray-500 mt-3">Large pavilion slabs are fixed at 100, 200, 300, 400, and 500 sqm.</p>
                            )}
                          </div>
                        )}

                        {/* Startup Options */}
                        {clientType === 'startup' && (
                          <div className="animate-in fade-in duration-300">
                            <p className="text-sm text-gray-500 mb-4 font-medium uppercase tracking-tight">Startup Category Plans:</p>
                            <div className="grid grid-cols-1 gap-4">
                              {[
                                { id: 4, name: 'Startup POD', size: '2x2 M', price: '₹25,000', book: '₹10,000', color: 'blue' },
                                { id: 6, name: 'Startup POD+', size: '3x2 M', price: '₹50,000', book: '₹20,000', color: 'indigo' },
                                { id: 9, name: 'Startup POD PRO', size: '3x3 M', price: '₹1,00,000', book: '₹30,000', color: 'gold', featured: true }
                              ].map(plan => (
                                <button
                                  key={plan.id}
                                  onClick={() => setSelectedSize(plan.id)}
                                  className={`p-5 border-2 rounded-2xl text-left transition-all flex flex-col gap-1 relative ${selectedSize === plan.id ? 'border-[#002D62] bg-[#002D62]/5 ring-1 ring-[#002D62] shadow-md' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                                >
                                  {plan.featured && <span className="absolute top-4 right-4 bg-[#D4AF37] text-[#002D62] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">Featured</span>}
                                  <div className="flex justify-between items-center">
                                    <span className={`font-bold text-lg ${selectedSize === plan.id ? 'text-[#002D62]' : 'text-gray-700'}`}>{plan.name}</span>
                                    {selectedSize === plan.id && <Check className="text-[#002D62]" size={20} />}
                                  </div>
                                  <p className="text-xs text-gray-500 font-medium">{plan.size}eters Space</p>
                                  <div className="flex items-baseline gap-2 mt-2">
                                    <p className="text-2xl font-black text-[#002D62]">{plan.price}</p>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">+ GST</span>
                                  </div>
                                  <p className="text-xs sm:text-sm font-bold text-[#D4AF37] mt-1 bg-[#D4AF37]/5 px-2 py-1 sm:px-3 sm:py-1 rounded-lg border border-[#D4AF37]/10 w-fit">Booking Amt: {plan.book}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* EXCLUSIVE BENEFITS AREA — hidden on desktop for startup (shown in left panel) */}
                      {/* On mobile always show. On desktop only show for non-startup. */}
                      {(clientType !== 'startup') && (
                        <div className="bg-[#002D62]/5 border border-[#002D62]/10 rounded-2xl p-6">
                          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2 mb-4">
                            <CheckCircle size={18} className="text-[#D4AF37]" />
                            {benefits[clientType].desc}
                          </h4>
                          <ul className="space-y-3">
                            {benefits[clientType].features.map((f, i) => (
                              <li key={i} className="flex gap-3 text-sm text-gray-700">
                                <Check size={18} className="text-[#002D62] shrink-0 mt-0.5" /> <span className="leading-tight">{f}</span>
                              </li>
                            ))}
                          </ul>
                          {benefits[clientType].passes && (
                            <div className="mt-4 inline-block bg-white text-[#002D62] text-xs font-bold px-4 py-2 rounded-lg border border-[#002D62]/10 shadow-sm">
                              <span className="text-gray-500 uppercase tracking-widest text-[10px] block mb-0.5">Complimentary Passes Included</span>
                              {selectedPassText || benefits[clientType].passes}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mobile-only benefits for startup */}
                      {clientType === 'startup' && (
                        <div className="md:hidden bg-[#002D62] text-white rounded-2xl p-5">
                          <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CheckCircle size={16} className="text-[#D4AF37]" />
                            {selectedSize === 4 ? 'POD Benefits' : selectedSize === 6 ? 'POD+ Benefits' : 'POD PRO Benefits'}
                          </h4>
                          {selectedSize === 4 && (
                            <>
                              <ul className="space-y-2">
                                {[['📐','4 sqm Area (2×2 m)','Worth ₹80,000'],['🎫','2 Delegate Passes','Worth ₹5,000'],['🖥️','TV + Table + Chairs','Worth ₹10,000']].map(([ic,l,v],i)=>(
                                  <li key={i} className="flex items-start gap-2 text-sm"><span>{ic}</span><span className="text-white/90">{l}</span><span className="ml-auto text-[#D4AF37] font-bold text-xs shrink-0">{v}</span></li>
                                ))}
                              </ul>
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-white/40 text-xs line-through">Actual: ₹95,000</p>
                                <p className="text-[#D4AF37] font-black text-base">Early Bird: ₹25,000 · Book at ₹10,000</p>
                              </div>
                            </>
                          )}
                          {selectedSize === 6 && (
                            <>
                              <ul className="space-y-2">
                                {[['📐','6 sqm Area (3×2 m)','Worth ₹1,20,000'],['🎫','1 VIP + 2 Delegate Passes','Worth ₹30,000'],['🖥️','TV + Table + Chairs','Worth ₹10,000']].map(([ic,l,v],i)=>(
                                  <li key={i} className="flex items-start gap-2 text-sm"><span>{ic}</span><span className="text-white/90">{l}</span><span className="ml-auto text-[#D4AF37] font-bold text-xs shrink-0">{v}</span></li>
                                ))}
                              </ul>
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-white/40 text-xs line-through">Actual: ₹1,60,000</p>
                                <p className="text-[#D4AF37] font-black text-base">Early Bird: ₹50,000 · Book at ₹20,000</p>
                              </div>
                            </>
                          )}
                          {selectedSize === 9 && (
                            <>
                              <ul className="space-y-2">
                                {[['📐','9 sqm Area (3×3 m)','Worth ₹1,80,000'],['🎫','2 VIP + 2 Delegate Passes','Worth ₹55,000'],['🖥️','TV + Table + Chairs','Worth ₹10,000']].map(([ic,l,v],i)=>(
                                  <li key={i} className="flex items-start gap-2 text-sm"><span>{ic}</span><span className="text-white/90">{l}</span><span className="ml-auto text-[#D4AF37] font-bold text-xs shrink-0">{v}</span></li>
                                ))}
                              </ul>
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-white/40 text-xs line-through">Actual: ₹2,45,000</p>
                                <p className="text-[#D4AF37] font-black text-base">Early Bird: ₹1,00,000 · Book at ₹30,000</p>
                              </div>
                            </>
                          )}
                        </div>
                      )}
 


                    {/* PERSONAL DETAILS (Full Details) */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-8">
                      <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-widest flex items-center gap-2">
                        <Users size={18} className="text-[#D4AF37]" /> Exhibitor Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1.5 pl-1">Name *</label>
                           <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002D62] outline-none transition-colors" placeholder="Full Name" required />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1.5 pl-1">Company / Brand *</label>
                           <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002D62] outline-none transition-colors" placeholder="Your Organization" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 pl-1">Job Title / Designation *</label>
                          <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002D62] outline-none transition-colors" placeholder="e.g. CEO, Founder, Director" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 pl-1">Industry / Sector</label>
                          <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002D62] outline-none transition-colors" placeholder="Fintech, Infrastructure, Defence, etc." />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 pl-1">Email Address *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002D62] outline-none transition-colors" placeholder="mail@domain.com" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 pl-1">WhatsApp / Phone *</label>
                          <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002D62] outline-none transition-colors" placeholder="+91 00000 00000" required />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 pl-1">City, Country</label>
                          <input type="text" name="city_country" value={formData.city_country} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002D62] outline-none transition-colors" placeholder="e.g. New Delhi, India" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 pl-1">Website URL</label>
                          <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002D62] outline-none transition-colors" placeholder="https://www.yourdomain.com" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 pl-1">Description of Innovations / Solutions to Showcase</label>
                          <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-[#002D62] outline-none transition-colors" placeholder="Briefly describe what you will exhibit..."></textarea>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* FIXED BOTTOM SUMMARY STRIP — compact single row */}
                <div className="flex-none bg-white border-t border-gray-200 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] z-20">
                  <div className="max-w-2xl mx-auto w-full px-4 py-3 md:px-8 md:py-4 flex items-center gap-3">
                    {/* Amount block */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-[#D4AF37] font-extrabold uppercase tracking-widest leading-none mb-1">
                        {clientType === 'startup' ? 'Booking Amount + GST' : (vals.isFull ? 'Total Amount + GST' : 'Booking Amount (10%) + GST')}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-[#002D62] tracking-tight leading-none">
                          {vals.currency}{vals.payable.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">+ GST</span>
                        {clientType === 'startup' && (
                          <span className="text-[10px] bg-blue-50 text-[#002D62] px-2 py-0.5 rounded-full font-bold border border-blue-100">Balance later</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Full price: {vals.currency}{vals.total.toLocaleString('en-IN')} + GST
                        {vals.total >= 100000 && vals.currency === '₹' ? ` (≈ ${(vals.total/100000).toFixed(2)} L)` : ''}
                      </p>
                    </div>

                    {/* Pay Now CTA */}
                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className={`flex-shrink-0 bg-[#D4AF37] hover:bg-[#c3a033] text-[#002D62] font-black px-6 py-3 rounded-xl shadow-md shadow-[#D4AF37]/30 transition-all active:scale-95 flex items-center gap-2 text-sm uppercase tracking-wide whitespace-nowrap ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isProcessing ? 'Processing...' : 'Pay Now'} <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* OFFICIAL FOOTER */}
      <footer style={{
        background: '#002D62',
        color: 'white',
        padding: '15px 0',
        borderTop: '3px solid #D4AF37'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div className="footer-section" style={{flex: '1.5', minWidth: '250px'}}>
                 <h4 style={{fontSize: '15px', fontWeight: 800, margin: '0 0 5px 0', color: '#D4AF37'}}>Global Leadership Summit Vision 2047</h4>
                 <div style={{marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px'}}>
                   <span style={{fontSize: '12px', fontWeight: 900, color: 'white', letterSpacing: '0.05em'}}>18–19 JULY 2026</span>
                   <span style={{fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.6)'}}>Yashobhoomi Convention Centre, New Delhi</span>
                 </div>
                 <p className="footer-tagline" style={{fontSize: '10px', marginTop: '8px', opacity: 0.7}}>Leadership • Innovation • Vision 2047</p>
             </div> 
            <div className="footer-section" style={{flex: '1', minWidth: '150px'}}>
                <ul className="footer-links" style={{display: 'flex', flexWrap: 'wrap', gap: '15px', listStyle: 'none', padding: 0, margin: 0, fontSize: '11px'}}>
                    <li><a href="/#about" style={{color: '#94a3b8', textDecoration: 'none'}}>About</a></li>
                    <li><a href="/#conference" style={{color: '#94a3b8', textDecoration: 'none'}}>Conference</a></li>
                    <li><a href="/#sponsorship" style={{color: '#94a3b8', textDecoration: 'none'}}>Sponsorship</a></li>
                    <li><a href="/#tickets" style={{color: '#94a3b8', textDecoration: 'none'}}>Register</a></li>
                </ul>
            </div>  
            <div className="footer-section" style={{flex: '1', minWidth: '150px'}}>
                 <ul className="footer-links" style={{display: 'flex', flexWrap: 'wrap', gap: '15px', listStyle: 'none', padding: 0, margin: 0, fontSize: '11px'}}>
                    <li><a href="/privacy.html" style={{color: '#94a3b8', textDecoration: 'none'}}>Privacy</a></li>
                    <li><a href="/terms.html" style={{color: '#94a3b8', textDecoration: 'none'}}>Terms</a></li>
                </ul>
            </div>  
            <div className="footer-section" style={{flex: '1', minWidth: '150px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <span style={{fontSize: '10px', color: '#94a3b8'}}>Organised By</span>
                    <div style={{width: '80px', background: 'rgba(255,255,255,0.95)', padding: '5px', borderRadius: '5px'}}>
                      <img src="assets/molog-logo.png" style={{width: '100%', height: 'auto', display: 'block'}} alt="MOLOG" />
                    </div>
                  </div>
            </div>
          </div>
          <div style={{
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <p style={{fontSize: '10px', margin: 0, color: '#94a3b8'}}>&copy; 2026 GLS Vision 2047. All rights reserved.</p>
            <div style={{display: 'flex', gap: '15px', fontSize: '11px'}}>
              <a href="https://www.facebook.com/glsvision2047/" target="_blank" style={{color: '#94a3b8'}}><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.linkedin.com/company/glsvision2047/" target="_blank" style={{color: '#94a3b8'}}><i className="fab fa-linkedin-in"></i></a>
              <a href="https://x.com/glsvision2047" target="_blank" style={{color: '#94a3b8'}}><i className="fab fa-twitter"></i></a>
              <a href="https://www.instagram.com/glsvision2047/" target="_blank" style={{color: '#94a3b8'}}><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
