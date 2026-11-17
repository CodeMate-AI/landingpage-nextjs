# CodeMate Docs: Plan for Approval

Replace GitBook (docs.codemate.ai) with first-party docs at `/docs` on the CodeMate landing site, in a Pangolin-style UI, managed through a CMS in the landing page's admin panel (`/admin`) so a non-developer can write and publish them.

Reference: [docs.pangolin.net](https://docs.pangolin.net/) (built on [Fumadocs](https://www.fumadocs.dev/), MIT, source: [fosrl/docs](https://github.com/fosrl/docs)).

## Architecture

| Area | Decision |
|---|---|
| Docs UI | Fumadocs 16 at `/docs` (sidebar, TOC, search, light/dark toggle) |
| Content format | Tiptap JSON (same editor as blogs) |
| URLs | Flat slug per page: `/docs/<slug>`; sidebar grouping is separate |
| Sidebar | Tree stored in DB, edited with drag-and-drop |
| Publishing | Draft, then publish per page |
| Auth | Existing admin JWT login; one shared login |
| Admin entry | After login `/admin` shows **Blogs** or **Docs** |
| Blog admin | Unchanged: `/admin/dashboard`, `/admin/editor` |
| Docs admin | New: `/admin/docs`, `/admin/docs/editor` |
| Editor blocks (v1) | Callouts, code with title and copy, tabs, steps, cards, accordions |

## Database

New database `codemate_docs` on the existing cluster. Env: `MONGODB_DOCS_DB_NAME`. Admin users and rate limits stay in `codemate_blog`.

| Collection | Holds |
|---|---|
| `pages` | slug (unique), title, description, Tiptap content, sections, published snapshot, draft flag |
| `nav` | sidebar tree, draft and published copies |
| `chat_events` | Ask AI question, page, rating, timestamp (TTL cleanup) |

## Build order

1. `/admin` chooser and login redirect (done)
2. DB layer: `getDocsDatabase()`, schemas, `/api/admin/docs/*` (done)
3. Docs admin: dashboard, tree editor, docs editor and new blocks (done)
4. Public `/docs` on Fumadocs, then re-run screenshot check on existing pages (done)
5. Search (done), Copy Markdown / Open in (done), Ask AI (built, see below)
6. Import GitBook content (done, 70 pages), then switch navbar and footer Docs links (done)

## Ask AI as built

Modelled on fosrl/docs: the model calls two tools itself (`search_docs`, `read_page`) up to 6 steps, using the AI SDK (`ai`, `@ai-sdk/openai-compatible`).

- Endpoint, model `bodh-b0` and auth taken from the CodeMate Academy backend (shared key, usage is billed together). Env: `DOCS_AI_BASE_URL`, `DOCS_AI_TOKEN`, `DOCS_AI_API_KEY`, `DOCS_AI_MODEL`, `DOCS_AI_RATE_LIMIT_PER_MINUTE` (names in `.env.example`; set the real values on the server too)
- `POST /api/ask` (streams text), `POST /api/ask/feedback` (thumbs). Code in `src/lib/docs-ai/`, UI in `src/app/docs/ask-ai/` (header button, ask bar, panel; floating card on phones)
- Rate limit per IP in MongoDB (10 per minute, 100 per day) plus a global cap of 60 per minute. Questions and answers are stored in `chat_events` for 90 days (TTL index), with ratings
- The model rejects off-topic questions and says when the docs do not cover something
- Not done: admin view of questions and votes. Conversation reset (New chat) and streaming search steps are done

## Ask AI original notes (needs team input)

Behavior we will build:

- Answers only from published docs content. Nothing outside the docs.
- Search the docs first; the model sees only the matching pages. If nothing matches, reply "not covered in the docs".
- Each answer shows its source pages.
- Anonymous visitors, so rate limit per IP.
- Server calls an OpenAI-compatible endpoint via `@ai-sdk/openai-compatible` (`baseURL` + `apiKey`). The key stays server-side.
- Logs question, page, rating in `chat_events`. Privacy note shown on the docs page.

## Ask AI blockers (need team answers)

| # | Blocker | Why it blocks | Answer |
|---|---|---|---|
| 1 | Endpoint base URL, model name, and auth method (who issues the key) | Cannot call the model without them | |
| 2 | Supports tool/function calling and streaming? | Decides the design: model-driven docs search, or server-side retrieval into the prompt | |
| 3 | Context window size | Sets how many doc pages fit in one question | |
| 4 | Rate and cost limits, monthly budget | Sets our per-IP rate limit and caps spend | |
| 5 | OK to store visitor questions in our database (retention, default 90 days)? Who approves the privacy note? | Needed before `chat_events` is enabled | |

## Progress (last updated 2026-11-16)

Done and committed on branch `bump_version/new_docs`.

- Editor blocks: 6 callout types, code title and Copy, tabs with sync, steps, cards (Lucide icons, columns, horizontal with image), accordion and Expandable, Frame (image or video), Shiki highlighting
- Copy Markdown and Open in ChatGPT, Claude, Gemini; `/docs/<slug>.md`; `/llms.txt` (`src/lib/docs-markdown.ts`, `src/app/docs/ViewOptions.tsx`)
- Search: Ctrl+K on Windows and Linux, Cmd+K on Mac (Fumadocs picks it). Index text is built at publish into `publishedVersion.search`, route `/api/search`, cache refreshed by `invalidateDocs()` in `src/lib/docs-data.ts`
- GitBook import: `scripts/import-gitbook.ts` (dry run by default, `--write` creates drafts, never overwrites). 70 pages imported, then published with the sidebar. Images still load from GitBook-hosted URLs
- Navbar (desktop and mobile) and footer Docs links now point to `/docs`

## Next steps

1. ~~Commit the work~~ DONE
2. ~~Redirects from old GitBook URLs~~ DONE in `next.config.ts` (list in `src/data/gitbook-redirects.ts`, 308, `.md` variants, `/` to `/docs`). They only fire for Host `docs.codemate.ai`, so still TODO at launch: point DNS / nginx for `docs.codemate.ai` at this app (or proxy it) and make sure nginx passes the Host header
3. ~~Add docs pages to `src/app/sitemap.ts`~~ DONE
4. Re-upload the 35 GitBook-hosted images to our storage (`CUSTOM_UPLOAD_ENDPOINT`) before GitBook is switched off, otherwise they break
5. ~~Other links still on GitBook~~ DONE: footer Refund, Privacy and Terms, HP footer and `hpData.ts`, and the Download Toolbox link now point to `/docs/...`
6. Ask AI: built (see "Ask AI as built"). Still to confirm with the team: context window, rate and cost limits, whether a dedicated key is wanted, who approves the privacy note
7. Checks not done yet: imported pages in light mode and at 375px, real media upload (only pasted links tested), Mac shortcut badge, search behaviour with several server processes in production

## Known gaps

- The big codemate.ai logo above the Overview title on GitBook is not in the page Markdown, so it did not import
- 5 steps in CORA-CLI Quick Start have no heading and show the title "Step"
- Sidebar groups repeat the page name as their first item (group "Essentials" contains page "Essentials")
- One inline icon in a changelog heading was dropped (no inline images in the editor)
- `/docs/[slug]` is dynamic, so `revalidate = 60` does not apply

## Ask AI v2 (2026-11-16)
Rebuilt on the AI SDK chat protocol with live search steps, Stop generating, Retry, Clear chat, voice input, an ask bar with Cmd/Ctrl+I, and a per-page "Was this page helpful?" vote. Details in `ASK_AI_IMPLEMENTATION.md`.

## Ask AI updates (2026-11-17)
Chat history is a sliding window of the newest 30 messages, so long chats no longer fail. Clearer error messages with Retry and New chat, 4 gateway retries, the assistant says "CodeMate AI", request body size cap, in-memory rate-limit fallback. Details in `ASK_AI_IMPLEMENTATION.md`.
