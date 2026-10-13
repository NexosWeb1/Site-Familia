/* =========================================================
   Memórias & Legado — src/seo.js
   SEO técnico em tempo de execução: canonical, meta robots,
   Open Graph, JSON-LD (Schema.org) e preload do recurso de LCP.
   =========================================================

   Este módulo NÃO toca em nada visível: ele só cria/atualiza tags
   dentro do <head>. Nenhuma função daqui escreve no <body>, em
   classes CSS ou em estilos de elementos da interface — se algum
   dia precisar, é sinal de que a mudança pertence a src/main.js,
   não aqui.

   O site é uma página só (SPA em Vite, seções em âncoras) com duas
   "views" no mesmo documento: a pública e o painel administrativo
   (ver renderViewToggle() em src/main.js). Como o painel não tem
   URL própria, o robots.txt não consegue isolá-lo — quem faz isso
   é setIndexable(false) abaixo, que troca o <meta name="robots">
   para "noindex, nofollow" enquanto o admin estiver aberto. */

// Domínio público preferencial (sem "www" — o www responde 301 para ele).
// VITE_SITE_URL sobrescreve; é a mesma variável usada pelo gerador de
// robots.txt/sitemap.xml (scripts/generate-seo-files.mjs). Fora do build de
// produção (npm run dev) o canonical cai na origem real do navegador, pra
// não apontar o ambiente local para o site de verdade.
const PRODUCTION_URL = 'https://familiapintoarrudaleda.com.br';
const SITE_URL = (
  String(import.meta.env.VITE_SITE_URL || '').trim() ||
  (import.meta.env.PROD ? PRODUCTION_URL : '')
).replace(/\/+$/, '');

const DEFAULT_DESCRIPTION =
  'Um arquivo vivo de memórias, ramos genealógicos, locais marcantes e documentos da família.';

/* ---------------------------------------------------------
   1. HELPERS DE <head>
   --------------------------------------------------------- */

// Cria a tag só se ela ainda não existir, senão reaproveita a que está lá —
// este módulo é chamado de novo a cada re-render (renderHero()), então
// criar sem checar encheria o <head> de duplicatas.
function upsertTag(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function upsertMeta(attr, name, content) {
  if (!content) return;
  const el = upsertTag(`meta[${attr}="${name}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(attr, name);
    return m;
  });
  el.setAttribute('content', content);
}

// Um <script type="application/ld+json"> por bloco, identificado por id,
// pra que uma nova chamada substitua o conteúdo em vez de acumular vários
// grafos concorrentes do mesmo tipo.
function upsertJsonLd(id, data) {
  const el = upsertTag(`script[type="application/ld+json"]#${id}`, () => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = id;
    return s;
  });
  el.textContent = JSON.stringify(data);
}

/* ---------------------------------------------------------
   2. URL CANÔNICA
   --------------------------------------------------------- */

// Sem query string e sem fragmento: as âncoras (#ramos, #memorias, ...) são
// a mesma página, e apontar cada uma como canonical criaria duplicatas.
// "index.html" é removido do final porque o servidor entrega o mesmo
// conteúdo em "/" — a raiz é a forma preferida.
export function canonicalUrl() {
  const origin = SITE_URL || window.location.origin;
  const path = window.location.pathname.replace(/\/index\.html$/, '/') || '/';
  return `${origin}${path}`;
}

export function applyCanonical() {
  const url = canonicalUrl();
  const link = upsertTag('link[rel="canonical"]', () => {
    const l = document.createElement('link');
    l.rel = 'canonical';
    return l;
  });
  link.setAttribute('href', url);
  upsertMeta('property', 'og:url', url);
  return url;
}

/* ---------------------------------------------------------
   3. INDEXAÇÃO (noindex no painel administrativo)
   --------------------------------------------------------- */

const INDEXABLE = 'index, follow, max-image-preview:large, max-snippet:-1';
const NOT_INDEXABLE = 'noindex, nofollow';

export function setIndexable(indexable) {
  upsertMeta('name', 'robots', indexable ? INDEXABLE : NOT_INDEXABLE);
}

/* ---------------------------------------------------------
   4. PRELOAD DO LCP
   --------------------------------------------------------- */

