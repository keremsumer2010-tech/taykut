import { useEffect, useState } from 'react';

/**
 * CSS medya sorgusunu React durumuna bağlar. İlk çizimde `initial` döner (önceden üretilen HTML ile
 * aynı; hydrate uyuşmazlığı olmaz), tarayıcıda hemen gerçek değere güncellenir.
 */
export function useMediaQuery(query: string, initial = false): boolean {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return matches;
}
