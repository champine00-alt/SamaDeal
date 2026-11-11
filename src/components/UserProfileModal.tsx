import React, { useState } from 'react';
import { 
  X, 
  User, 
  Package, 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  Check, 
  MapPin, 
  Phone,
  Eye,
  Sliders,
  Bell,
  Clock,
  ShoppingBag,
  CreditCard,
  MessageSquare,
  Lock,
  LogOut,
  AlertTriangle,
  ArrowRight,
  Edit3,
  KeyRound,
  Smartphone,
  ExternalLink,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SENEGAL_CITIES } from '../data/mockData';

type AccountTab = 
  | 'profile' 
  | 'edit_profile' 
  | 'listings_active' 
  | 'listings_pending' 
  | 'listings_sold' 
  | 'favorites' 
  | 'purchases' 
  | 'sales' 
  | 'messages' 
  | 'payments' 
  | 'notifications' 
  | 'security' 
  | 'delete_account';

export const UserProfileModal: React.FC = () => {
  const { 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    currentUser, 
    listings, 
    favorites, 
    escrowPayments, 
    confirmEscrowDelivery,
    deleteListing, 
    markAsSold, 
    boostListing, 
    openListingDetail,
    isAdminAuthenticated,
    setIsAdminModalOpen,
    setIsChatOpen,
    notifications,
    markNotificationAsRead,
    updateUserProfile,
    deleteUserAccount,
    logoutUser,
    openAuthModal,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<AccountTab>('profile');

  // Edit form state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editCity, setEditCity] = useState(currentUser?.city || 'Dakar');
  const [editNeighborhood, setEditNeighborhood] = useState(currentUser?.neighborhood || 'Mermoz');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');

  // Password / Security state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [twoFactorActive, setTwoFactorActive] = useState(currentUser?.twoFactorEnabled || false);

  if (!isProfileModalOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 text-center shadow-2xl">
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Espace Mon Compte</h3>
          <p className="text-sm text-slate-600 mb-6">
            Connectez-vous ou créez votre compte pour gérer vos annonces, vos achats et vos messages sur SamaDeal.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                openAuthModal('login');
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-lg shadow-emerald-600/20"
            >
              Se connecter
            </button>
            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                openAuthModal('register');
              }}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition"
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter listings
  const myActiveListings = listings.filter(l => l.sellerId === currentUser.id && l.status === 'active');
  const myPendingListings = listings.filter(l => l.sellerId === currentUser.id && l.status === 'pending');
  const mySoldListings = listings.filter(l => l.sellerId === currentUser.id && l.status === 'sold');
  const myFavoriteListings = listings.filter(l => favorites.includes(l.id));

  // Purchases & Sales
  const myPurchases = escrowPayments.filter(p => p.buyerPhone === currentUser.phone || p.buyerName === currentUser.name);
  const mySales = escrowPayments.filter(p => p.sellerName === currentUser.name);

  // Unread notifications count
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      phone: editPhone,
      email: editEmail,
      city: editCity,
      neighborhood: editNeighborhood,
      avatar: editAvatar || currentUser.avatar
    });
    showToast('Vos informations personnelles ont été mises à jour.', 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput !== confirmPasswordInput) {
      showToast('Les deux mots de passe ne correspondent pas.', 'warning');
      return;
    }
    if (newPasswordInput.length < 4) {
      showToast('Le mot de passe doit comporter au moins 4 caractères.', 'warning');
      return;
    }
    updateUserProfile({ password: newPasswordInput });
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    showToast('Mot de passe changé avec succès !', 'success');
  };

  const handleToggle2FA = () => {
    const nextVal = !twoFactorActive;
    setTwoFactorActive(nextVal);
    updateUserProfile({ twoFactorEnabled: nextVal });
    showToast(nextVal ? 'Double authentification OTP SMS activée.' : 'Double authentification désactivée.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Mobile/Desktop */}
        <button
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT SIDEBAR: Nav and Identity */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          {/* User mini header */}
          <div className="p-5 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                {currentUser.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5" title="Compte vérifié">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h3>
                <p className="text-xs text-slate-500 truncate">{currentUser.email || currentUser.phone}</p>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                  <span>Acheteur & Vendeur</span>
                </div>
              </div>
            </div>

            {/* Admin shortcut if owner */}
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setIsAdminModalOpen(true);
                }}
                className="mt-3 w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>👑</span>
                <span>Console Administrateur</span>
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <div className="p-3 overflow-y-auto flex-1 space-y-1 text-xs">
            <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Mon Espace
            </div>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Mon profil</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('edit_profile')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'edit_profile' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-4 h-4" />
                <span>Modifier mes informations</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <div className="px-2 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Mes Annonces
            </div>

            <button
              onClick={() => setActiveTab('listings_active')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'listings_active' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Annonces publiées</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${activeTab === 'listings_active' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {myActiveListings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('listings_pending')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'listings_pending' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Annonces en attente</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${activeTab === 'listings_pending' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {myPendingListings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('listings_sold')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'listings_sold' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                <span>Annonces vendues</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${activeTab === 'listings_sold' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {mySoldListings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'favorites' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Mes favoris</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${activeTab === 'favorites' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {myFavoriteListings.length}
              </span>
            </button>

            <div className="px-2 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Transactions & Échanges
            </div>

            <button
              onClick={() => setActiveTab('purchases')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'purchases' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-sky-600" />
                <span>Mes achats</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${activeTab === 'purchases' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {myPurchases.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sales')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'sales' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Mes ventes</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${activeTab === 'sales' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {mySales.length}
              </span>
            </button>

            <button
              onClick={() => {
                setIsProfileModalOpen(false);
                setIsChatOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-slate-700 hover:bg-slate-200/60 transition"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Mes messages</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'payments' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Mes paiements (Wave/OM)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'notifications' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-indigo-600" />
                <span>Mes notifications</span>
              </div>
              {unreadNotifsCount > 0 && (
                <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            <div className="px-2 pt-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Sécurité & Compte
            </div>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'security' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-slate-600" />
                <span>Paramètres de sécurité</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('delete_account')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'delete_account' ? 'bg-rose-50 text-rose-700' : 'text-rose-600 hover:bg-rose-50/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Supprimer mon compte</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={logoutUser}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl font-medium transition mt-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 1. MON PROFIL */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-900">Mon profil</h3>
                <p className="text-xs text-slate-500">Vue d'ensemble de votre compte utilisateur SamaDeal</p>
              </div>

              {/* Profile Card */}
              <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-center gap-5">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-lg font-bold text-slate-900">{currentUser.name}</h4>
                    {currentUser.isVerified && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Identité vérifiée
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 space-y-1">
                    <p className="flex items-center justify-center sm:justify-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentUser.city} {currentUser.neighborhood ? `(${currentUser.neighborhood})` : ''} · Sénégal</span>
                    </p>
                    <p className="flex items-center justify-center sm:justify-start gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentUser.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm shrink-0">
                  <div className="text-amber-500 font-extrabold text-lg">★ {currentUser.rating}</div>
                  <div className="text-[11px] text-slate-500">{currentUser.reviewCount || 12} avis positifs</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-lg font-bold text-slate-900">{myActiveListings.length}</div>
                  <div className="text-[11px] text-slate-500">Annonces actives</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-lg font-bold text-emerald-700">{mySoldListings.length}</div>
                  <div className="text-[11px] text-slate-500">Articles vendus</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-lg font-bold text-sky-700">{myPurchases.length}</div>
                  <div className="text-[11px] text-slate-500">Achats effectués</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-lg font-bold text-rose-600">{myFavoriteListings.length}</div>
                  <div className="text-[11px] text-slate-500">Coups de cœur</div>
                </div>
              </div>

              {/* Single account principle banner */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">SamaDeal : un seul compte, plusieurs possibilités</p>
                  <p className="text-emerald-800 leading-relaxed">
                    Vous n'avez pas besoin de deux comptes pour acheter et vendre. Votre profil vous permet de publier des annonces à Dakar ou en région tout en commandant et négociant avec d'autres particuliers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. MODIFIER MES INFORMATIONS PERSONNELLES */}
          {activeTab === 'edit_profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">Modifier mes informations</h3>
                <p className="text-xs text-slate-500">Mettez à jour vos coordonnées et votre zone de résidence</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom et prénom</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de téléphone</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse e-mail</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ville</label>
                  <select
                    value={editCity}
                    onChange={e => setEditCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {SENEGAL_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quartier</label>
                  <input
                    type="text"
                    value={editNeighborhood}
                    onChange={e => setEditNeighborhood(e.target.value)}
                    placeholder="Ex: Plateau, Mermoz, Maristes..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Photo de profil (URL)</label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={e => setEditAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition"
              >
                Enregistrer les modifications
              </button>
            </form>
          )}

          {/* 3. MES ANNONCES PUBLIÉES */}
          {activeTab === 'listings_active' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Mes annonces publiées</h3>
                  <p className="text-xs text-slate-500">Articles visibles actuellement par les acheteurs</p>
                </div>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  {myActiveListings.length} active(s)
                </span>
              </div>

              {myActiveListings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Aucune annonce active en ce moment.</p>
                </div>
              ) : (
                myActiveListings.map(listing => (
                  <div key={listing.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={listing.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{listing.title}</h4>
                          {listing.isFeatured && (
                            <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                              Boosté
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                          {listing.price.toLocaleString('fr-FR')} FCFA
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {listing.viewsCount} vues · {listing.favoritesCount} favoris
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => markAsSold(listing.id)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Marquer vendu</span>
                      </button>
                      {!listing.isFeatured && (
                        <button
                          onClick={() => boostListing(listing.id)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Booster</span>
                        </button>
                      )}
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. MES ANNONCES EN ATTENTE */}
          {activeTab === 'listings_pending' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">Mes annonces en attente</h3>
                <p className="text-xs text-slate-500">Annonces soumises en cours de vérification de sécurité par l'équipe SamaDeal</p>
              </div>

              {myPendingListings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Aucune annonce en attente de modération.</p>
                  <p className="text-xs text-slate-400 mt-1">Vos annonces publiées sont généralement validées en moins de 15 minutes.</p>
                </div>
              ) : (
                myPendingListings.map(listing => (
                  <div key={listing.id} className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={listing.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{listing.title}</h4>
                        <div className="text-xs font-mono font-bold text-emerald-700">{listing.price.toLocaleString('fr-FR')} FCFA</div>
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">En cours de revue</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 5. MES ANNONCES VENDUES */}
          {activeTab === 'listings_sold' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">Mes annonces vendues</h3>
                <p className="text-xs text-slate-500">Historique des articles que vous avez vendus avec succès</p>
              </div>

              {mySoldListings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Aucun article vendu pour l'instant.</p>
                </div>
              ) : (
                mySoldListings.map(listing => (
                  <div key={listing.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={listing.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 opacity-70" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{listing.title}</h4>
                        <div className="text-xs font-mono font-bold text-slate-700">{listing.price.toLocaleString('fr-FR')} FCFA</div>
                        <span className="text-[10px] bg-slate-900 text-white font-bold px-2 py-0.5 rounded">Vendu</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 6. MES FAVORIS */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">Mes favoris</h3>
                <p className="text-xs text-slate-500">Articles sauvegardés pour un achat ultérieur</p>
              </div>

              {myFavoriteListings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Aucun favori enregistré.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {myFavoriteListings.map(listing => (
                    <div 
                      key={listing.id}
                      onClick={() => {
                        setIsProfileModalOpen(false);
                        openListingDetail(listing);
                      }}
                      className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 flex items-center gap-3 cursor-pointer transition"
                    >
                      <img src={listing.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{listing.title}</h4>
                        <div className="text-xs font-mono font-bold text-emerald-700">{listing.price.toLocaleString('fr-FR')} FCFA</div>
                        <div className="text-[11px] text-slate-500">{listing.city} · {listing.seller.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 7. MES ACHATS */}
          {activeTab === 'purchases' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">Mes achats</h3>
                <p className="text-xs text-slate-500">Historique de vos commandes passées et achats avec séquestre SamaDeal</p>
              </div>

              {myPurchases.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Vous n'avez pas encore effectué d'achat.</p>
                </div>
              ) : (
                myPurchases.map(p => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{p.listingTitle}</h4>
                        <p className="text-xs text-slate-500">Vendeur : {p.sellerName} · Réf {p.id}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-extrabold text-emerald-700">
                          {p.total.toLocaleString('fr-FR')} FCFA
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status === 'delivered' ? 'Livré & Clôturé' : 'Fonds sous séquestre'}
                        </span>
                      </div>
                    </div>

                    {p.status === 'in_escrow' && (
                      <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between gap-3">
                        <span className="text-xs text-amber-900">
                          🔒 Vos fonds sont en sécurité. Confirmez après réception de l'article :
                        </span>
                        <button
                          onClick={() => confirmEscrowDelivery(p.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm shrink-0"
                        >
                          Confirmer la réception
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 8. MES VENTES */}
          {activeTab === 'sales' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">Mes ventes</h3>
                <p className="text-xs text-slate-500">Commandes reçues d'acheteurs et versements sur votre compte Wave / Orange Money</p>
              </div>

              {mySales.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <DollarSign className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Aucune commande reçue pour le moment.</p>
                </div>
              ) : (
                mySales.map(p => (
                  <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{p.listingTitle}</h4>
                        <p className="text-xs text-slate-500">Acheteur : {p.buyerName} ({p.buyerPhone})</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-extrabold text-emerald-700">
                          {p.amount.toLocaleString('fr-FR')} FCFA
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {p.status === 'delivered' ? 'Versé sur votre compte' : 'En attente de livraison'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 9. MES PAIEMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">Mes paiements</h3>
                <p className="text-xs text-slate-500">Moyens de paiement mobiles configurés pour le Sénégal</p>
              </div>

              {/* Payment methods list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-500 text-white font-black rounded-xl flex items-center justify-center text-xs">
                      WAVE
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Wave Sénégal</p>
                      <p className="text-[11px] text-slate-600">{currentUser.phone}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                    Actif
                  </span>
                </div>

                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 text-white font-black rounded-xl flex items-center justify-center text-xs">
                      OM
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Orange Money</p>
                      <p className="text-[11px] text-slate-600">{currentUser.phone}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                    Actif
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-800 mb-1">Sécurité des paiements SamaDeal</p>
                Toutes les transactions effectuées via l'application transitent par un compte séquestre certifié. Le vendeur ne reçoit son argent qu'après confirmation par l'acheteur de la conformité de l'article.
              </div>
            </div>
          )}

          {/* 10. MES NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Mes notifications</h3>
                  <p className="text-xs text-slate-500">Alertes sur vos annonces, messages et statut de compte</p>
                </div>
                {unreadNotifsCount > 0 && (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                    {unreadNotifsCount} non lue(s)
                  </span>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Aucune notification pour le moment.</p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      notif.read ? 'bg-white border-slate-200' : 'bg-emerald-50/50 border-emerald-200 shadow-sm'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.type === 'security' ? 'bg-amber-100 text-amber-700' :
                      notif.type === 'escrow' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 11. PARAMÈTRES DE SÉCURITÉ */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-slate-900">Paramètres de sécurité</h3>
                <p className="text-xs text-slate-500">Gérez votre mot de passe, l'authentification OTP et la protection de vos données</p>
              </div>

              {/* Password change */}
              <form onSubmit={handlePasswordChange} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  Changer mon mot de passe
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPasswordInput}
                    onChange={e => setNewPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPasswordInput}
                    onChange={e => setConfirmPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition"
                >
                  Mettre à jour le mot de passe
                </button>
              </form>

              {/* 2FA Toggle */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#25D366]" />
                    Double authentification par WhatsApp (2FA)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Exiger un code de sécurité envoyé sur votre WhatsApp au {currentUser.phone} à chaque nouvelle connexion.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    twoFactorActive ? 'bg-[#25D366]' : 'bg-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    twoFactorActive ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Verified Phone badge */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#25D366] shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Numéro vérifié par WhatsApp</h5>
                    <p className="text-[11px] text-slate-600">Votre numéro {currentUser.phone} est certifié conforme au Sénégal.</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-[#E7FFDB] border border-[#25D366]/40 px-2 py-0.5 rounded">
                  Vérifié WhatsApp ✓
                </span>
              </div>
            </div>
          )}

          {/* 12. SUPPRIMER MON COMPTE */}
          {activeTab === 'delete_account' && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xl font-bold text-rose-700">Supprimer mon compte</h3>
                <p className="text-xs text-slate-500">Zone dangereuse - Suppression définitive de vos données</p>
              </div>

              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-900 space-y-1.5 leading-relaxed">
                    <p className="font-bold">Attention, cette action est irréversible !</p>
                    <p>
                      En supprimant votre compte SamaDeal, toutes vos annonces actives seront immédiatement retirées du catalogue, vos conversations seront archivées et vos données personnelles seront effacées conformément aux obligations légales de protection des données au Sénégal.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={deleteUserAccount}
                    className="py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Confirmer la suppression définitive de mon compte</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
