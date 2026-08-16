"use client";

import React from "react";
import { motion } from "framer-motion";
import { projects } from "../lib/communityProjects";

const tickerProjects = [
  {
    id: "0",
    name: "Orbit CRM",
    category: "Enterprise CRMs",
    highlight: "Autonomous Full-Stack Sales Pipeline & Client Workspace",
    tag: "Flagship Showcase",
  },
  ...projects.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    highlight: p.description,
    tag: "Built with CodeMate",
  })),
];

export default function CommunityHero() {
  return (
    <section className="w-full overflow-hidden pb-4 pt-8 sm:pb-6 sm:pt-12">
      <div className="mx-auto mb-10 w-full max-w-7xl px-5 sm:mb-14 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 font-mono text-sm font-semibold uppercase tracking-[0.15em] text-[#3b82f6] sm:mb-6 sm:text-base"
        >
          THE CODEMATE COMMUNITY
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 max-w-[840px] text-4xl font-bold tracking-[-0.03em] text-white sm:text-5xl lg:text-[58px] leading-[1.08]"
        >
          Where engineering teams <br className="hidden sm:inline" />
          ship idea to production
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[640px] text-base leading-relaxed text-zinc-400 sm:text-lg lg:text-[20px]"
        >
          Explore production-grade platforms, developer tools, and internal utilities built autonomously with CodeMate's AI-native developer pipeline.
        </motion.p>
      </div>

      <div className="group relative w-full overflow-hidden border-y border-zinc-800 bg-zinc-950/60">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-zinc-950 to-transparent sm:w-36" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-zinc-950 to-transparent sm:w-36" />

        <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
          {[1, 2].map((setIndex) => (
            <div key={setIndex} className="flex shrink-0">
              {tickerProjects.map((item, idx) => (
                <div
                  key={`${setIndex}-${idx}`}
                  className="flex min-w-[300px] max-w-[400px] shrink-0 flex-col gap-2 border-r border-zinc-800 border-t-2 border-t-transparent px-6 py-5 transition-colors duration-200 hover:border-t-[#3b82f6] hover:bg-zinc-900/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#3b82f6]">
                      {item.category}
                    </span>
                    <span className="font-mono text-[11px] font-medium text-zinc-500">
                      {item.tag}
                    </span>
                  </div>
                  <div className="text-base font-bold text-white line-clamp-1 sm:text-lg">
                    {item.name}
                  </div>
                  <div className="text-xs leading-relaxed text-zinc-400 line-clamp-2">
                    {item.highlight}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
