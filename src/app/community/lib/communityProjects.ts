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
  docsPdfUrl?: string;
  demoUrl?: string;
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
    docsPdfUrl: "/Support Hub.pdf",
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
    docsPdfUrl: "/Smartbook.pdf",
    demoUrl: "https://smartbook.codemate.build/",
    previewImage: "/smartbook.codemate.build_.png",
  },
  {
    id: "3",
    name: "HRMS",
    title: "Human Resource Management System",
    description:
      "Internal platform managing employee onboarding, leaves tracking, performance reviews, and centralized payroll directories.",
    category: "Internal Utilities",
    videoUrl: "/HRMS.mp4",
    docsPdfUrl: "/HRMS.pdf",
    demoUrl: "https://hrms.codemate.build/",
    previewImage: "/hrms.codemate.build_.png",
  },
  {
    id: "4",
    name: "Erpsphere",
    title: "Enterprise Resource Planning",
    description:
      "Cloud ERP console managing warehouse inventories, global supply chains, financial spreadsheets, and schedules.",
    category: "Enterprise CRMs",
    videoUrl: "/Erpsphere.mp4",
    docsPdfUrl: "/ERP.pdf",
    demoUrl: "https://erpsphere.codemate.build/",
    previewImage: "/erpsphere.codemate.build_.png",
  },
  {
    id: "5",
    name: "Marketing Automation",
    title: "Omnichannel Campaign Console",
    description:
      "Central dashboard coordinating scheduled email drip sequences, conversion tracking, and compiler reports.",
    category: "AI Agents & SaaS",
    videoUrl: "/marketing automation .mp4",
    docsPdfUrl: "/Growth Cloud.pdf",
    demoUrl: "https://growthcloud.codemate.build/",
    previewImage: "/growth-cloud-web.onrender.com_.png",
  },
  {
    id: "6",
    name: "E-Signature Tool",
    title: "Secure Document Signing",
    description:
      "A web-based document workflow portal supporting legally binding e-signatures, secure PDF tracking, and email reminders.",
    category: "AI Agents & SaaS",
    videoUrl: "/Signflow.mp4",
    docsPdfUrl: "/SIGNFLOW.pdf",
    demoUrl: "https://signflow.codemate.build/",
    previewImage: "/signflow.codemate.build_new.png",
  },
  {
    id: "7",
    name: "CodeMate Meet",
    title: "Video Conferencing Platform",
    description:
      "A real-time video conferencing web application built with WebRTC, supporting HD group calls, screen sharing, and collaborative chat.",
    category: "AI Agents & SaaS",
    videoUrl: "/zoom clone.mp4",
    docsPdfUrl: "/Connectmeet.pdf",
    demoUrl: "https://meet.codemate.build/",
    previewImage: "/meet.codemate.build_.png",
  },
  {
    id: "8",
    name: "EX-Employee Verification",
    title: "Employment Verification Portal",
    description:
      "A secure verification portal enabling automated background checks, credential validation, and previous employment record auditing.",
    category: "Internal Utilities",
    docsPdfUrl: "/ex emp.pdf",
    demoUrl: "https://ex-employee-verification-portal.vercel.app/",
    previewImage: "/ex-employee-verification-portal.vercel.app_.png",
  },
];
