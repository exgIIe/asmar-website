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
  { text: "Świetna robota! Parkiet był wyjątkowo zaniedbany. Teraz jest jak nowy.", author: "Dominik Salus", city: "Kraków" },
  { text: "Godni polecenia! Robota dobrze wykonana. Polecam", author: "Magdalena Wójciakul", city: "Kraków" },
  { text: "Pełen profesjonalizm. Terminowo i rzetelnie. Polecam każdemu.", author: "Tomasz J.", city: "Wieliczka" }
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
    setAnimating(true);
    const currentArrayLength = productsData[activeCategory].length;
    setCurrentWoodIdx((prev) => (prev + dir + currentArrayLength) % currentArrayLength);
    setTimeout(() => setAnimating(false), 300);
  };

  const handleCategoryChange = (catId: keyof typeof productsData) => {
    if (catId === activeCategory) return;
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
    setCart(prev => {
      if (prev.find(item => item.id === genericId)) return prev.map(item => item.id === genericId ? { ...item, area } : item);
      return [...prev, { id: genericId, name: `Wycena: ${materialType}`, img: imgToUse, category: materialType, area }];
    });
    setIsCartOpen(true);
  };

  const updateCartItemArea = (id: number, newArea: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, area: newArea } : item));
  const removeCartItem = (id: number) => setCart(prev => prev.filter(item => item.id !== id));

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus('loading');
    setTimeout(() => { setOrderStatus('success'); setCart([]); setPhoneInput(''); }, 1500);
  };

  return (
    <main className="relative min-h-screen font-sans text-slate-900 overflow-x-hidden wood-grain-bg">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,500;1,600&family=Montserrat:wght@400;600;700;900&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        .font-script { font-family: 'Playfair Display', serif; font-style: italic; }
        
        /* TŁO: PŁYNNE SŁOJE DREWNA */
        .wood-grain-bg {
          background-color: #FcfAf5;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005 0.1' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0.95 0 1 0 0 0.9 0 0 1 0 0.85 0 0 0 0.15 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-attachment: fixed;
        }

        @keyframes liquidSwap {
          0% { filter: blur(0px); opacity: 1; transform: scale(1); }
          50% { filter: blur(8px); opacity: 0.7; transform: scale(0.97); }
          100% { filter: blur(0px); opacity: 1; transform: scale(1); }
        }
        .animate-liquid { animation: liquidSwap 0.4s ease-in-out forwards; }
        
        @keyframes floatSlow {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2%, 3%) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .blob-1 {
          position: absolute; top: -10%; left: -10%; width: 60vw; height: 60vw;
          background: radial-gradient(circle, rgba(217,119,6,0.08) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%; filter: blur(40px); animation: floatSlow 20s infinite ease-in-out alternate; pointer-events: none;
        }
        .blob-2 {
          position: absolute; bottom: 10%; right: -10%; width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(146,64,14,0.05) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%; filter: blur(40px); animation: floatSlow 15s infinite ease-in-out alternate-reverse; pointer-events: none;
        }
      `}</style>

      {/* Animowane bloby tła */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      {/* Nawigacja - POPRAWIONY Z-INDEX Z z-40 NA z-[100] */}
      <nav className={`fixed w-full top-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => scrollToSection('hero')}>
            <Image src="/logo.png" alt="ASMAR" width={300} height={150} className="h-24 md:h-40 w-auto object-contain transition-transform hover:scale-105" />
          </div>
          <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.2em] font-bold text-slate-600 font-montserrat">
             <button onClick={() => scrollToSection('o-nas')} className="hover:text-amber-700 transition">O nas</button>
             <button onClick={() => scrollToSection('oferta')} className="hover:text-amber-700 transition">Oferta</button>
             <button onClick={() => scrollToSection('wycena')} className="hover:text-amber-700 transition">Wycena</button>
             <button onClick={() => scrollToSection('opinie')} className="hover:text-amber-700 transition">Opinie</button>
             <button onClick={() => scrollToSection('kontakt')} className="hover:text-amber-700 transition">Kontakt</button>
          </div>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-amber-900 hover:text-amber-700 transition">
            <ShoppingCart size={28} />
            {cart.length > 0 && <span className="absolute top-0 right-0 bg-amber-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-md">{cart.length}</span>}
          </button>
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
                    <div className="flex items-center gap-2 mt-2"><input type="number" value={item.area} onChange={(e) => updateCartItemArea(item.id, Number(e.target.value))} className="w-16 border rounded p-1 text-center text-xs outline-none focus:border-amber-500" /><span>m²</span></div>
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
                <button type="submit" className="w-full bg-amber-600 text-white font-bold rounded-xl py-5 text-xs uppercase tracking-widest shadow-lg">Poproś o darmową wycenę</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <section id="hero" className="relative z-10 pt-56 md:pt-72 pb-20 text-center px-6">
        <p className="text-[10px] tracking-[0.4em] uppercase text-amber-800 font-bold mb-6 font-montserrat">Kraków • Bieżanowska 252a</p>
        <h1 className="text-5xl md:text-8xl font-montserrat font-bold leading-tight mb-16 text-slate-800 tracking-wider">
          STUDIO PODŁÓG <br /> 
          <span className="font-script text-5xl md:text-8xl text-amber-900 mt-2 block lowercase tracking-normal">Asmar podłoga z duszą</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id as keyof typeof productsData)} className={`px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${activeCategory === cat.id ? 'bg-amber-800 text-white shadow-xl scale-105' : 'bg-white/70 text-slate-600 hover:bg-white border border-transparent hover:border-amber-200'}`}>{cat.label}</button>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto flex items-center justify-center gap-4 h-[400px] md:h-[500px]">
          <button onClick={() => changeWood(-1)} className="p-5 rounded-full bg-white/60 backdrop-blur shadow-xl text-amber-900 hover:bg-white hover:scale-110 transition-all z-20"><ChevronLeft size={32} /></button>
          <div className="relative w-80 md:w-[500px] h-full flex items-center justify-center z-10">
            <Image src={currentProduct.img} alt={currentProduct.name} width={600} height={600} priority className={`relative z-10 w-full h-auto object-contain drop-shadow-2xl ${animating ? 'animate-liquid' : ''}`} />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-black/15 blur-[30px] rounded-[100%]" />
          </div>
          <button onClick={() => changeWood(1)} className="p-5 rounded-full bg-white/60 backdrop-blur shadow-xl text-amber-900 hover:bg-white hover:scale-110 transition-all z-20"><ChevronRight size={32} /></button>
        </div>
        
        <div className="mt-16 flex flex-col items-center">
           <h3 className="text-4xl font-script text-slate-800 mb-10 drop-shadow-sm">{currentProduct.name}</h3>
           <button onClick={addToQuote} className="bg-amber-900 text-white font-bold text-xs uppercase tracking-[0.2em] px-12 py-6 rounded-full hover:bg-amber-800 transition-all shadow-2xl shadow-amber-900/30 flex items-center gap-4 group">
             <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" /> Dodaj do wyceny
           </button>
        </div>
      </section>

      {/* O Nas - POWRÓT ZLECEŃ */}
      <section id="o-nas" className="relative z-10 py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-24"><h2 className="text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">O nas</h2><p className="text-3xl font-script text-amber-700">Rzemiosło przekazywane przez lata</p></div>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
           <div className="space-y-6 text-slate-600 leading-relaxed font-light text-xl">
              <p>Rzetelnie wykonywane usługi w zakresie montażu i cyklinowania od niemal 3 dekad. Nasza specjalność to nie tylko montaż, ale wydobywanie naturalnego, unikalnego piękna z każdego kawałka drewna.</p>
           </div>
           <div className="grid grid-cols-2 gap-4 md:gap-8">
              <div className="bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center shadow-xl border border-white">
                 <p className="text-5xl md:text-7xl font-montserrat font-bold text-amber-600 mb-2">29</p>
                 <p className="text-[10px] md:text-xs uppercase tracking-widest text-slate-500 font-bold font-montserrat">Lat doświadczenia</p>
              </div>
              <div className="bg-white/60 backdrop-blur-md p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center shadow-xl border border-white mt-8 md:mt-12">
                 <p className="text-5xl md:text-7xl font-montserrat font-bold text-amber-600 mb-2">10k+</p>
                 <p className="text-[10px] md:text-xs uppercase tracking-widest text-slate-500 font-bold font-montserrat">Zrealizowanych m²</p>
              </div>
           </div>
        </div>
      </section>

      {/* Oferta */}
      <section id="oferta" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20"><h2 className="text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">Nasza Oferta</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {offerData.map((item, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-[3rem] shadow-xl overflow-hidden border border-white group transition-all hover:shadow-2xl">
              <div className="h-[400px] relative">
                <Image src={item.images[offerIndices[i]]} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                  <button onClick={() => changeOfferImage(i, -1)} className="p-3 rounded-full bg-white/90 shadow-lg hover:bg-amber-50"><ChevronLeft size={24} className="text-amber-900" /></button>
                  <button onClick={() => changeOfferImage(i, 1)} className="p-3 rounded-full bg-white/90 shadow-lg hover:bg-amber-50"><ChevronRight size={24} className="text-amber-900" /></button>
                </div>
              </div>
              <div className="p-10"><h4 className="text-2xl font-bold mb-2">{item.title}</h4><p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest mb-4">{item.sub}</p><p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Wycena - SMART ASSISTANT POWRACA */}
      <section id="wycena" className="relative z-10 mx-4 md:mx-6 py-24 bg-[#0f172a] rounded-[3.5rem] text-white shadow-2xl border border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16"><h2 className="text-4xl font-bold mb-4 tracking-widest uppercase">Wstępna Wycena</h2><p className="text-2xl font-script text-amber-500">Oblicz zapotrzebowanie na materiał</p></div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="flex justify-between items-end"><span className="text-[10px] uppercase font-bold opacity-60 tracking-widest">Powierzchnia</span><span className="text-6xl font-light text-amber-400 font-montserrat">{area} m²</span></div>
              <input type="range" min="10" max="500" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-amber-500" />
              <div className="flex gap-4">{['Parkiet', 'Taras'].map(t => <button key={t} onClick={() => setMaterialType(t.toLowerCase())} className={`flex-1 py-5 rounded-2xl border transition-all text-xs font-bold tracking-widest uppercase ${materialType === t.toLowerCase() ? 'bg-amber-600 border-amber-600 shadow-xl shadow-amber-900/40' : 'border-slate-700 opacity-40 hover:opacity-100'}`}>{t}</button>)}</div>
            </div>
            
            <div className="p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 bg-amber-600 text-white px-5 py-2 text-[9px] font-bold tracking-widest uppercase rounded-bl-[2rem] flex items-center gap-2">
                <Sparkles size={12} /> Smart Assistant
              </div>
              <ShieldCheck className="text-amber-500 mx-auto mb-6 mt-4" size={40} />
              <p className="text-slate-300 text-base md:text-lg mb-10 leading-relaxed">
                Dla wpisanej powierzchni {area} m², asystent Asmar Expert sugeruje zakup ok. <span className="text-white font-bold text-xl">{Math.round(area * 1.1)} m²</span> materiału. Pamiętaj o doliczeniu 10% zapasu na tzw. ścinki montażowe.
              </p>
              <button onClick={addFromCalculatorToQuote} className="w-full py-5 bg-amber-600 hover:bg-amber-500 transition-colors text-white rounded-2xl font-bold shadow-xl tracking-widest text-sm uppercase">
                POPROŚ O WYCENĘ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Opinie */}
      <section id="opinie" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20"><h2 className="text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">Opinie</h2></div>
        <div className="grid md:grid-cols-3 gap-10">
           {reviews.map((review, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm border border-white p-12 rounded-[3rem] shadow-xl relative mt-6">
                 <div className="absolute -top-6 left-10 bg-amber-600 w-14 h-14 flex items-center justify-center rounded-full shadow-lg text-white">
                    <Quote size={24} fill="currentColor" />
                 </div>
                 <div className="flex gap-1 mb-6 text-amber-400 mt-2">
                   <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                 </div>
                 <p className="text-slate-700 text-base italic leading-relaxed mb-8">"{review.text}"</p>
                 <p className="text-xs uppercase font-bold text-slate-800 tracking-widest">{review.author}</p>
                 <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{review.city}</p>
              </div>
           ))}
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <a href="tel:513724860" className="bg-white/60 backdrop-blur-md p-12 rounded-[3rem] shadow-xl border border-white flex flex-col items-center text-center transition-all hover:-translate-y-2 group">
            <div className="w-20 h-20 bg-white shadow-md rounded-[2rem] flex items-center justify-center mb-6 text-amber-900 group-hover:bg-amber-900 group-hover:text-white transition-colors"><Phone size={32} /></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Zadzwoń</p>
            <p className="text-2xl font-bold font-montserrat">513 724 860</p>
          </a>
          <a href="mailto:biuro@studioasmar.pl" className="bg-white/60 backdrop-blur-md p-12 rounded-[3rem] shadow-xl border border-white flex flex-col items-center text-center transition-all hover:-translate-y-2 group">
            <div className="w-20 h-20 bg-white shadow-md rounded-[2rem] flex items-center justify-center mb-6 text-amber-900 group-hover:bg-amber-900 group-hover:text-white transition-colors"><Mail size={32} /></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Napisz do nas</p>
            <p className="text-lg font-bold font-montserrat">biuro@studioasmar.pl</p>
          </a>
          <div className="bg-white/60 backdrop-blur-md p-12 rounded-[3rem] shadow-xl border border-white flex flex-col items-center text-center relative transition-all hover:-translate-y-2">
            <div className={`w-20 h-20 bg-white shadow-md rounded-[2rem] flex items-center justify-center mb-6 ${currentStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}><Clock size={32} /></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Status Studia</p>
            <p className="text-2xl font-bold mb-2 uppercase font-montserrat">{currentStatus.isOpen ? 'Zapraszamy' : 'Zamknięte'}</p>
            <button onClick={() => setShowFullHours(!showFullHours)} className="text-[10px] font-bold text-amber-700 underline tracking-widest">Dziś: {currentStatus.todayStr} <Info size={14} className="inline"/></button>
            {showFullHours && (
              <div className="absolute top-full mt-6 bg-white shadow-2xl p-8 rounded-[2rem] z-20 border w-64 animate-in fade-in">
                {Object.entries(openingHoursSchedule).map(([day, time]) => (
                  <div key={day} className="flex justify-between text-xs py-3 border-b border-slate-100 last:border-0 font-montserrat tracking-wide">
                    <span className="text-slate-500 uppercase">{day}</span><span className="font-bold text-slate-800">{time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white/60 backdrop-blur-md p-12 rounded-[3rem] shadow-xl border border-white flex flex-col items-center text-center transition-all hover:-translate-y-2 group">
            <div className="w-20 h-20 bg-white shadow-md rounded-[2rem] flex items-center justify-center mb-6 text-amber-900 group-hover:bg-amber-900 group-hover:text-white transition-colors"><MapPin size={32} /></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Odwiedź Studio</p>
            <p className="text-xl font-bold font-montserrat">Bieżanowska 252a <br/><span className="text-sm font-normal text-slate-500">Kraków</span></p>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center relative z-10 opacity-70">
        <p className="text-[10px] tracking-[0.5em] font-bold text-slate-500">© 2026 STUDIO PODŁÓG ASMAR - KRAKÓW. 29 LAT DOŚWIADCZENIA.</p>
      </footer>
    </main>
  );
}