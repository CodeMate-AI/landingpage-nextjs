# 📦 CodeMate AI Landing Page

This is the codebase for [CodeMate AI's](https://codemate.ai) landing page — a state-of-the-art, AI-powered coding assistant platform. The repository contains a fully responsive, animation-rich, high-performance website showcasing CodeMate's product suites, achievements, media presence, customer testimonials, community projects, and pricing structures.

---

## 🧰 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15.1.9 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 + CSS Modules / Vanilla CSS |
| **Animations** | Framer Motion 11 + GSAP 3 |
| **Smooth Scroll** | Lenis 1.2.1 |
| **State Management** | Redux Toolkit & React Context |
| **Video Integration** | `next-video` |
| **Fonts** | Montserrat & Mulish (via `next/font`) |
| **Analytics** | Google Analytics 4 |
| **Build Tool** | npm / Bun |

---

## 📄 Key Features & Pages

- **Announcement Banner**: Sticky banner highlighting the SWE-bench SOTA achievement and limited offers.
- **Dynamic Frosted-Glass Navbars**: Custom mega-menu support for Products, Open-Source, and Resources with active drop-downs on desktop and slider overlays on mobile.
- **Scroll-Linked Parallax Showcase**: "What You'll Unlock" horizontal scroll deck linked via Framer Motion's `useScroll` + `useTransform`.
- **Achievements Carousel**: Auto-sliding carousel housing 30+ major milestones and summit achievements with slide controls.
- **Partners Marquee**: Infinite-marquee animations displaying code integration partners and ecosystems.
- **Testimonials Deck**: Smooth, staggered entrance animations for customer recommendation cards.
- **Media Coverage**: Custom carousel highlighting press and publication presence from top media houses.
- **Community Showcase (`/community`)**: Live gallery of production-grade platforms (Orbit CRM, Support HUB, Smart Book, HRMS, Erpsphere, etc.) shipped autonomously using CodeMate AI. Includes responsive video modal previews with touch shielding and category filtering.
- **Dynamic Pricing Engine (`/pricing`)**: Interactive plan cards, custom credit builders, trial banners, and product matrix comparisons.
- **Technical Blog (`/blog` & `/blog/[slug]`)**: Dynamically routed architectural write-ups and benchmark deep-dives.
- **Downloads Portal (`/download`)**: Direct links and installation video guides for CodeMate extensions and toolboxes.
- **Contact & Leads Portal (`/contact`)**: Lead capture form connected to backend submission APIs.

---

## 🗂️ Project Structure

```
CMLanding/
└── landingpage-nextjs/
    ├── public/                  # Brand assets, static mocks, and logos
    ├── src/
    │   ├── app/                 # Next.js App Router
    │   │   ├── page.tsx         # Main Landing Page client component
    │   │   ├── layout.tsx       # Layout with SEO metadata & Analytics
    │   │   ├── globals.css      # Core style tokens & keyframe animations
    │   │   ├── community/       # Community showcase page
    │   │   │   ├── components/  # Featured Project, Gallery, Cards, Filters, Hero
    │   │   │   └── lib/         # Projects data & category definitions
    │   │   ├── pricing/         # Pricing sub-route page & custom calculators
    │   │   │   └── components/  # Custom credit cards & plan builders
    │   │   ├── blog/            # Blog index and dynamic [slug] article routes
    │   │   │   └── [slug]/      # Article layout and content components
    │   │   ├── download/        # Download sub-route page & installation guides
    │   │   ├── contact/         # Contact sub-route page
    │   │   └── context/         # Redux store & theme contexts
    │   ├── components/          # Reusable react components
    │   │   ├── navbar.tsx       # Mega-menu navbar
    │   │   ├── footer.tsx       # Responsive footer
    │   │   ├── achivements.tsx  # Achievements slideshow
    │   │   ├── media-presence.tsx # Media slider
    │   │   └── ui/              # 46 primitive animated UI components (Bento, Terminals, Gradients, etc.)
    │   ├── context/             # Global Auth provider
    │   └── utils/               # Tailwind merge helpers
    ├── package.json             # Dependencies & scripts
    ├── next.config.ts           # Next.js configuration
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

1. **GPU-Accelerated Card Animations**: Showcase and featured cards leverage `transform-gpu` and targeted CSS transitions (`transition-[border-color,box-shadow]`) to prevent layout thrashing and maintain silky 60fps scrolling.
2. **Responsive Video Modal Containment**: Video modals enforce strict 16:9 aspect ratios across viewports with touch shields on mobile/tablet and full interactive controls on desktop.
3. **Lazy Resource Activation**: Heavy GIFs are frozen into light Canvas frames using `SmartGif` and only activated on hover or direct viewport interaction.
4. **Unified Event Listeners**: Window resize, viewport breakpoints, and parallax scroll handlers are consolidated into singular hooks to prevent layout shifting and state churn.
5. **Lazy-Loaded Analytics**: Google Analytics scripts are injected asynchronously post-mount.
