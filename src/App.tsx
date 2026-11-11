import React, { useMemo } from 'react';
import { 
  AppProvider, 
  useApp 
} from './context/AppContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { CreateListingModal } from './components/CreateListingModal';
import { ChatModal } from './components/ChatModal';
import { EscrowPaymentModal } from './components/EscrowPaymentModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { SafetyGuidelinesModal } from './components/SafetyGuidelinesModal';
import { ReportListingModal } from './components/ReportListingModal';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Lock, 
  HelpCircle, 
  Smartphone, 
  RotateCcw,
  PlusCircle,
  ArrowRight
} from 'lucide-react';

const MarketplaceContent: React.FC = () => {
  const { 
    listings, 
    searchQuery, 
    selectedCategory, 
    selectedCity, 
    selectedNeighborhood, 
    priceMin, 
    priceMax, 
    selectedCondition, 
    sortOption, 
    onlyNegotiable, 
    onlyDelivered, 
    onlyVerified,
    activeTab,
    setIsCreateListingOpen,
    setIsSafetyModalOpen,
    resetFilters,
    isMobileSimulator,
    setIsMobileSimulator
  } = useApp();

  // Filter & sort listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCity = item.city.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCity) return false;
        }

        // Category
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // City
        if (selectedCity !== 'Toutes les villes' && item.city !== selectedCity) {
          return false;
        }

        // Neighborhood (if Dakar)
        if (
          selectedCity === 'Dakar' && 
          selectedNeighborhood !== 'Tous les quartiers' && 
          item.neighborhood !== selectedNeighborhood
        ) {
          return false;
        }

        // Condition
        if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
          return false;
        }

        // Price Min / Max
        if (priceMin && item.price < parseInt(priceMin, 10)) {
          return false;
        }
        if (priceMax && item.price > parseInt(priceMax, 10)) {
          return false;
        }

        // Toggles
        if (onlyNegotiable && !item.isNegotiable) return false;
        if (onlyDelivered && !item.hasDelivery) return false;
        if (onlyVerified && !item.seller.emailVerified) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'price_asc') return a.price - b.price;
        if (sortOption === 'price_desc') return b.price - a.price;
        if (sortOption === 'popular') return (b.viewsCount + b.favoritesCount * 3) - (a.viewsCount + a.favoritesCount * 3);
        // default: latest (featured items first, then original order)
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [
    listings, 
    searchQuery, 
    selectedCategory, 
    selectedCity, 
    selectedNeighborhood, 
    priceMin, 
    priceMax, 
    selectedCondition, 
    sortOption, 
    onlyNegotiable, 
    onlyDelivered, 
    onlyVerified
  ]);

  const featuredListings = listings.filter(l => l.isFeatured);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section (only when on home or when no search filter active) */}
        {activeTab === 'home' && !searchQuery && (
          <HeroBanner />
        )}

        {/* Category Horizontal Bar */}
        <CategoryBar />

        {/* Listings Section Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Filters Bar */}
          <FilterBar />

          {/* Section Header: Results count and clear filter */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {searchQuery 
                  ? `Résultats pour "${searchQuery}"`
                  : selectedCategory !== 'all'
                  ? 'Articles disponibles'
                  : 'Dernières annonces publiées au Sénégal'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {filteredListings.length} {filteredListings.length > 1 ? 'articles trouvés' : 'article trouvé'} à Dakar et régions
              </p>
            </div>

            {(searchQuery || selectedCategory !== 'all' || selectedCity !== 'Toutes les villes') && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Voir tout</span>
              </button>
            )}
          </div>

          {/* Product Grid: 4 cols on desktop, 3 on tablet, 2 on mobile */}
          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Aucune annonce ne correspond à votre recherche</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Essayez d'élargir votre localisation ou de modifier vos critères de prix.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Effacer les filtres
                </button>
                <button
                  onClick={() => setIsCreateListingOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Être le premier à vendre ici</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          {/* Value Proposition Callout: Why SamaDeal in Senegal */}
          <div className="mt-16 bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Lock className="w-4 h-4" />
                <span>Paiements & Sécurité SamaDeal</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Vendez et achetez sans risque avec Wave et Orange Money
              </h3>
              <p className="mt-3 text-sm text-emerald-100 leading-relaxed">
                Fini les arnaques aux faux acomptes. Avec le <strong>Paiement Sécurisé SamaDeal</strong>, vos fonds sont bloqués sur un compte séquestre de confiance. Le vendeur est payé uniquement après votre validation de conformité.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Découvrir les conseils de sécurité
                </button>
                <button
                  onClick={() => setIsCreateListingOpen(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border border-emerald-500/50 transition-all flex items-center gap-1.5"
                >
                  <span>Publier une annonce gratuite</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation (Visible on mobile viewports) */}
      <MobileBottomNav />

      {/* Modals & Dialogs */}
      <AuthModal />
      <ListingDetailModal />
      <CreateListingModal />
      <ChatModal />
      <EscrowPaymentModal />
      <UserProfileModal />
      <AdminPortalModal />
      <AdminAuthModal />
      <SafetyGuidelinesModal />
      <ReportListingModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContainer />
    </AppProvider>
  );
}

const AppContainer: React.FC = () => {
  const { isMobileSimulator, setIsMobileSimulator } = useApp();

  if (isMobileSimulator) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Device Switcher Banner on Desktop */}
        <div className="mb-4 flex items-center gap-3 text-white text-xs">
          <span className="font-semibold text-emerald-400">📱 Mode Simulateur Application Mobile SamaDeal (Sénégal)</span>
          <button
            onClick={() => setIsMobileSimulator(false)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium border border-white/20 transition-colors"
          >
            Revenir au mode plein écran Desktop
          </button>
        </div>

        {/* Smartphone Shell Frame */}
        <div className="w-full max-w-[414px] h-[860px] bg-slate-950 rounded-[50px] p-3 shadow-2xl ring-1 ring-white/10 border-4 border-slate-700 flex flex-col relative overflow-hidden">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ml-auto mr-3" />
          </div>

          {/* Internal App Canvas */}
          <div className="w-full h-full bg-slate-50 rounded-[40px] overflow-y-auto overflow-x-hidden relative flex flex-col scrollbar-none pt-4">
            <MarketplaceContent />
          </div>
        </div>
      </div>
    );
  }

  return <MarketplaceContent />;
};
