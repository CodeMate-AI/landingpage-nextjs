/**
 * ==============================================================================
 * COMMUNITY PROJECTS DATA REGISTRY & TYPE DEFINITIONS
 * ==============================================================================
 * This file acts as the single source of truth for all projects showcased on
 * the /community page. Each project contains metadata, category associations,
 * and a designated previewType that maps to a live CSS/SVG mock.
 */

export type PreviewType =
  | "terminal"
  | "search"
  | "hp"
  | "api"
  | "dash"
  | "sprint"
  | "admin";

export type ProjectCategory =
  | "All Projects"
  | "Enterprise CRMs"
  | "Developer Tools"
  | "AI Agents & SaaS"
  | "Internal Utilities";

export interface Project {
  id: string;
  name: string;
  title: string;
  description: string;
  category: "Enterprise CRMs" | "Developer Tools" | "AI Agents & SaaS" | "Internal Utilities";
  previewType: PreviewType;
  demoUrl?: string;
  docsUrl?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    name: "Support HUB",
    title: "Customer Support Portal",
    description:
      "A high-performance ticketing dashboard built to centralize client inquiries, track resolution times, and automate response workflows.",
    category: "Enterprise CRMs",
    demoUrl: "https://supporthub.codemate.build/",
    previewType: "dash",
  },
  {
    id: "2",
    name: "Smart Book",
    title: "Digital Documentation Editor",
    description:
      "An interactive notebook companion designed to run code snippets, document project structures, and export markdown guides.",
    category: "Developer Tools",
    demoUrl: "https://smartbook.codemate.build/",
    previewType: "api",
  },
  {
    id: "3",
    name: "HRMS",
    title: "Human Resource Management System",
    description:
      "Internal platform managing employee onboarding, leaves tracking, performance reviews, and centralized payroll directories.",
    category: "Developer Tools",
    demoUrl: "https://hrms.codemate.build/",
    previewType: "terminal",
  },
  {
    id: "4",
    name: "SignFlow",
    title: "Secure Document Signing",
    description:
      "A web-based document workflow portal supporting legally binding e-signatures, secure PDF tracking, and email reminders.",
    category: "AI Agents & SaaS",
    demoUrl: "https://signflow.codemate.build/",
    previewType: "hp",
  },
  {
    id: "5",
    name: "Erpsphere",
    title: "Enterprise Resource Planning",
    description:
      "Cloud ERP console managing warehouse inventories, global supply chains, financial spreadsheets, and schedules.",
    category: "AI Agents & SaaS",
    demoUrl: "https://erpsphere.codemate.build/",
    previewType: "search",
  },
  {
    id: "6",
    name: "CodeInvoice",
    title: "Automated Invoicing & Billing",
    description:
      "Billing utility that automatically compiles taxes, issues recurring client invoices, and processes online credit payouts.",
    category: "Internal Utilities",
    demoUrl: "https://codeinvoice.codemate.build/",
    previewType: "sprint",
  },
  {
    id: "7",
    name: "Marketing Automation",
    title: "Omnichannel Campaign Console",
    description:
      "Central dashboard coordinating scheduled email drip sequences, conversion tracking, and compiler reports.",
    category: "Internal Utilities",
    demoUrl: "https://marketing.codemate.build/",
    previewType: "admin",
  },
];
