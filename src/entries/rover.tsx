import { mount } from '@/lib/mount';
import { RoverPage } from '@/pages/RoverPage';

mount(RoverPage, (t) => `${t.pages.rover.title} — TAYKUT`);
