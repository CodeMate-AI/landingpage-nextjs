import React from "react";

export default function Blog2Content() {
  return (
    <>
      <p className="lead" id="intro">
        Cora by CodeMate AI has achieved a <strong>76% resolution rate</strong> on the <strong>SWE-bench verified subset</strong>, outperforming industry leaders like <strong>GitHub Copilot</strong> and <strong>Cursor</strong> on real-world software engineering tasks.
      </p>

      <div className="img-block my-6" style={{ margin: "24px 0" }}>
        <img src="/cora_sota_swebench.jpeg" alt="Cora SWE-bench Verified SOTA chart" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "#080f12" }} />
      </div>

      <p>
        This milestone reflects not just benchmark success, but a fundamental shift in how developers can collaborate with AI; from simple autocompletion to autonomous, context-aware code generation.
      </p>

      <h2 id="redefining-code-gen">How Cora is Redefining Autonomous Code Generation</h2>
      <p>
        Cora is designed to handle complex software engineering workflows end-to-end. By utilizing a single-agent system that plans, edits, and governs the entire lifecycle of a coding task, it outperforms traditional autocomplete solutions.
      </p>

      <h2 id="what-is-cora">What is Cora?</h2>
      <p>
        Cora is an <strong>autonomous coding agent for VS Code</strong> designed to handle complex software engineering workflows end-to-end. It doesn’t just suggest snippets - it <strong>plans, writes, tests, and validates</strong> production-ready code. Cora can:
      </p>
      <ul className="mb-6 list-disc pl-6" style={{ color: "var(--text-secondary)" }}>
        <li className="mb-2">Generate complete projects from natural-language prompts - including files, dependencies, and configurations.</li>
        <li className="mb-2">Analyze entire codebases and make context-aware edits.</li>
        <li className="mb-2">Seek user approval before executing critical actions.</li>
        <li className="mb-2">Deliver validated, production-ready solutions directly in your workspace.</li>
      </ul>
      <p>
        Unlike typical AI assistants, Cora understands <strong>architecture, dependencies, and intent</strong> - operating as a self-directed engineering agent rather than a reactive autocomplete tool.
      </p>

      <h2 id="how-cora-achieves-sota">How Cora Achieves State-of-the-Art Performance</h2>
      <p>
        Cora’s breakthrough lies in its combination of specialized reasoning tooling and a self-directed execution loop that continuously validates generated solutions. Instead of guessing, Cora models the problem, tests hypotheses, and refines code until it compiles and passes all checks.
      </p>

      <h2 id="patch-generation-tooling">Patch Generation and Tooling</h2>
      <p>
        Cora employs a <strong>single-agent architecture</strong> capable of autonomously generating and applying patches to large codebases. It is equipped with a specialized toolset for reasoning, code inspection, and system interaction - including file analysis, diff-based editing, command execution, and intelligent completion validation. We provide Cora with the following tools:
      </p>
      <ul className="mb-6 list-disc pl-6" style={{ color: "var(--text-secondary)" }}>
        <li className="mb-2"><strong>inspect_workspace:</strong> Unified inspection layer for browsing, reading, and analyzing project structure or content before editing.</li>
        <li className="mb-2"><strong>modify_file:</strong> One editing surface that handles full rewrites, incremental diffs, insertions, or regex replacements.</li>
        <li className="mb-2"><strong>run_command:</strong> Execute shell and browser automation tasks under controlled approval.</li>
        <li className="mb-2"><strong>manage_task:</strong> Control Cora’s task lifecycle - start, switch, complete, or compress context intelligently.</li>
        <li className="mb-2"><strong>govern_workflow:</strong> Manages task understanding, clarification, and structured progress tracking.</li>
      </ul>

      <h2 id="agentic-advantage">The Agentic Advantage</h2>
      <p>
        Cora’s power lies in its <strong>autonomous agent architecture</strong>, designed for both <strong>independence and accountability</strong>. For your team Cora can:
      </p>
      <ul className="mb-6 list-disc pl-6" style={{ color: "var(--text-secondary)" }}>
        <li className="mb-2">Reason across codebases to understand structure and dependencies.</li>
        <li className="mb-2">Make implementation decisions without constant developer input.</li>
        <li className="mb-2">Maintain consistency and code quality across multiple files.</li>
        <li className="mb-2">Debug and iterate until all tests pass.</li>
        <li className="mb-2">Request approval only for critical operations.</li>
      </ul>

      <div className="img-block my-6" style={{ margin: "24px 0" }}>
        <img src="/cora_architecture.png" alt="Cora Architecture Diagram" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)" }} />
        <p className="has-text-align-center" style={{ textAlign: "center", fontSize: "14px", color: "var(--text-tertiary)", marginTop: "8px" }}>
          <em>This flow chart shows how the internal architecture of CORA looks like.</em>
        </p>
      </div>

      <h2 id="real-world-engineering">Built for Real-World Engineering</h2>
      <p>
        The <strong>SWE-bench benchmark</strong> evaluates AI agents on real GitHub issues and pull requests from major open-source projects - representing the complexity of real-world software development. Each task requires:
      </p>
      <ul className="mb-6 list-disc pl-6" style={{ color: "var(--text-secondary)" }}>
        <li className="mb-2">Understanding project architecture and conventions.</li>
        <li className="mb-2">Multi-file reasoning and consistency maintenance.</li>
        <li className="mb-2">Generating patches that pass existing test suites.</li>
        <li className="mb-2">Iterative debugging and refinement.</li>
      </ul>
      <p>
        Cora successfully resolved <strong>76 SWE-Bench verified instances</strong>, showing its ability to handle engineering challenges that typically require senior developer expertise.
      </p>

      <div className="img-block my-6" style={{ margin: "24px 0" }}>
        <img src="/cora_benchmark.png" alt="Cora SWE-bench Verified results" style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)" }} />
      </div>

      <h2 id="optimized-for-correctness">Optimized for Correctness, Not Just Speed</h2>
      <p>
        In software engineering, <strong>speed without correctness</strong> adds rework - not value. Let’s compare how other tools fare:
      </p>
      <ul className="mb-6 list-disc pl-6" style={{ color: "var(--text-secondary)" }}>
        <li className="mb-2"><strong>Cursor</strong> averaged <em>48 seconds</em> per task but resolved only <em>51 out of 100</em> issues.</li>
        <li className="mb-2"><strong>Cora</strong> averaged <em>134 seconds</em> per task yet resolved <em>76</em> issues with <strong>validated, working solutions</strong>.</li>
      </ul>
      <p>
        The takeaway: correctness-first saves developers far more time downstream by avoiding debugging and manual fixes. In software development, the real metric is <strong>time to working solution</strong>, not time to first output.
      </p>

      <div className="video-block my-6" style={{ margin: "24px 0" }}>
        <video
          src="/blog2_Video.mp4"
          controls
          muted
          playsInline
          style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--border)", aspectRatio: "16 / 9" }}
        />
      </div>

      <h2 id="transparent-evaluation">Transparent, Reproducible, Open Evaluation</h2>
      <p>
        We believe transparency builds trust. Our SWE-bench results are <strong>fully reproducible and publicly available</strong> for verification. Our methodology includes:
      </p>
      <ul className="mb-6 list-disc pl-6" style={{ color: "var(--text-secondary)" }}>
        <li className="mb-2">Standard <strong>SWE-bench dataset and test harness</strong> used across the research community.</li>
        <li className="mb-2">Consistent environment and timeout configurations.</li>
        <li className="mb-2">Open-source benchmark infrastructure maintained by leading institutions.</li>
        <li className="mb-2">Automated validation against real test suites.</li>
      </ul>
      <p>
        All evaluation logs, configurations, and patch traces are available on our <strong>GitHub repository</strong> for independent review. This commitment to openness ensures developers can verify, reproduce, and trust every claim we make.
      </p>

      <h2 id="experience-cora">Experience Cora Yourself</h2>
      <p>
        Benchmarks prove performance - experience builds conviction. Get started:
      </p>
      <ul className="mb-6 list-disc pl-6" style={{ color: "var(--text-secondary)" }}>
        <li className="mb-2"><strong>Install Cora</strong> from the <a href="https://marketplace.visualstudio.com/items?itemName=CodeMateAI.codemate-agent" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>VS Code Marketplace</a>.</li>
        <li className="mb-2">Explore our <strong>evaluation results</strong> on <a href="https://github.com/CodeMate-AI/swe-benchmarking" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>GitHub</a>.</li>
        <li className="mb-2">Visit <a href="https://codemate.ai/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>codemate.ai</a> to learn more.</li>
      </ul>
    </>
  );
}
