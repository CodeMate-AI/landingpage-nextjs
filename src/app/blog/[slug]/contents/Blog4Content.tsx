"use client";

import React, { useState } from "react";

interface AtAGlanceRow {
  category: string;
  codemate: string;
  githubCopilot: string;
}

interface CapabilityRow {
  capability: string;
  codemate: string;
  githubCopilot: string;
}

const atAGlanceRows: AtAGlanceRow[] = [
  { category: "Primary Goal", codemate: "AI Software Engineering Platform", githubCopilot: "AI Pair Programmer" },
  { category: "Best For", codemate: "Enterprise engineering organizations", githubCopilot: "Individual developers and GitHub-first teams" },
  { category: "Core Philosophy", codemate: "Improve the entire SDLC", githubCopilot: "Speed up coding" },
  { category: "Intelligence Scope", codemate: "Organization-wide knowledge", githubCopilot: "Repository-centric" },
  { category: "Deployment", codemate: "SaaS, VPC, Self-hosted, On-Prem", githubCopilot: "Cloud" },
  { category: "Enterprise Focus", codemate: "Engineering platform with governance", githubCopilot: "GitHub ecosystem" },
];

const architectureRows: CapabilityRow[] = [
  // 1. Text-based comparisons on top
  { capability: "AI Role", codemate: "Engineering Platform", githubCopilot: "Pair Programmer" },
  { capability: "Cross-Repository Context", codemate: "check", githubCopilot: "Limited" },

  // 2. Both sides tick mark
  { capability: "Repository Awareness", codemate: "check", githubCopilot: "check" },

  // 3. Tick cross at bottom
  { capability: "Persistent Knowledge", codemate: "check", githubCopilot: "check" },
  { capability: "Organizational Memory", codemate: "check", githubCopilot: "cross" },
];

const contextRows: CapabilityRow[] = [
  // 1. Text-based / partial comparisons on top
  { capability: "Multiple Repository Context", codemate: "check", githubCopilot: "Limited" },
  { capability: "Internal Documentation", codemate: "check", githubCopilot: "Partial" },
  { capability: "API Documentation", codemate: "check", githubCopilot: "Partial" },
  { capability: "Wiki Integration", codemate: "check", githubCopilot: "Limited" },

  // 2. Both sides tick mark
  { capability: "Current File Context", codemate: "check", githubCopilot: "check" },
  { capability: "Repository Context", codemate: "check", githubCopilot: "check" },
  { capability: "Proprietary LLM Support", codemate: "check", githubCopilot: "check" },
  { capability: "Custom Models", codemate: "check", githubCopilot: "check" },
];

const deploymentRows: CapabilityRow[] = [
  // Matching rows on top
  { capability: "SaaS", codemate: "check", githubCopilot: "check" },
  { capability: "Bring Your Own Model (BYOM)", codemate: "check", githubCopilot: "check" },
  // Unmatching rows at bottom
  { capability: "VPC", codemate: "check", githubCopilot: "cross" },
  { capability: "On-Prem / Self Hosted", codemate: "check", githubCopilot: "cross" }
];

