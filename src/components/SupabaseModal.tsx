import React, { useState } from 'react';
import { X, Database, CheckCircle2, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';
import { supabaseUrl, supabaseAnonKey, saveSupabaseConfig, supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

export const SupabaseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [url, setUrl] = useState(supabaseUrl);
  const [key, setKey] = useState(supabaseAnonKey);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      showToast('Veuillez renseigner l\'URL et la clé Anonyme Supabase.', 'warning');
      return;
    }
    saveSupabaseConfig(url, key);
    showToast('Configuration Supabase enregistrée !', 'success');
    onClose();
  };

  const sqlSchema = `
-- ==========================================================
-- Schéma SQL PostgreSQL pour SamaDeal sur Supabase
-- Exécutez ce script dans : Supabase Dashboard > SQL Editor
-- ==========================================================

-- 1. Table des profils utilisateurs liée à Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  account_type TEXT DEFAULT 'particulier' CHECK (account_type IN ('particulier', 'professionnel')),
  shop_name TEXT,
  whatsapp TEXT,
  city TEXT DEFAULT 'Dakar',
  neighborhood TEXT,
  avatar TEXT,
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  total_sales INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profils publics visibles par tous" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Utilisateurs peuvent modifier leur propre profil" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Fonction & Déclencheur automatique après inscription Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, account_type, shop_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'account_type', 'particulier'),
    new.raw_user_meta_data->>'shop_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    account_type = EXCLUDED.account_type,
    shop_name = EXCLUDED.shop_name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Table des annonces
CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  currency TEXT DEFAULT 'FCFA',
  category TEXT NOT NULL,
  condition TEXT NOT NULL,
  images TEXT[],
  city TEXT NOT NULL,
  neighborhood TEXT,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_negotiable BOOLEAN DEFAULT true,
  has_delivery BOOLEAN DEFAULT true,
  delivery_fee NUMERIC DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  views_count INT DEFAULT 0,
  favorites_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Annonces visibles par tous" 
  ON public.listings FOR SELECT USING (true);

-- 4. Table des transactions sécurisées (Séquestre Wave / OM)
CREATE TABLE IF NOT EXISTS public.escrow_payments (
  id TEXT PRIMARY KEY,
  listing_id TEXT REFERENCES public.listings(id) ON DELETE SET NULL,
  buyer_id TEXT,
  seller_id TEXT,
  amount NUMERIC NOT NULL,
  fee NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  delivery_type TEXT NOT NULL,
  status TEXT DEFAULT 'held',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
  `.trim();


  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    showToast('Script SQL Supabase copié !', 'info');
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold">Connexion Base de Données Supabase</h2>
              <p className="text-xs text-emerald-200">Synchronisez SamaDeal avec votre projet PostgreSQL Supabase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 leading-relaxed">
            <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pourquoi connecter Supabase ?</span>
            </div>
            Stockez durablement vos annonces, profils utilisateurs et transactions sécurisées Wave / Orange Money dans le cloud PostgreSQL de Supabase.
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                URL du Projet Supabase (Project URL)
              </label>
              <input
                type="text"
                placeholder="https://xyzproject.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Clé Anonyme Publique (anon / public key)
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Statut actuel : {supabase ? <span className="text-emerald-600 font-bold">Connecté à Supabase ✓</span> : <span className="text-amber-600 font-bold">Mode local (LocalStorage)</span>}
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Sauvegarder & Connecter
              </button>
            </div>
          </form>

          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Script SQL pour tables Supabase</h3>
              <button
                onClick={copySql}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copié !' : 'Copier SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-emerald-300 text-[11px] font-mono rounded-xl overflow-x-auto max-h-40">
              {sqlSchema}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
