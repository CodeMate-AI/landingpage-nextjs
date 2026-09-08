# CodeMate AI Landing Page

The official web application and marketing platform for [CodeMate AI](https://codemate.ai) - the sovereign AI pair programmer and developer intelligence platform. Built with Next.js 15 App Router, TypeScript, and modern animation libraries to deliver an enterprise-grade, high-performance, and responsive web experience.

---

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript%205-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/GSAP%203-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
</p>

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server-Side Rendering (SSR) & Static Site Generation (SSG) |
| **Language** | TypeScript 5 | End-to-end type safety and strict schema validation |
| **Styling** | Tailwind CSS 3.4 | Utility-first responsive design tokens and dark mode styling |
| **Animation** | Framer Motion 11 & GSAP 3 | Hardware-accelerated UI transitions and parallax effects |
| **Smooth Scroll** | Lenis | Inertia-based smooth scrolling experience across devices |
| **Typography** | Montserrat (next/font) | Self-hosted Google font with font-display swap optimization |
| **Analytics** | Google Analytics 4 | Defer-loaded client analytics without blocking main thread |

---

## Key Features and Pages

* **Homepage (`/`)**:
  * Sovereign AI Hero section with dynamic gradient animations and interactive badge notifications.
  * Interactive Product Suite showcase for CodeMate Build, CORA, Work, and Academy.
  * Zero-CLS Infinite Partner Marquee showcasing global developer and enterprise trust.
  * Platform Capabilities showcase highlighting Figma-to-code, custom AI skills, and PR review automation.
  * Performance metrics and deferred-load video showcase.
  * Seamless IDE environment carousel featuring autocompletion and code review workflows.
  * Global recognition and achievements carousel.
* **Pricing (`/pricing`)**: Tiered plans for individual developers, teams, and enterprise deployments.
* **Contact (`/contact`)**: Enterprise demo and inquiry form with automated international country code detection.
* **Blog (`/blog`, `/blog/[slug]`)**: Static and SSG technical articles with SEO metadata.
* **Download (`/download`)**: Direct distribution access for CodeMate tools and IDE extensions.
* **Dynamic SEO**: Integrated Schema.org JSON-LD structured data, dynamic `sitemap.xml`, and `robots.txt`.

---

## Project Structure

```
landingpage-nextjs/
├── public/                     # Static media, SVG logos, brand assets, and icons
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── layout.tsx          # Root layout with SEO metadata & Analytics
│   │   ├── page.tsx            # Main homepage client component
│   │   ├── globals.css         # Global styles and Tailwind directives
│   │   ├── robots.ts           # Dynamic robots.txt generation
│   │   ├── sitemap.ts          # Dynamic sitemap.xml generation
│   │   ├── blog/               # Blog catalog and dynamic article routes
│   │   ├── contact/            # Enterprise inquiry and contact form
│   │   ├── download/           # Download and client distribution page
│   │   └── pricing/            # Pricing tiers and event promotion popups
│   ├── components/             # Reusable modular UI components
│   │   ├── navbar.tsx          # Responsive navigation with mega-menu dropdowns
│   │   ├── footer.tsx          # Structured footer with AI evaluation prompt actions
│   │   ├── video.tsx           # IntersectionObserver-based YouTube lazy player
│   │   ├── achivements.tsx     # Milestone achievements carousel
│   │   ├── SeamlessCarousel.tsx# Interactive IDE environment carousel
│   │   ├── Analytics.tsx       # Defer-loaded analytics tracking
│   │   └── ui/                 # Atomic UI primitives and animation containers
│   └── utils/                  # Helper utilities and class merge functions
├── .env.example                # Environment variables template
├── next.config.ts              # Next.js build configuration
├── tailwind.config.ts          # Tailwind theme tokens and custom breakpoints
└── package.json                # Project dependencies and run scripts
```

---

## Getting Started

### Prerequisites

* **Node.js**: Version 18.18.0 or higher
* **Package Manager**: `npm` or `bun`

### Installation and Setup

1. Clone the repository and navigate to the project directory:
   ```bash
   cd landingpage-nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set your API endpoint:
   ```env
   NEXT_PUBLIC_CONTACT_API_URL=https://your-api-domain.com/landing/contact
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build and Production

To generate an optimized static production build:

```bash
npm run build
```

To run the production server locally:

```bash
npm run start
```

---

## Core Web Vitals and Performance Optimizations

1. **Zero Cumulative Layout Shift (CLS)**: All logos and SVGs are configured with native aspect ratios and explicit dimension attributes to prevent browser layout reflows.
2. **IntersectionObserver Video Deferral**: The YouTube iframe API and video streams are deferred until the user scrolls near the video section, saving over 2 MB of initial network payload.
3. **Font Display Swap**: Google Fonts are loaded with `display: swap` and automatic preloading to eliminate Flash of Invisible Text (FOIT) and optimize First Contentful Paint (FCP).
4. **Deferred 3rd-Party Scripts**: Google Analytics and tag managers load via `lazyOnload` strategies to preserve main-thread responsiveness during initial render.