const faqItems = [
  {
    question: "How is CodeMate different from GitHub Copilot?",
    answer: "The biggest difference is architectural. GitHub Copilot acts as an AI pair programmer centered around repositories and GitHub workflows. CodeMate is designed as an AI software engineering platform that builds a persistent knowledge layer across repositories, documentation, architecture, and engineering standards to support planning, development, testing, reviews, and governance."
  },
  {
    question: "Which platform is better for enterprise engineering teams?",
    answer: "It depends on organizational priorities. If your organization is heavily invested in GitHub and primarily wants to improve developer productivity, GitHub Copilot is a natural choice. If your organization requires organization-wide knowledge sharing, governance, private deployment, or support for regulated environments, CodeMate offers capabilities aimed at those enterprise requirements."
  },
  {
    question: "Does GitHub Copilot support self-hosted or on-premise deployment?",
    answer: "No. GitHub Copilot operates through GitHub and Microsoft cloud infrastructure. Organizations requiring air-gapped or fully self-hosted deployments would need an alternative approach."
  },
  {
    question: "Can CodeMate run with proprietary LLMs?",
    answer: "Yes. CodeMate supports deployment in private infrastructure and can integrate with enterprise-managed language models, including services such as Amazon Bedrock, Vertex AI, Ollama, and custom models, depending on deployment configuration."
  },
  {
    question: "Which platform provides better code reviews?",
    answer: "Both platforms provide AI-assisted code reviews, but their scope differs. GitHub Copilot performs repository-aware reviews integrated into GitHub pull requests. CodeMate extends reviews with persistent organizational knowledge and can evaluate changes using information from multiple repositories and engineering standards."
  },
  {
    question: "Does CodeMate replace GitHub Copilot?",
    answer: "Not necessarily. The two products target overlapping but different use cases. Some organizations may choose GitHub Copilot for developer assistance, while others may prefer CodeMate as a broader engineering platform. The right choice depends on workflow, governance, deployment, and organizational requirements."
  },
  {
    question: "Which platform is better for large codebases?",
    answer: "Large engineering organizations often benefit from tools that can maintain context across multiple repositories, documentation, and architectural components. CodeMate is designed with persistent organizational knowledge for this scenario, while GitHub Copilot primarily operates within repository-centric workflows."
  },
  {
    question: "Can both tools generate tests and documentation?",
    answer: "Yes. Both platforms support AI-assisted code generation and test creation. CodeMate integrates these capabilities into its broader engineering workflow, while GitHub Copilot provides them through chat and agent-based interactions."
  }
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
    return <span className="icon-square icon-square-cross" title="Not supported">✕</span>;
  }
  return <span className="badge-text-clean">{val}</span>;
}

