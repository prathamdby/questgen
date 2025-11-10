# Agents onboarding guide

## Purpose

Document the architectural patterns, operational contracts, and historical context required to ship reliable changes to QuestGen without rediscovering tribal knowledge.

## Audience

Software engineers joining the QuestGen codebase who need repeatable mental models for navigation, implementation, and review within 48 hours.

## Contributor journey roadmap (mandatory emotional checkpoints)

### Phase 1 – Architectural overwhelm (0–6 hours)

- Inventory core entry points: `app/layout.tsx`, `app/home/page.tsx`, `app/generate/page.tsx`, `app/paper/[id]/page.tsx`, and `app/solution/[id]/page.tsx`.
- Confirm runtime context: App Router with React 19 Server Components by default; opt into client work with `"use client"`.
- Trace authentication first: Better Auth session helpers in `lib/auth-client.ts` and rate-limited API surfaces in `lib/auth.ts`.

### Phase 2 – Pattern recognition relief (6–18 hours)

- Map front-end data flow: client components call `/api/*` routes, which always gate on `auth.api.getSession` and translate Prisma enums to UI-friendly discriminated unions.
- Recognize the AI pipeline: `app/api/papers/generate/route.ts` handles Paper creation, Gemini file uploads, prompt orchestration, and cleanup.
- Decode styling contracts: Tailwind 4 with Apple/Vercel spacing, typography, and `tracking-[-0.01em]` letter spacing; shared primitives in `components/shared` and `components/ui`.

### Phase 3 – Execution confidence (18–36 hours)

- Internalize invariants:
  - Paper ↔ Solution is one-to-one (Prisma unique constraint on `Solution.paperId`).
  - Status values leave the database in `IN_PROGRESS`/`COMPLETED` but must reach the UI as `"in_progress"`/`"completed"`.
  - All Markdown rendered with `Streamdown` flows through `MarkdownPreview` for consistent typography.
- Practice local reasoning by reviewing regeneration logic in `app/paper/[id]/page.tsx` (optimistic status updates) and PDF export helpers in `lib/pdf-export-client.ts` (client-side print pipeline).

### Phase 4 – Contribution urgency (36–48 hours)

- Pick a bounded target (example: new pattern preset, additional toast coverage, or API error messaging).
- Validate changes against the implicit contracts catalogued below before opening a pull request.
- Prepare reviewers by citing affected ghosts-in-the-machine and confirming rate-limit, toast, and status invariants.

## System architecture reference

### Runtime layers

- UI: Next.js 16 App Router, React 19, Tailwind 4, shadcn/ui components inside `components/ui`.
- Authentication: Better Auth with Prisma adapter (`lib/auth.ts`), exposing `auth.api.getSession` for API routes and `useSession` via `lib/auth-client.ts`.
- Database: PostgreSQL via Prisma (`prisma/schema.prisma`). Singleton client in `lib/prisma.ts` avoids hot-reload connection storms.
- AI generation: Google Gemini (`lib/ai.ts`) with shared `DEFAULT_MODEL` and `DEFAULT_GENERATION_CONFIG`.
- PDF export: Pure client render-to-print pipeline in `lib/pdf-export-client.ts` using `marked` for Markdown → HTML and Apple/Vercel design tokens.

### API surface (App Router route handlers)

| Route                                | Responsibility              | Hidden requirements                                                                                                  |
| ------------------------------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `app/api/papers/route.ts`            | Fetch and create papers     | Transform Prisma enum status; include solution presence; duplicate paper via POST expects pre-rendered `content`.    |
| `app/api/papers/[id]/route.ts`       | Get/delete individual paper | Enforce ownership; include files/tags/solution; cascade delete relies on Prisma relations.                           |
| `app/api/papers/generate/route.ts`   | Full AI pipeline            | Upload files to Gemini, poll processing, clean up URIs, reconcile mark totals, optionally create companion solution. |
| `app/api/papers/regenerate/route.ts` | Paper regeneration          | Reuse stored files, throttle via Better Auth custom rule, set `status` optimistic updates expected by UI.            |
| `app/api/solutions/[id]/route.ts`    | Get/delete solution         | Mirror status translation, include associated paper and files for linking/export.                                    |
| `app/api/preferences/route.ts`       | User view preferences       | Upsert without FK on `GenerateFormDraft`; defaults to dark/card view.                                                |
| `app/api/auth/[...all]/route.ts`     | Better Auth handler         | No local edits—delegates to Better Auth router.                                                                      |

## Ghost contracts (invisible but enforced)

