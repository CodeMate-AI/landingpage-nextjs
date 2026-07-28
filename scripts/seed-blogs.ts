import { loadEnvConfig } from "@next/env";
import path from "path";

// MUST load env before importing mongodb (which reads MONGODB_URI at module evaluation time)
loadEnvConfig(path.resolve(__dirname, ".."));

const DEFAULT_BG = "#07111f";

type TiptapNode = {
  type: string;
  attrs?: Record<string, any>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
};

function textNode(text: string, marks?: Array<{ type: string; attrs?: Record<string, any> }>): TiptapNode {
  return marks ? { type: "text", text, marks } : { type: "text", text };
}

function paragraph(children: TiptapNode[] | TiptapNode | string): TiptapNode {
  return {
    type: "paragraph",
    content: Array.isArray(children) ? children : typeof children === "string" ? [textNode(children)] : [children],
  };
}

function heading(level: 1 | 2 | 3, children: TiptapNode[] | TiptapNode | string): TiptapNode {
  return {
    type: "heading",
    attrs: { level },
    content: Array.isArray(children) ? children : typeof children === "string" ? [textNode(children)] : [children],
  };
}

function bulletList(items: string[]): TiptapNode {
  return {
    type: "bulletList",
    content: items.map((item) => ({ type: "listItem", content: [paragraph(item)] })),
  };
}

function orderedList(items: string[]): TiptapNode {
  return {
    type: "orderedList",
    content: items.map((item) => ({ type: "listItem", content: [paragraph(item)] })),
  };
}

function table(headers: string[], rows: string[][]): TiptapNode {
  return {
    type: "table",
    content: [
      {
        type: "tableRow",
        content: headers.map((header) => ({ type: "tableHeader", content: [paragraph(header)] })),
      },
      ...rows.map((row) => ({ type: "tableRow", content: row.map((cell) => ({ type: "tableCell", content: [paragraph(cell)] })) })),
    ],
  };
}

function faqQuestion(question: string): TiptapNode {
  return paragraph(`+${question}`);
}

function faqAnswer(answer: string): TiptapNode {
  return paragraph(answer);
}

function imageNode(src: string, alt: string): TiptapNode {
  return {
    type: "image",
    attrs: {
      src,
      alt,
      title: null,
    },
  };
}

function blog1Content(): { type: "doc"; content: TiptapNode[] } {
  return {
    type: "doc",
    content: [
      paragraph("The recent Replit AI agent incident, where an experimental tool deleted a production database, is a wake-up call for the entire development community. It confirmed what many of us have suspected: AI agents are powerful, but without the right guardrails, they can be dangerous."),
      paragraph("At CodeMate, we’ve built our platform on a simple principle: AI should assist, not act alone. That means strict human-in-the-loop oversight and access controls so that incidents like Replit’s don’t happen in the first place."),
      heading(2, "The Replit Incident: A Costly Lesson in AI Access Control"),
      paragraph("In July 2025, developers watched as Replit’s experimental AI coding agent executed a DROP DATABASE command in production, wiping out live data."),
      paragraph("As Replit’s CEO later explained, the AI wasn’t malicious - it was unsupervised. The system treated the AI like a senior developer instead of what it really was: a powerful but unpredictable tool."),
      heading(2, "What Actually Went Wrong"),
      paragraph("This wasn’t about “AI gone rogue.” It was about security failures stacked on top of each other:"),
      bulletList([
        "The AI had admin rights when it should’ve been read-only.",
        "Destructive commands ran without human confirmation.",
        "Authentication was weak.",
        "Audit trails were thin.",
        "The AI operated fully on its own.",
      ]),
      imageNode("/online_threat_image2.png", "What actually went wrong diagram"),
      heading(2, "How We Designed for Safety"),
      paragraph("At CodeMate, we saw these risks early and designed around them. Our model is simple: human-in-the-loop, always."),
      bulletList([
        "Every AI suggestion requires explicit developer approval.",
        "Destructive operations are flagged for extra review.",
        "AI components never hold admin privileges.",
        "Every action is logged and auditable.",
      ]),
      imageNode("/online_threat_image3.png", "How we designed for safety diagram"),
      heading(2, "What Could Go Wrong vs How It’s Prevented"),
      paragraph("Database schema changes: Replit’s AI dropped a production database. With CodeMate, schema modifications are flagged, analyzed for impact, and require developer approval with rollback plans in place."),
      paragraph("Code deployments: Industry risk: AI pushes untested code into production. In CodeMate, all suggestions happen in dev/test environments and CI/CD approval gates remain human-controlled."),
      paragraph("API keys and secrets: Industry risk: AI exposes or mishandles credentials. In CodeMate, exposed keys are detected automatically, never stored, and enterprise secret management integrations are supported."),
      heading(2, "The Lessons Every Team Should Take Away"),
      paragraph("The Replit story is a reminder that AI isn’t a senior engineer - it’s more like a super-powered intern. And just like an intern, it needs supervision."),
      paragraph("Practical steps every team should take:"),
      orderedList([
        "Treat AI like a junior developer. Never grant production access.",
        "Build defense in depth with authentication, authorization, approval gates, and audit trails.",
        "Set clear boundaries: let AI analyze, suggest, and document - but don’t let it deploy or delete.",
        "Plan for mistakes with backups, rollbacks, and incident response.",
      ]),
      heading(2, "Why Human-in-the-Loop Works Better"),
      paragraph("Keeping humans in the loop isn’t just about preventing disasters. It also drives better development practices. Vulnerabilities get caught earlier, debugging improves, and teams stay aligned with their own coding standards. Most importantly, developers remain in control."),
      heading(2, "Moving Forward"),
      paragraph("AI coding tools are here to stay. The question isn’t whether we should use them - it’s how to use them responsibly."),
      paragraph("When you evaluate an AI coding assistant, ask:"),
      bulletList([
        "Can it make production changes without human approval?",
        "What kind of access does it really have?",
        "Are its actions logged and auditable?",
        "If it’s wrong, can you recover quickly?",
      ]),
      paragraph("The Replit incident was painful, but it’s also a chance for our industry to reset."),
      paragraph([textNode("If you're thinking about adopting AI in your workflow, start with one simple question: "), textNode("What's the worst this AI could do if left unsupervised?", [{ type: "bold" }]), textNode(" If the answer is \"delete production data,\" then you already know what to do next.")]),
    ],
  };
}

