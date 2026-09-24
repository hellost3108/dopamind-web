/**
 * Shared Supabase env lookup. Two naming conventions exist across the
 * project's history — NEXT_PUBLIC_SUPABASE_ANON_KEY (older Supabase
 * terminology) and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (current Supabase
 * dashboard naming) — because different Supabase client instances were
 * added independently and picked up whichever name was current at the time.
 * Accept either so the app works regardless of which one is actually set in
 * a given environment (local .env.local vs. hosting provider config).
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return url;
}

export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)",
    );
  }
  return key;
}
