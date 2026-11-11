import React from 'react';
import { ShieldCheck, Heart, MapPin, Mail, Phone, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { 
    setIsSafetyModalOpen, 
    setIsAdminModalOpen, 
    setIsAdminAuthModalOpen,
    isAdminAuthenticated, 
    setActiveTab 
  } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white overflow-hidden p-0.5 border border-slate-700 shrink-0 flex items-center justify-center">
                <img 
                  src="/assets/aistudio/photo_2026-11-11_08-30-01_efa7b2df.jpg" 
                  alt="SamaDeal Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                Sama<span className="text-emerald-500">Deal</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              La plateforme sénégalaise d'achat et de vente d'articles d'occasion entre particuliers. Donnez une seconde vie à vos objets.
            </p>
            <div className="text-[11px] font-semibold text-emerald-400">
              ACHÈTE • VENDS • ÉCONOMISE
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Explorer
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('explore')} 
                  className="hover:text-white transition-colors"
                >
                  Toutes les annonces au Sénégal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('explore')} 
                  className="hover:text-white transition-colors"
                >
                  Téléphones & Informatique Dakar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('explore')} 
                  className="hover:text-white transition-colors"
                >
                  Vêtements & Boubous traditionnels
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('explore')} 
                  className="hover:text-white transition-colors"
                >
                  Motos, Scooters & Véhicules
                </button>
              </li>
            </ul>
          </div>

          {/* Paiements & Sécurité */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Confiance & Paiements
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Guide de sécurité & anti-fraude
                </button>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Paiement garanti Wave & OM</span>
              </li>
              <li>
                <span className="text-slate-400">Transactions protégées par séquestre</span>
              </li>
            </ul>
          </div>

          {/* Localisation Sénégal */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Présence au Sénégal
            </h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dakar, Thiès, Saint-Louis, Mbour, Saly, Touba, Ziguinchor</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>contact@samadeal.sn</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Support WhatsApp : +221 77 000 00 00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} SamaDeal Sénégal. Tous droits réservés.</span>
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setIsAdminModalOpen(true);
                } else {
                  setIsAdminAuthModalOpen(true);
                }
              }}
              className="text-slate-600 hover:text-emerald-400 transition-colors p-1"
              title="Accès propriétaire confidentiel"
              aria-label="Accès propriétaire"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Fait avec fierté pour le Sénégal 🇸🇳</span>
            <span>·</span>
            <span>Conditions d'utilisation</span>
            <span>·</span>
            <span>Confidentialité</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
