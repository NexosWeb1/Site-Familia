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
  'trash-2': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><path d="M6 7V4h12v3"/><path d="M6 7l1 13h10l1-13"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'
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

function defaultData() {
  return {
    hero: {
      familyName: 'Silva & Albuquerque',
      motto: 'Guardadas as memórias, honramos quem veio antes e semeamos quem virá depois.',
      milestones: [
        { year: '1897', title: 'A Travessia', desc: 'Manoel Albuquerque embarca do Porto rumo ao Brasil em busca de novos horizontes.', photo: '' },
        { year: '1934', title: 'A Casa de Paraty', desc: 'Erguida à beira-mar, a casa abrigaria cinco gerações e incontáveis verões em família.', photo: '' },
        { year: '1968', title: 'O Sítio Ancestral', desc: 'A família planta raízes no interior de Minas, entre cafezais e histórias de fogueira.', photo: '' },
        { year: '2001', title: 'O Grande Reencontro', desc: 'Primeiro encontro a reunir mais de 120 descendentes de todos os ramos.', photo: '' }
      ]
    },
    branches: [
      { id: 'b1', name: 'Núcleo de São Paulo', photo: '', story: 'Guardiões do arquivo fotográfico e dos documentos de imigração, este ramo cresceu na capital paulista mantendo viva a memória escrita da família.', members: [
        { name: 'Helena Silva', role: 'Matriarca', photo: '', bio: 'Aos 88 anos, é a memória viva de todas as histórias — cada nome, cada data, cada receita.' },
        { name: 'Rafael Silva', role: 'Arquivista', photo: '', bio: 'Digitalizou mais de 2.000 fotografias e cartas antigas para as próximas gerações.' }
      ] },
      { id: 'b2', name: 'Linhagem de Maria', photo: '', story: 'Descendentes de Maria Albuquerque, espalhados pelo Nordeste, celebram a tradição da música e da culinária ancestral.', members: [
        { name: 'Maria Albuquerque', role: 'Fundadora da linhagem', photo: '', bio: 'Costureira e contadora de causos, deu nome a um dos ramos mais numerosos.' },
        { name: 'Tiago Nunes', role: 'Guardião das receitas', photo: '', bio: 'Mantém o caderno de receitas centenário e organiza o almoço anual da família.' }
      ] },
      { id: 'b3', name: 'Ramo de Paraty', photo: '', story: 'Ligados à casa à beira-mar, este ramo preserva as tradições do litoral e a manutenção do casarão histórico.', members: [
        { name: 'Beatriz Costa', role: 'Zeladora do casarão', photo: '', bio: 'Cuida da Casa de Paraty e recebe os parentes durante as festas de fim de ano.' }
      ] }
    ],
    places: [
      { id: 'p1', name: 'A Casa de Paraty', photo: '', story: 'Casario colonial de janelas azuis, construído em 1934 sobre pedras trazidas de barco. Abriga móveis, retratos e o relógio de parede que nunca parou.', importance: 'Ponto de encontro de cinco gerações — cada verão, um novo capítulo escrito nas suas paredes.' },
      { id: 'p2', name: 'O Sítio Ancestral', photo: '', story: 'Entre cafezais no interior de Minas, o sítio guarda o forno a lenha e a figueira centenária plantada pelo bisavô.', importance: 'Onde nasceram as tradições da roça: a colheita, o fubá e as noites de viola.' },
      { id: 'p3', name: 'A Igreja Matriz', photo: '', story: 'Pequena capela onde foram celebrados batizados, casamentos e despedidas ao longo de mais de um século.', importance: 'Testemunha silenciosa dos grandes momentos que uniram a família.' }
    ]
  };
}

function normalizeData(d) {
  const def = defaultData();
  d = d || {};
  return {
    hero: Object.assign({}, def.hero, d.hero || {}, { milestones: Array.isArray(d.hero && d.hero.milestones) ? d.hero.milestones : def.hero.milestones }),
    branches: Array.isArray(d.branches) ? d.branches : def.branches,
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
  editType: null, // 'hero' | 'branch' | 'place'
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
  } catch (e) {}
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
  try { local = JSON.parse(localStorage.getItem(LS_DATA_KEY) || 'null'); } catch (e) {}
  state.data = normalizeData(local || defaultData());
  setLoading(false);
}

