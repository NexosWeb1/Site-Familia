# Site-Familia

A family memory/genealogy site. Vite + vanilla JS (ES modules) on the
front end, Supabase (Postgres + Auth + Storage) as the only backend — no
custom server code anywhere in this repo.

## Running it

```
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npm run dev             # local dev server
npm run build            # production build -> dist/
```

There's no `.env` checked in (see `.gitignore`) — without it,
`src/supabaseClient.js` throws a clear, fail-fast error at module load
instead of the app silently breaking later. See the bottom of this file
for the one-time Supabase dashboard setup (SQL, bucket, admin login).

No test suite, no linter config, no CI. Verification during development
has been manual: run the dev server and drive it with Playwright (installed
ad hoc in a scratch dir, not a project dependency) to screenshot + check
console errors. There is no `npm test` or similar — don't invent one
unprompted.

## Files

- `index.html` — all markup: public view, admin view, and every modal (they
  all live in the DOM at once, toggled via a `hidden` class). Loads
  `src/main.js` as an ES module (`<script type="module" src="/src/main.js">`).
- `style.css` — all styling. CSS custom properties for theme colors are
  defined once in `:root` (`--teal`, `--gold`, `--cream`, etc.).
- `src/main.js` — all UI behavior (rendering, event wiring, admin forms).
  One file, organized into numbered sections (see the
  `/* --- N. SECTION --- */` comments inside it). It never talks to
  Supabase directly — everything goes through `src/api.js`.
- `src/api.js` — the entire data layer. Every read/write to Postgres,
  every Storage upload, every Auth call lives here, and it translates
  between the DB's `snake_case` column names and the `camelCase` shape
  `main.js` has always used (`mapHeroRow`, `branchToRow`-style helpers at
  the top of the file). If you're looking for "where does X get
  saved/loaded", this is the file, not `main.js`.
