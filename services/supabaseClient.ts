import { createClient } from '@supabase/supabase-js';

// Helper to retrieve env vars from various build environments (Vite, CRA, Next, etc.)
const getEnvVar = (key: string, viteKey?: string) => {
  // Check process.env (Standard Node/Webpack/CRA)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // Check import.meta.env (Vite)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[viteKey || key] || import.meta.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (!supabase) {
  console.warn("Supabase credentials missing. App running in Read-Only Demo Mode.");
}