function blog2Content(): { type: "doc"; content: TiptapNode[] } {
  return {
    type: "doc",
    content: [
      paragraph("Cora by CodeMate AI has achieved a 76% resolution rate on the SWE-bench verified subset, outperforming industry leaders like GitHub Copilot and Cursor on real-world software engineering tasks."),
      paragraph("This milestone reflects not just benchmark success, but a fundamental shift in how developers can collaborate with AI; from simple autocompletion to autonomous, context-aware code generation."),
      imageNode("/cora_sota_swebench.jpeg", "Cora SWE-bench Verified SOTA chart"),
      heading(2, "How Cora is Redefining Autonomous Code Generation"),
      paragraph("Cora is designed to handle complex software engineering workflows end-to-end. By utilizing a single-agent system that plans, edits, and governs the entire lifecycle of a coding task, it outperforms traditional autocomplete solutions."),
      heading(2, "What is Cora?"),
      paragraph([textNode("Cora is an "), textNode("autonomous coding agent for VS Code", [{ type: "bold" }]), textNode(" designed to handle complex software engineering workflows end-to-end. It doesn't just suggest snippets - it "), textNode("plans, writes, tests, and validates", [{ type: "bold" }]), textNode(" production-ready code. Cora can:")]),
      bulletList([
        "Generate complete projects from natural-language prompts - including files, dependencies, and configurations.",
        "Analyze entire codebases and make context-aware edits.",
        "Seek user approval before executing critical actions.",
        "Deliver validated, production-ready solutions directly in your workspace.",
      ]),
      paragraph("Unlike typical AI assistants, Cora understands architecture, dependencies, and intent - operating as a self-directed engineering agent rather than a reactive autocomplete tool."),
      heading(2, "How Cora Achieves State-of-the-Art Performance"),
      paragraph("Cora’s breakthrough lies in its combination of specialized reasoning tooling and a self-directed execution loop that continuously validates generated solutions. Instead of guessing, Cora models the problem, tests hypotheses, and refines code until it compiles and passes all checks."),
      heading(2, "Patch Generation and Tooling"),
      paragraph("Cora employs a single-agent architecture capable of autonomously generating and applying patches to large codebases. It is equipped with a specialized toolset for reasoning, code inspection, and system interaction - including file analysis, diff-based editing, command execution, and intelligent completion validation. We provide Cora with the following tools:"),
      bulletList([
        "inspect_workspace: Unified inspection layer for browsing, reading, and analyzing project structure or content before editing.",
        "modify_file: One editing surface that handles full rewrites, incremental diffs, insertions, or regex replacements.",
        "run_command: Execute shell and browser automation tasks under controlled approval.",
        "manage_task: Control Cora’s task lifecycle - start, switch, complete, or compress context intelligently.",
        "govern_workflow: Manages task understanding, clarification, and structured progress tracking.",
      ]),
      heading(2, "The Agentic Advantage"),
      paragraph("Cora’s power lies in its autonomous agent architecture, designed for both independence and accountability. For your team Cora can:"),
      bulletList([
        "Reason across codebases to understand structure and dependencies.",
        "Make implementation decisions without constant developer input.",
        "Maintain consistency and code quality across multiple files.",
        "Debug and iterate until all tests pass.",
        "Request approval only for critical operations.",
      ]),
      imageNode("/cora_architecture.png", "Cora Architecture Diagram"),
      heading(2, "Built for Real-World Engineering"),
      paragraph("The SWE-bench benchmark evaluates AI agents on real GitHub issues and pull requests from major open-source projects - representing the complexity of real-world software development. Each task requires:"),
      bulletList([
        "Understanding project architecture and conventions.",
        "Multi-file reasoning and consistency maintenance.",
        "Generating patches that pass existing test suites.",
        "Iterative debugging and refinement.",
      ]),
      paragraph("Cora successfully resolved 76 SWE-Bench verified instances, showing its ability to handle engineering challenges that typically require senior developer expertise."),
      imageNode("/cora_benchmark.png", "Cora SWE-bench Verified results"),
      heading(2, "Optimized for Correctness, Not Just Speed"),
      paragraph("In software engineering, speed without correctness adds rework - not value. Let’s compare how other tools fare:"),
      bulletList([
        "Cursor averaged 48 seconds per task but resolved only 51 out of 100 issues.",
        "Cora averaged 134 seconds per task yet resolved 76 issues with validated, working solutions.",
      ]),
      paragraph("The takeaway: correctness-first saves developers far more time downstream by avoiding debugging and manual fixes. In software development, the real metric is time to working solution, not time to first output."),
      paragraph("[video: /blog2_Video.mp4]"),
      heading(2, "Transparent, Reproducible, Open Evaluation"),
      paragraph("We believe transparency builds trust. Our SWE-bench results are fully reproducible and publicly available for verification. Our methodology includes:"),
      bulletList([
        "Standard SWE-bench dataset and test harness used across the research community.",
        "Consistent environment and timeout configurations.",
        "Open-source benchmark infrastructure maintained by leading institutions.",
        "Automated validation against real test suites.",
      ]),
      paragraph("All evaluation logs, configurations, and patch traces are available on our GitHub repository for independent review. This commitment to openness ensures developers can verify, reproduce, and trust every claim we make."),
      heading(2, "Experience Cora Yourself"),
      paragraph("Benchmarks prove performance - experience builds conviction. Get started:"),
      bulletList([
        "Install Cora from the VS Code Marketplace.",
        "Explore our evaluation results on GitHub.",
        "Visit codemate.ai to learn more.",
      ]),
    ],
  };
}

