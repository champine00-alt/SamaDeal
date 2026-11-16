import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL as FILE_URL, SUPABASE_PUBLIC_KEY as FILE_KEY } from '../supabaseClient.js';

// Retrieve Supabase credentials from src/supabaseClient.js, localStorage, or env
const getStoredSupabaseConfig = () => {
  const rawUrl: string = FILE_URL;
  const rawKey: string = FILE_KEY;
  if (
    rawUrl && 
    rawUrl !== 'SUPABASE_PROJECT_URL_HERE' && 
    rawKey && 
    rawKey !== 'SUPABASE_PUBLISHABLE_KEY_HERE'
  ) {
    return { url: rawUrl, anonKey: rawKey };
  }


  try {
    const saved = localStorage.getItem('samadeal_supabase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  };
};


const config = getStoredSupabaseConfig();

export const supabaseUrl = config.url;
export const supabaseAnonKey = config.anonKey;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  localStorage.setItem('samadeal_supabase_config', JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() }));
  window.location.reload();
};
