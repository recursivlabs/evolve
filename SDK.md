# Recursiv SDK — Reference for AI Coding Assistants

> Read this file before writing any code with @recursiv/sdk.
> It covers all resources, decision rules, working examples, and known gotchas.

```typescript
import { Recursiv } from '@recursiv/sdk'
const r = new Recursiv() // reads RECURSIV_API_KEY from env
```

## Decision rules — pick the right resource

| Need | Use | Do NOT use |
|------|-----|-----------|
| Structured/relational data | `r.databases` → Postgres | `r.posts` with JSON blobs |
| Social content, feeds, reactions | `r.posts` + `r.communities` + `r.tags` | `r.databases` for social feeds |
| File storage (photos, docs, media) | `r.storage` (buckets, presigned URLs) | `r.uploads` (legacy) |
| User auth and API keys | `r.auth` | Raw fetch to `/api/auth/*` |
| AI agent with model + system prompt | `r.agents` | Direct LLM API calls |
| Agent code/tool execution | `r.projects.executeCode()` + `r.commands` | External sandboxes |
| Deploy to production | `r.projects.deploy()` | Manual CI/CD |
| Messaging between users | `r.chat` | Custom WebSocket layer |
| Team/org management | `r.organizations` | Custom user-group tables |
| Per-project task tracking & decisions | `r.projectBrain` | External project management |
| Persistent agent memory | `r.memory` (facts, decisions, search) | Storing knowledge in `r.posts` or `r.databases` |
| Transactional email (receipts, alerts) | `r.email.send()` | Direct Resend/SendGrid calls |
| Receive external webhooks (Stripe, etc.) | `r.webhooks.register()` | Custom webhook server |
| Server-side cron / scheduled tasks | `r.jobs.create()` | External cron services |

**IMPORTANT:** Do NOT store structured app data (records, inventory, tasks, settings) as JSON inside `r.posts.content`. Posts are for social content. Use `r.databases` for application data.

---

## Infrastructure

### r.databases — Provision and query Postgres

```typescript
const { data: db } = await r.databases.ensure({ project_id: 'proj_xxx', name: 'my-app-db' })
const { data: creds } = await r.databases.getCredentials({ project_id: 'proj_xxx', name: 'my-app-db' })
// creds.connection_string → "postgresql://user:pass@host:5432/dbname"
```

Methods: `list({ project_id })`, `create({ project_id, name })`, `ensure({ project_id, name? })`, `getCredentials({ project_id, name })`

Note: `ensure` is idempotent — safe to call on every app launch. `getCredentials` takes `project_id` + `name`, not `database_id`.

### r.projects — Deploy, sandbox, execute code

```typescript
const { data: project } = await r.projects.create({ name: 'My App', organization_id: orgId })
await r.projects.createSandbox(project.id)

const { data: result } = await r.projects.executeCode(project.id, {
  code: 'console.log("hello")',
  language: 'typescript',
})
// result.output → "hello\n"

const { data: deployment } = await r.projects.deploy(project.id, { branch: 'main', type: 'production' })
const { data: logs } = await r.projects.deploymentLogs(project.id, deployment.id)
```

Methods: `list`, `get`, `create`, `delete`, `deploy`, `executeCode`, `sandbox`, `createSandbox`, `stopSandbox`, `deployment`, `deploymentLogs`, `deployments`

### r.storage — Bucket-based file storage

```typescript
const { data: bucket } = await r.storage.ensureBucket({ name: 'user-photos', project_id: project.id })
const { data: upload } = await r.storage.getUploadUrl({
  bucket_name: 'user-photos', key: 'photo.jpg', content_type: 'image/jpeg', project_id: project.id,
})
// PUT file to upload.url
const { data: download } = await r.storage.getDownloadUrl({
  bucket_name: 'user-photos', key: 'photo.jpg', project_id: project.id,
})
// GET file from download.url
```

Methods: `listBuckets`, `getBucket`, `createBucket`, `ensureBucket`, `listItems`, `createFolder`, `getUploadUrl`, `getDownloadUrl`, `deleteObject`

Note: `ensureBucket` is idempotent.

### r.sandbox — Anonymous code execution

```typescript
const r = new Recursiv({ anonymous: true })  // no API key needed
const { data } = await r.sandbox.execute({ code: '1 + 1', language: 'typescript' })
// Rate-limited: 10/day per IP
```

---

## AI Agents

### r.agents — Managed AI agents

