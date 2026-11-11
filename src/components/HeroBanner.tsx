import React from 'react';
import { Search, MapPin, ShieldCheck, Zap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HERO_IMAGE, SENEGAL_CITIES, DAKAR_NEIGHBORHOODS } from '../data/mockData';

export const HeroBanner: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCity, 
    setSelectedCity,
    selectedNeighborhood,
    setSelectedNeighborhood,
    setIsCreateListingOpen,
    setActiveTab
  } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('explore');
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-4 shadow-xl">
      {/* Background Image with Dark Vignette Gradient */}
      <div className="absolute inset-0 z-0">
        <img 
          src={HERO_IMAGE} 
          alt="Marché en ligne et échanges entre particuliers à Dakar, Sénégal" 
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
        {/* Kicker */}
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-emerald-400">
          <span>Plateforme n°1 au Sénégal</span>
          <span aria-hidden="true">·</span>
          <span>Dakar & Régions</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-2xl text-balance">
          Donnez une seconde vie à vos objets.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
          <strong className="text-white font-semibold">Achète. Vends. Économise.</strong> Des milliers d'articles vérifiés à prix accessibles. Payez en direct ou en toute sécurité par Wave et Orange Money.
        </p>

        {/* Search Bar Form */}
        <form 
          onSubmit={handleSearchSubmit}
          className="mt-8 p-2.5 bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch gap-2 text-slate-800"
        >
          {/* Keyword Search */}
          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-50 md:bg-transparent rounded-xl">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Que cherchez-vous ? (iPhone, boubou, frigo, scooter...)"
              className="w-full text-sm font-medium bg-transparent focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 md:bg-transparent md:border-l md:border-slate-200 rounded-xl">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs font-medium bg-transparent focus:outline-none text-slate-700 cursor-pointer"
            >
              {SENEGAL_CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Quartier (if Dakar selected) */}
          {selectedCity === 'Dakar' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 md:bg-transparent md:border-l md:border-slate-200 rounded-xl">
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="text-xs font-medium bg-transparent focus:outline-none text-slate-600 cursor-pointer"
              >
                {DAKAR_NEIGHBORHOODS.map((nh) => (
                  <option key={nh} value={nh}>{nh}</option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Search */}
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 shrink-0"
          >
            <span>Rechercher</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Popular Searches */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="text-slate-400 font-medium">Populaire :</span>
          {['iPhone 13', 'Boubou brodé', 'Scooter Dakar', 'MacBook M1', 'Canapé salon', 'Samsung No-Frost'].map((term) => (
            <button
              key={term}
              onClick={() => {
                setSearchQuery(term);
                setActiveTab('explore');
              }}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>0% commission direct</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Garantie Wave & OM</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Vendeurs vérifiés</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Contact WhatsApp direct</span>
          </div>
        </div>
      </div>
    </section>
  );
};
