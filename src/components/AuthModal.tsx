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

// Authentic WhatsApp Icon Component
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
    pendingConfirmationEmail,
    resendConfirmationEmail,
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
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+221 77 452 89 12');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAccountType, setRegAccountType] = useState<'particulier' | 'professionnel'>('particulier');
  const [regShopName, setRegShopName] = useState('');
  const [regCity, setRegCity] = useState('Dakar');
  const [regNeighborhood, setRegNeighborhood] = useState('Mermoz');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');

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

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword || !regConfirmPassword) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Les mots de passe ne correspondent pas.', 'warning');
      return;
    }
    if (regAccountType === 'professionnel' && !regShopName.trim()) {
      showToast('Le nom de la boutique est obligatoire pour les professionnels.', 'warning');
      return;
    }

    registerUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      confirmPassword: regConfirmPassword,
      accountType: regAccountType,
      shopName: regAccountType === 'professionnel' ? regShopName : undefined,
      city: regCity,
      neighborhood: regNeighborhood,
      avatar: regAvatar
    });
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
              {/* Account Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Type de compte <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegAccountType('particulier')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      regAccountType === 'particulier'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>👤 Particulier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegAccountType('professionnel')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      regAccountType === 'professionnel'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>🏪 Professionnel (Boutique)</span>
                  </button>
                </div>
              </div>

              {/* Shop Name (mandatory if professional) */}
              {regAccountType === 'professionnel' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom de la boutique <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dakar Tech & Mode"
                    value={regShopName}
                    onChange={e => setRegShopName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              )}

              {/* Nom & Prénom */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom complet <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Aminata Sall"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Adresse e-mail (obligatoire) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse e-mail (pour validation réelle) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="aminata.sall@exemple.sn"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Numéro de téléphone (obligatoire) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro de téléphone (Sénégal ou International) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 452 89 12"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Aucun code SMS/WhatsApp ne sera envoyé. Le numéro est enregistré dans votre profil.
                </p>
              </div>

              {/* Mot de passe et confirmation */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mot de passe <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirmation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
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
                    placeholder="Ex: Mermoz, Plateau..."
                    value={regNeighborhood}
                    onChange={e => setRegNeighborhood(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Avatar presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo de profil / Avatar
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

              {/* Submit button */}
              <button
                type="submit"
                className="w-full mt-3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition active:scale-[0.99]"
              >
                <span>Créer mon compte SamaDeal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3. EMAIL CONFIRMATION SENT MODE (SUPABASE CONFIRMATION LINK) */}
          {authMode === 'email_confirmation_sent' && (
            <div className="py-4 space-y-5 text-center animate-in fade-in duration-200">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                <Mail className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Lien de confirmation envoyé ! ✉️
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Supabase vient d'envoyer un lien de validation et d'activation à :
                </p>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100/70 text-emerald-900 rounded-full font-bold text-xs">
                  <span>{pendingConfirmationEmail || regEmail}</span>
                </div>
              </div>

              {/* Step by step card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Activation obligatoire par e-mail :</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] leading-relaxed">
                  <li>Ouvrez votre boîte e-mail (vérifiez aussi les courriers indésirables / Spams).</li>
                  <li>Cliquez sur le lien <strong>"Confirm your email"</strong> envoyé par Supabase.</li>
                  <li>Votre compte SamaDeal sera activé et vous serez automatiquement connecté.</li>
                </ol>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => resendConfirmationEmail(pendingConfirmationEmail || regEmail)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Renvoyer le lien de confirmation</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    closeAuthModal();
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                >
                  J'ai compris, fermer
                </button>
              </div>
            </div>
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