function blog3Content(): { type: "doc"; content: TiptapNode[] } {
  return {
    type: "doc",
    content: [
      paragraph("Claude Code focuses on writing code. CodeMate manages the entire engineering workflow : from planning to production."),
      heading(2, "From Individual Developers to High-Performing Engineering Teams"),
      paragraph("CodeMate transforms AI from a personal coding assistant into a complete engineering platform built for modern software teams. Instead of optimizing a single developer’s workflow, it empowers entire organizations with shared codebase intelligence and persistent engineering context. Every developer works with the same architectural knowledge, coding standards, and project history, eliminating information silos."),
      paragraph("AI-powered code reviews automatically identify quality, security, and maintainability issues before they reach production. Deep repository understanding enables smarter code generation, impact analysis, and large-scale refactoring across complex codebases. Integrated security checks, testing, and documentation ensure quality is embedded throughout the SDLC rather than added at the end. By automating repetitive engineering tasks, CodeMate allows developers to focus on solving business problems instead of managing technical debt."),
      paragraph("Built-in collaboration and governance help engineering leaders maintain consistency across distributed teams and multiple repositories. Whether deployed in the cloud, on-premises, or within a private VPC, CodeMate adapts to enterprise security and compliance requirements. The result is faster software delivery, healthier codebases, and high-performing engineering teams that can confidently build, scale, and innovate together."),
      paragraph([textNode("CodeMate is built around the idea that software development is a "), textNode("continuous lifecycle", [{ type: "bold" }]), textNode(", not a series of disconnected steps. Its tools map directly to "), textNode("SDLC", [{ type: "link", attrs: { href: "https://www.geeksforgeeks.org/software-engineering/software-development-life-cycle-sdlc/", target: "_blank", rel: "noopener noreferrer" } }]), textNode(" stages:")]),
      bulletList([
        "C0 for research, feasibility, and requirement intelligence",
        "CodeMate Build for building production-ready applications",
        "CORA for development, code generation, testing, and validation",
        "PR Review & Deployment Agents for release readiness and feedback loops",
      ]),
      imageNode("/codemate_sdlc_architecture.png", "CodeMate AI End-to-End SDLC Agent Architecture Flow Chart"),
      heading(2, "CodeMate vs Claude Code : Feature Comparison"),
      paragraph("A clean capability breakdown comparing CodeMate AI and Claude Code across enterprise deployment, governance, LLM support, and engineering features."),
      table(
        ["Capability", "CodeMate AI", "Claude Code"],
        [
          ["Primary Focus", "Enterprise SDLC", "Individual Agent"],
          ["Best For", "Engineering Teams", "Individual Developers"],
          ["Deployment Options", "SaaS, VPC, Self-hosted", "Anthropic Cloud"],
          ["Data Residency", "Enterprise Infra", "Cloud Infrastructure"],
          ["Pricing Model", "Predictable Subscription", "Usage / Token-based"],
          ["Proprietary LLM Support", "Full Support", "Limited (Bedrock)"],
          ["Architecture & Project Planning", "Full Support", "Limited"],
          ["GitHub/GitLab PR Intelligence", "Full Support", "Limited"],
          ["Multi-file Refactoring", "check", "check"],
          ["Production-Aware Code Gen", "check", "check"],
          ["Runtime & Stack Debugging", "check", "check"],
          ["IDE Support (VS Code, JetBrains)", "check", "check"],
          ["Terminal Experience", "check", "check"],
          ["Enterprise CI/CD Integration", "check", "check"],
          ["Persistent Knowledge Base", "check", "check"],
          ["Test Generation", "check", "check"],
          ["Cross-Repo Semantic Search", "check", "cross"],
          ["Automated PR Reviews", "check", "cross"],
          ["Governance & RBAC", "check", "cross"],
          ["Enterprise Audit Logs", "check", "cross"],
          ["SOC / Compliance Ready", "check", "cross"],
          ["Shared Team Intelligence", "check", "cross"],
          ["Engineer Onboarding Knowledge", "check", "cross"],
        ]
      ),
      heading(2, "SDLC Comparison"),
      paragraph("How CodeMate AI and Claude Code compare across key phases of the Software Development Lifecycle."),
      table(
        ["SDLC Stage", "CodeMate AI", "Claude Code"],
        [
          ["Runtime & Logical Debugging", "check", "check"],
          ["Multi-Repo Refactoring", "check", "check"],
          ["Documentation Generation", "check", "check"],
          ["Context-Aware Code Generation", "check", "check"],
          ["Persistent Knowledge Management", "check", "check"],
          ["Requirements Analysis", "check", "check"],
          ["Architecture & System Design", "check", "check"],
          ["Project & Task Planning", "check", "check"],
          ["Deep Codebase Understanding", "check", "cross"],
          ["Automated PR Reviews", "check", "cross"],
          ["Built-in Static Analysis", "check", "cross"],
          ["Root Cause & Dependency Analysis", "check", "cross"],
          ["Automated Test Case Gen", "check", "cross"],
          ["Test Intelligence & Coverage", "check", "cross"],
          ["Developer Onboarding Discovery", "check", "cross"],
          ["Cross-Service Impact Analysis", "check", "cross"],
          ["Security & Policy Review", "check", "cross"],
          ["Compliance & Governance Checks", "check", "cross"],
          ["CI/CD & Release Readiness", "check", "cross"],
          ["Production Support & Investigation", "check", "cross"],
          ["Continuous Org Learning", "check", "cross"],
          ["Enterprise Deployment (VPC/Self-Hosted)", "check", "cross"],
        ]
      ),
      heading(2, "Key Positioning"),
      paragraph("Instead of viewing these tools as identical coding assistants, recognize that they serve fundamentally different scopes:"),
      bulletList([
        "Claude Code: AI Coding Agent - excels at implementing, debugging, and automating coding tasks for individual developers.",
        "CodeMate AI: Enterprise AI SDLC Platform - focused on architecture, governance, and organization-wide engineering intelligence.",
      ]),
      heading(2, "Trusted by Enterprises"),
      paragraph("CodeMate’s enterprise posture is built for teams that need governance, auditability, and organizational intelligence across the SDLC."),
      heading(2, "Frequently Asked Questions"),
      faqQuestion("What is the best AI coding tool?"),
      faqAnswer("The best AI coding tool depends on your workflow. Tools like CodeMate are designed for teams and full development workflows, while others focus more on individual productivity and automation."),
      faqQuestion("What are Copilot alternatives?"),
      faqAnswer("Popular Copilot alternatives include CodeMate, Cursor, Claude Code, and other AI coding assistants that offer features like code generation, debugging, and code review."),
      faqQuestion("How to review AI-generated code?"),
      faqAnswer("AI-generated code should be reviewed with full context of the codebase. Using AI code review tools that understand dependencies and system-wide impact helps catch hidden issues and maintain code quality."),
    ],
  };
}