| Contract                                | Location                                                                 | Enforcement rationale                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Status translation**                  | All API route handlers                                                   | UI discriminated unions expect lowercase snake case; breaking this crashes status badges and regeneration toggles. |
| **Paper ⇄ Solution one-to-one**         | `prisma/schema.prisma`, API upserts                                      | Companion solution buttons assume unique `paperId`; duplication flow omits solutions by design.                    |
| **Gemini file lifecycle**               | `app/api/papers/generate/route.ts`, `app/api/papers/regenerate/route.ts` | Temporary URIs must be deleted after generation to avoid quota exhaustion.                                         |
| **Mark reconciliation**                 | `analyzePatternMarks` + prompt in `app/api/papers/generate/route.ts`     | Prevents mismatch between user-entered total and pattern-implied marks; removing it breaks exam validity.          |
| **Toast-first error reporting**         | Client pages in `app/home`, `app/generate`, `app/paper`, `app/solution`  | Every async path must surface errors via `sonner`. Silence here leads to abandoned sessions.                       |
| **Apple/Vercel typography**             | `components/*`, `lib/pdf-export-client.ts`                               | Typography, spacing, and radius selections are standardized; deviations fail design review.                        |
| **`use` + Suspense for dynamic routes** | `app/paper/[id]/page.tsx`, `app/solution/[id]/page.tsx`                  | React 19 pattern keeps server data loading deterministic; bypassing Suspense reintroduces waterfalls.              |
| **File acceptance and size limits**     | `app/generate/page.tsx`, `lib/file-types.ts`                             | Gemini rejects unsupported MIME types; UI validates 10 MB/file, 50 MB total before API call.                       |
| **Rate limiting via Better Auth**       | `lib/auth.ts`                                                            | Generation/regeneration capped at 2/min; additional endpoints inherit global 100/min limit.                        |

## Decision log (implicit historical context)

- **GenerateFormDraft without FK**: Draft table intentionally omits foreign key to simplify cleanup when users churn (`prisma/schema.prisma`).
- **PaperTag placeholder**: Tags exist for future filtering; current UI ignores them, so do not rely on tags for business logic.
- **Solution optionality**: Solution generation is best-effort. API returns `solutionError` so UI can toast while still redirecting to the completed paper.
- **Markdown cleaning**: Both generation and PDF export strip ``` fences before persistence to prevent Gemini variability from breaking previews.
- **Singleton Prisma**: Development servers reuse the same Prisma client to avoid exhausting database connections during hot reloads.

## Actionable mental models

1. **Pipeline mindset**: Input files → Gemini upload → prompt orchestration → Markdown persistence → Streamdown render → optional PDF export. Bugs usually appear at stage boundaries; inspect logs and Gemini state first.
2. **UI contract layering**: API returns normalized primitives; client components (cards, lists, status badges) expect pre-formatted values to keep rendering pure.
3. **Toast discipline**: Every mutation pathway must resolve with success navigation or `toast.{error|warning}`. Missing toasts are treated as regressions.
4. **Design tokens first**: Tailwind classes align with Apple/Vercel heuristics. Before adding custom CSS, check existing class patterns in the same feature folder.
5. **Prompt symmetry**: Paper and solution prompts mirror each other’s emotional arc (fear → relief → excitement → urgency). Maintain that rhythm when extending prompts to preserve AI output tone and structure.

## First contribution countdown (execute within 48 hours)

1. **Select a scaffolded task**: Examples—add a preset in `lib/pattern-presets.ts`, enhance error messaging in `/api/papers/generate`, or extend `StatusBadge` variants.
2. **Validate contracts**:
   - Confirm status transformations remain intact.
   - Respect file size/type guards if touching uploads.
   - Preserve toast and skeleton usage for new async paths.
3. **Test mental models**:
   - Dry-run AI pipeline with mock data if prompts change.
   - Export to PDF after content changes to verify typography.
4. **Prepare review notes**: Reference affected ghosts (table above), list touched files, and cite rate-limit awareness when relevant.

## Reference files checklist

- `app/layout.tsx` – Theme provider, fonts, analytics, toaster.
- `lib/auth.ts` – Better Auth configuration, rate limits, social providers.
- `lib/ai.ts` – Gemini client instantiation and defaults.
- `lib/file-types.ts` – Source material validation helpers.
- `lib/pdf-export-client.ts` – Paper and solution export templates.
- `app/api/papers/generate/route.ts` – End-to-end generation orchestrator.
- `app/home/page.tsx` – Dashboard orchestrating cards, list view, and exports.
- `components/paper/MarkdownPreview.tsx` – Streamdown-based rendering contract.
- `prisma/schema.prisma` – Source of truth for relational constraints and cascade behavior.

Keep this guide open during your first implementation; each section encodes the ghosts that previously haunted onboarding. Matching these expectations is the fastest path to a safe, first meaningful contribution.
