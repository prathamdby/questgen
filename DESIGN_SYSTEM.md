# QuestGen Design System Skill

## Purpose

Guide Claude to generate frontend designs that align with QuestGen's refined, professional aesthetic—avoiding flashy AI-generated patterns while maintaining the sophisticated minimalism that defines the brand.

## Design Philosophy

**Visual Identity**: QuestGen embodies an **Apple-esque look and feel**, seamlessly integrated with **Vercel's design language** (https://vercel.com/design/guidelines). This means:

- **Apple influence**: Refined minimalism, invisible complexity, extreme attention to detail, subtle shadows, premium feel through restraint
- **Vercel influence**: Geist typography, monochrome palette with purposeful accents, precise spacing, dark-mode first, performance-obsessed
- **Synthesis**: Professional confidence through simplicity, not decoration. Every pixel serves a purpose.

Think: SF Pro-like precision meets Next.js aesthetic. Quiet sophistication over loud statements.

## Core Problem

During generation, you tend to default to visually loud patterns: heavy shadows, bold gradients, bright accent colors, ornate animations. QuestGen's design language is the opposite: **refined restraint**. Heavy shadows become `0.04` opacity. Bold borders become `#e5e5e5`. Flashy animations become subtle `cubic-bezier` transitions. Users expect polish, not noise.

## Design Principles

### Color System: OKLCH Precision

QuestGen uses **OKLCH color space** for perceptual uniformity and precise dark mode translation.

**Never use:**

- RGB/Hex without OKLCH conversion
- Vibrant gradients or rainbow palettes
- Heavy saturation (chroma > 0.25 except for semantic colors)
- Generic Tailwind colors without customization
- Bright accent colors for decoration

**Required patterns:**

```css
/* Light mode base */
--background: oklch(1 0 0); /* Pure white */
--foreground: oklch(0.145 0 0); /* Near-black #171717 */
--border: oklch(0.922 0 0); /* Light gray #e5e5e5 */
--muted: oklch(0.97 0 0); /* Off-white */

/* Dark mode base */
--background: oklch(0.145 0 0); /* Dark charcoal */
--foreground: oklch(0.985 0 0); /* Off-white */
--border: oklch(1 0 0 / 10%); /* Transparent white */
```

**Color philosophy:**

- Monochrome dominates: Black, white, grays
- Semantic colors only: Green (success), yellow (warning), red (danger)
- No decorative colors: No purple, no teal, no bright blue
- Purposeful contrast: WCAG AA minimum (4.5:1 for text)

**Implementation guidelines:**

- Use CSS variables exclusively (never hardcode colors)
- Dark mode via class strategy (`.dark` on `<html>`)
- Default theme: **Dark** (explicit, no system detection)
- Border colors: Subtle, never bold (`#e5e5e5` light, `oklch(1 0 0 / 10%)` dark)

### Typography: Geist Family Precision

