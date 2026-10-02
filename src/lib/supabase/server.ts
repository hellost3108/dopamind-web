import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase-env";

/**
 * Server-side Supabase client factory for Server Components, Server Actions,
 * and Route Handlers. Must be called fresh per request (cookies() is
 * request-scoped), never module-level cached.
 *
 * In a Server Component render, cookies().set() is a no-op by design (Next.js
 * forbids writing cookies during render) — that's fine as long as a
 * middleware or Route Handler refreshes the session elsewhere. No such
 * middleware exists yet; auth/session refresh is Phase 2.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component during render — ignore.
            // A future auth middleware (Phase 2) will refresh sessions.
          }
        },
      },
    },
  );
}
