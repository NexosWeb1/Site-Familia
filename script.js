/* =========================================================
   Memórias & Legado — script.js
   JavaScript Vanilla (ES6+) — sem frameworks/bibliotecas de UI
   ========================================================= */

/* ---------------------------------------------------------
   0. ÍCONES (SVG inline, sem dependências externas)
   --------------------------------------------------------- */
const ICONS = {
  scroll: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h11a3 3 0 0 1 3 3v1H9"/><path d="M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a3 3 0 0 0 3-3V8"/><line x1="9" y1="9" x2="16" y2="9"/><line x1="9" y1="13" x2="16" y2="13"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  'lock-keyhole': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="15.5" r="1.6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>',
  'arrow-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="4" x2="12" y2="20"/><polyline points="6 14 12 20 18 14"/></svg>',
  'arrow-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="20" y1="12" x2="4" y2="12"/><polyline points="10 6 4 12 10 18"/></svg>',
  milestone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="21"/><path d="M6 5h11l-3 4 3 4H6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  'chevron-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 6 9 12 15 18"/></svg>',
  'chevron-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>',
  'git-branch': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="3" x2="7" y2="14"/><circle cx="7" cy="18" r="2.5"/><circle cx="17" cy="6" r="2.5"/><path d="M17 8.5v2A5 5 0 0 1 12 15.5h-2"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14a5 5 0 0 1 5.5 5"/></svg>',
  'map-pin': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.5-7-11.5A7 7 0 0 1 19 9.5C19 14.5 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19 13.5v-3l-2-.5a6.6 6.6 0 0 0-.7-1.7l1-1.8-2.1-2.1-1.8 1a6.6 6.6 0 0 0-1.7-.7L11.2 3h-3l-.5 2a6.6 6.6 0 0 0-1.7.7l-1.8-1-2.1 2.1 1 1.8a6.6 6.6 0 0 0-.7 1.7l-2 .5v3l2 .5a6.6 6.6 0 0 0 .7 1.7l-1 1.9 2.1 2.1 1.9-1a6.6 6.6 0 0 0 1.7.7l.5 2h3l.5-2a6.6 6.6 0 0 0 1.7-.7l1.9 1 2.1-2.1-1-1.9a6.6 6.6 0 0 0 .7-1.7z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 4.5 3 18v3h3L19.5 7.5z"/><path d="M14.5 6.5 17.5 9.5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></svg>',
  'user-plus': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><line x1="18" y1="6" x2="18" y2="12"/><line x1="15" y1="9" x2="21" y2="9"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h8V4"/><path d="M8 20v-6h8v6"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 0 0-14.6-4.4"/><polyline points="5.5 3 5.5 7 9.5 7"/><path d="M4 13a8 8 0 0 0 14.6 4.4"/><polyline points="20 21 20 17 16 17"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17.4 8 4 4 0 0 1 17 18H7z"/></svg>',
  'cloud-check': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17.4 6 4 4 0 0 1 17 16H7z"/><polyline points="9 16.5 11 18.5 15.5 13.5"/></svg>',
  'cloud-off': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17.4 8 4 4 0 0 1 17 18H7z"/><line x1="3" y1="3" x2="21" y2="21"/></svg>',
  loader: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.9" y1="4.9" x2="7.8" y2="7.8"/><line x1="16.2" y1="16.2" x2="19.1" y2="19.1"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>',
  'hard-drive': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><rect x="3" y="12" width="18" height="7" rx="1.5"/><line x1="7" y1="16" x2="7.01" y2="16"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>',
  'alert-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16.2" x2="12" y2="16.3"/></svg>',
  'trash-2': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><path d="M6 7V4h12v3"/><path d="M6 7l1 13h10l1-13"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>',
  'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><polyline points="14 3 14 8 19 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M21 16l-5.5-5.5L4 21"/></svg>',
  'message-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'
};

function iconHtml(name) { return ICONS[name] || ''; }

// Substitui os placeholders estáticos ${icon:nome} escritos no index.html por SVGs reais.
(function replaceIconPlaceholders() {
  document.body.innerHTML = document.body.innerHTML.replace(/\$\{icon:([a-z0-9-]+)\}/g, (_, name) => iconHtml(name));
})();

/* ---------------------------------------------------------
   1. DADOS PADRÃO / NORMALIZAÇÃO
   --------------------------------------------------------- */
const ADMIN_PASSWORD = 'familia2026';
const LS_DATA_KEY = 'fam_data';
const LS_CFG_KEY = 'fam_cfg';

function defaultPerson() { return { name: '', photo: '', birth: '', death: '', bio: '' }; }
// Um filho pode ter seus próprios agregados: cônjuge e filhos (netos do
// patriarca/matriarca do ramo). Não recursivo além disso — netos não têm
// cônjuge/filhos próprios exibidos.
function defaultChild() { return Object.assign(defaultPerson(), { spouse: null, children: [] }); }
function normalizeChild(c) {
  c = c || {};
  return Object.assign(defaultPerson(), c, {
    spouse: c.spouse && c.spouse.name ? Object.assign(defaultPerson(), c.spouse) : null,
    children: Array.isArray(c.children) ? c.children.map(k => Object.assign(defaultPerson(), k)) : []
  });
}

function defaultData() {
  return {
    hero: {
      familyName: 'Arruda & Pinto & Leda',
      motto: 'Guardadas as memórias, honramos quem veio antes e semeamos quem virá depois.',
      encontros: [
        { id: 'e1', title: 'O Reencontro do Sítio', date: 'Julho de 1968', local: 'Sítio Ancestral, Minas Gerais', desc: 'Os descendentes de Manoel Albuquerque, já divididos entre os ramos Arruda, Pinto e Leda, voltaram a se encontrar durante a construção do sítio.', photo: '', photos: [] },
        { id: 'e2', title: 'O Casamento que Uniu os Ramos', date: 'Setembro de 1985', local: 'Casa de Paraty', desc: 'Um casamento entre os ramos Pinto e Leda selou a aliança entre as famílias, celebrado na casa à beira-mar.', photo: '', photos: [] },
        { id: 'e3', title: 'O Grande Reencontro', date: '2001', local: 'Sítio Ancestral, Minas Gerais', desc: 'Primeiro encontro a reunir mais de 120 descendentes de todos os ramos em uma só grande família.', photo: '', photos: [] }
      ]
    },
    branches: [
      {
        id: 'b1', name: 'Os Arruda', photo: '',
        story: 'Guardiões do arquivo fotográfico e dos documentos de imigração, este ramo cresceu na capital paulista mantendo viva a memória escrita da família.',
        father: { name: 'Joaquim Arruda', photo: '', birth: '1898', death: '1970', bio: 'Imigrante português, fundou o primeiro comércio da família no Brasil.' },
        mother: { name: 'Helena Silva', photo: '', birth: '1902', death: '1994', bio: 'Aos 88 anos, era a memória viva de todas as histórias — cada nome, cada data, cada receita.' },
        children: [
          {
            name: 'Rafael Silva', photo: '', birth: '1928', death: '2015', bio: 'Digitalizou mais de 2.000 fotografias e cartas antigas para as próximas gerações.',
            spouse: { name: 'Cecília Nogueira', photo: '', birth: '1932', death: '2019', bio: '' },
            children: [
              { name: 'André Silva', photo: '', birth: '1955', death: '', bio: '' },
              { name: 'Marina Silva', photo: '', birth: '1958', death: '', bio: '' }
            ]
          }
        ],
        photos: [], documents: [], comments: []
      },
      {
        id: 'b2', name: 'Os Pintos', photo: '',
        story: 'Descendentes de Maria Albuquerque, espalhados pelo Nordeste, celebram a tradição da música e da culinária ancestral.',
        father: defaultPerson(),
        mother: { name: 'Maria Albuquerque', photo: '', birth: '1910', death: '1988', bio: 'Costureira e contadora de causos, deu nome a um dos ramos mais numerosos.' },
        children: [
          { name: 'Tiago Nunes', photo: '', birth: '1935', death: '', bio: 'Mantém o caderno de receitas centenário e organiza o almoço anual da família.' }
        ],
        photos: [], documents: [], comments: []
      },
      {
        id: 'b3', name: 'Os Leda', photo: '',
        story: 'Ligados à casa à beira-mar, este ramo preserva as tradições do litoral e a manutenção do casarão histórico.',
        father: defaultPerson(),
        mother: { name: 'Beatriz Costa', photo: '', birth: '1940', death: '', bio: 'Cuida da Casa de Paraty e recebe os parentes durante as festas de fim de ano.' },
        children: [],
        photos: [], documents: [], comments: []
      }
    ],
    familyUnion: {
      story: 'Em 1968, durante a construção do Sítio Ancestral em Minas Gerais, os descendentes de Manoel Albuquerque — já divididos entre os ramos Arruda, Pinto e Leda — voltaram a se encontrar. Ao longo das décadas seguintes, casamentos e alianças entre os três ramos foram tecendo um só tecido familiar. O Grande Reencontro de 2001 celebrou essa união, reunindo mais de 120 descendentes de todos os ramos em uma só grande família.',
      photos: []
    },
    places: [
      { id: 'p1', name: 'A Casa de Paraty', photo: '', story: 'Casario colonial de janelas azuis, construído em 1934 sobre pedras trazidas de barco. Abriga móveis, retratos e o relógio de parede que nunca parou.', importance: 'Ponto de encontro de cinco gerações — cada verão, um novo capítulo escrito nas suas paredes.' },
      { id: 'p2', name: 'O Sítio Ancestral', photo: '', story: 'Entre cafezais no interior de Minas, o sítio guarda o forno a lenha e a figueira centenária plantada pelo bisavô.', importance: 'Onde nasceram as tradições da roça: a colheita, o fubá e as noites de viola.' },
      { id: 'p3', name: 'A Igreja Matriz', photo: '', story: 'Pequena capela onde foram celebrados batizados, casamentos e despedidas ao longo de mais de um século.', importance: 'Testemunha silenciosa dos grandes momentos que uniram a família.' }
    ]
  };
}

