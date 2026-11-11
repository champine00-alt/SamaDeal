import React from 'react';
import { X, ShieldCheck, MapPin, Smartphone, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SafetyGuidelinesModal: React.FC = () => {
  const { isSafetyModalOpen, setIsSafetyModalOpen } = useApp();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-base text-slate-900">Guide de Sécurité SamaDeal</h3>
              <p className="text-[11px] text-slate-500">Pour des transactions sereines au Sénégal</p>
            </div>
          </div>
          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-900 text-sm">1. Rendez-vous dans un lieu public très fréquenté</h4>
              <p className="mt-1 text-emerald-800">
                Fixez le rendez-vous en journée dans des endroits vivants et éclairés : devant un centre commercial (Sea Plaza, Dakar City), une station-service (Total, Shell), une agence bancaire ou une place connue. Évitez les ruelles isolées à la nuit tombée.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">2. Testez et inspectez l'article avant de payer</h4>
              <p className="mt-1 text-slate-600">
                Pour un téléphone ou ordinateur : insérez votre carte SIM, passez un appel, testez le Wi-Fi, les caméras, la charge de la batterie et vérifiez qu'aucun compte iCloud/Google n'est verrouillé.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 text-sm">3. N'envoyez jamais d'acompte direct par Wave ou OM</h4>
              <p className="mt-1 text-amber-800">
                Méfiez-vous si un vendeur insiste pour recevoir une "avance de réservation" ou des frais de transport avant de vous rencontrer. Pour toute transaction à distance, exigez le <strong>Paiement Sécurisé SamaDeal</strong> qui bloque l'argent sur un compte séquestre.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">4. Fiez-vous aux vendeurs vérifiés</h4>
              <p className="mt-1 text-slate-600">
                Regardez l'ancienneté du membre, le badge "Identité vérifiée" et les notes laissées par les autres acheteurs sénégalais.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            J'ai compris, merci !
          </button>
        </div>
      </div>
    </div>
  );
};
