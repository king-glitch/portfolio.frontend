# 10 — Dashboard review, storage service, dynamic categories, content seed

Status: **plan only — nothing implemented.** Covers `frontend/` and `../backend/`.
Read with `AGENTS.md` (both repos), `src/config.ts`, `MEMORY.md`, backend `MEMORY.md`.

Scope, in order of value:

1. Fix the correctness bugs found in the dashboard review (Part A).
2. Storage service for all file types: backend `storage` service + frontend file library and picker ("dropdown + plus") replacing every URL/file text input (Parts B, C).
3. Dynamic project categories instead of the hardcoded `ProjectFilter` enum (Part D).
4. Seed the mocked content into the database: all 6 projects, all 3 notes, the profile with contact data, and the categories (Part E, run last).
5. Dashboard UX polish (Part F).

Each part ships on its own and passes both gates (`bun run check`, `bun run lint:tw`, `bun run lint:style`, `bun run pretty` / `make verify`, `go test ./... -race`).

---

## API contract (fixed — backend and frontend agents implement against this in parallel)

All JSON snake_case, envelope `{ data, errors }` as today. Admin routes behind `adminGuard`.

**Storage**
- `GET /api/v1/storage/administration/files?kind=image,document&q=&cursor=&limit=` → `{ items: FileItem[], next_cursor: string | null }`
- `POST /api/v1/storage/administration/files` multipart `file` (+ optional `alt`) → `FileItem`
- `PATCH /api/v1/storage/administration/files/:id` `{ name?, alt? }` → `FileItem`
- `DELETE /api/v1/storage/administration/files/:id` → empty; `409` code for `ErrFileInUse`, `415`/`422` for `ErrUnsupportedFile`, `413`/`422` for `ErrFileTooLarge` (backend picks; frontend branches on status kind only)
- `FileItem = { id, kind: "image"|"video"|"audio"|"document"|"archive"|"other", mime, size, width, height, name, alt, url, created_at }`

**Gallery**
- `POST /api/v1/gallery/administration/frames` JSON `{ file_id, tags: string[], project_id: string | null }` → `GalleryItem` (multipart removed)
- `PATCH /api/v1/gallery/administration/frames/:id` JSON `{ tags?, project_id?, file_id? }` → `GalleryItem`
- `GalleryItem` keeps every current field (`id, project, tags, width, height, image_url, created_at`) and adds `file_id`, `alt`. Public gallery parsing keeps working unchanged.

**Categories**
- Setting key `project_categories`: `[{ slug, label }]`, returned by the existing admin and public settings endpoints.
- Project `categories: string[]` (slugs); unknown slug on create/update → 400 violation on `categories`.

**Art**
- Project and note: optional `art_url: string` (empty or https/http URI) on create/update requests and all summary/detail responses (public too).
- Blocks `project-header`, `motif-full`, `about-split`: optional param `image_url` (uri).

