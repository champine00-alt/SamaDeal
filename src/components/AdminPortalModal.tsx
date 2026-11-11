import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Trash2, 
  AlertTriangle, 
  Package, 
  Users, 
  DollarSign, 
  ExternalLink,
  Sparkles,
  Lock,
  LogOut,
  Sliders,
  CheckCircle2,
  XCircle,
  Truck,
  Search,
  Filter,
  Check,
  RotateCcw,
  RefreshCw,
  TrendingUp,
  Percent,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPortalModal: React.FC = () => {
  const { 
    isAdminModalOpen, 
    setIsAdminModalOpen, 
    isAdminAuthenticated,
    superAdminEmail,
    logoutAdmin,
    listings, 
    allUsers,
    escrowPayments, 
    reports, 
    resolveReport, 
    toggleUserVerification,
    toggleUserBlocked,
    adminDeleteUser,
    refreshUsersFromFirestore,
    adminDeleteListing,
    adminToggleBoost,
    releaseEscrowFunds,
    refundEscrowPayment,
    platformSettings,
    updatePlatformSettings,
    openListingDetail
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'users' | 'escrow' | 'reports' | 'settings'>('overview');
  const [listingSearch, setListingSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Local settings state for live edits
  const [feePercent, setFeePercent] = useState(platformSettings.escrowFeePercent);
  const [boostFee, setBoostFee] = useState(platformSettings.boostPriceFCFA);
  const [maintenance, setMaintenance] = useState(platformSettings.maintenanceMode);
  const [autoApprove, setAutoApprove] = useState(platformSettings.autoApproveListings);

  // If not authenticated as admin, this portal is completely closed and invisible
  if (!isAdminModalOpen || !isAdminAuthenticated) return null;

  // Financial statistics
  const totalEscrowVolume = escrowPayments.reduce((acc, p) => acc + p.total, 0);
  const totalCommissionsEarned = escrowPayments.reduce((acc, p) => acc + p.fee, 0);
  const totalBoostRevenue = listings.filter(l => l.isFeatured).length * platformSettings.boostPriceFCFA;
  const totalPlatformRevenue = totalCommissionsEarned + totalBoostRevenue;

  const pendingReports = reports.filter(r => r.status === 'pending');
  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = listings.filter(l => l.status === 'sold');

  // Filter listings in admin view
  const filteredAdminListings = listings.filter(l => {
    if (!listingSearch.trim()) return true;
    const q = listingSearch.toLowerCase();
    return l.title.toLowerCase().includes(q) || l.seller.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q);
  });

  // Filter users in admin view
  const filteredUsers = allUsers.filter(u => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q)) || u.phone.includes(q);
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      escrowFeePercent: Number(feePercent),
      boostPriceFCFA: Number(boostFee),
      maintenanceMode: maintenance,
      autoApproveListings: autoApprove
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md font-black text-lg">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">Espace Administrateur SamaDeal</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Accès Propriétaire
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connecté en tant que <strong className="text-slate-200">{superAdminEmail}</strong> (seul vous avez cet accès)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Lock Admin Session */}
            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Verrouiller et masquer l'espace administrateur"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>Verrouiller</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-slate-800 text-slate-300 flex items-center gap-2 overflow-x-auto border-b border-slate-700">
          {[
            { id: 'overview', label: 'Vue d\'ensemble & KPIs', count: null },
            { id: 'listings', label: 'Catalogue Annonces', count: listings.length },
            { id: 'users', label: 'Vendeurs & Membres', count: allUsers.length },
            { id: 'escrow', label: 'Séquestres Wave & OM', count: escrowPayments.length },
            { id: 'reports', label: 'Signalements & Modération', count: pendingReports.length },
            { id: 'settings', label: 'Paramètres Plateforme', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-emerald-800 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Viewport */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          {/* TAB 1: OVERVIEW / KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Revenue & Performance Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                    <span>Chiffre d'Affaires SamaDeal</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black font-mono text-emerald-700">
                    {totalPlatformRevenue.toLocaleString('fr-FR')} <span className="text-xs font-normal">FCFA</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Commissions (1.5%) + Boosts sponsorisés
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                    <span>Volume Wave & OM sous séquestre</span>
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900">
                    {totalEscrowVolume.toLocaleString('fr-FR')} <span className="text-xs font-normal">FCFA</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Transactions protégées par séquestre
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                    <span>Annonces en ligne</span>
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900">
                    {listings.length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {activeListings.length} actives · {soldListings.length} vendues
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                    <span>Membres & Vendeurs</span>
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900">
                    {allUsers.length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {allUsers.filter(u => u.emailVerified).length} vendeurs vérifiés
                  </p>
                </div>
              </div>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Escrow Activity */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Dernières transactions sous séquestre
                    </h4>
                    <button
                      onClick={() => setActiveTab('escrow')}
                      className="text-xs text-emerald-600 font-bold hover:underline"
                    >
                      Voir tout
                    </button>
                  </div>
                  <div className="space-y-3">
                    {escrowPayments.slice(0, 3).map((p) => (
                      <div key={p.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900 truncate max-w-[200px]">{p.listingTitle}</div>
                          <div className="text-[11px] text-slate-500">
                            Acheteur : {p.buyerName} · {p.paymentMethod === 'wave' ? 'Wave' : 'Orange Money'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-emerald-700">{p.total.toLocaleString('fr-FR')} F</div>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            {p.status === 'delivered' ? 'Livré' : 'En séquestre'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moderation Alerts */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <span>Signalements nécessitant votre avis</span>
                      {pendingReports.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </h4>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="text-xs text-emerald-600 font-bold hover:underline"
                    >
                      Traiter ({pendingReports.length})
                    </button>
                  </div>

                  {pendingReports.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                      ✅ Aucun signalement en attente. Votre communauté est sereine.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {pendingReports.slice(0, 2).map((r) => (
                        <div key={r.id} className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-xs">
                          <div className="font-bold text-slate-900">{r.listingTitle}</div>
                          <div className="text-red-700 font-semibold mt-0.5">{r.reason}</div>
                          <div className="text-slate-500 text-[11px] mt-0.5">"{r.details}"</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LISTINGS CATALOG */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Rechercher par titre, vendeur, ville..."
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {filteredAdminListings.length} annonces répertoriées
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Article</th>
                        <th className="py-3 px-3">Prix FCFA</th>
                        <th className="py-3 px-3">Vendeur</th>
                        <th className="py-3 px-3">Ville</th>
                        <th className="py-3 px-3">Statut</th>
                        <th className="py-3 px-3 text-right">Actions Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAdminListings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={listing.images[0]} 
                                alt="" 
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" 
                              />
                              <div className="min-w-0 max-w-[220px]">
                                <div className="font-bold text-slate-900 truncate">{listing.title}</div>
                                <div className="text-[10px] text-slate-400">{listing.condition}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            {listing.price.toLocaleString('fr-FR')} F
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800">{listing.seller.name}</div>
                            <div className="text-[10px] text-slate-400">{listing.seller.phone}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            {listing.city} {listing.neighborhood ? `(${listing.neighborhood})` : ''}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1">
                              {listing.status === 'sold' ? (
                                <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded">
                                  Vendu
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                                  En ligne
                                </span>
                              )}
                              {listing.isFeatured && (
                                <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-black rounded">
                                  BOOST
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => adminToggleBoost(listing.id)}
                                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                  listing.isFeatured
                                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                                title={listing.isFeatured ? 'Retirer le boost' : 'Booster l\'annonce'}
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openListingDetail(listing)}
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                title="Voir l'annonce"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => adminDeleteListing(listing.id)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Supprimer définitivement"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USERS & SELLERS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Header card with Admin banner */}
              <div className="bg-white rounded-xl shadow-xs p-4 border-l-4 border-red-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    🛡️ Panneau d'Administration Suprême - SamaDeal
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Espace restreint et sécurisé. Vous disposez des droits absolus de gestion et de modération sur Cloud Firestore.
                  </p>
                </div>
                <button
                  onClick={() => refreshUsersFromFirestore()}
                  className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Actualiser la liste (Firestore)</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email, téléphone..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {filteredUsers.length} utilisateurs enregistrés
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Utilisateur</th>
                        <th className="py-3 px-3">Contact / Email</th>
                        <th className="py-3 px-3">Rôle</th>
                        <th className="py-3 px-3">Badge Vérifié</th>
                        <th className="py-3 px-3 text-right">Actions de Modération</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={user.avatar} 
                                alt="" 
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" 
                              />
                              <div>
                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                  <span>{user.name}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  UID: {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-700">{user.email || 'Non renseigné'}</div>
                            <div className="text-[10px] text-slate-400">{user.phone}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : user.role === 'vendeur'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role || 'acheteur'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={() => toggleUserVerification(user.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                                user.emailVerified
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{user.emailVerified ? 'Vérifié' : 'Non vérifié'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => toggleUserBlocked(user.id)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                    user.isBlocked
                                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                  }`}
                                >
                                  {user.isBlocked ? 'Débloquer' : 'Suspendre'}
                                </button>
                              )}
                              
                              <button
                                onClick={async () => {
                                  const targetUid = user.id || (user as any).uid || '';
                                  if (window.confirm(`⚠️ ATTENTION : Voulez-vous vraiment supprimer définitivement le compte de ${user.email || user.name} ? Cette action est irréversible.`)) {
                                    await adminDeleteUser(targetUid, user.email || user.name);
                                  }
                                }}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition shadow-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer le compte</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ESCROW TRANSACTIONS */}
          {activeTab === 'escrow' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3 text-xs text-emerald-950">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Supervision Séquestre Wave & Orange Money</h4>
                  <p className="mt-0.5 leading-relaxed text-emerald-800">
                    En tant qu'administrateur suprême, vous avez le pouvoir de débloquer les fonds en faveur du vendeur ou de rembourser immédiatement l'acheteur en cas de litige non résolu.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Transaction / Article</th>
                        <th className="py-3 px-3">Montant Total</th>
                        <th className="py-3 px-3">Commission SamaDeal</th>
                        <th className="py-3 px-3">Méthode</th>
                        <th className="py-3 px-3">Statut</th>
                        <th className="py-3 px-3 text-right">Arbitrage Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {escrowPayments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{p.listingTitle}</div>
                            <div className="text-[10px] text-slate-500">
                              Acheteur : {p.buyerName} ({p.buyerPhone}) → Vendeur : {p.sellerName}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            {p.total.toLocaleString('fr-FR')} FCFA
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                            +{p.fee.toLocaleString('fr-FR')} FCFA
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              p.paymentMethod === 'wave' ? 'bg-sky-100 text-sky-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {p.paymentMethod === 'wave' ? 'Wave Sénégal' : 'Orange Money'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'refunded'
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {p.status === 'delivered' ? 'Fonds versés' : p.status === 'refunded' ? 'Remboursé' : 'Sous séquestre'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {p.status === 'in_escrow' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => releaseEscrowFunds(p.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow-sm"
                                  title="Libérer les fonds au vendeur"
                                >
                                  Payer Vendeur
                                </button>
                                <button
                                  onClick={() => refundEscrowPayment(p.id)}
                                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-[10px]"
                                  title="Rembourser l'acheteur"
                                >
                                  Rembourser
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400">Clôturé</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REPORTS & MODERATION */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Signalements émis par les utilisateurs ({reports.length})
              </h4>

              {reports.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
                  Aucun signalement en attente.
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{report.listingTitle}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            report.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : report.status === 'resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {report.status === 'pending' ? 'À traiter' : report.status === 'resolved' ? 'Résolu' : 'Rejeté'}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-red-600">
                          Motif : {report.reason}
                        </div>
                        <p className="text-xs text-slate-600">
                          "{report.details}"
                        </p>
                        <div className="text-[10px] text-slate-400">
                          Signalé le {report.createdAt}
                        </div>
                      </div>

                      {report.status === 'pending' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => resolveReport(report.id, 'dismiss')}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                          >
                            Classer sans suite
                          </button>
                          <button
                            onClick={() => resolveReport(report.id, 'remove_listing')}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Supprimer l'annonce</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Paramètres de la plateforme SamaDeal</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ces réglages influent directement sur le modèle économique et les frais de service.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Commission de protection séquestre (%)
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={feePercent}
                      onChange={(e) => setFeePercent(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Actuellement {platformSettings.escrowFeePercent}% sur chaque transaction Wave / OM sécurisée.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Tarif SamaDeal Boost (FCFA)
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      step="100"
                      min="500"
                      value={boostFee}
                      onChange={(e) => setBoostFee(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">FCFA</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Prix facturé aux vendeurs pour 7 jours de sponsorisation.
                  </span>
                </div>

                <div className="pt-2 space-y-3 border-t border-slate-100">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoApprove}
                      onChange={(e) => setAutoApprove(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-semibold text-slate-800">
                      Validation automatique des nouvelles annonces
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintenance}
                      onChange={(e) => setMaintenance(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
                    />
                    <span className="text-xs font-semibold text-red-700">
                      Activer le mode maintenance temporaire
                    </span>
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    Enregistrer les paramètres
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
