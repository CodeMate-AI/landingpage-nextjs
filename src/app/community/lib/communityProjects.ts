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
    videoUrl: "https://backend.codemate.ai/uploaded/images/cdd93f97-7801-48a8-8d74-8d5c509bb512",
    docsPdfUrl: "https://backend.codemate.ai/uploaded/images/61e25584-8364-43ee-b0c8-37cbc754053e",
    demoUrl: "https://supporthub.codemate.build/",
    previewImage: "https://backend.codemate.ai/uploaded/images/722034c2-9c5a-439a-9804-f5c11bb51218",
  },
  {
    id: "2",
    name: "Smart Book",
    title: "Digital Documentation Editor",
    description:
      "An interactive notebook companion designed to run code snippets, document project structures, and export markdown guides.",
    category: "Developer Tools",
    videoUrl: "https://backend.codemate.ai/uploaded/images/b826c0be-828f-4d4a-a48b-dcd38163f9d0",
    docsPdfUrl: "https://backend.codemate.ai/uploaded/images/82462e5b-dcc6-4da9-ba60-6bf9935b91ea",
    demoUrl: "https://smartbook.codemate.build/",
    previewImage: "https://backend.codemate.ai/uploaded/images/b74fd5ee-08a8-4997-a46e-f5259815b46a",
  },
  {
    id: "3",
    name: "HRMS",
    title: "Human Resource Management System",
    description:
      "Internal platform managing employee onboarding, leaves tracking, performance reviews, and centralized payroll directories.",
    category: "Internal Utilities",
    videoUrl: "https://backend.codemate.ai/uploaded/images/ac2337b2-e7e3-41e5-bf6d-7d0ab6983daf",
    docsPdfUrl: "https://backend.codemate.ai/uploaded/images/4ddbfd07-8d89-46e1-b7e4-2f289768baaa",
    demoUrl: "https://hrms.codemate.build/",
    previewImage: "https://backend.codemate.ai/uploaded/images/5a42d01f-d107-4ce7-ae8d-7ee99a891b54",
  },
  {
    id: "4",
    name: "Erpsphere",
    title: "Enterprise Resource Planning",
    description:
      "Cloud ERP console managing warehouse inventories, global supply chains, financial spreadsheets, and schedules.",
    category: "Enterprise CRMs",
    videoUrl: "https://backend.codemate.ai/uploaded/images/d3a4520c-1b5e-4a5e-91bb-56b82e04bc7e",
    docsPdfUrl: "https://backend.codemate.ai/uploaded/images/276c5d47-cc29-49e4-b2bf-cf75e7c17b27",
    demoUrl: "https://erpsphere.codemate.build/",
    previewImage: "https://backend.codemate.ai/uploaded/images/9419ba1d-048b-4926-998e-41ae596a65a0",
  },
  {
    id: "5",
    name: "Marketing Automation",
    title: "Omnichannel Campaign Console",
    description:
      "Central dashboard coordinating scheduled email drip sequences, conversion tracking, and compiler reports.",
    category: "AI Agents & SaaS",
    videoUrl: "https://backend.codemate.ai/uploaded/images/495650d8-f22a-477c-922c-d595a3fd1330",
    docsPdfUrl: "https://backend.codemate.ai/uploaded/images/094f1e54-5f8c-4eec-8af2-c8cdcf8ea635",
    demoUrl: "https://growthcloud.codemate.build/",
    previewImage: "https://backend.codemate.ai/uploaded/images/c92f7c39-3dd5-41b4-b8a0-f90831437c24",
  },
  {
    id: "6",
    name: "E-Signature Tool",
    title: "Secure Document Signing",
    description:
      "A web-based document workflow portal supporting legally binding e-signatures, secure PDF tracking, and email reminders.",
    category: "AI Agents & SaaS",
    videoUrl: "https://backend.codemate.ai/uploaded/images/ab5fe989-7041-4d71-abe6-53bb36547c29",
    docsPdfUrl: "https://backend.codemate.ai/uploaded/images/7a19d67c-0717-40c0-aa34-9944e429dd3a",
    demoUrl: "https://signflow.codemate.build/",
    previewImage: "https://backend.codemate.ai/uploaded/images/f5069488-7c43-4826-be37-dd7fe20b3250",
  },
  {
    id: "7",
    name: "CodeMate Meet",
    title: "Video Conferencing Platform",
    description:
      "A real-time video conferencing web application built with WebRTC, supporting HD group calls, screen sharing, and collaborative chat.",
    category: "AI Agents & SaaS",
    videoUrl: "https://backend.codemate.ai/uploaded/images/aa1a5f71-4b25-4023-974e-d087036bd464",
    docsPdfUrl: "https://backend.codemate.ai/uploaded/images/4f67d694-e29b-4a2b-9cc8-6fcfd2d6f732",
    demoUrl: "https://meet.codemate.build/",
    previewImage: "https://backend.codemate.ai/uploaded/images/91c5860d-5e21-405a-878c-c471d7a8b958",
  },
  {
    id: "8",
    name: "EX-Employee Verification",
    title: "Employment Verification Portal",
    description:
      "A secure verification portal enabling automated background checks, credential validation, and previous employment record auditing.",
    category: "Internal Utilities",
    videoUrl: "https://backend.codemate.ai/uploaded/images/2b36dbef-4d90-448f-9750-51ae3066aab2",
    docsPdfUrl: "https://backend.codemate.ai/uploaded/images/0937cc07-e84f-4a7a-829d-135ddadcfc93",
    demoUrl: "https://ex-employee-verification-portal.codemate.build/",
    previewImage: "https://backend.codemate.ai/uploaded/images/cae48d95-a1b6-43a7-92d5-e68bb08e04f0",
  },
];
