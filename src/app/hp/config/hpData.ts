// Centralized configuration module for the HP co-branding landing page (/hp)

export interface DemoItem {
  id: number;
  videoId: string;
  name: string;
  title: string;
  description: string;
  thumbnail: string;
}

export interface ResourceItem {
  name: string;
  tagline: string;
  url: string;
}

export interface UsecaseItem {
  slug: string;
  name: string;
  image: string;
}

export const hpMetadata = {
  title: "HP x CodeMate AI",
  description:
    "CodeMate is an AI-native SDLC agent that accelerates the entire software development lifecycle. Run CodeMate seamlessly on HP's Next Gen AI PCs with codebase security.",
  canonical: "https://codemate.ai/hp",
  keywords: [
    "HP",
    "CodeMate AI",
    "AI PC",
    "HP Next Gen AI PCs",
    "Software Development Lifecycle",
    "AI Pair Programmer",
    "Codebase Intelligence",
  ],
  ogImage: "https://backend.codemate.ai/uploaded/images/ee959115-9252-4e9f-8287-ea84bdadf702",
} as const;

export const hpDemos: readonly DemoItem[] = [
  {
    id: 1,
    videoId: "hamhzIcbDKg",
    name: "CodeMate BUILD",
    title: "AI WebApp Builder | Build Production Ready Application Instantly",
    description:
      "In this demo, we will explore how CodeMate Build turns a simple prompt into a fully functional application.",
    thumbnail: "/hp/thumbnail-build.png",
  },
  {
    id: 2,
    videoId: "jA3S5KuvFkM",
    name: "CodeMate CORA",
    title: "Autonomous Coding Agent | Deep Codebase Reasoning & Auto Mode",
    description:
      "In this demo, we will explore CORA's Auto Mode, designed to automate entire development workflows from planning to execution.",
    thumbnail: "/hp/thumbnail-cora.png",
  },
  {
    id: 3,
    videoId: "7vTEW_eNZC8",
    name: "CodeMate C0",
    title: "Research Agent | Local On-Device AI Intelligence & Assistance",
    description:
      "In this demo, we explore how CodeMate Work combines knowledge base and rulebooks to generate more accurate and structured outputs.",
    thumbnail: "/hp/thumbnail-c0.png",
  },
] as const;

export const hpResources: readonly ResourceItem[] = [
  {
    name: "Quick Start Guide",
    tagline: "Get Started with CodeMate",
    url: "https://backend.codemate.ai/uploaded/images/b899e5b2-1b26-47e7-ab45-e9556c71c3f3",
  },
  {
    name: "Product Overview",
    tagline: "Explore CodeMate Products",
    url: "https://backend.codemate.ai/uploaded/images/94b54bf1-d432-4e91-945b-42b9dd49d7e4",
  },
  {
    name: "CodeMate Build",
    tagline: "AI Full-Stack App Builder",
    url: "https://backend.codemate.ai/uploaded/images/e1ff2e8a-de08-4dbb-87a2-6bcac324472d",
  },
  {
    name: "CodeMate Cora",
    tagline: "Agentic Software Architect",
    url: "https://backend.codemate.ai/uploaded/images/fd14b3e1-1d28-4797-b9ee-a71e32f5d717",
  },
  {
    name: "CodeMate Work",
    tagline: "AI-Powered Research Agent",
    url: "https://backend.codemate.ai/uploaded/images/8b450672-4add-4346-acdc-62ffc423e431",
  },
  {
    name: "CodeMate PR Review Agent",
    tagline: "Automated PR Code Reviews",
    url: "https://backend.codemate.ai/uploaded/images/54b0b865-d8be-4fab-8352-228a3b17e859",
  },
  {
    name: "CodeMate Academy",
    tagline: "AI Learning & Academic Platform",
    url: "https://backend.codemate.ai/uploaded/images/9b408477-9c1f-498d-ba84-f73c9dec2ff7",
  },
  {
    name: "FAQs",
    tagline: "Frequently Asked Questions",
    url: "https://backend.codemate.ai/uploaded/images/57c85bdf-b289-43aa-b707-df7a9c423924",
  },
  {
    name: "Technical & Security Overview",
    tagline: "Security Architecture & Safeguards",
    url: "https://backend.codemate.ai/uploaded/images/5d4ba684-9234-47f5-a97f-c2231670abb3",
  },
] as const;

export const hpUsecases: readonly UsecaseItem[] = [
  { slug: "manufacturing", name: "Manufacturing", image: "/hp/usecases/manufacturing.webp" },
  { slug: "retail", name: "Retail", image: "/hp/usecases/retail.webp" },
  { slug: "healthcare", name: "Healthcare", image: "/hp/usecases/healthcare.webp" },
  { slug: "automotive-robotics", name: "Automotive & Robotics", image: "/hp/usecases/automotive-robotics.webp" },
  { slug: "smart-cities", name: "Smart Cities", image: "/hp/usecases/smart-cities.webp" },
  { slug: "energy-utilities", name: "Energy & Utilities", image: "/hp/usecases/energy-utilities.webp" },
] as const;

export const hpContact = {
  phone: "+918766330253",
  displayPhone: "+91 87663 30253",
  email: "contact@codemate.ai",
  gmailComposeUrl: "https://mail.google.com/mail/?view=cm&fs=1&to=contact@codemate.ai",
  linkedInUrl: "https://www.linkedin.com/company/codemateai/",
  twitterUrl: "https://x.com/codemateai",
  privacyUrl: "https://docs.codemate.ai/faqs/privacy-policy",
  termsUrl: "https://docs.codemate.ai/faqs/terms-of-service",
  downloadUrl: "https://codemate.ai/download",
  contactUrl: "https://codemate.ai/contact",
  heroImageUrl: "https://backend.codemate.ai/uploaded/images/ee959115-9252-4e9f-8287-ea84bdadf702",
  contactImageUrl: "https://backend.codemate.ai/uploaded/images/bf6916fd-580d-412c-8bbe-54b4ef8ee0b8",
} as const;
