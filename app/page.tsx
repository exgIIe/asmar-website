'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import komponentu do optymalizacji zdjęć
import { 
  Phone, MapPin, ChevronRight, ChevronLeft, 
  Clock, ShieldCheck, Info, 
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeWood = (dir: number) => {
    if (animating) return;
    setAnimating(true);
    const currentArrayLength = productsData[activeCategory].length;
    setTimeout(() => setCurrentWoodIdx((prev) => (prev + dir + currentArrayLength) % currentArrayLength), 250);
    setTimeout(() => setAnimating(false), 500);
  };

  const handleCategoryChange = (catId: keyof typeof productsData) => {
    if (catId === activeCategory || animating) return;
    setAnimating(true);
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

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        .bg-noise {
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04; pointer-events: none; z-index: 1;
        }
      `}</style>

      <div className="bg-noise" />

      {/* Nawigacja */}
      <nav className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="cursor-pointer flex items-center" onClick={() => scrollToSection('hero')}>
            <Image 
              src="/logo.png" 
              alt="ASMAR Studio Podłóg" 
              width={250} 
              height={100} 
              className="h-20 md:h-32 w-auto object-contain transition-transform duration-300 hover:scale-105 drop-shadow-sm" 
            />
          </div>
          <div className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.2em] font-bold text-slate-600 font-montserrat">
             <button onClick={() => scrollToSection('o-nas')} className="hover:text-amber-700 transition">O nas</button>
             <button onClick={() => scrollToSection('oferta')} className="hover:text-amber-700 transition">Oferta</button>
             <button onClick={() => scrollToSection('wycena')} className="hover:text-amber-700 transition">Wycena</button>
             <button onClick={() => scrollToSection('opinie')} className="hover:text-amber-700 transition">Opinie</button>
             <button onClick={() => scrollToSection('kontakt')} className="hover:text-amber-700 transition">Kontakt</button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-800 hover:text-amber-700 transition">
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
      </nav>

      {/* Koszyk i Formularz (Logika bez zmian, optymalizacja Image wewnątrz) */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center p-6 border-b border-slate-100">
            <h3 className="font-montserrat font-bold text-xl uppercase tracking-widest text-slate-800">Twoja Wycena</h3>
            <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {orderStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in">
                <CheckCircle size={64} className="text-green-500" />
                <h4 className="font-montserrat font-bold text-2xl text-slate-800">Poszło!</h4>
                <p className="text-slate-500 text-sm font-montserrat">Skontaktujemy się z Tobą wkrótce.</p>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-50 space-y-4">
                <ShoppingCart size={48} className="text-slate-300" />
                <p className="font-montserrat font-bold text-sm tracking-widest uppercase">Koszyk jest pusty</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl relative border border-slate-100">
                    <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden p-1">
                      <Image src={item.img} alt={item.name} width={64} height={64} className="object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="font-montserrat font-bold text-sm text-slate-800 leading-tight">{item.name}</p>
                      <input 
                        type="number" 
                        value={item.area} 
                        onChange={(e) => updateCartItemArea(item.id, Number(e.target.value))}
                        className="w-16 mt-2 bg-white border border-slate-200 rounded-lg text-center text-xs p-1"
                      />
                      <span className="ml-2 text-xs font-bold text-slate-500">m²</span>
                    </div>
                    <button onClick={() => removeCartItem(item.id)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cart.length > 0 && orderStatus !== 'success' && (
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <form onSubmit={handleSubmitQuote} className="space-y-4">
                <input 
                  type="tel" 
                  required
                  placeholder="Numer telefonu"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-montserrat text-sm outline-none focus:border-amber-500"
                />
                <button type="submit" className="w-full bg-amber-600 text-white font-montserrat font-bold rounded-xl py-4 text-xs uppercase tracking-widest">
                  Poproś o wycenę
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Sekcja Hero - Główne zdjęcia z Priority ładowaniem */}
      <section id="hero" className="relative z-10 pt-48 md:pt-64 pb-20 text-center px-6">
        <p className="text-[10px] tracking-[0.4em] uppercase text-amber-800 font-bold mb-6 font-montserrat">Kraków • Bieżanowska 252a</p>
        <h1 className="text-5xl md:text-7xl font-montserrat font-bold leading-tight mb-16 text-slate-800 tracking-wider">
          STUDIO PODŁÓG <br /> 
          <span className="font-script text-5xl md:text-7xl text-amber-900 mt-2 block lowercase tracking-normal">Asmar podłoga z duszą</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as keyof typeof productsData)}
              className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                activeCategory === cat.id ? 'bg-amber-800 text-white shadow-xl scale-105' : 'bg-white/60 text-slate-600 hover:bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto flex items-center justify-center gap-4 md:gap-12 h-[350px] md:h-[450px]">
          <button onClick={() => changeWood(-1)} className="z-30 p-4 rounded-full bg-white/60 backdrop-blur shadow-xl hover:bg-white text-amber-900 transition-all"><ChevronLeft size={32} /></button>
          <div className="relative w-72 md:w-96 h-full flex items-center justify-center">
            {/* KLUCZOWA OPTYMALIZACJA IMAGE */}
            <Image 
              src={currentProduct.img} 
              alt={currentProduct.name} 
              width={500} 
              height={500} 
              priority // To zdjęcie ładuje się jako pierwsze
              className={`relative z-10 w-full h-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)] ${animating ? 'animate-liquid' : ''}`} 
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black/20 blur-[20px] rounded-[100%] pointer-events-none" />
          </div>
          <button onClick={() => changeWood(1)} className="z-30 p-4 rounded-full bg-white/60 backdrop-blur shadow-xl hover:bg-white text-amber-900 transition-all"><ChevronRight size={32} /></button>
        </div>
        
        <div className="mt-12 flex flex-col items-center">
           <h3 className="text-3xl font-script text-slate-800 mt-2 mb-8">{currentProduct.name}</h3>
           <button onClick={addToQuote} className="bg-amber-900 text-white font-montserrat font-bold text-xs uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-amber-800 transition-all shadow-xl shadow-amber-900/30 flex items-center gap-3">
             <ShoppingCart size={18} /> Dodaj do wyceny
           </button>
        </div>
      </section>

      {/* Sekcja O nas */}
      <section id="o-nas" className="relative z-10 py-32 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-24">
           <h2 className="text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">O nas</h2>
           <p className="text-3xl font-script text-amber-700">Rzemiosło przekazywane przez lata</p>
        </div>
        <div className="grid md:grid-cols-2 gap-20 items-center">
           <div className="space-y-6 text-slate-600 leading-relaxed font-light text-lg">
              <p>Rzetelnie wykonywane usługi w zakresie montażu i cyklinowania od niemal 3 dekad. Nasza specjalność to nie tylko montaż, ale wydobywanie naturalnego, unikalnego piękna z każdego kawałka drewna.</p>
           </div>
           <div className="grid grid-cols-2 gap-8">
              <div className="bg-white/60 backdrop-blur-md p-10 rounded-[2.5rem] text-center shadow-xl border border-white">
                 <p className="text-6xl font-montserrat font-bold text-amber-600 mb-2">29</p>
                 <p className="text-xs uppercase tracking-widest text-slate-500 font-bold font-montserrat">Lat doświadczenia</p>
              </div>
           </div>
        </div>
      </section>

      {/* Sekcja Oferta - Zdjęcia wypełniające (fill) */}
      <section id="oferta" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
           <h2 className="text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">Zakres usług</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {offerData.map((item, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-lg rounded-[2.5rem] shadow-lg overflow-hidden border border-white group transition-all hover:shadow-2xl">
              <div className="h-[350px] relative overflow-hidden">
                {/* Kolejna optymalizacja: fill i sizes */}
                <Image 
                  src={item.images[offerIndices[i]]} 
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
                  <button onClick={() => changeOfferImage(i, -1)} className="p-3 rounded-full bg-white/90 shadow-xl"><ChevronLeft size={24} className="text-amber-900" /></button>
                  <button onClick={() => changeOfferImage(i, 1)} className="p-3 rounded-full bg-white/90 shadow-xl"><ChevronRight size={24} className="text-amber-900" /></button>
                </div>
              </div>
              <div className="p-10 flex flex-col h-full">
                <h4 className="text-2xl font-montserrat font-bold mb-1">{item.title}</h4>
                <p className="text-[10px] tracking-[0.2em] text-amber-700 font-bold uppercase mb-4">{item.sub}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sekcja Opinie */}
      <section id="opinie" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
           <h2 className="text-5xl font-montserrat font-bold text-slate-800 mb-4 tracking-widest uppercase">Opinie</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
           {reviews.map((review, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-md border border-white p-10 rounded-[2.5rem] shadow-xl relative mt-4">
                 <div className="absolute -top-6 left-8 bg-amber-600 w-12 h-12 flex items-center justify-center rounded-full shadow-lg text-white">
                    <Quote size={20} fill="currentColor" />
                 </div>
                 <p className="text-slate-700 text-base leading-relaxed mb-8 italic">"{review.text}"</p>
                 <p className="text-xs uppercase tracking-widest font-bold text-slate-800 font-montserrat">{review.author}</p>
              </div>
           ))}
        </div>
      </section>

      {/* Sekcja Kontakt - BEZ MAPY, szybszy start */}
      <section id="kontakt" className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <a href="tel:513724860" className="bg-white/60 backdrop-blur-md border border-white p-10 rounded-[2.5rem] shadow-lg hover:shadow-2xl flex flex-col items-center text-center transition-all">
            <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 text-amber-900"><Phone size={24} /></div>
            <p className="text-xl font-montserrat font-bold text-slate-800">513 724 860</p>
          </a>
          <a href="mailto:biuro@studioasmar.pl" className="bg-white/60 backdrop-blur-md border border-white p-10 rounded-[2.5rem] shadow-lg hover:shadow-2xl flex flex-col items-center text-center transition-all">
            <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 text-amber-900"><Mail size={24} /></div>
            <p className="text-lg font-montserrat font-bold text-slate-800">biuro@studioasmar.pl</p>
          </a>
          <div className="bg-white/60 backdrop-blur-md border border-white p-10 rounded-[2.5rem] shadow-lg flex flex-col items-center text-center relative">
            <div className={`w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 ${currentStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}><Clock size={24} /></div>
            <p className="text-xl font-montserrat font-bold mb-2">{currentStatus.isOpen ? 'ZAPRASZAMY' : 'ZAMKNIĘTE'}</p>
            <button onClick={() => setShowFullHours(!showFullHours)} className="text-[10px] font-bold text-amber-700 underline flex items-center gap-2">Dzisiaj: {currentStatus.todayStr} <Info size={14}/></button>
            {showFullHours && (
              <div className="absolute top-full mt-6 bg-white shadow-2xl p-8 rounded-[2rem] z-20 border border-slate-100 w-64 animate-in fade-in slide-in-from-top-3">
                {Object.entries(openingHoursSchedule).map(([day, time]) => (
                  <div key={day} className="flex justify-between text-xs py-2 border-b last:border-0 capitalize font-montserrat font-medium">
                    <span className="text-slate-500">{day}</span><span className="text-slate-900 font-bold">{time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white/60 backdrop-blur-md border border-white p-10 rounded-[2.5rem] shadow-lg flex flex-col items-center text-center transition-all">
            <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 text-amber-900"><MapPin size={24} /></div>
            <p className="text-lg font-montserrat font-bold text-slate-800">Bieżanowska 252a <br/> Kraków</p>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-slate-200/50 text-center relative z-10">
        <p className="text-[10px] tracking-[0.5em] text-slate-500 uppercase font-bold italic px-4 font-montserrat">© 2026 STUDIO PODŁÓG ASMAR - KRAKÓW. 29 LAT DOŚWIADCZENIA.</p>
      </footer>
    </main>
  );
}