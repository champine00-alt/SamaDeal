import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  MapPin, 
  Truck, 
  Tag, 
  Check, 
  Smartphone, 
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, SENEGAL_CITIES, DAKAR_NEIGHBORHOODS, IPHONE_IMAGE, BOUBOU_IMAGE, SCOOTER_IMAGE } from '../data/mockData';
import { CategoryId, Condition } from '../types';

export const CreateListingModal: React.FC = () => {
  const { isCreateListingOpen, setIsCreateListingOpen, addListing } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<CategoryId>('telephones-electronique');
  const [condition, setCondition] = useState<Condition>('Très bon état');
  const [city, setCity] = useState('Dakar');
  const [neighborhood, setNeighborhood] = useState('Mermoz');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [hasDelivery, setHasDelivery] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState('2000');
  const [isBoosted, setIsBoosted] = useState(false);
  const [images, setImages] = useState<string[]>([IPHONE_IMAGE]);

  if (!isCreateListingOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [reader.result as string, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (presetUrl: string) => {
    setImages([presetUrl]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseInt(price.replace(/[^0-9]/g, ''), 10);
    if (!title.trim() || isNaN(numPrice) || numPrice <= 0) return;

    addListing({
      title: title.trim(),
      description: description.trim() || 'Article en excellent état, disponible pour remise en main propre ou livraison.',
      price: numPrice,
      originalPrice: Math.round(numPrice * 1.25),
      category,
      condition,
      images: images.length > 0 ? images : [IPHONE_IMAGE],
      city,
      neighborhood: city === 'Dakar' ? neighborhood : '',
      isNegotiable,
      hasDelivery,
      deliveryFee: hasDelivery ? parseInt(deliveryFee, 10) || 0 : 0,
      isBoosted
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Déposer une annonce</h2>
            <p className="text-xs text-slate-500">Donnez une seconde vie à votre objet au Sénégal</p>
          </div>
          <button
            onClick={() => setIsCreateListingOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {/* Photos Upload & Presets */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Photos de l'article *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 group">
                  <img src={img} alt="Aperçu" className="w-full h-full object-cover" />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              {/* Upload trigger */}
              <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center">
                <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-[11px] font-semibold text-slate-600">Ajouter</span>
                <span className="text-[9px] text-slate-400">PNG, JPG</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Quick Demo Image Presets */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                Ou choisissez une photo d'exemple :
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handlePresetSelect(IPHONE_IMAGE)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                >
                  📱 iPhone / Smartphone
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect(BOUBOU_IMAGE)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                >
                  👘 Boubou brodé
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect(SCOOTER_IMAGE)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                >
                  🛵 Moto / Scooter
                </button>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Titre de l'annonce *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Samsung Galaxy S22 128Go avec chargeur"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                État du produit *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Comme neuf">Comme neuf (aucune trace)</option>
                <option value="Très bon état">Très bon état (micro-rayures légères)</option>
                <option value="Bon état">Bon état (marques d'usure normales)</option>
                <option value="État correct">État correct (fonctionne bien)</option>
                <option value="Pour pièces">Pour pièces ou réparation</option>
              </select>
            </div>
          </div>

          {/* Price & Negotiable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Prix en FCFA *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="500"
                  step="500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 85000"
                  className="w-full pl-3.5 pr-14 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold focus:bg-white focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                  FCFA
                </span>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2">
              <input
                type="checkbox"
                id="isNegotiable"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="isNegotiable" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Prix négociable (ouvert à discussion)
              </label>
            </div>
          </div>

          {/* Location: City and Quartier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Ville au Sénégal *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {SENEGAL_CITIES.filter(c => c !== 'Toutes les villes').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {city === 'Dakar' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Quartier de Dakar *
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {DAKAR_NEIGHBORHOODS.filter(n => n !== 'Tous les quartiers').map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Delivery Option */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Proposer la livraison</span>
              </div>
              <input
                type="checkbox"
                checked={hasDelivery}
                onChange={(e) => setHasDelivery(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
            </div>
            {hasDelivery && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-slate-500">Frais de livraison estimés :</span>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-semibold"
                />
                <span className="text-xs text-slate-500">FCFA</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description complète
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Précisez l'historique, la raison de la vente, les accessoires fournis, l'état de fonctionnement..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Boost Option (Business Model Feature) */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isBoosted ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Option Sponsorisée SamaDeal Boost (+5x plus de vues)
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Votre annonce restera épinglée en tête des résultats pendant 7 jours.
                  </p>
                  <span className="inline-block mt-1 text-xs font-bold text-amber-800 font-mono">
                    1 500 FCFA (réglable par Wave / OM)
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isBoosted}
                onChange={(e) => setIsBoosted(e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded border-slate-300 focus:ring-amber-500 mt-1 cursor-pointer"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Publier mon annonce maintenant</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