function blog4Content(): { type: "doc"; content: TiptapNode[] } {
  return {
    type: "doc",
    content: [
      heading(2, "Beyond AI Code Completion : Choosing the Right AI Platform for Modern Engineering Teams"),
      paragraph("AI coding assistants have become a standard part of software development. But as engineering organizations move from individual experimentation to enterprise-wide adoption, a more important question emerges: Is your AI merely helping developers write code, or is it helping your organization build better software?"),
      paragraph("For the past few years, the conversation around AI coding has largely revolved around autocomplete, chat, and code generation. GitHub Copilot set the standard by bringing AI directly into the IDE, enabling millions of developers to generate functions, explain code, and automate repetitive tasks with remarkable ease."),
      paragraph("For individual productivity, that model works exceptionally well."),
      paragraph("However, engineering organizations eventually encounter a different set of challenges, ones that cannot be solved by faster code generation alone."),
      paragraph("As teams grow, software becomes more distributed. Architectures span dozens of repositories, hundreds of microservices, thousands of APIs, and years of accumulated engineering decisions. Documentation becomes fragmented. Tribal knowledge lives with senior engineers. Code reviews vary by reviewer. New developers spend weeks understanding systems before making meaningful contributions."),
      paragraph("At this stage, the limiting factor is no longer how quickly code can be written."),
      paragraph("It’s how effectively engineering knowledge can be shared, governed, and applied across the organization."),
      paragraph("This is where the architectural philosophies of GitHub Copilot and CodeMate begin to diverge."),
      paragraph("GitHub Copilot approaches AI as an intelligent pair programmer deeply integrated into the GitHub ecosystem. It focuses on helping developers generate code faster, automate pull requests, review changes, and work more efficiently within existing GitHub workflows."),
      paragraph("CodeMate takes a broader approach."),
      paragraph("Rather than viewing AI as another developer tool, it treats AI as an engineering platform that continuously learns from repositories, documentation, architectural patterns, engineering standards, and historical decisions. Instead of rebuilding context for every interaction, it creates a persistent knowledge layer that can support every engineer across the software development lifecycle."),
      paragraph("The distinction may seem subtle at first, but it fundamentally changes what each platform is optimized to solve."),
      paragraph("This article compares both platforms from an engineering perspective, not to determine which AI writes better code snippets, but to understand which architecture better supports modern software teams as they scale."),
      heading(2, "The Shift from AI Assistants to AI Engineering Platforms"),
      paragraph("The first generation of AI coding tools focused on a single objective:"),
      paragraph(textNode("Help developers write code faster.", [{ type: "bold" }])),
      paragraph("The next generation is tackling a more complex problem:"),
      paragraph(textNode("Help engineering organizations build software more intelligently.", [{ type: "bold" }])),
      paragraph("These goals may appear similar, but they require fundamentally different architectures."),
      paragraph("Traditional coding assistants typically process the current repository, user prompt, and surrounding code before generating a response. Their effectiveness is largely determined by the quality of the immediate context and developer interaction."),
      paragraph("Enterprise engineering platforms extend that model by maintaining a broader understanding of the organization. They continuously index repositories, documentation, architectural relationships, APIs, and development practices, enabling AI to reason beyond a single repository or session."),
      heading(2, "At a Glance"),
      paragraph("CodeMate VS GitHub Copilot : Beyond AI Code Completion comparison table:"),
      table(
        ["Category", "CodeMate", "GitHub Copilot"],
        [
          ["Primary Goal", "AI Software Engineering Platform", "AI Pair Programmer"],
          ["Best For", "Enterprise engineering organizations", "Individual developers and GitHub-first teams"],
          ["Core Philosophy", "Improve the entire SDLC", "Speed up coding"],
          ["Intelligence Scope", "Organization-wide knowledge", "Repository-centric"],
          ["Deployment", "SaaS, VPC, Self-hosted, On-Prem", "Cloud"],
          ["Enterprise Focus", "Engineering platform with governance", "GitHub ecosystem"],
        ]
      ),
      heading(2, "Architecture Comparison"),
      table(
        ["Capability", "CodeMate", "GitHub Copilot"],
        [
          ["AI Role", "Engineering Platform", "Pair Programmer"],
          ["Cross-Repository Context", "check", "Limited"],
          ["Repository Awareness", "check", "check"],
          ["Persistent Knowledge", "check", "check"],
          ["Organizational Memory", "check", "cross"],
        ]
      ),
      heading(2, "Context and Knowledge Engine"),
      table(
        ["Capability", "CodeMate", "GitHub Copilot"],
        [
          ["Multiple Repository Context", "check", "Limited"],
          ["Internal Documentation", "check", "Partial"],
          ["API Documentation", "check", "Partial"],
          ["Wiki Integration", "check", "Limited"],
          ["Current File Context", "check", "check"],
          ["Repository Context", "check", "check"],
          ["Proprietary LLM Support", "check", "check"],
          ["Custom Models", "check", "check"],
        ]
      ),
      heading(2, "Security and Deployment"),
      table(
        ["Capability", "CodeMate", "GitHub Copilot"],
        [
          ["SaaS", "check", "check"],
          ["Bring Your Own Model (BYOM)", "check", "check"],
          ["VPC", "check", "cross"],
          ["On-Prem / Self Hosted", "check", "cross"],
        ]
      ),
      heading(2, "Frequently Asked Questions"),
      faqQuestion("How is CodeMate different from GitHub Copilot?"),
      faqAnswer("The biggest difference is architectural. GitHub Copilot acts as an AI pair programmer centered around repositories and GitHub workflows. CodeMate is designed as an AI software engineering platform that builds a persistent knowledge layer across repositories, documentation, architecture, and engineering standards to support planning, development, testing, reviews, and governance."),
      faqQuestion("Which platform is better for enterprise engineering teams?"),
      faqAnswer("It depends on organizational priorities. If your organization is heavily invested in GitHub and primarily wants to improve developer productivity, GitHub Copilot is a natural choice. If your organization requires organization-wide knowledge sharing, governance, private deployment, or support for regulated environments, CodeMate offers capabilities aimed at those enterprise requirements."),
      faqQuestion("Does GitHub Copilot support self-hosted or on-premise deployment?"),
      faqAnswer("No. GitHub Copilot operates through GitHub and Microsoft cloud infrastructure. Organizations requiring air-gapped or fully self-hosted deployments would need an alternative approach."),
      faqQuestion("Can CodeMate run with proprietary LLMs?"),
      faqAnswer("Yes. CodeMate supports deployment in private infrastructure and can integrate with enterprise-managed language models, including services such as Amazon Bedrock, Vertex AI, Ollama, and custom models, depending on deployment configuration."),
      faqQuestion("Which platform provides better code reviews?"),
      faqAnswer("Both platforms provide AI-assisted code reviews, but their scope differs. GitHub Copilot performs repository-aware reviews integrated into GitHub pull requests. CodeMate extends reviews with persistent organizational knowledge and can evaluate changes using information from multiple repositories and engineering standards."),
      faqQuestion("Does CodeMate replace GitHub Copilot?"),
      faqAnswer("Not necessarily. The two products target overlapping but different use cases. Some organizations may choose GitHub Copilot for developer assistance, while others may prefer CodeMate as a broader engineering platform. The right choice depends on workflow, governance, deployment, and organizational requirements."),
      faqQuestion("Which platform is better for large codebases?"),
      faqAnswer("Large engineering organizations often benefit from tools that can maintain context across multiple repositories, documentation, and architectural components. CodeMate is designed with persistent organizational knowledge for this scenario, while GitHub Copilot primarily operates within repository-centric workflows."),
      faqQuestion("Can both tools generate tests and documentation?"),
      faqAnswer("Yes. Both platforms support AI-assisted code generation and test creation. CodeMate integrates these capabilities into its broader engineering workflow, while GitHub Copilot provides them through chat and agent-based interactions."),
    ],
  };
}