function normalizeBranch(b) {
  b = b || {};
  return {
    id: b.id || uid('b'),
    name: b.name || '',
    photo: b.photo || '',
    story: b.story || '',
    father: Object.assign(defaultPerson(), b.father || {}),
    mother: Object.assign(defaultPerson(), b.mother || {}),
    children: Array.isArray(b.children) ? b.children.map(normalizeChild) : [],
    photos: Array.isArray(b.photos) ? b.photos : [],
    documents: Array.isArray(b.documents) ? b.documents : [],
    comments: Array.isArray(b.comments) ? b.comments : []
  };
}

function normalizeEncontro(e) {
  e = e || {};
  return {
    id: e.id || uid('e'),
    title: e.title || '',
    date: e.date || '',
    local: e.local || '',
    photo: e.photo || '',
    photos: Array.isArray(e.photos) ? e.photos : [],
    desc: e.desc || ''
  };
}

function normalizeData(d) {
  const def = defaultData();
  d = d || {};
  return {
    hero: Object.assign({}, def.hero, d.hero || {}, {
      encontros: Array.isArray(d.hero && d.hero.encontros) && d.hero.encontros.length
        ? d.hero.encontros.map(normalizeEncontro)
        : def.hero.encontros
    }),
    branches: Array.isArray(d.branches) && d.branches.length ? d.branches.map(normalizeBranch) : def.branches,
    familyUnion: Object.assign({ story: '', photos: [] }, d.familyUnion || {}, {
      photos: Array.isArray(d.familyUnion && d.familyUnion.photos) ? d.familyUnion.photos : (def.familyUnion.photos)
    }),
    places: Array.isArray(d.places) ? d.places : def.places
  };
}

/* ---------------------------------------------------------
   2. ESTADO DA APLICAÇÃO
   --------------------------------------------------------- */
const state = {
  data: null,
  view: 'public', // 'public' | 'admin'
  loading: true,
  authed: false,
  activeBranchId: null,
  activePlaceId: null,
  activeEncontroIndex: 0,
  editType: null, // 'hero' | 'branch' | 'place' | 'union'
  editId: null,
  draft: null,
  syncStatus: '', // '', 'saving', 'saved', 'local', 'error'
  cfg: { binId: '', key: '' }
};

