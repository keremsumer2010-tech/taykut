import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages proje sitesi: https://keremsumer2010-tech.github.io/taykut/
export default defineConfig({
  base: '/taykut/',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    // Fontlar CSS'e base64 gömülmesin: unicode-range ile yalnız gerektiğinde insinler.
    assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined),
    rollupOptions: {
      // Çok sayfalı yapı: menüdeki her başlık ayrı bir HTML girişidir.
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        sponsor: fileURLToPath(new URL('./sponsor/index.html', import.meta.url)),
        rover: fileURLToPath(new URL('./rover/index.html', import.meta.url)),
        basin: fileURLToPath(new URL('./basin/index.html', import.meta.url)),
        muhendislik: fileURLToPath(new URL('./muhendislik/index.html', import.meta.url)),
        istasyon: fileURLToPath(new URL('./istasyon/index.html', import.meta.url)),
        takim: fileURLToPath(new URL('./takim/index.html', import.meta.url)),
        notfound: fileURLToPath(new URL('./404.html', import.meta.url)),
      },
    },
  },
  // 5173 aynı makinedeki başka bir projeyle çakıştığı için 5174.
  server: { port: 5174, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
