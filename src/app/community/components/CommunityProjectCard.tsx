"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Project } from "../lib/communityProjects";

/**
 * CommunityProjectCard renders one showcase project and selects a matching preview canvas.
 */
interface ProjectCardProps {
  project: Project;
  index?: number;
}

function TerminalPreview() {
  const lines = [
    { cmd: "mate init my-project", out: "Scaffolding components..." },
    { cmd: "mate deploy --prod", out: "Deploying to edge..." },
    { cmd: "mate migrate up", out: "Migrations applied ✓" },
  ];

  return (
    <div className="flex h-full flex-col justify-center gap-1.5 rounded-xl border border-zinc-800/70 bg-[#09090b] p-4 font-mono text-[10px] leading-relaxed sm:text-xs">
      {lines.map((l, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400">❯</span>
            <span className="text-zinc-200">{l.cmd}</span>
          </div>
          <span className="pl-3.5 text-zinc-500">{l.out}</span>
        </div>
      ))}
    </div>
  );
}

function SearchPreview() {
  return (
    <div className="flex h-full flex-col gap-2.5 rounded-xl border border-zinc-800/70 bg-[#09090b] p-3.5 sm:p-4">
      <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="text-xs text-zinc-400">semantic vector query...</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="rounded-md border border-zinc-800/50 bg-zinc-900/70 p-2">
          <span className="block text-xs font-bold text-white">Vector Match</span>
          <span className="block text-[10px] text-zinc-400">3 documents ranked in 12ms</span>
        </div>
        <div className="rounded-md border border-zinc-800/50 bg-zinc-900/70 p-2">
          <span className="block text-xs font-bold text-white">Code Embeddings</span>
          <span className="block text-[10px] text-emerald-400">similarity score: 0.982</span>
        </div>
      </div>
    </div>
  );
}

function HpPreview() {
  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-zinc-800/70 bg-[#09090b] p-3.5 sm:p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white">PageForge Builder</span>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">LIVE</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {[{ color: "#8B5CF6" }, { color: "#10B981" }, { color: "#00BFFF" }].map((c, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-md border border-zinc-800/40 bg-zinc-900/70 p-2">
            <div className="h-5 w-5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
            <div className="flex flex-1 flex-col gap-1">
              <span className="block h-1.5 w-20 rounded bg-zinc-700" />
              <span className="block h-1 w-12 rounded bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewPreview() {
  return (
    <div className="flex h-full flex-col justify-center gap-1 rounded-xl border border-zinc-800/70 bg-[#09090b] p-3 font-mono text-[10px] leading-snug sm:text-xs">
      <div className="flex gap-2">
        <span className="w-4 text-right text-zinc-600">42</span>
        <span className="text-zinc-400">function compute() {'{'}</span>
      </div>
      <div className="flex gap-2">
        <span className="w-4 text-right text-zinc-600">43</span>
        <span className="rounded bg-rose-500/15 px-1 text-rose-400">-  return oldValue;</span>
      </div>
      <div className="flex gap-2">
        <span className="w-4 text-right text-zinc-600">44</span>
        <span className="rounded bg-emerald-500/15 px-1 text-emerald-400">+  return newValue;</span>
      </div>
      <div className="flex gap-2">
        <span className="w-4 text-right text-zinc-600">45</span>
        <span className="text-zinc-400">{'}'}</span>
      </div>
    </div>
  );
}

function ApiPreview() {
  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-zinc-800/70 bg-[#09090b] p-3.5 font-mono text-[10px] sm:text-xs">
      <div className="flex items-center justify-between">
        <span className="rounded border border-cyan-500/30 bg-cyan-500/15 px-2 py-0.5 text-cyan-400">GET /api/v1/search</span>
        <span className="rounded border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-emerald-400">200 OK</span>
      </div>
      <div className="rounded-md border border-zinc-800/60 bg-zinc-900/70 p-2.5">
        <span className="block text-zinc-500">{`{`}</span>
        <span className="block pl-2 text-zinc-300">{`  "results": 12,`}</span>
        <span className="block pl-2 text-zinc-300">{`  "latency": "14ms"`}</span>
        <span className="block text-zinc-500">{`}`}</span>
      </div>
    </div>
  );
}

function DashPreview() {
  return (
    <div className="flex h-full flex-col gap-2.5 rounded-xl border border-zinc-800/70 bg-[#09090b] p-3.5 sm:p-4">
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "Users", value: "2.4K" },
          { label: "Revenue", value: "$89K" },
          { label: "Churn", value: "1.2%" },
          { label: "Active", value: "96%" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-zinc-800/60 bg-zinc-900/80 p-1.5">
            <span className="block text-[11px] font-bold text-white">{s.value}</span>
            <span className="block text-[9px] text-zinc-400">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="flex h-14 items-end gap-1 rounded-lg bg-zinc-900/50 p-2">
        {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-emerald-400" style={{ height: `${h}%`, opacity: 0.6 + i * 0.06 }} />
        ))}
      </div>
    </div>
  );
}

