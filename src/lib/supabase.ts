import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-project')
);

if (!isSupabaseConfigured) {
  console.info(
    'ℹ️ Supabase credentials not yet provided in .env. Running with demo fallback data. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect to your live Supabase project.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
