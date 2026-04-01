# Design System — Guide for AI Agents

> Follow these rules when building UI. The goal is Claude-level polish: minimal, precise, intentional.
> If something looks "designed," you've gone too far. The best design is invisible.

## Principles

1. **Less is more.** Remove before you add. White space is a feature. If you're unsure whether to add something, don't.
2. **No decoration.** Every element serves a purpose. No gradients, no ornamental borders, no shadows unless conveying elevation. No emoji in UI.
3. **Typography does the work.** Size, weight, and color establish hierarchy — not boxes, borders, or backgrounds.
4. **Consistency is quality.** Use the design tokens. Don't invent new values. Every pixel should be intentional.
5. **Dark theme is default.** Near-black backgrounds, subtle surfaces, light text. Never bright colors except for accents.

## Visual Quality Bar

Study these apps before building anything:
- **Claude (claude.ai)** — the gold standard. Minimal, text-driven, generous spacing, zero clutter
- **Linear (linear.app)** — dark theme, sharp typography, efficient layout, no wasted space
- **Vercel (vercel.com/dashboard)** — black/white, bold headlines, clean cards, data-driven

What these apps have in common:
- No borders on most cards — they use subtle background color shifts
- Generous padding (24-48px)
- Very few colors — mostly grays with one accent
- Text hierarchy through size and weight, not color
- Empty states that are helpful, not decorative
- Loading states that match the layout (skeletons, not spinners)

## Components

Always use components from `../components/`. Never use raw React Native primitives for UI:
- `<Text variant="hero|h1|h2|h3|body|bodyMedium|caption|label">` — never use raw `<Text>` from react-native
- `<Button variant="primary|secondary|ghost" size="sm|md|lg">` — never build custom pressables
- `<Input label="..." error="...">` — all text inputs, with labels and focus states
- `<Card variant="default|raised|ghost">` — content containers
- `<Container safeTop padded centered maxWidth={600}>` — page wrapper
- `<Divider>` — section separator
- `<Skeleton>` — loading states (use these, not ActivityIndicator)

## Spacing

Import `spacing` from `../constants/theme`. Use these values exclusively:
- `xs: 4` `sm: 8` `md: 12` `lg: 16` `xl: 20` `2xl: 24` `3xl: 32` `4xl: 40` `5xl: 48` `6xl: 64`
- **Never use arbitrary numbers** like 10, 18, 22, 30. Snap to the scale.
- Section gaps: `spacing['3xl']` (32) or `spacing['4xl']` (40) between major sections
- Card internal padding: `spacing['2xl']` (24)
- Tight spacing inside cards: `spacing.sm` (8) or `spacing.md` (12)

## Colors

Import `colors` from `../constants/theme`. Key rules:
- Background: `colors.bg` (#09090b) — almost black, not pure black
- Cards/surfaces: `colors.surface` — one step lighter than bg
- Raised surfaces: `colors.surfaceRaised` — for cards that need to pop
- Text: `colors.text` (primary) → `colors.textSecondary` (descriptions) → `colors.textMuted` (metadata, timestamps)
- Borders: `colors.borderSubtle` for light separation, `colors.border` for emphasis
- Accent: `colors.accent` (#e4e4e7) for primary buttons — light on dark, not colored
- **Never use white (#fff) for backgrounds**
- **Never use pure black (#000) for text**
- **Never use bright colors** unless it's a semantic color (success green, error red)

## Typography Rules

- Hero/page titles: `variant="hero"` — 36px, bold, tight letter-spacing (-0.8)
- Page headings: `variant="h1"` — 28px, bold
- Section headers: `variant="h2"` or `variant="h3"` — 22px or 18px, semibold
- Body text: `variant="body"` — 15px, regular, comfortable line height (22px)
- Labels and metadata: `variant="caption"` (13px) or `variant="label"` (13px, medium weight)
- **Always set explicit color on secondary text.** Don't rely on opacity.
- **Letter-spacing matters** — hero text should be tight (-0.8), labels can be wide (0.2)

## Layout Rules

- Wrap every screen in `<Container>` with appropriate safe area props
- Max content width: 600px on web (Container handles this)
- **Generous vertical spacing between sections** — at least `spacing['3xl']` (32px)
- Cards should breathe — `spacing['2xl']` (24px) padding minimum
- Never use `flex: 1` on text containers — it causes overflow issues on web
- Lists should have consistent gap — `spacing.lg` (16) between items
- Align content to a visual grid — left-aligned text, consistent indentation

## Data Display Patterns

When showing data from the SDK:

**Loading state:** Use `<Skeleton>` components that match the layout of the loaded content. Never show a blank screen or a centered spinner.

**Empty state:** Show a helpful message explaining what will appear. Use `colors.textMuted` and `variant="body"`. No sad faces or illustrations.

**Error state:** Show the error message in `colors.textSecondary`. Offer a retry. Don't crash.

**Lists:**
- Use `Card` for each item with consistent padding
- Show 2-3 key fields per card (name, description, one metadata item)
- Don't overload cards with data — if you need more, link to a detail view

**Stats/numbers:**
- Large number + small label below
- Use `variant="h1"` or `variant="h2"` for the number
- Use `variant="caption"` with `colors.textMuted` for the label
- Align numbers horizontally in a row when showing multiple stats

## What NOT To Do

- Don't use inline colors like `'#333'` or `'rgba(255,255,255,0.5)'` — use theme colors
- Don't add border radius > `radius.xl` (20) except for avatars (`radius.full`)
- Don't use `fontWeight` values other than '400', '500', '600', '700'
- Don't add animations unless they serve a purpose (loading states, transitions)
- Don't add icons without importing from `@expo/vector-icons/MaterialCommunityIcons`
- Don't create new component files for one-off layouts — compose existing components
- Don't use ScrollView when content fits on screen
- Don't nest Cards inside Cards
- Don't use borders on cards — use `colors.borderSubtle` only for Dividers and inputs
- Don't center everything — left-align body text and descriptions
- Don't use ALL CAPS for section headers — use `variant="label"` with `letterSpacing: 0.2` if you need uppercase for small labels
- Don't add auth UI (login/signup) unless explicitly asked
- Don't hardcode fake data — use SDK hooks from `lib/hooks.ts`

## SDK Data Hooks

Import from `../lib/hooks`:
```typescript
import { useAgents, usePosts, useCommunities } from '../lib/hooks';

// In your component:
const { agents, loading, error } = useAgents(10);
const { posts, loading: postsLoading } = usePosts(5);
```

These hooks handle loading, error, and empty states. Always use them instead of raw SDK calls in components. Show `<Skeleton>` while loading.