function SprintPreview() {
  const cols = [
    { title: "To Do", tasks: 2 },
    { title: "In Progress", tasks: 2 },
    { title: "Done", tasks: 2 },
  ];

  return (
    <div className="flex h-full gap-2 rounded-xl border border-zinc-800/70 bg-[#09090b] p-3">
      {cols.map((col) => (
        <div key={col.title} className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">{col.title}</span>
          {Array.from({ length: col.tasks }).map((_, i) => (
            <div key={i} className="rounded-md border border-zinc-800 bg-zinc-900/80 p-1.5">
              <span className="block h-1 w-3/4 rounded bg-zinc-600" />
              <span className="mt-1 block h-0.5 w-1/2 rounded bg-zinc-700" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function AdminPreview() {
  const rows = [
    { name: "Alice Chen", role: "Engineer", status: "Active" },
    { name: "Bob Smith", role: "Designer", status: "Active" },
    { name: "Carol Wu", role: "Manager", status: "Away" },
  ];

  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-zinc-800/70 bg-[#09090b] p-3">
      <div className="flex gap-1.5">
        {["Users", "Billing", "Audit"].map((t) => (
          <span key={t} className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[9px] font-medium text-zinc-400">
            {t}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-1 text-[9px] sm:text-[10px]">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2 rounded border border-zinc-800/40 bg-zinc-900/60 px-2 py-1 text-zinc-300">
            <span className="flex-1 truncate">{r.name}</span>
            <span className="text-zinc-500">{r.role}</span>
            <span className={`text-[9px] font-semibold ${r.status === "Active" ? "text-emerald-400" : "text-amber-400"}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewCanvas({ type }: { type: Project["previewType"] }) {
  switch (type) {
    case "terminal":
      return <TerminalPreview />;
    case "search":
      return <SearchPreview />;
    case "hp":
      return <HpPreview />;
    case "review":
      return <ReviewPreview />;
    case "api":
      return <ApiPreview />;
    case "dash":
      return <DashPreview />;
    case "sprint":
      return <SprintPreview />;
    case "admin":
      return <AdminPreview />;
    default:
      return <DashPreview />;
  }
}

export default function CommunityProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-2xl"
    >
      <div className="relative h-44 w-full overflow-hidden border-b border-zinc-800/80 bg-zinc-950/80 sm:h-48">
        <div className="absolute inset-0 p-3 sm:p-4">
          <PreviewCanvas type={project.previewType} />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 hover:scale-105">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 21,12 5,21" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-white">▶ 30s Demo</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-1.5">
          {project.metaBadges.map((badge) => {
            const isBuild = badge === "BUILD";
            const isCora = badge === "CORA";
            return (
              <span
                key={badge}
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  isBuild
                    ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                    : isCora
                      ? "border border-cyan-500/30 bg-cyan-500/15 text-cyan-400"
                      : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {badge}
              </span>
            );
          })}
        </div>

        <h3 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-cyan-400">
          {project.name}
        </h3>

        <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">{project.description}</p>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            Built in {project.buildTime}
          </span>
          <span className="text-xs text-zinc-500">
            {project.metricValue} {project.metricLabel}
          </span>
        </div>

        <div className="flex items-center gap-4 border-t border-zinc-800/80 pt-2">
          <a href="https://app.codemate.ai" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 transition-colors hover:text-emerald-300">
            Live Demo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
          <a href="https://docs.codemate.ai" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors hover:text-white">
            SDLC Docs
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </motion.article>
  );
}
