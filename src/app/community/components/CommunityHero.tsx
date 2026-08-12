"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * CommunityHero renders the introductory heading and supporting copy.
 * The section uses staggered motion for a simple entrance sequence.
 */
export default function CommunityHero() {
  return (
    <section className="relative mx-auto flex max-w-5xl flex-col items-center justify-center px-4 pb-12 pt-8 text-center sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:pt-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[250px] w-[300px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 blur-[90px] sm:w-[500px]"
        aria-hidden="true"
      />

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
      >
        From Idea to Production:
        <br />
        What We Built with <span className="text-[#10B981]">BUILD</span> &
        <br />
        <span className="text-[#06B6D4]">CORA</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 max-w-2xl px-2 text-sm leading-relaxed text-zinc-400 sm:mt-8 sm:text-base md:text-lg"
      >
        Explore how the CodeMate AI ecosystem transforms concepts into production-grade applications through intelligent design, automated code generation, and real-time developer assistance.
      </motion.p>
    </section>
  );
}
