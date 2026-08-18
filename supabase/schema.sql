-- =========================================================
-- Site-Familia — schema do Supabase
-- =========================================================
-- Cole este arquivo inteiro no SQL Editor do seu projeto Supabase
-- (Dashboard > SQL Editor > New query) e rode uma vez. Pode rodar de
-- novo com segurança depois (usa "if not exists"/"or replace" onde dá).
--
-- Design: cada seção do site vira UMA tabela. Listas aninhadas que só
-- fazem sentido dentro do "dono" (fotos de um ramo, filhos de um ramo,
-- álbum de um encontro, etc.) ficam como colunas jsonb — é o mesmo
-- formato que o app já usa em memória (script.js: normalizeBranch,
-- normalizeEncontro...), então a camada de dados (src/api.js) fica
-- direta: lê/grava o objeto quase inteiro de uma vez, sem precisar de
-- vários JOINs. A única exceção são os comentários do "livro de
-- visitas" de cada ramo (branch_comments): esses viram tabela própria
-- porque, diferente do resto, QUALQUER visitante pode publicar um
-- comentário sem estar logado — precisa de uma política de RLS
-- diferente do resto (INSERT público, mas UPDATE/DELETE só admin).

create extension if not exists pgcrypto; -- fornece gen_random_uuid()

-- ---------------------------------------------------------
-- 1. HERO (linha única — id fixo 1)
-- ---------------------------------------------------------
create table if not exists hero (
  id smallint primary key default 1 check (id = 1),
  family_name text not null default 'Sua Família',
  motto text not null default '',
  photo_url text not null default '',
  updated_at timestamptz not null default now()
);
insert into hero (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------
-- 2. ENCONTROS (marcos/reuniões da família — hero.encontros[])
-- ---------------------------------------------------------
create table if not exists encontros (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  date text not null default '',
  local text not null default '',
  description text not null default '',
  photo_url text not null default '',
  photos jsonb not null default '[]', -- [{ url, caption }]
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 3. RAMOS DA FAMÍLIA (branches)
-- ---------------------------------------------------------
create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  photo_url text not null default '',
  story text not null default '',
  -- Um ramo pode ter vários casais da mesma geração (ex.: os pais do
  -- cliente E o casal tia/tio ao lado), cada um com seu próprio grupo de
  -- filhos: [{ father, mother, children:[{ name, photo, birth, death, bio, spouse, children:[...] }] }]
  couples jsonb not null default '[{"father":{"name":"","photo":"","birth":"","death":"","bio":""},"mother":{"name":"","photo":"","birth":"","death":"","bio":""},"children":[]}]',
  photos jsonb not null default '[]',   -- [{ url, caption }]
  documents jsonb not null default '[]', -- [{ name, url }]
  created_at timestamptz not null default now()
);

-- Numa tabela `branches` já existente (criada antes desta coluna existir),
-- o "create table if not exists" acima não faz nada — ele só cria tabelas
-- novas, nunca adiciona colunas a uma tabela que já existe. Por isso a
-- coluna precisa ser garantida explicitamente aqui antes de preenchê-la.
alter table branches add column if not exists couples jsonb;

-- Migração: ramos criados antes de existir "múltiplos casais por ramo"
-- guardavam um único patriarca/matriarca nas colunas father/mother/children.
-- Isso consolida esses dados no novo formato `couples` (uma lista, cada
-- casal com seus próprios filhos) e remove as colunas antigas. Rodar de
-- novo não tem efeito: o bloco só executa se as colunas antigas existirem,
-- e só preenche `couples` onde ainda está nulo.
do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'branches' and column_name = 'father') then
    execute $q$
      update branches set couples = jsonb_build_array(
        jsonb_build_object(
          'father', coalesce(father, '{"name":"","photo":"","birth":"","death":"","bio":""}'::jsonb),
          'mother', coalesce(mother, '{"name":"","photo":"","birth":"","death":"","bio":""}'::jsonb),
          'children', coalesce(children, '[]'::jsonb)
        )
      )
      where couples is null;
    $q$;
  end if;
end $$;
update branches set couples = '[{"father":{"name":"","photo":"","birth":"","death":"","bio":""},"mother":{"name":"","photo":"","birth":"","death":"","bio":""},"children":[]}]'::jsonb where couples is null;
alter table branches alter column couples set not null;
alter table branches alter column couples set default '[{"father":{"name":"","photo":"","birth":"","death":"","bio":""},"mother":{"name":"","photo":"","birth":"","death":"","bio":""},"children":[]}]'::jsonb;
alter table branches drop column if exists father;
alter table branches drop column if exists mother;
alter table branches drop column if exists children;

