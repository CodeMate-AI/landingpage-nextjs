# CodeMate AI Landing Page & CMS Portal

A modern, high-performance web application built with **Next.js 15 (App Router)** and **TypeScript**. This repository hosts the public-facing landing page and blog directory for [CodeMate AI](https://codemate.ai), alongside the **CodeMate CMS Portal**—an administrative content management system for composing, managing, and publishing rich-text technical articles.

---

## 🚀 Key Features

### 🌐 Public Landing Page & Blog
- **Interactive UI**: Rich animations with Framer Motion, GSAP, and smooth inertial scrolling via Lenis.
- **Fully Responsive**: Optimized fluid layouts across mobile, tablet, and desktop viewports.
- **Dynamic Blog Feed**: Search, tag filtering, category grouping, reading time estimation, and deep-linkable table-of-contents navigation.

### 🛡️ CodeMate CMS Admin Portal
- **Role & Route Protection**: Next.js Edge Middleware guarding all `/admin/*` routes with stateless JWT verification (`auth-token` HTTP-only cookies).
- **Brute-Force Rate Limiting**: MongoDB-backed sliding-window rate limiter (5-attempt ceiling per 15 min with TTL indexes).
- **Tiptap Rich-Text Editor**: Headless WYSIWYG editor supporting custom code blocks, inline video players, tables, blockquotes, typography, and image uploads.
- **Dual Versioning (Draft vs. Live Publish)**: Edit articles in draft mode without mutating live public snapshots (`publishedVersion`) until explicitly republished.
- **Automatic TOC Generator**: Auto-scans H2–H4 headings to create unique anchor slugs for in-article side navigation.
- **Media Asset Pipeline**: Direct multipart uploads to Cloudinary with MIME validation and size limits (5MB images / 50MB videos).
- **Dynamic Taxonomy Management**: Inline CRUD for categories, product filters, and use cases persisted in MongoDB.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15 (App Router), React 18, TypeScript 5 |
| **Styling** | Tailwind CSS, Vanilla SCSS, Radix UI Primitives |
| **Animations** | Framer Motion, GSAP, Lenis Smooth Scroll |
| **CMS & Editor** | Tiptap v3 Headless Rich-Text Engine |
| **Database** | MongoDB (Native Node.js Driver) |
| **Media Storage** | Cloudinary SDK |
| **Auth & Security** | Jose (Stateless JWT HS256), BcryptJS, MongoDB-backed Rate Limiter |
| **Validation** | Zod |

---

## 📁 Project Structure

```text
landingpage-nextjs/
├── public/                  # Static media, logos, SVGs, and brand assets
├── scripts/                 # Database initialization and seed scripts
│   ├── setup-db.ts          # MongoDB index creation (slug, TTL rate limits)
│   ├── seed-admin.ts        # Admin user creation script
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
│   ├── lib/                 # Server utilities (auth, mongodb, rateLimit, validation)
│   ├── styles/              # Global styles, variables, and typography
│   ├── types/               # TypeScript interfaces (BlogDetailPost, Tag, etc.)
│   ├── utils/               # Helper utilities (slugify, cn)
│   └── middleware.ts        # Next.js Edge route guard middleware
├── .env.example             # Environment variable template
├── package.json
└── tsconfig.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the `landingpage-nextjs` directory by copying `.env.example`:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# JWT Session Authentication
JWT_SECRET=your-secure-random-jwt-secret-minimum-32-characters

# Initial Admin Credentials (used during database seed)
ADMIN_EMAIL=admin@codemate.ai
ADMIN_PASSWORD=your-secure-password

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# External Public Contact API
NEXT_PUBLIC_CONTACT_API_URL=https://your-api-domain.com/landing/contact
```

---

## 🏁 Getting Started

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

# 2. Seed Initial Admin Account (uses ADMIN_EMAIL and ADMIN_PASSWORD from .env.local)
npx tsx scripts/seed-admin.ts

# 3. (Optional) Seed Sample Blog Articles
npx tsx scripts/seed-blogs.ts
```

### 4. Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

---

## 🔐 Admin Portal Access

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login).
2. Log in using the admin credentials created during the seed step.
3. Access the **Dashboard** (`/admin/dashboard`) to view, manage, and delete articles.
4. Access the **Editor** (`/admin/editor`) to compose or update articles with live/draft versioning.

---

## 🧪 Testing & Linting

```bash
# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```