function uid(prefix) { return (prefix || 'x') + Math.random().toString(36).slice(2, 9); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function truncate(str, n) {
  str = str || '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}
function initials(name) {
  return (name || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}
function lifespan(p) {
  if (!p || (!p.birth && !p.death)) return '';
  return `${p.birth || '?'} — ${p.death || 'presente'}`;
}
function personCount(b) {
  return (b.father && b.father.name ? 1 : 0) + (b.mother && b.mother.name ? 1 : 0) + (b.children || []).length;
}

const PLACEHOLDER_GRADIENT = 'repeating-linear-gradient(45deg,#efe7d8,#efe7d8 12px,#e6dbc6 12px,#e6dbc6 24px)';
function photoStyle(url) {
  return url ? `background-image:url("${escapeHtml(url)}")` : `background-image:${PLACEHOLDER_GRADIENT}`;
}
function avatarStyle(url) {
  return url ? `background-image:url("${escapeHtml(url)}")` : 'background-image:linear-gradient(135deg,#3f6a6b,#34595a)';
}

/* ---------------------------------------------------------
   3. PERSISTÊNCIA (localStorage + JSONBin.io via fetch)
   --------------------------------------------------------- */
function loadCfgFromStorage() {
  try {
    const c = JSON.parse(localStorage.getItem(LS_CFG_KEY) || 'null');
    if (c && typeof c === 'object') return { binId: c.binId || '', key: c.key || '' };
  } catch (e) { }
  return { binId: '', key: '' };
}

async function loadData(cfg) {
  cfg = cfg || state.cfg;
  setLoading(true);
  if (cfg && cfg.binId && cfg.key) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${encodeURIComponent(cfg.binId)}/latest`, {
        headers: { 'X-Master-Key': cfg.key }
      });
      if (res.ok) {
        const json = await res.json();
        state.data = normalizeData(json.record);
        setLoading(false);
        return;
      }
    } catch (e) { /* falls back to local */ }
  }
  let local = null;
  try { local = JSON.parse(localStorage.getItem(LS_DATA_KEY) || 'null'); } catch (e) { }
  state.data = normalizeData(local || defaultData());
  setLoading(false);
}

async function persist(newData) {
  state.data = newData;
  try { localStorage.setItem(LS_DATA_KEY, JSON.stringify(newData)); } catch (e) { }
  renderAll();

  const cfg = state.cfg;
  if (cfg && cfg.binId && cfg.key) {
    setSyncStatus('saving');
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${encodeURIComponent(cfg.binId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': cfg.key },
        body: JSON.stringify(newData)
      });
      setSyncStatus(res.ok ? 'saved' : 'error');
    } catch (e) {
      setSyncStatus('error');
    }
  } else {
    setSyncStatus('local');
  }
  clearTimeout(persist._t);
  persist._t = setTimeout(() => setSyncStatus(''), 2600);
}

function setLoading(v) {
  state.loading = v;
  document.getElementById('loadingOverlay').classList.toggle('hidden', !v);
}

function setSyncStatus(status) {
  state.syncStatus = status;
  renderSyncLabel();
}

/* ---------------------------------------------------------
   4. RENDERIZAÇÃO — VIEW PÚBLICA
   --------------------------------------------------------- */
function renderAll() {
  renderHero();
  renderEncontros();
  renderFamilyUnion();
  renderBranches();
  renderPlaces();
  renderAdminSummaries();
  renderAdminBranchList();
  renderAdminPlaceList();
  renderViewToggle();
}

function renderHero() {
  const hero = state.data.hero;
  document.getElementById('heroFamilyName').textContent = hero.familyName;
  document.getElementById('heroMotto').textContent = hero.motto;
  document.getElementById('footerFamilyName').textContent = hero.familyName;
}

// Encontros são exibidos como 3 abas navegáveis (uma por registro de reunião
// da família) em vez de um grid estático — clicar numa aba troca o painel
// abaixo, que mostra data, local, descrição e o álbum de fotos daquele encontro.
function renderEncontros() {
  const tabsEl = document.getElementById('encontrosTabs');
  const panelEl = document.getElementById('encontrosPanel');
  const encontros = state.data.hero.encontros || [];

  if (!encontros.length) {
    tabsEl.innerHTML = '';
    panelEl.innerHTML = '<p class="modal-story">Nenhum encontro registrado ainda.</p>';
    return;
  }

  if (state.activeEncontroIndex >= encontros.length) state.activeEncontroIndex = 0;

  tabsEl.innerHTML = encontros.map((e, i) => `
    <button type="button" class="encontro-tab ${i === state.activeEncontroIndex ? 'is-active' : ''}" data-action="selectEncontro" data-index="${i}">
      ${e.date ? escapeHtml(e.date) + ' — ' : ''}${escapeHtml(e.title)}
    </button>
  `).join('');

  renderEncontroPanel(encontros[state.activeEncontroIndex]);
}

function renderEncontroPanel(e) {
  const panelEl = document.getElementById('encontrosPanel');
  panelEl.innerHTML = `
    <div class="encontro-panel-card">
      <span class="encontro-panel-photo" style="${photoStyle(e.photo)}">
        ${!e.photo ? '<span class="no-photo-label">FOTO DO ENCONTRO</span>' : ''}
      </span>
      <div class="encontro-panel-body">
        <div class="encontro-meta">
          ${e.date ? `<span class="encontro-meta-item"><span class="icon" aria-hidden="true">${iconHtml('calendar')}</span> ${escapeHtml(e.date)}</span>` : ''}
          ${e.local ? `<span class="encontro-meta-item"><span class="icon" aria-hidden="true">${iconHtml('map-pin')}</span> ${escapeHtml(e.local)}</span>` : ''}
        </div>
        <h3 class="encontro-panel-title">${escapeHtml(e.title)}</h3>
        <p class="encontro-desc">${escapeHtml(e.desc)}</p>
        <div class="encontro-album-label">Álbum do encontro</div>
        <div class="photo-gallery-grid">${galleryHtml(e.photos)}</div>
      </div>
    </div>`;
}

function renderFamilyUnion() {
  const u = state.data.familyUnion || { story: '', photos: [] };
  document.getElementById('unionStory').textContent = u.story;
  const strip = document.getElementById('unionPhotosStrip');
  const photos = (u.photos || []).slice(0, 4);
  strip.innerHTML = photos.length
    ? photos.map(p => `<span class="union-photo-thumb" style="${photoStyle(p.url)}"></span>`).join('')
    : `<span class="union-photo-thumb placeholder icon">${iconHtml('image')}</span>`;
}

function renderBranches() {
  const grid = document.getElementById('branchesGrid');
  const branches = state.data.branches || [];
  grid.innerHTML = branches.map((b) => `
    <button type="button" class="branch-card" data-action="openBranch" data-id="${b.id}">
      <span class="branch-photo" style="${photoStyle(b.photo)}">
        ${!b.photo ? '<span class="no-photo-label">FOTO DO RAMO</span>' : ''}
        <span class="branch-badge icon">${iconHtml('git-branch')}</span>
      </span>
      <span class="branch-body">
        <span class="branch-name">${escapeHtml(b.name)}</span>
        <span class="branch-preview">${escapeHtml(b.story)}</span>
        <span class="branch-count"><span class="icon" aria-hidden="true">${iconHtml('users')}</span> ${personCount(b)} integrantes</span>
      </span>
    </button>
  `).join('');

  const prevBtn = document.getElementById('branchPrev');
  const nextBtn = document.getElementById('branchNext');
  const showArrows = branches.length > 3;
  prevBtn.classList.toggle('hidden', !showArrows);
  nextBtn.classList.toggle('hidden', !showArrows);
}

function renderPlaces() {
  const grid = document.getElementById('placesGrid');
  const places = state.data.places || [];
  grid.innerHTML = places.map((p) => `
    <button type="button" class="place-card" data-action="openPlace" data-id="${p.id}">
      <span class="place-photo" style="${photoStyle(p.photo)}">
        ${!p.photo ? '<span class="no-photo-label">FOTO DO LOCAL</span>' : ''}
      </span>
      <span class="place-body">
        <span class="place-eyebrow"><span class="icon" aria-hidden="true">${iconHtml('map-pin')}</span> Local histórico</span>
        <span class="place-name">${escapeHtml(p.name)}</span>
        <span class="place-preview">${escapeHtml(truncate(p.story, 80))}</span>
      </span>
    </button>
  `).join('');
}

/* ---------------------------------------------------------
   5. MODAIS PÚBLICOS — RAMO / FOTOS GERAIS / LOCAL
   --------------------------------------------------------- */
function buildPeopleArray(b) {
  const people = [];
  if (b.father && b.father.name) people.push({ pid: 'father', name: b.father.name, photo: b.father.photo, role: 'Patriarca', dates: lifespan(b.father), bio: b.father.bio });
  if (b.mother && b.mother.name) people.push({ pid: 'mother', name: b.mother.name, photo: b.mother.photo, role: 'Matriarca', dates: lifespan(b.mother), bio: b.mother.bio });
  (b.children || []).forEach((c, i) => {
    if (c.name) people.push({ pid: 'child' + i, name: c.name, photo: c.photo, role: 'Filho(a)', dates: lifespan(c), bio: c.bio, spouse: c.spouse, children: c.children });
  });
  return people;
}

// Fileiras com muita gente diminuem o tamanho das fotos automaticamente,
// para não estourar a largura da coluna.
function peopleRowSizeClass(row) {
  return row.length > 5 ? 'people-photo-tiny' : row.length > 3 ? 'people-photo-compact' : '';
}
function peoplePhotoHtml(p, sizeClass) {
  return `
    <div class="people-photo ${sizeClass || ''}" data-person-id="${p.pid}" style="${avatarStyle(p.photo)}">
      ${!p.photo ? `<span class="people-photo-fallback">${escapeHtml(initials(p.name))}</span>` : ''}
    </div>`;
}
function peopleRowHtml(p) {
  return `
    <div class="people-row" data-person-id="${p.pid}">
      <div class="people-row-head">
        <span class="people-pill"></span>
        <span class="people-name">${escapeHtml(p.name)}</span>
        ${p.dates ? `<span class="people-dates-inline">${escapeHtml(p.dates)}</span>` : ''}
      </div>
      ${p.role ? `<p class="people-role">${escapeHtml(p.role)}</p>` : ''}
    </div>`;
}
// Sincroniza o destaque (hover) entre foto e nome para qualquer contêiner
// que siga o padrão foto/lista com atributo data-person-id.
function wirePeopleHover(container, onClick) {
  function setHover(id) {
    container.querySelectorAll('[data-person-id]').forEach((node) => {
      const match = node.dataset.personId === id;
      node.classList.toggle('is-active', !!id && match);
      node.classList.toggle('is-dimmed', !!id && !match);
    });
  }
  container.querySelectorAll('[data-person-id]').forEach((node) => {
    node.addEventListener('mouseenter', () => setHover(node.dataset.personId));
    node.addEventListener('mouseleave', () => setHover(null));
    if (onClick) node.addEventListener('click', () => onClick(node.dataset.personId));
  });
}

// Mostra pais e filhos como uma galeria de fotos escalonada + lista de nomes.
// Passar o mouse sincroniza o destaque entre foto e nome; clicar coloca a
// pessoa em foco num painel maior, e a janela do ramo cresce para acomodá-lo.
function renderPeopleShowcase(gridId, spotlightId, modalBoxId, people) {
  const grid = document.getElementById(gridId);
  const spotlight = document.getElementById(spotlightId);
  const modalBox = document.getElementById(modalBoxId);

  spotlight.classList.add('hidden');
  spotlight.innerHTML = '';
  grid.classList.remove('hidden');
  if (modalBox) modalBox.classList.remove('is-focused');

  if (!people.length) {
    grid.innerHTML = '<p class="modal-story">Nenhum integrante cadastrado ainda.</p>';
    return;
  }

  const byId = {};
  people.forEach((p) => { byId[p.pid] = p; });

  // Pais numa fileira, filhos na(s) fileira(s) abaixo — mesma geração, mesmo tamanho.
  const parents = people.filter(p => p.pid === 'father' || p.pid === 'mother');
  const children = people.filter(p => p.pid.startsWith('child'));

  grid.innerHTML = `
    <div class="people-photos">
      ${parents.length ? `<div class="people-photo-row">${parents.map(p => peoplePhotoHtml(p, peopleRowSizeClass(parents))).join('')}</div>` : ''}
      ${children.length ? `<div class="people-photo-row">${children.map(p => peoplePhotoHtml(p, peopleRowSizeClass(children))).join('')}</div>` : ''}
    </div>
    <div class="people-list">
      ${people.map(peopleRowHtml).join('')}
    </div>`;

  wirePeopleHover(grid, (id) => openPersonSpotlight(spotlight, grid, modalBox, byId[id]));
}

// Filhos podem ter cônjuge e filhos próprios (netos do patriarca/matriarca);
// esse bloco aparece no spotlight só quando existir algo cadastrado, com a
// mesma estrutura foto+lista (e o mesmo hover) do showcase principal.
function familyHtml(p) {
  const members = [];
  if (p.spouse && p.spouse.name) {
    members.push({ pid: 'famSpouse', name: p.spouse.name, photo: p.spouse.photo, role: 'Cônjuge', dates: lifespan(p.spouse) });
  }
  (p.children || []).filter(k => k.name).forEach((k, i) => {
    members.push({ pid: 'famKid' + i, name: k.name, photo: k.photo, role: 'Neto(a)', dates: lifespan(k) });
  });
  if (!members.length) return '';
  const sizeClass = peopleRowSizeClass(members);
  return `
    <div class="spotlight-family">
      <div class="spotlight-family-label">Família</div>
      <div class="people-showcase spotlight-family-showcase">
        <div class="people-photos">
          <div class="people-photo-row">${members.map(m => peoplePhotoHtml(m, sizeClass)).join('')}</div>
        </div>
        <div class="people-list">${members.map(peopleRowHtml).join('')}</div>
      </div>
    </div>`;
}

function openPersonSpotlight(spotlight, grid, modalBox, p) {
  if (!p) return;
  spotlight.innerHTML = `
    <span class="people-spotlight-photo">${!p.photo ? escapeHtml(initials(p.name)) : ''}</span>
    <div class="people-spotlight-info">
      <button type="button" class="people-spotlight-back">${iconHtml('arrow-left')} Voltar para a lista</button>
      <div class="people-spotlight-name">${escapeHtml(p.name)}</div>
      ${p.role ? `<div class="people-spotlight-role">${escapeHtml(p.role)}</div>` : ''}
      ${p.dates ? `<div class="people-spotlight-dates">${escapeHtml(p.dates)}</div>` : ''}
      <p class="people-spotlight-bio">${escapeHtml(p.bio) || 'Nenhuma história registrada ainda para esta pessoa.'}</p>
      ${familyHtml(p)}
    </div>`;
  spotlight.querySelector('.people-spotlight-photo').style.cssText = avatarStyle(p.photo);
  spotlight.classList.remove('hidden');
  grid.classList.add('hidden');
  if (modalBox) modalBox.classList.add('is-focused');
  spotlight.querySelector('.people-spotlight-back').addEventListener('click', () => closePersonSpotlight(spotlight, grid, modalBox));
  const familyShowcase = spotlight.querySelector('.spotlight-family-showcase');
  if (familyShowcase) wirePeopleHover(familyShowcase);
}

function closePersonSpotlight(spotlight, grid, modalBox) {
  spotlight.classList.add('hidden');
  grid.classList.remove('hidden');
  if (modalBox) modalBox.classList.remove('is-focused');
}

// "Visão geral da família": árvore com casais lado a lado (patriarca+matriarca,
// e cada filho+cônjuge) e os respectivos filhos numa fileira abaixo do casal.
function treePersonHtml(person, role) {
  if (!person || !person.name) return '';
  return `
    <div class="tree-person">
      <div class="tree-person-photo" style="${avatarStyle(person.photo)}">
        ${!person.photo ? `<span class="tree-person-fallback">${escapeHtml(initials(person.name))}</span>` : ''}
      </div>
      <div class="tree-person-name">${escapeHtml(person.name)}</div>
      ${role ? `<div class="tree-person-role">${role}</div>` : ''}
    </div>`;
}

function treeCoupleHtml(a, roleA, b, roleB) {
  const aHtml = treePersonHtml(a, roleA);
  const bHtml = treePersonHtml(b, roleB);
  if (aHtml && bHtml) return `<div class="tree-couple">${aHtml}<span class="tree-couple-link"></span>${bHtml}</div>`;
  return (aHtml || bHtml) ? `<div class="tree-couple tree-couple-single">${aHtml || bHtml}</div>` : '';
}

function familyTreeHtml(b) {
  const hasParents = (b.father && b.father.name) || (b.mother && b.mother.name);
  const children = (b.children || []).filter(c => c.name);
  if (!hasParents && !children.length) return '<p class="modal-story">Nenhum integrante cadastrado ainda.</p>';

  const parentsHtml = hasParents
    ? `<div class="tree-generation">${treeCoupleHtml(b.father, 'Patriarca', b.mother, 'Matriarca')}</div>`
    : '';

  const childUnits = children.map(c => {
    const coupleHtml = treeCoupleHtml(c, 'Filho(a)', c.spouse, 'Cônjuge');
    const kids = (c.children || []).filter(k => k.name);
    const kidsHtml = kids.length
      ? `<div class="tree-connector tree-connector-sm"></div><div class="tree-grandkids">${kids.map(k => treePersonHtml(k, 'Neto(a)')).join('')}</div>`
      : '';
    return `<div class="tree-unit">${coupleHtml}${kidsHtml}</div>`;
  }).join('');

  const childrenHtml = children.length
    ? `${hasParents ? '<div class="tree-connector"></div>' : ''}<div class="tree-generation tree-generation-children">${childUnits}</div>`
    : '';

  return `<div class="family-tree-inner">${parentsHtml}${childrenHtml}</div>`;
}

function renderFamilyTree(containerId, branch) {
  document.getElementById(containerId).innerHTML = familyTreeHtml(branch);
}

function toggleFamilyTree(show) {
  const tree = document.getElementById('branchModalTree');
  const grid = document.getElementById('branchModalPeople');
  const spotlight = document.getElementById('peopleSpotlight');
  const btn = document.getElementById('btnToggleFamilyTree');
  const modalBox = document.getElementById('branchModalBox');

  tree.classList.toggle('hidden', !show);
  grid.classList.toggle('hidden', show);
  spotlight.classList.add('hidden');
  if (modalBox) modalBox.classList.remove('is-focused');
  btn.classList.toggle('is-active', show);
  btn.innerHTML = show
    ? `${iconHtml('arrow-left')} Voltar para a lista`
    : `${iconHtml('git-branch')} Visão geral da família`;
}

function galleryHtml(photos) {
  return (photos || []).length
    ? photos.map(p => `
      <div class="gallery-item">
        <span class="gallery-photo" style="${photoStyle(p.url)}"></span>
        ${p.caption ? `<span class="gallery-caption">${escapeHtml(p.caption)}</span>` : ''}
      </div>`).join('')
    : '<p class="modal-story">Nenhuma foto adicionada ainda.</p>';
}

function openBranchModal(id) {
  const b = (state.data.branches || []).find(x => x.id === id);
  if (!b) return;
  state.activeBranchId = id;
  document.getElementById('branchModalName').textContent = b.name;
  document.getElementById('branchModalStory').textContent = b.story;

  renderPeopleShowcase('branchModalPeople', 'peopleSpotlight', 'branchModalBox', buildPeopleArray(b));
  renderFamilyTree('branchModalTree', b);
  toggleFamilyTree(false);

  document.getElementById('branchModalPhotos').innerHTML = galleryHtml(b.photos);

  document.getElementById('branchModalDocuments').innerHTML = (b.documents || []).length
    ? b.documents.map(d => `
      <a class="document-item" href="${escapeHtml(d.url)}" target="_blank" rel="noopener">
        <span class="icon">${iconHtml('file-text')}</span>
        <span>${escapeHtml(d.name || d.url)}</span>
      </a>`).join('')
    : '<p class="modal-story">Nenhum documento adicionado ainda.</p>';

  document.getElementById('branchModalComments').innerHTML = commentsHtml(b.comments);

  document.getElementById('commentName').value = '';
  document.getElementById('commentText').value = '';

  document.getElementById('branchModalBody').scrollTop = 0;
  document.getElementById('modalScrollHint').classList.remove('faded');

  showModal('branchModal');
}

function commentsHtml(comments) {
  return (comments || []).length
    ? comments.map(c => `
      <div class="comment-item">
        <div class="comment-head"><span class="comment-name">${escapeHtml(c.name)}</span><span class="comment-date">${escapeHtml(c.date)}</span></div>
        <p class="comment-text">${escapeHtml(c.text)}</p>
      </div>`).join('')
    : '<p class="modal-story">Seja o primeiro a deixar uma lembrança sobre esta família.</p>';
}

function submitComment(e) {
  e.preventDefault();
  const name = document.getElementById('commentName').value.trim();
  const text = document.getElementById('commentText').value.trim();
  if (!name || !text || !state.activeBranchId) return;
  const d = clone(state.data);
  const b = d.branches.find(x => x.id === state.activeBranchId);
  if (!b) return;
  b.comments = b.comments || [];
  b.comments.push({ name, text, date: new Date().toLocaleDateString('pt-BR') });
  persist(d);
  // Atualiza só a lista de comentários (sem reabrir o modal) para não perder
  // a posição de rolagem nem o estado de foco numa pessoa.
  document.getElementById('branchModalComments').innerHTML = commentsHtml(b.comments);
  document.getElementById('commentName').value = '';
  document.getElementById('commentText').value = '';
}

function openGeneralPhotosModal() {
  const photos = (state.data.familyUnion && state.data.familyUnion.photos) || [];
  document.getElementById('generalPhotosGrid').innerHTML = galleryHtml(photos);
  showModal('generalPhotosModal');
}

function openPlaceModal(id) {
  const p = (state.data.places || []).find(x => x.id === id);
  if (!p) return;
  const photoEl = document.getElementById('placeModalPhoto');
  photoEl.style.cssText += photoStyle(p.photo);
  photoEl.querySelectorAll('.no-photo-label').forEach(n => n.remove());
  if (!p.photo) photoEl.insertAdjacentHTML('beforeend', '<span class="no-photo-label">FOTO DO LOCAL</span>');
  document.getElementById('placeModalName').textContent = p.name;
  document.getElementById('placeModalStory').textContent = p.story;
  document.getElementById('placeModalImportance').textContent = p.importance;
  showModal('placeModal');
}

function showModal(id) { document.getElementById(id).classList.remove('hidden'); }
function hideModal(id) { document.getElementById(id).classList.add('hidden'); }
function hideAllModals() {
  ['authModal', 'branchModal', 'generalPhotosModal', 'placeModal', 'editHeroModal', 'editBranchModal', 'editUnionModal', 'editPlaceModal'].forEach(hideModal);
}

/* ---------------------------------------------------------
   6. AUTENTICAÇÃO DO ADMIN
   --------------------------------------------------------- */
function goAdmin() {
  if (state.authed) {
    state.view = 'admin';
    renderViewToggle();
  } else {
    document.getElementById('authInput').value = '';
    document.getElementById('authError').classList.add('hidden');
    showModal('authModal');
    setTimeout(() => document.getElementById('authInput').focus(), 50);
  }
}

function submitAuth() {
  const val = document.getElementById('authInput').value;
  if (val === ADMIN_PASSWORD) {
    state.authed = true;
    hideModal('authModal');
    state.view = 'admin';
    renderViewToggle();
  } else {
    document.getElementById('authErrorText').textContent = 'Senha incorreta. Tente novamente.';
    document.getElementById('authError').classList.remove('hidden');
  }
}

function goPublic() { state.view = 'public'; renderViewToggle(); }

function renderViewToggle() {
  document.getElementById('publicView').classList.toggle('hidden', state.view !== 'public');
  document.getElementById('adminView').classList.toggle('hidden', state.view !== 'admin');
}

/* ---------------------------------------------------------
   7. PAINEL ADMIN — RESUMOS E LISTAS
   --------------------------------------------------------- */
function renderAdminSummaries() {
  const hero = state.data.hero;
  document.getElementById('heroSummary').innerHTML =
    `Nome: <b>${escapeHtml(hero.familyName)}</b> · ${(hero.encontros || []).length} encontros registrados.`;

  const u = state.data.familyUnion || { story: '', photos: [] };
  document.getElementById('unionSummary').innerHTML = u.story
    ? `${escapeHtml(truncate(u.story, 140))} · ${(u.photos || []).length} fotos gerais.`
    : 'Nenhuma história de união cadastrada ainda.';
}

function renderAdminBranchList() {
  const list = document.getElementById('adminBranchList');
  list.innerHTML = (state.data.branches || []).map(b => `
    <div class="admin-list-item">
      <div>
        <div class="admin-list-item-name">${escapeHtml(b.name)}</div>
        <div class="admin-list-item-meta">${personCount(b)} integrantes · ${(b.photos || []).length} fotos · ${(b.documents || []).length} documentos · ${(b.comments || []).length} comentários</div>
      </div>
      <div class="admin-list-actions">
        <button type="button" class="btn btn-outline btn-sm" data-action="editBranch" data-id="${b.id}"><span class="icon">${iconHtml('pencil')}</span> Editar</button>
        <button type="button" class="btn-danger-icon" data-action="deleteBranch" data-id="${b.id}"><span class="icon">${iconHtml('trash-2')}</span></button>
      </div>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhum ramo cadastrado ainda.</p>';
}

function renderAdminPlaceList() {
  const list = document.getElementById('adminPlaceList');
  list.innerHTML = (state.data.places || []).map(p => `
    <div class="admin-list-item">
      <div class="admin-list-item-name">${escapeHtml(p.name)}</div>
      <div class="admin-list-actions">
        <button type="button" class="btn btn-outline btn-sm" data-action="editPlace" data-id="${p.id}"><span class="icon">${iconHtml('pencil')}</span> Editar</button>
        <button type="button" class="btn-danger-icon" data-action="deletePlace" data-id="${p.id}"><span class="icon">${iconHtml('trash-2')}</span></button>
      </div>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhum local cadastrado ainda.</p>';
}

function renderSyncLabel() {
  const map = {
    saving: { label: 'Salvando na nuvem…', color: '#b0842f', icon: 'loader' },
    saved: { label: 'Salvo na nuvem', color: '#3f7a5a', icon: 'cloud-check' },
    local: { label: 'Salvo neste navegador', color: '#8a8175', icon: 'hard-drive' },
    error: { label: 'Falha ao sincronizar', color: '#a3453a', icon: 'cloud-off' },
    '': { label: '', color: '#8a8175', icon: 'cloud' }
  };
  const sy = map[state.syncStatus] || map[''];
  const el = document.getElementById('syncLabel');
  el.style.color = sy.color;
  el.innerHTML = sy.label ? `<span class="icon">${iconHtml(sy.icon)}</span> ${sy.label}` : '';
}

/* ---------------------------------------------------------
   8. EDIÇÃO — HERO / MARCOS
   --------------------------------------------------------- */
function openEditHero() {
  state.editType = 'hero';
  state.editId = null;
  state.draft = clone(state.data.hero);
  document.getElementById('editFamilyName').value = state.draft.familyName || '';
  document.getElementById('editMotto').value = state.draft.motto || '';
  renderEncontrosEditList();
  showModal('editHeroModal');
}

function renderEncontrosEditList() {
  const list = document.getElementById('encontrosEditList');
  const encontros = state.draft.encontros || [];
  list.innerHTML = encontros.map((e, i) => `
    <div class="subform-item">
      <div class="subform-item-fields">
        <div class="subform-item-row">
          <input type="text" class="text-input encontro-date-input" data-field="date" data-index="${i}" value="${escapeHtml(e.date)}" placeholder="Data (ex: Julho de 1968)">
          <input type="text" class="text-input" data-field="title" data-index="${i}" value="${escapeHtml(e.title)}" placeholder="Título">
        </div>
        <input type="text" class="text-input" data-field="local" data-index="${i}" value="${escapeHtml(e.local)}" placeholder="Local">
        <textarea class="text-area" rows="2" data-field="desc" data-index="${i}" placeholder="Descrição">${escapeHtml(e.desc)}</textarea>
        <input type="text" class="text-input photo-url-input" data-field="photo" data-index="${i}" value="${escapeHtml(e.photo)}" placeholder="URL da foto de capa (opcional)">
        <textarea class="text-area" rows="2" data-field="photosText" data-index="${i}" placeholder="URLs das fotos do álbum, uma por linha (opcional)">${(e.photos || []).map(p => p.url).join('\n')}</textarea>
      </div>
      <button type="button" class="btn-danger-icon" data-action="removeEncontro" data-index="${i}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhum encontro ainda. Clique em "Encontro" para adicionar.</p>';
}

function saveHero() {
  const d = clone(state.data);
  d.hero = state.draft;
  hideModal('editHeroModal');
  persist(d);
}

/* ---------------------------------------------------------
   9. EDIÇÃO — RAMOS / PAIS / FILHOS / FOTOS / DOCUMENTOS
   --------------------------------------------------------- */
function newBranch() {
  state.editType = 'branch';
  state.editId = null;
  state.draft = { id: uid('b'), name: '', photo: '', story: '', father: defaultPerson(), mother: defaultPerson(), children: [], photos: [], documents: [], comments: [] };
  fillBranchForm('Novo ramo');
}

function editBranch(id) {
  const b = (state.data.branches || []).find(x => x.id === id);
  if (!b) return;
  state.editType = 'branch';
  state.editId = id;
  state.draft = clone(b);
  fillBranchForm('Editar ramo');
}

function fillBranchForm(title) {
  document.getElementById('editBranchTitle').textContent = title;
  document.getElementById('editBranchName').value = state.draft.name || '';
  document.getElementById('editBranchPhoto').value = state.draft.photo || '';
  document.getElementById('editBranchStory').value = state.draft.story || '';

  state.draft.father = state.draft.father || defaultPerson();
  state.draft.mother = state.draft.mother || defaultPerson();
  document.getElementById('editFatherName').value = state.draft.father.name || '';
  document.getElementById('editFatherPhoto').value = state.draft.father.photo || '';
  document.getElementById('editFatherBirth').value = state.draft.father.birth || '';
  document.getElementById('editFatherDeath').value = state.draft.father.death || '';
  document.getElementById('editFatherBio').value = state.draft.father.bio || '';
  document.getElementById('editMotherName').value = state.draft.mother.name || '';
  document.getElementById('editMotherPhoto').value = state.draft.mother.photo || '';
  document.getElementById('editMotherBirth').value = state.draft.mother.birth || '';
  document.getElementById('editMotherDeath').value = state.draft.mother.death || '';
  document.getElementById('editMotherBio').value = state.draft.mother.bio || '';

  renderChildrenEditList();
  renderBranchPhotosEditList();
  renderDocumentsEditList();
  showModal('editBranchModal');
}

function renderChildrenEditList() {
  const list = document.getElementById('childrenEditList');
  const children = state.draft.children || [];
  list.innerHTML = children.map((c, i) => {
    const spouse = c.spouse || defaultPerson();
    const kidsText = (c.children || []).map(k => [k.name, k.birth, k.death].join(' | ')).join('\n');
    return `
    <div class="subform-item">
      <div class="subform-item-fields">
        <div class="subform-item-row">
          <input type="text" class="text-input" data-field="name" data-index="${i}" value="${escapeHtml(c.name)}" placeholder="Nome">
          <input type="text" class="text-input photo-url-input" data-field="photo" data-index="${i}" value="${escapeHtml(c.photo)}" placeholder="URL da foto (opcional)">
        </div>
        <div class="subform-item-row">
          <input type="text" class="text-input" data-field="birth" data-index="${i}" value="${escapeHtml(c.birth)}" placeholder="Nascimento">
          <input type="text" class="text-input" data-field="death" data-index="${i}" value="${escapeHtml(c.death)}" placeholder="Falecimento (opcional)">
        </div>
        <textarea class="text-area" rows="2" data-field="bio" data-index="${i}" placeholder="Resumo da história">${escapeHtml(c.bio)}</textarea>

        <div class="subform-subhead">Cônjuge (opcional)</div>
        <div class="subform-item-row">
          <input type="text" class="text-input" data-field="spouseName" data-index="${i}" value="${escapeHtml(spouse.name)}" placeholder="Nome do cônjuge">
          <input type="text" class="text-input photo-url-input" data-field="spousePhoto" data-index="${i}" value="${escapeHtml(spouse.photo)}" placeholder="URL da foto (opcional)">
        </div>
        <div class="subform-item-row">
          <input type="text" class="text-input" data-field="spouseBirth" data-index="${i}" value="${escapeHtml(spouse.birth)}" placeholder="Nascimento">
          <input type="text" class="text-input" data-field="spouseDeath" data-index="${i}" value="${escapeHtml(spouse.death)}" placeholder="Falecimento (opcional)">
        </div>

        <div class="subform-subhead">Filhos / netos (opcional)</div>
        <textarea class="text-area" rows="2" data-field="childrenText" data-index="${i}" placeholder="Um por linha: Nome | Nascimento | Falecimento">${escapeHtml(kidsText)}</textarea>
      </div>
      <button type="button" class="btn-danger-icon" data-action="removeChild" data-index="${i}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>`;
  }).join('') || '<p class="admin-card-summary">Nenhum filho ainda. Clique em "Filho(a)" para adicionar.</p>';
}

function renderBranchPhotosEditList() {
  const list = document.getElementById('branchPhotosEditList');
  const photos = state.draft.photos || [];
  list.innerHTML = photos.map((p, i) => `
    <div class="subform-item">
      <div class="subform-item-fields">
        <input type="text" class="text-input photo-url-input" data-field="url" data-index="${i}" value="${escapeHtml(p.url)}" placeholder="URL da foto">
        <input type="text" class="text-input" data-field="caption" data-index="${i}" value="${escapeHtml(p.caption)}" placeholder="Legenda (opcional)">
      </div>
      <button type="button" class="btn-danger-icon" data-action="removeBranchPhoto" data-index="${i}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhuma foto ainda. Clique em "Foto" para adicionar.</p>';
}

function renderDocumentsEditList() {
  const list = document.getElementById('documentsEditList');
  const docs = state.draft.documents || [];
  list.innerHTML = docs.map((d, i) => `
    <div class="subform-item">
      <div class="subform-item-fields">
        <input type="text" class="text-input" data-field="name" data-index="${i}" value="${escapeHtml(d.name)}" placeholder="Nome do documento">
        <input type="text" class="text-input photo-url-input" data-field="url" data-index="${i}" value="${escapeHtml(d.url)}" placeholder="URL do documento">
      </div>
      <button type="button" class="btn-danger-icon" data-action="removeDocument" data-index="${i}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhum documento ainda. Clique em "Documento" para adicionar.</p>';
}

function saveBranch() {
  const d = clone(state.data);
  const i = d.branches.findIndex(b => b.id === state.draft.id);
  if (i >= 0) d.branches[i] = state.draft; else d.branches.push(state.draft);
  hideModal('editBranchModal');
  persist(d);
}

function deleteBranch(id) {
  if (!confirm('Remover este ramo?')) return;
  const d = clone(state.data);
  d.branches = d.branches.filter(b => b.id !== id);
  persist(d);
}

/* ---------------------------------------------------------
   10. EDIÇÃO — UNIÃO DAS FAMÍLIAS
   --------------------------------------------------------- */
function openEditUnion() {
  state.editType = 'union';
  state.draft = clone(state.data.familyUnion || { story: '', photos: [] });
  document.getElementById('editUnionStory').value = state.draft.story || '';
  renderUnionPhotosEditList();
  showModal('editUnionModal');
}

function renderUnionPhotosEditList() {
  const list = document.getElementById('unionPhotosEditList');
  const photos = state.draft.photos || [];
  list.innerHTML = photos.map((p, i) => `
    <div class="subform-item">
      <div class="subform-item-fields">
        <input type="text" class="text-input photo-url-input" data-field="url" data-index="${i}" value="${escapeHtml(p.url)}" placeholder="URL da foto">
        <input type="text" class="text-input" data-field="caption" data-index="${i}" value="${escapeHtml(p.caption)}" placeholder="Legenda (opcional)">
      </div>
      <button type="button" class="btn-danger-icon" data-action="removeUnionPhoto" data-index="${i}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhuma foto ainda. Clique em "Foto" para adicionar.</p>';
}

function saveUnion() {
  const d = clone(state.data);
  d.familyUnion = state.draft;
  hideModal('editUnionModal');
  persist(d);
}

/* ---------------------------------------------------------
   11. EDIÇÃO — LOCAIS
   --------------------------------------------------------- */
function newPlace() {
  state.editType = 'place';
  state.editId = null;
  state.draft = { id: uid('p'), name: '', photo: '', story: '', importance: '' };
  fillPlaceForm('Novo local');
}

function editPlace(id) {
  const p = (state.data.places || []).find(x => x.id === id);
  if (!p) return;
  state.editType = 'place';
  state.editId = id;
  state.draft = clone(p);
  fillPlaceForm('Editar local');
}

function fillPlaceForm(title) {
  document.getElementById('editPlaceTitle').textContent = title;
  document.getElementById('editPlaceName').value = state.draft.name || '';
  document.getElementById('editPlacePhoto').value = state.draft.photo || '';
  document.getElementById('editPlaceStory').value = state.draft.story || '';
  document.getElementById('editPlaceImportance').value = state.draft.importance || '';
  showModal('editPlaceModal');
}

function savePlace() {
  const d = clone(state.data);
  const i = d.places.findIndex(p => p.id === state.draft.id);
  if (i >= 0) d.places[i] = state.draft; else d.places.push(state.draft);
  hideModal('editPlaceModal');
  persist(d);
}

function deletePlace(id) {
  if (!confirm('Remover este local?')) return;
  const d = clone(state.data);
  d.places = d.places.filter(p => p.id !== id);
  persist(d);
}

/* ---------------------------------------------------------
   12. CONFIGURAÇÃO DA NUVEM
   --------------------------------------------------------- */
function saveCfg() {
  const cfg = {
    binId: document.getElementById('cfgBinId').value.trim(),
    key: document.getElementById('cfgKey').value.trim()
  };
  state.cfg = cfg;
  try { localStorage.setItem(LS_CFG_KEY, JSON.stringify(cfg)); } catch (e) { }
  loadData(cfg).then(renderAll);
}

function reloadData() { loadData(state.cfg).then(renderAll); }

/* ---------------------------------------------------------
   13. EVENTOS ESTÁTICOS (botões fixos do HTML)
   --------------------------------------------------------- */
function bindStaticEvents() {
  document.getElementById('btnGoAdmin').addEventListener('click', goAdmin);
  document.getElementById('btnGoAdminMobile').addEventListener('click', () => { closeMobileNav(); goAdmin(); });
  document.getElementById('btnGoAdminFooter').addEventListener('click', goAdmin);
  document.getElementById('btnGoPublic').addEventListener('click', goPublic);

  document.getElementById('btnCancelAuth').addEventListener('click', () => hideModal('authModal'));
  document.getElementById('btnSubmitAuth').addEventListener('click', submitAuth);
  document.getElementById('authInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAuth(); });

  document.getElementById('btnCloseBranchModal').addEventListener('click', () => hideModal('branchModal'));
  document.getElementById('btnToggleFamilyTree').addEventListener('click', () => {
    toggleFamilyTree(document.getElementById('branchModalTree').classList.contains('hidden'));
  });
  document.getElementById('branchModalBody').addEventListener('scroll', (e) => {
    document.getElementById('modalScrollHint').classList.toggle('faded', e.target.scrollTop > 24);
  });
  document.getElementById('commentForm').addEventListener('submit', submitComment);
  document.getElementById('btnOpenGeneralPhotos').addEventListener('click', openGeneralPhotosModal);
  document.getElementById('btnCloseGeneralPhotos').addEventListener('click', () => hideModal('generalPhotosModal'));
  document.getElementById('btnClosePlaceModal').addEventListener('click', () => hideModal('placeModal'));

  document.getElementById('btnEditHero').addEventListener('click', openEditHero);
  document.getElementById('btnCancelEditHero').addEventListener('click', () => hideModal('editHeroModal'));
  document.getElementById('btnCancelEditHero2').addEventListener('click', () => hideModal('editHeroModal'));
  document.getElementById('btnSaveHero').addEventListener('click', saveHero);
  document.getElementById('btnAddEncontro').addEventListener('click', () => {
    state.draft.encontros = state.draft.encontros || [];
    state.draft.encontros.push({ id: uid('e'), title: '', date: '', local: '', desc: '', photo: '', photos: [] });
    renderEncontrosEditList();
  });
  document.getElementById('editFamilyName').addEventListener('input', (e) => { state.draft.familyName = e.target.value; });
  document.getElementById('editMotto').addEventListener('input', (e) => { state.draft.motto = e.target.value; });
  document.getElementById('encontrosEditList').addEventListener('input', (e) => {
    const field = e.target.dataset.field, idx = e.target.dataset.index;
    if (field === undefined || idx === undefined) return;
    if (field === 'photosText') {
      state.draft.encontros[+idx].photos = e.target.value.split('\n').map(s => s.trim()).filter(Boolean).map(url => ({ url }));
      return;
    }
    state.draft.encontros[+idx][field] = e.target.value;
  });

  document.getElementById('btnNewBranch').addEventListener('click', newBranch);
  document.getElementById('btnCancelEditBranch').addEventListener('click', () => hideModal('editBranchModal'));
  document.getElementById('btnCancelEditBranch2').addEventListener('click', () => hideModal('editBranchModal'));
  document.getElementById('btnSaveBranch').addEventListener('click', saveBranch);
  document.getElementById('editBranchName').addEventListener('input', (e) => { state.draft.name = e.target.value; });
  document.getElementById('editBranchPhoto').addEventListener('input', (e) => { state.draft.photo = e.target.value; });
  document.getElementById('editBranchStory').addEventListener('input', (e) => { state.draft.story = e.target.value; });

  document.getElementById('editFatherName').addEventListener('input', (e) => { state.draft.father.name = e.target.value; });
  document.getElementById('editFatherPhoto').addEventListener('input', (e) => { state.draft.father.photo = e.target.value; });
  document.getElementById('editFatherBirth').addEventListener('input', (e) => { state.draft.father.birth = e.target.value; });
  document.getElementById('editFatherDeath').addEventListener('input', (e) => { state.draft.father.death = e.target.value; });
  document.getElementById('editFatherBio').addEventListener('input', (e) => { state.draft.father.bio = e.target.value; });
  document.getElementById('editMotherName').addEventListener('input', (e) => { state.draft.mother.name = e.target.value; });
  document.getElementById('editMotherPhoto').addEventListener('input', (e) => { state.draft.mother.photo = e.target.value; });
  document.getElementById('editMotherBirth').addEventListener('input', (e) => { state.draft.mother.birth = e.target.value; });
  document.getElementById('editMotherDeath').addEventListener('input', (e) => { state.draft.mother.death = e.target.value; });
  document.getElementById('editMotherBio').addEventListener('input', (e) => { state.draft.mother.bio = e.target.value; });

  document.getElementById('btnAddChild').addEventListener('click', () => {
    state.draft.children = state.draft.children || [];
    state.draft.children.push(defaultChild());
    renderChildrenEditList();
  });
  const SPOUSE_FIELD_MAP = { spouseName: 'name', spousePhoto: 'photo', spouseBirth: 'birth', spouseDeath: 'death' };
  document.getElementById('childrenEditList').addEventListener('input', (e) => {
    const field = e.target.dataset.field, idx = e.target.dataset.index;
    if (field === undefined || idx === undefined) return;
    const child = state.draft.children[+idx];
    if (SPOUSE_FIELD_MAP[field]) {
      child.spouse = child.spouse || defaultPerson();
      child.spouse[SPOUSE_FIELD_MAP[field]] = e.target.value;
    } else if (field === 'childrenText') {
      child.children = e.target.value.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
        const [name, birth, death] = line.split('|').map(s => (s || '').trim());
        return Object.assign(defaultPerson(), { name: name || '', birth: birth || '', death: death || '' });
      });
    } else {
      child[field] = e.target.value;
    }
  });

  document.getElementById('btnAddBranchPhoto').addEventListener('click', () => {
    state.draft.photos = state.draft.photos || [];
    state.draft.photos.push({ url: '', caption: '' });
    renderBranchPhotosEditList();
  });
  document.getElementById('branchPhotosEditList').addEventListener('input', (e) => {
    const field = e.target.dataset.field, idx = e.target.dataset.index;
    if (field === undefined || idx === undefined) return;
    state.draft.photos[+idx][field] = e.target.value;
  });

  document.getElementById('btnAddDocument').addEventListener('click', () => {
    state.draft.documents = state.draft.documents || [];
    state.draft.documents.push({ name: '', url: '' });
    renderDocumentsEditList();
  });
  document.getElementById('documentsEditList').addEventListener('input', (e) => {
    const field = e.target.dataset.field, idx = e.target.dataset.index;
    if (field === undefined || idx === undefined) return;
    state.draft.documents[+idx][field] = e.target.value;
  });

  document.getElementById('btnEditUnion').addEventListener('click', openEditUnion);
  document.getElementById('btnCancelEditUnion').addEventListener('click', () => hideModal('editUnionModal'));
  document.getElementById('btnCancelEditUnion2').addEventListener('click', () => hideModal('editUnionModal'));
  document.getElementById('btnSaveUnion').addEventListener('click', saveUnion);
  document.getElementById('editUnionStory').addEventListener('input', (e) => { state.draft.story = e.target.value; });
  document.getElementById('btnAddUnionPhoto').addEventListener('click', () => {
    state.draft.photos = state.draft.photos || [];
    state.draft.photos.push({ url: '', caption: '' });
    renderUnionPhotosEditList();
  });
  document.getElementById('unionPhotosEditList').addEventListener('input', (e) => {
    const field = e.target.dataset.field, idx = e.target.dataset.index;
    if (field === undefined || idx === undefined) return;
    state.draft.photos[+idx][field] = e.target.value;
  });

  document.getElementById('btnNewPlace').addEventListener('click', newPlace);
  document.getElementById('btnCancelEditPlace').addEventListener('click', () => hideModal('editPlaceModal'));
  document.getElementById('btnCancelEditPlace2').addEventListener('click', () => hideModal('editPlaceModal'));
  document.getElementById('btnSavePlace').addEventListener('click', savePlace);
  document.getElementById('editPlaceName').addEventListener('input', (e) => { state.draft.name = e.target.value; });
  document.getElementById('editPlacePhoto').addEventListener('input', (e) => { state.draft.photo = e.target.value; });
  document.getElementById('editPlaceStory').addEventListener('input', (e) => { state.draft.story = e.target.value; });
  document.getElementById('editPlaceImportance').addEventListener('input', (e) => { state.draft.importance = e.target.value; });

  document.getElementById('btnSaveCfg').addEventListener('click', saveCfg);
  document.getElementById('btnReloadData').addEventListener('click', reloadData);

  document.getElementById('branchPrev').addEventListener('click', () => scrollBranches(-1));
  document.getElementById('branchNext').addEventListener('click', () => scrollBranches(1));

  document.getElementById('btnMobileMenu').addEventListener('click', toggleMobileNav);

  // Delegação de eventos para conteúdo gerado dinamicamente (cards, listas admin, subformulários)
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    const index = target.dataset.index;
    switch (action) {
      case 'openBranch': openBranchModal(id); break;
      case 'openPlace': openPlaceModal(id); break;
      case 'editBranch': editBranch(id); break;
      case 'deleteBranch': deleteBranch(id); break;
      case 'editPlace': editPlace(id); break;
      case 'deletePlace': deletePlace(id); break;
      case 'removeEncontro':
        state.draft.encontros.splice(+index, 1);
        renderEncontrosEditList();
        break;
      case 'selectEncontro':
        state.activeEncontroIndex = +index;
        renderEncontros();
        break;
      case 'removeChild':
        state.draft.children.splice(+index, 1);
        renderChildrenEditList();
        break;
      case 'removeBranchPhoto':
        state.draft.photos.splice(+index, 1);
        renderBranchPhotosEditList();
        break;
      case 'removeDocument':
        state.draft.documents.splice(+index, 1);
        renderDocumentsEditList();
        break;
      case 'removeUnionPhoto':
        state.draft.photos.splice(+index, 1);
        renderUnionPhotosEditList();
        break;
    }
  });

  // Fecha modais ao clicar fora do conteúdo, e tecla Esc
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideAllModals(); });

  // Fecha o menu mobile ao clicar em um link de navegação
  document.querySelectorAll('#mobileNav a').forEach(a => a.addEventListener('click', closeMobileNav));
}

function toggleMobileNav() { document.getElementById('mobileNav').classList.toggle('open'); }
function closeMobileNav() { document.getElementById('mobileNav').classList.remove('open'); }
window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMobileNav(); });

function scrollBranches(dir) {
  const el = document.getElementById('branchesGrid');
  el.scrollBy({ left: dir * 360, behavior: 'smooth' });
}

/* ---------------------------------------------------------
   14. INICIALIZAÇÃO
   --------------------------------------------------------- */
async function init() {
  state.cfg = loadCfgFromStorage();
  document.getElementById('cfgBinId').value = state.cfg.binId;
  document.getElementById('cfgKey').value = state.cfg.key;

  bindStaticEvents();
  await loadData(state.cfg);
  renderAll();
}

init();
