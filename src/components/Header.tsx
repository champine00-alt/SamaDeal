import React from 'react';
import { 
  PlusCircle, 
  MessageSquare, 
  Heart, 
  User, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsCreateListingOpen, 
    setIsProfileModalOpen, 
    setIsChatOpen, 
    setIsSafetyModalOpen,
    conversations,
    favorites,
    isMobileSimulator,
    setIsMobileSimulator,
    currentUser,
    resetFilters,
    isAdminAuthenticated,
    setIsAdminModalOpen,
    openAuthModal
  } = useApp();

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => {
                setActiveTab('home');
                resetFilters();
              }}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-sm flex items-center justify-center p-0.5 group-hover:border-emerald-500 transition-colors shrink-0">
                <img 
                  src="/assets/aistudio/photo_2026-11-11_08-30-01_efa7b2df.jpg" 
                  alt="SamaDeal Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Sama<span className="text-emerald-600">Deal</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  Sénégal
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button 
              onClick={() => {
                setActiveTab('explore');
              }}
              className={`hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'explore' ? 'text-emerald-600 font-semibold' : ''}`}
            >
              Explorer les annonces
            </button>
            <button 
              onClick={() => setIsSafetyModalOpen(true)}
              className="hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Sécurité & Conseils
            </button>
          </nav>

          {/* Zone 3: Primary action + quick triggers */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Mobile Simulator Toggle on Desktop */}
            <button
              onClick={() => setIsMobileSimulator(!isMobileSimulator)}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isMobileSimulator 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
              title="Basculer en mode simulateur smartphone sénégalais"
            >
              {isMobileSimulator ? <Laptop className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span>{isMobileSimulator ? 'Vue Desktop' : 'Vue Mobile App'}</span>
            </button>

            {/* Favorites Icon Button */}
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsProfileModalOpen(true);
              }}
              className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Mes favoris"
              aria-label="Mes favoris"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Chat Icon Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Messagerie"
              aria-label="Messagerie"
            >
              <MessageSquare className="w-5 h-5" />
              {totalUnread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2 p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Mon compte"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover border border-emerald-600/40" 
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>Connexion</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => setIsCreateListingOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Vendre un article</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
