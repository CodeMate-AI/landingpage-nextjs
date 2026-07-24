"use client";

import React, { useState } from "react";

interface ComparisonRow {
  capability: string;
  codemate: "check" | "cross" | string;
  claudeCode: "check" | "cross" | string;
}

const featureComparisonRows: ComparisonRow[] = [
  // Tier 1: Text-Based Comparisons
  { capability: "Primary Focus", codemate: "Enterprise SDLC", claudeCode: "Individual Agent" },
  { capability: "Best For", codemate: "Engineering Teams", claudeCode: "Individual Developers" },
  { capability: "Deployment Options", codemate: "SaaS, VPC, Self-hosted", claudeCode: "Anthropic Cloud" },
  { capability: "Data Residency", codemate: "Enterprise Infra", claudeCode: "Cloud Infrastructure" },
  { capability: "Pricing Model", codemate: "Predictable Subscription", claudeCode: "Usage / Token-based" },
  { capability: "Proprietary LLM Support", codemate: "Full Support", claudeCode: "Limited (Bedrock)" },
  { capability: "Architecture & Project Planning", codemate: "Full Support", claudeCode: "Limited" },
  { capability: "GitHub/GitLab PR Intelligence", codemate: "Full Support", claudeCode: "Limited" },

  // Tier 2: Matching Checkmarks on both sides (✓ & ✓)
  { capability: "Multi-file Refactoring", codemate: "check", claudeCode: "check" },
  { capability: "Production-Aware Code Gen", codemate: "check", claudeCode: "check" },
  { capability: "Runtime & Stack Debugging", codemate: "check", claudeCode: "check" },
  { capability: "IDE Support (VS Code, JetBrains)", codemate: "check", claudeCode: "check" },
  { capability: "Terminal Experience", codemate: "check", claudeCode: "check" },
  { capability: "Enterprise CI/CD Integration", codemate: "check", claudeCode: "check" },
  { capability: "Persistent Knowledge Base", codemate: "check", claudeCode: "check" },
  { capability: "Test Generation", codemate: "check", claudeCode: "check" },

  // Tier 3: CodeMate only (✓ vs ✕)
  { capability: "Cross-Repo Semantic Search", codemate: "check", claudeCode: "cross" },
  { capability: "Automated PR Reviews", codemate: "check", claudeCode: "cross" },
  { capability: "Governance & RBAC", codemate: "check", claudeCode: "cross" },
  { capability: "Enterprise Audit Logs", codemate: "check", claudeCode: "cross" },
  { capability: "SOC / Compliance Ready", codemate: "check", claudeCode: "cross" },
  { capability: "Shared Team Intelligence", codemate: "check", claudeCode: "cross" },
  { capability: "Engineer Onboarding Knowledge", codemate: "check", claudeCode: "cross" },
];

const sdlcComparisonRows: ComparisonRow[] = [
  // Tier 1: Text-Based Comparisons
  // Tier 2: Matching Checkmarks on both sides (✓ & ✓)
  { capability: "Runtime & Logical Debugging", codemate: "check", claudeCode: "check" },
  { capability: "Multi-Repo Refactoring", codemate: "check", claudeCode: "check" },
  { capability: "Documentation Generation", codemate: "check", claudeCode: "check" },
  { capability: "Context-Aware Code Generation", codemate: "check", claudeCode: "check" },
  { capability: "Persistent Knowledge Management", codemate: "check", claudeCode: "check" },
  { capability: "Requirements Analysis", codemate: "check", claudeCode: "check" },
  { capability: "Architecture & System Design", codemate: "check", claudeCode: "check" },
  { capability: "Project & Task Planning", codemate: "check", claudeCode: "check" },
  // Tier 3: Differentiating Capabilities (✓ vs ✕)
  { capability: "Deep Codebase Understanding", codemate: "check", claudeCode: "cross" },
  { capability: "Automated PR Reviews", codemate: "check", claudeCode: "cross" },
  { capability: "Built-in Static Analysis", codemate: "check", claudeCode: "cross" },
  { capability: "Root Cause & Dependency Analysis", codemate: "check", claudeCode: "cross" },
  { capability: "Automated Test Case Gen", codemate: "check", claudeCode: "cross" },
  { capability: "Test Intelligence & Coverage", codemate: "check", claudeCode: "cross" },
  { capability: "Developer Onboarding Discovery", codemate: "check", claudeCode: "cross" },
  { capability: "Cross-Service Impact Analysis", codemate: "check", claudeCode: "cross" },
  { capability: "Security & Policy Review", codemate: "check", claudeCode: "cross" },
  { capability: "Compliance & Governance Checks", codemate: "check", claudeCode: "cross" },
  { capability: "CI/CD & Release Readiness", codemate: "check", claudeCode: "cross" },
  { capability: "Production Support & Investigation", codemate: "check", claudeCode: "cross" },
  { capability: "Continuous Org Learning", codemate: "check", claudeCode: "cross" },
  { capability: "Enterprise Deployment (VPC/Self-Hosted)", codemate: "check", claudeCode: "cross" },
];

