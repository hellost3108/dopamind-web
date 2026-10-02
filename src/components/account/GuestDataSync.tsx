"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { mergeGuestData } from "@/lib/supabase/sync";

const MERGE_FLAG_PREFIX = "dopamind:merged:";

/**
 * Renders nothing. Once per signed-in session (per user id, tracked in
 * localStorage so it doesn't repeat on every navigation), attempts to merge
 * the guest cart/wishlist into the customer's Supabase rows. Silent and
 * best-effort — see src/lib/supabase/sync.ts for why most guest items won't
 * match today, and why that's expected rather than an error.
 */
export function GuestDataSync() {
  const { user, loading } = useAuth();
  const attempted = useRef(false);

  useEffect(() => {
    if (loading || !user || attempted.current) return;

    const flagKey = `${MERGE_FLAG_PREFIX}${user.id}`;
    try {
      if (window.localStorage.getItem(flagKey)) return;
    } catch {
      return;
    }

    attempted.current = true;

    let cartLines: { slug: string; quantity: number }[] = [];
    let wishlistSlugs: string[] = [];
    try {
      const rawCart = window.localStorage.getItem("dopamind:cart");
      if (rawCart) {
        const parsed = JSON.parse(rawCart) as { slug: string; quantity: number }[];
        cartLines = parsed.map((l) => ({ slug: l.slug, quantity: l.quantity }));
      }
      const rawWishlist = window.localStorage.getItem("dopamind:wishlist");
      if (rawWishlist) {
        const parsed = JSON.parse(rawWishlist) as { slug: string }[];
        wishlistSlugs = parsed.map((i) => i.slug);
      }
    } catch {
      // Malformed local data — skip the merge, guest data stays untouched.
      return;
    }

    mergeGuestData(cartLines, wishlistSlugs)
      .catch(() => {
        // Best-effort: a failed merge must never block the signed-in experience.
      })
      .finally(() => {
        try {
          window.localStorage.setItem(flagKey, String(Date.now()));
        } catch {
          // Ignore — worst case the merge is attempted again next session.
        }
      });
  }, [user, loading]);

  return null;
}