async function persist(newData) {
  state.data = newData;
  try { localStorage.setItem(LS_DATA_KEY, JSON.stringify(newData)); } catch (e) {}
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
  renderTimeline();
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

function renderTimeline() {
  const grid = document.getElementById('timelineGrid');
  const milestones = state.data.hero.milestones || [];
  grid.innerHTML = milestones.map((m) => `
    <div class="milestone-card">
      <div class="milestone-photo" style="${photoStyle(m.photo)}">
        ${!m.photo ? '<span class="no-photo-label">FOTO DO MARCO</span>' : ''}
      </div>
      <div class="milestone-body">
        <div class="milestone-year">${escapeHtml(m.year)}</div>
        <div class="milestone-title">${escapeHtml(m.title)}</div>
        <p class="milestone-desc">${escapeHtml(m.desc)}</p>
      </div>
    </div>
  `).join('');
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
        <span class="branch-preview">${escapeHtml(truncate(b.story, 90))}</span>
        <span class="branch-count icon">${iconHtml('users')} ${(b.members || []).length} integrantes</span>
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
        <span class="place-eyebrow icon">${iconHtml('map-pin')} Local histórico</span>
        <span class="place-name">${escapeHtml(p.name)}</span>
        <span class="place-preview">${escapeHtml(truncate(p.story, 80))}</span>
      </span>
    </button>
  `).join('');
}

/* ---------------------------------------------------------
   5. MODAIS PÚBLICOS — RAMO / LOCAL
   --------------------------------------------------------- */
function openBranchModal(id) {
  const b = (state.data.branches || []).find(x => x.id === id);
  if (!b) return;
  document.getElementById('branchModalName').textContent = b.name;
  document.getElementById('branchModalStory').textContent = b.story;
  document.getElementById('branchModalMembers').innerHTML = (b.members || []).map(m => `
    <div class="member-item">
      <span class="member-avatar" style="${avatarStyle(m.photo)}">${!m.photo ? escapeHtml(initials(m.name)) : ''}</span>
      <div>
        <div class="member-name">${escapeHtml(m.name)}</div>
        <div class="member-role">${escapeHtml(m.role)}</div>
        <p class="member-bio">${escapeHtml(m.bio)}</p>
      </div>
    </div>
  `).join('') || '<p class="modal-story">Nenhum integrante cadastrado ainda.</p>';
  showModal('branchModal');
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
  ['authModal', 'branchModal', 'placeModal', 'editHeroModal', 'editBranchModal', 'editPlaceModal'].forEach(hideModal);
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
    `Nome: <b>${escapeHtml(hero.familyName)}</b> · ${(hero.milestones || []).length} marcos históricos.`;
}

function renderAdminBranchList() {
  const list = document.getElementById('adminBranchList');
  list.innerHTML = (state.data.branches || []).map(b => `
    <div class="admin-list-item">
      <div>
        <div class="admin-list-item-name">${escapeHtml(b.name)}</div>
        <div class="admin-list-item-meta">${(b.members || []).length} integrantes</div>
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
  renderMilestonesEditList();
  showModal('editHeroModal');
}

function renderMilestonesEditList() {
  const list = document.getElementById('milestonesEditList');
  const milestones = state.draft.milestones || [];
  list.innerHTML = milestones.map((m, i) => `
    <div class="subform-item">
      <div class="subform-item-fields">
        <div class="subform-item-row">
          <input type="text" class="text-input milestone-year-input" data-field="year" data-index="${i}" value="${escapeHtml(m.year)}" placeholder="Ano">
          <input type="text" class="text-input" data-field="title" data-index="${i}" value="${escapeHtml(m.title)}" placeholder="Título">
        </div>
        <textarea class="text-area" rows="2" data-field="desc" data-index="${i}" placeholder="Descrição">${escapeHtml(m.desc)}</textarea>
        <input type="text" class="text-input photo-url-input" data-field="photo" data-index="${i}" value="${escapeHtml(m.photo)}" placeholder="URL da imagem (opcional)">
      </div>
      <button type="button" class="btn-danger-icon" data-action="removeMilestone" data-index="${i}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhum marco ainda. Clique em "Marco" para adicionar.</p>';
}

function saveHero() {
  const d = clone(state.data);
  d.hero = state.draft;
  hideModal('editHeroModal');
  persist(d);
}

/* ---------------------------------------------------------
   9. EDIÇÃO — RAMOS / INTEGRANTES
   --------------------------------------------------------- */
function newBranch() {
  state.editType = 'branch';
  state.editId = null;
  state.draft = { id: uid('b'), name: '', photo: '', story: '', members: [] };
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
  renderMembersEditList();
  showModal('editBranchModal');
}

function renderMembersEditList() {
  const list = document.getElementById('membersEditList');
  const members = state.draft.members || [];
  list.innerHTML = members.map((m, i) => `
    <div class="subform-item">
      <div class="subform-item-fields">
        <div class="subform-item-row">
          <input type="text" class="text-input" data-field="name" data-index="${i}" value="${escapeHtml(m.name)}" placeholder="Nome">
          <input type="text" class="text-input" data-field="role" data-index="${i}" value="${escapeHtml(m.role)}" placeholder="Papel">
        </div>
        <input type="text" class="text-input photo-url-input" data-field="photo" data-index="${i}" value="${escapeHtml(m.photo)}" placeholder="URL da foto (opcional)">
        <textarea class="text-area" rows="2" data-field="bio" data-index="${i}" placeholder="Mini-biografia">${escapeHtml(m.bio)}</textarea>
      </div>
      <button type="button" class="btn-danger-icon" data-action="removeMember" data-index="${i}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhum integrante ainda. Clique em "Integrante" para adicionar.</p>';
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
   10. EDIÇÃO — LOCAIS
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
   11. CONFIGURAÇÃO DA NUVEM
   --------------------------------------------------------- */
function saveCfg() {
  const cfg = {
    binId: document.getElementById('cfgBinId').value.trim(),
    key: document.getElementById('cfgKey').value.trim()
  };
  state.cfg = cfg;
  try { localStorage.setItem(LS_CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
  loadData(cfg).then(renderAll);
}

function reloadData() { loadData(state.cfg).then(renderAll); }

/* ---------------------------------------------------------
   12. EVENTOS ESTÁTICOS (botões fixos do HTML)
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
  document.getElementById('btnClosePlaceModal').addEventListener('click', () => hideModal('placeModal'));

  document.getElementById('btnEditHero').addEventListener('click', openEditHero);
  document.getElementById('btnCancelEditHero').addEventListener('click', () => hideModal('editHeroModal'));
  document.getElementById('btnCancelEditHero2').addEventListener('click', () => hideModal('editHeroModal'));
  document.getElementById('btnSaveHero').addEventListener('click', saveHero);
  document.getElementById('btnAddMilestone').addEventListener('click', () => {
    state.draft.milestones = state.draft.milestones || [];
    state.draft.milestones.push({ year: '', title: '', desc: '', photo: '' });
    renderMilestonesEditList();
  });
  document.getElementById('editFamilyName').addEventListener('input', (e) => { state.draft.familyName = e.target.value; });
  document.getElementById('editMotto').addEventListener('input', (e) => { state.draft.motto = e.target.value; });
  document.getElementById('milestonesEditList').addEventListener('input', (e) => {
    const field = e.target.dataset.field, idx = e.target.dataset.index;
    if (field === undefined || idx === undefined) return;
    state.draft.milestones[+idx][field] = e.target.value;
  });

  document.getElementById('btnNewBranch').addEventListener('click', newBranch);
  document.getElementById('btnCancelEditBranch').addEventListener('click', () => hideModal('editBranchModal'));
  document.getElementById('btnCancelEditBranch2').addEventListener('click', () => hideModal('editBranchModal'));
  document.getElementById('btnSaveBranch').addEventListener('click', saveBranch);
  document.getElementById('btnAddMember').addEventListener('click', () => {
    state.draft.members = state.draft.members || [];
    state.draft.members.push({ name: '', role: '', photo: '', bio: '' });
    renderMembersEditList();
  });
  document.getElementById('editBranchName').addEventListener('input', (e) => { state.draft.name = e.target.value; });
  document.getElementById('editBranchPhoto').addEventListener('input', (e) => { state.draft.photo = e.target.value; });
  document.getElementById('editBranchStory').addEventListener('input', (e) => { state.draft.story = e.target.value; });
  document.getElementById('membersEditList').addEventListener('input', (e) => {
    const field = e.target.dataset.field, idx = e.target.dataset.index;
    if (field === undefined || idx === undefined) return;
    state.draft.members[+idx][field] = e.target.value;
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
      case 'removeMilestone':
        state.draft.milestones.splice(+index, 1);
        renderMilestonesEditList();
        break;
      case 'removeMember':
        state.draft.members.splice(+index, 1);
        renderMembersEditList();
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
   13. INICIALIZAÇÃO
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
