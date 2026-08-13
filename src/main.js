/* =========================================================
   Memórias & Legado — src/main.js
   JavaScript Vanilla (ES6+) — dados e mídia no Supabase (ver src/api.js)
   ========================================================= */
import * as api from './api.js';

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
  'message-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  'log-out': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
};

function iconHtml(name) { return ICONS[name] || ''; }

// Substitui os placeholders estáticos ${icon:nome} escritos no index.html por SVGs reais.
(function replaceIconPlaceholders() {
  document.body.innerHTML = document.body.innerHTML.replace(/\$\{icon:([a-z0-9-]+)\}/g, (_, name) => iconHtml(name));
})();

/* ---------------------------------------------------------
   1. HELPERS DE FORMULÁRIO (formas "em branco" usadas pelos editores
      do admin — os dados de verdade vêm sempre do Supabase, ver
      src/api.js; isto aqui é só pra montar rascunhos novos na UI)
   --------------------------------------------------------- */
function defaultPerson() { return { name: '', photo: '', birth: '', death: '', bio: '' }; }
// Um filho pode ter seus próprios agregados: cônjuge e filhos (netos do
// patriarca/matriarca do ramo). Não recursivo além disso — netos não têm
// cônjuge/filhos próprios exibidos.
function defaultChild() { return Object.assign(defaultPerson(), { spouse: null, children: [] }); }

/* ---------------------------------------------------------
   2. ESTADO DA APLICAÇÃO
   --------------------------------------------------------- */
const state = {
  data: null,       // { hero, branches, familyUnion, history, places, origins } — vem do Supabase
  memorias: [],     // galeria de memórias — carregada e mantida via Realtime
  view: 'public',   // 'public' | 'admin'
  loading: true,
  authed: false,    // sessão Supabase Auth ativa?
  session: null,
  activeBranchId: null,
  activePlaceId: null,
  activeEncontroIndex: 0,
  activeOriginIndex: 0,
  editType: null,   // 'hero' | 'branch' | 'place' | 'union' | 'history' | 'origin'
  editId: null,
  draft: null,
  syncStatus: ''    // '', 'saving', 'saved', 'error'
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
  const death = p.death ? `✝ ${p.death}` : 'presente';
  return `${p.birth || '?'} — ${death}`;
}
function personCount(b) {
  return (b.father && b.father.name ? 1 : 0) + (b.mother && b.mother.name ? 1 : 0) + (b.children || []).length;
}
function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString('pt-BR'); } catch (e) { return ''; }
}

