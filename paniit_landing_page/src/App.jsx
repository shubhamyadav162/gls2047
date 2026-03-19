import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Building2, Rocket, Map, CreditCard, Zap, Calendar, MapPin, Users, ArrowRight, BookOpen, Shield,
  Cpu, Factory, Smartphone, Building, Truck, Heart, Banknote, ShoppingBag, Sun, Globe, Landmark, ChevronRight, TrendingUp
} from 'lucide-react';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
      9: { vip: 2, delegate: 4, exhibitor: 4 }
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
      const total = fixedPrice;
      const bookingToken = 9000;
      const gst = 0;
      const payable = bookingToken;
      return {
        total,
        bookingToken,
        gst,
        payable,
        currency,
        isFull: false,
        gstIncluded: true,
        bookingLabel: 'Booking Amount',
        tagLabel: 'Token',
        baseLabel: 'Booking Base:',
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
      desc: 'Exclusive "Startup Growth Pod" for high-impact investor matchmaking and networking.',
      features: ['Premium 3x3 Startup POD PRO at ₹25,000 (GST included)', 'Booking amount: ₹9,000 only', 'High-impact investor matchmaking and pitching sessions', '2 VIP + 4 Delegate + 4 Exhibitor passes included'],
      passes: '2 VIP + 4 Delegate + 4 Exhibitor',
      rate: '₹25,000 Flat Fee (GST included)'
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
    { id: 'corporate', title: 'Corporate (Domestic & Intl)', price: '₹20,000 / sq.m', img: 'assets/hero.png', featureLead: 'Enterprise Market Leadership', features: ['Engagement with 500+ global CXOs', 'Platform for multi-sector innovation', 'Strategic branding to IIT leadership', 'Complimentary VIP & Delegate passes'] },
    { id: 'startup', title: 'Startup Growth Pods', price: '₹25,000 Flat (GST Included)', img: 'assets/hero.png', featureLead: 'Investor Access & Dealmaking', features: ['Premium 3x3 Startup POD PRO', 'Booking amount only ₹9,000', '2 VIP + 4 Delegate + 4 Exhibitor passes', 'Pitch opportunities to global funds'] },
    { id: 'psu', title: 'Public Sector Undertaking', price: '₹18,000 / sq.m', img: 'assets/hero.png', featureLead: 'Nation Building & Infrastructure', features: ['Showcase Vision 2047 initiatives', 'Govt-Industry synergy platform', 'Ministerial showcase opportunity', 'Complimentary VIP branding & passes'] },
    { id: 'government', title: 'Government (Ministries/States)', price: '₹18,000 / sq.m', img: 'assets/government.jpg', featureLead: 'Policy & Governance Excellence', features: ['Investment promotion platform', 'Bilateral & Diplomatic engagement', 'State-level innovation showcase', 'Elite networking with global leaders'] },
    { id: 'academia', title: 'Academia & Institutions', price: '₹10,000 / sq.m', img: 'assets/academia.jpg', featureLead: 'Research & Talent Pathways', features: ['Collaborate with industry R&D', 'Talent exposure to global corporates', 'Showcase academic breakthroughs', 'Complimentary Delegate passes'] },
    { id: 'country', title: 'Country Representation', price: '$200 / sq.m', img: 'assets/corporate.jpg', featureLead: 'Trade Diplomacy & Global Trade', features: ['Cross-border investment gateway', 'Diplomatic branding & networking', 'National capability positioning', 'Elite access to Indian leadership'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative">
      <header id="header" className="fixed top-0 shadow-md z-[1000]" style={{ background: '#0B3D91', borderBottom: '3px solid #FF8C00', width: '100%', left: 0 }}>
        <div className="container flex justify-between items-center py-3 px-4 md:px-8 max-w-[1400px] mx-auto" style={{ background: 'transparent' }}>
          
          <div className="flex items-center gap-4" style={{ background: 'transparent' }}>
            <a href="/index.html" className="flex items-center">
              <img src="/images/vision2047logomain.png" alt="GLS Vision Summit 2026" className="gls-logo h-[50px] w-auto transition-all" />
            </a>
          </div>

          <nav className="hidden md:flex flex-grow justify-center" style={{ background: 'transparent' }}>
            <ul className="flex gap-6 items-center m-0 p-0 list-none text-white text-sm font-semibold" style={{ background: 'transparent' }}>
              <li><a href="/index.html#home" className="hover:text-[#FF8C00] transition-colors">Home</a></li>
              <li><a href="/index.html#about" className="hover:text-[#FF8C00] transition-colors">About</a></li>
              <li><a href="/index.html#vision2047" className="hover:text-[#FF8C00] transition-colors">GLS Vision</a></li>
              <li><a href="/index.html#theme" className="hover:text-[#FF8C00] transition-colors">Theme</a></li>
              <li><a href="/index.html#partners" className="hover:text-[#FF8C00] transition-colors">Partners</a></li>
              <li><a href="/exhibition/" className="text-[#FF8C00] font-bold">Exhibition</a></li>
              <li><a href="/tickets.html" className="hover:text-[#FF8C00] transition-colors">Tickets</a></li>
              <li><a href="/index.html#contact" className="hover:text-[#FF8C00] transition-colors">Contact</a></li>
            </ul>
          </nav>

          <div className="flex items-center gap-3" style={{ background: 'transparent' }}>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2 text-2xl font-bold"
              style={{ background: 'transparent' }}
            >
              ☰
            </button>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#0B1E3F] w-full overflow-hidden border-b border-[#FF8C00] shadow-lg absolute top-full left-0 z-50"
            >
              <div className="py-6 flex flex-col gap-4">
                <ul className="flex flex-col gap-4 text-white text-sm font-semibold text-center">
                  <li><a href="/index.html#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
                  <li><a href="/index.html#about" onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
                  <li><a href="/index.html#vision2047" onClick={() => setIsMobileMenuOpen(false)}>GLS Vision</a></li>
                  <li><a href="/index.html#theme" onClick={() => setIsMobileMenuOpen(false)}>Theme</a></li>
                  <li><a href="/index.html#partners" onClick={() => setIsMobileMenuOpen(false)}>Partners</a></li>
                  <li><a href="/exhibition/" className="text-[#FF8C00]" onClick={() => setIsMobileMenuOpen(false)}>Exhibition</a></li>
                  <li><a href="/tickets.html" onClick={() => setIsMobileMenuOpen(false)}>Tickets</a></li>
                  <li><a href="/index.html#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          @media (max-width: 640px) {
            .gls-logo { height: 35px !important; }
            .partner-logo { height: 28px !important; }
            .header-sep { height: 20px !important; margin: 0 10px !important; }
            .book-btn { padding: 6px 14px !important; font-size: 10px !important; }
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
           
           <div className="mt-16 text-center">
             <button 
               onClick={() => handleBookSpace('corporate')}
               className="bg-[#002D62] hover:bg-[#001f42] text-white font-bold px-10 py-5 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto text-lg"
             >
               Secure Your Investment <ArrowRight size={20} className="text-[#D4AF37]" />
             </button>
           </div>
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
              <div key={card.id} className="bg-white rounded-[1.5rem] shadow-lg border border-gray-100 overflow-hidden flex flex-col flex-1 hover:-translate-y-1 transition-transform duration-300">
                {/* Image */}
                <div className="h-48 relative">
                   <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                </div>
                {/* Title Bar */}
                <div className="bg-[#002D62] text-white px-6 py-4">
                   <h3 className="font-bold text-lg">{card.title}</h3>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                   <div className="text-2xl font-black text-[#002D62] mb-1">{card.price}</div>
                   <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-6">{card.featureLead}</p>
                   
                   <ul className="space-y-3 mb-8 flex-1">
                     {card.features.map((f, i) => (
                       <li key={i} className="flex gap-3 text-sm text-gray-600">
                         <Check size={16} className="text-[#002D62] shrink-0 mt-0.5" /> 
                         <span className="leading-tight">{f}</span>
                       </li>
                     ))}
                   </ul>

                   <button 
                     onClick={() => handleBookSpace(card.id)}
                     className="w-full py-3.5 rounded-xl border-2 border-[#002D62] text-[#002D62] font-bold hover:bg-[#002D62] hover:text-white transition-colors"
                   >
                     Book Space
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#002D62] text-white py-12 border-t-4 border-[#D4AF37]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div>
             <div className="flex items-center gap-4 mb-4 bg-white p-2 rounded-xl">
               <img src="assets/vision2047logomain.png" className="h-10 w-auto" alt="GLS" />
               <div className="w-px h-8 bg-gray-200"></div>
               <img src="assets/iitalumuniai.png" className="h-8 w-auto" alt="PanIIT" />
             </div>
             <p className="text-blue-200 text-sm">© 2026 GLS Vision 2047 Alumni India. All Rights Reserved.</p>
           </div>
           <div className="flex gap-6 text-sm font-semibold text-blue-200">
             <a href="#" className="hover:text-white transition-colors">Contact Us</a>
             <a href="#" className="hover:text-white transition-colors">Sponsorships</a>
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
           </div>
        </div>
      </footer>

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
              
              {/* LEFT PANEL: Branding & Visuals (Hidden on small mobile for space, or shown compact) */}
              <div className="hidden md:flex md:w-[40%] lg:w-[35%] bg-[#002D62] relative flex-col text-white">
                <div className="absolute inset-0">
                  <img src="assets/hero.png" alt="3D Environment" className="w-full h-full object-cover object-right opacity-60 mix-blend-screen block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002D62] via-[#002D62]/90 to-[#002D62]/80"></div>
                </div>

                <div className="relative z-10 p-10 flex flex-col h-full justify-between">
                   <div>
                     <button onClick={closeModal} className="mb-8 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors w-fit md:hidden">
                       <X size={20} />
                     </button>
                     <div className="flex items-center gap-4 mb-8 bg-white p-3 rounded-2xl shadow-lg w-fit">
                       <img src="assets/vision2047logomain.png" alt="GLS" className="h-12 w-auto" />
                       <div className="w-px h-10 bg-gray-200"></div>
                       <img src="assets/iitalumuniai.png" alt="PanIIT" className="h-10 w-auto" />
                     </div>
                     <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Secure Your <br/><span className="text-[#D4AF37]">Pavilion Space</span></h2>
                     <p className="text-blue-100 text-lg leading-relaxed">Connect with 200+ global investors, government bodies, and 500+ CXOs under one roof.</p>
                   </div>

                   <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                     <div className="flex gap-4">
                       <div className="bg-[#D4AF37]/20 p-3 rounded-full h-fit text-[#D4AF37]"><MapPin size={24} /></div>
                       <div>
                         <h4 className="font-bold text-lg text-[#D4AF37] mb-1">Venue</h4>
                         <p className="text-blue-50 text-sm">Yashobhoomi Convention Centre, New Delhi, India</p>
                       </div>
                     </div>
                   </div>
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
                            <p className="text-sm text-gray-500 mb-4 font-medium">Startup Category (Fixed):</p>
                            <div className="grid grid-cols-1 gap-4">
                              <button
                                onClick={() => setSelectedSize(9)}
                                className="p-4 border-2 rounded-xl text-left transition-all flex flex-col gap-2 border-[#002D62] bg-[#002D62]/5 ring-1 ring-[#002D62]"
                              >
                                  <div className="flex justify-between items-start">
                                    <span className="font-bold text-[#002D62]">Startup POD PRO</span>
                                    <Check className="text-[#002D62]" size={16} />
                                  </div>
                                  <p className="text-xs text-gray-500">3x3 Meters (9 SQM)</p>
                                  <p className="text-lg font-black text-[#002D62]">₹25,000</p>
                                  <p className="text-[11px] text-[#002D62] font-semibold">Booking Now: ₹9,000</p>
                                  <span className="text-[10px] bg-[#D4AF37]/20 text-[#002D62] px-2 py-0.5 rounded-md font-bold w-fit">Value: ₹2,45,000</span>
                              </button>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* EXCLUSIVE BENEFITS AREA */}
                      <div className="bg-[#002D62]/5 border border-[#002D62]/10 rounded-2xl p-6">
                        <h4 className="font-bold text-[#002D62] mb-3 text-lg leading-snug">
                          {clientType === 'startup' 
                            ? (selectedSize === 9 ? 'Startup POD PRO Benefits' : 'Startup POD Benefits') 
                            : benefits[clientType].desc}
                        </h4>
                        <ul className="space-y-3 mt-4">
                          {clientType === 'startup' && selectedSize === 9 ? (
                            <>
                              <li className="flex gap-3 text-sm text-gray-700">
                                 <Check size={18} className="text-[#002D62] shrink-0 mt-0.5 font-bold" /> <span className="leading-tight">2 VIP Passes (Value ₹35,000)</span>
                              </li>
                              <li className="flex gap-3 text-sm text-gray-700">
                                 <Check size={18} className="text-[#002D62] shrink-0 mt-0.5 font-bold" /> <span className="leading-tight">4 Delegate Passes (Value ₹30,000)</span>
                              </li>
                              <li className="flex gap-3 text-sm text-gray-700">
                                 <Check size={18} className="text-[#002D62] shrink-0 mt-0.5 font-bold" /> <span className="leading-tight">Premium 3x3 Space with full tech support</span>
                              </li>
                            </>
                          ) : benefits[clientType].features.map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-700">
                               <Check size={18} className="text-[#002D62] shrink-0 mt-0.5 font-bold" /> <span className="leading-tight">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {benefits[clientType].passes && (
                        <div className="mt-6 inline-block bg-white text-[#002D62] text-xs font-bold px-4 py-3 rounded-lg border border-[#002D62]/10 shadow-sm">
                           <span className="text-gray-500 uppercase tracking-widest text-[10px] block mb-1">Complimentary Passes Included</span>
                           {selectedPassText || benefits[clientType].passes}
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

                {/* FIXED BOTTOM SUMMARY STRIP (Flex-none) */}
                <div className="flex-none bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] z-20">
                   <div className="max-w-2xl mx-auto w-full p-4 md:px-8 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div className="w-full sm:w-auto flex justify-between sm:block">
                        <div className="flex flex-col">
                          <p className="text-[10px] text-[#D4AF37] font-extrabold uppercase tracking-widest mb-0.5">{vals.bookingLabel || (vals.isFull ? 'Package Amount (100%)' : 'Booking Amount (10%)')}</p>
                          <div className="flex items-end gap-2">
                            <div className="text-4xl font-black text-[#002D62] tracking-tighter">
                              {vals.currency}{vals.payable.toLocaleString('en-IN')}
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold translate-y-[-8px] uppercase">{vals.tagLabel || (vals.isFull ? 'Full' : 'Token')}</span>
                          </div>
                          
                          <div className="mt-2 pt-2 border-t border-gray-100">
                             <div className="flex items-center gap-1.5">
                               <span className="text-[10px] text-gray-400 font-bold uppercase">Total Stall Investment:</span>
                               <span className="text-[12px] font-bold text-gray-700">{vals.currency}{vals.total.toLocaleString('en-IN')}</span>
                               {vals.total >= 100000 && vals.currency === '₹' && (
                                 <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">≈ {(vals.total / 100000).toFixed(2)} Lakhs</span>
                               )}
                             </div>
                             {selectedPassText && (
                               <p className="text-[10px] text-[#002D62] font-bold mt-1">Included Passes: {selectedPassText}</p>
                             )}
                           </div>
                         </div>
                        
                        <div className="text-right sm:text-left text-xs text-gray-500 leading-tight border-l border-gray-200 pl-4 ml-4 flex flex-col justify-center gap-1">
                          <div className="flex justify-between w-40">
                             <span className="opacity-70 text-[10px] font-bold">{vals.baseLabel || (vals.isFull ? 'Package Base:' : 'Token Base:')}</span>
                             <span className="font-bold text-gray-800">{vals.currency}{(!vals.isFull ? vals.bookingToken : vals.total).toLocaleString('en-IN')}</span>
                          </div>
                          {!vals.isFull && !vals.gstIncluded && (
                            <div className="flex justify-between w-40">
                               <span className="opacity-70 text-[10px] font-bold">+18% GST:</span> 
                               <span className="font-bold text-gray-800">{vals.currency}{(vals.gst).toLocaleString('en-IN')}</span>
                            </div>
                          )}
                          {!vals.isFull && vals.gstIncluded && (
                            <div className="flex justify-between w-40">
                               <span className="opacity-70 text-[10px] font-bold">GST:</span>
                               <span className="font-bold text-gray-800">Included</span>
                            </div>
                          )}
                          {!vals.isFull && (
                            <div className="mt-1 pt-1 border-t border-gray-100 flex justify-between w-40">
                               <span className="text-red-400 font-extrabold text-[9px] uppercase">Balance:</span> 
                                <span className="font-bold text-gray-400 text-[11px]">{vals.currency}{(vals.total - (vals.bookingToken || 0)).toLocaleString('en-IN')}</span>
                             </div>
                          )}
                        </div>
                     </div>

                     <button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={`w-full sm:w-auto bg-[#D4AF37] hover:bg-[#c3a033] text-[#002D62] font-black px-10 py-4 rounded-xl shadow-lg shadow-[#D4AF37]/30 transition-transform active:scale-95 flex items-center justify-center gap-2 text-lg uppercase tracking-wide ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                     >
                       {isProcessing ? 'Processing...' : 'Pay Now'} <ArrowRight size={20} />
                     </button>
                   </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* OFFICIAL FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
                <h4>Global Leadership Summit Vision 2047</h4>
                <p className="footer-tagline">Leadership • Innovation • Vision 2047</p>
            </div> 
            <div className="footer-section">
                <h4>Quick Links</h4>
                <ul className="footer-links">
                    <li><a href="/#about">About Global Leadership Summit Vision 2047</a></li>
                    <li><a href="/#conference">Conference</a></li>
                    <li><a href="/#sponsorship">Sponsorship</a></li>
                    <li><a href="/#tickets">Register</a></li>
                </ul>
            </div>  
            <div className="footer-section" style={{textAlign: 'center'}}>
                <h4>Legal</h4>
                <ul className="footer-links">
                    <li><a href="/privacy.html">Privacy Policy</a></li>
                    <li><a href="/terms.html">Terms & Conditions</a></li>
                    <li><a href="/refund.html">Refund Policy</a></li>
                </ul>
            </div>  
            <div className="footer-section">
                <h4 style={{textAlign: 'center'}}>Organised By</h4>
                 <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'}}>
                   <div style={{width: '120px'}}>
                     <img src="/images/molog-logo.png" style={{width: '100%'}} alt="MOLOG" />
                   </div>
                 </div>
            </div>
          </div>
          <div className="footer-section">
            <div className="social-links">
              <a href="https://www.facebook.com/glsvision2047/" target="_blank" aria-label="Facebook"><i className="fab fa-facebook-f"></i> Facebook</a>
              <a href="https://www.linkedin.com/company/glsvision2047/" target="_blank" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i> LinkedIn</a>
              <a href="https://x.com/glsvision2047" target="_blank" aria-label="Twitter"><i className="fab fa-twitter"></i> Twitter</a>
              <a href="/exhibition/" aria-label="Shop"><i className="fas fa-shopping-cart"></i> Shop</a>
              <a href="/exhibition/" aria-label="Exhibition"><i className="fas fa-store"></i> Exhibition</a>
              <a href="https://www.instagram.com/glsvision2047/" target="_blank" aria-label="Instagram"><i className="fab fa-instagram"></i> Instagram</a>
            </div>
          </div>
          <div className="footer-bottom">
              <p>&copy; Global Leadership Summit Vision 2047. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
