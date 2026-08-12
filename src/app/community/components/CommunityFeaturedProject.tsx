"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CommunityFeaturedProject showcases the flagship Orbit CRM demo with a mock browser
 * frame, CTA buttons, and a short SDLC journey summary.
 */
function BrowserMockup() {
  const navItems = [
    { label: "Dashboard", active: true, icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
    { label: "Contacts", active: false, icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
    { label: "Deals", active: false, icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
    { label: "Analytics", active: false, icon: "M18 20V10M12 20V4M6 20v-6" },
    { label: "Settings", active: false, icon: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" },
  ];

  const activities = [
    { text: "New lead captured from landing page", time: "2m ago", dot: "#10B981" },
    { text: "Deal moved to Negotiation stage", time: "15m ago", dot: "#00BFFF" },
    { text: "Contact assigned to Engineering Lead", time: "1h ago", dot: "#8B5CF6" },
    { text: "Automated follow-up triggered by AI", time: "3h ago", dot: "#10B981" },
  ];

  const chartHeights = [35, 58, 42, 78, 55, 68, 90];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#09090b] shadow-2xl">
      <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-md border border-zinc-800/80 bg-zinc-950 px-3 py-1 text-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="font-mono text-[11px] text-zinc-400">orbit-crm.codemate.ai</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden w-36 shrink-0 flex-col gap-0.5 border-r border-zinc-800/80 bg-zinc-900/40 p-3 sm:flex sm:w-40">
          <div className="mb-3 flex items-center gap-2 px-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-600">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <span className="text-xs font-bold text-white">Orbit CRM</span>
          </div>
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors ${
                item.active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={item.active ? "#FFFFFF" : "#71717A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
            </div>
          ))}
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-hidden p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white sm:text-sm">Customer Overview</span>
            <span className="rounded-md bg-white px-2.5 py-1 text-[10px] font-bold text-black">+ Add Deal</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total Leads", value: "2,847" },
              { label: "Conversion", value: "24.8%" },
              { label: "Revenue", value: "$1.2M" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-zinc-800/60 bg-zinc-900/80 p-2">
                <span className="block text-[9px] text-zinc-400">{s.label}</span>
                <span className="block text-xs font-bold text-white sm:text-sm">{s.value}</span>
              </div>
            ))}
          </div>

          <div className="flex h-20 items-end gap-1.5 rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-2.5 sm:h-24 sm:p-3">
            {chartHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all duration-500"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(180deg, #34D399 ${100 - h}%, #10B981 100%)`,
                  opacity: 0.6 + i * 0.06,
                }}
              />
            ))}
          </div>

          <div className="flex flex-col gap-1.5 rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-2 sm:p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Recent AI Activities</span>
            {activities.slice(0, 3).map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: a.dot }} />
                <span className="flex-1 truncate text-[10px] text-zinc-300">{a.text}</span>
                <span className="shrink-0 font-mono text-[9px] text-zinc-500">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoOverlay() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-[2px]">
      <AnimatePresence mode="wait">
        {!isPlaying && (
          <motion.button
            key="play"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-shadow"
            aria-label="Play full-stack walkthrough demo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="8,5 20,12 8,19" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-6">
        <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-700">
          <div className="h-full rounded-full bg-cyan-400" style={{ width: "42%" }} />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <span>0:14 / 0:35</span>
          <span>Full-Stack Demo</span>
        </div>
      </div>
    </div>
  );
}

export default function CommunityFeaturedProject() {
  const sdlcSteps = [
    {
      title: "BUILD · Design Mode",
      description: "Wireframes, UI component library, and navigation flows generated from natural language prompts.",
    },
    {
      title: "BUILD · Code Mode",
      description: "Complete full-stack scaffold, REST endpoints, database migrations, and auth system generated autonomously.",
    },
    {
      title: "CORA · VS Code",
      description: "In-IDE refactoring, automated PR reviews, unit tests, and performance audits with CORA agent.",
    },
  ];

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 text-center text-3xl font-extrabold tracking-tight text-white sm:mb-8 sm:text-4xl md:text-5xl"
      >
        Featured Project
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full max-w-7xl flex-col gap-8 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-xl lg:p-10"
      >
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="flex w-full flex-col gap-5 lg:w-[58%]">
            <div className="relative h-[380px] w-full overflow-hidden rounded-2xl sm:h-[420px]">
              <BrowserMockup />
              <VideoOverlay />
            </div>
          </div>

          <div className="flex w-full flex-col gap-5 lg:w-[42%] lg:pl-2">
            <h3 className="text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
              Orbit CRM
            </h3>

            <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
              Orbit CRM showcases CodeMate AI in action, with BUILD and CORA generating, reviewing, and refining code from idea to production.
            </p>

            <div className="mt-1 flex flex-col gap-4 rounded-2xl border border-white/5 bg-zinc-950/60 p-5">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">SDLC Journey</span>

              <div className="flex flex-col gap-0">
                {sdlcSteps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 font-mono text-[11px] font-semibold text-zinc-300">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      {i < sdlcSteps.length - 1 && <div className="mt-1 w-px flex-1 bg-zinc-800/80" style={{ minHeight: "2.2rem" }} />}
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-white sm:text-sm">
                        {step.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-zinc-400">
                        {step.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Centered Action Buttons (Horizontal across Mobile, iPad, and Desktop) */}
        <div className="flex w-full flex-row items-center justify-center gap-2.5 pt-2 sm:gap-4 sm:pt-0">
          <motion.a
            href="https://app.codemate.ai"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-bold text-black shadow-lg transition-shadow hover:bg-zinc-100 sm:gap-2 sm:px-6 sm:py-2.5 sm:text-sm"
          >
            Visit Live App
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:h-3.5 sm:w-3.5">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </motion.a>

          <motion.a
            href="https://docs.codemate.ai"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-zinc-800/40 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800/80 sm:gap-2 sm:px-6 sm:py-2.5 sm:text-sm"
          >
            View Docs
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:h-3.5 sm:w-3.5">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
