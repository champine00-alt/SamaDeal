import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Key, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminAuthModal: React.FC = () => {
  const { 
    isAdminAuthModalOpen, 
    setIsAdminAuthModalOpen, 
    loginAsAdmin, 
    superAdminEmail 
  } = useApp();

  const [email, setEmail] = useState(superAdminEmail);
  const [pin, setPin] = useState('2026');
  const [showPin, setShowPin] = useState(false);

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin(email, pin);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAdminAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-lg mb-4 ring-4 ring-emerald-500/20">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-black text-slate-950 tracking-tight">
            Espace Propriétaire & Admin
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Accès sécurisé et confidentiel, exclusivement réservé au propriétaire de l'application.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Adresse e-mail administrateur
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="champine00@gmail.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Code de sécurité PIN</span>
              <span className="text-[10px] text-emerald-600 font-normal">Code maître : 2026</span>
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="2026"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold tracking-widest focus:bg-white focus:outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Vous seul (<strong>{superAdminEmail}</strong>) possédez les privilèges d'administration et de gestion financière de SamaDeal.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Déverrouiller l'Espace Administrateur</span>
          </button>
        </form>
      </div>
    </div>
  );
};
