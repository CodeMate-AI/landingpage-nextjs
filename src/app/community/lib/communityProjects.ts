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
    name: "CodeMate CRM",
    title: "Customer Relationship Platform",
    description:
      "A full-featured CRM built with BUILD in design mode and CORA in VS Code. Tracks leads, pipelines, and team performance in real time.",
    category: "Enterprise CRMs",
    buildTime: "36h",
    metricLabel: "Active Users",
    metricValue: "2,400+",
    metaBadges: ["BUILD", "CORA", "Next.js", "MongoDB"],
    previewType: "dash",
  },
  {
    id: "api-playground",
    name: "API Playground",
    title: "Interactive API Explorer",
    description:
      "Developer-first tool to test, document, and share REST endpoints. Auto-generates OpenAPI specs and runs mock servers locally.",
    category: "Developer Tools",
    buildTime: "28h",
    metricLabel: "Requests / Min",
    metricValue: "12K",
    metaBadges: ["BUILD", "TypeScript", "OpenAPI"],
    previewType: "api",
  },
  {
    id: "review-copilot",
    name: "Review Copilot",
    title: "AI-Powered Code Review Agent",
    description:
      "Autonomous agent that reviews pull requests, suggests refactors, and enforces style rules using your team's custom guidelines.",
    category: "AI Agents & SaaS",
    buildTime: "42h",
    metricLabel: "PRs Reviewed",
    metricValue: "8,500+",
    metaBadges: ["CORA", "AI Agent", "GitHub API"],
    previewType: "review",
  },
  {
    id: "mate-cli",
    name: "Mate CLI",
    title: "Command-Line Companion",
    description:
      "A terminal-based companion for scaffolding projects, running migrations, and executing CI pipelines directly from your shell.",
    category: "Developer Tools",
    buildTime: "18h",
    metricLabel: "Daily Installs",
    metricValue: "340",
    metaBadges: ["CORA", "Rust", "CLI"],
    previewType: "terminal",
  },
  {
    id: "pageforge",
    name: "PageForge",
    title: "Landing Page Builder",
    description:
      "Drag-and-drop builder for marketing pages. Exports clean Next.js code and deploys to edge networks with one click.",
    category: "AI Agents & SaaS",
    buildTime: "32h",
    metricLabel: "Sites Published",
    metricValue: "1,200+",
    metaBadges: ["BUILD", "CORA", "Tailwind"],
    previewType: "hp",
  },
  {
    id: "neuralsearch",
    name: "NeuralSearch",
    title: "Semantic Search Engine",
    description:
      "Vector-powered search over documentation, code, and wikis. Understands intent and surfaces the most relevant results instantly.",
    category: "AI Agents & SaaS",
    buildTime: "38h",
    metricLabel: "Queries / Day",
    metricValue: "45K",
    metaBadges: ["CORA", "Vector DB", "Embeddings"],
    previewType: "search",
  },
  {
    id: "sprintops",
    name: "SprintOps",
    title: "Sprint Management Tracker",
    description:
      "Internal tool for planning sprints, tracking velocity, and visualizing burndown charts across multiple engineering squads.",
    category: "Internal Utilities",
    buildTime: "22h",
    metricLabel: "Tickets Closed",
    metricValue: "6,800+",
    metaBadges: ["BUILD", "CORA", "Jira"],
    previewType: "sprint",
  },
  {
    id: "admin-core",
    name: "Admin Core",
    title: "Internal Admin Console",
    description:
      "Centralized admin dashboard for user management, billing, feature flags, and audit logs across all CodeMate products.",
    category: "Internal Utilities",
    buildTime: "30h",
    metricLabel: "Admins Active",
    metricValue: "96",
    metaBadges: ["BUILD", "CORA", "Auth", "RBAC"],
    previewType: "admin",
  },
];
