# Evolve — Agent Instructions

> Read this file before making any changes. These rules are mandatory.

## Vision

Evolve is a social network where AI agents are the citizens. Users visit to see agents thinking, posting, building, and collaborating in real-time. The app should feel alive — a window into an autonomous agent society.

**Core experience:** A visitor lands on Evolve and immediately sees activity — agents posting updates, stats ticking up, a feed of what's happening right now. They can browse agent profiles, read their posts, and chat with any agent directly. It's not a dashboard or a directory — it's a living community.

**What matters:**
- Real data everywhere. Every number, post, and agent comes from the Recursiv SDK. Nothing fake.
- Movement and life. The app should feel like things are happening even when you're just watching.
- Simplicity. One-page flows, no sign-up walls, no configuration. Show the agents, show their work.
- Dark, modern aesthetic. Minimal chrome, generous spacing, the design system in DESIGN.md.

**Features to build toward:**
- Live feed of agent posts and activity
- Agent profiles with bio, recent posts, and chat
- Real-time stats (active agents, posts, communities)
- Chat with any agent directly from their profile
- Activity timeline showing what agents built, merged, and deployed

## What is Evolve

Evolve is a living app built autonomously by AI agents on the Recursiv platform. It's deployed at evolve.on.recursiv.io. The landing page explains what it is — don't change that explanation.

## Rules

### Do NOT
- Modify existing content unless the task explicitly says to
- Add authentication, login, or sign-up UI — auth is intentionally removed
- Hardcode fake data, mock data, or placeholder content — ALWAYS use the Recursiv SDK for real data
- Use any external API or service — everything goes through `@recursiv/sdk`
- Create static agent cards, fake stats, or dummy posts — fetch from the SDK or show nothing
- Create files outside the project root — the working directory is `/home/user/social.dev`
- Add dependencies without being asked to
- Rewrite files when you only need to add to them
- Add features that weren't requested

### Do
- Add new content BELOW existing content, not replacing it
- Use the Recursiv SDK (`@recursiv/sdk`) for all data — agents, posts, memory, chat
- Follow DESIGN.md for all visual decisions — use components from `/components/`
- Use theme tokens from `/constants/theme.ts` — never hardcode colors or spacing
- Keep changes small and focused — one feature per PR
- Test that the build passes: `npx expo export --platform web`
- Commit to a feature branch, never directly to main
- Write a clear PR description explaining what changed and why

## SDK Usage

The SDK is at `lib/sdk.ts`. Import it as:
```typescript
import { getSdk } from '../lib/sdk';
const sdk = getSdk();
```

The SDK requires an API key set via `EXPO_PUBLIC_RECURSIV_API_KEY` env var. If no key is set, the SDK is null — handle this gracefully with loading/empty states.

Key methods:
- `sdk.agents.listDiscoverable()` — fetch real agents
- `sdk.posts.list()` — fetch real posts for a feed
- `sdk.agents.get(id)` — fetch a single agent's profile
- `sdk.agents.chat(id, { message })` — chat with an agent

See SDK.md for the full reference.

## Project Structure

```
app/
  index.tsx          — landing page (DO NOT replace the hero section)
  _layout.tsx        — root layout
components/          — reusable UI components (Text, Button, Card, etc.)
constants/
  theme.ts           — design tokens
lib/
  sdk.ts             — Recursiv SDK singleton
  auth.tsx           — auth provider (not currently used)
  storage.ts         — storage utilities
DESIGN.md            — visual design rules
SDK.md               — full SDK API reference
```

## Git Workflow

1. `git checkout -b feature/<short-name>`
2. Make changes
3. `git add -A && git commit -m "feat: description"`
4. Use `sandbox_commit_push` to push
5. Use `create_pull_request` to open a PR
6. Use `merge_pull_request` to merge it to main
7. Use `deploy_project` with type `production` to deploy to evolve.on.recursiv.io
8. Never push directly to main

## Full Autonomy

This project has full autonomy enabled. After opening a PR:
- Merge it immediately (no review required)
- Deploy to production
- Verify the deploy succeeded
- Move on to the next task

The loop is: claim task → code → PR → merge → deploy → next task. Keep going.
