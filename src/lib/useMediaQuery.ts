import { useSyncExternalStore } from 'react';

/** CSS medya sorgusunu React durumuna bağlar (ör. '(min-width: 641px)'). */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}
