'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone, MapPin, ChevronRight, ChevronLeft, 
  Clock, ShieldCheck, ExternalLink, Info, 
  Menu, X, Star, Quote, Mail, ShoppingCart, Trash2, CheckCircle
} from "lucide-react";

// --- DANE HERO (KATEGORIE I PRODUKTY) ---
const categories = [
  { id: 'drewno', label: 'Drewno Lite i Warstwowe' },
  { id: 'winyl', label: 'Podłogi Winylowe' },
  { id: 'kompozyt', label: 'Tarasy Kompozytowe' }
];

const productsData = {
  drewno: [
    { id: 1, name: "Dąb Palenica", img: "/1.png" },
    { id: 2, name: "Dąb Śnieżka", img: "/2.png" },
    { id: 3, name: "Dąb Śniardwy", img: "/3.png" },
  ],
  winyl: [
    { id: 4, name: "Dąb Klasyczny (Winyl SPC)", img: "/1.png" },
    { id: 5, name: "Beton Architektoniczny", img: "/2.png" },
  ],
  kompozyt: [
    { id: 6, name: "Deska Tarasowa Grafit", img: "/3.png" },
    { id: 7, name: "Deska Tarasowa Teak", img: "/1.png" },
  ]
};

// --- DANE OFERTY ---
const offerData = [
  { 
    title: "Podłogi Drewniane", 
    sub: "LITE I WARSTWOWE", 
    images: ["/333.png", "/image_2.png", "/image_3.png"],
    desc: "Kompleksowa obsługa: od doradztwa, przez profesjonalny montaż, aż po renowację."
  },
  { 
    title: "Tarasy", 
    sub: "KOMPOZYT I DREWNO", 
    images: ["/321.png", "/image_9.png", "/image_10.png"],
    desc: "Zadbamy o każdy detal, abyś mógł cieszyć się komfortową przestrzenią bez stresu."
  },
  { 
    title: "Renowacja", 
    sub: "CZYSZCZENIE I OLEJOWANIE", 
    images: ["/123.png", "/image_7.png", "/image_4.png"],
    desc: "Twój parkiet stracił blask? Przywrócimy mu dawną duszę i zabezpieczymy na lata."
  }
];

const reviews = [
  { text: "Świetna robota! Parkiet był wyjątkowo zaniedbany i nosił lata użytkowania. Teraz jest jak nowy.", author: "Dominik Salus", city: "Kraków" },
  { text: "Godni polecenia! Robota dobrze wykonana. Jesteśmy zadowoleni. Polecam", author: "Magdalena Wójciakul", city: "Kraków" },
  { text: "Pełen profesjonalizm od pierwszej wyceny aż po sam montaż. Terminowo, rzetelnie i z uśmiechem. Polecam każdemu.", author: "Tomasz J.", city: "Wieliczka" }
];

const openingHoursSchedule = {
  pon: "08:00 - 18:00", wt: "08:00 - 18:00", sr: "08:00 - 18:00",
  czw: "08:00 - 18:00", pt: "08:00 - 18:00", sob: "09:00 - 14:00", nd: "Zamknięte",
};

// TYPY KOSZYKA
type CartItem = {
  id: number;
  name: string;
  img: string;
  category: string;
  area: number; // m2
};

