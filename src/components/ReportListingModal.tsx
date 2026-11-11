import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportListingModal: React.FC = () => {
  const { 
    isReportModalOpen, 
    setIsReportModalOpen, 
    targetReportListing, 
    submitReport 
  } = useApp();

  const [reason, setReason] = useState('Suspicion de fraude ou arnaque');
  const [details, setDetails] = useState('');

  if (!isReportModalOpen || !targetReportListing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(
      targetReportListing.id,
      targetReportListing.title,
      reason,
      details.trim() || 'Signalement effectué par un utilisateur.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">Signaler cette annonce</h3>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-xs text-slate-600">
            Vous signalez l'annonce : <strong>"{targetReportListing.title}"</strong>
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Motif du signalement
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-red-500"
            >
              <option value="Suspicion de fraude ou arnaque">Suspicion de fraude ou faux vendeur</option>
              <option value="Contrefaçon ou copie non déclarée">Article contrefait ou non authentique</option>
              <option value="Article déjà vendu ou indisponible">Article déjà vendu ou vendeur injoignable</option>
              <option value="Prix trompeur ou abusif">Prix trompeur ou demande de virement préalable</option>
              <option value="Contenu inapproprié ou illicite">Contenu ou photo inapproprié</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Précisions complémentaires
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Expliquez ce qui vous semble anormal (messages reçus, incohérence...)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Transmettre le signalement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
