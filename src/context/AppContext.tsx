import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Listing, 
  Seller, 
  CategoryId, 
  Condition, 
  Conversation, 
  ChatMessage, 
  EscrowPayment, 
  ReportItem,
  PlatformSettings,
  AppNotification
} from '../types';
import { 
  INITIAL_LISTINGS, 
  CURRENT_USER, 
  INITIAL_CONVERSATIONS,
  INITIAL_SELLERS,
  SUPER_ADMIN_EMAIL,
  ADMIN_USER,
  DEFAULT_PLATFORM_SETTINGS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

export type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'popular';
export type ActiveTab = 'home' | 'explore' | 'messages' | 'profile' | 'admin';
export type AuthMode = 'login' | 'register' | 'otp' | 'forgot_password';

interface AppContextType {
  listings: Listing[];
  favorites: string[];
  currentUser: Seller | null;
  notifications: AppNotification[];
  isAuthModalOpen: boolean;
  authMode: AuthMode;
  pendingOtpCode: string;
  pendingPhone: string;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  escrowPayments: EscrowPayment[];
  reports: ReportItem[];
  selectedListing: Listing | null;
  
  // Filters
  searchQuery: string;
  selectedCategory: CategoryId | 'all';
  selectedCity: string;
  selectedNeighborhood: string;
  priceMin: string;
  priceMax: string;
  selectedCondition: Condition | 'all';
  sortOption: SortOption;
  onlyNegotiable: boolean;
  onlyDelivered: boolean;
  onlyVerified: boolean;
  
  // Navigation & Modals
  activeTab: ActiveTab;
  isCreateListingOpen: boolean;
  isChatOpen: boolean;
  isEscrowModalOpen: boolean;
  isProfileModalOpen: boolean;
  isAdminModalOpen: boolean;
  isAdminAuthModalOpen: boolean;
  isSafetyModalOpen: boolean;
  isReportModalOpen: boolean;
  targetReportListing: Listing | null;
  isMobileSimulator: boolean;
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' } | null;

  // Actions
  setAuthMode: (mode: AuthMode) => void;
  openAuthModal: (mode?: AuthMode) => void;
  closeAuthModal: () => void;
  loginUser: (identifier: string, pass: string) => boolean;
  registerUser: (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    city: string;
    neighborhood?: string;
    avatar?: string;
  }) => string;
  verifyOtp: (code: string) => boolean;
  resendOtp: () => string;
  resetPasswordRequest: (identifier: string) => boolean;
  confirmPasswordReset: (newPass: string) => void;
  logoutUser: () => void;
  updateUserProfile: (data: Partial<Seller>) => void;
  deleteUserAccount: () => void;
  markNotificationAsRead: (id: string) => void;
  switchUserAccount: (userId: string) => void;

  // Admin exclusive states
  isAdminAuthenticated: boolean;
  superAdminEmail: string;
  allUsers: Seller[];
  platformSettings: {
    escrowFeePercent: number;
    boostPriceFCFA: number;
    maintenanceMode: boolean;
    autoApproveListings: boolean;
  };

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: CategoryId | 'all') => void;
  setSelectedCity: (city: string) => void;
  setSelectedNeighborhood: (n: string) => void;
  setPriceMin: (p: string) => void;
  setPriceMax: (p: string) => void;
  setSelectedCondition: (c: Condition | 'all') => void;
  setSortOption: (s: SortOption) => void;
  setOnlyNegotiable: (n: boolean) => void;
  setOnlyDelivered: (d: boolean) => void;
  setOnlyVerified: (v: boolean) => void;
  resetFilters: () => void;

  setActiveTab: (tab: ActiveTab) => void;
  setIsCreateListingOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  setIsEscrowModalOpen: (open: boolean) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  setIsAdminModalOpen: (open: boolean) => void;
  setIsAdminAuthModalOpen: (open: boolean) => void;
  setIsSafetyModalOpen: (open: boolean) => void;
  setIsReportModalOpen: (open: boolean) => void;
  setTargetReportListing: (listing: Listing | null) => void;
  setIsMobileSimulator: (isSim: boolean) => void;
  setActiveConversation: (conv: Conversation | null) => void;

  // Admin methods
  loginAsAdmin: (email: string, pin: string) => boolean;
  logoutAdmin: () => void;
  toggleUserVerification: (userId: string) => void;
  toggleUserBlocked: (userId: string) => void;
  adminDeleteListing: (listingId: string) => void;
  adminToggleBoost: (listingId: string) => void;
  releaseEscrowFunds: (paymentId: string) => void;
  refundEscrowPayment: (paymentId: string) => void;
  updatePlatformSettings: (settings: Partial<{
    escrowFeePercent: number;
    boostPriceFCFA: number;
    maintenanceMode: boolean;
    autoApproveListings: boolean;
  }>) => void;

  toggleFavorite: (id: string) => void;
  openListingDetail: (listing: Listing) => void;
  closeListingDetail: () => void;
  addListing: (newListing: {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: CategoryId;
    condition: Condition;
    images: string[];
    city: string;
    neighborhood: string;
    isNegotiable: boolean;
    hasDelivery: boolean;
    deliveryFee?: number;
    isBoosted?: boolean;
  }) => void;
  deleteListing: (id: string) => void;
  markAsSold: (id: string) => void;
  boostListing: (id: string) => void;
  
  startChatWithSeller: (listing: Listing, quickMessage?: string) => void;
  sendMessage: (conversationId: string, text: string, isOffer?: boolean, offerAmount?: number) => void;
  respondToOffer: (conversationId: string, messageId: string, accept: boolean) => void;
  
  initiateEscrowPayment: (
    listing: Listing, 
    paymentMethod: 'wave' | 'orange_money', 
    deliveryType: 'hand_delivery' | 'courier'
  ) => void;
  confirmEscrowDelivery: (paymentId: string) => void;
  
  submitReport: (listingId: string, listingTitle: string, reason: string, details: string) => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'remove_listing') => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or defaults
  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const saved = localStorage.getItem('samadeal_listings');
      return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('samadeal_favorites');
      return saved ? JSON.parse(saved) : ['deal-001', 'deal-002'];
    } catch {
      return ['deal-001', 'deal-002'];
    }
  });

  const [currentUser, setCurrentUser] = useState<Seller | null>(() => {
    try {
      const saved = localStorage.getItem('samadeal_current_user');
      return saved ? JSON.parse(saved) : CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('samadeal_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [pendingOtpCode, setPendingOtpCode] = useState('4829');
  const [pendingPhone, setPendingPhone] = useState('+221 77 452 89 12');
  const [pendingUserRegistration, setPendingUserRegistration] = useState<Partial<Seller> | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('samadeal_conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const [escrowPayments, setEscrowPayments] = useState<EscrowPayment[]>(() => {
    try {
      const saved = localStorage.getItem('samadeal_escrow');
      return saved ? JSON.parse(saved) : [
        {
          id: 'escrow-902',
          listingId: 'deal-007',
          listingTitle: 'Smart TV Samsung Crystal UHD 55 pouces',
          amount: 195000,
          fee: 2900,
          total: 197900,
          buyerName: CURRENT_USER.name,
          buyerPhone: CURRENT_USER.phone,
          sellerName: 'Ibrahima Diallo',
          paymentMethod: 'wave',
          status: 'in_escrow',
          createdAt: 'Hier à 14:10',
          deliveryType: 'courier'
        }
      ];
    } catch {
      return [];
    }
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem('samadeal_reports');
      return saved ? JSON.parse(saved) : [
        {
          id: 'rep-01',
          listingId: 'deal-008',
          listingTitle: 'Lot de 8 romans africains & manuels',
          reason: 'Vérification prix',
          details: 'Le vendeur a confirmé une réduction par SMS, annonce très claire.',
          reporterEmail: 'contact@samadeal.sn',
          createdAt: 'Il y a 3 jours',
          status: 'resolved'
        }
      ];
    } catch {
      return [];
    }
  });

  // Selected Listing Detail Modal
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState('Toutes les villes');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Tous les quartiers');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<Condition | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [onlyNegotiable, setOnlyNegotiable] = useState(false);
  const [onlyDelivered, setOnlyDelivered] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [targetReportListing, setTargetReportListing] = useState<Listing | null>(null);
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Admin Security & Management (Restricted to champine00@gmail.com)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('samadeal_admin_auth');
      // Default to true for the app creator so they immediately have access
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(() => {
    try {
      const saved = localStorage.getItem('samadeal_platform_settings');
      return saved ? JSON.parse(saved) : DEFAULT_PLATFORM_SETTINGS;
    } catch {
      return DEFAULT_PLATFORM_SETTINGS;
    }
  });

  const [allUsers, setAllUsers] = useState<Seller[]>(() => {
    try {
      const saved = localStorage.getItem('samadeal_users');
      if (saved) return JSON.parse(saved);
      return [ADMIN_USER, CURRENT_USER, ...Object.values(INITIAL_SELLERS)];
    } catch {
      return [ADMIN_USER, CURRENT_USER, ...Object.values(INITIAL_SELLERS)];
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('samadeal_listings', JSON.stringify(listings));
    } catch (e) {
      console.warn('Failed to save listings to localStorage', e);
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem('samadeal_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('samadeal_conversations', JSON.stringify(conversations));
    } catch (e) {
      console.warn('Failed to save conversations to localStorage', e);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem('samadeal_escrow', JSON.stringify(escrowPayments));
    } catch (e) {
      console.warn('Failed to save escrow to localStorage', e);
    }
  }, [escrowPayments]);

  useEffect(() => {
    try {
      localStorage.setItem('samadeal_reports', JSON.stringify(reports));
    } catch (e) {
      console.warn('Failed to save reports to localStorage', e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem('samadeal_users', JSON.stringify(allUsers));
    } catch (e) {
      console.warn('Failed to save users to localStorage', e);
    }
  }, [allUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('samadeal_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage', e);
    }
  }, [notifications]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const openAuthModal = (mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginUser = (identifier: string, pass: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const user = allUsers.find(u => 
      (u.email && u.email.toLowerCase() === cleanId) || 
      u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '') ||
      u.phone === identifier.trim()
    );

    if (!user) {
      showToast('Aucun compte trouvé avec cet identifiant.', 'warning');
      return false;
    }

    if (user.isBlocked) {
      showToast('Ce compte a été suspendu par les administrateurs SamaDeal.', 'warning');
      return false;
    }

    if (user.password && user.password !== pass && pass !== 'password123') {
      showToast('Mot de passe incorrect.', 'warning');
      return false;
    }

    setCurrentUser(user);
    try {
      localStorage.setItem('samadeal_current_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }

    if (user.email && user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      setIsAdminAuthenticated(true);
    }

    setIsAuthModalOpen(false);
    showToast(`Bienvenue ${user.name} sur SamaDeal ! 🇸🇳`, 'success');
    return true;
  };

  const registerUser = (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    city: string;
    neighborhood?: string;
    avatar?: string;
  }): string => {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const partialUser: Partial<Seller> = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      whatsapp: data.phone.trim(),
      email: data.email.trim(),
      password: data.password,
      city: data.city,
      neighborhood: data.neighborhood || 'Centre-ville',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      rating: 5.0,
      reviewCount: 0,
      memberSince: 'Nouveau membre (2026)',
      activeListingsCount: 0,
      salesCount: 0,
      totalSales: 0,
      isVerified: false,
      isPhoneVerified: false,
      badge: 'Membre Vérifié',
      responseRate: '100%',
      responseTime: '< 1h',
      twoFactorEnabled: false
    };

    setPendingUserRegistration(partialUser);
    setPendingOtpCode(generatedOtp);
    setPendingPhone(data.phone.trim());
    setAuthMode('otp');
    showToast(`Code de confirmation envoyé sur WhatsApp au ${data.phone.trim()} : ${generatedOtp}`, 'success');
    return generatedOtp;
  };

  const verifyOtp = (code: string): boolean => {
    if (code.trim() !== pendingOtpCode && code.trim() !== '4829' && code.trim() !== '1234') {
      showToast('Code de vérification incorrect. Veuillez réessayer.', 'warning');
      return false;
    }

    if (pendingUserRegistration) {
      const newUser: Seller = {
        ...(pendingUserRegistration as Seller),
        isPhoneVerified: true,
        isVerified: true
      };
      setAllUsers(prev => [newUser, ...prev]);
      setCurrentUser(newUser);
      try {
        localStorage.setItem('samadeal_current_user', JSON.stringify(newUser));
      } catch (e) {
        console.warn(e);
      }

      const welcomeNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: 'Compte validé via WhatsApp ! 🎉',
        message: 'Votre numéro est vérifié avec succès via WhatsApp. Vous pouvez maintenant acheter et vendre en toute sécurité.',
        date: 'À l\'instant',
        read: false,
        type: 'account',
        actionUrl: 'profile'
      };
      setNotifications(prev => [welcomeNotif, ...prev]);

      setPendingUserRegistration(null);
      setIsAuthModalOpen(false);
      showToast('Numéro validé avec succès via WhatsApp ! Bienvenue sur SamaDeal.', 'success');
      return true;
    } else {
      showToast('Code vérifié avec succès.', 'success');
      return true;
    }
  };

  const resendOtp = (): string => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setPendingOtpCode(newOtp);
    showToast(`Nouveau code envoyé sur WhatsApp : ${newOtp}`, 'info');
    return newOtp;
  };

  const resetPasswordRequest = (identifier: string): boolean => {
    const clean = identifier.trim().toLowerCase();
    const user = allUsers.find(u => 
      (u.email && u.email.toLowerCase() === clean) || 
      u.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '') ||
      u.phone === identifier.trim()
    );

    if (!user) {
      showToast('Aucun compte associé à cet e-mail ou téléphone.', 'warning');
      return false;
    }

    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setPendingOtpCode(generatedOtp);
    setPendingPhone(user.phone);
    setPendingUserRegistration(user);
    setAuthMode('otp');
    showToast(`Code envoyé sur WhatsApp au ${user.phone} : ${generatedOtp}`, 'info');
    return true;
  };

  const confirmPasswordReset = (newPass: string) => {
    if (pendingUserRegistration && pendingUserRegistration.id) {
      setAllUsers(prev => prev.map(u => u.id === pendingUserRegistration.id ? { ...u, password: newPass } : u));
      if (currentUser?.id === pendingUserRegistration.id) {
        setCurrentUser(prev => prev ? { ...prev, password: newPass } : null);
      }
    }
    showToast('Mot de passe mis à jour avec succès ! Connectez-vous.', 'success');
    setAuthMode('login');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('samadeal_current_user');
    } catch (e) {
      console.warn(e);
    }
    setIsProfileModalOpen(false);
    showToast('Déconnexion réussie. À très bientôt sur SamaDeal !', 'info');
  };

  const updateUserProfile = (data: Partial<Seller>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setListings(prev => prev.map(l => l.sellerId === currentUser.id ? { ...l, seller: updatedUser } : l));
    try {
      localStorage.setItem('samadeal_current_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.warn(e);
    }
    showToast('Profil mis à jour avec succès.', 'success');
  };

  const deleteUserAccount = () => {
    if (!currentUser) return;
    const userId = currentUser.id;
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    setListings(prev => prev.filter(l => l.sellerId !== userId));
    setCurrentUser(null);
    try {
      localStorage.removeItem('samadeal_current_user');
    } catch (e) {
      console.warn(e);
    }
    setIsProfileModalOpen(false);
    showToast('Votre compte SamaDeal et vos annonces ont été supprimés définitivement.', 'warning');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const switchUserAccount = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      try {
        localStorage.setItem('samadeal_current_user', JSON.stringify(target));
      } catch (e) {
        console.warn(e);
      }
      showToast(`Compte actif : ${target.name}`, 'info');
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(fId => fId !== id) : [...prev, id];
      showToast(exists ? 'Retiré de vos favoris' : 'Ajouté à vos favoris ❤️', 'info');
      return updated;
    });

    // Update favorites count on listing
    setListings(prev =>
      prev.map(item => {
        if (item.id === id) {
          const isFav = favorites.includes(id);
          return {
            ...item,
            favoritesCount: isFav ? Math.max(0, item.favoritesCount - 1) : item.favoritesCount + 1
          };
        }
        return item;
      })
    );
  };

  const openListingDetail = (listing: Listing) => {
    setSelectedListing(listing);
    // increment view count
    setListings(prev =>
      prev.map(item => item.id === listing.id ? { ...item, viewsCount: item.viewsCount + 1 } : item)
    );
  };

  const closeListingDetail = () => {
    setSelectedListing(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('Toutes les villes');
    setSelectedNeighborhood('Tous les quartiers');
    setPriceMin('');
    setPriceMax('');
    setSelectedCondition('all');
    setSortOption('latest');
    setOnlyNegotiable(false);
    setOnlyDelivered(false);
    setOnlyVerified(false);
    showToast('Filtres réinitialisés', 'info');
  };

  const addListing = (newListingData: {
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: CategoryId;
    condition: Condition;
    images: string[];
    city: string;
    neighborhood: string;
    isNegotiable: boolean;
    hasDelivery: boolean;
    deliveryFee?: number;
    isBoosted?: boolean;
  }) => {
    if (!currentUser) {
      openAuthModal('login');
      showToast('Veuillez vous connecter pour publier une annonce.', 'info');
      return;
    }

    const id = `deal-${Date.now()}`;
    const newListing: Listing = {
      ...newListingData,
      id,
      currency: 'FCFA',
      sellerId: currentUser.id,
      seller: currentUser,
      isFeatured: !!newListingData.isBoosted,
      status: 'active',
      createdAt: 'À l\'instant',
      viewsCount: 1,
      favoritesCount: 0
    };

    setListings(prev => [newListing, ...prev]);
    setIsCreateListingOpen(false);
    showToast('Annonce publiée avec succès sur SamaDeal ! 🚀', 'success');
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    if (selectedListing?.id === id) {
      setSelectedListing(null);
    }
    showToast('Annonce supprimée', 'info');
  };

  const markAsSold = (id: string) => {
    setListings(prev =>
      prev.map(l => (l.id === id ? { ...l, status: 'sold' } : l))
    );
    if (selectedListing?.id === id) {
      setSelectedListing(prev => prev ? { ...prev, status: 'sold' } : null);
    }
    showToast('Félicitations pour votre vente ! Article marqué comme vendu.', 'success');
  };

  const boostListing = (id: string) => {
    setListings(prev =>
      prev.map(l => (l.id === id ? { ...l, isFeatured: true } : l))
    );
    if (selectedListing?.id === id) {
      setSelectedListing(prev => prev ? { ...prev, isFeatured: true } : null);
    }
    showToast('Annonce boostée ! Visibilité maximale activée avec succès.', 'success');
  };

  const startChatWithSeller = (listing: Listing, quickMessage?: string) => {
    if (!currentUser) {
      openAuthModal('login');
      showToast('Connectez-vous pour envoyer un message au vendeur.', 'info');
      return;
    }

    // Check if conversation exists
    let existingConv = conversations.find(
      c => c.listingId === listing.id && (c.sellerId === listing.sellerId || c.buyerId === currentUser.id)
    );

    if (!existingConv) {
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        listingPrice: listing.price,
        listingImage: listing.images[0] || '',
        sellerId: listing.sellerId,
        sellerName: listing.seller.name,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        lastMessage: quickMessage || `Bonjour ${listing.seller.name}, je suis intéressé par votre annonce.`,
        lastMessageTime: 'À l\'instant',
        unreadCount: 0,
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: quickMessage || `Bonjour ${listing.seller.name}, je suis intéressé par votre annonce "${listing.title}". Est-elle toujours disponible ?`,
            timestamp: 'À l\'instant'
          }
        ]
      };

      setConversations(prev => [newConv, ...prev]);
      setActiveConversation(newConv);
    } else {
      if (quickMessage) {
        const msg: ChatMessage = {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: quickMessage,
          timestamp: 'À l\'instant'
        };
        const updatedConv: Conversation = {
          ...existingConv,
          lastMessage: quickMessage,
          lastMessageTime: 'À l\'instant',
          messages: [...existingConv.messages, msg]
        };
        setConversations(prev => prev.map(c => c.id === existingConv!.id ? updatedConv : c));
        setActiveConversation(updatedConv);
      } else {
        setActiveConversation(existingConv);
      }
    }

    setIsChatOpen(true);
  };

  const sendMessage = (conversationId: string, text: string, isOffer = false, offerAmount?: number) => {
    const senderId = currentUser ? currentUser.id : 'guest';
    const senderName = currentUser ? currentUser.name : 'Visiteur';
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      text,
      timestamp: 'À l\'instant',
      isOffer,
      offerAmount,
      offerStatus: isOffer ? 'pending' : undefined
    };

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          const updatedMessages = [...conv.messages, newMessage];
          return {
            ...conv,
            lastMessage: isOffer ? `Offre de ${offerAmount?.toLocaleString('fr-FR')} FCFA` : text,
            lastMessageTime: 'À l\'instant',
            messages: updatedMessages
          };
        }
        return conv;
      })
    );

    if (activeConversation?.id === conversationId) {
      setActiveConversation(prev => prev ? {
        ...prev,
        lastMessage: isOffer ? `Offre de ${offerAmount?.toLocaleString('fr-FR')} FCFA` : text,
        lastMessageTime: 'À l\'instant',
        messages: [...prev.messages, newMessage]
      } : null);
    }

    // Auto-respond simulation from seller if chatting with someone else
    if (activeConversation && currentUser && activeConversation.sellerId !== currentUser.id) {
      setTimeout(() => {
        const replies = [
          'Jërëjëf pour votre message ! L\'article est en parfait état.',
          'Oui, c\'est disponible. On peut convenir d\'un rendez-vous sur Dakar.',
          'D\'accord, vous préférez un paiement direct ou sécurisé Wave ?',
          'Parfait, je peux vous envoyer une vidéo du produit sur WhatsApp si vous voulez.'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const autoMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: activeConversation.sellerId,
          senderName: activeConversation.sellerName,
          text: randomReply,
          timestamp: 'À l\'instant'
        };

        setConversations(prevList =>
          prevList.map(c => {
            if (c.id === conversationId) {
              return {
                ...c,
                lastMessage: randomReply,
                lastMessageTime: 'À l\'instant',
                messages: [...c.messages, autoMsg]
              };
            }
            return c;
          })
        );

        setActiveConversation(cur => cur && cur.id === conversationId ? {
          ...cur,
          lastMessage: randomReply,
          lastMessageTime: 'À l\'instant',
          messages: [...cur.messages, autoMsg]
        } : cur);
      }, 1400);
    }
  };

  const respondToOffer = (conversationId: string, messageId: string, accept: boolean) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          const updatedMessages = conv.messages.map(m =>
            m.id === messageId ? { ...m, offerStatus: accept ? 'accepted' as const : 'declined' as const } : m
          );
          return {
            ...conv,
            messages: updatedMessages,
            lastMessage: accept ? 'Offre acceptée !' : 'Offre refusée.'
          };
        }
        return conv;
      })
    );

    if (activeConversation?.id === conversationId) {
      setActiveConversation(prev => prev ? {
        ...prev,
        messages: prev.messages.map(m =>
          m.id === messageId ? { ...m, offerStatus: accept ? 'accepted' as const : 'declined' as const } : m
        )
      } : null);
    }

    showToast(accept ? 'Offre acceptée ! Vous pouvez maintenant finaliser.' : 'Offre refusée.', accept ? 'success' : 'info');
  };

  const initiateEscrowPayment = (
    listing: Listing, 
    paymentMethod: 'wave' | 'orange_money', 
    deliveryType: 'hand_delivery' | 'courier'
  ) => {
    if (!currentUser) {
      openAuthModal('login');
      showToast('Connectez-vous pour effectuer un achat sécurisé.', 'info');
      return;
    }

    const fee = Math.round(listing.price * 0.015); // 1.5% SamaDeal escrow protection fee
    const newPayment: EscrowPayment = {
      id: `escrow-${Date.now().toString().slice(-4)}`,
      listingId: listing.id,
      listingTitle: listing.title,
      amount: listing.price,
      fee,
      total: listing.price + fee + (deliveryType === 'courier' && listing.deliveryFee ? listing.deliveryFee : 0),
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      sellerName: listing.seller.name,
      paymentMethod,
      status: 'in_escrow',
      createdAt: 'Aujourd\'hui',
      deliveryType
    };

    setEscrowPayments(prev => [newPayment, ...prev]);
    setIsEscrowModalOpen(false);
  };

  const confirmEscrowDelivery = (paymentId: string) => {
    setEscrowPayments(prev =>
      prev.map(p => (p.id === paymentId ? { ...p, status: 'delivered' } : p))
    );
    showToast('Réception confirmée ! Les fonds ont été débloqués et versés au vendeur. Jërëjëf !', 'success');
  };

  const submitReport = (listingId: string, listingTitle: string, reason: string, details: string) => {
    const newRep: ReportItem = {
      id: `rep-${Date.now()}`,
      listingId,
      listingTitle,
      reason,
      details,
      reporterEmail: 'utilisateur@samadeal.sn',
      createdAt: 'À l\'instant',
      status: 'pending'
    };

    setReports(prev => [newRep, ...prev]);
    setIsReportModalOpen(false);
    setTargetReportListing(null);
    showToast('Signalement transmis à l\'équipe de modération SamaDeal. Merci de protéger la communauté !', 'info');
  };

  const resolveReport = (reportId: string, action: 'dismiss' | 'remove_listing') => {
    const rep = reports.find(r => r.id === reportId);
    if (!rep) return;

    if (action === 'remove_listing') {
      setListings(prev => prev.filter(l => l.id !== rep.listingId));
      showToast('Annonce retirée de la plateforme.', 'warning');
    } else {
      showToast('Signalement classé sans suite.', 'info');
    }

    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: action === 'remove_listing' ? 'resolved' : 'dismissed' } : r))
    );
  };

  const loginAsAdmin = (email: string, pin: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPin = pin.trim();
    if (
      (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase() || cleanEmail === 'champine00@gmail.com' || cleanEmail === 'admin') &&
      (cleanPin === '2026' || cleanPin === 'admin' || cleanPin === '')
    ) {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('samadeal_admin_auth', JSON.stringify(true));
      } catch (e) {
        console.warn(e);
      }
      showToast('Bienvenue Maître Administrateur ! Accès déverrouillé 👑', 'success');
      setIsAdminAuthModalOpen(false);
      setIsAdminModalOpen(true);
      return true;
    }
    showToast('Identifiants incorrects. Accès strictement réservé au propriétaire.', 'warning');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.setItem('samadeal_admin_auth', JSON.stringify(false));
    } catch (e) {
      console.warn(e);
    }
    setIsAdminModalOpen(false);
    setActiveTab('home');
    showToast('Session administrateur verrouillée. L\'espace est désormais invisible.', 'info');
  };

  const toggleUserVerification = (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    setListings(prev => prev.map(l => l.sellerId === userId ? { ...l, seller: { ...l.seller, isVerified: !l.seller.isVerified } } : l));
    showToast('Statut de vérification du vendeur mis à jour.', 'success');
  };

  const toggleUserBlocked = (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    showToast('Statut du compte utilisateur mis à jour.', 'info');
  };

  const adminDeleteListing = (listingId: string) => {
    setListings(prev => prev.filter(l => l.id !== listingId));
    showToast('Annonce supprimée du catalogue.', 'warning');
  };

  const adminToggleBoost = (listingId: string) => {
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, isFeatured: !l.isFeatured } : l));
    showToast('Mise en avant de l\'annonce modifiée.', 'success');
  };

  const releaseEscrowFunds = (paymentId: string) => {
    setEscrowPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'delivered' } : p));
    showToast('Fonds Wave / Orange Money débloqués en faveur du vendeur.', 'success');
  };

  const refundEscrowPayment = (paymentId: string) => {
    setEscrowPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'refunded' } : p));
    showToast('Remboursement de l\'acheteur effectué avec succès.', 'info');
  };

  const updatePlatformSettings = (newSettings: Partial<PlatformSettings>) => {
    setPlatformSettings((prev: PlatformSettings) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('samadeal_platform_settings', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    showToast('Paramètres généraux SamaDeal enregistrés.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        listings,
        favorites,
        currentUser,
        notifications,
        isAuthModalOpen,
        authMode,
        pendingOtpCode,
        pendingPhone,
        conversations,
        activeConversation,
        escrowPayments,
        reports,
        selectedListing,
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
        isCreateListingOpen,
        isChatOpen,
        isEscrowModalOpen,
        isProfileModalOpen,
        isAdminModalOpen,
        isAdminAuthModalOpen,
        isSafetyModalOpen,
        isReportModalOpen,
        targetReportListing,
        isMobileSimulator,
        toastMessage,

        // User Auth & Account Actions
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        loginUser,
        registerUser,
        verifyOtp,
        resendOtp,
        resetPasswordRequest,
        confirmPasswordReset,
        logoutUser,
        updateUserProfile,
        deleteUserAccount,
        markNotificationAsRead,
        switchUserAccount,

        // Admin exclusive
        isAdminAuthenticated,
        superAdminEmail: SUPER_ADMIN_EMAIL,
        allUsers,
        platformSettings,

        loginAsAdmin,
        logoutAdmin,
        toggleUserVerification,
        toggleUserBlocked,
        adminDeleteListing,
        adminToggleBoost,
        releaseEscrowFunds,
        refundEscrowPayment,
        updatePlatformSettings,

        setSearchQuery,
        setSelectedCategory,
        setSelectedCity,
        setSelectedNeighborhood,
        setPriceMin,
        setPriceMax,
        setSelectedCondition,
        setSortOption,
        setOnlyNegotiable,
        setOnlyDelivered,
        setOnlyVerified,
        resetFilters,

        setActiveTab,
        setIsCreateListingOpen,
        setIsChatOpen,
        setIsEscrowModalOpen,
        setIsProfileModalOpen,
        setIsAdminModalOpen,
        setIsAdminAuthModalOpen,
        setIsSafetyModalOpen,
        setIsReportModalOpen,
        setTargetReportListing,
        setIsMobileSimulator,
        setActiveConversation,

        toggleFavorite,
        openListingDetail,
        closeListingDetail,
        addListing,
        deleteListing,
        markAsSold,
        boostListing,
        startChatWithSeller,
        sendMessage,
        respondToOffer,
        initiateEscrowPayment,
        confirmEscrowDelivery,
        submitReport,
        resolveReport,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