```typescript
const { data: agent } = await r.agents.create({
  name: 'Home Assistant',
  username: 'home_bot_' + Date.now(),
  model: 'anthropic/claude-sonnet-4',
  system_prompt: 'You help homeowners maintain their property.',
  organization_id: orgId,
})

// Non-streaming chat (agent responds asynchronously)
const { data: reply } = await r.agents.chat(agent.id, { message: 'When should I service my HVAC?' })
// reply: { message_id, conversation_id, content, created_at, note }

// Streaming (Node.js/browser — NOT React Native, see Gotchas)
const stream = r.agents.chatStream(agent.id, { message: 'Tell me more' })
for await (const chunk of stream) { process.stdout.write(chunk.delta ?? '') }

// Give agent access to project infrastructure
await r.agents.grantProjectAccess(agent.id, {
  project_id: project.id,
  permissions: ['execute_code', 'read_files', 'write_files'],
})
```

Methods: `list`, `get`, `create`, `update`, `delete`, `chat`, `chatStream`, `conversations`, `listDiscoverable`, `leaderboard`, `grantProjectAccess`, `revokeProjectAccess`, `resetRequestCount`, `getByClaimToken`, `claim`, `orchestratorStatus`

### r.brain — AI assistant messaging

```typescript
const { data } = await r.brain.sendMessage({
  message: 'What should I work on next?',
  history: [{ role: 'user', content: 'previous message' }],
  context: { current_route: '/dashboard', org_slug: 'acme' },
})
// Response streams via WebSocket — data.message_id identifies the response
```

Methods: `sendMessage({ message, history?, context? })`

### r.commands — AI command execution

```typescript
// Execute a prompt with AI
const { data } = await r.commands.execute({
  prompt: 'Summarize recent activity',
  current_screen: '/dashboard',
  org_slug: 'acme',
  model: 'anthropic/claude-sonnet-4',
})
// data: { text, actions }
```

Methods: `gatePrompt({ messages, model? })`, `execute({ prompt, current_screen?, org_slug?, model?, locale?, attachments? })`

### r.projectBrain — Per-project knowledge base & task management

```typescript
const { data: tasks } = await r.projectBrain.tasks(projectId, { status: 'open' })
const { data: decisions } = await r.projectBrain.decisions(projectId)
const { data: milestones } = await r.projectBrain.milestones(projectId)
const { data: usage } = await r.projectBrain.usage(projectId)
await r.projectBrain.completeTask(projectId, taskId, 'Implemented and tested')
```

Methods: `tasks`, `stats`, `decisions`, `milestones`, `agents`, `teamActivity`, `sandboxUrl`, `getSettings`, `updateSettings`, `updateTask`, `completeTask`, `usage`

---

## Memory — Persistent agent memory across sessions

### r.memory — Facts, decisions, and search

```typescript
// Store a fact — persists across sessions, shared with all agents on the same project
const { data: fact } = await r.memory.facts.add({
  fact: 'This project uses Hono, not Express',
  project_id: 'proj_xxx',
  tags: ['architecture', 'routing'],
  source: 'manual',  // 'auto' | 'manual' | 'extraction'
})

// Recall facts for a project
const { data: facts } = await r.memory.facts.list({ project_id: 'proj_xxx' })

// Search query across facts
const { data: filtered } = await r.memory.facts.list({ project_id: 'proj_xxx', query: 'database' })

// Remove a fact
await r.memory.facts.remove(fact.id)

// Log an architectural decision with context
const { data: decision } = await r.memory.decisions.log({
  decision: 'Use pgvector for semantic search',
  context: 'Evaluated Pinecone, Weaviate, and pgvector. pgvector wins on ops simplicity.',
  tags: ['architecture', 'database'],
  project_id: 'proj_xxx',
})

// List decisions
const { data: decisions } = await r.memory.decisions.list({ project_id: 'proj_xxx' })

// Search across all memory types (facts, decisions, conversations)
const { data: results } = await r.memory.search({
  query: 'authentication approach',
  project_id: 'proj_xxx',
  limit: 10,
})

// Build a context block from relevant memories (for enriching prompts)
const { data: ctx } = await r.memory.context({
  message: 'How should I implement caching?',
  project_id: 'proj_xxx',
  max_tokens: 2000,  // token budget for the context block
})
// ctx.context → formatted string of relevant facts + decisions

// Purge all memory for a project (irreversible — GDPR compliance)
await r.memory.purge('proj_xxx')
```

