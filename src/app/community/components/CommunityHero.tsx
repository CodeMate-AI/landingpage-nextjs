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
        className="max-w-5xl text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-5xl sm:leading-[1.15] md:text-6xl lg:text-7xl"
      >
        From Idea to Production :
        <br />
        <span className="bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent">See What We Built with</span>
        <br />
        <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">CodeMate AI</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 max-w-2xl px-2 text-sm leading-relaxed text-zinc-400 sm:mt-8 sm:text-base md:text-lg"
      >
        Explore how the CodeMate AI's SDLC transforms concepts into production-grade applications through intelligent design, automated code generation, and real-time developer assistance.
      </motion.p>
    </section>
  );
}
