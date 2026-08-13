/**
 * ==============================================================================
 * COMMUNITY PROJECTS DATA REGISTRY & TYPE DEFINITIONS
 * ==============================================================================
 * This file acts as the single source of truth for all projects showcased on
 * the /community page. Each project contains metadata, category associations,
 * build metrics, and a designated previewType that maps to a live CSS/SVG mock.
 */

export type PreviewType =
  | "terminal"
  | "search"
  | "hp"
  | "review"
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
  buildTime: string;
  metricLabel: string;
  metricValue: string;
  metaBadges: string[];
  previewType: PreviewType;
  demoUrl?: string;
  docsUrl?: string;
}

export const projects: Project[] = [
  {
    id: "code-crm",
    name: "Support HUB",
    title: "Customer Support Portal",
    description:
      "A high-performance ticketing dashboard built to centralize client inquiries, track resolution times, and automate response workflows.",
    category: "Enterprise CRMs",
    buildTime: "36h",
    metricLabel: "Active Users",
    metricValue: "2,400+",
    metaBadges: ["BUILD", "CORA", "Next.js", "MongoDB"],
    previewType: "dash",
  },
  {
    id: "api-playground",
    name: "Smart Book",
    title: "Digital Documentation Editor",
    description:
      "An interactive notebook companion designed to run code snippets, document project structures, and export markdown guides.",
    category: "Developer Tools",
    buildTime: "28h",
    metricLabel: "Requests / Min",
    metricValue: "12K",
    metaBadges: ["BUILD", "TypeScript", "OpenAPI"],
    previewType: "api",
  },
  {
    id: "review-copilot",
    name: "Orbit CRM",
    title: "Customer Relationship Management",
    description:
      "Enterprise CRM platform designed to organize customer profiles, track sales pipelines, and generate analytical revenue charts.",
    category: "AI Agents & SaaS",
    buildTime: "42h",
    metricLabel: "PRs Reviewed",
    metricValue: "8,500+",
    metaBadges: ["CORA", "AI Agent", "GitHub API"],
    previewType: "review",
  },
  {
    id: "mate-cli",
    name: "HRMS",
    title: "Human Resource Management System",
    description:
      "Internal platform managing employee onboarding, leaves tracking, performance reviews, and centralized payroll directories.",
    category: "Developer Tools",
    buildTime: "18h",
    metricLabel: "Daily Installs",
    metricValue: "340",
    metaBadges: ["CORA", "Rust", "CLI"],
    previewType: "terminal",
  },
  {
    id: "pageforge",
    name: "SignFlow",
    title: "Secure Document Signing",
    description:
      "A web-based document workflow portal supporting legally binding e-signatures, secure PDF tracking, and email reminders.",
    category: "AI Agents & SaaS",
    buildTime: "32h",
    metricLabel: "Sites Published",
    metricValue: "1,200+",
    metaBadges: ["BUILD", "CORA", "Tailwind"],
    previewType: "hp",
  },
  {
    id: "neuralsearch",
    name: "Erpsphere",
    title: "Enterprise Resource Planning",
    description:
      "Cloud ERP console managing warehouse inventories, global supply chains, financial spreadsheets, and schedules.",
    category: "AI Agents & SaaS",
    buildTime: "38h",
    metricLabel: "Queries / Day",
    metricValue: "45K",
    metaBadges: ["CORA", "Vector DB", "Embeddings"],
    previewType: "search",
  },
  {
    id: "sprintops",
    name: "CodeInvoice",
    title: "Automated Invoicing & Billing",
    description:
      "Billing utility that automatically compiles taxes, issues recurring client invoices, and processes online credit payouts.",
    category: "Internal Utilities",
    buildTime: "22h",
    metricLabel: "Tickets Closed",
    metricValue: "6,800+",
    metaBadges: ["BUILD", "CORA", "Jira"],
    previewType: "sprint",
  },
  {
    id: "admin-core",
    name: "Marketing Automation",
    title: "Omnichannel Campaign Console",
    description:
      "Central dashboard coordinating scheduled email drip sequences, conversion tracking, and compiler reports.",
    category: "Internal Utilities",
    buildTime: "30h",
    metricLabel: "Admins Active",
    metricValue: "96",
    metaBadges: ["BUILD", "CORA", "Auth", "RBAC"],
    previewType: "admin",
  },
];
