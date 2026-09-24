import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

/**
 * Cached per-request: every call within the same render pass reuses the
 * first result instead of re-hitting Supabase Auth. Returns null for a
 * guest — callers decide whether that's fine (public pages) or not
 * (`requireUser` below).
 */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
});

function isSameSitePath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

/**
 * Server-side route guard for authenticated-only pages. `currentPath` is the
 * page's own static route (e.g. "/tai-khoan/ho-so") — passed explicitly
 * rather than derived, since Server Components don't have a reliable way to
 * read the current URL. Only ever redirects to a same-site relative path,
 * never to a value taken from user input, so this can't become an open
 * redirect.
 */
export async function requireUser(currentPath: string): Promise<User> {
  const user = await getUser();
  if (user) return user;

  const target = isSameSitePath(currentPath) ? currentPath : "/tai-khoan";
  redirect(`/tai-khoan?redirect=${encodeURIComponent(target)}`);
}
