"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * CommunityHero renders the introductory heading and supporting copy.
 * The section uses staggered motion for a simple entrance sequence.
 */
export default function CommunityHero() {
  return (
    <section className="relative mx-auto flex max-w-5xl flex-col items-start justify-center px-5 pb-8 pt-6 text-left sm:items-center sm:px-6 sm:pb-10 sm:pt-10 sm:text-center lg:px-8 lg:pb-12 lg:pt-12">

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl sm:leading-[1.15] md:text-6xl lg:text-7xl"
      >
        From Idea to Production :
        <br className="hidden sm:block" />{" "}
        <span className="bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent">See What We Built with</span>{" "}
        <br className="hidden sm:block" />
        <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">CodeMate AI</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:mt-8 sm:px-2 sm:text-base md:text-lg"
      >
        Explore how the CodeMate AI's SDLC transforms concepts into production-grade applications through intelligent design, automated code generation, and real-time developer assistance.
      </motion.p>
    </section>
  );
}
