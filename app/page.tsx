'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Phone, MapPin, ChevronRight, ChevronLeft, 
  Clock, ShieldCheck, Info, Sparkles,
  Menu, X, Star, Quote, Mail, ShoppingCart, Trash2, CheckCircle
} from "lucide-react";

// --- DANE HERO ---
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

type CartItem = {
  id: number;
  name: string;
  img: string;
  category: string;
  area: number; 
};

export default function Home() {
  const [area, setArea] = useState(300);
  const [materialType, setMaterialType] = useState('taras');
  const [activeCategory, setActiveCategory] = useState<keyof typeof productsData>('drewno');
  const [currentWoodIdx, setCurrentWoodIdx] = useState(0);
  const [offerIndices, setOfferIndices] = useState([0, 0, 0]);
  const [showFullHours, setShowFullHours] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({ isOpen: false, todayStr: '' });
  const [animating, setAnimating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeWood = (dir: number) => {
    if (animating) return;
    setAnimating(true);
    const currentArrayLength = productsData[activeCategory].length;
    setCurrentWoodIdx((prev) => (prev + dir + currentArrayLength) % currentArrayLength);
    setTimeout(() => setAnimating(false), 300);
  };

  const handleCategoryChange = (catId: keyof typeof productsData) => {
    if (catId === activeCategory || animating) return;
    setAnimating(true);
    setActiveCategory(catId);
    setCurrentWoodIdx(0); 
    setTimeout(() => setAnimating(false), 300);
  };

  const changeOfferImage = (offerIdx: number, dir: number) => {
    const newIndices = [...offerIndices];
    const imagesCount = offerData[offerIdx].images.length;
    newIndices[offerIdx] = (newIndices[offerIdx] + dir + imagesCount) % imagesCount;
    setOfferIndices(newIndices);
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const currentProduct = productsData[activeCategory][currentWoodIdx];

  const addToQuote = () => {
    setCart(prev => {
      if (prev.find(item => item.id === currentProduct.id)) return prev;
      return [...prev, { ...currentProduct, category: activeCategory, area: 50 }];
    });
    setIsCartOpen(true);
  };

  const addFromCalculatorToQuote = () => {
    const genericId = materialType === 'parkiet' ? 998 : 999;
    const imgToUse = materialType === 'parkiet' ? productsData.drewno[0].img : productsData.kompozyt[0].img;
    const readableName = materialType === 'parkiet' ? 'Podłoga Drewniana' : 'Taras Kompozytowy / Drewniany';
    
    setCart(prev => {
      if (prev.find(item => item.id === genericId)) {
        return prev.map(item => item.id === genericId ? { ...item, area } : item);
      }
      return [...prev, { id: genericId, name: `Wycena: ${readableName}`, img: imgToUse, category: materialType, area }];
    });
    setIsCartOpen(true);
  };

  const updateCartItemArea = (id: number, newArea: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, area: newArea } : item));
  const removeCartItem = (id: number) => setCart(prev => prev.filter(item => item.id !== id));

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length < 9) return;
    setOrderStatus('loading');
    setTimeout(() => { setOrderStatus('success'); setCart([]); setPhoneInput(''); }, 1500);
  };

  return (
    <main className="relative min-h-screen font-sans text-slate-900 overflow-x-hidden bg-[#faf8f5]">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500;1,600&family=Montserrat:wght@400;600;700;900&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .font-script { font-family: 'Playfair Display', serif; font-style: italic; }
        
        .bg-noise {
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04; pointer-events: none; z-index: 1;
        }

        /* OPTYMALIZACJA: Usunięto blur z animacji, zostało tylko skalowanie i krycie */
        @keyframes liquidSwap {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-liquid { animation: liquidSwap 0.3s ease-in-out forwards; }

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
      `}</style>

      {/* OPTYMALIZACJA: Tło i aury ukryte na telefonach (hidden md:block) - GIGANTYCZNY SKOK WYDAJNOŚCI */}
      <div className="hidden md:block bg-noise" />
      <div className="hidden md:block fixed inset-0 pointer-events-none z-[0] overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-amber-200/30 blur-[120px] rounded-full animate-aura-1" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-orange-300/20 blur-[150px] rounded-full animate-aura-2" />
      </div>

      {/* Nawigacja */}
      <nav className={`fixed w-full top-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => scrollToSection('hero')}>
            <Image src="/logo.png" alt="ASMAR" width={300} height={150} className="h-16 md:h-24 w-auto object-contain transition-transform hover:scale-105" />
          </div>
          <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.2em] font-bold text-slate-600 font-montserrat z-50">
             <button onClick={() => scrollToSection('o-nas')} className="hover:text-amber-700 transition">O nas</button>
             <button onClick={() => scrollToSection('oferta')} className="hover:text-amber-700 transition">Oferta</button>
             <button onClick={() => scrollToSection('wycena')} className="hover:text-amber-700 transition">Wycena</button>
             <button onClick={() => scrollToSection('opinie')} className="hover:text-amber-700 transition">Opinie</button>
             <button onClick={() => scrollToSection('kontakt')} className="hover:text-amber-700 transition">Kontakt</button>
          </div>
          <div className="flex items-center gap-4 z-50">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-800 hover:text-amber-700 transition">
              <ShoppingCart size={26} />
              {cart.length > 0 && <span className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">{cart.length}</span>}
            </button>
            <button className="md:hidden text-slate-800 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Koszyk */}
      <div className={`fixed inset-0 z-[110] transition-all ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-6 border-b flex justify-between items-center"><h3 className="font-montserrat font-bold text-xl uppercase tracking-widest">Twoja Wycena</h3><button onClick={() => setIsCartOpen(false)}><X size={24} /></button></div>
          <div className="flex-1 overflow-y-auto p-6">
            {orderStatus === 'success' ? <div className="text-center py-20"><CheckCircle size={64} className="text-green-500 mx-auto mb-4" /><h4 className="text-2xl font-bold">Poszło!</h4><p className="text-slate-500">Zadzwonimy do Ciebie.</p></div> : cart.length === 0 ? <p className="text-center opacity-50 mt-20 uppercase font-bold tracking-widest">Koszyk jest pusty</p> : 
              cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl mb-4 relative border border-slate-100">
                  <Image src={item.img} alt={item.name} width={64} height={64} className="object-contain" />
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-[9px] uppercase tracking-widest text-amber-600 font-bold mt-1">{item.category}</p>
                    <div className="flex items-center gap-2 mt-2"><input type="number" min="1" value={item.area} onChange={(e) => updateCartItemArea(item.id, Number(e.target.value))} className="w-16 border rounded p-1 text-center text-xs outline-none focus:border-amber-500" /><span>m²</span></div>
                  </div>
                  <button onClick={() => removeCartItem(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={20} /></button>
                </div>
              ))
            }
          </div>
          {cart.length > 0 && orderStatus !== 'success' && (
            <div className="p-6 bg-slate-50 border-t">
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <input type="tel" required placeholder="Twój numer telefonu" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} className="w-full border rounded-xl py-4 px-4 font-montserrat text-sm outline-none focus:border-amber-600" />
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl py-5 text-xs uppercase tracking-widest shadow-lg transition-colors">Poproś o darmową wycenę</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <section id="hero" className="relative z-10 pt-48 md:pt-56 pb-10 text-center px-6">
        <p className="text-[10px] tracking-[0.4em] uppercase text-amber-800 font-bold mb-6 font-montserrat drop-shadow-sm">Kraków • Bieżanowska 252a</p>
        <h1 className="text-5xl md:text-7xl font-montserrat font-bold leading-tight mb-12 drop-shadow-sm text-slate-800 tracking-wider">
          STUDIO PODŁÓG <br /> 
          <span className="font-script text-5xl md:text-7xl text-amber-900 mt-2 block lowercase tracking-normal">Asmar podłoga z duszą</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-3 mb-8 relative z-30">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id as keyof typeof productsData)} className={`px-6 py-2.5 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 font-montserrat ${activeCategory === cat.id ? 'bg-amber-800 text-white shadow-lg scale-105' : 'bg-white/60 text-slate-600 hover:bg-white border border-transparent hover:border-amber-200'}`}>{cat.label}</button>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto flex items-center justify-center gap-2 md:gap-12 h-[300px] md:h-[450px] pointer-events-none">
          <button onClick={() => changeWood(-1)} className="p-3 md:p-4 rounded-full bg-white/60 backdrop-blur shadow-xl text-amber-900 hover:bg-white hover:scale-110 transition-all z-20 pointer-events-auto"><ChevronLeft size={32} /></button>
          
          <div className="relative w-64 md:w-80 h-full flex items-center justify-center z-10 pointer-events-auto">
            <Image src={currentProduct.img} alt={currentProduct.name} width={500} height={500} priority className={`relative z-10 w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)] ${animating ? 'animate-liquid' : ''}`} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-[20px] rounded-[100%] pointer-events-none" />
          </div>

          <button onClick={() => changeWood(1)} className="p-3 md:p-4 rounded-full bg-white/60 backdrop-blur shadow-xl text-amber-900 hover:bg-white hover:scale-110 transition-all z-20 pointer-events-auto"><ChevronRight size={32} /></button>
        </div>
        
        <div className="mt-8 md:mt-12 flex flex-col items-center relative z-30">
           <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-montserrat">Aktualnie wyświetlany</p>
           <h3 className="text-3xl font-script text-slate-800 mb-6 drop-shadow-sm">{currentProduct.name}</h3>
           
           <button onClick={addToQuote} className="bg-amber-900 text-white font-montserrat font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-amber-800 transition-all shadow-xl shadow-amber-900/30 flex items-center gap-3 group">
             <ShoppingCart size={16} className="group-hover:scale-110 transition-transform" /> Dodaj do wyceny
           </button>
        </div>
      </section>

      {/* O Nas */}
      <section id="o-nas" className="relative z-10 py-24 md:py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-24"><h2 className="text-4xl md:text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">O nas</h2><p className="text-3xl font-script text-amber-700">Rzemiosło przekazywane przez lata</p></div>
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

      {/* Oferta */}
      <section id="oferta" className="relative z-10 py-16 md:py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20"><h2 className="text-4xl md:text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">Zakres usług</h2><p className="text-3xl font-script text-amber-700">Naszej firmy</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {offerData.map((item, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-lg rounded-[2.5rem] shadow-lg overflow-hidden border border-white group transition-all hover:shadow-2xl">
              <div className="h-[300px] md:h-[400px] relative overflow-hidden">
                <Image src={item.images[offerIndices[i]]} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                  <button onClick={() => changeOfferImage(i, -1)} className="p-2 md:p-3 rounded-full bg-white/90 shadow-xl hover:bg-amber-50"><ChevronLeft size={24} className="text-amber-900" /></button>
                  <button onClick={() => changeOfferImage(i, 1)} className="p-2 md:p-3 rounded-full bg-white/90 shadow-xl hover:bg-amber-50"><ChevronRight size={24} className="text-amber-900" /></button>
                </div>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                  {item.images.map((_, dotIdx) => (
                    <div key={dotIdx} className={`w-1.5 h-1.5 rounded-full transition-all ${dotIdx === offerIndices[i] ? 'bg-amber-600 w-4 shadow-[0_0_10px_rgba(217,119,6,0.8)]' : 'bg-white/70'}`} />
                  ))}
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col h-full"><h4 className="text-xl md:text-2xl font-montserrat font-bold mb-1">{item.title}</h4><p className="text-[10px] tracking-[0.2em] text-amber-700 font-bold uppercase font-montserrat mb-4">{item.sub}</p><p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Wycena */}
      <section id="wycena" className="relative z-10 mx-4 md:mx-6 py-16 md:py-24 bg-[#0f172a] rounded-[2rem] md:rounded-[3.5rem] text-white shadow-2xl border border-slate-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16"><h2 className="text-3xl md:text-4xl font-montserrat font-bold text-amber-50 mb-4 tracking-widest uppercase">Wstępna Wycena</h2><p className="text-3xl font-script text-amber-500 opacity-90">Oblicz zapotrzebowanie na materiał</p></div>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-8 md:space-y-12">
              <div className="flex justify-between items-end"><span className="text-[10px] uppercase font-bold tracking-widest opacity-60 font-montserrat">Powierzchnia</span><span className="text-5xl md:text-6xl font-light text-amber-400 font-montserrat">{area} m²</span></div>
              <input type="range" min="10" max="1000" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-amber-500" />
              <div className="flex gap-4">{['Parkiet', 'Taras'].map(t => <button key={t} onClick={() => setMaterialType(t.toLowerCase())} className={`flex-1 py-4 rounded-xl md:rounded-2xl border transition-all text-[10px] uppercase font-bold tracking-widest font-montserrat ${materialType === t.toLowerCase() ? 'bg-amber-600 border-amber-600 shadow-lg shadow-amber-900/40' : 'border-slate-700 opacity-40 hover:opacity-100'}`}>{t}</button>)}</div>
            </div>
            
            <div className="p-8 md:p-10 bg-white/5 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-amber-600 text-white px-4 py-2 text-[8px] md:text-[9px] font-bold tracking-widest uppercase rounded-bl-[1.5rem] md:rounded-bl-[2rem] flex items-center gap-2">
                <Sparkles size={12} /> Smart Assistant
              </div>
              <ShieldCheck className="text-amber-500 mx-auto mb-6 mt-4" size={32} />
              <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
                Dla wpisanej powierzchni {area} m², asystent Asmar Expert sugeruje zakup ok. <span className="text-white font-bold text-xl">{Math.round(area * 1.1)} m²</span> materiału. Zapas ok. 10% jest niezbędny na ścinki montażowe.
              </p>
              <button onClick={addFromCalculatorToQuote} className="w-full py-4 md:py-5 bg-amber-600 hover:bg-amber-500 transition-colors text-white rounded-xl md:rounded-2xl font-bold shadow-xl tracking-widest text-xs md:text-sm uppercase font-montserrat">
                POPROŚ O WYCENĘ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Opinie */}
      <section id="opinie" className="relative z-10 py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20"><h2 className="text-4xl md:text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">Opinie</h2><p className="text-3xl font-script text-amber-700">Co mówią o naszych podłogach</p></div>
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

      {/* Kontakt */}
      <section id="kontakt" className="relative z-10 py-20 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
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
          <div className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-lg flex flex-col items-center text-center relative transition-all duration-300 hover:-translate-y-2">
            <div className={`w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${currentStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}><Clock size={24} /></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold font-montserrat">Status Studia</p>
            <p className={`text-xl md:text-2xl font-montserrat font-bold mb-2 ${currentStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}>{currentStatus.isOpen ? 'ZAPRASZAMY' : 'ZAMKNIĘTE'}</p>
            <button onClick={() => setShowFullHours(!showFullHours)} className="text-[10px] font-bold text-amber-700 underline flex items-center gap-2 font-montserrat">Dziś: {currentStatus.todayStr} <Info size={14}/></button>
            {showFullHours && (
              <div className="absolute top-full mt-6 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] z-20 border border-slate-100 w-56 animate-in fade-in slide-in-from-top-3">
                {Object.entries(openingHoursSchedule).map(([day, time]) => (
                  <div key={day} className="flex justify-between text-xs py-2 border-b border-slate-50 last:border-0 font-medium capitalize font-montserrat">
                    <span className="text-slate-500">{day}</span><span className="text-slate-900 font-bold">{time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 text-amber-900 group-hover:bg-amber-900 group-hover:text-white transition-colors"><MapPin size={24} /></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 font-montserrat">Odwiedź Studio</p>
            <p className="text-lg md:text-xl font-montserrat font-bold text-slate-800 group-hover:text-amber-700 transition-colors px-2">Bieżanowska 252a<br/><span className="text-sm font-normal text-slate-500">Kraków</span></p>
          </div>
        </div>
      </section>

      <footer className="py-12 md:py-20 border-t border-slate-200/50 text-center relative z-10 bg-transparent">
        <p className="text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] text-slate-500 uppercase font-bold italic px-4 font-montserrat">© 2026 STUDIO PODŁÓG ASMAR - KRAKÓW. 29 LAT DOŚWIADCZENIA.</p>
      </footer>
    </main>
  );
}