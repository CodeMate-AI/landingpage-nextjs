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

## Editor updates (2026-11-17)
- Docs toolbar uses Lucide icons; block buttons are disabled while the cursor is inside a docs block, and docs blocks cannot be nested (`NoNestedDocsBlocks` in `src/lib/docs-blocks.ts`, also blocks paste)
- Related Docs: the Ref Blogs node has a `source` attribute ("blog" or "docs"). In the docs editor it lists published pages from `/api/admin/docs` and links `/docs/<publishedVersion.slug || slug>`; the blog editor still says "Ref Blogs"
- Paste a link for images, videos and GIFs (`image-upload-node/paste-link.tsx`, http(s) validated, shared by all three nodes)
- Docs-only frame for images, GIFs and videos; images full width, iframes 16:9 (`docs-blocks.css`)
- Fixed the Related Docs modal overflow on phones (`.ref-two-col` columns in `reference-blogs-node.scss`)
- Tested: toolbar and nesting, link validation and inserts, Related Docs picker, public rendering (temporary route, since removed), no horizontal scroll at 320, 375, 768 and desktop, blog editor regression
- Not verified: real Ctrl+V into the link field (only paste isolation checked), a published page containing Related Docs, light mode and tablet outside the pages already checked. The video placeholder no longer lists MP4, YouTube, Vimeo

