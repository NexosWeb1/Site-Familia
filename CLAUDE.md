# Site-Familia

A single-page family memory/genealogy site. Static HTML + CSS + vanilla JS —
no build step, no framework, no package.json. Just open `index.html` or
serve the folder (`python -m http.server`).

## Files

- `index.html` — all markup: public view, admin view, and every modal (they
  all live in the DOM at once, toggled via a `hidden` class).
- `style.css` — all styling. CSS custom properties for theme colors are
  defined once in `:root` (`--teal`, `--gold`, `--cream`, etc.).
- `script.js` — all behavior. One file, organized into numbered sections
  (see the `/* --- N. SECTION --- */` comments inside it). Read this file
  top to bottom before making changes; there's no module system to grep
  around.

No test suite, no linter config, no CI. Verification during development
has been manual: serve the folder and drive it with Playwright (installed ad hoc
in a scratch dir, not a project dependency) to screenshot + check console
errors. There is no `npm test` or similar — don't invent one unprompted.

## Data model (`script.js`, section 1)

`state.data` (see `defaultData()` / `normalizeData()`) has four top-level
keys, all persisted together as one JSON blob:

- `hero` — `familyName`, `motto`, `encontros[]` (`id`, `title`, `date`, `local`,
  `photo` cover, `photos[]` album, `desc`) for the "Marcos que nos moldaram"
  section — each entry is a family gathering/reunion record. Rendered as 3
  navigable tabs (`renderEncontros()`/`renderEncontroPanel()`, `.encontro-tab`/
  `.encontro-panel-card`) instead of a static grid: clicking a tab swaps the
  panel below (photo, date, local, description, photo album via the shared
  `galleryHtml()` helper). `state.activeEncontroIndex` tracks the open tab. In
  the admin editor, each encontro's album is edited as a textarea of photo
  URLs (one per line, `data-field="photosText"`), parsed into `photos[]` on
  input — simpler than a nested subform-list for a second-level array.
- `branches[]` — one entry per family branch (currently Arruda/Pinto/Leda).
  Each branch has:
  - `name`, `photo` (cover image), `story` (short branch history)
  - `father`, `mother` — each `{ name, photo, birth, death, bio }`
    (patriarch/matriarch; `normalizeBranch()` fills in a blank `defaultPerson()`
    if absent — a branch can have only a mother, only a father, or both)
  - `children[]` — same person shape as father/mother, plus two optional
    fields normalized by `normalizeChild()`: `spouse` (single person object
    or `null`) and `children[]` (grandchildren, same basic person shape, not
    recursive further — grandchildren don't get their own spouse/children).
    In the public "Pessoas da Família" spotlight, clicking a child shows a
    "Família" section (`familyHtml()`) with the spouse/grandkids if present.
    In the admin children editor, spouse is 4 plain fields; grandchildren are
    a textarea, one per line as `Nome | Nascimento | Falecimento`
    (`data-field="childrenText"`), parsed on input — same "flatten a nested
    array into a textarea" trick used for `encontros[].photos`.
  - `photos[]` — `{ url, caption }`, this branch's own photo album
  - `documents[]` — `{ name, url }`, rendered as external links
  - `comments[]` — `{ name, text, date }`, a public guestbook per branch
- `familyUnion` — `{ story, photos[] }`: the "how the three branches became
  one family" narrative + a shared/general photo album, distinct from each
  branch's own `photos[]`.
- `places[]` — landmark locations (`name`, `photo`, `story`, `importance`).

## Persistence

`localStorage` (`fam_data` key) is always written on every change via
`persist()`. If the admin has configured a JSONBin.io bin (`fam_cfg` key:
`{binId, key}`), `persist()` also `PUT`s the whole data blob there, and
`loadData()` prefers fetching from JSONBin over localStorage on load. This
is the *only* backend — there is no server code in this repo.

## Admin

Gated by a hardcoded password, `ADMIN_PASSWORD` in `script.js` (currently
`'familia2026'`) — not real security, just a soft gate for family members.
`state.view` toggles between `#publicView` and `#adminView` (`goAdmin()` /
`goPublic()`); admin auth (`state.authed`) is in-memory only, not persisted.

Every editable entity (hero, branch, familyUnion, place) follows the same
edit pattern: `openEdit*()` clones the current object into `state.draft`,
fills a modal's form fields, input listeners write straight into
`state.draft`, and `save*()` clones `state.data`, splices in the draft, and
calls `persist()`. List sub-fields (milestones, children, branch photos,
documents, union photos) use a shared convention: a `<div class="subform-list">`
re-rendered from `state.draft.<field>` after every add/remove, with
`data-field`/`data-index` attributes read by a delegated `input` listener.

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

`buildPeopleArray(branch)` flattens father/mother/children (only entries
with a `name`) into one array with a synthetic `pid` (`'father'`,
`'mother'`, `'child0'`, `'child1'`, ...) — child entries also carry
`spouse`/`children` (grandkids) straight through from the data model.
`renderPeopleShowcase()` then:

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

`submitComment()` deliberately does **not** call `openBranchModal()` again
after saving — it only re-renders `#branchModalComments` in place (via the
shared `commentsHtml()` helper also used by `openBranchModal()`). Calling
the full open function would reset scroll position to 0 and collapse an
open person spotlight, which is bad UX right after submitting a comment
from screen 2. Keep this in-place-update pattern if comments gain more
behavior (e.g. delete).

## Page section order

Intentionally: Hero → **Árvore Genealógica** (`#ramos`, branches — includes
the `familyUnion` "how we became one family" block above the branch cards)
→ **Linha do Tempo** (`#linha`, milestones) → **Locais Marcantes**
(`#locais`) → Footer. This was reordered from the original
timeline-first layout at the user's request; nav links (desktop + mobile)
follow the same order.

## Icons

All icons are inline SVGs in the `ICONS` object at the top of `script.js`.
HTML uses `${icon:name}` placeholders (e.g. `${icon:trash-2}`), which
`replaceIconPlaceholders()` regex-replaces with the real SVG markup on
script load, before anything else runs. Add new icons there, not as
`<img>`/external icon fonts — the project has zero external asset
dependencies by design (only Google Fonts for typefaces).