async function main() {
  const { default: clientPromise } = await import("../src/lib/mongodb");
  const client = await clientPromise;
  const db = client.db("codemate_blog");
  const blogs = db.collection("blogs");

  const docs = [
    {
      slug: "hidden-dangers-of-autonomous-ai",
      title: "The Hidden Dangers of Autonomous AI: How CodeMate Keeps Developers in Control",
      excerpt: "The recent Replit AI agent incident is a wake-up call for AI access control and safe agent design.",
      coverImage: "/online_threat_images.png",
      category: "Security & Code Review",
      tags: [{ label: "Security", tone: "blue" }],
      readTime: "6 min read",
      bgColor: "#09090b",
      content: blog1Content(),
      published: true,
      publishedAt: new Date("2025-11-13T00:00:00.000Z"),
      views: 0,
      author: "Ayush Singhal",
      createdAt: new Date("2025-11-13T00:00:00.000Z"),
      updatedAt: new Date(),
    },
    {
      slug: "cora-sota-swe-bench",
      title: "Cora Achieves SOTA with 76% Resolution Rate on SWE-bench verified subset, Outperforming Industry Leaders",
      excerpt: "Cora by CodeMate AI has achieved a 76% resolution rate on the SWE-bench verified subset, outperforming industry leaders on real-world software engineering tasks.",
      coverImage: "/blog2CoverImage.jpeg",
      category: "CORA Updates",
      tags: [{ label: "CORA", tone: "blue" }],
      readTime: "5 min read",
      bgColor: "#080f12",
      content: blog2Content(),
      published: true,
      publishedAt: new Date("2025-11-13T00:00:00.000Z"),
      views: 0,
      author: "Ayush Singhal",
      createdAt: new Date("2025-11-13T00:00:00.000Z"),
      updatedAt: new Date(),
    },
    {
      slug: "codemate-vs-claude-code",
      title: "CodeMate VS Claude Code",
      excerpt: "Claude Code focuses on writing code. CodeMate manages the entire engineering workflow : from planning to production.",
      coverImage: "/codemateaiVSclaudecodeImageCover.png",
      category: "Engineering & Comparisons",
      tags: [{ label: "Comparison", tone: "violet" }],
      readTime: "7 min read",
      bgColor: DEFAULT_BG,
      content: blog3Content(),
      published: true,
      publishedAt: new Date("2026-07-21T00:00:00.000Z"),
      views: 0,
      author: "Ayush Singhal",
      createdAt: new Date("2026-07-21T00:00:00.000Z"),
      updatedAt: new Date(),
    },
    {
      slug: "codemate-vs-github-copilot",
      title: "CodeMate VS GitHub Copilot",
      excerpt: "CodeMate vs GitHub Copilot: Beyond AI Code Completion : Choosing the Right AI Platform for Modern Engineering Teams",
      coverImage: "/codematevsgithubcopilot.png",
      category: "Engineering & Comparisons",
      tags: [{ label: "Comparison", tone: "violet" }],
      readTime: "6 min read",
      bgColor: DEFAULT_BG,
      content: blog4Content(),
      published: true,
      publishedAt: new Date("2026-07-22T00:00:00.000Z"),
      views: 0,
      author: "Ayush Singhal",
      createdAt: new Date("2026-07-22T00:00:00.000Z"),
      updatedAt: new Date(),
    },
  ];

  for (const doc of docs) {
    await blogs.updateOne({ slug: doc.slug }, { $set: doc }, { upsert: true });
    console.log(`Seeded ${doc.slug}`);
  }

  console.log("Blog seeding complete.");
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
