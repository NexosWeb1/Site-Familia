/* =========================================================
   Gerador de robots.txt + sitemap.xml (roda no `npm run build`,
   via o script "prebuild" do package.json — ver README).
   =========================================================

   Por que um gerador, e não dois arquivos estáticos: as duas
   coisas precisam do domínio final do site (a linha `Sitemap:`
   do robots.txt e cada <loc> do sitemap), e esse domínio muda
   por deploy. Gerar os dois a partir da MESMA variável de
   ambiente (SITE_URL / VITE_SITE_URL) é o que garante que eles
   nunca fiquem apontando para domínios diferentes.

   Só entram no sitemap URLs que respondem 200. Este site é uma
   única página (SPA em Vite; ver CLAUDE.md — "Page section
   order"): as seções são âncoras (#historia, #ramos, ...) do
   mesmo documento, não rotas próprias. Fragmentos são ignorados
   pelos buscadores em sitemaps (e listá-los seria anunciar
   URLs duplicadas), então o sitemap tem exatamente uma entrada:
   a raiz. Se um dia o projeto ganhar rotas reais, basta
   acrescentá-las em ROUTES abaixo. */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = resolve(ROOT, 'public');

// loadEnv lê o .env do projeto do mesmo jeito que o Vite lê para o
// front-end — assim VITE_SITE_URL vale nos dois lados sem precisar
// duplicar a variável (Node puro não enxerga o .env sozinho).
const fileEnv = loadEnv(process.env.NODE_ENV || 'production', ROOT, '');

// Domínio público do site. Configure SITE_URL (ou VITE_SITE_URL, a mesma
// que o front-end usa para montar a tag canonical) no ambiente de build /
// no .env para sobrescrever. Sem ela, usa o domínio de produção abaixo (sem
// "www": o www.familiapintoarrudaleda.com.br responde 301 para ele).
const FALLBACK_SITE_URL = 'https://familiapintoarrudaleda.com.br';
const rawSiteUrl = (
  process.env.SITE_URL || process.env.VITE_SITE_URL ||
  fileEnv.SITE_URL || fileEnv.VITE_SITE_URL || ''
).trim();
const SITE_URL = (rawSiteUrl || FALLBACK_SITE_URL).replace(/\/+$/, '');

// Cada rota precisa responder 200 — nada de redirecionamento (301) nem de
// página inexistente (404). Ver o comentário do topo antes de adicionar
// âncoras aqui.
const ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' }
];

const lastmod = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

// CSS/JS/imagens ficam explicitamente liberados: bloquear os assets faz o
// Google renderizar a página sem estilo e sem dados, e avaliá-la como
// quebrada. O painel administrativo não é uma rota própria (é uma troca de
// view no mesmo documento — ver renderViewToggle() em src/main.js), por
// isso ele é marcado com <meta name="robots" content="noindex, nofollow">
// em tempo de execução (src/seo.js) em vez de um Disallow aqui.
const robots = `# robots.txt — Memórias & Legado
# Gerado por scripts/generate-seo-files.mjs (npm run build). Não edite à mão.

User-agent: *
Allow: /

# Assets necessários para o Google renderizar a página corretamente.
Allow: /assets/
Allow: /*.css$
Allow: /*.js$
Allow: /*.mjs$
Allow: /*.svg$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.webp$

Sitemap: ${SITE_URL}/sitemap.xml
`;

mkdirSync(PUBLIC_DIR, { recursive: true });
writeFileSync(resolve(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(resolve(PUBLIC_DIR, 'robots.txt'), robots, 'utf8');

console.log(`[seo] robots.txt e sitemap.xml gerados para ${SITE_URL}`);
