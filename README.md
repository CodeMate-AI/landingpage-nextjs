# 📦 CMLanding – CodeMate AI Marketing Page

**CMLanding** is the official marketing and landing page for [CodeMate AI](https://codemate.ai) — a state-of-the-art, AI-powered coding assistant platform. The repository contains a fully responsive, animation-rich, high-performance website designed to showcase CodeMate's products, achievements, media presence, customer testimonials, and pricing structures.

---

## 🧰 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15.1.9 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 + CSS Modules / Vanilla CSS |
| **Animations** | Framer Motion 11 + GSAP 3 |
| **Smooth Scroll** | Lenis 1.2.1 |
| **Video Integration** | `next-video` |
| **Fonts** | Montserrat & Mulish (via `next/font`) |
| **Analytics** | Google Analytics 4 |
| **Build Tool** | npm / Bun |

---

## 📄 Key Features & Sections

- **Announcement Banner**: Promotional banner highlighting SWE-bench SOTA achievement and limited offers.
- **Dynamic Frosted-Glass Navbars**: Custom mega-menu support for Products, Open-Source, and Resources with active drop-downs on desktop and slider overlays on mobile.
- **Scroll-Linked Parallax Showcase**: "What You'll Unlock" horizontal scroll deck linked via Framer Motion's `useScroll` + `useTransform`.
- **Achievements Carousel**: Auto-sliding carousel housing 30+ major milestones and summit achievements with slide controls.
- **Partners Marquee**: Infinite-marquee animations displaying code integration partners and ecosystems.
- **Testimonials Deck**: Smooth, staggered entrance animations for customer recommendation cards.
- **Media Coverage**: Custom carousel highlighting press and publication presence from top media houses.

---

## 🗂️ Project Structure

```
CMLanding/
└── landingpage-nextjs/
    ├── public/                  # Brand assets, static mocks, and logos
    ├── src/
    │   ├── app/                 # App Router
    │   │   ├── page.tsx         # Main Landing Page client component
    │   │   ├── layout.tsx       # Layout with SEO metadata & Analytics
    │   │   ├── globals.css      # Core style tokens & keyframe animations
    │   │   ├── pricing/         # Pricing sub-route page & custom components
    │   │   └── download/        # Download sub-route page
    │   ├── components/          # Reusable react components
    │   │   ├── achivements.tsx  # Achievements slideshow
    │   │   ├── media-presence.tsx # Media slider
    │   │   └── ui/              # 46 primitive animated UI components (Bento, Terminals, Gradients, etc.)
    │   └── utils/               # Tailwind merge helpers
    ├── package.json             # Dependencies & scripts
    ├── next.config.ts           # Next.config
    └── tailwind.config.ts       # Custom Tailwind theme tokens & screens
```

---

## 🚀 Getting Started

### Prerequisites

You will need **Node.js (v18+)** and **npm** (or **Bun**) installed.

### Setup and Installation

1. Navigate to the project root:
   ```bash
   cd landingpage-nextjs
   ```

2. Install the project dependencies:
   ```bash
   npm install
   # or using bun
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🛠️ Build and Deploy

To create an optimized production build of the website:

```bash
npm run build
```

The static output will be compiled inside the `.next` directory.

---

## ⚡ Performance Optimizations

1. **Lazy Resource Activation**: Using the `SmartGif` component, heavy GIFs are frozen into light Canvas frames and only activated on hover or direct viewport interaction.
2. **Unified Event Listeners**: Window resize, viewport breakpoints, and parallax scroll handlers are consolidated into singular hooks to prevent layout shifting and state churn.
3. **Lazy-Loaded Analytics**: Google Analytics scripts are injected asynchronously post-mount.
