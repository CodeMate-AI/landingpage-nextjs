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
  previewImage: string;
  videoUrl?: string;
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
    videoUrl: "/SupportHub.mp4",
    demoUrl: "https://supporthub.codemate.build/",
    previewImage: "/supporthub.codemate.build_community.png",
  },
  {
    id: "2",
    name: "Smart Book",
    title: "Digital Documentation Editor",
    description:
      "An interactive notebook companion designed to run code snippets, document project structures, and export markdown guides.",
    category: "Developer Tools",
    videoUrl: "/SmartBook.mp4",
    demoUrl: "https://smartbook.codemate.build/",
    previewImage: "/smartbook.codemate.build_.png",
  },
  {
    id: "3",
    name: "HRMS",
    title: "Human Resource Management System",
    description:
      "Internal platform managing employee onboarding, leaves tracking, performance reviews, and centralized payroll directories.",
    category: "Developer Tools",
    videoUrl: "/HRMS.mp4",
    demoUrl: "https://hrms.codemate.build/",
    previewImage: "/hrms.codemate.build_.png",
  },
  {
    id: "4",
    name: "Erpsphere",
    title: "Enterprise Resource Planning",
    description:
      "Cloud ERP console managing warehouse inventories, global supply chains, financial spreadsheets, and schedules.",
    category: "AI Agents & SaaS",
    videoUrl: "/Erpsphere.mp4",
    demoUrl: "https://erpsphere.codemate.build/",
    previewImage: "/erpsphere.codemate.build_.png",
  },
  {
    id: "5",
    name: "Marketing Automation",
    title: "Omnichannel Campaign Console",
    description:
      "Central dashboard coordinating scheduled email drip sequences, conversion tracking, and compiler reports.",
    category: "Internal Utilities",
    videoUrl: "/marketing automation .mp4",
    demoUrl: "https://growthcloud.codemate.build/",
    previewImage: "/growth-cloud-web.onrender.com_.png",
  },
  {
    id: "6",
    name: "SignFlow",
    title: "Secure Document Signing",
    description:
      "A web-based document workflow portal supporting legally binding e-signatures, secure PDF tracking, and email reminders.",
    category: "AI Agents & SaaS",
    videoUrl: "/Signflow.mp4",
    demoUrl: "https://signflow.codemate.build/",
    previewImage: "/signflow.codemate.build_login.png",
  },
];
