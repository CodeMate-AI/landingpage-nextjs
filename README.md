# CodeMate AI Landing Page & CMS Portal

A modern, high-performance web application built with **Next.js 16 (App Router)** and **TypeScript**. This repository hosts the public-facing CodeMate AI landing page, HP partnership showcase, community project gallery, and blog directory for [CodeMate AI](https://codemate.ai), alongside the **CodeMate CMS Portal**, an administrative content management system for composing, managing, and publishing rich-text technical articles.

---

## Key Features

### Public Landing Page & Suites
- **Interactive UI**: Rich animations with Framer Motion, GSAP, and smooth inertial scrolling via Lenis.
- **Announcement Banner**: Sticky banner highlighting the SWE-bench SOTA achievement and limited offers.
- **Dynamic Frosted-Glass Navbars**: Custom mega-menus for Products, Open-Source and Resources (**Docs**, **Blogs**, **Media**, **Community**, **Achievements**), plus Pricing and Partnerships (**HP**).
- **Achievements Carousel**: Auto-sliding carousel housing major milestones and summit achievements with slide controls.
- **HP x CodeMate AI Landing Page (`/partnerships/hp`)**: Dedicated partnership page featuring product guides, interactive video demonstrations, and an exclusive trial registration form.
- **Community Showcase (`/community`)**: Live gallery of production-grade platforms shipped autonomously using CodeMate AI. Includes responsive video modal previews with touch shielding, PDF documentation viewer, and category filtering.
- **Dynamic Pricing Engine (`/pricing`)**: Interactive plan cards, custom credit builders, trial banners, and product matrix comparisons.
- **Technical Blog (`/blog` & `/blog/[slug]`)**: Dynamic blog feed with search, tag filtering, category grouping, reading time estimation, and deep-linkable table-of-contents navigation.

### Documentation Site (`/docs`)
- **First-party docs**: Fumadocs UI with sidebar, table of contents, full-text search, light/dark toggle, and legacy GitBook redirects. Pages are written in the admin panel (`/admin/docs`) with the Tiptap editor, with a draft then publish flow and a drag-and-drop sidebar tree.
- **Ask AI**: an assistant panel (header button, bottom ask bar, or Cmd/Ctrl+I). It searches and reads the published docs itself through tool calling, streams a grounded answer with links, and says "This is not covered in the docs." otherwise. It keeps the newest 30 messages of the conversation (older turns drop off), supports Stop, Retry, New chat, thumbs votes and browser voice input.
- **Page feedback**: a "Was this page helpful?" vote per page.
- **Docs analytics (`/admin/docs/analytics`)**: page votes, Ask AI questions over time, every chat with its tool calls and answer ratings, and the answers rated not helpful, for a range kept in the URL (24h, 7d, 30d, 90d or custom dates, up to 90 days).
- **Ask AI settings (`/admin/docs/settings`)**: the admin sets the Ask AI rate limits (questions per visitor per minute and per day, ratings per visitor per minute, questions overall per minute) and sees the last 24 hours of traffic against each one. Changes apply on every server within 15 seconds; there are no env variables for these limits.

### CodeMate CMS Admin Portal
- **Role and Route Protection**: Strict tab-isolated session architecture with client-side `AdminLayout` route guards and the Next.js proxy (`src/proxy.ts`, formerly middleware) protecting `/api/admin/*` routes via stateless `Authorization: Bearer <token>` JWT authentication (`sessionStorage`).
- **Dual-Key Brute-Force Rate Limiting**: MongoDB-backed sliding-window rate limiter (5-attempt ceiling per 15 min) providing dual protection at both the client IP level (`key: "ip:<ip>"`) and target account level (`key: "email:<email>"`).
- **Tiptap Rich-Text Editor**: Headless WYSIWYG editor supporting custom code blocks, inline video players, tables, blockquotes, typography, and image uploads.
- **Dual Versioning (Draft vs. Live Publish)**: Edit articles in draft mode without mutating live public snapshots (`publishedVersion`) until explicitly republished.
- **Smart Draft Diffing Engine**: Deeply analyzes article content, metadata, taxonomies, and outlines to display the "Draft Pending" indicator only when genuine differences exist between the draft and published version.
- **Dynamic Reading Duration Engine**: Recursively walks the Tiptap AST node tree to estimate reading time (200 wpm) automatically, with optional custom admin overrides.
- **Automatic TOC Generator**: Auto-scans H2-H4 headings to create unique anchor slugs for in-article side navigation.
- **Media Asset Pipeline**: Uploads to CodeMate custom media hosting endpoint (`https://backend.codemate.ai/upload/image`) with MIME validation and size limits (5MB images / 15MB GIFs / 50MB videos).
- **Dynamic Taxonomy Management**: Inline CRUD for categories, product filters, and use cases persisted in MongoDB.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4 (theme in `tailwind.config.mts` via `@config`), Vanilla SCSS, Radix UI Primitives |
| **Animations** | Framer Motion 14, GSAP 3, Lenis 1.3 Smooth Scroll |
| **CMS & Editor** | Tiptap v3 Headless Rich-Text Engine |
| **Database** | MongoDB (Native Node.js Driver) |
| **Docs & Ask AI** | Fumadocs 16, Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`) |
| **Media Storage** | CodeMate Custom Upload Service (`https://backend.codemate.ai/upload/image`) |
| **Auth & Security** | Jose (Stateless JWT HS256 Bearer Tokens in `sessionStorage`), BcryptJS, Dual-Key Rate Limiter |
| **Validation** | Zod |
| **Analytics** | Google Analytics 4 |

---

## Database Architecture and Schema

The application connects to MongoDB using the official Node.js driver (`mongodb`) via a cached singleton connection pool ([`src/lib/mongodb.ts`](src/lib/mongodb.ts)). Runtime validation is enforced through Zod schemas ([`src/lib/validation.ts`](src/lib/validation.ts)).

The blog, admin users and login rate limits live in `codemate_blog`. The docs site and Ask AI use a second database, `codemate_docs` (see below).

### Database: `codemate_blog`

| Collection | Schema / Key Fields | Purpose & Indexes |
|---|---|---|
| **`blogs`** | `title`, `slug`, `category`, `tags[]`, `content` (Tiptap AST JSON), `published`, `publishedVersion`, `hasDraftChanges`, `author`, `readTime`, `sections[]`, `createdAt`, `updatedAt` | Stores articles with dual draft/live snapshots. **Indexes**: `{ slug: 1 }` (unique), `{ published: 1, publishedAt: -1 }`. |
| **`users`** | `email`, `password` (bcrypt hash), `tokenVersion`, `name`, `createdAt` | Stores administrator credentials. **Index**: `{ email: 1 }` (unique). |
| **`login_attempts`** | `key` (`"ip:<ip>"` or `"email:<email>"`), `count`, `firstAttempt` | Brute-force rate limiting (5 attempts/15m). **Indexes** (created by `scripts/setup-db.ts`): `{ key: 1 }` (unique), `{ ip: 1, email: 1 }` (older records), `{ firstAttempt: 1 }` (TTL: 900s). |
| **`filter_options`** | `_id: "global_filters"`, `categories[]`, `productFilters[]`, `useCaseFilters[]` | Dynamic taxonomy configuration document for article filters and categories. |

### MongoDB Collections Reference Map

| Collection | File Name | Line Number | Operation / Context |
| :--- | :--- | :--- | :--- |
| **`users`** | `src/lib/authWrapper.ts` | Line 22 | `findOne` (validate token session & tokenVersion) |
| **`users`** | `src/app/api/admin/login/route.ts` | Line 48 | `findOne` (find user by email) |
| **`users`** | `src/app/api/admin/login/route.ts` | Line 63 | `updateOne` (seed / initialize tokenVersion) |
| **`users`** | `src/app/api/admin/logout/route.ts` | Line 13 | `updateOne` (increment tokenVersion to logout) |
| **`blogs`** | `src/app/blog/page.tsx` | Line 30 | `countDocuments` (total published posts) |
| **`blogs`** | `src/app/blog/page.tsx` | Line 33 | `find` (fetch published posts for SSR) |
| **`blogs`** | `src/app/blog/[slug]/page.tsx` | Line 21 | `find` (generate static params slugs) |
| **`blogs`** | `src/app/blog/[slug]/page.tsx` | Line 37 | `findOne` (fetch single published article) |
| **`blogs`** | `src/app/blog/[slug]/page.tsx` | Line 49 | `find` (fetch related blog articles) |
| **`blogs`** | `src/app/sitemap.ts` | Line 86 | `find` (fetch slugs for sitemap generation) |
| **`blogs`** | `src/app/api/posts/route.ts` | Line 70 | `countDocuments` (search/filtered count) |
| **`blogs`** | `src/app/api/posts/route.ts` | Line 73 | `find` (fetch paginated/filtered posts) |
| **`blogs`** | `src/app/api/admin/posts/route.ts` | Line 22 | `countDocuments` (admin total count) |
| **`blogs`** | `src/app/api/admin/posts/route.ts` | Line 25 | `find` (admin paginated post list) |
| **`blogs`** | `src/app/api/admin/posts/route.ts` | Line 146 | `insertOne` (create new blog post) |
| **`blogs`** | `src/app/api/admin/posts/[id]/route.ts` | Line 20 | `findOne` (fetch single post by ID for editor) |
| **`blogs`** | `src/app/api/admin/posts/[id]/route.ts` | Line 47 | `findOne` (check existing post before update) |
| **`blogs`** | `src/app/api/admin/posts/[id]/route.ts` | Line 88 | `findOne` (slug collision verification) |
| **`blogs`** | `src/app/api/admin/posts/[id]/route.ts` | Line 201 | `updateOne` (update blog post content / draft) |
| **`blogs`** | `src/app/api/admin/posts/[id]/route.ts` | Line 234 | `findOne` (check post existence before delete) |
| **`blogs`** | `src/app/api/admin/posts/[id]/route.ts` | Line 236 | `deleteOne` (delete blog post by ID) |
| **`filter_options`** | `src/app/blog/page.tsx` | Line 41 | `findOne` (fetch `global_filters` for sidebar) |
| **`filter_options`** | `src/app/api/admin/filters/route.ts` | Line 44 | `findOne` (fetch current `global_filters`) |
| **`filter_options`** | `src/app/api/admin/filters/route.ts` | Line 53 | `insertOne` (seed default filters if not found) |
| **`filter_options`** | `src/app/api/admin/filters/route.ts` | Line 110 | `updateOne` (update filter categories) |
| **`login_attempts`** | `src/lib/rateLimit.ts` | Line 20 | `find` (read the IP and email attempt counters) |
| **`login_attempts`** | `src/lib/rateLimit.ts` | Line 37 | `findOne` (check recent failed attempts) |
| **`login_attempts`** | `src/lib/rateLimit.ts` | Line 63 | `updateOne` (increment attempt count) |
| **`login_attempts`** | `src/lib/rateLimit.ts` | Line 70 | `updateOne` (set lock until timestamp) |
| **`login_attempts`** | `src/lib/rateLimit.ts` | Line 84 | `deleteMany` (clear records on successful login) |

---

## Performance Optimizations

1. **GPU-Accelerated Card Animations**: Showcase and featured cards leverage `transform-gpu` and targeted CSS transitions (`transition-[border-color,box-shadow]`) to prevent layout thrashing and maintain silky 60fps scrolling.
2. **Responsive Video Modal Containment**: Video modals enforce strict 16:9 aspect ratios across viewports with touch shields on mobile/tablet and full interactive controls on desktop.
3. **Lazy Resource Activation**: Heavy GIFs are frozen into light Canvas frames using `SmartGif` and only activated on hover or direct viewport interaction.
4. **Unified Event Listeners**: Window resize, viewport breakpoints, and parallax scroll handlers are consolidated into singular hooks to prevent layout shifting and state churn.
5. **Lazy-Loaded Analytics**: Google Analytics scripts are injected asynchronously post-mount.

---

## SEO and Discoverability

The website automatically enforces modern technical SEO standards across all routes:
1. **Dynamic Sitemap Indexing (`/sitemap.xml`)**: Generated dynamically via `src/app/sitemap.ts` covering all primary static routes (`/`, `/partnerships/hp` and its use-case pages, `/pricing`, `/download`, `/devbox`, `/contact`, `/blog`, `/community`, `/achievements`, `/media`), dynamic blog post slugs (`/blog/[slug]`) and published docs pages (`/docs/[slug]`).
2. **Crawl Directives (`/robots.txt`)**: Generated by `src/app/robots.ts`, allowing indexing except `/api/` and pointing search engines directly to `https://codemate.ai/sitemap.xml`.
3. **Structured Data (JSON-LD)**: Injected via root layout (`src/app/layout.tsx`) using Schema.org `SoftwareApplication` definitions for rich search snippets.
4. **OpenGraph and Twitter Card Metadata**: Dedicated server layout definitions across root, `/partnerships/hp`, `/community`, and `/blog`.
5. **Canonical URL Protection**: Explicit canonical tags on every route to prevent duplicate content indexing.

---

## Project Structure

```text
landingpage-nextjs/
├── public/                  # Brand assets, static mocks, PDFs, and logos
├── scripts/                 # Database setup, seed and check scripts (gitignored: kept locally, not in the repo)
│   ├── setup-db.ts          # MongoDB index creation (slug, TTL rate limits)
│   ├── seed-admin.ts        # Admin user creation script (syncs .env credentials)
│   ├── seed-blogs.ts        # Starter blog articles seed script
│   └── setup-docs-db.ts     # Indexes for the codemate_docs database
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/           # Admin pages: Blogs/Docs chooser, login, blog dashboard and editor, docs/ (pages, editor, sidebar, analytics, settings)
│   │   ├── api/             # Backend API routes (/api/admin/*, /api/posts, etc.)
│   │   ├── achievements/    # Achievements page
│   │   ├── blog/            # Public blog feed and [slug] reader views
│   │   ├── community/       # Community showcase page
│   │   ├── docs/            # Docs site (Fumadocs) and the Ask AI panel (docs/ask-ai/)
│   │   ├── contact/         # Contact page
│   │   ├── devbox/          # Dev Box scroll film page
│   │   ├── media/           # Media showcase page
│   │   ├── download/        # Download page
│   │   ├── partnerships/    # Partnership pages: hp (bespoke subsite with promo and use-case pages)
│   │   ├── pricing/         # Pricing tiers and checkout components
│   │   ├── page.tsx         # Main Landing Page client component
│   │   ├── layout.tsx       # Root layout with SEO metadata & Analytics
│   │   ├── globals.css      # Core style tokens & keyframe animations
│   │   └── sitemap.ts       # Dynamic sitemap indexer
│   ├── components/          # Reusable UI & Tiptap editor components
│   │   ├── admin/           # Shared admin pieces (AdminPagination, page sizes)
│   │   ├── tiptap-templates/# SimpleEditor workspace layout
│   │   ├── tiptap-node/     # Custom nodes (VideoNode, ImageNode, CodeBlock)
│   │   └── ui/              # Buttons, modals, carousels, cards
│   ├── hooks/               # Custom hooks (window size, breakpoints, editor)
│   ├── lib/                 # Server utilities (auth, mongodb, rateLimit, validation, blog-compiler, docs-*)
│   │   └── docs-ai/         # Ask AI server code (model, prompt, tools, messages, rate-limit, limits)
│   ├── styles/              # Global styles, variables, and typography
│   ├── types/               # TypeScript interfaces (BlogDetailPost, Tag, etc.)
│   ├── utils/               # Helper utilities (slugify, cn)
│   └── proxy.ts             # Next.js proxy (renamed middleware): admin route guard
├── .env.example             # Environment variable template
├── package.json
└── tsconfig.json
```

### Database: `codemate_docs`

| Collection | Holds | Retention |
|---|---|---|
| **`pages`** | Docs pages: slug (unique), title, Tiptap content, published snapshot, draft flag | |
| **`nav`** | Sidebar tree, draft and published copies | |
| **`chat_events`** | Ask AI question, page, thread and visitor id, answer, thumbs rating, `tools` (the `search_docs` / `read_page` calls behind each answer) | 90 days (TTL) |
| **`chat_threads`** | One running total per Ask AI chat (`_id` is the threadId, or the event id of a question saved without one): first question and page, visitor id, `firstAt`, `lastAt`, `questions`, `up`, `down`, `hasUp`, `hasDown`. Kept by `/api/ask` and `/api/ask/feedback` so the chats table never scans `chat_events` | 90 days after `lastAt` (TTL) |
| **`question_counts`** | Ask AI questions per 15-minute slot (`_id` and `at` are the slot start), read by the analytics chart and totals | 90 days (TTL on `at`) |
| **`page_feedback`** | "Was this page helpful?" vote per visitor and page; `createdAt` is the first vote, `updatedAt` the latest change | 90 days (TTL, from the first vote) |
| **`ask_rate`** | Hashed-IP counters for Ask AI rate limits, plus `b:<limit>:<minute>` counts of turned-away requests | 1 day (TTL) |
| **`settings`** | `_id: "ask_rate_limits"`: the Ask AI limits saved in `/admin/docs/settings`, with who saved them and when; the defaults in `src/lib/docs-ai/limits.ts` apply until the first save. | |

Create the docs indexes with `npx tsx scripts/setup-docs-db.ts`. The Ask AI collections also create their own indexes on first use.

The docs analytics page (`/admin/docs/analytics`) reads `page_feedback` and `chat_events` live and the chat totals from `chat_threads` and `question_counts` (`src/lib/docs-chat-rollups.ts` creates their indexes and, when `chat_events` holds chats older than the oldest total, as on the first analytics request after they ship, builds them from the stored events). It relies on the indexes `chat_events` `{ threadId: 1, createdAt: 1 }`, `{ rating: 1, createdAt: -1 }`, `{ visitorId: 1, createdAt: -1 }` and `page_feedback` `{ updatedAt: 1 }`; the app creates them (and fills `updatedAt` on older votes) on the first analytics request, and `setup-docs-db.ts` creates them too.

---

## Environment Variables

Create a `.env.local` file in the `landingpage-nextjs` directory by copying `.env.example`:

```bash
cp .env.example .env.local
```

### Configuration Breakdown

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | **Yes** | MongoDB connection string (`codemate_blog` database for articles, taxonomies, and admin users). |
| `JWT_SECRET` | **Yes** | Secret key for signing and verifying stateless session tokens with `jose` (minimum 32 characters). |
| `ADMIN_EMAIL` | **Yes** | Administrator account email used by `seed-admin.ts` to initialize/update MongoDB credentials. |
| `ADMIN_PASSWORD` | **Yes** | Administrator account password used by `seed-admin.ts` to initialize/update MongoDB credentials. |
| `CUSTOM_UPLOAD_ENDPOINT` | **Yes** | Custom backend endpoint for media asset and image uploads in the CMS editor. |
| `NEXT_PUBLIC_CONTACT_API_URL` | **Yes** | External API endpoint for public contact form submissions. |
| `MONGODB_DB_NAME` / `MONGODB_DOCS_DB_NAME` | No | Database names (default `codemate_blog` and `codemate_docs`). |
| `DOCS_AI_BASE_URL` | For Ask AI | OpenAI-compatible gateway base URL (the SDK appends `/chat/completions`). Server only. |
| `DOCS_AI_TOKEN` | For Ask AI | Sent as the `authorization` header, include the `Bearer ` prefix. Server only. |
| `DOCS_AI_API_KEY` | For Ask AI | Sent as the `api-key` header; must be non-empty. Server only. |
| `DOCS_AI_MODEL` | No | Model name, default `bodh-b0`. Server only. |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL for metadata; falls back to Netlify's `DEPLOY_PRIME_URL` / `URL`. |
| `GOOGLE_TRIAL_FORM_URL` | No | Google Form that receives the HP trial form (`/api/submit-trial`); a built-in form URL is the default. |
| `NEXT_PUBLIC_IAM_API_URL` | No | Identity API used by the HP promo page, default `https://api.identity.codemate.ai`. |

The `DOCS_AI_*` values are read only in server code and never reach the browser. Without them the Ask AI endpoint answers 503 and the rest of the site is unaffected.

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v20.9+` (required by Next.js 16)
- **Package Manager**: `npm` or `bun`
- **Database**: Active MongoDB cluster (local or MongoDB Atlas)

### 2. Installation

```bash
cd landingpage-nextjs
npm install
```

### 3. Database Initialization & Seeding

Run the database setup script to create required collections and indexes (unique slug constraints, rate-limit TTL indexes):

```bash
# 1. Initialize MongoDB Indexes
npx tsx scripts/setup-db.ts

# 2. Seed Admin Account into MongoDB (uses ADMIN_EMAIL and ADMIN_PASSWORD from .env.local)
npx tsx scripts/seed-admin.ts

# 3. (Optional) Seed Sample Blog Articles
npx tsx scripts/seed-blogs.ts

# 4. Initialize the docs database indexes (the docs and Ask AI routes also create their own on first use)
npx tsx scripts/setup-docs-db.ts
```

### 4. Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the CodeMate AI landing page.

---

## Admin Portal Access & Credential Management

1. **Accessing the Portal**:
   - Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login).
   - Enter the admin email and password seeded in your database.
   - Authentication issues a stateless JWT Bearer token stored in `sessionStorage` for strict tab isolation.
2. **Managing Credentials**:
   - Authentication verifies against bcrypt-hashed passwords in the MongoDB `users` collection.
   - If you modify `ADMIN_EMAIL` or `ADMIN_PASSWORD` in your `.env.local`, re-run `npx tsx scripts/seed-admin.ts` or update the record in MongoDB to sync credentials.
3. **Workspace Navigation**:
   - **Dashboard** (`/admin/dashboard`): View articles, review real-time publication badges, and perform safe deletions.
   - **Editor** (`/admin/editor`): Author articles with real-time auto-save, tag deduplication, taxonomy controls, and live preview.
   - **Admin home** (`/admin`): chooser between Blogs and Docs, behind the same login.
   - **Docs** (`/admin/docs`): docs page list, page editor (`/admin/docs/editor`), sidebar editor (`/admin/docs/sidebar`), analytics (`/admin/docs/analytics`) and Ask AI settings (`/admin/docs/settings`).
4. **Session Security & Tab Isolation**:
   - Sessions are tab-isolated via `sessionStorage` and Bearer tokens. Opening admin URLs in a new browser tab requires authenticating on that tab, preventing unauthorized cross-tab session leakage.

---

## Testing & Build

```bash
# Run TypeScript type check
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```