const PLACEHOLDER_GRADIENT = 'repeating-linear-gradient(45deg,#e5f1e8,#e5f1e8 12px,#cbe6d2 12px,#cbe6d2 24px)';
// url() usa aspas simples porque este valor é embutido num atributo HTML
// style="..." (aspas duplas) em vários lugares via template string — aspas
// duplas aqui colidiriam com as do atributo e cortariam o valor ao meio,
// deixando só a cor de fundo/gradiente de placeholder visível.
function photoStyle(url) {
  return url ? `background-image:url('${escapeHtml(url)}')` : `background-image:${PLACEHOLDER_GRADIENT}`;
}
function avatarStyle(url) {
  return url ? `background-image:url('${escapeHtml(url)}')` : 'background-image:linear-gradient(135deg,#2f7a31,#1c4a1e)';
}
const HERO_OVERLAY = 'linear-gradient(180deg, rgba(9,20,14,0.35) 0%, rgba(9,20,14,0.5) 55%, rgba(9,20,14,0.86) 100%)';
function heroBgStyle(url) {
  return url ? `background-image:${HERO_OVERLAY}, url('${escapeHtml(url)}')` : `background-image:${HERO_OVERLAY}, ${PLACEHOLDER_GRADIENT}`;
}
// origin.flag é a URL de uma imagem de bandeira (escolhida no <select> do
// admin, ex: flagcdn.com). Mantém um fallback pro formato antigo (emoji de
// bandeira) e um ícone genérico quando não há bandeira definida.
function flagHtml(flag, cls) {
  cls = cls || '';
  if (!flag) return `<span class="icon ${cls}" aria-hidden="true">${iconHtml('map-pin')}</span>`;
  if (/^https?:\/\//.test(flag)) return `<img class="${cls}" src="${escapeHtml(flag)}" alt="" loading="lazy">`;
  return `<span class="${cls}">${escapeHtml(flag)}</span>`;
}

/* ---------------------------------------------------------
   3. CARREGAMENTO DE DADOS (Supabase — ver src/api.js)
   --------------------------------------------------------- */
async function loadData() {
  setLoading(true);
  try {
    state.data = await api.loadAllData();
    document.getElementById('loadErrorBanner').classList.add('hidden');
  } catch (err) {
    console.error('Falha ao carregar dados do Supabase:', err);
    document.getElementById('loadErrorBanner').classList.remove('hidden');
    state.data = { hero: { familyName: '', motto: '', photo: '', encontros: [] }, branches: [], familyUnion: { story: '', photos: [] }, history: { text: '' }, places: [], origins: [] };
  }
  setLoading(false);
}

async function loadMemoriasData() {
  try {
    state.memorias = await api.loadMemorias();
  } catch (err) {
    console.error('Falha ao carregar memórias:', err);
    state.memorias = [];
  }
  renderMemorias();
  renderAdminMemoriasList();
}

function setLoading(v) {
  state.loading = v;
  document.getElementById('loadingOverlay').classList.toggle('hidden', !v);
}

function setSyncStatus(status) {
  state.syncStatus = status;
  renderSyncLabel();
}

// Roda uma ação de escrita (salvar/excluir) mostrando o status de
// sincronização no topo do admin e tratando erro com um alerta —
// evita repetir o mesmo try/catch em cada save*/delete* abaixo.
async function withSync(action) {
  setSyncStatus('saving');
  try {
    await action();
    setSyncStatus('saved');
  } catch (err) {
    console.error(err);
    setSyncStatus('error');
    alert('Não foi possível salvar no Supabase. Veja o console para detalhes.');
  }
  clearTimeout(withSync._t);
  withSync._t = setTimeout(() => setSyncStatus(''), 2600);
}

/* ---------------------------------------------------------
   4. RENDERIZAÇÃO — VIEW PÚBLICA
   --------------------------------------------------------- */
function renderAll() {
  renderHero();
  renderHistory();
  renderEncontros();
  renderFamilyUnion();
  renderBranches();
  renderPlaces();
  renderOrigins();
  renderAdminSummaries();
  renderAdminBranchList();
  renderAdminPlaceList();
  renderAdminOriginList();
  renderViewToggle();
}

function renderHero() {
  const hero = state.data.hero;
  document.getElementById('heroFamilyName').textContent = hero.familyName;
  document.getElementById('heroMotto').textContent = hero.motto;
  document.getElementById('footerFamilyName').textContent = hero.familyName;
  document.getElementById('topo').style.cssText += heroBgStyle(hero.photo);
}

function renderHistory() {
  const text = (state.data.history && state.data.history.text) || '';
  document.getElementById('historyText').textContent = text
    || 'Nenhum histórico cadastrado ainda. Use o painel de administração para contar a história e a ligação entre as famílias.';
}

// Encontros são exibidos como abas navegáveis (uma por registro de reunião
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

// Países de origem são exibidos como abas de bandeiras (mesmo padrão dos
// encontros): clicar numa bandeira troca o painel abaixo com a história.
function renderOrigins() {
  const tabsEl = document.getElementById('originsTabs');
  const panelEl = document.getElementById('originsPanel');
  const origins = state.data.origins || [];

  if (!origins.length) {
    tabsEl.innerHTML = '';
    panelEl.innerHTML = '<p class="modal-story">Nenhum país de origem registrado ainda.</p>';
    return;
  }

  if (state.activeOriginIndex >= origins.length) state.activeOriginIndex = 0;

  tabsEl.innerHTML = origins.map((o, i) => `
    <button type="button" class="encontro-tab origin-tab ${i === state.activeOriginIndex ? 'is-active' : ''}" data-action="selectOrigin" data-index="${i}">
      ${flagHtml(o.flag, 'origin-tab-flag')} ${escapeHtml(o.name)}
    </button>
  `).join('');

  renderOriginPanel(origins[state.activeOriginIndex]);
}

// Painel horizontal (foto ao lado do texto), igual ao dos encontros mas maior.
function renderOriginPanel(o) {
  const panelEl = document.getElementById('originsPanel');
  panelEl.innerHTML = `
    <div class="encontro-panel-card origin-panel-card">
      <span class="encontro-panel-photo" style="${photoStyle(o.photo)}">
        ${!o.photo ? '<span class="no-photo-label">FOTO DA ORIGEM</span>' : ''}
      </span>
      <div class="encontro-panel-body">
        <div class="place-eyebrow">${flagHtml(o.flag, 'origin-eyebrow-flag')} Origem ancestral</div>
        <h3 class="encontro-panel-title">${escapeHtml(o.name)}</h3>
        <p class="encontro-desc">${escapeHtml(o.story)}</p>
      </div>
    </div>`;
}

// Galeria de memórias soltas (fotos/documentos com título e descrição),
// publicada pelo admin via upload no Supabase Storage. Ordenada por data
// (mais recente primeiro) e atualizada em tempo real — ver
// api.subscribeMemorias() e a chamada em init().
function renderMemorias() {
  const grid = document.getElementById('memoriasGrid');
  if (!grid) return;
  const items = state.memorias || [];
  grid.innerHTML = items.length
    ? items.map((m) => `
      <div class="memoria-card">
        <span class="memoria-thumb" style="${m.tipo === 'foto' ? photoStyle(m.url) : ''}">
          ${m.tipo !== 'foto' ? `<span class="icon memoria-doc-icon" aria-hidden="true">${iconHtml('file-text')}</span>` : ''}
        </span>
        <div class="memoria-body">
          <span class="memoria-date">${escapeHtml(formatDate(m.criadoEm))}</span>
          <h3 class="memoria-title">${escapeHtml(m.titulo)}</h3>
          ${m.descricao ? `<p class="memoria-desc">${escapeHtml(m.descricao)}</p>` : ''}
          <a class="document-item memoria-link" href="${escapeHtml(m.url)}" target="_blank" rel="noopener">
            <span class="icon">${iconHtml(m.tipo === 'foto' ? 'image' : 'file-text')}</span>
            <span>${m.tipo === 'foto' ? 'Ver em tamanho real' : 'Abrir documento'}</span>
          </a>
        </div>
      </div>`).join('')
    : '<p class="modal-story">Nenhuma memória publicada ainda.</p>';
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

// Qualquer visitante pode comentar, sem login (ver policy "insert_public"
// em branch_comments, supabase/schema.sql) — não passa por withSync
// porque não é uma ação de admin.
async function submitComment(e) {
  e.preventDefault();
  const name = document.getElementById('commentName').value.trim();
  const text = document.getElementById('commentText').value.trim();
  if (!name || !text || !state.activeBranchId) return;
  const b = state.data.branches.find(x => x.id === state.activeBranchId);
  if (!b) return;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  try {
    const comment = await api.addComment(state.activeBranchId, name, text);
    b.comments = b.comments || [];
    b.comments.push(comment);
    // Atualiza só a lista de comentários (sem reabrir o modal) para não perder
    // a posição de rolagem nem o estado de foco numa pessoa.
    document.getElementById('branchModalComments').innerHTML = commentsHtml(b.comments);
    document.getElementById('commentName').value = '';
    document.getElementById('commentText').value = '';
  } catch (err) {
    console.error(err);
    alert('Não foi possível publicar o comentário. Tente novamente.');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
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
  ['authModal', 'branchModal', 'generalPhotosModal', 'placeModal', 'editHeroModal', 'editBranchModal', 'editUnionModal', 'editPlaceModal', 'editHistoryModal', 'editOriginModal'].forEach(hideModal);
}

/* ---------------------------------------------------------
   6. AUTENTICAÇÃO DO ADMIN (Supabase Auth — login único)
   --------------------------------------------------------- */
function goAdmin() {
  if (state.authed) {
    state.view = 'admin';
    renderViewToggle();
  } else {
    document.getElementById('authEmail').value = '';
    document.getElementById('authPassword').value = '';
    document.getElementById('authError').classList.add('hidden');
    showModal('authModal');
    setTimeout(() => document.getElementById('authEmail').focus(), 50);
  }
}

async function submitAuth() {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  const btn = document.getElementById('btnSubmitAuth');
  const errEl = document.getElementById('authError');
  errEl.classList.add('hidden');
  btn.disabled = true;
  try {
    await api.signIn(email, password);
    // state.authed é atualizado pelo listener onAuthStateChange (init()).
    hideModal('authModal');
    state.view = 'admin';
    renderViewToggle();
  } catch (err) {
    document.getElementById('authErrorText').textContent = 'E-mail ou senha incorretos.';
    errEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
  }
}

async function logout() {
  await api.signOut();
  state.view = 'public';
  renderViewToggle();
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

  const h = state.data.history || { text: '' };
  document.getElementById('historySummary').innerHTML = h.text
    ? escapeHtml(truncate(h.text, 140))
    : 'Nenhum histórico cadastrado ainda.';
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

function renderAdminOriginList() {
  const list = document.getElementById('adminOriginList');
  list.innerHTML = (state.data.origins || []).map(o => `
    <div class="admin-list-item">
      <div class="admin-list-item-name">${o.flag ? o.flag + ' ' : ''}${escapeHtml(o.name)}</div>
      <div class="admin-list-actions">
        <button type="button" class="btn btn-outline btn-sm" data-action="editOrigin" data-id="${o.id}"><span class="icon">${iconHtml('pencil')}</span> Editar</button>
        <button type="button" class="btn-danger-icon" data-action="deleteOrigin" data-id="${o.id}"><span class="icon">${iconHtml('trash-2')}</span></button>
      </div>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhuma origem cadastrada ainda.</p>';
}

function renderAdminMemoriasList() {
  const list = document.getElementById('adminMemoriasList');
  if (!list) return;
  list.innerHTML = (state.memorias || []).map(m => `
    <div class="admin-list-item">
      <div>
        <div class="admin-list-item-name">${escapeHtml(m.titulo)}</div>
        <div class="admin-list-item-meta">${m.tipo === 'foto' ? 'Foto' : 'Documento'} · ${escapeHtml(formatDate(m.criadoEm))}</div>
      </div>
      <div class="admin-list-actions">
        <button type="button" class="btn-danger-icon" data-action="deleteMemoria" data-id="${m.id}"><span class="icon">${iconHtml('trash-2')}</span></button>
      </div>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhuma memória publicada ainda.</p>';
}

function renderSyncLabel() {
  const map = {
    saving: { label: 'Salvando…', color: '#7d5e15', icon: 'loader' },
    saved: { label: 'Salvo', color: '#1fa968', icon: 'cloud-check' },
    error: { label: 'Falha ao salvar', color: '#a3453a', icon: 'cloud-off' },
    '': { label: '', color: '#77907f', icon: 'cloud' }
  };
  const sy = map[state.syncStatus] || map[''];
  const el = document.getElementById('syncLabel');
  el.style.color = sy.color;
  el.innerHTML = sy.label ? `<span class="icon">${iconHtml(sy.icon)}</span> ${sy.label}` : '';
}

/* ---------------------------------------------------------
   7b. CAMPOS DE FOTO COM UPLOAD (Supabase Storage)
   --------------------------------------------------------- */
// Liga um campo de foto ÚNICO e de id fixo (hero, capa do ramo, pai/mãe,
// local, origem) a um <input type="file">. `getUrl`/`setUrl` leem/gravam
// o valor em state.draft — como state.draft muda a cada edição, quem usa
// isto precisa chamar `.refresh()` toda vez que reabrir o formulário com
// um rascunho novo (o listener já fica ligado desde bindStaticEvents()).
function wirePhotoPicker({ fileInputId, previewId, removeBtnId, progressWrapId, progressBarId, progressLabelId, statusId, getUrl, setUrl }) {
  const fileInput = document.getElementById(fileInputId);
  const preview = document.getElementById(previewId);
  const removeBtn = removeBtnId ? document.getElementById(removeBtnId) : null;
  const progressWrap = progressWrapId ? document.getElementById(progressWrapId) : null;
  const progressBar = progressBarId ? document.getElementById(progressBarId) : null;
  const progressLabel = progressLabelId ? document.getElementById(progressLabelId) : null;
  const statusEl = statusId ? document.getElementById(statusId) : null;

  function refresh() {
    const url = getUrl();
    preview.style.cssText = photoStyle(url);
    if (removeBtn) removeBtn.classList.toggle('hidden', !url);
  }
  function setProgress(pct) {
    if (progressWrap) progressWrap.classList.remove('hidden');
    if (progressBar) progressBar.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = 'Enviando… ' + pct + '%';
    if (statusEl) statusEl.textContent = 'Enviando… ' + pct + '%';
  }
  function clearProgress() {
    if (progressWrap) setTimeout(() => progressWrap.classList.add('hidden'), 700);
    if (statusEl) setTimeout(() => { statusEl.textContent = ''; }, 700);
  }

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    setProgress(0);
    try {
      const url = await api.uploadPhoto(file, setProgress);
      setUrl(url);
      refresh();
    } catch (err) {
      console.error(err);
      alert('Não foi possível enviar a foto: ' + err.message);
    } finally {
      fileInput.value = '';
      clearProgress();
    }
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', () => { setUrl(''); refresh(); });
  }

  return { refresh };
}

// Igual em espírito, mas pra fotos DENTRO de uma lista/subformulário
// (filhos, cônjuge, álbum do ramo, álbum da união) — essas linhas são
// recriadas a cada add/remove, então não dá pra usar ids fixos; delega
// o "change" pro container inteiro e identifica a linha por
// data-photo-field + data-index. `applyUrl(field, index, url)` grava o
// resultado em state.draft e `rerender()` (normalmente a própria função
// de renderização da lista) redesenha tudo, já mostrando a miniatura nova.
function wireListPhotoUpload(containerId, applyUrl, rerender) {
  document.getElementById(containerId).addEventListener('change', async (e) => {
    const input = e.target.closest('[data-photo-field]');
    if (!input) return;
    const field = input.dataset.photoField;
    const index = +input.dataset.index;
    const file = input.files[0];
    if (!file) return;
    const status = document.querySelector(`#${containerId} [data-photo-status-for="${field}-${index}"]`);
    if (status) status.textContent = 'Enviando… 0%';
    try {
      const url = await api.uploadPhoto(file, (pct) => { if (status) status.textContent = 'Enviando… ' + pct + '%'; });
      applyUrl(field, index, url);
      rerender();
    } catch (err) {
      console.error(err);
      alert('Não foi possível enviar a foto: ' + err.message);
      if (status) status.textContent = '';
    }
  });
}

let heroPhotoPicker, branchPhotoPicker, fatherPhotoPicker, motherPhotoPicker, placePhotoPicker, originPhotoPicker;

/* ---------------------------------------------------------
   8. EDIÇÃO — HERO / MARCOS
   --------------------------------------------------------- */
function openEditHero() {
  state.editType = 'hero';
  state.editId = null;
  state.draft = clone(state.data.hero);
  document.getElementById('editFamilyName').value = state.draft.familyName || '';
  document.getElementById('editMotto').value = state.draft.motto || '';
  heroPhotoPicker.refresh();
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

        <div class="subform-subhead">Foto de capa (opcional)</div>
        <div class="photo-row">
          <span class="photo-row-preview" style="${photoStyle(e.photo)}"></span>
          <label class="btn btn-chip">
            <span class="icon" aria-hidden="true">${iconHtml('upload')}</span> ${e.photo ? 'Trocar foto' : 'Escolher foto'}
            <input type="file" accept="image/*" class="visually-hidden-file" data-photo-field="photo" data-index="${i}">
          </label>
          <span class="photo-row-status" data-photo-status-for="photo-${i}"></span>
        </div>

        <div class="subform-subhead">Álbum do encontro (opcional)</div>
        <div class="photo-mini-gallery">
          ${(e.photos || []).map((p, pi) => `
            <span class="photo-mini-item">
              <span class="photo-mini-thumb" style="${photoStyle(p.url)}"></span>
              <button type="button" class="photo-mini-remove" data-action="removeEncontroAlbumPhoto" data-index="${i}" data-photo-index="${pi}">${iconHtml('x')}</button>
            </span>`).join('')}
          <label class="btn btn-chip">
            <span class="icon" aria-hidden="true">${iconHtml('upload')}</span> Adicionar fotos
            <input type="file" accept="image/*" multiple class="visually-hidden-file" data-photo-field="albumAdd" data-index="${i}">
          </label>
          <span class="photo-row-status" data-photo-status-for="albumAdd-${i}"></span>
        </div>
      </div>
      <button type="button" class="btn-danger-icon" data-action="removeEncontro" data-index="${i}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhum encontro ainda. Clique em "Encontro" para adicionar.</p>';
}

function saveHero() {
  withSync(async () => {
    state.data.hero = await api.saveHero(state.draft);
    hideModal('editHeroModal');
    renderAll();
  });
}

/* ---------------------------------------------------------
   9. EDIÇÃO — RAMOS / PAIS / FILHOS / FOTOS / DOCUMENTOS
   --------------------------------------------------------- */
function newBranch() {
  state.editType = 'branch';
  state.editId = null;
  state.draft = { id: null, name: '', photo: '', story: '', father: defaultPerson(), mother: defaultPerson(), children: [], photos: [], documents: [], comments: [] };
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
  document.getElementById('editBranchStory').value = state.draft.story || '';
  branchPhotoPicker.refresh();

  state.draft.father = state.draft.father || defaultPerson();
  state.draft.mother = state.draft.mother || defaultPerson();
  document.getElementById('editFatherName').value = state.draft.father.name || '';
  document.getElementById('editFatherBirth').value = state.draft.father.birth || '';
  document.getElementById('editFatherDeath').value = state.draft.father.death || '';
  document.getElementById('editFatherBio').value = state.draft.father.bio || '';
  fatherPhotoPicker.refresh();
  document.getElementById('editMotherName').value = state.draft.mother.name || '';
  document.getElementById('editMotherBirth').value = state.draft.mother.birth || '';
  document.getElementById('editMotherDeath').value = state.draft.mother.death || '';
  document.getElementById('editMotherBio').value = state.draft.mother.bio || '';
  motherPhotoPicker.refresh();

  renderChildrenEditList();
  renderBranchPhotosEditList();
  renderDocumentsEditList();
  renderCommentsEditList();
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
        <input type="text" class="text-input" data-field="name" data-index="${i}" value="${escapeHtml(c.name)}" placeholder="Nome">
        <div class="photo-row">
          <span class="photo-row-preview" style="${photoStyle(c.photo)}"></span>
          <label class="btn btn-chip">
            <span class="icon" aria-hidden="true">${iconHtml('upload')}</span> ${c.photo ? 'Trocar foto' : 'Foto (opcional)'}
            <input type="file" accept="image/*" class="visually-hidden-file" data-photo-field="photo" data-index="${i}">
          </label>
          <span class="photo-row-status" data-photo-status-for="photo-${i}"></span>
        </div>
        <div class="subform-item-row">
          <input type="text" class="text-input" data-field="birth" data-index="${i}" value="${escapeHtml(c.birth)}" placeholder="Nascimento">
          <input type="text" class="text-input" data-field="death" data-index="${i}" value="${escapeHtml(c.death)}" placeholder="Falecimento (opcional)">
        </div>
        <textarea class="text-area" rows="2" data-field="bio" data-index="${i}" placeholder="Resumo da história">${escapeHtml(c.bio)}</textarea>

        <div class="subform-subhead">Cônjuge (opcional)</div>
        <input type="text" class="text-input" data-field="spouseName" data-index="${i}" value="${escapeHtml(spouse.name)}" placeholder="Nome do cônjuge">
        <div class="photo-row">
          <span class="photo-row-preview" style="${photoStyle(spouse.photo)}"></span>
          <label class="btn btn-chip">
            <span class="icon" aria-hidden="true">${iconHtml('upload')}</span> ${spouse.photo ? 'Trocar foto' : 'Foto (opcional)'}
            <input type="file" accept="image/*" class="visually-hidden-file" data-photo-field="spousePhoto" data-index="${i}">
          </label>
          <span class="photo-row-status" data-photo-status-for="spousePhoto-${i}"></span>
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
        <div class="photo-row">
          <span class="photo-row-preview" style="${photoStyle(p.url)}"></span>
          <label class="btn btn-chip">
            <span class="icon" aria-hidden="true">${iconHtml('upload')}</span> ${p.url ? 'Trocar foto' : 'Escolher foto'}
            <input type="file" accept="image/*" class="visually-hidden-file" data-photo-field="url" data-index="${i}">
          </label>
          <span class="photo-row-status" data-photo-status-for="url-${i}"></span>
        </div>
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
        <div class="photo-row">
          ${d.url ? `<a class="document-item" href="${escapeHtml(d.url)}" target="_blank" rel="noopener"><span class="icon">${iconHtml('file-text')}</span><span>Ver arquivo atual</span></a>` : ''}
          <label class="btn btn-chip">
            <span class="icon" aria-hidden="true">${iconHtml('upload')}</span> ${d.url ? 'Trocar arquivo (PDF)' : 'Escolher arquivo (PDF)'}
            <input type="file" accept="application/pdf,.pdf" class="visually-hidden-file" data-photo-field="url" data-index="${i}">
          </label>
          <span class="photo-row-status" data-photo-status-for="url-${i}"></span>
        </div>
      </div>
      <button type="button" class="btn-danger-icon" data-action="removeDocument" data-index="${i}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhum documento ainda. Clique em "Documento" para adicionar.</p>';
}

// Lista somente-leitura (sem edição de texto) — o admin só pode apagar um
// comentário publicado por um visitante, não alterá-lo. Ver deleteComment().
function renderCommentsEditList() {
  const list = document.getElementById('commentsEditList');
  const comments = state.draft.comments || [];
  list.innerHTML = comments.map((c) => `
    <div class="subform-item">
      <div class="subform-item-fields">
        <div class="comment-item">
          <div class="comment-head"><span class="comment-name">${escapeHtml(c.name)}</span><span class="comment-date">${escapeHtml(c.date)}</span></div>
          <p class="comment-text">${escapeHtml(c.text)}</p>
        </div>
      </div>
      <button type="button" class="btn-danger-icon" data-action="deleteComment" data-id="${c.id}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhum comentário ainda.</p>';
}

function saveBranch() {
  withSync(async () => {
    const saved = await api.saveBranch(state.draft);
    const i = state.data.branches.findIndex(b => b.id === state.draft.id);
    if (state.draft.id && i >= 0) state.data.branches[i] = saved; else state.data.branches.push(saved);
    hideModal('editBranchModal');
    renderAll();
  });
}

function deleteBranch(id) {
  if (!confirm('Remover este ramo?')) return;
  withSync(async () => {
    await api.deleteBranch(id);
    state.data.branches = state.data.branches.filter(b => b.id !== id);
    renderAll();
  });
}

// Apaga um comentário publicado por um visitante (moderação). Diferente de
// removeDocument/removeChild etc., não fica só no state.draft esperando o
// "Salvar" do ramo — branch_comments é sua própria tabela (ver
// api.deleteComment), então a exclusão precisa ir direto ao Supabase.
function deleteComment(id) {
  if (!confirm('Remover este comentário?')) return;
  withSync(async () => {
    await api.deleteComment(id);
    state.draft.comments = (state.draft.comments || []).filter(c => c.id !== id);
    renderCommentsEditList();
    const b = state.data.branches.find(x => x.id === state.draft.id);
    if (b) b.comments = (b.comments || []).filter(c => c.id !== id);
    renderAll();
  });
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
        <div class="photo-row">
          <span class="photo-row-preview" style="${photoStyle(p.url)}"></span>
          <label class="btn btn-chip">
            <span class="icon" aria-hidden="true">${iconHtml('upload')}</span> ${p.url ? 'Trocar foto' : 'Escolher foto'}
            <input type="file" accept="image/*" class="visually-hidden-file" data-photo-field="url" data-index="${i}">
          </label>
          <span class="photo-row-status" data-photo-status-for="url-${i}"></span>
        </div>
        <input type="text" class="text-input" data-field="caption" data-index="${i}" value="${escapeHtml(p.caption)}" placeholder="Legenda (opcional)">
      </div>
      <button type="button" class="btn-danger-icon" data-action="removeUnionPhoto" data-index="${i}"><span class="icon">${iconHtml('trash-2')}</span></button>
    </div>
  `).join('') || '<p class="admin-card-summary">Nenhuma foto ainda. Clique em "Foto" para adicionar.</p>';
}

function saveUnion() {
  withSync(async () => {
    state.data.familyUnion = await api.saveUnion(state.draft);
    hideModal('editUnionModal');
    renderAll();
  });
}

/* ---------------------------------------------------------
   10b. EDIÇÃO — HISTÓRIA DA FAMÍLIA
   --------------------------------------------------------- */
function openEditHistory() {
  state.editType = 'history';
  state.draft = clone(state.data.history || { text: '' });
  document.getElementById('editHistoryText').value = state.draft.text || '';
  showModal('editHistoryModal');
}

function saveHistory() {
  withSync(async () => {
    state.data.history = await api.saveHistory(state.draft);
    hideModal('editHistoryModal');
    renderAll();
  });
}

/* ---------------------------------------------------------
   11. EDIÇÃO — LOCAIS
   --------------------------------------------------------- */
function newPlace() {
  state.editType = 'place';
  state.editId = null;
  state.draft = { id: null, name: '', photo: '', story: '', importance: '' };
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
  document.getElementById('editPlaceStory').value = state.draft.story || '';
  document.getElementById('editPlaceImportance').value = state.draft.importance || '';
  placePhotoPicker.refresh();
  showModal('editPlaceModal');
}

function savePlace() {
  withSync(async () => {
    const saved = await api.savePlace(state.draft);
    const i = state.data.places.findIndex(p => p.id === state.draft.id);
    if (state.draft.id && i >= 0) state.data.places[i] = saved; else state.data.places.push(saved);
    hideModal('editPlaceModal');
    renderAll();
  });
}

function deletePlace(id) {
  if (!confirm('Remover este local?')) return;
  withSync(async () => {
    await api.deletePlace(id);
    state.data.places = state.data.places.filter(p => p.id !== id);
    renderAll();
  });
}

/* ---------------------------------------------------------
   11b. EDIÇÃO — PAÍSES DE ORIGEM DOS ANCESTRAIS
   --------------------------------------------------------- */
function newOrigin() {
  state.editType = 'origin';
  state.editId = null;
  state.draft = { id: null, flag: '', name: '', photo: '', story: '' };
  fillOriginForm('Novo país de origem');
}

function editOrigin(id) {
  const o = (state.data.origins || []).find(x => x.id === id);
  if (!o) return;
  state.editType = 'origin';
  state.editId = id;
  state.draft = clone(o);
  fillOriginForm('Editar país de origem');
}

function fillOriginForm(title) {
  document.getElementById('editOriginTitle').textContent = title;
  document.getElementById('editOriginFlag').value = state.draft.flag || '';
  document.getElementById('editOriginName').value = state.draft.name || '';
  document.getElementById('editOriginStory').value = state.draft.story || '';
  originPhotoPicker.refresh();
  showModal('editOriginModal');
}

function saveOrigin() {
  withSync(async () => {
    const saved = await api.saveOrigin(state.draft);
    state.data.origins = state.data.origins || [];
    const i = state.data.origins.findIndex(o => o.id === state.draft.id);
    if (state.draft.id && i >= 0) state.data.origins[i] = saved; else state.data.origins.push(saved);
    hideModal('editOriginModal');
    renderAll();
  });
}

function deleteOrigin(id) {
  if (!confirm('Remover este país de origem?')) return;
  withSync(async () => {
    await api.deleteOrigin(id);
    state.data.origins = state.data.origins.filter(o => o.id !== id);
    renderAll();
  });
}

/* ---------------------------------------------------------
   11c. MEMÓRIAS — UPLOAD (Supabase Storage) E EXCLUSÃO
   --------------------------------------------------------- */
async function submitMemoriaForm(e) {
  e.preventDefault();
  const titulo = document.getElementById('memoriaTitulo').value.trim();
  const descricao = document.getElementById('memoriaDescricao').value.trim();
  const fileInput = document.getElementById('memoriaFile');
  const file = fileInput.files[0];
  if (!titulo || !file) { alert('Preencha o título e escolha um arquivo (foto ou PDF).'); return; }

  const tipo = file.type && file.type.startsWith('image/') ? 'foto' : 'documento';
  const wrap = document.getElementById('memoriaProgressWrap');
  const bar = document.getElementById('memoriaProgressBar');
  const label = document.getElementById('memoriaProgressLabel');
  const submitBtn = document.getElementById('btnSubmitMemoria');

  wrap.classList.remove('hidden');
  bar.style.width = '0%';
  label.textContent = 'Enviando… 0%';
  submitBtn.disabled = true;

  try {
    const url = await api.uploadMemoriaFile(file, (pct) => {
      bar.style.width = pct + '%';
      label.textContent = 'Enviando… ' + pct + '%';
    });
    const memoria = await api.addMemoria({ titulo, descricao, urlArquivo: url, tipo });
    // Atualiza a UI local na hora (não depender só da latência do Realtime
    // pra quem acabou de publicar ver o resultado imediatamente).
    state.memorias.unshift(memoria);
    renderMemorias();
    renderAdminMemoriasList();
    e.target.reset();
    label.textContent = 'Publicado!';
  } catch (err) {
    console.error(err);
    alert('Não foi possível publicar a memória: ' + err.message);
    label.textContent = '';
  } finally {
    submitBtn.disabled = false;
    setTimeout(() => wrap.classList.add('hidden'), 1600);
  }
}

function deleteMemoria(id) {
  const m = (state.memorias || []).find(x => x.id === id);
  if (!m) return;
  if (!confirm('Remover esta memória?')) return;
  api.deleteMemoria(id, m.url)
    .then(() => {
      state.memorias = state.memorias.filter(x => x.id !== id);
      renderMemorias();
      renderAdminMemoriasList();
    })
    .catch((err) => {
      console.error(err);
      alert('Não foi possível remover. Veja o console para detalhes.');
    });
}

/* ---------------------------------------------------------
   12. EVENTOS ESTÁTICOS (botões fixos do HTML)
   --------------------------------------------------------- */
function bindStaticEvents() {
  document.getElementById('btnRetryLoad').addEventListener('click', async () => { await loadData(); renderAll(); });

  document.getElementById('btnGoAdminFooter').addEventListener('click', goAdmin);
  document.getElementById('btnGoPublic').addEventListener('click', goPublic);
  document.getElementById('btnLogout').addEventListener('click', logout);

  document.getElementById('btnCancelAuth').addEventListener('click', () => hideModal('authModal'));
  document.getElementById('btnSubmitAuth').addEventListener('click', submitAuth);
  document.getElementById('authEmail').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAuth(); });
  document.getElementById('authPassword').addEventListener('keydown', (e) => { if (e.key === 'Enter') submitAuth(); });

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
  heroPhotoPicker = wirePhotoPicker({
    fileInputId: 'editHeroPhotoFile', previewId: 'editHeroPhotoPreview', removeBtnId: 'editHeroPhotoRemove',
    progressWrapId: 'editHeroPhotoProgress', progressBarId: 'editHeroPhotoProgressBar', progressLabelId: 'editHeroPhotoProgressLabel',
    getUrl: () => state.draft.photo, setUrl: (url) => { state.draft.photo = url; }
  });
  document.getElementById('encontrosEditList').addEventListener('input', (e) => {
    const field = e.target.dataset.field, idx = e.target.dataset.index;
    if (field === undefined || idx === undefined) return;
    state.draft.encontros[+idx][field] = e.target.value;
  });
  document.getElementById('encontrosEditList').addEventListener('change', async (e) => {
    const input = e.target.closest('[data-photo-field]');
    if (!input) return;
    const field = input.dataset.photoField;
    const index = +input.dataset.index;
    const encontro = state.draft.encontros[index];

    if (field === 'photo') {
      const file = input.files[0];
      if (!file) return;
      const status = document.querySelector(`#encontrosEditList [data-photo-status-for="photo-${index}"]`);
      if (status) status.textContent = 'Enviando… 0%';
      try {
        const url = await api.uploadPhoto(file, (pct) => { if (status) status.textContent = 'Enviando… ' + pct + '%'; });
        encontro.photo = url;
      } catch (err) {
        console.error(err);
        alert('Não foi possível enviar a foto: ' + err.message);
      }
      renderEncontrosEditList();
      return;
    }

    if (field === 'albumAdd') {
      const files = Array.from(input.files || []);
      if (!files.length) return;
      encontro.photos = encontro.photos || [];
      const status = document.querySelector(`#encontrosEditList [data-photo-status-for="albumAdd-${index}"]`);
      try {
        for (let i = 0; i < files.length; i++) {
          if (status) status.textContent = `Enviando ${i + 1} de ${files.length}…`;
          const url = await api.uploadPhoto(files[i]);
          encontro.photos.push({ url });
        }
      } catch (err) {
        console.error(err);
        alert('Não foi possível enviar uma das fotos: ' + err.message);
      }
      renderEncontrosEditList();
    }
  });

  document.getElementById('btnNewBranch').addEventListener('click', newBranch);
  document.getElementById('btnCancelEditBranch').addEventListener('click', () => hideModal('editBranchModal'));
  document.getElementById('btnCancelEditBranch2').addEventListener('click', () => hideModal('editBranchModal'));
  document.getElementById('btnSaveBranch').addEventListener('click', saveBranch);
  document.getElementById('editBranchName').addEventListener('input', (e) => { state.draft.name = e.target.value; });
  document.getElementById('editBranchStory').addEventListener('input', (e) => { state.draft.story = e.target.value; });
  branchPhotoPicker = wirePhotoPicker({
    fileInputId: 'editBranchPhotoFile', previewId: 'editBranchPhotoPreview', removeBtnId: 'editBranchPhotoRemove',
    progressWrapId: 'editBranchPhotoProgress', progressBarId: 'editBranchPhotoProgressBar', progressLabelId: 'editBranchPhotoProgressLabel',
    getUrl: () => state.draft.photo, setUrl: (url) => { state.draft.photo = url; }
  });

  document.getElementById('editFatherName').addEventListener('input', (e) => { state.draft.father.name = e.target.value; });
  document.getElementById('editFatherBirth').addEventListener('input', (e) => { state.draft.father.birth = e.target.value; });
  document.getElementById('editFatherDeath').addEventListener('input', (e) => { state.draft.father.death = e.target.value; });
  document.getElementById('editFatherBio').addEventListener('input', (e) => { state.draft.father.bio = e.target.value; });
  fatherPhotoPicker = wirePhotoPicker({
    fileInputId: 'editFatherPhotoFile', previewId: 'editFatherPhotoPreview', removeBtnId: 'editFatherPhotoRemove', statusId: 'editFatherPhotoStatus',
    getUrl: () => state.draft.father.photo, setUrl: (url) => { state.draft.father.photo = url; }
  });
  document.getElementById('editMotherName').addEventListener('input', (e) => { state.draft.mother.name = e.target.value; });
  document.getElementById('editMotherBirth').addEventListener('input', (e) => { state.draft.mother.birth = e.target.value; });
  document.getElementById('editMotherDeath').addEventListener('input', (e) => { state.draft.mother.death = e.target.value; });
  document.getElementById('editMotherBio').addEventListener('input', (e) => { state.draft.mother.bio = e.target.value; });
  motherPhotoPicker = wirePhotoPicker({
    fileInputId: 'editMotherPhotoFile', previewId: 'editMotherPhotoPreview', removeBtnId: 'editMotherPhotoRemove', statusId: 'editMotherPhotoStatus',
    getUrl: () => state.draft.mother.photo, setUrl: (url) => { state.draft.mother.photo = url; }
  });

  document.getElementById('btnAddChild').addEventListener('click', () => {
    state.draft.children = state.draft.children || [];
    state.draft.children.push(defaultChild());
    renderChildrenEditList();
  });
  const SPOUSE_FIELD_MAP = { spouseName: 'name', spouseBirth: 'birth', spouseDeath: 'death' };
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
  wireListPhotoUpload('childrenEditList', (field, index, url) => {
    const child = state.draft.children[index];
    if (field === 'spousePhoto') { child.spouse = child.spouse || defaultPerson(); child.spouse.photo = url; }
    else { child.photo = url; }
  }, renderChildrenEditList);

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
  wireListPhotoUpload('branchPhotosEditList', (field, index, url) => {
    state.draft.photos[index].url = url;
  }, renderBranchPhotosEditList);

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
  wireListPhotoUpload('documentsEditList', (field, index, url) => {
    state.draft.documents[index].url = url;
  }, renderDocumentsEditList);

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
  wireListPhotoUpload('unionPhotosEditList', (field, index, url) => {
    state.draft.photos[index].url = url;
  }, renderUnionPhotosEditList);

  document.getElementById('btnEditHistory').addEventListener('click', openEditHistory);
  document.getElementById('btnCancelEditHistory').addEventListener('click', () => hideModal('editHistoryModal'));
  document.getElementById('btnCancelEditHistory2').addEventListener('click', () => hideModal('editHistoryModal'));
  document.getElementById('btnSaveHistory').addEventListener('click', saveHistory);
  document.getElementById('editHistoryText').addEventListener('input', (e) => { state.draft.text = e.target.value; });

  document.getElementById('btnNewOrigin').addEventListener('click', newOrigin);
  document.getElementById('btnCancelEditOrigin').addEventListener('click', () => hideModal('editOriginModal'));
  document.getElementById('btnCancelEditOrigin2').addEventListener('click', () => hideModal('editOriginModal'));
  document.getElementById('btnSaveOrigin').addEventListener('click', saveOrigin);
  document.getElementById('editOriginFlag').addEventListener('change', (e) => { state.draft.flag = e.target.value; });
  document.getElementById('editOriginName').addEventListener('input', (e) => { state.draft.name = e.target.value; });
  document.getElementById('editOriginStory').addEventListener('input', (e) => { state.draft.story = e.target.value; });
  originPhotoPicker = wirePhotoPicker({
    fileInputId: 'editOriginPhotoFile', previewId: 'editOriginPhotoPreview', removeBtnId: 'editOriginPhotoRemove',
    progressWrapId: 'editOriginPhotoProgress', progressBarId: 'editOriginPhotoProgressBar', progressLabelId: 'editOriginPhotoProgressLabel',
    getUrl: () => state.draft.photo, setUrl: (url) => { state.draft.photo = url; }
  });

  document.getElementById('btnNewPlace').addEventListener('click', newPlace);
  document.getElementById('btnCancelEditPlace').addEventListener('click', () => hideModal('editPlaceModal'));
  document.getElementById('btnCancelEditPlace2').addEventListener('click', () => hideModal('editPlaceModal'));
  document.getElementById('btnSavePlace').addEventListener('click', savePlace);
  document.getElementById('editPlaceName').addEventListener('input', (e) => { state.draft.name = e.target.value; });
  document.getElementById('editPlaceStory').addEventListener('input', (e) => { state.draft.story = e.target.value; });
  document.getElementById('editPlaceImportance').addEventListener('input', (e) => { state.draft.importance = e.target.value; });
  placePhotoPicker = wirePhotoPicker({
    fileInputId: 'editPlacePhotoFile', previewId: 'editPlacePhotoPreview', removeBtnId: 'editPlacePhotoRemove',
    progressWrapId: 'editPlacePhotoProgress', progressBarId: 'editPlacePhotoProgressBar', progressLabelId: 'editPlacePhotoProgressLabel',
    getUrl: () => state.draft.photo, setUrl: (url) => { state.draft.photo = url; }
  });

  document.getElementById('memoriaForm').addEventListener('submit', submitMemoriaForm);

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
      case 'editOrigin': editOrigin(id); break;
      case 'deleteOrigin': deleteOrigin(id); break;
      case 'deleteMemoria': deleteMemoria(id); break;
      case 'selectOrigin':
        state.activeOriginIndex = +index;
        renderOrigins();
        break;
      case 'removeEncontro':
        state.draft.encontros.splice(+index, 1);
        renderEncontrosEditList();
        break;
      case 'removeEncontroAlbumPhoto':
        state.draft.encontros[+index].photos.splice(+target.dataset.photoIndex, 1);
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
      case 'deleteComment': deleteComment(id); break;
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
   13. INICIALIZAÇÃO
   --------------------------------------------------------- */
async function init() {
  bindStaticEvents();

  // Sessão de admin: pega o estado atual e escuta mudanças (login,
  // logout, expiração/renovação de token) pra manter state.authed em dia.
  state.session = await api.getSession();
  state.authed = !!state.session;
  api.onAuthStateChange((session) => {
    state.session = session;
    state.authed = !!session;
    if (!session && state.view === 'admin') { state.view = 'public'; renderViewToggle(); }
  });

  await Promise.all([loadData(), loadMemoriasData()]);
  api.subscribeMemorias(() => { loadMemoriasData(); }); // mantém a lista pública em tempo real

  renderAll();
}

init();
