// Önceden HTML üretimi: her dil (tr, en) ve sayfa için gerçek HTML yazar.
// Önce:  vite build (istemci) + vite build --ssr src/entry-server.tsx --outDir dist-ssr
// Sonra: node tools/prerender.mjs
// Her sayfa: #root içine React çıktısı, <html lang>, başlık, açıklama, kanonik adres, hreflang eşleri,
// Open Graph / Twitter kartı, JSON-LD (ana sayfa). Ayrıca dist/sitemap.xml.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = 'dist';
const SSR = 'dist-ssr/entry-server.js';
const ORIGIN = 'https://keremsumer2010-tech.github.io';

const { render, ROUTES, LANGS } = await import(pathToFileURL(SSR).href);

/** Bir sayfanın şablonu: istemci derlemesindeki HTML (varlık bağlantıları onda). */
function templateFor(page) {
  if (page === 'home') return join(DIST, 'index.html');
  if (page === 'notfound') return join(DIST, '404.html');
  return join(DIST, page, 'index.html');
}

/** Çıktı yolu: /taykut/en/sponsor/ → dist/en/sponsor/index.html */
function outFor(path) {
  const rel = path.replace(/^\/taykut\//, '');
  if (rel.endsWith('.html')) return join(DIST, rel);
  return join(DIST, rel, 'index.html');
}

// İçerik güvenlik politikası (GitHub Pages başlık ayarına izin vermez; meta ile). Yalnız kendi kaynaklarımız.
// style-src 'unsafe-inline': React'in satır içi style özellikleri (ör. LQIP arka planı) için gerekli.
// JSON-LD veri bloğu çalıştırılabilir betik değildir; script-src onu engellemez.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function jsonLd(lang) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: 'TAYKUT',
    alternateName: 'Team Taykut',
    sport: lang === 'tr' ? 'Rover yarışmaları' : 'Rover competitions',
    url: `${ORIGIN}/taykut/${lang === 'en' ? 'en/' : ''}`,
    logo: `${ORIGIN}/taykut/favicon.svg`,
    sameAs: ['https://www.instagram.com/teamtaykut/'],
    memberOf: {
      '@type': 'EducationalOrganization',
      name:
        lang === 'tr'
          ? 'ASELSAN Mesleki ve Teknik Anadolu Lisesi'
          : 'ASELSAN Vocational and Technical Anatolian High School',
      address: { '@type': 'PostalAddress', addressLocality: 'Ankara', addressCountry: 'TR' },
    },
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

const templates = new Map();
const written = [];

for (const lang of LANGS) {
  for (const page of ROUTES) {
    const tplPath = templateFor(page);
    if (!templates.has(tplPath)) templates.set(tplPath, readFileSync(tplPath, 'utf8'));
    let html = templates.get(tplPath);
    const r = render(lang, page);
    const url = `${ORIGIN}${r.path}`;
    const og = `${ORIGIN}/taykut/og-${lang}.jpg`;

    const head = [
      `<meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
      `<meta name="referrer" content="strict-origin-when-cross-origin" />`,
      `<title>${esc(r.title)}</title>`,
      `<meta name="description" content="${esc(r.description)}" />`,
      page === 'notfound'
        ? '<meta name="robots" content="noindex" />'
        : `<link rel="canonical" href="${url}" />`,
      ...(page === 'notfound'
        ? []
        : [
            ...r.alternates.map(
              (a) => `<link rel="alternate" hreflang="${a.lang}" href="${ORIGIN}${a.path}" />`,
            ),
            `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${r.alternates[0].path}" />`,
          ]),
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="TAYKUT" />`,
      `<meta property="og:title" content="${esc(r.title)}" />`,
      `<meta property="og:description" content="${esc(r.description)}" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:image" content="${og}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${esc(r.ogAlt)}" />`,
      `<meta property="og:locale" content="${lang === 'tr' ? 'tr_TR' : 'en_US'}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      ...(page === 'home' ? [jsonLd(lang)] : []),
    ].join('\n    ');

    // Şablondaki başlık ve açıklamayı kaldır, yenilerini ekle
    html = html
      .replace(/<title>[\s\S]*?<\/title>\s*/, '')
      .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/, '')
      .replace('</head>', `  ${head}\n  </head>`)
      .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
      .replace('<div id="root"></div>', `<div id="root">${r.html}</div>`)
      .replace(/<noscript>[\s\S]*?<\/noscript>/, '');

    const out = outFor(r.path);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
    if (page !== 'notfound') written.push(url);
  }
}

// Site haritası
const today = new Date().toISOString().slice(0, 10);
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  written.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  '\n</urlset>\n';
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/taykut/sitemap.xml\n`);

if (existsSync('dist-ssr')) rmSync('dist-ssr', { recursive: true });
console.log(
  `✓ ${LANGS.length} dil × ${ROUTES.length} sayfa önceden üretildi; sitemap ${written.length} adres.`,
);
