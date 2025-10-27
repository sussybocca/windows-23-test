import { createClient } from "@supabase/supabase-js";

// Initialize empty; will set after fetching from serverless function
let supabaseUrl = "";
let supabaseKey = "";

// This will hold the Supabase client once initialized
let supabase = null;

/**
 * Initialize Supabase client dynamically from serverless function.
 * Returns a promise that resolves to the Supabase client.
 */
export const initSupabase = async () => {
  if (supabase) return supabase; // Return cached client if already initialized

  try {
    const res = await fetch("/.netlify/functions/env");
    const data = await res.json();
    if (data.success) {
      supabaseUrl = data.env.SUPABASE_URL;
      supabaseKey = data.env.SUPABASE_KEY;

      supabase = createClient(supabaseUrl, supabaseKey);
      return supabase;
    } else {
      throw new Error("Failed to load Supabase keys from Netlify secrets.");
    }
  } catch (err) {
    console.error("Supabase init error:", err);
    return null;
  }
};

/**
 * Getter for the Supabase client.
 * Throws an error if initSupabase hasn’t been called yet.
 */
export const getSupabase = () => {
  if (!supabase) throw new Error("Supabase client not initialized. Call initSupabase first.");
  return supabase;
};

/**
 * Optional: default export for compatibility in components that import directly.
 * ⚠️ Only safe to use after initSupabase() has completed.
 */
export default supabase;
