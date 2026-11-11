import React from 'react';
import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsCreateListingOpen, 
    setIsChatOpen, 
    setIsProfileModalOpen, 
    conversations,
    currentUser,
    resetFilters
  } = useApp();

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe lg:hidden">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {/* Tab 1: Accueil */}
        <button
          onClick={() => {
            setActiveTab('home');
            resetFilters();
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'home' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Accueil</span>
        </button>

        {/* Tab 2: Explorer */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'explore' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Explorer</span>
        </button>

        {/* Tab 3: Prominent Center Action (+ Vendre) */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => setIsCreateListingOpen(true)}
            className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
            aria-label="Vendre un objet"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Tab 4: Messages */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="relative flex flex-col items-center justify-center min-h-[44px] text-slate-500 hover:text-slate-800 transition-colors"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalUnread}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Messages</span>
        </button>

        {/* Tab 5: Mon Compte */}
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
            activeTab === 'profile' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {currentUser ? (
            <img 
              src={currentUser.avatar} 
              alt="" 
              className="w-5 h-5 rounded-full object-cover border border-emerald-500" 
            />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] tracking-tight mt-1">Compte</span>
        </button>
      </div>
    </nav>
  );
};
