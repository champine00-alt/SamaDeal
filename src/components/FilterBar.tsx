import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  X, 
  MapPin, 
  Check, 
  ArrowUpDown, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useApp, SortOption } from '../context/AppContext';
import { SENEGAL_CITIES, DAKAR_NEIGHBORHOODS, CATEGORIES } from '../data/mockData';
import { CategoryId, Condition } from '../types';

export const FilterBar: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory,
    selectedCity, 
    setSelectedCity,
    selectedNeighborhood, 
    setSelectedNeighborhood,
    priceMin, 
    setPriceMin,
    priceMax, 
    setPriceMax,
    selectedCondition, 
    setSelectedCondition,
    sortOption, 
    setSortOption,
    onlyNegotiable, 
    setOnlyNegotiable,
    onlyDelivered, 
    setOnlyDelivered,
    onlyVerified, 
    setOnlyVerified,
    resetFilters,
    listings
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedCity !== 'Toutes les villes',
    selectedNeighborhood !== 'Tous les quartiers',
    priceMin !== '',
    priceMax !== '',
    selectedCondition !== 'all',
    onlyNegotiable,
    onlyDelivered,
    onlyVerified
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6">
      {/* Primary Row: Quick Sort & Filter Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Expand Filters */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isExpanded || activeFiltersCount > 0
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtres avancés</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Quick city pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              {SENEGAL_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters (if active) */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 transition-colors px-2 py-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Trier par :</span>
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="latest">Plus récents</option>
              <option value="price_asc">Prix croissant (FCFA)</option>
              <option value="price_desc">Prix décroissant (FCFA)</option>
              <option value="popular">Plus populaires</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
          {/* Quartier (if Dakar selected) */}
          {selectedCity === 'Dakar' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quartier de Dakar
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
              >
                {DAKAR_NEIGHBORHOODS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          {/* Condition Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              État du produit
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value as Condition | 'all')}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="all">Tous les états</option>
              <option value="Comme neuf">Comme neuf</option>
              <option value="Très bon état">Très bon état</option>
              <option value="Bon état">Bon état</option>
              <option value="État correct">État correct</option>
              <option value="Pour pièces">Pour pièces</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prix (FCFA)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col justify-center space-y-2 pt-2 sm:pt-0">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyNegotiable}
                onChange={(e) => setOnlyNegotiable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span>Prix négociable uniquement</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyDelivered}
                onChange={(e) => setOnlyDelivered(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                <span>Livraison proposée</span>
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vendeurs vérifiés</span>
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
