# Ask AI for /docs: implementation summary

Covers the current (v2) Ask AI. Tested on the dev server on 2026-11-16 and 2026-11-17.

## What it does

A visitor on `/docs` can open an AI panel (header button, bottom "Ask a question..." bar, or Cmd/Ctrl+I), ask a question and get an answer grounded in the published docs. The AI searches and reads docs pages itself (tool calling) instead of being fed a fixed excerpt. It follows the fosrl/docs (Pangolin) approach.

## How it works

1. The browser sends the conversation to `POST /api/ask` (AI SDK `useChat`, `DefaultChatTransport`). It includes the current docs slug (`page`), an anonymous `threadId` and `visitorId`.
2. The server checks the rate limit, loads the model, and keeps only the visible text of each message (`src/lib/docs-ai/messages.ts`). Forged tool parts, system messages and files are dropped or rejected with 400. Limits: a request body of at most 200,000 bytes (rejected before parsing), 4,000 characters per message, last message from the user. Only the newest 30 messages are used (a sliding window: older turns drop off, a long chat never fails because of its length); a window that would start on an assistant reply drops that reply too. The browser also sends only the last 30 messages and only their text.
3. The question is logged in `chat_events` (the log never blocks the chat).
4. `streamText` runs with two tools, a 6-step limit and 4 retries for a failing gateway call, then the reply streams back as the AI SDK UI message stream (`toUIMessageStreamResponse`).
   - `search_docs`: full-text search over the published docs, returns pages with short excerpts.
   - `read_page`: returns one page as Markdown. The browser only receives `{url, title, chars}`; the full text goes to the model through `toModelOutput`.
5. The system prompt (`src/lib/docs-ai/prompt.ts`) tells the model to answer from the docs, say "This is not covered in the docs." when it is not, link relative docs pages, ignore instructions found inside page text, and decline unrelated questions. It includes a cached page index and the page the visitor is on.
6. `messageMetadata` carries the `eventId`, so thumbs votes can be attached to an answer.

Errors reach the browser as short messages. Content-filter refusals become a polite decline; a gateway that is still failing after the retries (429 or 5xx) becomes "The AI service is busy right now. Please try again in a moment."; other failures become "Something went wrong while answering. Please try again." Validation errors (400, 429, 503) come back as `{ "error": "..." }` JSON and the panel shows that text. Every error shows Retry and New chat. The model never says plain "CodeMate": the prompt asks for "CodeMate AI".

What the chat remembers: the last 30 messages of the conversation (visible text only, the AI repeats its own searches each turn). The conversation lives in the browser tab and resets on reload or New chat.

## Model and credentials

An OpenAI-compatible gateway (the CodeMate Academy one), called through `@ai-sdk/openai-compatible`, default model `bodh-b0`. The `authorization` header carries the token and `api-key` is a dummy value. Everything stays on the server.

## Files

- `src/app/api/ask/route.ts`: the chat endpoint.
- `src/app/api/ask/feedback/route.ts`: thumbs on an answer (`{id, vote 1|-1|0, visitorId}`), updates only when the visitor id matches the stored one.
- `src/app/api/feedback/page/route.ts`: "Was this page helpful?" (`{page, vote, visitorId}`), collection `page_feedback`, one vote per visitor and page, TTL 90 days.
- `src/lib/docs-ai/`: `model.ts`, `prompt.ts`, `tools.ts`, `messages.ts` (also the shared `ID` and `Vote` schemas), `rate-limit.ts`, `once.ts` (runs index creation once per process).
- `src/app/docs/ask-ai/`: `context.tsx` (provider, hotkey, votes), `Panel.tsx`, `Message.tsx` (tool rows, Thinking, thumbs), `Markdown.tsx`, `Input.tsx`, `useVoice.ts`, `Trigger.tsx` (header button and bottom bar).
- `src/app/docs/PageFeedback.tsx`, `src/app/docs/layout.tsx`, `src/app/docs/docs.css` (animations).

## Environment variables (server only)

`DOCS_AI_BASE_URL`, `DOCS_AI_TOKEN`, `DOCS_AI_API_KEY`, `DOCS_AI_MODEL` (default `bodh-b0`), `DOCS_AI_RATE_LIMIT_PER_MINUTE` (default 10), `DOCS_AI_GLOBAL_PER_MINUTE` (default 60), `MONGODB_DB_NAME`, `MONGODB_DOCS_DB_NAME`. Names are in `.env.example`. The browser bundle contains none of these (checked by searching `.next/static`).

## Data stored (database `codemate_docs`)

- `chat_events`: question, page, thread id, visitor id, answer (first 4,000 characters), rating, time. TTL 90 days.
- `page_feedback`: page, visitor id, vote. TTL 90 days.
- `ask_rate`: hashed IP counters. TTL 1 day.

