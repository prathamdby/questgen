# QuestGen

QuestGen is an AI-native workspace for crafting beautiful, assessment-ready question papers. Every surface borrows warmth from Apple’s human-centric typography while honoring Vercel’s precision and minimalism so teams can focus on ideas, not interfaces.

## Experience principles

- **Apple-level craft:** Soft gradients, generous white space, and `tracking-[-0.01em]` typography showcase generated content without distraction.
- **Vercel-grade clarity:** Dark and light modes stay pixel-perfect, grids snap to 8pt rhythm, and micro-interactions feel somatically calm.
- **Trust through transparency:** Toast-first feedback, optimistic UI, and audit-friendly history keep educators in control of the AI pipeline.

## Core capabilities

- **AI question synthesis:** Upload PDFs or images and let Google Gemini reconcile intent, difficulty, and marks.
- **Pattern-first workflows:** Compose section blueprints (MCQ, subjective, etc.) and reuse them across papers.
- **Companion solutions:** Optionally spin up detailed answer keys in the same pass.
- **Apple-inspired exports:** Print-ready PDFs echo the native design language with calibrated typography and spacing.
- **Paper operations:** Duplicate, archive, search, and regenerate with state-aware toasts and optimistic transitions.

## Architecture snapshot

| Layer        | What happens                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| UI           | Next.js 16 App Router + React 19 components styled with Tailwind CSS 4 and shadcn/ui primitives       |
| Client state | TanStack Query orchestrates mutations, Sonner surfaces feedback, next-themes handles appearance modes |
| API          | App Router route handlers gated by Better Auth sessions with Prisma-backed persistence                |
| Data         | PostgreSQL schema (Prisma) links Users ⇄ Papers ⇄ Files; Paper ↔ Solution remains one-to-one         |
| AI pipeline  | Google Gemini via `@google/genai` uploads sources, generates markdown, and cleans temp artifacts      |
| Export       | `lib/pdf-export-client` renders Apple/Vercel print templates directly in the browser                  |

## Key contracts

- Translate Prisma enum statuses (`IN_PROGRESS`/`COMPLETED`) to UI strings (`"in_progress"`/`"completed"`).
- Delete Gemini file uploads post-generation to avoid quota leaks.
- Maintain Paper ↔ Solution uniqueness; duplication intentionally omits solutions.
- All async paths must resolve with a Sonner toast to preserve operator confidence.

## Getting started

### Prerequisites

- Bun (or Node.js ≥ 18) for runtime and scripts
- PostgreSQL
- Google Gemini API key
- Google OAuth credentials

### Installation

```bash
bun install
```

### Environment

Copy the template and populate your secrets:

```bash
cp .env.example .env.local
```

| Variable                  | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `DATABASE_URL`            | Prisma primary connection string               |
| `DIRECT_DATABASE_URL`     | Shadow/management connection                   |
| `GEMINI_API_KEY`          | Google Gemini access                           |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth client                            |
| `BETTER_AUTH_SECRET`      | Session encryption                             |
| `BETTER_AUTH_URL`         | Better Auth handler URL (usually `/api/auth`)  |
| `NEXT_PUBLIC_APP_URL`     | Absolute app origin for callbacks and previews |

### Database

```bash
bunx prisma generate
bunx prisma db push
```

### Development

```bash
bun dev
```

Visit `http://localhost:3000`, sign in with Google, upload source material, and watch QuestGen compose a paper end-to-end.

## Script reference

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `bun dev`              | Start the Next.js development server     |
| `bunx prisma generate` | Regenerate Prisma client                 |
| `bunx prisma db push`  | Apply schema to the connected database   |
| `bun test`             | Run project test suites (when available) |

## Folder tour

- `app/` – App Router routes, server actions, and Suspense-driven detail views
- `components/` – Shared Apple/Vercel-aligned primitives and domain widgets
- `lib/` – Authentication, AI, PDF export, and utility layers
- `prisma/` – Schema and seed helpers
- `public/` – Fonts and static assets

## API rate limits

- Paper generation/regeneration: 2 requests per minute (Better Auth throttle)
- Global API: 100 requests per minute

## License

MIT License © 2025 Pratham Dubey