export default function Home() {
  const [area, setArea] = useState(300);
  const [materialType, setMaterialType] = useState('taras');
  
  const [activeCategory, setActiveCategory] = useState<keyof typeof productsData>('drewno');
  const [currentWoodIdx, setCurrentWoodIdx] = useState(0);
  
  const [offerIndices, setOfferIndices] = useState([0, 0, 0]);
  const [showFullHours, setShowFullHours] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({ isOpen: false, todayStr: '' });
  
  // --- STANY UI ---
  const [animating, setAnimating] = useState(false);
  const [mag, setMag] = useState({ x: 0, y: 0, bgX: 0, bgY: 0, show: false });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // --- STANY KOSZYKA I FORMULARZA ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    const now = new Date();
    const dayNames = ['nd', 'pon', 'wt', 'sr', 'czw', 'pt', 'sob'];
    const dayCode = dayNames[now.getDay()];
    const hours = openingHoursSchedule[dayCode as keyof typeof openingHoursSchedule];
    setCurrentStatus({ isOpen: hours !== "Zamknięte", todayStr: hours });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeWood = (dir: number) => {
    if (animating) return;
    setAnimating(true);
    setMag({ ...mag, show: false });
    const currentArrayLength = productsData[activeCategory].length;
    setTimeout(() => setCurrentWoodIdx((prev) => (prev + dir + currentArrayLength) % currentArrayLength), 250);
    setTimeout(() => setAnimating(false), 500);
  };

  const handleCategoryChange = (catId: keyof typeof productsData) => {
    if (catId === activeCategory || animating) return;
    setAnimating(true);
    setMag({ ...mag, show: false });
    setTimeout(() => {
      setActiveCategory(catId);
      setCurrentWoodIdx(0); 
    }, 250);
    setTimeout(() => { setAnimating(false); }, 500);
  };

  const changeOfferImage = (offerIdx: number, dir: number) => {
    const newIndices = [...offerIndices];
    const imagesCount = offerData[offerIdx].images.length;
    newIndices[offerIdx] = (newIndices[offerIdx] + dir + imagesCount) % imagesCount;
    setOfferIndices(newIndices);
  };

  const handleMagMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setMag({ x, y, bgX: (x / width) * 100, bgY: (y / height) * 100, show: true });
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- LOGIKA KOSZYKA ---
  const currentProduct = productsData[activeCategory][currentWoodIdx];

  const addToQuote = () => {
    setCart(prev => {
      const exists = prev.find(item => item.id === currentProduct.id);
      if (exists) return prev;
      return [...prev, { ...currentProduct, category: activeCategory, area: 50 }];
    });
    setIsCartOpen(true);
    setOrderStatus('idle');
  };

  const addFromCalculatorToQuote = () => {
    const genericId = materialType === 'parkiet' ? 998 : 999;
    const imgToUse = materialType === 'parkiet' ? productsData.drewno[0].img : productsData.kompozyt[0].img;
    const readableName = materialType === 'parkiet' ? 'Podłoga Drewniana' : 'Taras Kompozytowy / Drewniany';

    setCart(prev => {
      const exists = prev.find(item => item.id === genericId);
      if (exists) {
        return prev.map(item => item.id === genericId ? { ...item, area: area } : item);
      }
      return [...prev, {
        id: genericId,
        name: `Wycena: ${readableName}`,
        img: imgToUse,
        category: materialType,
        area: area
      }];
    });
    setIsCartOpen(true);
    setOrderStatus('idle');
  };

  const updateCartItemArea = (id: number, newArea: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, area: newArea } : item));
  };

  const removeCartItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length < 9) return; 
    
    setOrderStatus('loading');
    
    setTimeout(() => {
      setOrderStatus('success');
      setCart([]); 
      setPhoneInput('');
    }, 1500);
  };

  return (
    <main className="relative min-h-screen bg-[#faf8f5] font-sans text-slate-900 overflow-x-hidden">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500;1,600&family=Montserrat:wght@400;600;700;900&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .font-script { font-family: 'Playfair Display', serif; font-style: italic; }

        @keyframes liquidSwap {
          0% { filter: blur(0px) contrast(1); transform: scale(1); opacity: 1; }
          50% { filter: blur(12px) contrast(1.5) saturate(1.2); transform: scale(0.92) skewX(2deg); opacity: 0.6; }
          100% { filter: blur(0px) contrast(1); transform: scale(1); opacity: 1; }
        }
        .animate-liquid { animation: liquidSwap 0.5s ease-in-out forwards; }
        @keyframes aura1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 5%) scale(1.05); }
          66% { transform: translate(-5%, 2%) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes aura2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-5%, -5%) scale(0.95); }
          66% { transform: translate(5%, -2%) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-aura-1 { animation: aura1 15s infinite ease-in-out; }
        .animate-aura-2 { animation: aura2 20s infinite ease-in-out; }
        .bg-noise {
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04; pointer-events: none; z-index: 1;
        }
      `}</style>

      <div className="bg-noise" />
      <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-amber-200/30 blur-[120px] rounded-full animate-aura-1" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-orange-300/20 blur-[150px] rounded-full animate-aura-2" />
        <div className="absolute top-[30%] right-[20%] w-[40vw] h-[40vw] bg-yellow-600/10 blur-[100px] rounded-full animate-aura-1" style={{ animationDelay: '5s' }} />
      </div>

      <nav className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          <div className="cursor-pointer flex items-center" onClick={() => scrollToSection('hero')}>
            <img src="/logo.png" alt="ASMAR Studio Podłóg" className="h-10 md:h-14 object-contain transition-transform duration-300 hover:scale-105 drop-shadow-sm" />
          </div>
          
          <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.2em] font-bold text-slate-600 font-montserrat">
             <button onClick={() => scrollToSection('o-nas')} className="hover:text-amber-700 transition">O nas</button>
             <button onClick={() => scrollToSection('oferta')} className="hover:text-amber-700 transition">Oferta</button>
             <button onClick={() => scrollToSection('wycena')} className="hover:text-amber-700 transition">Wycena</button>
             <button onClick={() => scrollToSection('opinie')} className="hover:text-amber-700 transition">Opinie</button>
             <button onClick={() => scrollToSection('kontakt')} className="hover:text-amber-700 transition">Kontakt</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-800 hover:text-amber-700 transition"
            >
              <ShoppingCart size={26} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-amber-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="md:hidden text-slate-800 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg shadow-xl border-t border-slate-100 flex flex-col items-center py-8 gap-6 text-sm uppercase tracking-[0.2em] font-bold text-slate-700 font-montserrat">
             <button onClick={() => scrollToSection('o-nas')}>O nas</button>
             <button onClick={() => scrollToSection('oferta')}>Oferta</button>
             <button onClick={() => scrollToSection('wycena')}>Wycena</button>
             <button onClick={() => scrollToSection('opinie')}>Opinie</button>
             <button onClick={() => scrollToSection('kontakt')}>Kontakt</button>
          </div>
        )}
      </nav>

      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h3 className="font-montserrat font-bold text-xl uppercase tracking-widest text-slate-800">Wycena</h3>
            <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"><X size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {orderStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in">
                <CheckCircle size={64} className="text-green-500" />
                <h4 className="font-montserrat font-bold text-2xl text-slate-800">Poszło!</h4>
                <p className="text-slate-500 text-sm font-montserrat">Otrzymaliśmy Twoje zapytanie. Skontaktujemy się z Tobą na podany numer, aby omówić szczegóły i przedstawić najlepszą ofertę.</p>
                <button onClick={() => {setIsCartOpen(false); setOrderStatus('idle');}} className="mt-6 px-8 py-3 bg-amber-600 text-white font-montserrat font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-amber-700 transition">Wróć na stronę</button>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                <ShoppingCart size={48} className="text-slate-300" />
                <p className="font-montserrat font-bold text-sm tracking-widest uppercase">Koszyk jest pusty</p>
                <p className="text-xs text-slate-400 font-montserrat">Wybierz materiał i poproś o wycenę.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl relative group border border-slate-100 shadow-sm">
                    <img src={item.img} className="w-16 h-16 object-contain mix-blend-multiply bg-white rounded-xl p-1" />
                    <div className="flex-1">
                      <p className="font-montserrat font-bold text-sm text-slate-800 leading-tight pr-4">{item.name}</p>
                      <p className="text-[10px] text-amber-600 uppercase tracking-widest font-bold mb-2 mt-1">{item.category}</p>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min="1" 
                          value={item.area} 
                          onChange={(e) => updateCartItemArea(item.id, Number(e.target.value))}
                          className="w-16 bg-white border border-slate-200 rounded-lg text-center text-sm p-1 font-montserrat font-bold text-slate-800 outline-none focus:border-amber-500"
                        />
                        <span className="text-xs text-slate-500 font-montserrat font-bold">m²</span>
                      </div>
                    </div>
                    <button onClick={() => removeCartItem(item.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && orderStatus !== 'success' && (
            <div className="p-6 bg-slate-50 border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 font-montserrat mb-2">Twój numer telefonu</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      placeholder="np. 500 123 456"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 font-montserrat text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={orderStatus === 'loading'}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white font-montserrat font-bold rounded-xl py-4 text-xs uppercase tracking-widest transition shadow-lg shadow-amber-900/20 flex justify-center items-center"
                >
                  {orderStatus === 'loading' ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Poproś o darmową wycenę'}
                </button>
                <p className="text-center text-[9px] text-slate-400 font-montserrat mt-2">Nasz ekspert skontaktuje się z Tobą w ciągu 24h.</p>
              </form>
            </div>
          )}
        </div>
      </div>

      <section id="hero" className="relative z-10 pt-32 md:pt-40 pb-10 text-center px-6">
        <p className="text-[10px] tracking-[0.4em] uppercase text-amber-800 font-bold mb-6 font-montserrat drop-shadow-sm">Kraków • Bieżanowska 252a</p>
        
        <h1 className="text-5xl md:text-7xl font-montserrat font-bold leading-tight mb-12 drop-shadow-sm text-slate-800 tracking-wider">
          STUDIO PODŁÓG <br /> 
          <span className="font-script text-5xl md:text-7xl text-amber-900 mt-2 block lowercase tracking-normal">Asmar podłoga z duszą</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-3 mb-8 relative z-30">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as keyof typeof productsData)}
              className={`px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 font-montserrat ${
                activeCategory === cat.id
                  ? 'bg-amber-800 text-white shadow-lg scale-105'
                  : 'bg-white/60 text-slate-600 hover:bg-white hover:text-amber-700 border border-transparent hover:border-amber-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto flex items-center justify-center gap-2 md:gap-12 h-[350px] md:h-[450px]">
          <button onClick={() => changeWood(-1)} className="z-30 p-3 md:p-4 rounded-full bg-white/60 backdrop-blur shadow-xl hover:scale-110 hover:bg-white transition-all text-amber-900"><ChevronLeft size={32} /></button>
          <div 
            className="relative w-64 md:w-80 h-full flex items-center justify-center cursor-crosshair"
            onMouseMove={handleMagMove} onMouseEnter={() => !animating && setMag({ ...mag, show: true })} onMouseLeave={() => setMag({ ...mag, show: false })}
          >
            <img src={currentProduct.img} alt={currentProduct.name} className={`relative z-10 w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)] ${animating ? 'animate-liquid' : ''}`} />
            {/* CIEŃ POD DESKĄ */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-[20px] rounded-[100%] pointer-events-none" />
            
            {mag.show && !animating && (
              <div 
                className="hidden md:block absolute pointer-events-none rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.4)] border-2 border-white/50 bg-white/10 backdrop-blur-sm z-50 overflow-hidden"
                style={{ width: '180px', height: '180px', left: mag.x, top: mag.y, transform: 'translate(-50%, -50%)' }}
              >
                <div className="w-full h-full" style={{ backgroundImage: `url(${currentProduct.img})`, backgroundPosition: `${mag.bgX}% ${mag.bgY}%`, backgroundSize: '300%', backgroundRepeat: 'no-repeat' }} />
              </div>
            )}
          </div>
          <button onClick={() => changeWood(1)} className="z-30 p-3 md:p-4 rounded-full bg-white/60 backdrop-blur shadow-xl hover:scale-110 hover:bg-white transition-all text-amber-900"><ChevronRight size={32} /></button>
        </div>
        
        <div className="mt-8 md:mt-12 flex flex-col items-center">
           <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-montserrat">Aktualnie wyświetlany</p>
           <h3 className="text-3xl font-script text-slate-800 drop-shadow-sm mt-2 mb-6">{currentProduct.name}</h3>
           
           <button 
             onClick={addToQuote}
             className="relative overflow-hidden group bg-amber-900 text-white font-montserrat font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-amber-800 transition-all shadow-xl shadow-amber-900/30 flex items-center gap-3"
           >
             <ShoppingCart size={16} className="group-hover:scale-110 transition-transform" />
             Dodaj do wyceny
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
           </button>
        </div>
      </section>

      <section id="o-nas" className="relative z-10 py-24 md:py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
           <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">O nas</h2>
           <p className="text-3xl font-script text-amber-700">Rzemiosło przekazywane przez lata</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
           <div className="space-y-6 text-slate-600 leading-relaxed font-light text-lg">
              <p>Rzetelnie wykonywane usługi w zakresie montażu i cyklinowania od niemal 3 dekad. Nasza specjalność to nie tylko montaż, ale wydobywanie naturalnego, unikalnego piękna z każdego kawałka drewna.</p>
              <p>Specjalizujemy się w kompleksowej obsłudze podłóg z drewna litego i warstwowego oraz winylowych – od doradztwa, przez montaż, aż po renowację. Zadbamy o każdy detal, abyś mógł cieszyć się komfortową przestrzenią bez zbędnego stresu.</p>
           </div>
           <div className="grid grid-cols-2 gap-4 md:gap-8">
              <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] text-center shadow-xl border border-white">
                 <p className="text-5xl md:text-6xl font-montserrat font-bold text-amber-600 mb-2">29</p>
                 <p className="text-[10px] md:text-xs uppercase tracking-widest text-slate-500 font-bold font-montserrat">Lat doświadczenia</p>
              </div>
              <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2rem] text-center shadow-xl border border-white mt-8 md:mt-12">
                 <p className="text-5xl md:text-6xl font-montserrat font-bold text-amber-600 mb-2">10k+</p>
                 <p className="text-[10px] md:text-xs uppercase tracking-widest text-slate-500 font-bold font-montserrat">Zrealizowanych m²</p>
              </div>
           </div>
        </div>
      </section>

      <section id="oferta" className="relative z-10 py-16 md:py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
           <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">Zakres usług</h2>
           <p className="text-3xl font-script text-amber-700">Naszej firmy</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {offerData.map((item, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-lg rounded-[2.5rem] shadow-lg overflow-hidden border border-white group transition-all hover:shadow-2xl">
              <div className="h-[300px] md:h-[400px] relative overflow-hidden">
                <img src={item.images[offerIndices[i]]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                  <button onClick={() => changeOfferImage(i, -1)} className="p-2 md:p-3 rounded-full bg-white/90 shadow-xl hover:bg-amber-50"><ChevronLeft size={24} className="text-amber-900" /></button>
                  <button onClick={() => changeOfferImage(i, 1)} className="p-2 md:p-3 rounded-full bg-white/90 shadow-xl hover:bg-amber-50"><ChevronRight size={24} className="text-amber-900" /></button>
                </div>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {item.images.map((_, dotIdx) => (
                    <div key={dotIdx} className={`w-1.5 h-1.5 rounded-full transition-all ${dotIdx === offerIndices[i] ? 'bg-amber-600 w-4 shadow-[0_0_10px_rgba(217,119,6,0.8)]' : 'bg-white/70'}`} />
                  ))}
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col h-full">
                <h4 className="text-xl md:text-2xl font-montserrat font-bold mb-1">{item.title}</h4>
                <p className="text-[10px] tracking-[0.2em] text-amber-700 font-bold uppercase font-montserrat mb-4">{item.sub}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="wycena" className="relative z-10 mx-4 md:mx-6 py-16 md:py-24 bg-[#0f172a] rounded-[2rem] md:rounded-[3.5rem] text-white overflow-hidden shadow-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-amber-50 mb-4 tracking-widest uppercase">Wstępna Wycena</h2>
            <p className="text-3xl font-script text-amber-500 opacity-90">Oblicz zapotrzebowanie na materiał</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-8 md:space-y-12">
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60 font-montserrat">Powierzchnia</span>
                <span className="text-5xl md:text-6xl font-light text-amber-400 font-montserrat">{area} m²</span>
              </div>
              <input type="range" min="10" max="1000" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full h-1 bg-slate-700 appearance-none cursor-pointer accent-amber-500" />
              <div className="flex gap-4">
                {['Parkiet', 'Taras'].map(t => (
                  <button key={t} onClick={() => setMaterialType(t.toLowerCase())} className={`flex-1 py-4 rounded-xl md:rounded-2xl border transition-all text-[10px] uppercase font-bold tracking-widest font-montserrat ${materialType === t.toLowerCase() ? 'bg-amber-600 border-amber-600 shadow-lg shadow-amber-900/40' : 'border-slate-700 opacity-40 hover:opacity-100'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="p-8 md:p-10 bg-white/5 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6"><ShieldCheck className="text-amber-500" size={24} /><span className="text-[10px] font-bold tracking-widest font-montserrat">PROFIL ASMAR EXPERT</span></div>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">Dla {area} m² sugerujemy zakup ok. <span className="text-white font-bold">{Math.round(area * 1.1)} m²</span> materiału.</p>
              
              <button 
                onClick={addFromCalculatorToQuote} 
                className="block w-full py-4 md:py-5 bg-amber-600 hover:bg-amber-500 text-center text-white rounded-xl md:rounded-2xl font-bold transition-all shadow-xl text-sm tracking-widest font-montserrat uppercase"
              >
                ZAPYTAJ O WYCENĘ
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="opinie" className="relative z-10 py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
           <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">Opinie</h2>
           <p className="text-3xl font-script text-amber-700">Co mówią o naszych podłogach</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
           {reviews.map((review, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-md border border-white p-10 rounded-[2.5rem] shadow-xl relative mt-4">
                 <div className="absolute -top-6 left-8 bg-amber-600 w-12 h-12 flex items-center justify-center rounded-full shadow-lg text-white">
                    <Quote size={20} fill="currentColor" />
                 </div>
                 <div className="flex gap-1 mb-6 text-amber-400 mt-2">
                   <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                 </div>
                 <p className="text-slate-700 font-normal text-sm md:text-base leading-relaxed mb-8 italic">"{review.text}"</p>
                 <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-slate-800 font-montserrat">{review.author}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-montserrat">{review.city}</p>
                 </div>
              </div>
           ))}
        </div>
      </section>

      <section id="kontakt" className="relative z-10 py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mb-20 md:mb-28">
          
          <a href="tel:513724860" className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl flex flex-col items-center group text-center transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-900 group-hover:text-white transition-all duration-500"><Phone size={24} /></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold font-montserrat">Zadzwoń</p>
            <p className="text-xl md:text-2xl font-montserrat font-bold text-slate-800 group-hover:text-amber-700 transition-colors">513 724 860</p>
          </a>

          <a href="mailto:biuro@studioasmar.pl" className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl flex flex-col items-center group text-center transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-900 group-hover:text-white transition-all duration-500"><Mail size={24} /></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold font-montserrat">Napisz do nas</p>
            <p className="text-lg md:text-xl font-montserrat font-bold text-slate-800 group-hover:text-amber-700 transition-colors">biuro@studioasmar.pl</p>
          </a>

          <a href="https://www.google.com/maps/dir//Bieżanowska+252a,+30-890+Kraków" target="_blank" className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl flex flex-col items-center group text-center transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-900 group-hover:text-white transition-all duration-500"><MapPin size={24} /></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold font-montserrat">Odwiedź Studio</p>
            <p className="text-lg md:text-xl font-montserrat font-bold text-slate-800 group-hover:text-amber-700 transition-colors px-2">Bieżanowska 252a<br/><span className="text-sm font-normal text-slate-500">Kraków 30-856</span></p>
          </a>

          <div className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-lg flex flex-col items-center text-center relative transition-all duration-300 hover:-translate-y-2">
            <div className={`w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${currentStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}><Clock size={24} /></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold font-montserrat">Status Studia</p>
            <p className={`text-xl md:text-2xl font-montserrat font-bold mb-2 ${currentStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}>{currentStatus.isOpen ? 'ZAPRASZAMY' : 'ZAMKNIĘTE'}</p>
            <button onClick={() => setShowFullHours(!showFullHours)} className="text-[10px] font-bold text-amber-700 underline flex items-center gap-2 font-montserrat">Dziś: {currentStatus.todayStr} <Info size={14}/></button>
            {showFullHours && (
              <div className="absolute top-full mt-6 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] z-50 border border-slate-100 w-56 animate-in fade-in slide-in-from-top-3">
                {Object.entries(openingHoursSchedule).map(([day, time]) => (
                  <div key={day} className="flex justify-between text-xs py-2 border-b border-slate-50 last:border-0 font-medium capitalize font-montserrat">
                    <span className="text-slate-500">{day}</span><span className="text-slate-900 font-bold">{time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative group rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl h-[400px] md:h-[550px] border-4 md:border-8 border-white/50 backdrop-blur-sm">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!4v1778676245484!6m8!1m7!1sbsX9IyuQeWmeRcoLvJS92g!2m2!1d50.01809349115207!2d20.03236815723983!3f186.13483552407584!4f0.6188113948697094!5f1.0920404109287976"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
            className="grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
          ></iframe>
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all duration-700 flex items-center justify-center pointer-events-none">
            <div className="bg-white/95 backdrop-blur-xl px-8 md:px-10 py-4 md:py-5 rounded-full flex items-center gap-3 md:gap-4 shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
              <ExternalLink size={20} className="text-amber-900"/><span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-900 font-montserrat">Wirtualny Spacer</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 md:py-20 border-t border-slate-200/50 text-center relative z-10 bg-transparent">
        <p className="text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] text-slate-500 uppercase font-bold italic px-4 font-montserrat">© 2026 STUDIO PODŁÓG ASMAR - KRAKÓW. 29 LAT DOŚWIADCZENIA.</p>
      </footer>
    </main>
  );
}