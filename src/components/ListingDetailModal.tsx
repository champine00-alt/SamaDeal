import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  MessageSquare, 
  Phone, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ListingDetailModal: React.FC = () => {
  const { 
    selectedListing, 
    closeListingDetail, 
    favorites, 
    toggleFavorite,
    startChatWithSeller,
    setIsEscrowModalOpen,
    setIsReportModalOpen,
    setTargetReportListing,
    showToast
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedListing) return null;

  const isFav = favorites.includes(selectedListing.id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedListing.title,
          text: `Découvre cette annonce sur SamaDeal : ${selectedListing.title} (${selectedListing.price.toLocaleString('fr-FR')} FCFA)`,
          url: window.location.href
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Lien de l\'annonce copié dans le presse-papier !', 'info');
    }
  };

  const openWhatsApp = () => {
    const text = `Bonjour ${selectedListing.seller.name}, je vous contacte depuis SamaDeal pour votre annonce "${selectedListing.title}" affichée à ${selectedListing.price.toLocaleString('fr-FR')} FCFA. Est-elle toujours disponible ?`;
    const cleanNumber = selectedListing.seller.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleStartChat = () => {
    startChatWithSeller(selectedListing);
  };

  const handleBuyWithEscrow = () => {
    setIsEscrowModalOpen(true);
  };

  const handleReport = () => {
    setTargetReportListing(selectedListing);
    setIsReportModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Close Button */}
        <button
          onClick={closeListingDetail}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-md"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* Left Column: Image Gallery (Aspect 4:3) */}
            <div className="md:col-span-7 flex flex-col gap-3">
              <div className="relative aspect-[4/3] rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                <img 
                  src={selectedListing.images[activeImageIndex] || selectedListing.images[0]} 
                  alt={selectedListing.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {selectedListing.isFeatured && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-md shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Annonce Sponsorisée
                  </span>
                )}
              </div>

              {/* Thumbnails (if multiple images) */}
              {selectedListing.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedListing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-emerald-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Callout */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3 text-xs text-emerald-900">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-800">Garantie SamaDeal Protection</h4>
                  <p className="mt-0.5 text-emerald-700 leading-relaxed">
                    Achetez en toute tranquillité via Wave ou Orange Money : l'argent est sécurisé et n'est remis au vendeur qu'après votre confirmation de réception.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Price, Action buttons & Seller */}
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                {/* Clean unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-700">{selectedListing.condition}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedListing.city} {selectedListing.neighborhood ? `(${selectedListing.neighborhood})` : ''}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedListing.createdAt}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {selectedListing.title}
                </h2>

                {/* Price Display */}
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-950 font-mono tabular-nums">
                      {selectedListing.price.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-base font-bold text-emerald-600">FCFA</span>
                  </div>

                  {selectedListing.originalPrice && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <span className="line-through">{selectedListing.originalPrice.toLocaleString('fr-FR')} FCFA</span>
                      <span className="text-emerald-700 font-semibold">
                        -{Math.round((1 - selectedListing.price / selectedListing.originalPrice) * 100)}% d'économie
                      </span>
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
                    <span className="font-medium">
                      {selectedListing.isNegotiable ? '✓ Prix discutable' : 'Prix ferme'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      {selectedListing.hasDelivery ? 'Livraison disponible' : 'Remise en main propre'}
                    </span>
                  </div>
                </div>

                {/* Seller Card */}
                <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedListing.seller.avatar} 
                      alt={selectedListing.seller.name} 
                      className="w-12 h-12 rounded-full object-cover border border-emerald-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">{selectedListing.seller.name}</span>
                        {selectedListing.seller.emailVerified && (
                          <span title="Vendeur vérifié">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span className="text-amber-600 font-bold">★ {selectedListing.seller.rating}</span>
                        <span className="mx-1">·</span>
                        <span>{selectedListing.seller.totalSales} ventes</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Répond {selectedListing.seller.responseTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-5 space-y-2.5">
                  {/* Option 2: Paiement Sécurisé Wave / OM */}
                  <button
                    onClick={handleBuyWithEscrow}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Acheter avec Paiement Sécurisé (Wave / OM)</span>
                  </button>

                  {/* WhatsApp Direct Contact */}
                  <button
                    onClick={openWhatsApp}
                    className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Contacter sur WhatsApp</span>
                  </button>

                  {/* In-App Chat */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleStartChat}
                      className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Discuter / Offre</span>
                    </button>

                    <button
                      onClick={() => toggleFavorite(selectedListing.id)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        isFav 
                          ? 'bg-red-50 border-red-200 text-red-600' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      <span>{isFav ? 'Sauvegardé' : 'Favoris'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary utility actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partager</span>
                </button>
                <button
                  onClick={handleReport}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Signaler l'annonce</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full Description & Specs */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Description de l'article
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedListing.description}
            </p>
          </div>

          {/* Senegal Safety Advice */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Conseils de sécurité SamaDeal pour le Sénégal</span>
            </div>
            <p>
              Pour une transaction directe, privilégiez un rendez-vous en journée dans un lieu public très fréquenté (station-service, centre commercial, place publique). Testez l'article avant de payer. Pour une livraison à distance, utilisez exclusivement le <strong>Paiement Sécurisé SamaDeal</strong> afin de bloquer les fonds jusqu'à réception.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
