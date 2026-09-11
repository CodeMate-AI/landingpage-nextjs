# CodeMate AI Landing Page & CMS Portal

A modern, high-performance web application built with **Next.js 15 (App Router)** and **TypeScript**. This repository hosts the public-facing CodeMate AI landing page and blog directory for [CodeMate AI](https://codemate.ai), alongside the **CodeMate CMS Portal**, an administrative content management system for composing, managing, and publishing rich-text technical articles.

---

## Key Features

### Public Landing Page & Blog
- **Interactive UI**: Rich animations with Framer Motion, GSAP, and smooth inertial scrolling via Lenis.
- **Fully Responsive**: Optimized fluid layouts across smartphone, tablet, and desktop viewports.
- **Dynamic Blog Feed**: Search, tag filtering, category grouping, reading time estimation, and deep-linkable table-of-contents navigation.

### CodeMate CMS Admin Portal
- **Role and Route Protection**: Next.js Edge Middleware guarding all `/admin/*` routes with stateless JWT verification (`auth-token` HTTP-only cookies).
- **Dual-Key Brute-Force Rate Limiting**: MongoDB-backed sliding-window rate limiter (5-attempt ceiling per 15 min) providing dual protection at both the client IP level (`key: "ip:<ip>"`) and target account level (`key: "email:<email>"`).
- **Tiptap Rich-Text Editor**: Headless WYSIWYG editor supporting custom code blocks, inline video players, tables, blockquotes, typography, and image uploads.
- **Dual Versioning (Draft vs. Live Publish)**: Edit articles in draft mode without mutating live public snapshots (`publishedVersion`) until explicitly republished.
- **Smart Draft Diffing Engine**: Deeply analyzes article content, metadata, taxonomies, and outlines to display the "Draft Pending" indicator only when genuine differences exist between the draft and published version.
- **Dynamic Reading Duration Engine**: Recursively walks the Tiptap AST node tree to estimate reading time (200 wpm) automatically, with optional custom admin overrides.
- **Automatic TOC Generator**: Auto-scans H2-H4 headings to create unique anchor slugs for in-article side navigation.
- **Media Asset Pipeline**: Uploads to CodeMate custom media hosting endpoint (`https://your-api-domain.com/upload/image`) with MIME validation and size limits (5MB images / 50MB videos).
- **Dynamic Taxonomy Management**: Inline CRUD for categories, product filters, and use cases persisted in MongoDB.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15 (App Router), React 18, TypeScript 5 |
| **Styling** | Tailwind CSS, Vanilla SCSS, Radix UI Primitives |
| **Animations** | Framer Motion, GSAP, Lenis Smooth Scroll |
| **CMS & Editor** | Tiptap v3 Headless Rich-Text Engine |
| **Database** | MongoDB (Native Node.js Driver) |
| **Media Storage** | CodeMate Custom Upload Service (`https://your-api-domain.com/upload/image`) |
| **Auth & Security** | Jose (Stateless JWT HS256), BcryptJS, MongoDB-backed Dual-Key Rate Limiter |
| **Validation** | Zod |

---

## Database Architecture and Schema

The application connects to MongoDB using the official Node.js driver (`mongodb`) via a cached singleton connection pool ([`src/lib/mongodb.ts`](src/lib/mongodb.ts)). Runtime validation is enforced through Zod schemas ([`src/lib/validation.ts`](src/lib/validation.ts)).

### Database: `codemate_blog`

| Collection | Schema / Key Fields | Purpose & Indexes |
|---|---|---|
| **`blogs`** | `title`, `slug`, `category`, `tags[]`, `content` (Tiptap AST JSON), `published`, `publishedVersion`, `hasDraftChanges`, `author`, `readTime`, `sections[]`, `createdAt`, `updatedAt` | Stores articles with dual draft/live snapshots. **Indexes**: `{ slug: 1 }` (unique), `{ published: 1, publishedAt: -1 }`. |
| **`users`** | `email`, `password` (bcrypt hash), `name`, `createdAt` | Stores administrator credentials. **Index**: `{ email: 1 }` (unique). |
| **`login_attempts`** | `key` (`"ip:<ip>"` or `"email:<email>"`), `count`, `firstAttempt` | Brute-force rate limiting (5 attempts/15m). **Indexes**: `{ key: 1 }`, `{ firstAttempt: 1 }` (TTL: 900s). |
| **`filter_options`** | `_id: "global_filters"`, `categories[]`, `productFilters[]`, `useCaseFilters[]` | Dynamic taxonomy configuration document for article filters and categories. |

### Schema & Data Validation Flow
1. **Client / Admin Editor**: Form data and Tiptap AST JSON are submitted to `/api/admin/posts`.
2. **Runtime Zod Validation**: `BlogPostSchema` validates field presence, tone enums, and unique TOC anchor IDs.
3. **Draft vs. Live Versioning**: Drafts update `content` without touching `publishedVersion`; publishing creates a live snapshot in `publishedVersion`.
4. **Smart Status Evaluation**: `hasActualDraftChanges` compares draft AST content and metadata against `publishedVersion` to accurately manage the "Draft Pending" state.

---

## Project Structure

```text
landingpage-nextjs/
├── public/                  # Static media, logos, SVGs, and brand assets
├── scripts/                 # Database initialization and seed scripts
│   ├── setup-db.ts          # MongoDB index creation (slug, TTL rate limits)
│   ├── seed-admin.ts        # Admin user creation script (syncs .env credentials)
│   └── seed-blogs.ts        # Starter blog articles seed script
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/           # Admin pages (login, dashboard, editor)
│   │   ├── api/             # Backend API routes (/api/admin/*)
│   │   ├── blog/            # Public blog feed and [slug] reader views
│   │   ├── contact/         # Contact page
│   │   ├── download/        # Download page
│   │   └── pricing/         # Pricing tiers and checkout components
│   ├── components/          # Reusable UI & Tiptap editor components
│   │   ├── tiptap-templates/# SimpleEditor workspace layout
│   │   ├── tiptap-node/     # Custom nodes (VideoNode, ImageNode, CodeBlock)
│   │   └── ui/              # Buttons, modals, carousels, cards
│   ├── hooks/               # Custom hooks (window size, breakpoints, editor)
│   ├── lib/                 # Server utilities (auth, mongodb, rateLimit, validation, blog-compiler)
│   ├── styles/              # Global styles, variables, and typography
│   ├── types/               # TypeScript interfaces (BlogDetailPost, Tag, etc.)
│   ├── utils/               # Helper utilities (slugify, cn)
│   └── middleware.ts        # Next.js Edge route guard middleware
├── .env.example             # Environment variable template
├── package.json
└── tsconfig.json
```

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

### Example `.env.local`

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# JWT Session Authentication
JWT_SECRET=your-secure-random-jwt-secret-minimum-32-characters

# Initial Admin Credentials (seeded into MongoDB)
ADMIN_EMAIL=admin@codemate.ai
ADMIN_PASSWORD=your-secure-password

# Custom Media Upload Endpoint
CUSTOM_UPLOAD_ENDPOINT=https://your-api-domain.com/upload/image

# External Public Contact API
NEXT_PUBLIC_CONTACT_API_URL=https://your-api-domain.com/landing/contact
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v18.17+` or `v20+`
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
2. **Managing Credentials**:
   - Authentication verifies against bcrypt-hashed passwords in the MongoDB `users` collection.
   - If you modify `ADMIN_EMAIL` or `ADMIN_PASSWORD` in your `.env.local`, re-run `npx tsx scripts/seed-admin.ts` or update the record in MongoDB to sync credentials.
3. **Workspace Navigation**:
   - **Dashboard** (`/admin/dashboard`): View articles, review real-time publication badges, and perform safe deletions.
   - **Editor** (`/admin/editor`): Author articles with real-time auto-save, tag deduplication, taxonomy controls, and live preview.

---

## Testing & Linting

```bash
# Run TypeScript type check
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```
