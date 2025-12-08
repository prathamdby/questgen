# AGENTS.md

AI agent guidance for QuestGen codebase. Sub-directories have their own AGENTS.md with specific patterns.

## Project Snapshot

- **Type**: Single Next.js 16 application (App Router)
- **Stack**: TypeScript, Tailwind v4, shadcn/ui, Prisma, Better-Auth, Google Gemini
- **Package Manager**: Bun (`bun install`, `bun run <script>`)
- **Sub-AGENTS**: See [`app/AGENTS.md`](app/AGENTS.md), [`components/AGENTS.md`](components/AGENTS.md), [`lib/AGENTS.md`](lib/AGENTS.md)

## Setup Commands

```bash
bun install              # Install dependencies (runs prisma generate via postinstall)
bun run dev              # Start dev server (localhost:3000)
bun run build            # Production build
bun run lint             # ESLint check
bunx tsc --noEmit        # Type check
```

## Universal Conventions

### Code Style

- **TypeScript strict** mode enabled
- **ESLint**: `next/core-web-vitals` + `next/typescript`
- **Imports**: Use `@/*` alias (maps to project root)
- **No unused code**: Remove dead code, unused imports
- **Self-documenting names**: Avoid comments, use clear naming

### File Organization

```
app/           → Pages (RSC by default) + API routes
components/    → Feature-organized React components
lib/           → Utilities, auth, AI, queries, transformers
prisma/        → Database schema only
```

### Commit Format

- Conventional commits: `feat:`, `fix:`, `refactor:`, `chore:`
- Keep commits atomic and focused

## Security & Secrets

- **Never commit**: API keys, tokens, credentials
- **Env files**: `.env.local` for local, `.env` for defaults
- **Required vars**: `DATABASE_URL`, `DIRECT_DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GEMINI_API_KEY`, `NEXT_PUBLIC_APP_URL`
- **Client-safe vars**: Must use `NEXT_PUBLIC_` prefix

## JIT Index (what to open, not what to paste)

### Package Structure

- **Pages & API**: `app/` → [see app/AGENTS.md](app/AGENTS.md)
- **Components**: `components/` → [see components/AGENTS.md](components/AGENTS.md)
- **Business Logic**: `lib/` → [see lib/AGENTS.md](lib/AGENTS.md)
- **Database Schema**: `prisma/schema.prisma`

### Quick Find Commands

```bash
# Find a React component by name
rg -n "export (const|function) ComponentName" components/

# Find an API route handler
rg -n "export async function (GET|POST|PUT|DELETE)" app/api/

# Find a React Query hook
rg -n "export function use" lib/queries/

# Find where a lib function is used
rg -n "functionName" app/ components/

# Find Prisma model usage
rg -n "prisma\.(modelName)" app/ lib/

# Find all client components
rg -l '"use client"' app/ components/
```

## Definition of Done

Before creating a PR:

1. `bunx tsc --noEmit` passes (no type errors)
2. `bun run lint` passes
3. `bun run build` succeeds
4. Manual test in browser (dev server)
5. No console errors/warnings

## Design System Reference

This project follows a strict Apple/Vercel aesthetic. See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for:

- OKLCH color system (monochrome dominant)
- Geist typography (pixel-based sizing)
- Minimal shadows (0.04 opacity max)
- Subtle animations (150-200ms, cubic-bezier)

**Key rule**: When tempted to add visual flair, simplify instead. Refined restraint over flashy effects.
