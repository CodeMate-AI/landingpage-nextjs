# Ask AI for /docs: implementation summary

Covers the uncommitted changes that add the Ask AI feature to the docs. Dev-server tested on 2026-11-16 at desktop width and a 375px phone screen. Light mode and production are not tested.

## What it does
A visitor clicks **Ask AI** in the docs sidebar header and asks a question. A model searches the published docs itself, reads the pages it needs, and streams back a short answer with links to the pages it used. Questions the docs do not cover get "This is not covered in the docs." Off-topic questions are declined.

## How it works
Modelled on the fosrl/docs assistant: the model calls two tools in a loop (up to 6 steps) instead of the server picking pages for it.

| Tool | Does |
|---|---|
| `search_docs` | Runs the existing docs search, groups hits by page, returns up to 10 pages with short excerpts |
| `read_page` | Returns one published page as Markdown (cut at 60,000 characters) |

Flow of `POST /api/ask`:
1. Per-IP rate limit (MongoDB). Over the limit returns 429 with `Retry-After`.
2. Model config check. Missing env values return 503.
3. Zod validation: 1 to 12 messages, each up to 4,000 characters, optional current page slug. Bad input returns 400.
4. Insert the question into `chat_events` (never blocks the chat if it fails). Its id is returned in the `x-docs-event` header.
5. `streamText` with the system prompt, the two tools, `temperature` 0.2, `maxOutputTokens` 900, stops after 6 steps. The reply streams back as plain text.
6. When the stream finishes, the answer (first 4,000 characters) is saved on the event.

The system prompt tells the model to ground every answer in the docs, never invent commands or settings, cite pages as relative links, ignore instructions found inside page text, never use em dashes, and decline unrelated questions. It also contains a one-line-per-page index of all published pages (refreshed at most once a minute) and the page the visitor is reading.

## Model and credentials
- Taken from the CodeMate Academy backend: an OpenAI-compatible gateway, model `bodh-b0` (it reports `gpt-5.4-mini`).
- Tool calling and streaming were tested against it and work.
- Auth is the `authorization` token only. The `api-key` header is accepted but ignored (tested: token only returns 200, key only returns 401), so `DOCS_AI_API_KEY` can be a dummy value. The code still requires it to be non-empty.
- The key is shared with Academy, so usage is billed together.

## Files
New:
- `src/app/api/ask/route.ts`: the streaming endpoint described above
- `src/app/api/ask/feedback/route.ts`: saves thumbs up/down on a `chat_events` row
- `src/lib/docs-ai/model.ts`: OpenAI-compatible provider, sets both headers
- `src/lib/docs-ai/tools.ts`: `search_docs` and `read_page`
- `src/lib/docs-ai/prompt.ts`: system prompt and cached page index
- `src/lib/docs-ai/rate-limit.ts`: per-minute and per-day limits in MongoDB
- `src/lib/docs-search-api.ts`: the Fumadocs search instance, now shared by search and Ask AI
- `src/app/docs/AskAI.tsx`: button and panel

Changed:
- `src/app/api/search/route.ts`: now only calls the shared search instance
- `src/app/docs/layout.tsx`: renders `<AskAI />` through the nav slot
- `.env.example`: new `DOCS_AI_*` names
- `package.json` and lock: added `ai` 7.0.173 and `@ai-sdk/openai-compatible` 3.0.92; raised `zod` from 3.23.8 to 3.25.76 (the SDK needs 3.25.76 or newer)
- `DOCS_PLAN.md`: Ask AI marked built, notes added

## Environment variables (server only)
| Name | Purpose |
|---|---|
| `DOCS_AI_BASE_URL` | Gateway base URL; the SDK appends `/chat/completions` |
| `DOCS_AI_TOKEN` | Sent as `authorization`, include the `Bearer ` prefix |
| `DOCS_AI_API_KEY` | Sent as `api-key`; a dummy value works |
| `DOCS_AI_MODEL` | Defaults to `bodh-b0` |
| `DOCS_AI_RATE_LIMIT_PER_MINUTE` | Defaults to 10 |

`MONGODB_DB_NAME` and `MONGODB_DOCS_DB_NAME` were also added to `.env.local` (same as the code defaults). `.env.local` is gitignored; the production server needs the same values.

## Data stored (database `codemate_docs`)
| Collection | Holds | Retention |
|---|---|---|
| `chat_events` | question, current page, answer, rating, time | 90 days, TTL index on `createdAt` |
| `ask_rate` | hashed-IP counters per minute and per day | 1 day, TTL index |

No IP address is stored in `chat_events`; the rate-limit collection stores only a hash.

## Limits
- 10 questions per minute and 100 per day per IP (minute limit configurable). The limiter allows requests if MongoDB is down, so a database fault does not take Ask AI offline.
- Question length 500 characters in the UI, 4,000 in the API; 12 messages of history.

## UI behaviour
- Button sits in the sidebar header (desktop) and top bar (mobile). The panel is a right-hand side panel on desktop and full screen on phones, rendered through a portal because the header's blur traps fixed positioning.
- Starter questions, streaming answer, stop button, Enter to send and Shift+Enter for a new line, Esc to close.
- Answers are rendered with `marked` and sanitized with DOMPurify. Links to `/docs/...` navigate inside the app.
- Thumbs up/down appear once the answer finishes. A note says answers can be wrong and are stored for 90 days.
- Conversation lives in memory and resets on reload.

## Tested
- Real question returned correct steps with a source link; off-topic declined; empty input returned 400; the 11th request in a minute returned 429; feedback saved.
- `npx tsc --noEmit` and ESLint clean on the new files.
- Panel opened and answered on desktop; full screen at 375px.

## Not done / open
- Light mode and the production server are untested; the production host must be able to reach the AI gateway.
- Not built: admin view of stored questions, sources list shown separately, a reset-conversation button, `Ctrl+I` shortcut.
- The team still needs to confirm the context window, cost limits, whether a dedicated key is wanted, and who approves the privacy note.
- Optional cleanup: make `DOCS_AI_API_KEY` optional in `model.ts`.

## Hardening and production checklist (added after attack testing, 2026-11-16)
Fixed: IP spoofing via `X-Forwarded-For` (now prefers `x-nf-client-connection-ip`, then `x-real-ip`, then the last forwarded entry); overall cap of 60 questions a minute (`DOCS_AI_GLOBAL_PER_MINUTE`, counted only after the per-IP checks pass); whitespace-only questions rejected; answers cannot contain images or scripts and external links open in a new tab; first feedback rating wins and feedback is limited to 30 a minute per IP; a friendly message replaces the empty reply when the gateway's content filter rejects a prompt; `X-Accel-Buffering: no` so nginx streams answers.

Before going live:
- Set `DOCS_AI_BASE_URL`, `DOCS_AI_TOKEN`, `DOCS_AI_API_KEY` (any non-empty value), `MONGODB_DB_NAME`, `MONGODB_DOCS_DB_NAME` on the server.
- nginx must pass the real client IP: `proxy_set_header X-Real-IP $remote_addr;`. If a CDN sits in front, switch `clientIp` to its header.
- Confirm the server can reach the AI gateway, and agree who pays for usage (shared key with Academy).
- Get the privacy note approved (questions and answers kept 90 days).