const faqItems = [
  {
    question: "What is the best AI coding tool?",
    answer:
      "The best AI coding tool depends on your workflow. Tools like CodeMate are designed for teams and full development workflows, while others focus more on individual productivity and automation.",
  },
  {
    question: "What are Copilot alternatives?",
    answer:
      "Popular Copilot alternatives include CodeMate, Cursor, Claude Code, and other AI coding assistants that offer features like code generation, debugging, and code review.",
  },
  {
    question: "How to review AI-generated code?",
    answer:
      "AI-generated code should be reviewed with full context of the codebase. Using AI code review tools that understand dependencies and system-wide impact helps catch hidden issues and maintain code quality.",
  },
];

function FAQAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`faq-pill-card ${isOpen ? "open" : ""}`} suppressHydrationWarning>
      <button
        type="button"
        className="faq-pill-summary"
        onClick={onToggle}
        suppressHydrationWarning
      >
        <span className="faq-circle-badge" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
        <span className="faq-question-title">{question}</span>
      </button>
      {isOpen && (
        <div className="faq-answer-body">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

function RenderTableCell({ val }: { val: string }) {
  if (val === "check") {
    return <span className="icon-square icon-square-check" title="Supported">✓</span>;
  }
  if (val === "cross") {
    return <span className="icon-square icon-square-cross" title="Not natively supported">✕</span>;
  }
  return <span className="badge-text-clean">{val}</span>;
}

export default function Blog3Content() {
  return (
    <>
      <section>
        <p className="lead">
          Claude Code focuses on writing code. CodeMate manages the entire engineering workflow : from planning to production.
        </p>

        <h2 id="intro">From Individual Developers to High-Performing Engineering Teams</h2>
        <p>
          CodeMate transforms AI from a personal coding assistant into a complete engineering platform built for modern software teams. Instead of optimizing a single developer’s workflow, it empowers entire organizations with shared codebase intelligence and persistent engineering context. Every developer works with the same architectural knowledge, coding standards, and project history, eliminating information silos.
        </p>
        <p>
          AI-powered code reviews automatically identify quality, security, and maintainability issues before they reach production. Deep repository understanding enables smarter code generation, impact analysis, and large-scale refactoring across complex codebases. Integrated security checks, testing, and documentation ensure quality is embedded throughout the SDLC rather than added at the end. By automating repetitive engineering tasks, CodeMate allows developers to focus on solving business problems instead of managing technical debt.
        </p>
        <p>
          Built-in collaboration and governance help engineering leaders maintain consistency across distributed teams and multiple repositories. Whether deployed in the cloud, on-premises, or within a private VPC, CodeMate adapts to enterprise security and compliance requirements. The result is faster software delivery, healthier codebases, and high-performing engineering teams that can confidently build, scale, and innovate together.
        </p>
        <p className="my-6">
          CodeMate is built around the idea that software development is a <strong>continuous lifecycle</strong>, not a series of disconnected steps. Its tools map directly to <a href="https://www.geeksforgeeks.org/software-engineering/software-development-life-cycle-sdlc/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">SDLC</a> stages:
        </p>
        <ul className="list-disc pl-6 space-y-2.5 mb-8 text-slate-300">
          <li>
            <a href="https://docs.codemate.ai/c0" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-bold">C0</a> for research, feasibility, and requirement intelligence
          </li>
          <li>
            <a href="https://docs.codemate.ai/build-agent" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-bold">CodeMate Build</a> for building production-ready applications
          </li>
          <li>
            <a href="https://docs.codemate.ai/cora-agentic-architect-mode" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-bold">CORA</a> for development, code generation, testing, and validation
          </li>
          <li>
            <a href="https://docs.codemate.ai/pull-request-review-agent" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-bold">PR Review & Deployment Agents</a> for release readiness and feedback loops
          </li>
        </ul>

        {/* CodeMate End-to-End SDLC Agent Architecture Diagram */}
        <div className="img-block my-8 rounded-2xl overflow-hidden border border-slate-700/60 bg-[#f8fafc] p-3 shadow-2xl transition-all">
          <img
            src="/codemate_sdlc_architecture.png"
            alt="CodeMate AI End-to-End SDLC Agent Architecture Flow Chart"
            className="w-full h-auto rounded-xl block"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />
        </div>
      </section>

      {/* Feature Comparison Table (Clean, 100% fluid, centered badges) */}
      <section>
        <h2 id="feature-comparison">CodeMate vs Claude Code : Feature Comparison</h2>
        <p>
          A clean capability breakdown comparing CodeMate AI and Claude Code across enterprise deployment, governance, LLM support, and engineering features.
        </p>

        <div className="clean-table-container">
          <table className="clean-comparison-table">
            <thead>
              <tr>
                <th scope="col" className="col-capability">Capability</th>
                <th scope="col" className="col-product">CodeMate AI</th>
                <th scope="col" className="col-product">Claude Code</th>
              </tr>
            </thead>
            <tbody>
              {featureComparisonRows.map((row, idx) => (
                <tr key={idx}>
                  <th scope="row" className="cell-capability">{row.capability}</th>
                  <td className="cell-product">
                    <RenderTableCell val={row.codemate} />
                  </td>
                  <td className="cell-product">
                    <RenderTableCell val={row.claudeCode} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SDLC Comparison Table (Clean, 100% fluid, centered badges) */}
      <section>
        <h2 id="sdlc-comparison">CodeMate vs Claude Code: AI Across the SDLC</h2>
        <p>
          How CodeMate AI and Claude Code compare across key phases of the Software Development Lifecycle.
        </p>

        <div className="clean-table-container">
          <table className="clean-comparison-table">
            <thead>
              <tr>
                <th scope="col" className="col-capability">SDLC Stage</th>
                <th scope="col" className="col-product">CodeMate AI</th>
                <th scope="col" className="col-product">Claude Code</th>
              </tr>
            </thead>
            <tbody>
              {sdlcComparisonRows.map((row, idx) => (
                <tr key={idx}>
                  <th scope="row" className="cell-capability">{row.capability}</th>
                  <td className="cell-product">
                    <RenderTableCell val={row.codemate} />
                  </td>
                  <td className="cell-product">
                    <RenderTableCell val={row.claudeCode} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Positioning */}
      <section>
        <h2 id="key-positioning">Key Positioning</h2>
        <p>
          Instead of viewing these tools as identical coding assistants, recognize that they serve fundamentally different scopes:
        </p>

        <ul className="positioning-points-list my-6 space-y-4 list-none pl-0">
          <li className="flex items-start gap-3.5 py-3.5 border-b border-slate-800/80">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-400 text-xs font-bold uppercase tracking-wider shrink-0 mt-0.5 border border-blue-500/25">
              Claude Code
            </span>
            <div className="flex-1">
              <strong className="text-white font-bold text-base block mb-1">AI Coding Agent</strong>
              <p className="text-slate-300 text-sm leading-relaxed m-0">
                Excels at implementing, debugging, and automating coding tasks for individual developers.
              </p>
            </div>
          </li>

          <li className="flex items-start gap-3.5 py-3.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-cyan-500/15 text-cyan-400 text-xs font-bold uppercase tracking-wider shrink-0 mt-0.5 border border-cyan-500/25">
              CodeMate AI
            </span>
            <div className="flex-1">
              <strong className="text-white font-bold text-base block mb-1">Enterprise AI SDLC Platform</strong>
              <p className="text-slate-300 text-sm leading-relaxed m-0">
                Supports the complete software development lifecycle, from requirements and architecture through development, testing, code review, deployment, governance, and long-term knowledge management.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Trusted By Logos */}
      <section>
        <h2 id="trusted-by">Trusted by Leading Enterprises</h2>
        <p>
          Empowering engineering teams at scale across top industries.
        </p>

        <div className="logo-grid my-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              name: "Maruti Suzuki",
              src: "/Maruti-Suzuki-Logo-png.png",
              tag: "Automotive",
              imgStyle: { transform: "scale(1.85)" },
            },
            {
              name: "TVS Credit",
              src: "/TVS Credit.png",
              tag: "Financial Services",
              imgStyle: { transform: "scale(2.2)" },
            },
            {
              name: "HP Inc.",
              src: "/hp.png",
              tag: "Global Enterprise",
              imgStyle: { transform: "scale(1.3)" },
            },
          ].map((logo) => (
            <div
              key={logo.name}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/15"
            >
              <div className="flex h-20 w-full items-center justify-center overflow-hidden p-2">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-16 w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-110"
                  style={logo.imgStyle}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {logo.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FAQAccordion />
      </section>
    </>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-pill-container">
      {faqItems.map((item, idx) => (
        <FAQAccordionItem
          key={item.question}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === idx}
          onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
        />
      ))}
    </div>
  );
}
