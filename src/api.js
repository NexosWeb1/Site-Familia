// Camada de dados — toda a comunicação com o Supabase (banco + auth +
// storage) fica concentrada aqui. O resto do app (main.js) não conhece
// nomes de coluna nem tabela nenhuma: só chama estas funções e recebe/
// envia objetos no mesmo formato "camelCase" que a UI sempre usou.
import { supabase } from './supabaseClient.js';

const MEMORIAS_BUCKET = 'memorias';

/* ---------------------------------------------------------
   Mapeamento linha do banco (snake_case) <-> objeto do app (camelCase)
   --------------------------------------------------------- */
function mapHeroRow(row) {
  return { familyName: row.family_name, motto: row.motto, photo: row.photo_url };
}
function mapEncontroRow(row) {
  return { id: row.id, title: row.title, date: row.date, local: row.local, desc: row.description, photo: row.photo_url, photos: row.photos || [] };
}
function mapBranchRow(row, comments) {
  return {
    id: row.id, name: row.name, photo: row.photo_url, story: row.story,
    couples: row.couples || [],
    photos: row.photos || [], documents: row.documents || [],
    comments: comments || []
  };
}
function mapPlaceRow(row) {
  return { id: row.id, name: row.name, photo: row.photo_url, story: row.story, importance: row.importance };
}
function mapOriginRow(row) {
  return { id: row.id, flag: row.flag_url, name: row.name, photo: row.photo_url, story: row.story };
}
function mapCommentRow(row) {
  return { id: row.id, name: row.name, text: row.text, date: new Date(row.created_at).toLocaleDateString('pt-BR') };
}
function mapMemoriaRow(row) {
  return { id: row.id, titulo: row.titulo, descricao: row.descricao, url: row.url_arquivo, tipo: row.tipo, criadoEm: row.criado_em };
}
function mapLibraryRow(row) {
  return { biografias: row.biografias || [], links: row.links || [], bibliografia: row.bibliografia || [] };
}

function throwIfError({ error }) {
  if (error) throw error;
}

/* ---------------------------------------------------------
   Leitura de todos os dados do site público + admin (tudo, exceto
   memórias, que tem sua própria função por ser carregada/atualizada
   separadamente com Realtime — ver loadMemorias/subscribeMemorias).
   --------------------------------------------------------- */
export async function loadAllData() {
  const [heroRes, encontrosRes, branchesRes, commentsRes, unionRes, historyRes, placesRes, originsRes, libraryRes] = await Promise.all([
    supabase.from('hero').select('*').eq('id', 1).single(),
    supabase.from('encontros').select('*').order('created_at', { ascending: true }),
    supabase.from('branches').select('*').order('created_at', { ascending: true }),
    supabase.from('branch_comments').select('*').order('created_at', { ascending: true }),
    supabase.from('family_union').select('*').eq('id', 1).single(),
    supabase.from('history').select('*').eq('id', 1).single(),
    supabase.from('places').select('*').order('created_at', { ascending: true }),
    supabase.from('origins').select('*').order('created_at', { ascending: true }),
    supabase.from('family_library').select('*').eq('id', 1).single()
  ]);
  [heroRes, encontrosRes, branchesRes, commentsRes, unionRes, historyRes, placesRes, originsRes, libraryRes].forEach(throwIfError);

  const commentsByBranch = {};
  (commentsRes.data || []).forEach((c) => {
    (commentsByBranch[c.branch_id] = commentsByBranch[c.branch_id] || []).push(mapCommentRow(c));
  });

  return {
    hero: Object.assign(mapHeroRow(heroRes.data), { encontros: (encontrosRes.data || []).map(mapEncontroRow) }),
    branches: (branchesRes.data || []).map((b) => mapBranchRow(b, commentsByBranch[b.id])),
    familyUnion: { story: unionRes.data.story || '', photos: unionRes.data.photos || [] },
    history: { text: historyRes.data.text || '' },
    places: (placesRes.data || []).map(mapPlaceRow),
    origins: (originsRes.data || []).map(mapOriginRow),
    library: mapLibraryRow(libraryRes.data)
  };
}

/* ---------------------------------------------------------
   Hero + Encontros (salvos juntos, no mesmo modal do admin)
   --------------------------------------------------------- */
