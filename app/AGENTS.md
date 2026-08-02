# app/AGENTS.md

Next.js App Router pages and API routes.

## Package Identity

- **Purpose**: Route handlers, page components, layouts
- **Framework**: Next.js 16 App Router
- **Default**: React Server Components (RSC); use `"use client"` only when needed

## Structure

```
app/
├── layout.tsx          # Root layout (fonts, providers, theme)
├── providers.tsx       # Client-side providers (React Query)
├── globals.css         # Tailwind + CSS variables
├── page.tsx            # Landing page (/)
├── not-found.tsx       # 404 page
├── generate/page.tsx   # Paper generation form (/generate)
├── home/page.tsx       # Dashboard (/home)
├── paper/[id]/page.tsx # Paper detail (/paper/:id)
├── solution/[id]/...   # Solution detail (/solution/:id)
├── shared/[token]/...  # Shared views (/shared/:token)
├── signin/page.tsx     # Auth page (/signin)
├── legal/page.tsx      # Legal page (/legal)
└── api/                # API routes
    ├── auth/[...all]/  # Better-Auth catch-all
    ├── papers/         # Papers CRUD + generate + regenerate
    ├── solutions/      # Solutions CRUD
    ├── share/          # Share links CRUD
    ├── files/          # File upload/cleanup
    └── preferences/    # User preferences
```

## Patterns & Conventions

### Page Components

✅ **DO**: RSC by default, fetch data at page level

```tsx
// app/paper/[id]/page.tsx - Server component pattern
export default async function PaperPage({
  params,
}: {
  params: { id: string };
}) {
  const paper = await fetchPaper(params.id);
  return <PaperDetail paper={paper} />;
}
```

✅ **DO**: Use `"use client"` only for interactivity (see `app/home/page.tsx`)

❌ **DON'T**: Make pages client components unnecessarily

### API Route Pattern

All API routes follow this structure (see `app/api/papers/route.ts`):

```tsx
import {
  withAuth,
  withRateLimit,
  createErrorResponse,
} from "@/lib/api-middleware";
import { RATE_LIMIT_ENDPOINTS } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // 1. Auth check
  const authResult = await withAuth(request);
  if (!authResult.success) return authResult.response;

  // 2. Rate limit check
  const rateLimitResult = await withRateLimit(
    request,
    authResult.userId,
    RATE_LIMIT_ENDPOINTS.PAPERS,
  );
  if (!rateLimitResult.success) return rateLimitResult.response;

  // 3. Business logic in try/catch
  try {
    const data = await prisma.model.findMany({
      where: { userId: authResult.userId },
    });
    return NextResponse.json({ data });
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch data");
  }
}
```

✅ **DO**: Always use `withAuth` + `withRateLimit` for protected routes
✅ **DO**: Use `createErrorResponse` for consistent error handling
✅ **DO**: Transform DB enums to lowercase in responses (`transformStatus`)

❌ **DON'T**: Return raw Prisma errors to client
❌ **DON'T**: Skip rate limiting for mutation endpoints

### Layout & Providers

```tsx
// Root layout structure (app/layout.tsx)
<html>
  <body>
    <Providers>
      {" "}
      {/* React Query */}
      <ThemeProvider>
        {" "}
        {/* next-themes, dark default */}
        {children}
        <Toaster /> {/* sonner */}
      </ThemeProvider>
    </Providers>
    <Analytics /> {/* Vercel analytics */}
  </body>
</html>
```

### Dynamic Routes

- `[id]` folder pattern for dynamic segments
- Access via `params` prop in page component
- For catch-all: `[...all]` (used for Better-Auth)

## Touch Points / Key Files

| File                           | Purpose                                   |
| ------------------------------ | ----------------------------------------- |
| `layout.tsx`                   | Root layout, fonts, providers             |
| `providers.tsx`                | React Query client setup                  |
| `globals.css`                  | CSS variables, Tailwind config            |
| `api/papers/generate/route.ts` | AI generation endpoint (complex)          |
| `api/papers/route.ts`          | Papers CRUD (reference pattern)           |
| `home/page.tsx`                | Main dashboard (client component example) |

## JIT Index Hints

```bash
# Find all API route handlers
rg -n "export async function (GET|POST|PUT|DELETE|PATCH)" app/api/

# Find pages with client directive
rg -l '"use client"' app/

# Find pages with metadata export
rg -n "export const metadata" app/

# Find dynamic route pages
find app -name "page.tsx" -path "*\[*\]*"

# Find loading/error boundaries
find app -name "loading.tsx" -o -name "error.tsx"
```

## Common Gotchas

1. **Auth in API routes**: Always `await headers()` when using `auth.api.getSession`
2. **File uploads**: Use Gemini File API, cleanup after generation
3. **Rate limits**: Different limits per endpoint (see `lib/rate-limit.ts`)
4. **Status enums**: DB uses `UPPERCASE`, API returns `lowercase`

## Pre-PR Checks

```bash
nubx tsc --noEmit && nub run lint && nub run build
```