## Docs UI refresh (2026-11-17)
Own layout modelled on docs.pangolin.net (similar, not exact; our colours, no orange). The Fumadocs `DocsLayout` and its CSS overrides are gone. Fumadocs is still used for the search dialog (`RootProvider`), the `prose` content styles and the TOC scroll tracking.
- Layout: `src/app/docs/layout.tsx` renders `DocsHeader`, a two-column grid (`DocsSidebar` 248px | page) and the landing footer (`inDocs` keeps its Docs link in the same tab). Components are in `src/app/docs/components/`: `DocsHeader` (logo, Docs badge, search, CodeMate AI button, Website and Download links, theme toggle, Get started button), `DocsSidebar` (sticky, own scroll, no collapse button), `DocsMobileBar` (Menu drawer and On this page list below lg, 44px rows), `Toc` (xl and up), `PageNav` (previous and next), `ThemeToggle`
- Page: `src/app/docs/[slug]/page.tsx` builds its own title, label (group name), description, Copy page / Open / CodeMate AI buttons, content, previous/next and TOC. Order comes from `flattenNav` in `src/lib/docs-data.ts`
- Change links here: `LINKS` and `GET_STARTED` at the top of `DocsHeader.tsx` (Get started points to https://app.codemate.ai/download)
- Ask AI is called "CodeMate AI". A floating bar bottom-right on md and up, a round button on phones (`ask-ai/Trigger.tsx`). On lg and up the panel is a right side panel that pushes the page (`data-ai-open` on `<html>`, `.docs-shell` in `docs.css`); below lg it overlays, full-screen on phones
- Checked in the browser: 1440, 768 and 375 wide, dark and light; no sideways scroll; search lines up with the content column; Menu drawer, On this page, panel and floating button work; touch targets 44px on phones. `tsc` clean. `npm run build` passes (2026-11-18)
- The footer sits in a `relative z-0` wrapper in `layout.tsx`: the landing footer has `z-index: 999999`, which otherwise covered the floating Ask button and could overlay the sticky header. Light mode rechecked at 768 and 375 (header, Menu drawer rows 44px, button above the footer, no sideways scroll)
- Header polish: logo text is "CodeMate" (semibold) plus muted "Documentation" (no badge; the word hides below 340px). At lg and up the header is a 3-column grid so the search sits in the middle of the screen; the Ask AI button was removed from the header
- Ask AI has one entry point per screen: the floating bar (md and up) or round button (phones). The "CodeMate AI" button next to Copy was removed
- Copy/Open is a GitBook-style split button ("Copy" | chevron) on the right of the title; the menu has Copy page, View as Markdown, Open in ChatGPT / Claude / Gemini, each with a description (`ViewOptions.tsx`). No MCP "Connect" rows because there is no MCP endpoint yet
- Phone drawer has its own header (logo, CodeMate Documentation, close); sidebar top padding and scroll-into-view fixed so "Overview" starts at the top. Code block scrollbars are thin with a transparent track (`docs.css`)
- Open: the landing footer is about 1000px tall on a phone; the 35 GitBook images and other items above are unchanged


## Ask AI updates (2026-11-17)
Chat history is a sliding window of the newest 30 messages, so long chats no longer fail. Clearer error messages with Retry and New chat, 4 gateway retries, the assistant says "CodeMate AI", request body size cap, in-memory rate-limit fallback. Details in `ASK_AI_IMPLEMENTATION.md`.

## MongoDB Database & Collections Architecture (`codemate_docs`)

The documentation platform uses a dedicated MongoDB database (`codemate_docs`, configurable via `MONGODB_DOCS_DB_NAME`), completely isolated from the marketing/blog database (`rough-work`).

### Collections Overview

| Collection | Purpose | Document `_id` | Key Indexes | Data Retention |
| :--- | :--- | :--- | :--- | :--- |
| **`pages`** | Documentation pages with dual draft & published versions | `ObjectId` | `{ slug: 1 }` (unique)<br>`{ published: 1 }`<br>`{ "publishedVersion.slug": 1 }` | Persistent |
| **`nav`** | Sidebar tree hierarchy (up to 3 levels deep) | String singleton (`"main"`) | None (single document) | Persistent |
| **`chat_events`** | Ask AI questions, streaming answers, and user votes | `ObjectId` | `{ createdAt: 1 }` (TTL: 90 days) | Auto-expires after 90 days |
| **`page_feedback`** | "Was this page helpful?" votes (1 / -1) | `ObjectId` | `{ page: 1, visitorId: 1 }` (unique)<br>`{ createdAt: 1 }` (TTL: 90 days) | Auto-expires after 90 days |
| **`ask_rate`** | High-performance sliding-window rate limit counters | Composite string (e.g. `ask:m:...`) | `{ createdAt: 1 }` (TTL: 24 hours) | Auto-expires after 24 hours |

---

### 1. `pages` Collection
Stores all documentation articles. Employs a **dual-state snapshot model**: draft edits live at the root of the document, while live readers see the immutable `publishedVersion` snapshot.

```typescript
{
  _id: ObjectId("..."),
  slug: "getting-started",          // URL slug (regex: ^[a-z0-9]+(-[a-z0-9]+)*$)
  title: "Getting Started",          // Page title
  description: "Learn the basics",  // Subtitle / SEO description
  content: {                         // Tiptap JSON document tree
    type: "doc",
    content: [ ... ]
  },
  sections: [                        // Heading outlines [{ id, title, level }]
    { id: "installation", title: "Installation", level: 2 }
  ],
  published: true,                   // Whether a live version exists
  publishedAt: ISODate("..."),       // Timestamp of first or latest publish
  hasDraftChanges: false,            // True if root draft differs from publishedVersion
  publishedVersion: {                // Frozen snapshot served to public readers
    slug: "getting-started",
    title: "Getting Started",
    description: "Learn the basics",
    content: { type: "doc", content: [ ... ] },
    sections: [ ... ],
    search: {                        // Pre-computed full-text search text
      title: "Getting Started",
      headings: "Installation Usage",
      body: "..."
    }
  },
  lastModifiedBy: {
    email: "admin@codemate.ai",
    at: ISODate("...")
  },
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

### 2. `nav` Collection
Stores the sidebar hierarchy tree edited via `/admin/docs/sidebar`. A single document with `_id: "main"` holds both the staging draft and live published trees.

```typescript
{
  _id: "main",
  draft: [                           // Staged sidebar tree (NavItem[])
    { type: "page", slug: "overview" },
    {
      type: "group",
      title: "Getting Started",
      children: [
        { type: "page", slug: "quickstart" },
        { type: "page", slug: "installation" }
      ]
    }
  ],
  published: [ ... ],                // Live public sidebar tree
  updatedAt: ISODate("...")
}
```
* **Nesting Constraint**: Validated by `NavSchema` up to 3 levels deep (`page`, `group` containing pages, or `group` containing groups).

---

### 3. `chat_events` Collection
Logs queries submitted to the Ask AI streaming assistant (`/api/ask`). Updated asynchronously on stream completion and when a user clicks thumbs up/down.

```typescript
{
  _id: ObjectId("..."),              // Returned to client in start metadata for vote pairing
  question: "How do I install CLI?",// User prompt
  page: "installation",              // Slug of the page where the question was asked (or null)
  threadId: "t-1794839...",          // Conversation thread identifier
  visitorId: "v-1794839...",         // Anonymized browser visitor ID
  answer: "To install the CLI...",   // AI response (truncated to 4,000 chars)
  rating: 1,                         // 1 (helpful), -1 (unhelpful), or unset (unvoted)
  createdAt: ISODate("...")          // Auto-expires after 90 days via TTL index
}
```

---

### 4. `page_feedback` Collection
Stores votes from the "Was this page helpful?" widget at the bottom of public docs pages ([`PageFeedback.tsx`](file:///c:/Users/biswa/Desktop/CMLanding/landingpage-nextjs/src/app/docs/PageFeedback.tsx)).

```typescript
{
  _id: ObjectId("..."),
  page: "overview",                  // Target page slug
  visitorId: "v-1794839...",         // Anonymized visitor UUID
  vote: 1,                           // 1 (helpful) or -1 (unhelpful); vote 0 deletes document
  createdAt: ISODate("...")          // Auto-expires after 90 days via TTL index
}
```
* **Compound Unique Index**: `{ page: 1, visitorId: 1 }` prevents ballot stuffing by restricting each visitor to one active vote per page.

---

### 5. `ask_rate` Collection
High-performance atomic counters used by the rate limiter ([`src/lib/docs-ai/rate-limit.ts`](file:///c:/Users/biswa/Desktop/CMLanding/landingpage-nextjs/src/lib/docs-ai/rate-limit.ts)). Records automatically expire after 24 hours.

```typescript
{
  _id: "ask:m:eff8e7ca506627fe...:29915640", // Structured compound key
  n: 1,                                       // Request counter incremented via $inc
  createdAt: ISODate("...")                   // Auto-expires after 24 hours via TTL index
}
```

#### Key Formats & Prefixes:

| Pattern | Scope | Window | Purpose | Limit Config |
| :--- | :--- | :--- | :--- | :--- |
| `g:<minute>` | `g` (Global) | 1 minute | Total requests across all IPs to cap LLM bill | `DOCS_AI_GLOBAL_PER_MINUTE` (default: 60) |
| `ask:m:<hash>:<minute>` | `ask` (Ask AI) | 1 minute | Per-IP rate limit for chat questions | `DOCS_AI_RATE_LIMIT_PER_MINUTE` (default: 10) |
| `d:<hash>:<day>` | `d` (Day) | 24 hours | Daily cap per user/IP for Ask AI questions | 100 requests/day |
| `fb:m:<hash>:<minute>` | `fb` (Feedback) | 1 minute | Per-IP limit for page feedback votes | 30 requests/minute |

* `<hash>`: 32-character SHA-256 hash of client IP (raw IPs are never persisted).
* `<minute>`: Unix minute timestamp (`Math.floor(Date.now() / 60000)`).
* `<day>`: Unix day timestamp (`Math.floor(Date.now() / 86400000)`).