export async function saveHero(hero) {
  throwIfError(await supabase.from('hero').update({
    family_name: hero.familyName, motto: hero.motto, photo_url: hero.photo, updated_at: new Date().toISOString()
  }).eq('id', 1));

  // Os encontros são reescritos por inteiro a cada salvamento — mais
  // simples do que calcular diffs (quais foram adicionados/editados/
  // removidos) pra uma lista pequena editada como bloco único.
  throwIfError(await supabase.from('encontros').delete().not('id', 'is', null));

  const rows = (hero.encontros || []).map((e) => ({
    title: e.title, date: e.date, local: e.local, description: e.desc, photo_url: e.photo, photos: e.photos || []
  }));
  let inserted = [];
  if (rows.length) {
    const res = await supabase.from('encontros').insert(rows).select();
    throwIfError(res);
    inserted = res.data;
  }

  return { familyName: hero.familyName, motto: hero.motto, photo: hero.photo, encontros: inserted.map(mapEncontroRow) };
}

/* ---------------------------------------------------------
   Ramos da família
   --------------------------------------------------------- */
export async function saveBranch(branch) {
  const row = {
    name: branch.name, photo_url: branch.photo, story: branch.story,
    couples: branch.couples || [],
    photos: branch.photos || [], documents: branch.documents || []
  };
  if (branch.id) {
    const res = await supabase.from('branches').update(row).eq('id', branch.id).select().single();
    throwIfError(res);
    return mapBranchRow(res.data, branch.comments);
  }
  const res = await supabase.from('branches').insert(row).select().single();
  throwIfError(res);
  return mapBranchRow(res.data, []);
}

export async function deleteBranch(id) {
  throwIfError(await supabase.from('branches').delete().eq('id', id)); // branch_comments some junto (ON DELETE CASCADE)
}

export async function loadComments(branchId) {
  const res = await supabase.from('branch_comments').select('*').eq('branch_id', branchId).order('created_at', { ascending: true });
  throwIfError(res);
  return (res.data || []).map(mapCommentRow);
}

// Qualquer visitante pode comentar, sem login — ver policy "insert_public"
// em branch_comments no supabase/schema.sql.
export async function addComment(branchId, name, text) {
  const res = await supabase.from('branch_comments').insert({ branch_id: branchId, name, text }).select().single();
  throwIfError(res);
  return mapCommentRow(res.data);
}

// Moderação: DELETE em branch_comments exige "authenticated" (ver
// supabase/schema.sql) — só o admin logado consegue apagar um comentário.
export async function deleteComment(id) {
  throwIfError(await supabase.from('branch_comments').delete().eq('id', id));
}

/* ---------------------------------------------------------
   União das famílias / História (linhas únicas)
   --------------------------------------------------------- */
export async function saveUnion(union) {
  throwIfError(await supabase.from('family_union').update({ story: union.story, photos: union.photos || [] }).eq('id', 1));
  return { story: union.story, photos: union.photos || [] };
}

export async function saveHistory(history) {
  throwIfError(await supabase.from('history').update({ text: history.text }).eq('id', 1));
  return { text: history.text };
}

/* ---------------------------------------------------------
   Biblioteca da família (biografias / links / bibliografia)
   --------------------------------------------------------- */
export async function saveLibrary(library) {
  const row = { biografias: library.biografias || [], links: library.links || [], bibliografia: library.bibliografia || [] };
  throwIfError(await supabase.from('family_library').update(row).eq('id', 1));
  return row;
}

/* ---------------------------------------------------------
   Locais marcantes
   --------------------------------------------------------- */
export async function savePlace(place) {
  const row = { name: place.name, photo_url: place.photo, story: place.story, importance: place.importance };
  if (place.id) {
    const res = await supabase.from('places').update(row).eq('id', place.id).select().single();
    throwIfError(res);
    return mapPlaceRow(res.data);
  }
  const res = await supabase.from('places').insert(row).select().single();
  throwIfError(res);
  return mapPlaceRow(res.data);
}

export async function deletePlace(id) {
  throwIfError(await supabase.from('places').delete().eq('id', id));
}

/* ---------------------------------------------------------
   Países de origem
   --------------------------------------------------------- */