-- Comentários do livro de visitas — tabela própria (ver nota no topo do
-- arquivo): qualquer pessoa pode publicar, sem login.
create table if not exists branch_comments (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references branches (id) on delete cascade,
  name text not null,
  text text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 4. UNIÃO DAS FAMÍLIAS (linha única — id fixo 1)
-- ---------------------------------------------------------
create table if not exists family_union (
  id smallint primary key default 1 check (id = 1),
  story text not null default '',
  photos jsonb not null default '[]' -- [{ url, caption }]
);
insert into family_union (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------
-- 5. HISTÓRIA DA FAMÍLIA (linha única — id fixo 1)
-- ---------------------------------------------------------
create table if not exists history (
  id smallint primary key default 1 check (id = 1),
  text text not null default ''
);
insert into history (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------
-- 6. LOCAIS MARCANTES (places)
-- ---------------------------------------------------------
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  photo_url text not null default '',
  story text not null default '',
  importance text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 7. PAÍSES DE ORIGEM DOS ANCESTRAIS (origins)
-- ---------------------------------------------------------
create table if not exists origins (
  id uuid primary key default gen_random_uuid(),
  flag_url text not null default '', -- imagem da bandeira (ex: flagcdn.com)
  name text not null default '',
  photo_url text not null default '',
  story text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 8. MEMÓRIAS (galeria solta de fotos/documentos com título e descrição)
-- ---------------------------------------------------------
create table if not exists memorias (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text not null default '',
  url_arquivo text not null,
  tipo text not null check (tipo in ('foto', 'documento')),
  criado_em timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 9. BIBLIOTECA DA FAMÍLIA (linha única — id fixo 1)
-- Biografias, links e bibliografia — cada um é uma lista de
-- { title, url }: biografias tem um PDF enviado pelo admin em `url`;
-- links/bibliografia são só referência de texto + link externo opcional,
-- sem upload. Igual family_union/history, é uma seção só, editada como um
-- bloco único no painel, então não precisa virar tabela própria.
-- ---------------------------------------------------------
create table if not exists family_library (
  id smallint primary key default 1 check (id = 1),
  biografias jsonb not null default '[]',  -- [{ title, url }] — url = PDF no bucket "fotos"
  links jsonb not null default '[]',       -- [{ title, url }] — url = link externo
  bibliografia jsonb not null default '[]' -- [{ title, url }] — url = link externo (opcional)
);
insert into family_library (id) values (1) on conflict (id) do nothing;

-- =========================================================
-- ROW LEVEL SECURITY
-- Regra geral em todas as tabelas: leitura pública (qualquer visitante,
-- logado ou não), escrita só para usuários autenticados (logados via
-- Supabase Auth). Exceção: branch_comments permite INSERT público —
-- ver nota no topo do arquivo.
-- =========================================================

alter table hero enable row level security;
alter table encontros enable row level security;
alter table branches enable row level security;
alter table branch_comments enable row level security;
alter table family_union enable row level security;
alter table history enable row level security;
alter table places enable row level security;
alter table origins enable row level security;
alter table memorias enable row level security;
alter table family_library enable row level security;

-- helper: recria as 4 políticas padrão (select público + escrita
-- autenticada) pra uma tabela, pra não repetir o mesmo bloco 8x.
do $$
declare
  t text;
begin
  foreach t in array array['hero', 'encontros', 'branches', 'family_union', 'history', 'places', 'origins', 'memorias', 'family_library']
  loop
    execute format('drop policy if exists "select_public" on %I', t);
    execute format('create policy "select_public" on %I for select to anon, authenticated using (true)', t);

    execute format('drop policy if exists "insert_authenticated" on %I', t);
    execute format('create policy "insert_authenticated" on %I for insert to authenticated with check (true)', t);

    execute format('drop policy if exists "update_authenticated" on %I', t);
    execute format('create policy "update_authenticated" on %I for update to authenticated using (true) with check (true)', t);

    execute format('drop policy if exists "delete_authenticated" on %I', t);
    execute format('create policy "delete_authenticated" on %I for delete to authenticated using (true)', t);
  end loop;
end $$;

-- branch_comments: leitura pública, criação pública (é um livro de
-- visitas), edição/remoção só pra admin (moderação).
drop policy if exists "select_public" on branch_comments;
create policy "select_public" on branch_comments for select to anon, authenticated using (true);

drop policy if exists "insert_public" on branch_comments;
create policy "insert_public" on branch_comments for insert to anon, authenticated with check (true);

drop policy if exists "delete_authenticated" on branch_comments;
create policy "delete_authenticated" on branch_comments for delete to authenticated using (true);

-- =========================================================
-- STORAGE — bucket "memorias" (fotos e PDFs enviados pelo formulário)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('memorias', 'memorias', true)
on conflict (id) do nothing;

drop policy if exists "memorias_select_public" on storage.objects;
create policy "memorias_select_public" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'memorias');

drop policy if exists "memorias_insert_authenticated" on storage.objects;
create policy "memorias_insert_authenticated" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'memorias');

drop policy if exists "memorias_delete_authenticated" on storage.objects;
create policy "memorias_delete_authenticated" on storage.objects
  for delete to authenticated
  using (bucket_id = 'memorias');

-- =========================================================
-- STORAGE — bucket "fotos" (fotos enviadas do computador nos campos de
-- capa/pessoas/álbuns do site: hero, ramos, pais/filhos, locais, origens,
-- encontros — tudo que antes era "cole o link da foto"). Bucket separado
-- do "memorias" porque são conceitos diferentes: "memorias" é o feed
-- público de memórias soltas; "fotos" são imagens embutidas nas seções
-- estruturadas do site.
-- =========================================================
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

drop policy if exists "fotos_select_public" on storage.objects;
create policy "fotos_select_public" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'fotos');

drop policy if exists "fotos_insert_authenticated" on storage.objects;
create policy "fotos_insert_authenticated" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fotos');

drop policy if exists "fotos_delete_authenticated" on storage.objects;
create policy "fotos_delete_authenticated" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fotos');
