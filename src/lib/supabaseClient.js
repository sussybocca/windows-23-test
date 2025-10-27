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

// Export a getter
export const getSupabase = () => {
  if (!supabase) throw new Error("Supabase client not initialized. Call initSupabase first.");
  return supabase;
};

// ✅ Direct export so your imports in components won’t fail
export { supabase };
