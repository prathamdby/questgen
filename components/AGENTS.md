# components/AGENTS.md

React components organized by feature area.

## Package Identity

- **Purpose**: Reusable UI components
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york style)

## Structure

```
components/
├── ui/              # shadcn/ui primitives (auto-generated)
│   ├── dialog.tsx
│   ├── skeleton.tsx
│   ├── sonner.tsx
│   ├── switch.tsx
│   └── tabs.tsx
├── shared/          # Cross-feature components
│   ├── ConfirmDialog.tsx
│   ├── FileIcon.tsx
│   └── StatusBadge.tsx
├── landing/         # Landing page components
│   ├── HeroSection.tsx
│   ├── LandingHeader.tsx
│   └── LandingFooter.tsx
├── home/            # Dashboard components
│   ├── PaperCard.tsx
│   ├── PaperListItem.tsx
│   ├── SearchBar.tsx
│   └── ...
├── generate/        # Paper generation form
│   ├── FileUploadZone.tsx
│   ├── FormField.tsx
│   └── ...
└── paper/           # Paper detail page
    ├── MarkdownPreview.tsx
    ├── MetadataGrid.tsx
    └── ...
```

## Patterns & Conventions

### Component Structure

✅ **DO**: Follow this pattern (see `components/home/PaperCard.tsx`):

```tsx
"use client";

import React from "react";

interface ComponentNameProps {
  // Props interface above component
}

export const ComponentName = React.memo(
  function ComponentName({ prop1, prop2 }: ComponentNameProps) {
    return (/* JSX */);
  },
  // Custom comparison for memoization (when needed)
  (prevProps, nextProps) => {
    return prevProps.id === nextProps.id && ...;
  }
);
```

✅ **DO**: Use named function inside memo for better debugging
✅ **DO**: Export as named export (not default)
✅ **DO**: Custom memo comparison when component has many props

❌ **DON'T**: Use class components
❌ **DON'T**: Default export components

### Styling Patterns

Follow `DESIGN_SYSTEM.md` strictly. Key patterns:

```tsx
// Card pattern (from PaperCard.tsx)
className="group block w-full rounded-[8px] border border-[#e5e5e5] bg-white p-5 
  transition-all duration-150 hover:border-[#d4d4d4] hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] 
  dark:border-[#262626] dark:bg-[#0a0a0a] dark:hover:border-[#404040]"

// Button pattern
className="h-[44px] px-6 rounded-[6px] bg-[#171717] text-white 
  hover:bg-[#404040] active:scale-[0.98] 
  dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5]"

// Typography
className="text-[16px] font-[500] leading-[1.3] text-[#171717] dark:text-white"
```

✅ **DO**: Use pixel values for font sizes (`text-[16px]`)
✅ **DO**: Use OKLCH/hex values from design system
✅ **DO**: Include dark mode variants
✅ **DO**: Use `transition-all duration-150` for hover states

❌ **DON'T**: Use Tailwind's default shadow utilities
❌ **DON'T**: Use scale transforms > 2% (only `scale-[0.98]` on active)
❌ **DON'T**: Add decorative colors (purple, teal, bright blue)

### Icon Usage

```tsx
import { IconName } from "lucide-react";

<IconName 
  className="h-4 w-4 flex-shrink-0" 
  aria-hidden="true" 
/>
```

Always include `aria-hidden="true"` for decorative icons.

### Event Handling

✅ **DO**: Prevent event bubbling when needed (see `PaperCard.tsx`):

```tsx
onClick={(e) => {
  const target = e.target as HTMLElement;
  if (target.closest("[data-menu-container]")) {
    e.preventDefault();
  }
}}
```

### UI Components (shadcn/ui)

Located in `components/ui/`. These are auto-generated—avoid manual edits.

To add new shadcn components:

```bash
bunx shadcn@latest add <component-name>
```

Installed: `dialog`, `skeleton`, `sonner`, `switch`, `tabs`

## Touch Points / Key Files

| File | Purpose | Pattern Reference |
|------|---------|-------------------|
| `home/PaperCard.tsx` | Card with menu, memoization | Primary card pattern |
| `generate/FileUploadZone.tsx` | Drag-drop upload | Form input pattern |
| `shared/ConfirmDialog.tsx` | Modal dialog | Dialog pattern |
| `shared/StatusBadge.tsx` | Status indicator | Badge pattern |
| `landing/HeroSection.tsx` | Hero section | Typography at scale |

## JIT Index Hints

```bash
# Find all client components
rg -l '"use client"' components/

# Find memoized components
rg -n "React\.memo" components/

# Find components using a specific hook
rg -n "useCallback|useMemo|useRef" components/

# Find components by feature area
ls components/home/
ls components/generate/

# Find icon usage
rg -n "lucide-react" components/
```

## Common Gotchas

1. **Memoization**: Use custom comparison when props include objects/callbacks
2. **Refs for menus**: Use callback refs for dynamic ref maps (see `PaperCard.tsx`)
3. **Link clicks**: Prevent navigation when clicking nested interactive elements
4. **Dark mode**: Always include `dark:` variants for colors

## Pre-PR Checks

```bash
# Type check components
bunx tsc --noEmit

# Check for unused exports
bunx knip --include exports --include files components/
```

