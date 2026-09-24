import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Route prefixes that require a signed-in customer. Kept in sync with the
 * per-page `requireUser()` calls in src/lib/supabase/dal.ts — this list is
 * only an optimistic, cookie-based pre-filter (see Next.js Proxy docs: "it
 * should not be used as a full session management or authorization
 * solution"). The authoritative check happens server-side on each page.
 */
const PROTECTED_PREFIXES = ["/tai-khoan/ho-so", "/tai-khoan/dia-chi", "/tai-khoan/don-hang"];

function isSameSitePath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

/**
 * Refreshes the Supabase session cookie on every request (required so a
 * Server Component render — which cannot itself write cookies — always sees
 * an up-to-date session) and applies an optimistic redirect for protected
 * account routes. Mirrors the standard @supabase/ssr proxy pattern, renamed
 * from "middleware" per Next.js 16 (see AGENTS.md / proxy.js docs).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/tai-khoan";
    url.search = "";
    const redirectTarget = pathname + request.nextUrl.search;
    if (isSameSitePath(redirectTarget)) {
      url.searchParams.set("redirect", redirectTarget);
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
