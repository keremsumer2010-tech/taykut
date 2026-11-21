import { mount } from '@/lib/mount';
import { NotFoundPage } from '@/pages/NotFoundPage';

mount(NotFoundPage, (t) => `404 — ${t.notFound.title} — TAYKUT`);
