import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase-env";

/**
 * Browser-side Supabase client factory. Call this inside Client Components
 * (each call is cheap — createBrowserClient reuses a singleton internally).
 */
export function createClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
