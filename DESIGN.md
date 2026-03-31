# Design System — Guide for AI Agents

> Follow these rules when building UI. The goal is Claude-level polish: minimal, precise, intentional.

## Principles

1. **Less is more.** Remove before you add. White space is a feature.
2. **No decoration.** Every element serves a purpose. No gradients, no ornamental borders, no shadows unless conveying elevation.
3. **Typography does the work.** Size, weight, and color establish hierarchy — not boxes around things.
4. **Consistency is quality.** Use the design tokens. Don't invent new values.

## Components

Always use components from `../components/`:
- `<Text variant="h1|h2|h3|body|caption|label">` — never use raw `<Text>` from react-native
- `<Button variant="primary|secondary|ghost">` — never build custom pressables for actions
- `<Input label="..." error="...">` — all text inputs, with labels
- `<Card variant="default|raised|ghost">` — content containers
- `<Container safeTop padded>` — page wrapper with safe areas and max-width
- `<Divider>` — section separator
- `<Skeleton>` — loading states

## Spacing

Import `spacing` from `../constants/theme`. Use these values exclusively:
- `xs: 4` `sm: 8` `md: 12` `lg: 16` `xl: 20` `2xl: 24` `3xl: 32` `4xl: 40` `5xl: 48` `6xl: 64`
- Never use arbitrary numbers like 10, 18, 22, 30. Snap to the scale.

## Colors

Import `colors` from `../constants/theme`. Key rules:
- Background: `colors.bg` (#09090b) — almost black, not pure black
- Cards/surfaces: `colors.surface` — one step lighter than bg
- Text hierarchy: `colors.text` → `colors.textSecondary` → `colors.textMuted`
- Borders: `colors.borderSubtle` for light separation, `colors.border` for emphasis
- Never use white (#fff) for backgrounds. Never use pure black (#000) for text.

## Typography Rules

- Hero/page titles: `variant="hero"` or `variant="h1"` — bold, tight letter-spacing
- Section headers: `variant="h2"` or `variant="h3"`
- Body text: `variant="body"` — 15px, comfortable line height
- Labels and metadata: `variant="caption"` or `variant="label"`
- Always set explicit `color` on secondary text. Don't rely on opacity.

## Layout Rules

- Wrap every screen in `<Container>` with appropriate safe area props
- Max content width: 600px on web (Container handles this)
- Section gaps: `spacing['2xl']` (24) or `spacing['3xl']` (32)
- Card padding: `spacing['2xl']` (24) default
- Never use `flex: 1` on text containers — it causes overflow issues on web

## What NOT To Do

- Don't use inline colors like `'#333'` or `'rgba(255,255,255,0.5)'` — use theme colors
- Don't add border radius > `radius.xl` (20) except for avatars (`radius.full`)
- Don't use `fontWeight` values other than '400', '500', '600', '700'
- Don't add animations unless they serve a purpose (loading states, transitions)
- Don't add icons without importing from `@expo/vector-icons/MaterialCommunityIcons`
- Don't create new component files for one-off layouts — compose existing components
- Don't use ScrollView when content fits on screen
- Don't nest Cards inside Cards

## Reference

Study these apps for quality reference:
- Claude (claude.ai) — minimal, text-driven, generous spacing
- Linear (linear.app) — dark theme, sharp typography, efficient layout
- Vercel (vercel.com) — black/white, bold headlines, clean cards