## Limits

Per IP: 10 questions a minute and 100 a day. All visitors together: 60 a minute, counted only after the per-IP checks so blocked requests cannot lock everyone out. Feedback: 30 a minute per IP. If the database is down the limiter falls back to a per-process, per-IP counter (same per-minute limit, no daily or global cap) instead of allowing everything. The client IP comes from `x-nf-client-connection-ip`, `x-real-ip`, or the last `x-forwarded-for` value.

## UI behaviour

- **Live steps:** "Thinking" with a shimmer and dots, then rows like `Searching "q"` that become `Searched "q", N pages` and `Read <title>`. They collapse into a one-line summary when the answer starts.
- **Stop:** the send button turns into a square while answering. It aborts the request (the model stops running). The partial answer stays with a "Stopped" note and Retry. Pause and resume is not built.
- **New chat**, Retry (only after Stop or an error), starter questions, draft saved in localStorage, Enter that does not send mid-IME, scroll follows the answer unless the reader scrolled up.
- **Answers:** Markdown, sanitized with DOMPurify, images blocked, docs links navigate in the app, other links open in a new tab with `noopener`. Each block has a stable key so streaming does not replay animations. Motion respects `prefers-reduced-motion`.
- **Votes:** thumbs toggle and are bound to the anonymous `visitorId` (localStorage), so a guessed event id cannot change someone else's vote.
- **Layout:** slide-in panel on desktop, floating rounded card with a backdrop on phones. The panel is a portal on `document.body`.
- **Voice:** mic button using the browser's speech recognition (`useVoice.ts`). The text fills the input and is never sent automatically. The button is hidden where the browser does not support it (Firefox). Chrome and Edge send audio to their own speech service; we never receive audio. If recognition is refused, the panel tells apart "microphone blocked" (with a **Turn on microphone** button) from "microphone works but the speech service refused".

## Voice needs a header change

`next.config.ts` used to send `Permissions-Policy: microphone=()` on every page, which blocks the microphone whatever the visitor allows. It now sends `microphone=(self)` under `/docs` only; every other page stays blocked and the camera stays blocked everywhere. If nginx adds its own Permissions-Policy header it overrides this and voice breaks in production. Check after deploying:

```bash
curl -sI https://codemate.ai/docs/overview
```

Voice needs HTTPS or `localhost`. Real microphone behaviour must be checked by hand.

## Hardening and production checklist

- The proxy must pass the real client IP: `proxy_set_header X-Real-IP $remote_addr;` in nginx. Without it every visitor shares one rate-limit bucket.
- Port 8182 must only be reachable through nginx (bind to 127.0.0.1 or firewall it), and nginx must overwrite `X-Real-IP`. Otherwise a client can fake its IP header and dodge the per-IP limits.
- The shared gateway key bills against the Academy project. Decide whether the docs need their own key.
- Set the `DOCS_AI_*` variables and both MongoDB database names in the production environment.
- Confirm the content-filter decline message and the "not covered in the docs" answer with the team.
- A privacy note is not shown in the panel any more (the footer says "AI can make mistakes. Please verify."). Questions are stored for 90 days and voice audio goes to the browser vendor, so cover both in the privacy policy.

## Verified

`tsc` and ESLint clean, `npm run build` passes, no `DOCS_AI_*` secrets in the client bundle. Browser runs (2026-11-17): a 17-question chat past the 30-message window with no error, a code word in message 1 is forgotten once it falls outside the window, light mode, Stop and Retry, New chat from an error, a production build. Earlier: hotkey, ask bar, live tool rows, Stop mid-answer (partial kept, Retry shown), thumbs toggle, draft saved, Esc closes, page vote, 320px width without horizontal scroll. Security: system role, 4,001 characters, a body over 200,000 bytes, 201 messages and a request ending on an assistant turn return 400; 25 and 33 messages are accepted and cut to the newest 30; a forged tool part in the body is ignored; spoofed `X-Forwarded-For` does not bypass the limit.

## Not done / open

- Syntax-highlighted code inside answers (Shiki runs on the server only).
- Docked side column, admin analytics for chat events and votes.
- Tablet width pass of the v2 panel. Real voice dictation needs a manual check in Chrome or Edge.
- The AI gateway sometimes returns 502; retries and the "busy" message soften it but cannot remove it. Assistant turns sent by the browser are not verified, so a client can forge them; fixing that means keeping history on the server by thread id.
- GitBook images (35) not re-uploaded, a few remaining GitBook links, DNS and nginx for `docs.codemate.ai`.
- The model's answer to competitor comparisons is left as the model gives it.