export default function Blog4Content() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <section>
        <h2 id="intro">Beyond AI Code Completion : Choosing the Right AI Platform for Modern Engineering Teams</h2>
        <p className="lead">
          AI coding assistants have become a standard part of software development. But as engineering organizations move from individual experimentation to enterprise-wide adoption, a more important question emerges: Is your AI merely helping developers write code, or is it helping your organization build better software?
        </p>

        <p>
          For the past few years, the conversation around AI coding has largely revolved around autocomplete, chat, and code generation. GitHub Copilot set the standard by bringing AI directly into the IDE, enabling millions of developers to generate functions, explain code, and automate repetitive tasks with remarkable ease.
        </p>
        <p>
          For individual productivity, that model works exceptionally well.
        </p>
        <p>
          However, engineering organizations eventually encounter a different set of challenges, ones that cannot be solved by faster code generation alone.
        </p>
        <p>
          As teams grow, software becomes more distributed. Architectures span dozens of repositories, hundreds of microservices, thousands of APIs, and years of accumulated engineering decisions. Documentation becomes fragmented. Tribal knowledge lives with senior engineers. Code reviews vary by reviewer. New developers spend weeks understanding systems before making meaningful contributions.
        </p>
        <p>
          At this stage, the limiting factor is no longer <strong>how quickly code can be written</strong>.
        </p>
        <p>
          It’s <strong>how effectively engineering knowledge can be shared, governed, and applied across the organization</strong>.
        </p>
        <p>
          This is where the architectural philosophies of GitHub Copilot and CodeMate begin to diverge.
        </p>
        <p>
          GitHub Copilot approaches AI as an intelligent pair programmer deeply integrated into the GitHub ecosystem. It focuses on helping developers generate code faster, automate pull requests, review changes, and work more efficiently within existing GitHub workflows.
        </p>
        <p>
          CodeMate takes a broader approach.
        </p>
        <p>
          Rather than viewing AI as another developer tool, it treats AI as an engineering platform that continuously learns from repositories, documentation, architectural patterns, engineering standards, and historical decisions. Instead of rebuilding context for every interaction, it creates a persistent knowledge layer that can support every engineer across the software development lifecycle.
        </p>
        <p>
          The distinction may seem subtle at first, but it fundamentally changes what each platform is optimized to solve.
        </p>
        <p>
          This article compares both platforms from an engineering perspective, not to determine which AI writes better code snippets, but to understand which architecture better supports modern software teams as they scale.
        </p>
      </section>

      <section>
        <h2>The Shift from AI Assistants to AI Engineering Platforms</h2>
        <p>
          The first generation of AI coding tools focused on a single objective:
        </p>
        <p className="font-bold text-white my-4">
          Help developers write code faster.
        </p>
        <p>
          The next generation is tackling a more complex problem:
        </p>
        <p className="font-bold text-white my-4">
          Help engineering organizations build software more intelligently.
        </p>
        <p>
          These goals may appear similar, but they require fundamentally different architectures.
        </p>
        <p>
          Traditional coding assistants typically process the current repository, user prompt, and surrounding code before generating a response. Their effectiveness is largely determined by the quality of the immediate context and developer interaction.
        </p>
        <p>
          Enterprise engineering platforms extend that model by maintaining a broader understanding of the organization. They continuously index repositories, documentation, architectural relationships, APIs, and development practices, enabling AI to reason beyond a single repository or session.
        </p>
      </section>

      <section>
        <h2 id="at-a-glance">At a Glance</h2>
        <p>
          CodeMate VS GitHub Copilot : Beyond AI Code Completion comparison table:
        </p>

        <div className="clean-table-container my-6">
          <table className="clean-comparison-table">
            <thead>
              <tr>
                <th scope="col" className="col-capability">Category</th>
                <th scope="col" className="col-product">CodeMate</th>
                <th scope="col" className="col-product">GitHub Copilot</th>
              </tr>
            </thead>
            <tbody>
              {atAGlanceRows.map((row, idx) => (
                <tr key={idx}>
                  <th scope="row" className="cell-capability">{row.category}</th>
                  <td className="cell-product">
                    <RenderTableCell val={row.codemate} />
                  </td>
                  <td className="cell-product">
                    <RenderTableCell val={row.githubCopilot} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 id="architecture-comparison">Architecture Comparison</h2>
        <div className="clean-table-container my-6">
          <table className="clean-comparison-table">
            <thead>
              <tr>
                <th scope="col" className="col-capability">Capability</th>
                <th scope="col" className="col-product">CodeMate</th>
                <th scope="col" className="col-product">GitHub Copilot</th>
              </tr>
            </thead>
            <tbody>
              {architectureRows.map((row, idx) => (
                <tr key={idx}>
                  <th scope="row" className="cell-capability">{row.capability}</th>
                  <td className="cell-product">
                    <RenderTableCell val={row.codemate} />
                  </td>
                  <td className="cell-product">
                    <RenderTableCell val={row.githubCopilot} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 id="context-comparison">Context & Knowledge Engine</h2>
        <p>
          The quality of AI-generated code depends heavily on context.
        </p>
        <p>
          GitHub Copilot primarily gathers context from the active repository and surrounding code.
        </p>
        <p>
          CodeMate continuously builds an organizational knowledge base that spans repositories, internal documentation, APIs, and historical engineering decisions, enabling broader context for planning, reviews, and collaboration.
        </p>

        <div className="clean-table-container my-6">
          <table className="clean-comparison-table">
            <thead>
              <tr>
                <th scope="col" className="col-capability">Capability</th>
                <th scope="col" className="col-product">CodeMate</th>
                <th scope="col" className="col-product">GitHub Copilot</th>
              </tr>
            </thead>
            <tbody>
              {contextRows.map((row, idx) => (
                <tr key={idx}>
                  <th scope="row" className="cell-capability">{row.capability}</th>
                  <td className="cell-product">
                    <RenderTableCell val={row.codemate} />
                  </td>
                  <td className="cell-product">
                    <RenderTableCell val={row.githubCopilot} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 id="deployment">Security & Deployment</h2>
        <p>
          Deployment architecture often matters as much as AI capability in enterprise environments.
        </p>
        <p>
          GitHub Copilot operates as a cloud service integrated with GitHub.
        </p>
        <p>
          CodeMate supports SaaS, VPC, self-hosted, and on-premises deployments, with options to connect to private language models for organizations with strict compliance or data residency requirements.
        </p>

        <div className="clean-table-container my-6">
          <table className="clean-comparison-table">
            <thead>
              <tr>
                <th scope="col" className="col-capability">Capability</th>
                <th scope="col" className="col-product">CodeMate</th>
                <th scope="col" className="col-product">GitHub Copilot</th>
              </tr>
            </thead>
            <tbody>
              {deploymentRows.map((row, idx) => (
                <tr key={idx}>
                  <th scope="row" className="cell-capability">{row.capability}</th>
                  <td className="cell-product">
                    <RenderTableCell val={row.codemate} />
                  </td>
                  <td className="cell-product">
                    <RenderTableCell val={row.githubCopilot} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 id="faq">Frequently Asked Questions</h2>
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
      </section>
    </>
  );
}
