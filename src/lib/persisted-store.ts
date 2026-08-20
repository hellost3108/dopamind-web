export type PersistedStore<T> = {
  get: () => T;
  set: (next: T) => void;
  subscribe: (listener: () => void) => () => void;
};

/**
 * Minimal external store synced to localStorage, for use with
 * `useSyncExternalStore`. Reading/writing localStorage inside an effect
 * (setState-after-mount) causes either a lint violation or a hydration
 * flash; this gives client-only persisted state (cart, wishlist) a stable
 * snapshot React can read during hydration via `getServerSnapshot`.
 */
export function createPersistedStore<T>(key: string, fallback: T): PersistedStore<T> {
  let state = fallback;
  let hydrated = false;
  const listeners = new Set<() => void>();

  function ensureHydrated() {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      // Ignore malformed/inaccessible storage — store keeps its fallback.
    }
  }

  return {
    get() {
      ensureHydrated();
      return state;
    },
    set(next) {
      state = next;
      listeners.forEach((listener) => listener());
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // Storage may be unavailable (private mode, quota) — safe to skip.
      }
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
