# CodeMate AI Landing Page

This repository contains the landing page for [CodeMate AI](https://codemate.ai), an AI-powered coding assistant platform. The site is built to be fast, responsive, and visually rich across mobile, tablet, and desktop devices.

## Overview

The landing page showcases:

- Product suites and core capabilities
- Major achievements and summit highlights
- Media coverage and public presence
- Customer testimonials and social proof
- Pricing and conversion-focused sections

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 with the App Router |
| Language | TypeScript |
| Styling | Tailwind CSS and custom CSS |
| Animations | Framer Motion and GSAP |
| Smooth Scrolling | Lenis |
| Video | `next-video` |
| Fonts | `next/font` |
| Package Manager | npm / Bun |

## Project Structure

```text
landingpage-nextjs/
├── public/                  # Static assets, logos, media, and icons
├── scripts/                 # Database setup and seed scripts
├── src/
│   ├── app/                 # App Router pages, layouts, API routes, and shared UI
│   │   ├── admin/           # Admin dashboard, editor, and login pages
│   │   ├── api/             # Admin API routes for auth, posts, filters, and uploads
│   │   ├── blog/            # Blog feed and blog post routes
│   │   ├── contact/         # Contact page
│   │   ├── download/        # Download page
│   │   └── pricing/         # Pricing page and components
│   ├── context/             # Theme and store context
│   └── middleware.ts        # Route protection and auth middleware
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm or Bun

### Installation

```bash
cd landingpage-nextjs
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

## Notes

- The site is designed with responsive behavior for mobile, tablet, and desktop layouts.
- Public assets and media are stored in the [`public/`](landingpage-nextjs/public) directory.
- Admin, blog, pricing, contact, and download routes are included in the application.
