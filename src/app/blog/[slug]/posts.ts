export interface Tag {
  label: string;
  tone: "slate" | "blue" | "cyan" | "purple" | "indigo" | "violet" | "teal";
}


export interface BlogSection {
  id: string;
  title: string;
}

export interface BlogDetailPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  dateValue: string;
  tags: Tag[];
  bgColor: string;
  visualMarkup: string;
  sections: BlogSection[];
  dek: string;
  readTime: string;
  image?: string;
}

export const blogPosts: BlogDetailPost[] = [
  {
    id: 4,
    slug: "codemate-vs-github-copilot",
    title: "CodeMate VS GitHub Copilot",
    category: "Engineering & Comparisons",
    date: "July 22, 2026",
    dateValue: "2026-07-22",
    tags: [
      { label: "Comparison", tone: "violet" },
    ],
    bgColor: "#07111f",
    visualMarkup: `<img src="/codematevsgithubcopilot.png" alt="CodeMate VS GitHub Copilot" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`,
    sections: [
      { id: "intro", title: "Introduction" },
      { id: "at-a-glance", title: "At a Glance" },
      { id: "architecture-comparison", title: "Architecture Comparison" },
      { id: "context-comparison", title: "Context & Knowledge Engine" },
      { id: "deployment", title: "Security & Deployment" },
      { id: "faq", title: "Frequently Asked Questions" },
    ],
    dek: "CodeMate VS GitHub Copilot: Beyond AI Code Completion : Choosing the Right AI Platform for Modern Engineering Teams",
    readTime: "6 min read",
    image: "/codematevsgithubcopilot.png",
  },
  {
    id: 3,
    slug: "codemate-vs-claude-code",
    title: "CodeMate VS Claude Code",
    category: "Engineering & Comparisons",
    date: "July 21, 2026",
    dateValue: "2026-07-21",
    tags: [
      { label: "Comparison", tone: "violet" },
    ],
    bgColor: "#07111f",
    visualMarkup: `<img src="/codemateaiVSclaudecodeImageCover.png" alt="CodeMate VS Claude Code" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`,
    sections: [
      { id: "intro", title: "Introduction" },
      { id: "feature-comparison", title: "Feature Comparison" },
      { id: "sdlc-comparison", title: "SDLC Comparison" },
      { id: "key-positioning", title: "Key Positioning" },
      { id: "trusted-by", title: "Trusted by Enterprises" },
      { id: "faq", title: "Frequently Asked Questions" },
    ],
    dek: "Claude Code focuses on writing code. CodeMate manages the entire engineering workflow : from planning to production.",
    readTime: "7 min read",
    image: "/codemateaiVSclaudecodeImageCover.png",
  },
  {
    id: 2,
    slug: "cora-sota-swe-bench",
    title: "Cora Achieves SOTA with 76% Resolution Rate on SWE-bench verified subset, Outperforming Industry Leaders",
    category: "CORA Updates",
    date: "November 13, 2025",
    dateValue: "2025-11-13",
    tags: [
      { label: "CORA", tone: "blue" },
    ],
    bgColor: "#080f12",
    visualMarkup: `
      <img src="/blog2CoverImage.jpeg" alt="Cora SWE-bench Verified SOTA" style="width: 100%; height: 100%; object-fit: cover; background-color: #080f12;" />
    `,
    sections: [
      { id: "intro", title: "Introduction" },
      { id: "redefining-code-gen", title: "Redefining Code Generation" },
      { id: "what-is-cora", title: "What is Cora?" },
      { id: "how-cora-achieves-sota", title: "How Cora Achieves SOTA" },
      { id: "patch-generation-tooling", title: "Patch Generation and Tooling" },
      { id: "agentic-advantage", title: "The Agentic Advantage" },
      { id: "real-world-engineering", title: "Real-World Engineering" },
      { id: "optimized-for-correctness", title: "Optimizing for Correctness" },
      { id: "transparent-evaluation", title: "Transparent & Open Evaluation" },
      { id: "experience-cora", title: "Experience Cora Yourself" },
    ],
    dek: "Cora by CodeMate AI has achieved a 76% resolution rate on the SWE-bench verified subset, outperforming industry leaders on real-world software engineering tasks.",
    readTime: "5 min read",
    image: "/blog2CoverImage.jpeg",
  },
  {
    id: 1,
    slug: "hidden-dangers-of-autonomous-ai",
    title: "The Hidden Dangers of Autonomous AI: How CodeMate Keeps Developers in Control",
    category: "Security & Code Review",
    date: "November 13, 2025",
    dateValue: "2025-11-13",
    tags: [
      { label: "Security", tone: "blue" },
    ],
    bgColor: "#09090b",
    visualMarkup: `
      <img src="/online_threat_images.png" alt="online threat images" style="width: 100%; height: 100%; object-fit: cover; background-color: white;" />
    `,
    sections: [
      { id: "intro", title: "Introduction" },
      { id: "replit-incident", title: "The Replit Incident" },
      { id: "what-went-wrong", title: "What Actually Went Wrong" },
      { id: "designed-for-safety", title: "How We Designed for Safety" },
      { id: "prevention-matrix", title: "What Could Go Wrong vs. How It’s Prevented" },
      { id: "lessons-learned", title: "The Lessons Every Team Should Take Away" },
      { id: "human-in-the-loop", title: "Why Human-in-the-Loop Works Better" },
      { id: "moving-forward", title: "Moving Forward" },
    ],
    dek: "The recent Replit AI agent incident, where an experimental tool deleted a production database, is a wake-up call for the entire development community.",
    readTime: "6 min read",
    image: "/online_threat_images.png",
  },
];
