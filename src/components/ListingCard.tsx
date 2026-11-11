import React from 'react';
import { Heart, MapPin, ShieldCheck, Truck, Sparkles, Check } from 'lucide-react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { favorites, toggleFavorite, openListingDetail } = useApp();
  const isFav = favorites.includes(listing.id);

  return (
    <article 
      onClick={() => openListingDetail(listing)}
      className="group relative bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/40 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image Container (Aspect 4:3) */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img 
          src={listing.images[0]} 
          alt={listing.title} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges (Subtle status, not pill sandwiches) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {listing.isFeatured && (
            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wide rounded-md shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Sponsorisé
            </span>
          )}
          {listing.status === 'sold' && (
            <span className="px-2 py-0.5 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wide rounded-md shadow-sm">
              Vendu
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(listing.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isFav 
              ? 'bg-red-500 text-white shadow-sm' 
              : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-red-500 shadow-sm'
          }`}
          title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-label="Sauvegarder"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Delivery indicator */}
        {listing.hasDelivery && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-medium rounded-md flex items-center gap-1">
            <Truck className="w-3 h-3 text-emerald-400" />
            <span>Livraison dispo</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Discipline: Unboxed Text with separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 flex-wrap">
            <span className="font-medium text-slate-700">{listing.condition}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {listing.city} {listing.neighborhood ? `(${listing.neighborhood})` : ''}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {listing.title}
          </h3>
        </div>

        {/* Price & Seller Row */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-slate-950 font-mono tabular-nums tracking-tight">
                {listing.price.toLocaleString('fr-FR')}
              </span>
              <span className="text-xs font-bold text-emerald-700">FCFA</span>
            </div>
            {listing.isNegotiable && (
              <span className="text-[10px] text-slate-400 font-medium">Prix négociable</span>
            )}
          </div>

          {/* Seller Preview */}
          <div className="flex items-center gap-1.5 text-right">
            <div className="text-[11px] text-slate-600 hidden sm:block">
              <div className="font-medium truncate max-w-[80px]">{listing.seller.name.split(' ')[0]}</div>
              <div className="text-[10px] text-amber-600 font-semibold">★ {listing.seller.rating}</div>
            </div>
            {listing.seller.emailVerified && (
              <span title="Vendeur vérifié">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
