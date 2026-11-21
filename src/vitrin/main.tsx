import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Vitrin } from './Vitrin';
import '@/styles/base.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root bulunamadı');
createRoot(root).render(
  <StrictMode>
    <Vitrin />
  </StrictMode>,
);
