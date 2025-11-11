# QuestGen

AI-powered question paper generator. Upload source materials and generate custom exam papers, quizzes, or study materials with intelligent question design.

## Features

- **AI-Powered Generation**: Uses Google Gemini AI to create questions from uploaded materials
- **Companion Solutions**: Optionally generate step-by-step solutions alongside papers
- **Flexible Pattern Design**: Customizable paper structure with preset templates or custom patterns
- **Multi-format Support**: Accepts PDFs, images (JPEG, PNG, GIF, WebP), and documents (Word, Excel, plain text)
- **Paper Regeneration**: Refine existing papers with custom instructions
- **Professional Export**: Generate print-ready PDFs with optimized typography and layout
- **Paper Management**: Organize, search, duplicate, and export generated papers
- **View Modes**: Card and list views with theme preferences
- **User Authentication**: Secure Google OAuth login with session management

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini API (`@google/genai`)
- **Auth**: Better Auth with Google OAuth
- **State Management**: TanStack Query for server state
- **PDF Export**: Client-side browser print pipeline with custom styling
- **UI**: Tailwind CSS 4, shadcn/ui components
- **Markdown Rendering**: Streamdown for content preview
- **Package Manager**: Bun

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Google Gemini API key
- Google OAuth credentials

### Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/prathamdby/questgen
   cd questgen
   bun install
   ```

2. **Environment variables**

   Create `.env.local` with the following variables:

   ```bash
   # Database
   DATABASE_URL="postgresql://..."
   DIRECT_DATABASE_URL="postgresql://..."

   # Google Gemini AI
   GEMINI_API_KEY="your-gemini-api-key"

   # Google OAuth (Better Auth)
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   BETTER_AUTH_SECRET="generate-with-openssl-rand-base64-32"
   BETTER_AUTH_URL="http://localhost:3000/api/auth"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   DISABLE_RATE_LIMITING="false"
   ```

3. **Database setup**

   ```bash
   bunx prisma generate
   bunx prisma db push
   ```

4. **Development**

   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign in** with Google OAuth
2. **Create new quest** — configure paper name, pattern, duration, and total marks
3. **Upload materials** — add PDFs, images, or documents as source content (max 10 MB per file, 50 MB total)
4. **Generate** — AI creates questions based on uploaded materials
5. **Regenerate** — refine papers with custom instructions
6. **Export** — download as professionally formatted PDF

## Paper Patterns

Define your paper structure using flexible pattern syntax:

```
Section A: 10 MCQs (20 marks)
Section B: 5 Short Answers (30 marks)
Section C: 3 Long Answers (50 marks)
```

### Pattern Presets

QuestGen includes several preset patterns:

- **Balanced Assessment**: Classic mix of objective, short, and long-form answers
- **Foundation Focus**: Prioritizes core definitions and recall
- **Bloom's Depth**: Progressively deeper questions from recall to analysis
- **Rapid Quiz**: Fast-paced checkpoints for formative assessments
- **Applied Project**: Combines planning, execution, and review

## Supported File Types

- **PDFs**: `.pdf`
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- **Documents**: `.txt`, `.doc`, `.docx`, `.xls`, `.xlsx`

File size limits: 10 MB per file, 50 MB total per generation.

## API Rate Limits

- **Paper generation**: 2 papers per minute
- **Paper regeneration**: 2 regenerations per minute
- **General API**: 100 requests per minute

## Architecture

### Server-First Components

QuestGen follows a server-first component pattern:

- **Default**: Server Components (no client JavaScript)
- **Opt-in**: Client Components only when needed (hooks, events, browser APIs)

### Data Flow

1. Client components call API routes
2. API routes authenticate via Better Auth
3. Rate limiting enforced at API level
4. Status translation: Database enums → UI-friendly strings
5. Optimistic updates via TanStack Query

### Key Patterns

- **Status Translation**: All API routes transform Prisma enums (`IN_PROGRESS`) to UI strings (`"in_progress"`)
- **Paper ↔ Solution**: One-to-one relationship (unique constraint on `Solution.paperId`)
- **File Lifecycle**: Gemini file URIs cleaned up after generation
- **Toast-First Errors**: All async operations surface errors via Sonner

## Development

### Database Schema

- `User`: Authentication and user data
- `Paper`: Generated question papers with status tracking
- `PaperFile`: Source materials metadata
- `Solution`: Companion solutions (one-to-one with Paper)
- `UserPreference`: Theme and view mode settings
- `GenerateFormDraft`: Auto-saved form state
- `RateLimit`: Rate limiting tracking

### Key Files

- `app/api/papers/generate/route.ts` — AI generation pipeline
- `app/api/papers/regenerate/route.ts` — Paper regeneration logic
- `lib/ai.ts` — Gemini client configuration
- `lib/rate-limit.ts` — Custom rate limiting implementation
- `lib/pdf-export-client.ts` — Client-side PDF export
- `lib/queries/papers.ts` — React Query hooks
- `prisma/schema.prisma` — Database models

### Project Structure

```
app/
  api/          # Route handlers (papers, solutions, auth, preferences)
  home/         # Dashboard with card/list views
  generate/     # Paper creation form
  paper/[id]/   # Paper detail with regeneration
  solution/[id]/ # Solution detail

lib/
  ai.ts         # Gemini client
  auth.ts       # Better Auth config
  rate-limit.ts # Rate limiting
  queries/      # React Query hooks
  pdf-export-client.ts # PDF export

components/
  home/         # Dashboard components
  paper/        # Paper detail components
  generate/     # Form components
  shared/       # Reusable primitives
  ui/           # shadcn/ui components
```

## License

MIT License - see [LICENSE](LICENSE) for details.

Copyright (c) 2025 Pratham Dubey
