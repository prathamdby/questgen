# lib/AGENTS.md

Utilities, configurations, and business logic.

## Package Identity

- **Purpose**: Shared logic, API clients, utilities
- **Scope**: Server + client code (be mindful of `"use client"` needs)

## Structure

```
lib/
├── auth.ts           # Better-Auth server config
├── auth-client.ts    # Better-Auth client (signIn, signOut, useSession)
├── prisma.ts         # Prisma client singleton
├── ai.ts             # Google Gemini client config
├── ai-prompts.ts     # System prompts for AI generation
├── ai-retry.ts       # AI generation retry logic
├── ai-utils.ts       # AI helper functions (file cleanup, error parsing)
├── api-middleware.ts # withAuth, withRateLimit helpers
├── rate-limit.ts     # Rate limiting config and implementation
├── queries/          # React Query hooks
│   ├── papers.ts     # usePapers, usePaper, mutations
│   └── types.ts      # Shared TypeScript types
├── transformers.ts   # Data transformations (status enums)
├── format-utils.ts   # Date/number formatting
├── file-types.ts     # File type constants
├── pattern-presets.ts      # Paper pattern presets
├── past-paper-strategies.ts # Generation strategies
├── pdf-export-client.ts    # Client-side PDF export
├── utils.ts          # cn() helper (clsx + tailwind-merge)
└── dotenv.ts         # Environment loading
```

## Patterns & Conventions

### Prisma Client Singleton

```tsx
// lib/prisma.ts - The only way to access Prisma
import { prisma } from "@/lib/prisma";

// ✅ DO: Import from lib/prisma
const users = await prisma.user.findMany();

// ❌ DON'T: Create new PrismaClient instances
```

### Auth Patterns

**Server-side** (API routes, RSC):

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers(),
});
```

**Client-side** (components):

```tsx
import { useSession, signIn, signOut } from "@/lib/auth-client";

const { data: session, isPending } = useSession();
```

### React Query Hooks

All data fetching hooks are in `lib/queries/` (see `papers.ts`):

```tsx
// Hook pattern
export function usePapers(): UseQueryResult<PapersData, Error> {
  const { data: session } = useSession();

  return useQuery<PapersData, Error>({
    queryKey: ["papers"],
    queryFn: async () => {
      const res = await fetch("/api/papers");
      if (!res.ok) throw new Error("Failed to fetch papers");
      return res.json();
    },
    enabled: !!session,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
}
```

✅ **DO**: Gate queries with `enabled: !!session`
✅ **DO**: Set appropriate `staleTime` and `gcTime`
✅ **DO**: Use optimistic updates for mutations (see `useDeletePaper`)

### Mutation with Optimistic Updates

Pattern from `papers.ts`:

```tsx
export function useDeletePaper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paperId: string) => {
      const res = await fetch(`/api/papers/${paperId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete paper");
      return { paperId };
    },

    onMutate: async (paperId) => {
      // 1. Show loading toast
      const loadingToastId = toast.loading("Deleting paper...");

      // 2. Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: ["papers"] });

      // 3. Snapshot previous data
      const previousPapers = queryClient.getQueryData<PapersData>(["papers"]);

      // 4. Optimistically update cache
      queryClient.setQueryData<PapersData>(["papers"], (old) => {
        if (!old) return old;
        return {
          ...old,
          papers: old.papers.filter((p) => p.id !== paperId),
        };
      });

      return { previousPapers, loadingToastId };
    },

    onSuccess: (data, paperId, context) => {
      toast.dismiss(context?.loadingToastId);
      queryClient.invalidateQueries({ queryKey: ["papers"] });
      toast.success("Paper deleted");
    },

    onError: (error, paperId, context) => {
      toast.dismiss(context?.loadingToastId);
      // Rollback on error
      if (context?.previousPapers) {
        queryClient.setQueryData(["papers"], context.previousPapers);
      }
      toast.error("Failed to delete paper");
    },
  });
}
```

### API Middleware

```tsx
// lib/api-middleware.ts exports:
import {
  withAuth,
  withRateLimit,
  createErrorResponse,
} from "@/lib/api-middleware";

// Usage in API routes (see app/api/papers/route.ts)
```

### AI Generation

```tsx
import { ai, DEFAULT_MODEL, DEFAULT_GENERATION_CONFIG } from "@/lib/ai";
import { buildSystemPrompt, buildSolutionSystemPrompt } from "@/lib/ai-prompts";
import { cleanMarkdownContent } from "@/lib/transformers";
import { deleteGeminiFiles, parseGeminiError } from "@/lib/ai-utils";
```

✅ **DO**: Use `DEFAULT_MODEL` and `DEFAULT_GENERATION_CONFIG`
✅ **DO**: Clean responses with `cleanMarkdownContent`
✅ **DO**: Always cleanup uploaded files with `deleteGeminiFiles`

### Utility Functions

```tsx
// lib/utils.ts - Tailwind class merging
import { cn } from "@/lib/utils";

className={cn("base-class", conditional && "conditional-class")}

// lib/transformers.ts - Data transformations
import { transformStatus, cleanMarkdownContent } from "@/lib/transformers";

// lib/format-utils.ts - Formatting
import { formatDateShort } from "@/lib/format-utils";
```

## Touch Points / Key Files

| File                | Purpose             | When to Edit                |
| ------------------- | ------------------- | --------------------------- |
| `prisma.ts`         | DB client singleton | Never (stable)              |
| `auth.ts`           | Auth config         | Adding providers            |
| `auth-client.ts`    | Client auth hooks   | Never (stable)              |
| `ai.ts`             | AI client config    | Changing model/config       |
| `ai-prompts.ts`     | System prompts      | Tuning generation           |
| `queries/papers.ts` | Data fetching       | Adding paper features       |
| `queries/types.ts`  | TypeScript types    | Adding/changing data shapes |
| `api-middleware.ts` | Route middleware    | Adding middleware           |
| `rate-limit.ts`     | Rate limiting       | Adjusting limits            |

## JIT Index Hints

```bash
# Find all exported functions
rg -n "export (const|function|async function)" lib/

# Find React Query hooks
rg -n "export function use" lib/queries/

# Find where a lib function is imported
rg -n "from ['\"]@/lib/filename" app/ components/

# Find environment variable usage
rg -n "process\.env\." lib/

# Find Prisma operations
rg -n "prisma\." lib/
```

## Common Gotchas

1. **Client vs Server**: `auth-client.ts` is client-only; `auth.ts` is server-only
2. **Prisma singleton**: Always import from `@/lib/prisma`, never instantiate
3. **Query keys**: Keep consistent (e.g., `["papers"]`, `["paper", id]`)
4. **Status enums**: DB uses `UPPERCASE`, transform to `lowercase` for API
5. **File cleanup**: Always call `deleteGeminiFiles` after AI generation

## Pre-PR Checks

```bash
# Type check lib
bunx tsc --noEmit

# Check for circular dependencies
bunx madge --circular lib/
```
