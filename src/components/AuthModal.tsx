import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Mail, 
  Lock, 
  User, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  RotateCw,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  MapPin,
  Camera,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SENEGAL_CITIES, DAKAR_NEIGHBORHOODS } from '../data/mockData';
import { WhatsAppIcon } from './common/WhatsAppIcon';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authMode, 
    setAuthMode,
    loginUser, 
    loginWithGoogle,
    registerUser, 
    verifyOtp, 
    resendOtp, 
    pendingOtpCode, 
    pendingPhone,
    resetPasswordRequest,
    confirmPasswordReset,
    allUsers,
    showToast
  } = useApp();

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form - Step Management
  const [regStep, setRegStep] = useState<1 | 2>(1);

  // Step 1: Identification & Securite
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState<'acheteur' | 'vendeur'>('acheteur');
  const [regPhone, setRegPhone] = useState('77 452 89 12');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Step 2: Localisation & Photo de profil
  const [regCity, setRegCity] = useState('Dakar');
  const [regNeighborhood, setRegNeighborhood] = useState('Mermoz');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');

  // OTP Form
  const [otpInput, setOtpInput] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Forgot password
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isResetStepPassword, setIsResetStepPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Avatar presets
  const AVATAR_PRESETS = [
    { name: 'Aminata', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
    { name: 'Moussa', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
    { name: 'Aïssatou', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80' },
    { name: 'Cheikh', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
    { name: 'Fatou', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80' }
  ];

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Faible', color: 'bg-rose-500' };
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { score: 3, label: 'Très fort', color: 'bg-emerald-500' };
    }
    return { score: 2, label: 'Moyen', color: 'bg-amber-500' };
  };

  const passwordStrength = getPasswordStrength(regPassword);

  // Reset countdown on OTP mode
  useEffect(() => {
    if (authMode === 'otp') {
      setCountdown(30);
      setCanResend(false);
      setOtpInput(pendingOtpCode);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [authMode, pendingOtpCode]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Veuillez renseigner votre téléphone ou email.', 'warning');
      return;
    }
    if (!loginPassword) {
      showToast('Veuillez entrer votre mot de passe.', 'warning');
      return;
    }
    loginUser(loginIdentifier, loginPassword);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      showToast('Veuillez entrer votre nom et prénom.', 'warning');
      return;
    }
    if (!regPhone.trim()) {
      showToast('Veuillez entrer votre numéro de téléphone.', 'warning');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      showToast('Veuillez fournir une adresse e-mail valide.', 'warning');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      showToast('Le mot de passe doit comporter au moins 6 caractères.', 'warning');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Les mots de passe ne correspondent pas.', 'warning');
      return;
    }
    setRegStep(2);
  };

  const handleFinalRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fullPhone = regPhone.startsWith('+221') ? regPhone : `+221 ${regPhone}`;
      await registerUser({
        name: regName.trim(),
        role: regRole,
        phone: fullPhone,
        email: regEmail.trim(),
        password: regPassword,
        city: regCity,
        neighborhood: regNeighborhood.trim(),
        avatar: regAvatar
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      showToast('Veuillez entrer le code à 4 chiffres.', 'warning');
      return;
    }

    const ok = await verifyOtp(otpInput);
    if (ok && isResetStepPassword) {
      setAuthMode('forgot_password');
    }
  };

  const handleResendOtp = async (via: 'whatsapp' | 'sms' = 'whatsapp') => {
    if (!canResend) return;
    const newCode = await resendOtp();
    setOtpInput(newCode);
    setCountdown(30);
    setCanResend(false);
    showToast(
      via === 'whatsapp' 
        ? `Nouveau code envoyé sur votre WhatsApp : ${newCode}` 
        : `Nouveau code envoyé par SMS : ${newCode}`, 
      'info'
    );
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pendingOtpCode);
    setCopiedCode(true);
    showToast(`Code WhatsApp ${pendingOtpCode} copié !`, 'info');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const openWhatsAppDirect = () => {
    const cleanNum = pendingPhone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Bonjour ! Votre code de confirmation SamaDeal est : ${pendingOtpCode}`);
    const waUrl = `https://wa.me/${cleanNum}?text=${msg}`;
    window.open(waUrl, '_blank');
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isResetStepPassword) {
      if (!newPassword || newPassword.length < 4) {
        showToast('Mot de passe trop court (min. 4 caractères).', 'warning');
        return;
      }
      await confirmPasswordReset('4829', newPassword);
      setIsResetStepPassword(false);
    } else {
      if (!forgotIdentifier.trim()) {
        showToast('Veuillez renseigner votre téléphone ou email.', 'warning');
        return;
      }
      const requested = await resetPasswordRequest(forgotIdentifier);
      if (requested) {
        setIsResetStepPassword(true);
      }
    }
  };

  const fillQuickDemoUser = (userEmail: string, pass: string) => {
    const user = allUsers.find(u => u.email && u.email.toLowerCase() === userEmail.toLowerCase());
    if (user && user.email) {
      setLoginIdentifier(user.email);
      setLoginPassword(pass);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Container invisible pour Firebase Phone Auth reCAPTCHA */}
      <div id="recaptcha-container"></div>
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-emerald-600/20">
              <span className="text-xl">🇸🇳</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">SamaDeal</h2>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                  <span>Vérification Sécurisée</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Achat & Vente entre particuliers au Sénégal</p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        {(authMode === 'login' || authMode === 'register') && (
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setRegStep(1);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === 'register'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Créer un compte
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* 1. LOGIN MODE */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Téléphone ou adresse e-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="+221 77 452 89 12 ou exemple@samadeal.sn"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotIdentifier(loginIdentifier);
                      setAuthMode('forgot_password');
                    }}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-500 font-medium">Ou continuer avec</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2.5 transition shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Se connecter avec Google</span>
              </button>

              {/* Demo users shortcut */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Comptes de démonstration rapide :
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => fillQuickDemoUser('fatou.diop@samadeal.sn', 'password123')}
                    className="p-2 text-left rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group"
                  >
                    <p className="font-bold text-slate-800 group-hover:text-emerald-700">Fatou Diop</p>
                    <p className="text-[10px] text-slate-500">Acheteuse & Vendeuse</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickDemoUser('cheikh.ndiaye@samadeal.sn', 'password123')}
                    className="p-2 text-left rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group"
                  >
                    <p className="font-bold text-slate-800 group-hover:text-emerald-700">Cheikh Ndiaye</p>
                    <p className="text-[10px] text-slate-500">Vendeur Tech Dakar</p>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 2. REGISTER MODE - STEP-BY-STEP RECONSTRUCTED INTERFACE */}
          {authMode === 'register' && (
            <div className="space-y-4">
              {/* Stepper Header */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                    regStep === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {regStep === 1 ? '1' : '✓'}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {regStep === 1 ? '1. Coordonnées & Sécurité' : '2. Localisation & Profil'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`h-1.5 w-8 rounded-full ${regStep >= 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  <div className={`h-1.5 w-8 rounded-full ${regStep === 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                </div>
              </div>

              {/* STEP 1 FORM: IDENTIFICATION & DEUX-FACTEURS */}
              {regStep === 1 && (
                <form onSubmit={handleNextStep1} className="space-y-3.5">
                  {/* Nom complet / Boutique */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nom complet ou nom de Boutique <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Boutique Dakar High-Tech ou Aminata Sall"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>

                  {/* Choix du Rôle (Acheteur vs Vendeur) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Je souhaite m'inscrire en tant que :
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setRegRole('acheteur')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          regRole === 'acheteur'
                            ? 'bg-white text-emerald-800 shadow-sm border border-emerald-300'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>🛍️ Acheteur</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegRole('vendeur')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          regRole === 'vendeur'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>🏪 Vendeur / Partenaire</span>
                      </button>
                    </div>
                  </div>

                  {/* Numéro de Téléphone (Sénégal) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Numéro de téléphone <span className="text-rose-500">*</span></span>
                      <span className="text-[11px] text-[#075E54] font-bold flex items-center gap-1">
                        <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                        Vérification WhatsApp
                      </span>
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-700 text-xs font-extrabold shrink-0">
                        🇸🇳 +221
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="77 452 89 12"
                        value={regPhone.replace('+221', '').trim()}
                        onChange={e => setRegPhone(e.target.value)}
                        className="w-full pl-3 pr-3 py-2.5 rounded-r-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 focus:border-[#25D366] font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Un code OTP sécurisé sera envoyé sur ce numéro sur WhatsApp.
                    </p>
                  </div>

                  {/* Adresse E-mail */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Adresse e-mail <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="votre.nom@exemple.sn"
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                    </div>
                  </div>

                  {/* Mot de Passe */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mot de passe <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Au moins 6 caractères"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password strength indicator */}
                    {regPassword && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                          <div className={`h-full flex-1 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200'}`} />
                          <div className={`h-full flex-1 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200'}`} />
                          <div className={`h-full flex-1 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200'}`} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{passwordStrength.label}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirmation Mot de Passe */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirmer le mot de passe <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        placeholder="Répétez le mot de passe"
                        value={regConfirmPassword}
                        onChange={e => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                    </div>
                    {regConfirmPassword && regPassword !== regConfirmPassword && (
                      <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        <span>Les deux mots de passe ne correspondent pas.</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                  >
                    <span>Continuer vers la localisation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2 FORM: LOCALISATION & PROFIL */}
              {regStep === 2 && (
                <form onSubmit={handleFinalRegisterSubmit} className="space-y-4">
                  {/* Ville du Sénégal */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ville de résidence <span className="text-rose-500">*</span></span>
                    </label>
                    <select
                      value={regCity}
                      onChange={e => setRegCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                    >
                      {SENEGAL_CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quartier */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quartier <span className="text-slate-400 font-normal">(optionnel)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Mermoz, Maristes, Almadies, Sacré-Cœur..."
                      value={regNeighborhood}
                      onChange={e => setRegNeighborhood(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                    />
                  </div>

                  {/* Selecteur d'Avatar */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Photo de profil</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Sélectionnez un avatar</span>
                    </label>

                    <div className="flex items-center gap-3 overflow-x-auto pb-1">
                      {AVATAR_PRESETS.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRegAvatar(item.url)}
                          className={`relative flex-shrink-0 w-12 h-12 rounded-2xl overflow-hidden border-2 transition ${
                            regAvatar === item.url 
                              ? 'border-emerald-600 ring-4 ring-emerald-500/20 scale-105 shadow-md' 
                              : 'border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                          {regAvatar === item.url && (
                            <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white font-bold" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recap Box */}
                  <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-1 text-xs">
                    <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Récapitulatif de votre compte SamaDeal :</span>
                    </div>
                    <p className="text-emerald-800 text-[11px]">
                      <strong>{regName}</strong> ({regEmail})
                    </p>
                    <p className="text-emerald-800 text-[11px]">
                      Téléphone : 🇸🇳 +221 {regPhone.replace('+221', '').trim()} · {regCity}
                    </p>
                  </div>

                  {/* Submit Button & Back Action */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRegStep(1)}
                        className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition shrink-0"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Retour</span>
                      </button>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{isSubmitting ? "Envoi en cours..." : "Finaliser et recevoir l'e-mail de confirmation"}</span>
                      </button>
                    </div>

                    <p className="text-xs text-center text-slate-500 mt-2">
                      Un lien de vérification sera envoyé à votre adresse e-mail.
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 3. OTP VERIFICATION MODE VIA WHATSAPP */}
          {authMode === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 py-1">
              <div className="text-center space-y-1">
                <div className="w-14 h-14 bg-[#E7FFDB] text-[#25D366] rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-inner border border-[#25D366]/30">
                  <WhatsAppIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Confirmation WhatsApp
                </h3>
                <p className="text-xs text-slate-500">
                  Votre code de sécurité à 4 chiffres a été envoyé par message WhatsApp au :
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-extrabold text-slate-800">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>{pendingPhone}</span>
                </div>
              </div>

              {/* WhatsApp Live Incoming Bubble Simulation */}
              <div className="rounded-2xl border border-[#25D366]/40 bg-[#075E54] text-white overflow-hidden shadow-md">
                <div className="px-3 py-2 bg-[#054c44] flex items-center justify-between text-xs border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold flex items-center gap-1 text-[11px]">
                        <span>SamaDeal Officiel</span>
                        <span className="text-[#25D366]">✓</span>
                      </p>
                      <p className="text-[9px] text-emerald-200">Message WhatsApp direct</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-200">À l'instant</span>
                </div>

                <div className="p-3.5 bg-[#efeae2] text-slate-900 space-y-2">
                  <div className="bg-[#dcf8c6] p-3 rounded-xl rounded-tl-none shadow-sm text-xs space-y-1.5 border border-[#c3e6aa]">
                    <p className="leading-snug">
                      👋 Bonjour ! Bienvenue sur <strong>SamaDeal Sénégal</strong>.
                    </p>
                    <p className="text-slate-700">
                      Voici votre code de confirmation pour finaliser la création de votre compte :
                    </p>
                    
                    <div className="py-2 px-3 bg-white rounded-lg border border-[#b2d898] flex items-center justify-between my-1">
                      <span className="text-xl font-extrabold tracking-[0.25em] text-[#075E54] font-mono">
                        {pendingOtpCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="px-2 py-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] rounded-md text-[11px] font-bold flex items-center gap-1 transition"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 italic">
                      Ne partagez jamais ce code. Équipe SamaDeal · Dakar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                  Entrez les 4 chiffres reçus sur WhatsApp
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value)}
                  className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 focus:border-[#25D366]"
                  placeholder="0000"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl shadow-lg shadow-[#25D366]/25 flex items-center justify-center gap-2 transition active:scale-[0.99]"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirmer et activer mon compte</span>
                </button>

                <button
                  type="button"
                  onClick={openWhatsAppDirect}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>Ouvrir dans l'application WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>

              <div className="text-center pt-1 space-y-1">
                {canResend ? (
                  <div className="flex items-center justify-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => handleResendOtp('whatsapp')}
                      className="font-bold text-[#075E54] hover:underline flex items-center gap-1"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Renvoyer sur WhatsApp
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      type="button"
                      onClick={() => handleResendOtp('sms')}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      Recevoir par SMS classique
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">
                    Renvoyer un nouveau code WhatsApp dans <span className="font-semibold text-slate-700">{countdown}s</span>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* 4. FORGOT PASSWORD MODE */}
          {authMode === 'forgot_password' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isResetStepPassword ? 'Définir un nouveau mot de passe' : 'Réinitialisation du mot de passe'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isResetStepPassword
                    ? 'Saisissez votre nouveau mot de passe sécurisé'
                    : 'Entrez votre numéro de téléphone ou adresse e-mail.'}
                </p>
              </div>

              {isResetStepPassword ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone WhatsApp ou e-mail associé
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="+221 77 452 89 12 ou exemple@samadeal.sn"
                      value={forgotIdentifier}
                      onChange={e => setForgotIdentifier(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 transition"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>{isResetStepPassword ? 'Enregistrer le nouveau mot de passe' : 'Envoyer le code de réinitialisation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetStepPassword(false);
                    setAuthMode('login');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Retourner à la connexion
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-600 flex items-center justify-center gap-1.5">
          <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
          <span>Vérification instantanée par WhatsApp pour tous les numéros au Sénégal.</span>
        </div>
      </div>
    </div>
  );
};