QuestGen uses **Geist** (Vercel's typeface) for modern geometric clarity.

**Never use:**

- Inter, Roboto, Open Sans, System fonts
- Multiple font families (no pairing)
- Generic sans-serif as fallback without loading Geist
- Decorative or script fonts

**Required fonts:**

```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });
```

**Type scale (pixel-based precision):**

```css
Display/Hero:     96px (font-650)   /* Landing hero only */
Section titles:   56-72px (font-650) /* Major headings */
Card titles:      16px (font-500)   /* Paper cards, features */
Dialog headers:   17px (font-500)   /* Modal titles */
Body text:        15-17px (regular) /* Main content */
Labels:           13-14px (regular) /* Form labels, metadata */
Fine print:       11-12px (regular) /* Status badges, timestamps */
```

**Letter spacing strategy:**

- Hero titles: `tracking-[-0.04em]` (tight, sophisticated)
- Headings: `tracking-[-0.01em]` (subtle tightness)
- Body: `tracking-normal`
- Uppercase labels: `tracking-[0.18em]` (airy spacing)

**Line heights:**

- Headings: `leading-[1.05]` to `leading-[1.1]` (tight for impact)
- Body: `leading-[1.5]` to `leading-[1.6]` (generous readability)
- Small text: `leading-[1.45]` (balanced density)

**Weight strategy:**

- 500 (medium): Interactive elements, small headings
- 600 (semibold): Card titles, feature names
- 650 (custom): Landing page headers only
- **Never use:** 700, 800, 900 (too heavy for Geist)

### Shadows: Extreme Minimalism

QuestGen's signature is **almost invisible shadows**.

**Never use:**

- Tailwind's default shadow utilities (`shadow-sm`, `shadow-md`, etc.)
- Heavy drop shadows (opacity > 0.1)
- Colored shadows
- Multiple shadow layers

**Required shadow patterns:**

```css
/* Card hover (the only shadow in the system) */
hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)]

/* Dark mode cards (slightly stronger) */
.dark hover:shadow-[0_2px_6px_rgba(0,0,0,0.4)]

/* That's it. No other shadows. */
```

**Shadow philosophy:**

- Light mode: Opacity `0.04` (barely perceptible)
- Dark mode: Opacity `0.4` (needed for depth)
- Only on hover states (never static)
- Elevation through borders, not shadows

### Borders: Subtle Separation

Borders define structure without visual weight.

**Border patterns:**

```css
/* Light mode */
border-[#e5e5e5]              /* Standard border */
hover:border-[#d4d4d4]        /* Hover state (slightly darker) */

/* Dark mode */
border-[#333333]              /* Standard border */
border-[oklch(1 0 0 / 10%)]   /* Transparent white (preferred) */
```

**Border radius scale:**

```css
rounded-[6px]   /* Buttons, inputs, small cards */
rounded-[8px]   /* Standard cards, panels */
rounded-[10px]  /* Large sections, default radius */
rounded-[12px]  /* Feature sections */
rounded-[16px]  /* Large modals, hero sections */
```

**Border philosophy:**

- Never use `border-2` or thicker (always `border` = 1px)
- Subtle color shifts on hover (not bold changes)
- Consistent radius across component families

### Motion: Refined Transitions

QuestGen favors **subtle, spring-like animations** over flashy effects.

**Never use:**

- Linear easing (`ease-linear`)
- Long durations (> 300ms)
- Scale transforms > 2% (`scale-105`, `scale-110`)
- Rotation or skew (too playful)
- Bounce or elastic easings

**Required animation patterns:**

```css
/* Standard transitions */
transition-all duration-150
transition-all duration-200

/* Spring-like easing (signature) */
cubic-bezier(0.16, 1, 0.3, 1)

/* Hover scale (subtle compression) */
active:scale-[0.98]

/* Dialog animations */
scale-[0.96] → scale-100
opacity-0 → opacity-100
duration-200
```

**Motion guidelines:**

- Hover states: Background color shifts only (no scale, no shadow jumps)
- Active states: `scale-[0.98]` (2% compression, never expansion)
- Dialogs: Scale + opacity (0.96 → 1.0) with cubic-bezier
- Loading: Spinner only (`animate-spin`), no pulsing or bouncing
- Focus rings: Instant (no transition)

**What to avoid:**

- Staggered reveals on page load
- Parallax scrolling
- Auto-playing animations
- Gradient shifts on hover
- Morphing shapes

### Backgrounds: Atmospheric Subtlety

Backgrounds create depth through gradients, not patterns.

**Approved patterns:**

```css
/* Landing page gradient (signature) */
Two large radial gradients with low opacity:
- Top-left: Muted color at 60% opacity
- Bottom-right: Complementary color at 60% opacity
- Result: Subtle atmospheric depth

/* Metadata panels */
bg-[#fafafa] light / bg-[#1a1a1a] dark
(Subtle off-white/off-black, not pure)

/* Section backgrounds */
bg-white / bg-[#171717]
(Pure colors for main content)
```

**Never use:**

- Geometric patterns (dots, grids, waves)
- Mesh gradients or complex gradients
- Animated backgrounds
- Glassmorphism or backdrop blur (except dialog overlays)
- Noise textures
- Images as backgrounds (except content images)

**Background philosophy:**

- Minimize visual noise
- Gradients for landing page atmosphere only
- Solid colors for content areas
- Subtle off-white/off-black for secondary panels

### Component Patterns: Refined Consistency

**Card design (signature):**

```tsx
className="group block w-full rounded-[8px]
  border border-[#e5e5e5]
  bg-white p-5
  transition-all duration-150
  hover:border-[#d4d4d4]
  hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)]
  dark:border-[#333333]
  dark:bg-[#1a1a1a]"
```

**Button design:**

```tsx
/* Primary */
className="h-[44px] px-6 rounded-[6px]
  bg-[#171717] text-white
  hover:bg-[#404040]
  active:scale-[0.98]
  focus:ring-2 focus:ring-[#171717] focus:ring-offset-2
  dark:bg-white dark:text-[#171717] dark:hover:bg-[#e5e5e5]"

/* Secondary */
className="h-[44px] px-6 rounded-[6px]
  border border-[#e5e5e5] bg-white text-[#171717]
  hover:border-[#d4d4d4] hover:bg-[#fafafa]
  dark:border-[#333333] dark:bg-[#171717]"
```

**Switch design (Apple-inspired):**

```tsx
Track: h-[24px] w-[44px]
Thumb: h-[20px] w-[20px]
Shadow: shadow-[0_1px_2px_rgba(0,0,0,0.15)]
Checked: bg-[#171717] dark:bg-white
Unchecked: bg-[#e5e5e5] dark:bg-[#333333]
```

**Form input design:**

```tsx
className="h-[44px] px-3 rounded-[6px]
  border border-[#e5e5e5]
  focus:border-[#171717]
  focus:ring-1 focus:ring-[#171717]
  dark:border-[#333333]
  dark:focus:border-white"
```

## Anti-Convergence Directives

Even with explicit instructions, you may converge toward flashy AI patterns. **Actively resist this:**

- If you notice yourself adding `shadow-lg` or `shadow-xl`, **stop and use the 0.04 opacity pattern**
- If you reach for colored accents (purple, teal, blue), **stop and use monochrome + semantic colors only**
- If you add scale-up hover effects (`scale-105`), **stop and use compression (`scale-[0.98]`) on active only**
- If you create complex gradients, **stop and use solid colors or simple two-color radial gradients**
- If you add staggered animations, **stop and use simple transitions only**
- Challenge yourself: "Is this refined or flashy?" If flashy, simplify.

## Quality Checklist

Before finalizing any QuestGen design, verify:

- [ ] **Colors**: Using OKLCH via CSS variables, monochrome dominant
- [ ] **Typography**: Geist font family, pixel-based sizing, tight leading for headings
- [ ] **Shadows**: Only `0.04` opacity on hover (or none)
- [ ] **Borders**: `#e5e5e5` / `#333333`, never bold (1px only)
- [ ] **Animations**: Cubic-bezier easing, 150-200ms duration, subtle scale compression
- [ ] **Backgrounds**: Solid colors or simple gradients, no patterns
- [ ] **Components**: Following established patterns (card, button, switch, input)
- [ ] **Accessibility**: WCAG AA contrast (4.5:1), keyboard navigation, ARIA labels
- [ ] **Dark mode**: Explicit dark variants for all colors
- [ ] **Refinement**: Looks professional, not flashy

## Context-Specific Adaptation

Interpret these guidelines through QuestGen page types:

### Landing Page

- **Typography**: Hero at 96px with `tracking-[-0.04em]`
- **Background**: Two-gradient atmospheric effect
- **Sections**: Features (3×2 grid), Workflow (2-col), Trust metrics (3 stats)
- **Motion**: Subtle transitions only (no staggered reveals)
- **CTA**: Primary dark button (black bg, white text)

### Home (Papers Dashboard)

- **Layout**: Search bar + view toggle + grid/list
- **Cards**: Standard card pattern with hover states
- **Empty states**: Large icon + CTA button
- **Loading**: Skeleton loaders matching card layout
- **Actions**: Icon buttons with subtle hover states

### Generate Page (Form)

- **Layout**: Sequential vertical flow
- **File upload**: Dashed border zone with drag-drop
- **Inputs**: 44px height, consistent border treatment
- **Pattern presets**: Expandable radio group
- **CTA**: Full-width mobile, fixed-width desktop

### Paper Detail Page

- **Layout**: Breadcrumb → metadata grid → actions → content
- **Metadata**: 3-column grid with icons
- **Actions**: Primary + secondary + destructive buttons
- **Regeneration**: Collapsible panel with textarea
- **Content**: Markdown preview with typography scale

### Sign In Page

- **Layout**: Centered card (max-w-md)
- **Minimal**: No decorative elements
- **OAuth**: Google button with logo
- **Trust**: Terms + privacy links below

## Implementation Notes

### CSS Structure

```css
/* 1. CSS Variables (always first) */
:root {
  --background: ...;
}
.dark {
  --background: ...;
}

/* 2. Reset/Base */
* {
  box-sizing: border-box;
}

/* 3. Typography */
body {
  font-family: var(--font-geist-sans);
}

/* 4. Components */
.card {
  ...;
}
.button {
  ...;
}
```

### Tailwind Configuration

```javascript
// Always customize Tailwind config
theme: {
  extend: {
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      // ... all OKLCH variables
    },
    borderRadius: {
      DEFAULT: "10px",
      sm: "6px",
      md: "8px",
      lg: "10px",
      xl: "14px",
    },
  },
}
```

### Dark Mode Setup

```tsx
// ThemeProvider config
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem={false}
  disableTransitionOnChange
>
```

### Accessibility Requirements

- All interactive elements: 44px minimum touch target
- Focus rings: `ring-2 ring-offset-2` (always visible)
- ARIA labels: On icon buttons, dialogs, switches
- Keyboard navigation: Tab order, Enter/Space activation
- Color contrast: WCAG AA (4.5:1 text, 3:1 UI components)

### Performance Optimization

- Memoize expensive components (cards, lists)
- Use CSS-only animations (no JS unless necessary)
- Skeleton loaders for perceived performance
- Lazy load images (Next.js Image component)
- Conditional rendering (dialogs, modals)

## Remember

**Visual Identity**: This project must embody an **Apple-esque look and feel**, seamlessly integrated with **Vercel's design language** (https://vercel.com/design/guidelines). Every design decision should pass this test: "Would this look at home on Apple.com or Vercel.com?"

QuestGen's design language is **refined restraint**. Every shadow, border, animation, and color is intentionally minimal. This skill exists to maintain that consistency—avoiding the flashy patterns that AI generation naturally gravitates toward.

The design is sophisticated because of what it **doesn't include**:

- No heavy shadows (Apple: barely-there, Vercel: minimal)
- No bright accent colors (Apple: monochrome + product colors, Vercel: black/white dominant)
- No complex animations (Apple: purposeful motion, Vercel: instant feedback)
- No decorative patterns (Apple: content-first, Vercel: clean backgrounds)
- No visual noise (Apple: breathing room, Vercel: generous whitespace)

When in doubt, simplify. When tempted to add polish, subtract instead. The result should feel professional, trustworthy, and quietly confident—never loud or attention-seeking.

**Core mantra**: "Refined, not flashy. Minimal, not boring. Professional, not corporate."

**Inspiration checklist**:

- [ ] Would Apple ship this? (Premium restraint, invisible complexity)
- [ ] Would Vercel ship this? (Dark-mode polish, Geist typography, performance)
- [ ] Does it feel timeless, not trendy?
- [ ] Is every element necessary, or am I adding decoration?
