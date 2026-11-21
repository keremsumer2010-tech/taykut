// Her HTML girişinin ortak açılışı: stiller, dil, kök bileşen.
import { StrictMode, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { initLang, setPageTitle } from '@/lib/i18n';
import type { Content } from '@/content/schema';
import '@/styles/base.css';

export function mount(Component: ComponentType, title?: (t: Content) => string) {
  if (title) setPageTitle(title);
  initLang();
  const root = document.getElementById('root');
  if (!root) throw new Error('#root bulunamadı');
  createRoot(root).render(
    <StrictMode>
      <Component />
    </StrictMode>,
  );
}
