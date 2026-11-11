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
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SENEGAL_CITIES } from '../data/mockData';

import { WhatsAppIcon } from './common/WhatsAppIcon';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authMode, 
    setAuthMode,
    loginUser, 
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

  // Register Form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('77 452 89 12');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
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

  // Avatar presets
  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80'
  ];

  // Reset countdown on OTP mode
  useEffect(() => {
    if (authMode === 'otp') {
      setCountdown(30);
      setCanResend(false);
      setOtpInput(pendingOtpCode); // prefill code for testing convenience
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPassword) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }

    const fullPhone = regPhone.startsWith('+221') ? regPhone : `+221 ${regPhone}`;
    await registerUser({
      name: regName,
      phone: fullPhone,
      email: regEmail || `${regName.toLowerCase().replace(/\s+/g, '')}@samadeal.sn`,
      password: regPassword,
      city: regCity,
      neighborhood: regNeighborhood,
      avatar: regAvatar
    });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      showToast('Veuillez entrer le code à 4 chiffres.', 'warning');
      return;
    }

    const ok = verifyOtp(otpInput);
    if (ok && isResetStepPassword) {
      setAuthMode('forgot_password');
    }
  };

  const handleResendOtp = (via: 'whatsapp' | 'sms' = 'whatsapp') => {
    if (!canResend) return;
    const newCode = resendOtp();
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

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isResetStepPassword) {
      if (!newPassword || newPassword.length < 4) {
        showToast('Mot de passe trop court (min. 4 caractères).', 'warning');
        return;
      }
      confirmPasswordReset(newPassword);
      setIsResetStepPassword(false);
    } else {
      if (!forgotIdentifier.trim()) {
        showToast('Veuillez renseigner votre téléphone ou email.', 'warning');
        return;
      }
      const requested = resetPasswordRequest(forgotIdentifier);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-green-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20 overflow-hidden p-1.5">
              <img 
                src="/assets/aistudio/photo_2026-11-11_08-30-01_efa7b2df.jpg" 
                alt="SamaDeal Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">SamaDeal</h2>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                  <span>WhatsApp OTP</span>
                </span>
              </div>
              <p className="text-xs text-slate-600">Achète • Vends • Économise au Sénégal</p>
            </div>
          </div>
          <button 
            onClick={closeAuthModal}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher for Login / Register */}
        {(authMode === 'login' || authMode === 'register') && (
          <div className="px-6 pt-4">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inscription
              </button>
            </div>
          </div>
        )}

        {/* Body content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
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
                    placeholder="+221 77 452 89 12 ou email@exemple.sn"
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
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick test accounts */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-2">
                  Connexion rapide de démonstration :
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => fillQuickDemoUser('fatou.diop@samadeal.sn', 'password123')}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition group"
                  >
                    <p className="font-semibold text-slate-800 group-hover:text-emerald-700">Fatou Diop</p>
                    <p className="text-[11px] text-slate-600">Acheteuse & Vendeuse</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickDemoUser('cheikh.ndiaye@samadeal.sn', 'password123')}
                    className="p-2 text-left rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition group"
                  >
                    <p className="font-semibold text-slate-800 group-hover:text-emerald-700">Cheikh Ndiaye</p>
                    <p className="text-[11px] text-slate-600">Vendeur Tech Dakar</p>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 2. REGISTER MODE */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* WhatsApp Code Delivery Highlight Box */}
              <div className="p-3 bg-[#E7FFDB] rounded-2xl border border-[#25D366]/40 flex items-start gap-3 text-xs text-slate-800 shadow-sm">
                <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">Confirmation sur votre WhatsApp 💬</p>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    Pour créer votre compte en toute sécurité, votre code de validation sera envoyé instantanément sur votre numéro WhatsApp.
                  </p>
                </div>
              </div>

              {/* Nom & Prénom */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom et prénom <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Moussa Sow"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 focus:border-[#25D366]"
                  />
                </div>
              </div>

              {/* Téléphone WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Numéro WhatsApp sénégalais <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-[#075E54] font-bold flex items-center gap-1">
                    <WhatsAppIcon className="w-3 h-3 text-[#25D366]" />
                    Reçoit le code WhatsApp
                  </span>
                </label>
                <div className="relative flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold">
                    🇸🇳 +221
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="77 452 89 12"
                    value={regPhone.replace('+221', '').trim()}
                    onChange={e => setRegPhone(e.target.value)}
                    className="w-full pl-3 pr-3 py-2 rounded-r-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 focus:border-[#25D366]"
                  />
                </div>
                <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                  <span>Le code OTP de création de compte sera envoyé sur ce numéro WhatsApp.</span>
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="moussa@exemple.sn"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mot de passe <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Au moins 6 caractères"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Ville et Quartier */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ville <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={regCity}
                    onChange={e => setRegCity(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    {SENEGAL_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quartier
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mermoz, Maristes..."
                    value={regNeighborhood}
                    onChange={e => setRegNeighborhood(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Photo de profil (facultative) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Photo de profil (facultatif)</span>
                  <span className="text-[11px] text-slate-600">Choisissez un avatar</span>
                </label>
                <div className="flex items-center gap-2">
                  {AVATAR_PRESETS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRegAvatar(av)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition ${
                        regAvatar === av ? 'border-emerald-600 scale-105 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit with WhatsApp Branded Button */}
              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2.5 transition active:scale-[0.99]"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>Créer mon compte et recevoir le code WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3. OTP VERIFICATION MODE VIA WHATSAPP */}
          {authMode === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 py-1">
              <div className="text-center space-y-1">
                <div className="w-14 h-14 bg-[#E7FFDB] text-[#25D366] rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-inner border border-[#25D366]/30">
                  <WhatsAppIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Confirmation par WhatsApp
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
                {/* WhatsApp Chat Header */}
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

                {/* WhatsApp Chat Bubble */}
                <div className="p-3.5 bg-[#efeae2] text-slate-900 space-y-2">
                  <div className="bg-[#dcf8c6] p-3 rounded-xl rounded-tl-none shadow-sm text-xs space-y-1.5 border border-[#c3e6aa]">
                    <p className="leading-snug">
                      👋 Bonjour ! Bienvenue sur <strong>SamaDeal Sénégal</strong>.
                    </p>
                    <p className="text-slate-700">
                      Voici votre code de confirmation pour finaliser la création de votre compte :
                    </p>
                    
                    {/* Big Code Pill */}
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
                    : 'Entrez votre numéro de téléphone pour recevoir le code sur WhatsApp.'}
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
                      placeholder="+221 77 452 89 12 ou email@exemple.sn"
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
                <span>{isResetStepPassword ? 'Enregistrer le nouveau mot de passe' : 'Envoyer le code sur WhatsApp'}</span>
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
