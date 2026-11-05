import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mockproject.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "mock_supabase_anon_key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