export async function saveOrigin(origin) {
  const row = { flag_url: origin.flag, name: origin.name, photo_url: origin.photo, story: origin.story };
  if (origin.id) {
    const res = await supabase.from('origins').update(row).eq('id', origin.id).select().single();
    throwIfError(res);
    return mapOriginRow(res.data);
  }
  const res = await supabase.from('origins').insert(row).select().single();
  throwIfError(res);
  return mapOriginRow(res.data);
}

export async function deleteOrigin(id) {
  throwIfError(await supabase.from('origins').delete().eq('id', id));
}

/* ---------------------------------------------------------
   Memórias (galeria de fotos/documentos com upload)
   --------------------------------------------------------- */
export async function loadMemorias() {
  const res = await supabase.from('memorias').select('*').order('criado_em', { ascending: false });
  throwIfError(res);
  return (res.data || []).map(mapMemoriaRow);
}

export async function addMemoria({ titulo, descricao, urlArquivo, tipo }) {
  const res = await supabase.from('memorias').insert({ titulo, descricao, url_arquivo: urlArquivo, tipo }).select().single();
  throwIfError(res);
  return mapMemoriaRow(res.data);
}

export async function deleteMemoria(id, urlArquivo) {
  throwIfError(await supabase.from('memorias').delete().eq('id', id));
  const path = storagePathFromPublicUrl(MEMORIAS_BUCKET, urlArquivo);
  if (path) {
    // Não deixa a exclusão falhar por causa do storage — o registro já
    // saiu da tabela, que é o que importa pra listagem pública.
    await supabase.storage.from(MEMORIAS_BUCKET).remove([path]).catch(() => {});
  }
}

// Assina mudanças na tabela memorias em tempo real (Realtime do Supabase).
// Chama onChange() a cada INSERT/UPDATE/DELETE; quem chamou decide o que
// fazer (aqui: recarregar a lista). Retorna uma função pra cancelar a
// assinatura quando não for mais necessária.
export function subscribeMemorias(onChange) {
  const channel = supabase
    .channel('memorias-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'memorias' }, onChange)
    .subscribe();
  return () => supabase.removeChannel(channel);
}

function sanitizeFileName(name) {
  return name.normalize('NFKD').replace(/[^\w.\-]+/g, '_');
}

function storagePathFromPublicUrl(bucket, url) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = (url || '').indexOf(marker);
  return idx === -1 ? null : decodeURIComponent(url.slice(idx + marker.length));
}

// Upload direto via XHR (em vez do supabase.storage.upload()) só pra
// poder mostrar um percentual real de progresso — o SDK não expõe
// evento de progresso na chamada normal. Precisa estar autenticado: o
// token da sessão vai no header Authorization, exigido pelas policies
// "*_insert_authenticated" de cada bucket (ver supabase/schema.sql).
// Usada tanto pelo upload de memórias quanto pelos campos de foto
// espalhados pelo site (ver uploadPhoto abaixo).
async function uploadToStorage(bucket, file, onProgress) {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData && sessionData.session;
  if (!session) throw new Error('É preciso estar logado para enviar arquivos.');

  const path = `${Date.now()}_${crypto.randomUUID()}_${sanitizeFileName(file.name)}`;
  const uploadUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/${bucket}/${encodeURIComponent(path)}`;

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);
    xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
    xhr.setRequestHeader('apikey', import.meta.env.VITE_SUPABASE_ANON_KEY);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable && onProgress) onProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300)
      ? resolve()
      : reject(new Error('Falha no upload (HTTP ' + xhr.status + ').'));
    xhr.onerror = () => reject(new Error('Falha de rede durante o upload.'));
    xhr.send(file);
  });

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function uploadMemoriaFile(file, onProgress) {
  return uploadToStorage(MEMORIAS_BUCKET, file, onProgress);
}

// Fotos de capa/pessoas/álbuns (hero, ramos, pais/filhos, locais, origens,
// encontros) — bucket "fotos", separado do feed de memórias (ver schema.sql).
const FOTOS_BUCKET = 'fotos';
export function uploadPhoto(file, onProgress) {
  return uploadToStorage(FOTOS_BUCKET, file, onProgress);
}

/* ---------------------------------------------------------
   Autenticação (login único do admin)
   --------------------------------------------------------- */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// Chama cb(session) sempre que o estado de login mudar (login, logout,
// token renovado). Retorna uma função pra cancelar a assinatura.
export function onAuthStateChange(cb) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data.subscription.unsubscribe();
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  await supabase.auth.signOut();
}