Methods:
- `facts.add`, `facts.list`, `facts.remove`
- `decisions.log`, `decisions.list`
- `search`, `context`, `purge`

### Decision rules

- Use `r.memory.facts.add()` when the agent learns something worth remembering
- Use `r.memory.decisions.log()` for architectural or strategic decisions with context
- Use `r.memory.context()` at the start of a session to load relevant memories
- Always scope to `project_id` when working on a specific project
- Use `r.memory.search()` when looking for specific past knowledge
- Do NOT store secrets, API keys, or credentials as memory facts (the API rejects them)
- Facts are deduplicated — storing the same fact twice updates the timestamp instead of creating a duplicate

### Golden path — Agent with persistent memory

```typescript
// At session start: load relevant context
const { data: ctx } = await r.memory.context({
  message: userMessage,
  project_id: projectId,
})
// Inject ctx.context into system prompt

// During work: remember what you learn
await r.memory.facts.add({
  fact: 'The auth system uses JWT with 15min expiry',
  project_id: projectId,
  tags: ['auth'],
})

// Record decisions
await r.memory.decisions.log({
  decision: 'Use Redis for session caching',
  context: 'Need sub-ms reads, DB was adding 50ms latency',
  project_id: projectId,
})
```

---

## Identity & Auth

### r.auth — Authentication and API keys

```typescript
const session = await r.auth.signUp({ name: 'Jane', email: 'jane@example.com', password: 'secure12345!' })
// session: { token, user: { id, name, email, image } }

const session = await r.auth.signIn({ email: 'jane@example.com', password: 'secure12345!' })

const key = await r.auth.createApiKey(
  { name: 'my-key', scopes: ['posts:read', 'agents:write'] },
  session.token,
)
// key: { key, id, name, prefix, scopes }

await r.auth.signOut(session.token)
```

Methods: `signUp`, `signIn`, `getSession`, `signOut`, `createApiKey`

Available scopes: `posts:read`, `posts:write`, `users:read`, `communities:read`, `communities:write`, `chat:read`, `chat:write`, `projects:read`, `projects:write`, `agents:read`, `agents:write`, `tags:read`, `tags:write`, `uploads:write`, `commands:read`, `commands:write`, `settings:read`, `settings:write`, `billing:read`, `billing:write`, `wallet:read`, `wallet:write`, `memory:read`, `memory:write`

### r.users

```typescript
const { data: me } = await r.users.me()
const { data: user } = await r.users.get('user_xxx')
```

Methods: `me`, `get`, `followers`, `following`

### r.organizations

```typescript
const { data: org } = await r.organizations.create({ name: 'Acme', slug: 'acme' })
await r.organizations.addMember(org.id, { user_id: 'user_xxx', role: 'member' })
```

Methods: `list`, `get`, `getBySlug`, `create`, `update`, `delete`, `members`, `addMember`, `removeMember`, `invite`, `updateMemberRole`

### r.profiles

```typescript
const { data: profile } = await r.profiles.me()
await r.profiles.follow('user_xxx')
const { data: results } = await r.profiles.search({ query: 'jane' })
```

Methods: `list`, `me`, `get`, `getByUsername`, `search`, `update`, `follow`, `unfollow`, `followers`, `following`, `isFollowing`, `leaderboard`

---

## Social Primitives

### r.chat — Messaging (REST)

```typescript
const { data: dm } = await r.chat.dm({ user_id: 'user_xxx' })
await r.chat.send({ conversation_id: dm.id, content: 'Hello!' })
const { data: group } = await r.chat.createGroup({ name: 'Team', member_ids: ['user_1', 'user_2'] })
const { data: msgs } = await r.chat.messages(dm.id, { limit: 50 })
```

Methods: `conversations`, `communityConversation`, `conversation`, `messages`, `send`, `dm`, `createGroup`, `deleteConversation`, `reactToMessage`, `editMessage`, `deleteMessage`, `markAsRead`, `unreadCount`

### r.realtime — WebSocket Chat Client

Provides persistent real-time streaming and chat presence, useful for building frontends (e.g. React Native, Web).

```typescript
// Establish WebSocket connection using short-lived session tokens
await r.realtime.connect()

// Join a conversation room
r.realtime.joinConversation('conv_123')

// Send typing indicator
r.realtime.sendTyping('conv_123')

// Listen to events
const unsub = r.realtime.onMessage((msg) => {
  console.log(`New message from ${msg.sender.name}: ${msg.text}`)
})
// Cleanup listener
unsub()
```

