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
  INITIAL_CONVERSATIONS,
  INITIAL_SELLERS,
  SUPER_ADMIN_EMAIL,
  ADMIN_USER,
  DEFAULT_PLATFORM_SETTINGS,
  INITIAL_NOTIFICATIONS,
  CURRENT_USER
} from '../data/mockData';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type SortOption = 'latest' | 'price_asc' | 'price_desc' | 'popular';
export type ActiveTab = 'home' | 'explore' | 'messages' | 'profile' | 'admin';
export type AuthMode = 'login' | 'register' | 'otp' | 'forgot_password';

interface AppContextType {
  listings: Listing[];
  favorites: string[];
  currentUser: Seller | null;
  pendingOtpCode: string;
  pendingPhone: string;
  notifications: AppNotification[];
  isAuthModalOpen: boolean;
  authMode: AuthMode;
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
  loginUser: (identifier: string, pass: string) => Promise<void>;
  registerUser: (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    city: string;
    neighborhood?: string;
    avatar?: string;
  }) => Promise<void>;
  verifyOtp: (code: string) => Promise<boolean>;
  resendOtp: () => Promise<void>;
  resetPasswordRequest: (email: string) => Promise<void>;
  confirmPasswordReset: (code: string, password: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  logoutUser: () => void;
  updateUserProfile: (data: Partial<Seller>) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;

  // Admin exclusive states
  isAdminAuthenticated: boolean;
  superAdminEmail: string;
  allUsers: Seller[];
  platformSettings: PlatformSettings;

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

  loginAsAdmin: (email: string, pin: string) => boolean;
  logoutAdmin: () => void;
  toggleUserVerification: (userId: string) => void;
  toggleUserBlocked: (userId: string) => void;
  adminDeleteListing: (listingId: string) => void;
  adminToggleBoost: (listingId: string) => void;
  releaseEscrowFunds: (paymentId: string) => void;
  refundEscrowPayment: (paymentId: string) => void;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;

  toggleFavorite: (id: string) => void;
  openListingDetail: (listing: Listing) => void;
  closeListingDetail: () => void;
  addListing: (newListing: any) => void;
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
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<Seller | null>(null);
  const [pendingOtpCode, setPendingOtpCode] = useState('4829');
  const [pendingPhone, setPendingPhone] = useState('+221 77 452 89 12');
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
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('samadeal_admin_auth');
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

  const verifyOtp = async (code: string): Promise<boolean> => { return true; };
  const resendOtp = async (): Promise<void> => {};
  const resetPasswordRequest = async (email: string): Promise<void> => {};
  const confirmPasswordReset = async (code: string, password: string): Promise<void> => {};
  const resendVerificationEmail = async (): Promise<void> => { if (auth.currentUser) await sendEmailVerification(auth.currentUser); };
  const logoutUser = async (): Promise<void> => { await signOut(auth); };
  const updateUserProfile = async (data: Partial<Seller>): Promise<void> => { if (currentUser) { await setDoc(doc(db, 'users', currentUser.id), data, { merge: true }); setCurrentUser({ ...currentUser, ...data }); } };
  const deleteUserAccount = async (): Promise<void> => {};
  const markNotificationAsRead = (id: string) => {};
  const switchUserAccount = (userId: string) => {};
  const toggleFavorite = (id: string) => {};
  const openListingDetail = (listing: Listing) => {};
  const closeListingDetail = () => {};
  const addListing = (newListing: any) => {};
  const deleteListing = (id: string) => {};
  const markAsSold = (id: string) => {};
  const boostListing = (id: string) => {};
  const startChatWithSeller = (listing: Listing) => {};
  const sendMessage = (cid: string, text: string) => {};
  const respondToOffer = (cid: string, mid: string, acc: boolean) => {};
  const initiateEscrowPayment = (l: Listing, m: any, d: any) => {};
  const confirmEscrowDelivery = (pid: string) => {};
  const submitReport = (lid: string, lt: string, r: string, d: string) => {};
  const resolveReport = (rid: string, a: any) => {};
  const showToast = (text: string) => {};
  const loginAsAdmin = (e: string, p: string): boolean => true;
  const logoutAdmin = () => {};
  const toggleUserVerification = (uid: string) => {};
  const toggleUserBlocked = (uid: string) => {};
  const adminDeleteListing = (lid: string) => {};
  const adminToggleBoost = (lid: string) => {};
  const releaseEscrowFunds = (pid: string) => {};
  const refundEscrowPayment = (pid: string) => {};
  const updatePlatformSettings = (s: any) => {};

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as Seller;
          setCurrentUser({
            ...userData,
            email: firebaseUser.email || userData.email,
            emailVerified: firebaseUser.emailVerified,
            whatsappVerified: userData.whatsappVerified || false
          });
        }
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        listings,
        favorites,
        currentUser,
        pendingOtpCode,
        pendingPhone,
        notifications,
        isAuthModalOpen,
        authMode,
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
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        loginUser: async (i, p) => {},
        registerUser: async (d) => {},
        verifyOtp,
        resendOtp,
        resetPasswordRequest,
        confirmPasswordReset,
        logoutUser,
        updateUserProfile,
        deleteUserAccount,
        markNotificationAsRead,
        switchUserAccount,
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
        resetFilters: () => {},
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
        showToast,
        resendVerificationEmail
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
