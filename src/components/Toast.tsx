import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold max-w-sm ${
        toastMessage.type === 'success'
          ? 'bg-slate-900 text-white border-slate-800'
          : toastMessage.type === 'warning'
          ? 'bg-amber-600 text-white border-amber-500'
          : 'bg-emerald-700 text-white border-emerald-600'
      }`}>
        {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {toastMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 text-white shrink-0" />}
        {toastMessage.type === 'info' && <Info className="w-4 h-4 text-emerald-200 shrink-0" />}
        <span>{toastMessage.text}</span>
      </div>
    </div>
  );
};