Events: `onMessage`, `onMessageEdit`, `onMessageDelete`, `onTyping`, `onAgentThinking`

#### React / React Native specific hook

```typescript
import { useChat } from '@recursiv/sdk/react'

function Chat({ conversationId }) {
  const { isConnected, error, sendTyping, sendMessage } = useChat(r, {
    conversationId,
    onMessage: (msg) => console.log('Received:', msg.text),
  })

  return <button onClick={() => sendMessage('Hello!')}>Send</button>
}
```

### r.posts — Content feeds

```typescript
const { data: post } = await r.posts.create({
  content: 'Shipped v2!',
  content_format: 'markdown',
  community_id: 'comm_xxx',
  tag_ids: ['tag_xxx'],
})
const { data: posts } = await r.posts.list({ community_id: 'comm_xxx', tag_id: 'tag_xxx', limit: 20 })
await r.posts.update(post.id, { content: 'Updated content' })
await r.posts.react(post.id, { type: 'fire' })
const { data: results } = await r.posts.search({ query: 'shipped', community_id: 'comm_xxx' })
```

Methods: `list`, `get`, `create`, `update`, `delete`, `search`, `react`, `unreact`

### r.communities

```typescript
const { data: c } = await r.communities.create({ name: 'Denver Devs', slug: 'denver-devs', privacy: 'public' })
await r.communities.join(c.id)
```

Methods: `list`, `get`, `members`, `create`, `join`, `leave`

### r.chat — Messaging

```typescript
const { data: dm } = await r.chat.dm({ user_id: 'user_xxx' })
await r.chat.send({ conversation_id: dm.id, content: 'Hello!' })
const { data: group } = await r.chat.createGroup({ name: 'Team', member_ids: ['user_1', 'user_2'] })
const { data: msgs } = await r.chat.messages(dm.id, { limit: 50 })
```

Methods: `conversations`, `communityConversation`, `conversation`, `messages`, `send`, `dm`, `createGroup`, `deleteConversation`, `reactToMessage`, `editMessage`, `deleteMessage`, `markAsRead`, `unreadCount`

### r.tags

```typescript
const { data: tag } = await r.tags.create({ name: 'bug-report' })
const { data: tags } = await r.tags.list()
```

Methods: `list`, `get`, `create`, `delete`

---

## Platform Resources

- `r.settings` — User preferences, sessions, password changes, account deletion
- `r.billing` — Usage tracking, checkout sessions, portal sessions, metered billing
- `r.notifications` — Push notification token registration/unregistration
- `r.uploads` — Legacy media upload URLs (prefer `r.storage` for new projects)
- `r.github` — GitHub integration (getRepository, getTree, getFileContent, getCommits)
- `r.deployments` — Deployment management (prefer `r.projects.deploy()` for new projects)
- `r.integrations` — External service integrations and agent tool connections
- `r.email` — Email campaigns, batch sending, and transactional email (`r.email.send({ to, subject, html })`)
- `r.webhooks` — Register inbound webhook endpoints: `register()`, `list()`, `delete()`. Webhook events execute handler code in project sandbox.
- `r.jobs` — Scheduled cron jobs: `create({ name, cron, handler_code })`, `list()`, `update()`, `delete()`. Handlers execute in project sandbox on schedule.
- `r.wallet` — Credits/wallet management
- `r.freeTier` — Free tier limits and status
- `r.admin` — Admin operations (user management, stats, network settings)
- `r.inviteCodes` / `r.inviteCodesAdmin` — Invite code management
- `r.organizationSettings` / `r.organizationSecurity` — Org configuration
- `r.protocols` — Protocol definitions
- `r.inbox` — Notification feed
- `r.network` — Federation/network config
- `r.simulator` — Simulation/testing
- `r.dispatcher` — Task queue: `tasks()`, `create()`, `claimNext()`, `complete()`, `release()`, `stats()`, `signals()`, `outcomes()`, `staleItems()`, `stuckItems()`, `discoveries()`
- `r.dispatcher` (webhooks): `createWebhook()`, `listWebhooks()`, `updateWebhook()`, `deleteWebhook()`, `testWebhook()`, `webhookDeliveries()`, `cleanupWebhookLogs()`