- `src/supabaseClient.js` — creates the one shared Supabase client from
  `import.meta.env.VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. Throws
  immediately if either is missing — don't remove that guard, it's the
  difference between a clear error and a confusing blank page.
- `supabase/schema.sql` — the entire DB schema: tables, Row Level
  Security policies, and the `memorias` and `fotos` Storage buckets.
  Paste-and-run in the Supabase SQL Editor (idempotent — safe to
  re-run). This is the source of truth for the schema; there are no
  migration files, just this one script.
- `.env.example` — documents the two required env vars. Copy to `.env`
  (gitignored) and fill in real values per-deployment.

## Data model

Each public section of the site is one Supabase table (see
`supabase/schema.sql` for exact columns/types). Nested lists that only
make sense inside their "owner" (a branch's photos, a branch's children,
an encontro's photo album, ...) are stored as `jsonb` columns rather than
normalized into their own tables — it's the same shape `main.js` has
always used in memory, so `src/api.js` can read/write most of an entity in
one round trip instead of assembling it from several joins. The one
deliberate exception is `branch_comments` (see "Comments" below), which
needs its own table because it has different write permissions than the
rest of a branch.

Every `photo_url`/`photo` column below is a public URL into the `fotos`
Storage bucket, filled in by the admin picking a file from their computer
(see "Photo fields" below) — not a pasted external link. `documents` (on
`branches`) follows the same upload convention, just for PDFs instead of
images (`accept="application/pdf,.pdf"` on its file input) — see "Photo
fields" below, `renderDocumentsEditList()` in `src/main.js`.

- `hero` (singleton row, `id = 1`) — `family_name`, `motto`, `photo_url`
  (full-screen background image for the hero section, see `heroBgStyle()`
  in `src/main.js`).
- `encontros` — one row per family gathering/reunion (`title`, `date`,
  `local`, `description`, `photo_url` cover, `photos` jsonb album) for the
  "Marcos que nos moldaram" section. Rendered as navigable tabs
  (`renderEncontros()`/`renderEncontroPanel()`, `.encontro-tab`/
  `.encontro-panel-card`) instead of a static grid: clicking a tab swaps
  the panel below. `state.activeEncontroIndex` tracks the open tab.
  Saved together with `hero` from the same admin modal
  (`saveHero()`/`api.saveHero()`) — on save, `api.saveHero()` deletes and
  re-inserts every row in `encontros` rather than diffing which rows
  changed. That's a deliberate simplification: the whole list is edited
  as one block in one form, so there's nothing to gain from tracking
  per-row inserts/updates/deletes, and it means every save gets fresh
  UUIDs (harmless — nothing references an encontro's id from elsewhere).
- `branches` — one row per family branch (currently Arruda/Pinto/Leda —
  branch names deliberately have no "Os" article, e.g. `'Arruda'` not
  `'Os Arruda'`). Columns: `name`, `photo_url`, `story`, `couples` (jsonb
  array — a branch can have any number of couples of the same generation,
  e.g. the client's parents *and* an aunt/uncle couple side by side, each
  with their own children). Each couple is
  `{ father, mother, children }`: `father`/`mother` are `{ name, photo,
  birth, death, bio }` (a couple can have only a mother, only a father, or
  both), `children` is a jsonb array, same person shape plus optional
  `spouse` and `children[]` (grandkids). A grandkid can in turn have its
  own optional `spouse` (its `children[]` are the great-grandkids/bisnetos
  born of that pairing) — bisnetos are the terminal level (no spouse/
  children of their own). `photos` (jsonb
  `{url, caption}[]`) and `documents` (jsonb `{name, url}[]`) stay at the
  branch level, shared across all of a branch's couples. In the public
  "Pessoas da Família" spotlight, clicking a child with a spouse/grandkids
  shows a "Família" section (`familyHtml()`) — this list is flat/read-only
  and does **not** show bisnetos (they only appear in the tree view below,
  since a grandkid isn't individually spotlightable). In the admin editor,
  each couple is its own `subform-item`
  (`renderCouplesEditList()`/`coupleEditItemHtml()`) — its father/mother
  fields use `data-field`/`data-couple-index` (no `data-index`, since
  there's exactly one father/mother per couple), and its nested children
  list reuses the old per-child field names but adds `data-couple-index`
  alongside `data-index` (`childEditRowHtml()`). Grandkids are their own
  nested subform list inside a child row (`grandkidEditRowHtml()`), adding
  a third index `data-grandkid-index` — its own spouse fields are prefixed
  `gkSpouse*` (`gkSpouseName`/`gkSpousePhoto`/`gkSpouseBirth`/
  `gkSpouseDeath`), same 3 indices, no fourth one (the spouse isn't itself
  indexed, there's at most one per grandkid, same as a child's spouse).
  Great-grandkids nest one level further inside a grandkid row
  (`greatGrandkidEditRowHtml()`), adding a fourth index
  `data-greatgrandkid-index` — by this point it's simplest to just check
  which index attributes are present (`e.target.dataset.index ===
  undefined` → couple-level field, `dataset.grandkidIndex === undefined`
  → child-level field, `dataset.greatgrandkidIndex === undefined` →
  grandkid-level field, else → great-grandkid-level field) rather than
  trying to keep a single flat field-name map. In the public family tree
  (`familyTreeHtml()`/`coupleTreeHtml()`), a grandkid renders as
  `treeCoupleHtml(grandkid, 'Neto(a)', grandkid.spouse, 'Cônjuge')` — same
  pairing treatment as a child+spouse — and each grandkid with bisnetos
  becomes its own `.tree-grandkid-unit` (grandkid+spouse pair + a
  connector + its own `.tree-greatgrandkids` row) so it's visually clear
  whose great-grandkids are whose, instead of flattening every bisneto
  from every grandkid into one shared row. A branch with more than one couple
  shows a "Casal N"
  label above each couple's block, both in the admin editor and in the
  public people showcase/family tree (`buildPeopleArray()`,
  `familyTreeHtml()`) — a single-couple branch (the common case) renders
  with no label, identical to before this feature existed.
- `branch_comments` — a public guestbook per branch (`branch_id`, `name`,
  `text`, `created_at`). See "Comments" below for why this is a real
  table instead of a `comments` jsonb column on `branches`.
- `family_union` (singleton row, `id = 1`) — `story`, `photos` jsonb: the
  "how the three branches became one family" narrative + a shared/general
  photo album, distinct from each branch's own `photos`.
- `history` (singleton row, `id = 1`) — `text`, a single free-text field
  (rendered with `white-space: pre-line` via `.history-text` so line
  breaks from the admin textarea are preserved) for the "História da
  Família" section, positioned between the hero and the branches/tree
  section.
- `places` — landmark locations (`name`, `photo_url`, `story`,
  `importance`).
- `origins` — ancestor origin countries/regions (`flag_url`, `name`,
  `photo_url` optional cover photo for the panel, `story`) for the
  "Países de Origem dos Ancestrais" section. Rendered the same tabs+panel
  way as `encontros` (`renderOrigins()`/`renderOriginPanel()`,
  `state.activeOriginIndex`, reusing the `.encontro-tab`/
  `.encontro-panel-*` CSS classes) instead of a click-into-modal card grid
  like `places`. The panel's photo area behaves exactly like every other
  photo box in the site — it does **not** show the flag; the flag only
  appears small, next to the tab label and next to "ORIGEM ANCESTRAL" in
  the panel (see "Icons and flags" below).
- `memorias` — the standalone photo/document gallery (see "Memórias"
  below). Not part of `state.data`; loaded and kept separately in
  `state.memorias` since it has its own Realtime subscription.
- `family_library` (singleton row, `id = 1`) — `biografias`, `links`,
  `bibliografia`, each a jsonb array of `{ title, url }`. A family-wide
  reference shelf, not tied to any branch — its own nav section
  (`#biblioteca`), placed after Memórias. `biografias` items get their
  `url` from a PDF upload (same `fotos` bucket/upload path as branch
  `documents`); `links`/`bibliografia` are plain text + an optional
  external `url` typed by hand, no upload. All three render the same way
  publicly (`libraryPillHtml()`): a `.document-item` pill that's a real
  link when `url` is set, or a plain non-clickable pill when it isn't —
  it never falls back to showing a raw URL as the label (see "Photo
  fields" below for the same anti-raw-link fix applied to `documents`).
  Edited as one block in `editLibraryModal` (three independent
  add/remove/edit subform-lists, `renderBiografiasEditList()` /
  `renderLinksEditList()` / `renderBibliografiaEditList()`), same
  "singleton row, jsonb array fields" pattern as `family_union`/`history`
  rather than a one-row-per-item table like `places`/`origins` — there's
  no per-item detail page to link to, just a title and an optional link.

## Persistence & sync status

Every read goes through `api.loadAllData()` (assembles `hero` + `encontros`
+ `branches` + `branch_comments` + `family_union` + `history` + `places` +
`origins` + `family_library` into the same shape `state.data` has always
had) or `api.loadMemorias()`. There is no local cache/fallback — Supabase
is the single source of truth; if it's unreachable, `loadData()` shows an
alert and falls back to an empty-but-valid `state.data` shape so the page
doesn't crash.

Every admin write goes through `withSync()` in `src/main.js`, which wraps
a `src/api.js` call, shows "Salvando…"/"Salvo"/"Falha ao salvar" in
`#syncLabel` (`renderSyncLabel()`), and alerts on error. Don't call
`api.save*`/`api.delete*` directly from a button handler without wrapping
it in `withSync()` — that's how the sync status label stays accurate.

## Admin

Gated by Supabase Auth (email + password), **a single admin account** —
not one account per family member. `goAdmin()` shows `#authModal`
(`#authEmail`/`#authPassword`) if not logged in; `api.signIn()` calls
`supabase.auth.signInWithPassword()`. `state.authed`/`state.session` are
kept in sync with the real Supabase session via
`api.onAuthStateChange()` (registered once in `init()`) — don't
hand-toggle `state.authed` anywhere else, it'll drift from the actual
session. `#btnLogout` (top of the admin panel) calls `api.signOut()`.

**The only visible entry point into admin from the public site is
`#btnGoAdminFooter`** — a small, low-contrast text link ("Acesso
administrativo") in the footer (`.footer-admin-link`). There is
deliberately no admin button in the header nav (desktop or mobile) — it
was removed at the client's request so it isn't a prominent, publicly
visible call-to-action. Don't re-add a nav-level admin button without
being asked.

Every editable entity (hero, history, branch, familyUnion, library, place,
origin) follows the same edit pattern: `openEdit*()` clones the current object
into `state.draft`, fills a modal's form fields, input listeners write
straight into `state.draft`, and `save*()` calls the matching
`api.save*()`, patches the result into `state.data`, and re-renders. New
vs. edit is `state.draft.id === null` (new) vs. a real UUID (editing) —
`api.save*()` branches on that to `insert` vs. `update`. List sub-fields
(milestones, children, branch photos, documents, union photos) use a
shared convention: a `<div class="subform-list">` re-rendered from
`state.draft.<field>` after every add/remove, with `data-field`/
`data-index` attributes read by a delegated `input` listener — these stay
as plain jsonb, never their own table. Photo fields within those same
lists follow the parallel `data-photo-field`/`data-index` convention
handled by `wireListPhotoUpload()` instead (see "Photo fields" below) —
deliberately a different attribute name so the two delegated listeners on
the same container don't collide.

## Row Level Security (`supabase/schema.sql`)

Every table: public `SELECT`, `INSERT`/`UPDATE`/`DELETE` restricted to the
`authenticated` role. The one exception is `branch_comments`, which also
allows public `INSERT` (see "Comments" below) — `DELETE` on it is still
`authenticated`-only, for moderation. If you add a new table, copy this
pattern (the `do $$ ... $$` loop near the bottom of `schema.sql` applies
the standard 4 policies to a list of table names — add the new table name
to that array rather than hand-writing 4 more `create policy` statements).

Storage: both the `memorias` and `fotos` buckets are public-read,
authenticated-write/delete.

## Photo fields (upload, not paste)

Every photo field in the admin (hero background, branch cover, father,
mother, each child, each child's spouse, branch photo album, family-union
photo album, place, origin, encontro cover, encontro photo album) uploads
a file from the admin's computer to the `fotos` Storage bucket via
`api.uploadPhoto()` — there is no "paste a URL" text input for photos
anywhere any more. Branch `documents` (and `family_library.biografias`, same shape) use the
exact same upload path and the same `fotos` bucket (Storage doesn't care
about content type), just with `accept="application/pdf,.pdf"` on the
file input instead of `image/*`, since a document is expected to be a
PDF, not a picture. Both give the item a `name`/`title` text field the
admin can type into, but if it's left blank when the file finishes
uploading, `wireListPhotoUpload`'s `applyUrl` callback auto-fills it from
the uploaded file's name (extension stripped) — added after a real
document ended up with no name and the public page fell back to
rendering the raw Supabase Storage URL as the link text, which is exactly
the "don't paste/show raw links" problem this whole convention exists to
avoid. The public fallback was hardened too (`d.name || 'Documento'`,
never `d.name || d.url`) as a second line of defense. Two helpers in
`src/main.js` cover every case:

- **`wirePhotoPicker({...})`** — for the ~6 single, fixed-id fields (hero,
  branch cover, father, mother, place, origin). Wired once per field in
  `bindStaticEvents()` (assigned to a module-level `let` — e.g.
  `heroPhotoPicker`) and returns `{ refresh() }`. Because `state.draft` is
  replaced every time an edit modal opens, every `openEdit*()`/
  `fill*Form()` function **must** call the matching `.refresh()` after
  setting `state.draft` — that's what repaints the thumbnail preview for
  whatever is now being edited. If you add a new single photo field,
  follow this same pattern: wire it once, refresh it on open.
- **`wireListPhotoUpload(containerId, applyUrl, rerender)`** — for photos
  *inside* a dynamically-rendered list (children/spouse, branch photos,
  union photos, branch documents), where rows get regenerated on every add/remove so a
  fixed id per field isn't possible. It delegates the file input's
  `change` event on the whole list container, identifies the row via
  `data-photo-field` + `data-index` (mirrors the existing `data-field` +
  `data-index` convention already used for the list's text inputs — kept
  as a *separate* attribute specifically so the old delegated `input`
  listener for text fields doesn't also try to handle file inputs), calls
  `applyUrl(field, index, url, file)` to patch `state.draft` (the original
  `File` is passed through too — the only current use is the
  documents/biografias name auto-fill above; other callers just ignore
  the 4th argument), then calls `rerender()` (the list's own render
  function) to show the new thumbnail. Progress during upload is shown as plain "Enviando… X%" text
  in a `data-photo-status-for="{field}-{index}"` span next to that row —
  no per-row progress bar, to keep the markup light; the ~6 fixed fields
  above get a real animated bar (`.upload-progress`) since they're more
  prominent.
- **Encontros are a special case**, handled by hand in its own `change`
  listener (not through `wireListPhotoUpload`) because it needs two
  different behaviors per row: `data-photo-field="photo"` replaces the
  single cover photo (same as any other list-photo field), but
  `data-photo-field="albumAdd"` is a `multiple` file input that uploads
  every selected file in a sequential loop and *pushes* each result into
  `encontro.photos[]` rather than replacing a single value — see
  `renderEncontrosEditList()` and the matching `change` handler in
  `bindStaticEvents()`. Album photos are removed one at a time via
  `data-action="removeEncontroAlbumPhoto"` (needs both `data-index`, the
  encontro, and `data-photo-index`, the photo within its album — the only
  place in the codebase a delegated action needs two indices).

None of this touches Storage cleanup: replacing or removing a photo does
**not** delete the old file from the `fotos` bucket (unlike `memorias`,
which does clean up on delete — see below). An orphaned file sitting in
Storage is a minor, invisible cost; wiring up cleanup here would mean
tracking "previous URL" through every save path for little benefit — skip
it unless it actually becomes a problem (e.g. Storage usage near a plan
limit).

## Memórias (photo/document gallery)

A flat, chronological feed of published memories — distinct from the
photos/documents that live inside a branch/place/encontro/origin, which
are pasted-URL fields with no upload and no independent identity. Each
memória has a `titulo`, optional `descricao`, an uploaded file
(`url_arquivo`), and a `tipo` (`'foto'` or `'documento'`, inferred from
the file's MIME type — `image/*` → foto, anything else → documento).

- **Upload** (`submitMemoriaForm()` in `src/main.js`,
  `api.uploadMemoriaFile()` in `src/api.js`): goes to the `memorias`
  Storage bucket. Deliberately uses a raw `XMLHttpRequest` against the
  Storage REST endpoint instead of `supabase.storage.from().upload()` —
  the SDK's upload call doesn't expose a progress event, and a percentage
  progress bar was explicitly requested. If you touch this, keep the raw
  XHR; don't "simplify" it back to the SDK call unless you're also OK
  losing the progress bar. The XHR needs the current session's access
  token in the `Authorization` header (plus the anon key in `apikey`) —
  RLS on `storage.objects` requires `authenticated` for writes.
- **Realtime**: `api.subscribeMemorias()` opens a Postgres Changes
  channel on the `memorias` table (subscribed once in `init()`); any
  INSERT/UPDATE/DELETE anywhere (including from another browser/device)
  triggers `loadMemoriasData()`, which refetches and re-renders both the
  public grid and the admin list. The publisher's own browser *also*
  updates optimistically right after a successful upload (so they don't
  wait on Realtime latency to see their own memória) — the Realtime
  callback then fires shortly after and re-fetches anyway. That's a
  harmless redundant render, not a bug; don't add de-duplication logic
  for it unless it actually causes a visible glitch.
- **Delete** (`deleteMemoria()`): removes the DB row, then best-effort
  removes the Storage object (derives the storage path from the public
  URL via `storagePathFromPublicUrl()`). Storage cleanup failure doesn't
  block the DB delete — the row disappearing from the public list is what
  matters most; an orphaned file in Storage is a minor, non-visible loss.

## Public branch modal (`#branchModal`) — the most structurally unusual part

This modal (`.modal-branch`) is a fixed-height flex column (header pinned,
body scrolls) split into **two screens** inside `#branchModalBody`:

1. `.modal-screen-people` — branch story + "Pessoas da Família" (people
   showcase) + "Álbum de fotos do ramo". This is what's visible on open,
   no scrolling needed.
2. `.modal-screen-more` — Documentos + Comentários e memórias + the
   comment form. Reached by scrolling down.

A small pill (`#modalScrollHint`, "Documentos e comentários") sits pinned to
the bottom of the modal and fades out once `#branchModalBody` scrolls past
24px (listener in `bindStaticEvents`). `openBranchModal()` resets
`scrollTop = 0` and un-fades the hint every time it opens.

**Do not re-add `scroll-snap-type`/`scroll-snap-align` to this modal** — it
was tried and caused the browser to auto-scroll ~28px on open (fighting
with the body's padding), which looked like a layout bug. Removed
deliberately; see git history around that change if revisiting.

**Do not re-add `justify-content: center` to `.modal-screen-people`** — it
was used briefly to vertically center short content, but it produced a
large dead gap above the branch story text when content didn't fill the
screen. The fix was to top-align it and instead make the people photos
bigger so the section fills the screen through actual content, not
whitespace.

### People showcase (patriarch/matriarch/children)

`buildPeopleArray(branch)` flattens every couple's father/mother/children
(only entries with a `name`) into one array with a synthetic `pid` that
carries the couple's index (`'c0-father'`, `'c0-mother'`, `'c0-child0'`,
`'c1-father'`, ...) plus a `coupleIndex` field — child entries also carry
`spouse`/`children` (grandkids) straight through from the data model.
`renderPeopleShowcase()` groups that flat array back by `coupleIndex`,
rendering one photos+list block per couple; if the branch has more than
one couple each block gets a "Casal N" label (`.people-couple-label`) and
the blocks stack vertically (`.people-showcase-stacked`) — a single-couple
branch renders exactly as before, no label. Within a single couple's
block:

- Splits people into two photo rows, not a masonry grid: parents
  (father/mother) on top, children below (`.people-photo-row`), all the
  same size (`.people-photo`, 128×140) and centered as a group
  (`.people-showcase { justify-content: center }` — the photos+list cluster
  is centered as a unit, not stretched edge-to-edge). If a row has more than
  3 people it drops to `.people-photo-compact` (92×100); more than 5 drops
  to `.people-photo-tiny` (68×74) — `rowSizeClass()` in
  `renderPeopleShowcase()` picks the class per row so a big family doesn't
  overflow the column.
- Renders a parallel name list (`.people-row`), each row and its matching
  photo sharing `data-person-id`.
- Wires hover (`mouseenter`/`mouseleave`) on *every* `[data-person-id]`
  element to sync a highlight across both the photo and the row (grayscale
  → color photo, dimmed siblings, pill grows, dates fade in) — this mirrors
  the reference component's `hoveredId` shared-state trick, done here with
  plain classList toggling instead of React state.
- Wires click on any `[data-person-id]` to call `openPersonSpotlight()`,
  which **replaces** the grid/list with a large "focused" panel
  (`#peopleSpotlight`): big photo, name, role, dates, full bio, and a "←
  Voltar para a lista" button (`closePersonSpotlight()`). While focused, the
  modal itself widens (`.modal-branch.is-focused`, 880px → 980px, animated)
  — this is the "focus" behavior the user asked for explicitly.
- If the spotlighted person has a `spouse` and/or `children` (grandkids),
  `familyHtml()` appends a "Família" section below the bio listing them
  (`.spotlight-family-*`) — read-only, not itself clickable into a further
  spotlight (grandkids don't have their own spouse/children to drill into).

If you touch this, keep the click target = focus, hover target = preview
distinction; don't collapse them back into an inline accordion (an earlier
iteration did that and was explicitly replaced).

### Comments

Any site visitor can post a comment on a branch **without logging in** —
this is a deliberate public guestbook, not an admin-only feature. That's
exactly why `branch_comments` is its own table with its own RLS policy
(`insert_public`) instead of a `comments` jsonb column on `branches`
(which would inherit the "writes need `authenticated`" rule that applies
to everything else) — see "Row Level Security" above. `submitComment()`
in `src/main.js` calls `api.addComment()` (no auth required) and
deliberately does **not** call `openBranchModal()` again after saving —
it only re-renders `#branchModalComments` in place (via the shared
`commentsHtml()` helper also used by `openBranchModal()`). Calling the
full open function would reset scroll position to 0 and collapse an open
person spotlight, which is bad UX right after submitting a comment from
screen 2. Keep this in-place-update pattern if comments gain more
behavior.

Moderation (delete) lives in the admin edit-branch modal, not on the
public guestbook — a read-only "Comentários e memórias" list
(`renderCommentsEditList()`, `#commentsEditList`) shows each comment's
name/date/text with just a delete button, no edit. `deleteComment()`
calls `api.deleteComment()` immediately (through `withSync()`, like every
other admin write) rather than staging the removal into `state.draft` for
the branch's own "Salvar" button — `branch_comments` is its own table, so
unlike `documents`/`photos`/etc. there's nothing in `api.saveBranch()`
that would ever persist a comment removal; it has to be its own
Supabase call. After it succeeds, both `state.draft.comments` (so the
open modal's list updates) and the matching branch in
`state.data.branches` (so the public guestbook and the admin branch list's
comment count stay in sync without a full reload) are patched directly.

## Page section order

Intentionally: Hero (`#topo`, full-screen background photo from
`hero.photo_url`, see `heroBgStyle()`) → **História da Família**
(`#historia`) → **Árvore Genealógica** (`#ramos`, branches — includes the
`familyUnion` "how we became one family" block above the branch cards) →
**Linha do Tempo** (`#linha`, encontros) → **Locais Marcantes**
(`#locais`) → **Países de Origem dos Ancestrais** (`#origens`) →
**Memórias** (`#memorias`) → **Biblioteca da Família** (`#biblioteca`,
biografias/links/bibliografia) → Footer. Nav links (desktop + mobile)
follow the same order. Don't reorder these without being asked — this was
set deliberately at the client's request, section by section, across
multiple rounds of feedback (Biblioteca is the one exception placed by
default at the end, right before the footer, since it was the newest
addition rather than part of that original ordering round — move it if
asked).

## Death dates

`lifespan(p)` (used everywhere a person's birth/death is shown — the people
showcase, the spotlight, the family tree) prefixes a set death year with a
cross: `"1898 — ✝ 1970"`. A living person (no `death`) shows `"— presente"`
with no cross. This is the only place that needs to change if the
convention for showing death dates changes.

## Branches carousel (`#branchesGrid`)

`.branches-grid` is a horizontally-scrolling flex row (`overflow-x: auto` +
`scroll-snap-type: x mandatory`) that centers its cards when they fit. It
sets `justify-content: safe center` (with a plain `flex-start` declared
just before it as a fallback for browsers that don't parse the `safe`
keyword) — **not** a bare `justify-content: center`. Plain `center` on an
overflowing flex container is a classic bug: the browser centers the flex
line first and only then clips to the scroll container, so the first
and/or last card becomes permanently unreachable by scrolling (this is
what "only two of the three branches are visible on mobile" turned out to
be). `safe center` falls back to start-alignment exactly when the content
would overflow, which keeps every card reachable while still centering on
wide screens where all cards fit. Don't revert this to plain `center`.

## Icons and flags

All icons are inline SVGs in the `ICONS` object at the top of
`src/main.js`. HTML uses `${icon:name}` placeholders (e.g.
`${icon:trash-2}`), which `replaceIconPlaceholders()` regex-replaces with
the real SVG markup on script load, before anything else runs. Add new
icons there, not as `<img>`/external icon fonts.

Country flags (`origins.flag_url`) are a deliberate exception. Unicode
flag emoji (`🇵🇹`, `🇪🇸`, ...) were tried first, but Windows' bundled emoji
font renders them as two-letter codes (`PT`, `ES`) instead of actual flag
glyphs, which isn't acceptable for a family-facing site — so flags are
real images instead: `flag_url` stores a full URL to a flag SVG on
`flagcdn.com` (e.g. `https://flagcdn.com/pt.svg`), and the admin
`#editOriginFlag` `<select>` in `index.html` has each option's `value` set
to that country's flagcdn URL directly (so picking "Portugal" just sets
`flag` to the right URL — there's no separate country-code-to-URL mapping
to keep in sync). `flagHtml(flag, cls)` in `src/main.js` renders that URL
as an `<img>`; it also tolerates a bare emoji string (renders as text) or
an empty value (falls back to the generic `map-pin` icon) for resilience,
but new entries always come from the dropdown. flagcdn.com requires no
API key and has a stable, predictable per-country URL scheme
(`https://flagcdn.com/{iso-alpha-2}.svg`).

## Supabase project setup (one-time, manual)

This repo has the schema and client code; it does **not** have a Supabase
project — that has to be created once, by hand, in the Supabase dashboard:

1. Create a project at supabase.com.
2. SQL Editor → New query → paste all of `supabase/schema.sql` → Run.
   Creates every table, RLS policy, and the `memorias`/`fotos` Storage
   buckets.
3. Storage → confirm public `memorias` and `fotos` buckets both exist
   (the script creates them; this is just a sanity check).
4. Authentication → Users → Add user → create the one admin account
   (email + password) used to log into `/#memorias` admin actions and the
   rest of the admin panel. This project uses a single shared admin
   login, not one account per family member.
5. Project Settings → API → copy the Project URL and the `anon` `public`
   key into `.env` (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`) —
   copy `.env.example` first if `.env` doesn't exist yet.
6. `npm install && npm run dev` (or `npm run build` for production).
7. GitHub repo → Settings → Secrets and variables → Actions → add
   `SUPABASE_URL` and `SUPABASE_ANON_KEY` (same values as `.env`). Used by
   `.github/workflows/supabase-keepalive.yml`, which queries the `hero`
   table every 3 days so the free-plan project doesn't get paused for
   inactivity (Supabase pauses free projects after 7 idle days).
