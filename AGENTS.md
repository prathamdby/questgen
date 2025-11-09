## Critical Rules for AI Agents Working on This Codebase

### Design Requirements

- **CRITICAL DESIGN REQUIREMENT:** All visual elements, components, and UI implementations in this project MUST strictly adhere to:
  1. **Apple-esque Design Principles:** Clean, minimalist aesthetics with careful attention to spacing, typography, and subtle animations
  2. **Vercel Design System:** Follow Vercel's official design guidelines at https://vercel.com/design/guidelines

  This is a non-negotiable requirement. Every UI change must be evaluated against these design standards before implementation.

### Technology Stack & Conventions

- **Framework**: Next.js 16 with App Router, React 19, TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4 with custom theme configuration (`globals.css`)
- **Component Library**: shadcn/ui components (always import from `@/components/ui/`)
- **Icons**: Use `lucide-react` for all icon needs
- **Fonts**: Geist Sans (default) and Geist Mono via Next.js Google Fonts
- **Theme**: Dark theme by default with `next-themes` provider (no transition on change)
- **Notifications**: Use `sonner` for toasts (component at `@/components/ui/sonner`)

### Project Structure

- **Pages**: `/app` directory (App Router)
  - `/signin` - OAuth initiation (OpenRouter/Google)
  - `/auth/[provider]/callback` - OAuth callback handler
  - `/home` - Dashboard with localStorage-backed paper management (card/list views)
  - `/generate` - Paper creation form with file uploads and pattern presets
  - `/paper/[id]` - Paper preview, regeneration, export, deletion
- **Components**: Organized in `/components` by feature area (`shared/`, `ui/`, `home/`, `paper/`, `generate/`)
  - Always use functional components with `"use client"` directive when client-side state/interactivity needed
  - Follow single responsibility principle - one component per feature
  - Use TypeScript interfaces for props at the top of component files
- **Domain Logic**: `/lib` directory
  - `auth.ts` - Better Auth configuration with rate limiting per endpoint
  - `pdf-export-client.ts` - Client-side PDF export (uses marked + Puppeteer)
  - `pattern-presets.ts` - Predefined paper templates
  - `file-types.ts` - MIME type validation and file category utilities
  - All utilities should be typed and exported consistently

### Database & Backend

- **ORM**: Prisma with PostgreSQL
- **Auth**: Better Auth with Google OAuth (PKCE flow for `/signin`)
- **API Routes**: Strict rate limiting
  - Paper generation: 2 papers per minute
  - Paper regeneration: 2 requests per minute
  - Default: 100 requests per minute
- **AI Integration**: Google Gemini API via `@google/genai`

### Code Style & Naming

- Use `camelCase` for variables, functions, and component props
- Use `PascalCase` for components and classes
- Use `UPPER_SNAKE_CASE` for constants
- Always add JSDoc comments for exported functions and complex logic
- Use explicit return types for functions (no implicit `any`)
- Prefer `const` over `let`, avoid `var`
- Use arrow functions as default

### File Handling

- Supported file types defined in `lib/file-types.ts`
  - Images: JPEG, PNG, GIF, WebP
  - Documents: PDF, TXT, DOC, DOCX, XLS, XLSX
  - Use `getAcceptedFileTypesArray()` for HTML input accept attributes
  - Always validate MIME types using `isSupportedMimeType()`

### Component Styling Patterns

- Use Tailwind classes for all styling (no CSS modules or inline styles unless necessary)
- For dynamic color states (like status badges), use color mappings with explicit Tailwind classes:
  ```
  case "completed":
    return "bg-[#f0fdf4] text-[#15803d] dark:bg-[#052e16] dark:text-[#86efac]";
  ```
- Include both light and dark theme variants using `dark:` prefix
- Use `tracking-[-0.01em]` for tight letter-spacing (Apple-style)
- Keep border-radius consistent: use `rounded-[6px]` or Tailwind defaults

### Error Handling & UX

- Always provide meaningful error messages to users via toast notifications
- Use empty states with proper messaging and iconography for no-data scenarios
- Loading states should use skeleton components (`components/ui/skeleton.tsx`)
- Never leave users without feedback during async operations

### Import Organization

- Imports grouped: React/Next.js → External libraries → Internal components → Internal utilities
- Use absolute imports with `@/` alias (configured in `tsconfig.json`)
- Import types explicitly: `import type { SomeType } from "..."`

### Performance & Best Practices

- Use React 19 features: Server Components by default, minimal client state
- Leverage Next.js image optimization for all images
- Implement pagination/virtualization for large lists
- Use `Readonly` for layout props in server components
- Add `suppressHydrationWarning` to elements with theme-dependent rendering
- Prefer lazy loading for heavy features
