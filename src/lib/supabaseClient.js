import { createClient } from "@supabase/supabase-js";

// Initialize empty; will set after fetching from serverless function
let supabaseUrl = "";
let supabaseKey = "";

export const initSupabase = async () => {
  try {
    const res = await fetch("/.netlify/functions/env");
    const data = await res.json();
    if (data.success) {
      supabaseUrl = data.env.SUPABASE_URL;
      supabaseKey = data.env.SUPABASE_KEY;
      return createClient(supabaseUrl, supabaseKey);
    } else {
      throw new Error("Failed to load Supabase keys from Netlify secrets.");
    }
  } catch (err) {
    console.error("Supabase init error:", err);
    return null;
  }
};
