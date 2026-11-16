import { createClient } from '@supabase/supabase-js';

/**
 * -------------------------------------------------------------
 * Supabase Client Configuration
 * -------------------------------------------------------------
 * Replace the two placeholder variables below with your project credentials:
 * 
 * 1. SUPABASE_URL:
 *    Found in Supabase Dashboard -> Project Settings -> API -> Project URL
 *    Example: 'https://xyzabcdefghijklmno.supabase.co'
 * 
 * 2. SUPABASE_PUBLIC_KEY:
 *    Found in Supabase Dashboard -> Project Settings -> API -> Project API Keys -> anon (public)
 *    Example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 * -------------------------------------------------------------
 */
const SUPABASE_URL = 'https://shgmthlbhxmexgsicsjv.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_EooCVDvc1i5lWZmEBRLvyw_urUlE6q4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);


export { SUPABASE_URL, SUPABASE_PUBLIC_KEY };
export default supabase;