```typescript
// Create a webhook to receive dispatcher events
const { data: wh } = await r.dispatcher.createWebhook({ url: 'https://example.com/hooks', event_types: ['dispatcher:task_completed'] })
// wh.secret — HMAC-SHA256 signing secret (shown once)

// List, update, test, delete
const { data: hooks } = await r.dispatcher.listWebhooks()
await r.dispatcher.updateWebhook(id, { active: false })
await r.dispatcher.testWebhook(id)
await r.dispatcher.deleteWebhook(id)
```

---

## Golden paths

### AI-native app (database + agent + storage + auth)
`r.auth.signUp()` → `r.projects.create()` → `r.databases.ensure()` → `r.databases.getCredentials()` → `r.projects.executeCode()` (migrations) → `r.agents.create()` → `r.storage.ensureBucket()`

### Social/community platform
`r.auth.signUp()` → `r.communities.create()` → `r.posts.create()` → `r.tags.create()` → `r.chat.createGroup()` → `r.profiles.follow()`

### AI coding playground
`r.projects.create()` → `r.projects.createSandbox()` → `r.agents.create()` → `r.agents.chatStream()` → `r.projects.executeCode()` → `r.projects.deploy()`

### Autonomous agent with its own infra
`r.agents.create()` → `r.projects.create()` → `r.databases.ensure()` → `r.agents.grantProjectAccess()` → `r.storage.ensureBucket()` → `r.projects.executeCode()`

### White-label business app (BYOK)
`r.auth.signUp()` → `r.databases.ensure()` → `r.databases.query()` → `r.email.send()` → `r.webhooks.register({ provider: 'stripe' })` → `r.jobs.create({ cron: '0 8 * * *' })`

---

## Response shapes

```typescript
{ data: T[], meta: { limit, offset, has_more } }  // list (PaginatedResponse)
{ data: T }                                         // single (SingleResponse)
{ data: { deleted: true } }                         // delete (DeleteResponse)
{ data: { success: true } }                         // success (SuccessResponse)
```

Pagination: pass `limit` and `offset`. Check `meta.has_more`.

---

## Error types

| Error | HTTP | When |
|-------|------|------|
| `AuthenticationError` | 401 | Missing or invalid API key |
| `AuthorizationError` | 403 | API key lacks required scope |
| `NotFoundError` | 404 | Resource doesn't exist or no access |
| `ValidationError` | 400 | Invalid input (check `error.details`) |
| `RateLimitError` | 429 | Rate limit hit (`error.retryAfter` seconds) |
| `ConflictError` | 409 | Resource already exists |

Auto-retry on 429/5xx built in (exponential backoff, default `maxRetries: 2`).

---

## Configuration

```typescript
const r = new Recursiv({
  apiKey: 'sk_live_...',                   // or set RECURSIV_API_KEY env var
  baseUrl: 'https://recursiv.io/api/v1',  // default
  timeout: 30000,                          // request timeout in ms
  maxRetries: 2,                           // auto-retry on 429/5xx
})

// Zero-arg works when RECURSIV_API_KEY is set
const r = new Recursiv()

// Anonymous sandbox (no API key needed)
const r = new Recursiv({ anonymous: true })

// Self-hosted
const r = new Recursiv({ baseUrl: 'https://my-instance.com/api/v1' })
```

---

## Gotchas

1. **`agents.chatStream()` does NOT work in React Native** (no ReadableStream). Use raw fetch to `${baseUrl}/agents/${id}/chat/stream` and parse SSE manually.
2. **`ensure` methods** (databases, storage) are idempotent — safe to call on every app launch.
3. **Do NOT use `r.posts` as a database.** Posts are for social content. Use `r.databases` for structured data.
4. **API keys need explicit scopes.** Missing scopes → `AuthorizationError` (403).
5. **`organization_id` is required** when creating agents and projects.
6. **`databases.getCredentials()`** takes `{ project_id, name }` — not `database_id`.
7. **`agents.chat()` is async** — it sends the message and the agent responds asynchronously. The response contains `message_id` and `conversation_id`, not the agent's reply text. Use `chatStream()` for real-time responses.
8. **Self-hosted:** pass `baseUrl` to constructor. Default is `https://recursiv.io/api/v1`.
9. **`r.memory` rejects secrets.** Facts containing patterns like `sk_`, `api_key=`, `password=`, or private keys are rejected on write. Store secrets in environment variables, not memory.
10. **Memory is network-scoped.** Facts and decisions are isolated per network (tenant). Two teams on different networks cannot see each other's memory.
11. **`r.memory.context()` has a token budget.** Default is 2000 tokens (~8000 chars). Pass `max_tokens` to control how much context is returned.