// A foto de fundo do hero é o maior elemento acima da dobra (o LCP) e vem
// do Supabase, então a URL só é conhecida depois do carregamento dos dados
// — não dá pra deixar o <link rel="preload"> fixo no index.html. Chamado
// por renderHero() imediatamente ANTES de aplicar o background, pra que a
// requisição saia com prioridade alta.
let preloadedLcpUrl = null;
export function preloadLcpImage(url) {
  if (!url || url === preloadedLcpUrl) return;
  preloadedLcpUrl = url;
  const link = upsertTag('link[rel="preload"][as="image"][data-lcp]', () => {
    const l = document.createElement('link');
    l.rel = 'preload';
    l.as = 'image';
    l.setAttribute('data-lcp', '');
    l.setAttribute('fetchpriority', 'high');
    return l;
  });
  link.setAttribute('href', url);
}

/* ---------------------------------------------------------
   5. OPEN GRAPH / TWITTER
   --------------------------------------------------------- */

export function applySocialMeta({ familyName, motto, photo } = {}) {
  const title = familyName ? `Família ${familyName} — Memórias & Legado` : document.title;
  const description = motto || DEFAULT_DESCRIPTION;

  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', 'Memórias & Legado');
  upsertMeta('property', 'og:locale', 'pt_BR');
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('name', 'twitter:card', photo ? 'summary_large_image' : 'summary');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  if (photo) {
    upsertMeta('property', 'og:image', photo);
    upsertMeta('property', 'og:image:alt', `Foto da família ${familyName || ''}`.trim());
    upsertMeta('name', 'twitter:image', photo);
  }
}

/* ---------------------------------------------------------
   6. DADOS ESTRUTURADOS (Schema.org / JSON-LD)
   --------------------------------------------------------- */

// Organization + WebSite descrevem o site em si (esta é a home); WebPage
// descreve o documento atual. Os três ficam ligados por @id pro Google ler
// como um grafo só, em vez de três entidades soltas.
export function applyStructuredData({ familyName, motto, photo, sections } = {}) {
  const url = canonicalUrl();
  const name = familyName ? `Família ${familyName}` : 'Memórias & Legado';
  const description = motto || DEFAULT_DESCRIPTION;

  upsertJsonLd('ldOrganization', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}#organization`,
    name,
    alternateName: 'Memórias & Legado',
    url,
    description,
    ...(photo ? { image: photo, logo: photo } : {})
  });

  upsertJsonLd('ldWebsite', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}#website`,
    url,
    name,
    description,
    inLanguage: 'pt-BR',
    publisher: { '@id': `${url}#organization` }
  });

  upsertJsonLd('ldWebPage', {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: document.title,
    description,
    inLanguage: 'pt-BR',
    isPartOf: { '@id': `${url}#website` },
    about: { '@id': `${url}#organization` },
    ...(photo ? { primaryImageOfPage: photo } : {}),
    // As seções são âncoras do mesmo documento, então entram como
    // hasPart/WebPageElement — não como páginas separadas (elas não têm URL
    // própria; ver scripts/generate-seo-files.mjs).
    ...(sections && sections.length
      ? {
        hasPart: sections.map((s) => ({
          '@type': 'WebPageElement',
          name: s.name,
          url: `${url}#${s.id}`
        }))
      }
      : {})
  });
}

// Seções públicas, na mesma ordem da navegação (ver "Page section order" no
// CLAUDE.md).
export const PAGE_SECTIONS = [
  { id: 'historia', name: 'História da Família' },
  { id: 'ramos', name: 'Árvore Genealógica' },
  { id: 'linha', name: 'Linha do Tempo' },
  { id: 'locais', name: 'Locais Marcantes' },
  { id: 'origens', name: 'Países de Origem dos Ancestrais' },
  { id: 'memorias', name: 'Memórias' },
  { id: 'biblioteca', name: 'Biblioteca da Família' }
];

// Ponto de entrada único chamado por renderHero(), depois que os dados do
// Supabase chegaram e o nome/lema/foto da família já são conhecidos.
export function applyHeroSeo(hero) {
  const data = {
    familyName: hero && hero.familyName,
    motto: hero && hero.motto,
    photo: hero && hero.photo
  };
  applyCanonical();
  applySocialMeta(data);
  applyStructuredData({ ...data, sections: PAGE_SECTIONS });
}
