import React from 'react';
import { 
  Smartphone, 
  Shirt, 
  Laptop, 
  Refrigerator, 
  Armchair, 
  Car, 
  BookOpen, 
  Layers 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { CategoryId } from '../types';

export const CategoryBar: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setActiveTab } = useApp();

  const getIcon = (id: CategoryId) => {
    switch (id) {
      case 'telephones-electronique':
        return <Smartphone className="w-5 h-5" />;
      case 'vetements-chaussures':
        return <Shirt className="w-5 h-5" />;
      case 'informatique':
        return <Laptop className="w-5 h-5" />;
      case 'electromenager':
        return <Refrigerator className="w-5 h-5" />;
      case 'meubles-decoration':
        return <Armchair className="w-5 h-5" />;
      case 'vehicules':
        return <Car className="w-5 h-5" />;
      case 'livres-loisirs':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  const handleSelect = (catId: CategoryId | 'all') => {
    setSelectedCategory(catId);
    setActiveTab('explore');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Catégories principales
        </h2>
        <button
          onClick={() => handleSelect('all')}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          Voir toutes les annonces
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {/* All Categories Option */}
        <button
          onClick={() => handleSelect('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Toutes</span>
        </button>

        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleSelect(category.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className={isSelected ? 'text-white' : 'text-emerald-600'}>
                {getIcon(category.id)}
              </span>
              <span>{category.name}</span>
              <span className={`text-[10px] tabular-nums font-normal ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                ({category.itemCount})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
