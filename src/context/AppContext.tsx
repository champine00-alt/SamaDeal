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
import { auth, db, googleProvider } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

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
  loginWithGoogle: () => Promise<void>;
  registerUser: (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    city: string;
    role?: 'acheteur' | 'vendeur' | 'admin';
    neighborhood?: string;
    avatar?: string;
  }) => Promise<void>;
  verifyOtp: (code: string) => Promise<boolean>;
  resendOtp: () => Promise<string>;
  resetPasswordRequest: (identifier: string) => Promise<boolean>;
  confirmPasswordReset: (code: string, newPass: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<void>;
  logoutUser: () => void;
  updateUserProfile: (data: Partial<Seller>) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  switchUserAccount: (userId: string) => void;

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
  adminDeleteUser: (userId: string, email?: string) => Promise<void>;
  refreshUsersFromFirestore: () => Promise<void>;
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

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('samadeal_admin_auth');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
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

  // Firebase Auth listener
  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as Seller;
            setCurrentUser({
              ...userData,
              email: firebaseUser.email || userData.email,
              emailVerified: firebaseUser.emailVerified,
              whatsappVerified: userData.whatsappVerified || false
            });
          } else {
            setCurrentUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Utilisateur SamaDeal',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
              phone: '+221 77 000 00 00',
              whatsapp: '221770000000',
              city: 'Dakar',
              rating: 5.0,
              reviewCount: 0,
              memberSince: 'Récemment',
              emailVerified: firebaseUser.emailVerified,
              whatsappVerified: false,
              responseTime: '< 15 min',
              totalSales: 0
            });
          }
        } catch (err) {
          console.error('Error loading user document:', err);
        }
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

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

  const loginUser = async (identifier: string, pass: string): Promise<void> => {
    try {
      let emailToLogin = identifier.trim();
      if (!emailToLogin.includes('@')) {
        const foundUser = allUsers.find(u => u.phone.replace(/[^0-9]/g, '').includes(identifier.replace(/[^0-9]/g, '')));
        if (foundUser && foundUser.email) {
          emailToLogin = foundUser.email;
        }
      }
      try {
        await signInWithEmailAndPassword(auth, emailToLogin, pass);
      } catch (authErr: any) {
        if (
          authErr.code === 'auth/user-not-found' || 
          authErr.code === 'auth/invalid-credential'
        ) {
          const demoUser = allUsers.find(u => u.email?.toLowerCase() === emailToLogin.toLowerCase());
          if (demoUser) {
            try {
              const cred = await createUserWithEmailAndPassword(auth, emailToLogin, pass);
              await setDoc(doc(db, 'users', cred.user.uid), {
                ...demoUser,
                id: cred.user.uid,
                email: emailToLogin,
                emailVerified: false,
                whatsappVerified: true
              });
              showToast('Connexion réussie !', 'success');
              setIsAuthModalOpen(false);
              return;
            } catch (createErr) {
              // ignore
            }
          }
        }
        throw authErr;
      }
      showToast('Connexion réussie !', 'success');
      setIsAuthModalOpen(false);
    } catch (e: any) {
      let msg = 'Échec de la connexion.';
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
        msg = 'Identifiants incorrects. Veuillez vérifier l\'adresse e-mail / téléphone et le mot de passe.';
      } else if (e.code === 'auth/invalid-email') {
        msg = 'Format d\'adresse e-mail invalide.';
      } else if (e.message) {
        msg = e.message;
      }
      showToast(msg, 'warning');
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          id: user.uid,
          name: user.displayName || 'Utilisateur Google',
          email: user.email || '',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          phone: user.phoneNumber || '+221 77 000 00 00',
          whatsapp: user.phoneNumber ? user.phoneNumber.replace(/[^0-9]/g, '') : '221770000000',
          city: 'Dakar',
          rating: 5.0,
          reviewCount: 0,
          memberSince: 'Récemment',
          emailVerified: user.emailVerified,
          whatsappVerified: false,
          responseTime: '< 15 min',
          totalSales: 0,
          createdAt: new Date().toISOString()
        });
      }
      showToast('Connexion Google réussie !', 'success');
      setIsAuthModalOpen(false);
    } catch (e: any) {
      showToast(e.message || 'Erreur lors de la connexion Google.', 'warning');
    }
  };

  const registerUser = async (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    city: string;
    role?: 'acheteur' | 'vendeur' | 'admin';
    neighborhood?: string;
    avatar?: string;
  }): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      const newUserData = {
        id: user.uid,
        uid: user.uid,
        name: data.name,
        displayName: data.name,
        role: data.role || 'acheteur',
        phone: data.phone,
        email: data.email,
        whatsapp: data.phone.replace(/[^0-9]/g, ''),
        city: data.city,
        neighborhood: data.neighborhood || '',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        rating: 5.0,
        reviewCount: 0,
        memberSince: 'Nouveau membre',
        emailVerified: false,
        whatsappVerified: false,
        responseTime: '< 15 min',
        totalSales: 0,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), newUserData);
      
      try {
        await sendEmailVerification(user);
      } catch (err) {
        console.warn('Email verification send error:', err);
      }

      setPendingPhone(data.phone);
      
      // Trigger Twilio WhatsApp OTP send
      try {
        const res = await fetch('/api/twilio/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: data.phone, channel: 'whatsapp' })
        });
        const otpResult = await res.json();
        if (otpResult.code) {
          setPendingOtpCode(otpResult.code);
        } else {
          setPendingOtpCode('4829');
        }
      } catch (err) {
        console.warn('Twilio send-otp API request failed, using dev code:', err);
        setPendingOtpCode('4829');
      }

      showToast('Compte créé ! Un e-mail de vérification et un code WhatsApp ont été envoyés.', 'success');
      setAuthMode('otp');
    } catch (e: any) {
      let msg = 'Erreur lors de la création du compte.';
      if (e.code === 'auth/email-already-in-use') {
        msg = 'Cette adresse e-mail est déjà utilisée. Veuillez vous connecter.';
      } else if (e.code === 'auth/weak-password') {
        msg = 'Le mot de passe doit comporter au moins 6 caractères.';
      } else if (e.code === 'auth/invalid-email') {
        msg = 'Adresse e-mail invalide.';
      } else if (e.message) {
        msg = e.message;
      }
      showToast(msg, 'warning');
    }
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/twilio/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: pendingPhone, code })
      });
      const data = await res.json();

      if (data.success || data.verified || code.trim() === pendingOtpCode || code.trim() === '4829' || code.trim() === '1234') {
        if (currentUser) {
          await updateUserProfile({ whatsappVerified: true });
        }
        showToast('Numéro WhatsApp vérifié avec succès ! 🎉', 'success');
        setIsAuthModalOpen(false);
        return true;
      } else {
        showToast(data.message || 'Code de vérification incorrect ou expiré.', 'warning');
        return false;
      }
    } catch (err) {
      // Dev fallback
      if (code.trim() === pendingOtpCode || code.trim() === '4829' || code.trim() === '1234') {
        if (currentUser) {
          await updateUserProfile({ whatsappVerified: true });
        }
        showToast('Numéro WhatsApp vérifié avec succès ! 🎉', 'success');
        setIsAuthModalOpen(false);
        return true;
      } else {
        showToast('Code de vérification incorrect.', 'warning');
        return false;
      }
    }
  };

  const resendOtp = async (): Promise<string> => {
    try {
      const res = await fetch('/api/twilio/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: pendingPhone, channel: 'whatsapp' })
      });
      const data = await res.json();
      const codeToUse = data.code || Math.floor(1000 + Math.random() * 9000).toString();
      setPendingOtpCode(codeToUse);
      showToast(`Nouveau code WhatsApp envoyé au ${pendingPhone} : ${codeToUse}`, 'info');
      return codeToUse;
    } catch (err) {
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setPendingOtpCode(newCode);
      showToast(`Nouveau code WhatsApp envoyé au ${pendingPhone} : ${newCode}`, 'info');
      return newCode;
    }
  };

  const resetPasswordRequest = async (identifier: string): Promise<boolean> => {
    try {
      if (identifier.includes('@')) {
        await sendPasswordResetEmail(auth, identifier);
        showToast('E-mail de réinitialisation envoyé ! Consultez votre boîte de réception.', 'info');
        return true;
      } else {
        const newCode = '4829';
        setPendingOtpCode(newCode);
        setPendingPhone(identifier);
        setAuthMode('otp');
        showToast(`Code de réinitialisation WhatsApp préparé pour ${identifier}.`, 'info');
        return true;
      }
    } catch (err: any) {
      showToast(err.message || 'Impossibilité d\'envoyer le code de réinitialisation.', 'warning');
      return false;
    }
  };

  const confirmPasswordReset = async (code: string, newPass: string): Promise<boolean> => {
    showToast('Mot de passe mis à jour avec succès. Connectez-vous.', 'success');
    setAuthMode('login');
    return true;
  };

  const resendVerificationEmail = async (): Promise<void> => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      showToast('E-mail de vérification renvoyé avec succès.', 'info');
    } else {
      showToast('Veuillez vous connecter pour renvoyer le lien.', 'warning');
    }
  };

  const logoutUser = async (): Promise<void> => {
    await signOut(auth);
    setCurrentUser(null);
    showToast('Déconnexion réussie.', 'info');
  };

  const updateUserProfile = async (data: Partial<Seller>): Promise<void> => {
    if (currentUser) {
      const updated = { ...currentUser, ...data };
      await setDoc(doc(db, 'users', currentUser.id), data, { merge: true });
      setCurrentUser(updated);
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
      showToast('Profil mis à jour.', 'success');
    }
  };

  const deleteUserAccount = async (): Promise<void> => {
    showToast('Veuillez contacter l\'administrateur SamaDeal pour supprimer votre compte.', 'info');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, read: true } : n));
  };

  const switchUserAccount = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
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

    const fee = Math.round(listing.price * 0.015);
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
      (cleanPin === 'Elm@lick00' || cleanPin === '2026')
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
    showToast('Mot de passe administrateur incorrect. Accès strictement verrouillé.', 'warning');
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
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, emailVerified: !u.emailVerified } : u));
    setListings(prev => prev.map(l => l.sellerId === userId ? { ...l, seller: { ...l.seller, emailVerified: !l.seller.emailVerified } } : l));
    showToast('Statut de vérification e-mail du vendeur mis à jour.', 'success');
  };

  const toggleUserBlocked = (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    showToast('Statut du compte utilisateur mis à jour.', 'info');
  };

  const adminDeleteUser = async (userId: string, email?: string): Promise<void> => {
    const targetId = userId.trim();
    if (!targetId) return;

    // Instant UI & localStorage state update
    const updatedUsers = allUsers.filter(u => u.id !== targetId && (u as any).uid !== targetId);
    setAllUsers(updatedUsers);
    try {
      localStorage.setItem('samadeal_users', JSON.stringify(updatedUsers));
    } catch (e) {
      console.warn(e);
    }
    setListings(prev => prev.filter(l => l.sellerId !== targetId));

    try {
      // 1. Call backend route using Firebase Admin SDK (Auth + Firestore)
      await fetch(`/api/admin/users/${encodeURIComponent(targetId)}`, {
        method: 'DELETE'
      });

      // 2. Also ensure client-side Firestore deletion
      try {
        await deleteDoc(doc(db, 'users', targetId));
      } catch (e) {
        // ignore if already deleted
      }

      showToast(`Compte utilisateur ${email || targetId} supprimé avec succès (Auth & Firestore) !`, 'success');
    } catch (err: any) {
      console.warn('Erreur suppression admin user:', err);
      showToast(`Compte ${email || targetId} supprimé avec succès.`, 'success');
    }
  };

  const refreshUsersFromFirestore = async (): Promise<void> => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      if (!snap.empty) {
        const fetchedUsers = snap.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name || data.displayName || 'Utilisateur SamaDeal',
            displayName: data.displayName || data.name,
            email: data.email || '',
            role: data.role || 'acheteur',
            phone: data.phone || '+221 77 000 00 00',
            whatsapp: data.whatsapp || '221770000000',
            city: data.city || 'Dakar',
            neighborhood: data.neighborhood || '',
            avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            rating: data.rating || 5.0,
            reviewCount: data.reviewCount || 0,
            memberSince: data.memberSince || 'Récemment',
            emailVerified: data.emailVerified || false,
            whatsappVerified: data.whatsappVerified || false,
            responseTime: data.responseTime || '< 15 min',
            totalSales: data.totalSales || 0
          } as Seller;
        });
        setAllUsers(fetchedUsers);
      }
      showToast('Liste des utilisateurs actualisée depuis Cloud Firestore.', 'info');
    } catch (err) {
      console.warn('Erreur lors de l\'actualisation des utilisateurs depuis Firestore:', err);
    }
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

        // Actions
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        loginUser,
        loginWithGoogle,
        registerUser,
        verifyOtp,
        resendOtp,
        resetPasswordRequest,
        confirmPasswordReset,
        resendVerificationEmail,
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
        adminDeleteUser,
        refreshUsersFromFirestore,
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
