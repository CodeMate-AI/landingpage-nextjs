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

1. `/admin` chooser and login redirect
2. DB layer: `getDocsDatabase()`, schemas, `/api/admin/docs/*`
3. Docs admin: dashboard, tree editor, docs editor and new blocks
4. Public `/docs` on Fumadocs, then re-run screenshot check on existing pages
5. Search, Copy Markdown / Open in, Ask AI
6. Import GitBook content (under 50 pages), then switch navbar and footer Docs links

## Ask AI (needs team input)

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