**Note slug**
- `NoteCreateRequest.slug` and `NoteUpdateRequest.slug`: optional string. Empty → generated from the title (today's behaviour). Given → normalized with the same `GenerateBaseSlug` rule and must be unique (`409`/violation on `slug`). Detail/summary responses already return `slug`.
- Admin note detail can be fetched by id (today). Public note route accepts the slug (today).
- Dashboard note form: optional "Slug" field; placeholder shows the slug auto-derived from the title; left empty = auto.

**Violations**
- Backend violation keys stay snake_case (`project_id`, `blocks.3.params.title`); the frontend maps them (Part A2).

---

## Part A — Review findings

### What is good (keep)

- Spec-driven dynamic forms (`lib/dynamic-form/specs.ts`) mirror the backend JSON schemas; `Record<BlockType, FieldSpec[]>` makes a new block type fail typecheck. `normalize`/`hasMissing` have tests.
- Forms use react-hook-form + zod + shadcn `Field`; settings tabs are nested routes; the settings layout owns loading/error/empty states.
- Settings save is disabled while clean and `form.reset(values)` after success; mutations toast globally (`MutationCache.onError`).
- Unknown block types pass through untouched (forward compatible).
- Frame dialog remounts its form per opening (`session` key), so it always starts clean.

### Bugs (fix first)

| # | Severity | Where | Problem | Fix |
|---|---|---|---|---|
| A1 | **High — data loss** | `projects/components/project-form-schema.ts` (`role`, also `stack`, `tags`) + `lib/forms.ts` `splitList` | `role` entries are sentences that contain commas (see `api/mocks/portfolio/projects.ts`). Editing a project joins them with `", "` and splits on `","` on save, so every role sentence with a comma is cut into fragments. | `role` becomes a one-per-line list (same control as `FieldKind.Lines`, or the list editor in F3). Keep comma split only for short tokens (tags), and better: the tag combobox in F4. |
| A2 | **High** | `lib/forms.ts` `applyViolations`, all form `*FieldNames` | Backend violation keys are snake_case (`project_id`, `published_at`) and block paths (`blocks.3.params.title`); form fields are camelCase. Exact-match lookup means those errors never reach a field; the user only sees the generic toast. The note-form comment claims a mapping that does not exist. | In `applyViolations`, map snake_case to camelCase before matching. Route `blocks.<n>.…` violations to the block editor (error on card `n`). Add a unit test. |
| A3 | **Medium** | `config.dashboard.imageAccept` vs backend `galleryrules.ProcessImage` | Frontend accepts `webp`/`gif`; backend accepts only `jpeg`/`png`, so those uploads fail after the round trip. | One accepted list. Superseded by Parts B/C (one allowlist; `config.dashboard.fileAccept` matches the backend exactly). |
| A4 | **Medium** | `components/dynamic-form/block-editor.tsx`, `dynamic-objects-field.tsx` | Cards are keyed by array index. Move/remove shifts DOM state (focus, open selects, `useId` labels, and any future collapse state) onto the wrong card. | Use `useFieldArray` for `blocks` (already installed; gives stable `field.id`, `move`, `insert`, `remove`). For nested `Objects` lists, keep a client-only `_key` stripped in `normalize`. |
| A5 | **Medium** | `profile-form.tsx` `toProfileUpdates` | A second `profileSchema.safeParse` after zod passed; failure only shows a generic toast and no field. | Fold the contract constraints into `profileFormSchema`, so failures land on fields and the null branch disappears. |
| A6 | Low | `project-form.tsx`, `note-form.tsx` doc comments | Say "blocks is edited as JSON"; they are edited with the block editor. | Update comments. |

### Design / UX findings

| # | Area | Finding |
|---|---|---|
| U1 | Validation | `invalid` is one boolean for the whole block list. The error sits under the editor ("a block has a blank required field") and every blank field turns red at once. No required markers. Users must hunt through long forms. |
| U2 | Unsaved changes | No guard. Sidebar link, Cancel, settings tab switch or reload drops a long project/profile edit silently. |
| U3 | Long forms | Save sits only at the bottom of forms that grow to many screens (project blocks, profile timeline). |
| U4 | Block editor | Add only at the end; a type `Select` plus a separate Add button; no collapse, no duplicate, no insert-between; remove is one click with no undo. |
| U5 | Inputs | Three list conventions: comma text (tags/stack/role), newline textarea (`Lines`), cards (`Objects`). The user must read the hint to know which one. |
| U6 | Files | Every image is a URL text field (`image_url` in mock/gallery blocks, SEO social image). The gallery upload is a raw file input with no preview and no alt text (alt is derived from the project name). |
| U7 | Duplication | Project picker is built three times (note form, frame form, `DynamicProjectSelect`). Kind/side/status option lists are rebuilt inline per form although `lib/dynamic-form/options.ts` already has them. Violates the DRY rule in `AGENTS.md`. |
| U8 | Taxonomy | Project categories are a hardcoded enum on both sides (`ProjectFilter` + i18n labels + Go `IsValid`). Adding a category needs a deploy of two repos. |
| U9 | Feature toggles | Free-text names with no list of the flags the site reads; a typo silently makes a dead flag. |

---

## Part B — Backend: `storage` service (all file types)

### Decision

New `storage` service owns **every uploaded file of any type**: images, video, audio, documents (PDF), archives, fonts, and other allowed files. Each feature **references** a file; no feature accepts uploads itself any more.

- Naming: service `storage` (`ports.StorageService`, `internal/services/storage/`), entity `file` (`ports.FileModel`, collection `file`). The existing disk adapter `ports.StorageProvider` (`Save`/`Delete`/`URL`) stays the low-level port the service uses. They are different roles: the provider writes bytes, the service owns records and rules.
- Blocks and settings keep storing a **URL** (`image_url`, `social_preview_image`). No JSON-schema change, no content migration, public renderer unchanged.
  `ponytail:` URL references cannot block deletion of a file that a block still uses; upgrade path is storing `file_id` in block params with a content-version migrator.
- Gallery frames store `file_id` (a real relation), so a frame-referenced file cannot be deleted.

### File kinds

`FileKind` enum in `internal/ports/enum.go` with `IsValid()`: `image`, `video`, `audio`, `document`, `archive`, `other`. The kind is **derived from the sniffed MIME type**, never sent by the client. It exists for filtering and for the picker's `accept`.

| kind | allowed MIME (allowlist in `internal/core/constant/storage.go`) | processing |
|---|---|---|
| image | `image/jpeg`, `image/png` | sniff, pixel guard, downscale, re-encode, strip EXIF (today's `ProcessImage`) |
| video | `video/mp4`, `video/webm` | stored as-is |
| audio | `audio/mpeg`, `audio/ogg`, `audio/wav` | stored as-is |
| document | `application/pdf`, `text/plain`, `text/csv` | stored as-is |
| archive | `application/zip` | stored as-is |
| other | fonts (`font/woff2`, `font/woff`) | stored as-is |

**Allowlist, not "anything".** Never accept types a browser executes on the API origin: `text/html`, `image/svg+xml`, `application/javascript`, `application/xhtml+xml`, XML. A file served from `/uploads` runs on the backend origin, so one HTML or SVG upload is a stored XSS. Unknown sniffed type is rejected with `ErrUnsupportedFile`. Add a type by adding it to the allowlist with its kind.

Serving rules for `/uploads`:
- `X-Content-Type-Options: nosniff` (helmet already sets it; confirm it covers the static route).
- `Content-Disposition: attachment` for every kind except image, video and audio, so documents and archives download instead of rendering inline. PDF inline preview is skipped; add it with `Content-Security-Policy: sandbox` if wanted.
- `Content-Type` from the stored sniffed MIME, not from the file extension.

### Model — `ports.FileModel`, collection `file`

| field | type | note |
|---|---|---|
| `storage_key` | string | `uuid.ext`, unique index; extension from the sniffed MIME, never from the client name |
| `kind` | `FileKind` | derived |
| `mime` | string | sniffed |
| `size` | int64 | bytes after processing |
| `width`, `height` | int | images only; `0` otherwise |
| `name` | string | sanitized original file name, editable |
| `alt` | string | editable; used as `alt` for images |
| base fields | | `created_at`/`updated_at` from hexag `ModelBase` |

Indexes: `{kind:1, _id:-1}` (filtered, cursor-paged list), collation index on `name` for search.

### Domain — `internal/core/domain/storage/rules.go`

- Move `ProcessImage` from `core/domain/gallery` (it is not gallery-specific).
- `Classify(data) (FileKind, mime, ext, error)`: `http.DetectContentType` plus the allowlist. `DetectContentType` misses some types (WebM/WOFF2/ZIP family, plain text vs CSV); add small magic-byte checks for the allowlisted ones it does not detect, and test each.
- `SanitizeName(name)`: strip path parts and control characters, cap length.
- WebP/GIF images: skipped. When needed: `golang.org/x/image/webp` decodes (module already present), but re-encoding needs cgo or a new dependency, so WebP would be stored as PNG/JPEG.

### Config

- `ports.Config`: `APP_UPLOAD_MAX_BYTES` (images, existing) plus `APP_UPLOAD_MAX_FILE_BYTES` (all other kinds, default 50 MB). `ponytail:` one limit for all non-image kinds; per-kind limits when one kind needs it.
- Fiber body limit: check what `hexhttpx.New` sets (Fiber default 4 MB). Raise it to the largest limit for the upload route.
- Check `fileHeader.Size` against the limit **before** `io.ReadAll`. Today `CreateFrame` reads the whole body without checking `APP_UPLOAD_MAX_BYTES`; fix that in the move.

### Ports

- `StorageRepository` (one per service, per AGENTS.md): `Create`, `GetByID`, `ListByIDs`, `List(FileFilter)`, `Update(name, alt)`, `Delete`.
- `StorageService`: `Upload(ctx, data, fileName, at)`, `List(ctx, FileFilter, at)`, `Get`, `Update`, `Delete`, `ListByIDs`, `Exists`.
- `FileFilter`: `Kinds []FileKind`, `Query string`, `Cursor`, `Limit`.
- `FileItem` DTO: `id, kind, mime, size, width, height, name, alt, url, created_at`.
- Sentinels in `ports/errors.go`: `ErrFileNotFound`, `ErrUnsupportedFile`, `ErrFileTooLarge`, `ErrFileInUse` (409).

### Routes — `routes/storage.go`, group `/api/v1/storage`

| method | path | body / query | result |
|---|---|---|---|
| GET | `/administration/files` | `kind` (comma list), `q`, `cursor`, `limit` | `{items, next_cursor}` |
| POST | `/administration/files` | multipart `file`, optional `alt` | `FileItem` (upload limiter) |
| PATCH | `/administration/files/:id` | `{name?, alt?}` | `FileItem` |
| DELETE | `/administration/files/:id` | | 409 `ErrFileInUse` when a gallery frame references it |

All behind `adminGuard`. Literal segments before `/:id`. `GET /administration/files/kinds` is not needed: the frontend keeps the same allowlist in config (see C).

### Gallery changes

- `GalleryFrameModel`: replace `storage_key`, `width`, `height` with `file_id`. Resolve URL/size/alt via `ss.ListByIDs` (one query per page, same pattern as projects).
- `POST /gallery/administration/frames` becomes JSON `{file_id, tags, project_id}`. It rejects files whose kind is not `image` (422). Remove the multipart path and the upload limiter from this route.
- Deleting a frame no longer deletes the file (storage owns it).
- Gallery service gets `ss ports.StorageService` injected and drops `storage ports.StorageProvider`.
- In-use check on file delete: `gallery → storage` already exists, so storage must not call gallery. Use an orchestrator service for "delete file", or let the storage repository read the `gallery_frame` collection by `file_id`. Pick the orchestrator if `make verify` rejects the cross-collection read.

### Migration

`commands content migrate-files`: for each frame with `storage_key` and no `file_id`, create a `file` document from the stored file (kind `image`, sniffed MIME, size, dimensions from the frame), set `file_id`, unset the old fields. Idempotent. Run before deploying the new gallery code; document in `docs/API.md` and backend `MEMORY.md`.

### Tests / tooling

- `rules_test.go`: classify every allowlisted type, reject HTML/SVG/JS/unknown, sanitize names.
- Service tests with mockery mocks: upload image (processed), upload PDF (as-is), reject too large, delete in use.
- `make generate`, `make mockery`, `make bruno` (`docs/bruno/storage/*`), `make verify`.

---

## Part C — Frontend: file library and picker

### Data layer

- `src/api/types/admin/storage.ts`: `FileKind` enum (`Image`, `Video`, `Audio`, `Document`, `Archive`, `Other`), `AdminFile`, `FilePage`.
- `src/api/schemas/admin.ts`: zod schema for the response.
- `src/api/services/admin.ts`: `listFiles`, `uploadFile` (FormData), `updateFile`, `deleteFile` + tests.
- Hooks `src/api/hooks/admin/storage/`: `use-admin-files.ts` (infinite, params `{kinds, q}`), `use-upload-file.ts`, `use-update-file.ts`, `use-delete-file.ts`. Upload/delete invalidate `config.queryKeys.admin.storage`.
- `config.ts`: `queryKeys.admin.storage.files`, `routes.dashboardFiles`, `dashboard.fileAccept: Record<FileKind, string>` (MIME lists, must equal the backend allowlist; replaces `imageAccept` and fixes A3), `dashboard.fileMaxBytes: Record<FileKind, number>`.
- Gallery: `uploadFrame` becomes `createFrame({fileId, tags, projectId})`; `AdminFrame` gets `file` (url, alt, width, height).

### Files page — `routes/dashboard/files/index.tsx`

- Sidebar item "Files". Grid for images/video (thumbnail or poster), list rows for other kinds (kind icon, name, size, type). One `FileKindIcon` component maps kind to icon (no icon dictionary file, per AGENTS.md).
- Kind filter (`Tabs`: All, Images, Video, Audio, Documents, Archives, Other) and search are URL search params (`?kind=image&q=`), parsed with zod, defaults from config (Views-are-routes rule).
- Upload button opens `FileUploadDialog` (multiple files allowed here: one request per file, each with its own pending/error row).
- Card/row actions: rename + alt (dialog), copy URL, download/open, delete (`DeleteDialog`; 409 shows "used by a gallery frame").
- All async states: `files-skeleton.tsx`, `QueryErrorAlert` + retry, `QueryEmpty`, load-more like the gallery.

### Shared picker — `FileSelectField`

Location: `src/routes/dashboard/components/storage/` (used by gallery, settings, blocks: all under `dashboard`).

- shadcn **Combobox** (Base UI; add with `bunx --bun shadcn@latest add combobox`, read its docs first). Each item: thumbnail for images/video, kind icon otherwise, name, size. Search filters by `q` server-side (debounced with `useDeferredValue`).
- Props: `accept: FileKind[]` (sent as `kind` filter, e.g. `[Image]`; `[Document]` for a CV link), `value: string` (URL or file id, see below), `onChange`.
- **Plus button** next to the trigger (`InputGroup` addon) opens `FileUploadDialog` limited to the same `accept`; on success the new file is selected.
- Selected value shows a preview under the field (image/video/audio player, or name + kind icon) with a "clear" action.
- A value not in the library (an external URL saved before this change) shows as an "External URL" item, so old content still renders and can be replaced.
- `FileUploadDialog`: native file input with `accept` from `config.dashboard.fileAccept`, client-side type/size check, preview via `URL.createObjectURL` (revoke on close), optional alt for images, pending `Spinner`, `mutation.reset()` + form reset in `onOpenChangeComplete(false)` (Overlay State Lifecycle rule).
  `ponytail:` no upload progress bar (fetch has no upload progress); add XHR progress when large uploads feel slow.

### Wire-up

| Form | Field today | Becomes |
|---|---|---|
| Gallery frame dialog | file input | `FileSelectField accept=[Image]` storing `fileId`; edit mode can change the picture |
| SEO settings | `socialPreviewImage` URL text | `FileSelectField accept=[Image]` storing URL |
| Project block `mock`, `gallery.items[]` | `image_url` text | `FieldKind.File` with `accept: [Image]` |

Dynamic form: add `FieldKind.File` and `accept?: FileKind[]` on `FieldSpec`. `DynamicField` renders `FileSelectField`. Any future file field (a CV PDF in the profile, an audio clip block) is one spec line with its own `accept`. Video in blocks only after the public renderer (`gallery-art`, mock block) can play video; until then blocks accept images only.

---

## Part D — Dynamic project categories

### What becomes data, what stays code

- **Data (dynamic):** project categories, tags (already free), feature toggles (already free).
- **Code (stays enum):** `MotifKind`, `HeaderVariant`, `MockScreen`, `DeviceView`, `BlockTone`, `ProjectSide`, block types, content status. Each value maps to a renderer or artwork; a value without code behind it would render nothing. Do not make these dynamic.

### Backend

- New setting key `project_categories`: JSON schema `[{ "slug": "^[a-z0-9-]{2,32}$", "label": string 1..40 }]`, unique slugs. Seed default: `games`, `platforms`, `on-chain` (current labels from `en.json`).
- `ports.ProjectFilter` stops being an enum: `Categories []string`. Project service validates on create/update that each category exists in the setting (inject `ss ports.SettingsService`; settings does not depend on projects, so no cycle). New sentinel `ErrUnknownCategory` with a violation on `categories`.
- Removing a category from the setting is allowed; projects keep the stale slug, the public filter ignores it, and the project form shows it as "unknown — remove". `ponytail:` no cascade; add a cascade cleanup if stale slugs ever matter.
- `ListPublicProjectsRequest.Category` becomes a string validated against the setting.
- Public settings endpoint already exists; expose `project_categories` there for the site's filter bar.

### Frontend

- Remove `ProjectFilter` enum and `dashboard.options.categories.*` / site filter labels; the `All` filter stays a code constant.
- Hook `useProjectCategories()` reads the public setting; the site filter bar and the dashboard toggle group map over it. Labels are data, so they render raw (allowed by the i18n rule).
- Settings: new tab `routes/dashboard/settings/categories/index.tsx` (nested route, `config.routes`), a `useFieldArray` list of `{slug, label}` with add/remove/reorder; slug auto-derived from label on create, read-only after save.
- Project form: categories toggle group built from the hook, with its own loading/error state.

---

## Part E — Seed the mocked content into the database

Run this part **last**, after Parts B–D (and G if done) are implemented and both gates pass, so the seed goes through the final contracts (dynamic categories, `art_url`, file references).

### Source of truth

`frontend/content/ME.md` → `bun run build:portfolio` (`scripts/build-portfolio/`) → `src/api/mocks/portfolio/{projects,posts,profile}.ts`. The mocks are no longer used at runtime (only tests), so the database has none of this content today.

### Exactly what to seed

**Projects — all 6**, in this order (order = site order = `num`):

| # | mock `id` (= backend slug) | name | note |
|---|---|---|---|
| 0001 | `morning-moon-pocket` | Morning Moon Pocket | has a `lineage` block with `fromId: "morning-moon-village"` (forward reference, see pass 2) |
| 0002 | `metal-valley` | Metal Valley | |
| 0003 | `evermoon-socialfi` | Evermoon SocialFi | |
| 0004 | `estic-ai` | Estic AI | |
| 0005 | `morning-moon-village` | Morning Moon Village | |
| 0006 | `aads` | AADS | |

- Backend slug is generated from `name` (`GenerateBaseSlug`: lowercase, non-alphanumerics to `-`). All 6 generated slugs equal the mock ids, so public URLs stay the same. The seed asserts this and fails loudly if one differs.
- `num` is generated sequentially (`%04d`). Creating in the order above on an empty `project` collection gives `0001`–`0006`, matching the mocks.
- Every field: `name`, `full`, `kind`, `side`, `tags`, `categories`, `stack`, `about`, `role`, `blocks`; `status: published`.

**Notes — all 3**:

| mock `slug` | title |
|---|---|
| `scalable-game-backend` | How to build a scalable backend for a game |
| `smart-contracts-you-can-sleep-next-to` | Writing smart contracts you can sleep next to |
| `four-thousand-pins-one-smooth-map` | Four thousand pins, one smooth map |

- Fields: `title`, `kind`, `tags`, `excerpt`, `blocks`; `status: published`. Not sent: `num`, `read_minutes`, `sample` (backend computes them).
- **Slugs differ.** The backend derives a note slug from the title. Decision (user): note `slug` is an optional input on create/update for everyone (see API contract): given = used (normalized, unique), empty = auto from title. The seed passes the mock slugs, so `/notes/<slug>` links keep working.
- `published_at`: every mock says "Oct 2026". Notes list sorts by `published_at` desc, so equal values give an unstable order. Use `2026-10-03`, `2026-10-02`, `2026-10-01` (UTC) in the table order above, so the list shows the same order as the mocks.
- `project_id`: none in the mocks; leave null. Optional follow-up: link "Four thousand pins…" to `estic-ai`.

**Profile setting (includes contact)** — the `profile` setting key, whole object, because `profile.json` requires every part:

- `name`, `headline`, `about`
- `skills` (5 groups), `core`, `experience`, `education` (`end: null` where open)
- `contact`: `email`, `github`, `linkedin`, `discord` — the values in `src/api/mocks/portfolio/profile.ts`.

**Project categories** (Part D): `games`, `platforms`, `on-chain` with their current English labels from `en.json`.

**Not seeded:** gallery frames and files (the gallery mocks were deleted; upload real pictures through the storage service), site title/SEO/feature toggles (set in the dashboard).

### Mechanism: backend CLI `commands content seed --file <path>`

Why a backend CLI and not a frontend script calling the admin API: the backend owns the data; the CLI runs in the deploy container without Bun or credentials; it goes through the same services, so validation, slugs, `num`, `read_minutes` and order come out exactly like a dashboard save.

#### Step 1 — Frontend: export `content/seed.json`

Extend `scripts/build-portfolio/index.ts` to also write `content/seed.json` (checked in, regenerated with the mocks). Shape, all keys **snake_case** (backend contract):

```json
{
  "project_categories": [{ "slug": "games", "label": "Games" }],
  "projects": [{ "slug": "morning-moon-pocket", "name": "…", "full": "…", "kind": "pixel", "side": "behind-the-scenes",
                 "tags": [], "categories": ["games"], "stack": [], "about": "…", "role": [], "status": "published",
                 "blocks": [{ "type": "lineage", "params": { "from_slug": "morning-moon-village", "…": "…" } }] }],
  "notes": [{ "slug": "scalable-game-backend", "title": "…", "kind": "hex", "tags": [], "excerpt": "…",
              "status": "published", "published_at": "2026-10-03T00:00:00Z", "blocks": [] }],
  "profile": { "name": "…", "contact": { "email": "…", "github": "…", "linkedin": "…", "discord": "…" } }
}
```

- Mock block params are camelCase in places (`fromId`, `imageUrl`). Convert every block param key to snake_case (`from_id`, `image_url`) with one small helper; unit-test it.
- Lineage: the mock `fromId` is a slug, the backend wants an ObjectID. Export it as `from_slug` (seed-only key); the CLI resolves it (step 2) and the key never reaches the API.
- `slug` on projects is for the CLI's assertion and skip check only.
- Test (`scripts/build-portfolio/index.test.ts`): 6 projects, 3 notes, contact present, no camelCase keys in blocks.

#### Step 2 — Backend: `seed` subcommand in `commands/content.go`

Beside `migrate`; usage `commands content seed --file <path> [--force]`. Bootstrap the runtime like `migrate`, build the real services, then:

1. **Categories**: write `project_categories` if the stored value is empty (or `--force`).
2. **Projects, pass 1**: for each project in file order: if the slug exists, skip and remember its id. Else `ps.Create` with lineage `from_id` removed (the target may not exist yet). Assert the returned slug equals the file slug. Collect `slug → id`.
3. **Projects, pass 2**: for each created project with a `from_slug`: `ps.Update` with `from_id` set to the resolved ObjectID. Unknown slug: log and leave it unset.
4. **Order**: `ps.UpdateOrder` with existing ids first, then the created ones in file order.
5. **Notes**: skip if the slug exists, else create with the explicit slug and the given `published_at`.
6. **Profile**: write `profile` if the stored value is empty (or `--force`).
7. Print `created / skipped / failed` per type. Report every validation failure, then exit non-zero if any.

Idempotent: a second run creates nothing. `--force` overwrites settings only, never existing projects or notes (edits made in the dashboard win).

Follow backend `AGENTS.md`: constants in `internal/core/constant/`, errors wrapped, no discarded errors, `make verify` clean.

#### Step 3 — Tests and docs

- Service-level test with mocks: two-pass lineage resolution; second run skips everything; slug mismatch fails.
- Run against a local Mongo: seed, then open `/projects/morning-moon-pocket` (lineage links to Morning Moon Village), `/notes/scalable-game-backend`, the about page (contact links), and the dashboard lists (6 projects in order, 3 notes).
- Docs: `docs/API.md` (CLI section), backend `MEMORY.md`, frontend `MEMORY.md`: "run `bun run build:portfolio`, then `go run ./commands content seed --file ../frontend/content/seed.json`".

### Hand-off to implementation agents (Sonnet, medium effort)

Give each agent one step, its repo's `AGENTS.md` and `MEMORY.md`, and this section. Order:

1. Frontend agent: Step 1 (export + test). Gate: `bun run check`, `bun run lint:style`, `bun run lint:tw`, `bun run pretty`.
2. Backend agent: Step 2 + Step 3 tests (plus the seed-only note slug). Gate: `make verify`, `go test ./... -race`.
3. Run the seed against the local DB and do the browser checks in Step 3.

---

## Part F — Dashboard UX polish

Ordered by value per effort.

1. **Unsaved-changes guard (U2).** `useBlocker(form.formState.isDirty && !submitting)` from react-router + shadcn `AlertDialog` ("Discard changes?"), plus `beforeunload` while dirty. One hook in `src/hooks/use-unsaved-guard.ts`, used by project, note and every settings form.
2. **Sticky action bar (U3).** A `FormActions` common component (`components/common/forms/`): sticky bottom bar with Save/Cancel, a "unsaved changes" hint while dirty, same button heights (Overlay Button Sizing Parity).
3. **Block editor (U4, A4).** On top of `useFieldArray`:
   - "Add block" as a `DropdownMenu` listing types (one click instead of select + button); an insert point between cards.
   - Cards collapsible (shadcn `Collapsible`; add it). Collapsed header shows type + first text field as summary. New and invalid blocks open automatically.
   - Duplicate action; remove shows a toast with Undo (re-insert at index) instead of a confirm dialog.
   - Drag reorder: skipped; the arrow buttons work and are accessible. Add `@dnd-kit` only if ordering long lists gets painful.
4. **Per-field validation (U1, A2).** Replace the global `invalid` flag: `blocksHaveMissing` returns the indexes of invalid blocks; the card shows a destructive badge and opens; on submit failure, scroll to and focus the first invalid field (`form.setFocus` for top-level, `scrollIntoView` for blocks). Mark required labels.
5. **One list convention (U5).**
   - Short tokens (tags, stack): `TagsField` = shadcn Combobox multiple with chips, suggestions from existing tags (`/note/tags`, `/gallery/tags`; add project tags to the admin list response or compute client-side from `useAdminProjects`). Free entry allowed.
   - Sentences (role, notes, list items): `Lines` list editor = one `Input` per row with add/remove (via `useFieldArray`), not a newline textarea. Fixes A1 for good.
   - Records: `Objects` cards (unchanged).
6. **DRY (U7).** One `ProjectSelectField` (common under `routes/dashboard/components/`) used by note form, frame form and `FieldKind.Project`; forms read option lists from `optionSets` instead of rebuilding them.
7. **After create**, go to the new item's edit page (toast "Created"), not back to the list, so the author can keep editing. Add a "View on site" link for published items.
8. **Feature toggles (U9).** Keep free names, but list the flags the site reads (a typed `FeatureFlag` enum in `api/types`) as suggestions in a combobox, and show "not used by the site" on unknown names.

---

## Part G — Uploadable art (motifs)

### Today

`kind` (`MotifKind`: radar, moon, pixel, hex, orbit, pins) picks one of six hand-drawn SVG components (`components/common/art/motif/*`, `art/mock/*`). The dashboard offers them as a text `Select` ("Radar", "Moon", …), so the author cannot see what they pick and cannot use their own art.

Every motif renders through one component, `ProjectMotif` (14 call sites: project cards, headers, `motif-full`, `about-split`, note cards, post header, explore tiles, menu preview). `ProjectMedia` already shows a real image when `imageUrl` loads and falls back to the SVG mock otherwise.

### Decision

Built-in motifs stay as **presets and fallback**; uploaded art is **added on top**, not a replacement.

- Keep `kind`: the SVGs use `currentColor`, so they follow the theme (light/dark, invert tone). An uploaded image does not, and a broken or deleted file needs a fallback. `kind` stays required in every schema.
- Add an optional uploaded image beside `kind` wherever art is shown:

| Owner | New field | Shown in |
|---|---|---|
| Project | `art_url` (top level) | project cards, menu preview, explore tiles |
| Note | `art_url` (top level) | note cards, featured post, post header |
| Block `project-header` | `image_url` (optional param) | header art; falls back to project `art_url`, then `kind` |
| Block `motif-full`, `about-split` | `image_url` (optional param) | block art |

### Backend

- Models and requests: `ArtURL string` on project and note (`json:"art_url"`, optional, `format: uri` or empty); summaries/details return it.
- Block schemas `project-header.json`, `motif-full.json`, `about-split.json`: optional `image_url` (`format: uri`). The new field is optional, so stored content stays valid and no `content_version` migrator is needed.
- Raster only (JPEG/PNG through the storage service). **No SVG uploads**: an SVG served from `/uploads` on the API origin runs scripts when opened directly. Add SVG only with sanitizing plus `Content-Security-Policy: sandbox` on `/uploads`.

### Frontend

- `ProjectMotif` gets an optional `imageUrl`. Same pattern as `ProjectMedia`: render `<img class="size-full object-cover">` when set, fall back to the SVG on `onError`. Call sites pass `project.artUrl` / `post.artUrl` / block `imageUrl`; there is no other render change.
- **`ArtField`** (replaces the kind `Select` in project form, note form and the `kind` field of art blocks): one control with two rows.
  1. **Preset** — `ToggleGroup` of the six motifs rendered as small live thumbnails (`ProjectMotif` at 80×60), selected state ringed. Writes `kind`.
  2. **Custom image (optional)** — the `FileSelectField` from Part C (`accept=[Image]`, dropdown + **plus** to upload). Writes `art_url` / `image_url`. A "Use preset" clear action removes it.

  A live preview next to it shows what the site will render (custom image if set, else the preset).
- Dynamic form: new `FieldKind.Art` that edits the pair `kind` + `image_url` in one control. Its spec names both keys, so `normalize` drops an empty `image_url` like any optional field.
- `mock` and `gallery` block items keep `kind`/`screen` as the fallback mock; their `image_url` already uses the file picker (Part C). Show the mock preset as a thumbnail too, not a text select.

### Not done

- Uploading new **presets** (theme-aware vector art) is skipped. It needs SVG sanitizing and a `motif` collection. Add it only if you want to draw new motif styles without a deploy.

---

## Part H — Status control

`status` has two values (`draft`, `published`). A `Select` works, but it is the wrong control: it hides the current value behind a click, and a two-way choice reads better as visible options.

- In the form body, replace the status `Select` with a two-option `ToggleGroup` (segmented control, already used for categories), or remove it from the body entirely (next point).
- Better: put status in the sticky action bar (F2). Show the current state as a `StatusBadge`. A draft shows **Save draft** and **Publish**. A published item shows **Save** and **Unpublish** (Unpublish is secondary). Publishing and saving become one click, and a draft cannot be published by accident through a select.
- Keep `Select` for enums with 4+ values or long labels (header variant, tone). Use `ToggleGroup` for 2–3 short options (side, screen, view). Use visual thumbnails for art (Part G).

---

## Order of work

| Step | Repo | Part | Depends on |
|---|---|---|---|
| 1 | FE | A1, A2, A5, A6 (bug fixes) | — |
| 2 | BE | B: storage service, file kinds allowlist, routes, tests, bruno | — |
| 3 | BE | B: gallery on `file_id` + `migrate-files` | 2 |
| 4 | FE | C: data layer, files page, picker, upload dialog | 2 |
| 5 | FE | C: gallery dialog, SEO, `FieldKind.File` wire-up (fixes A3) | 3, 4 |
| 6 | BE | D: `project_categories` setting + validation | — |
| 7 | FE | D: categories tab, hook, remove enum | 6 |
| 8 | FE+BE | E: seed JSON export + `content seed` CLI, then run it | all code steps (run last) |
| 9 | FE | F1–F4 (guard, action bar, block editor, validation) | 1 |
| 10 | FE | F5–F8 | 9 |
| 11 | BE | G: `art_url` on project/note, optional `image_url` on art block schemas | 2 |
| 12 | FE | G: `ProjectMotif` image fallback, `ArtField`, `FieldKind.Art` | 4, 11 |
| 13 | FE | H: status in action bar, `ToggleGroup` for 2–3 option enums | 9 |

## Verify in the browser (per AGENTS.md)

- File picker: loading/empty/error states; upload via plus selects the new file; reopen dialog is clean; `accept=[Image]` hides other kinds; external URL value still shows.
- Files page: kind tabs survive refresh; a PDF downloads (attachment), an HTML/SVG upload is rejected.
- Gallery: create frame from an existing image file; delete a file used by a frame → 409 message.
- Project edit: role sentence with commas survives save → reload (A1).
- Backend field error lands on the field (`project_id`, a block field) (A2).
- Navigate away from a dirty form → guard dialog.
- Seed: run twice; second run creates nothing; lineage links resolve on the public project page.

## Open questions for the user

1. Video in project blocks: should `mock`/`gallery` blocks play video now (needs public renderer work), or images only for this round?
2. Note slugs: keep the short mock slugs (plan default, needs a seed-only slug path) or accept title-derived slugs?
3. Categories: is a settings key enough, or do you want categories with their own description/ordering/icon (then a separate collection)?
4. Art: should a project's `art_url` also be the default for its note cards when the note links to that project, or does each note pick its own?
