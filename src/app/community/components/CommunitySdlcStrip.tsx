"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * CommunitySdlcStrip renders the simplified development flow strip.
 */
const nodes = ["Idea", "Design", "Code", "Agent", "Production"];

export default function CommunitySdlcStrip() {
  return (
    <section className="flex justify-center px-4 py-6 sm:px-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full max-w-4xl flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        {nodes.map((node, i) => (
          <div key={node} className="flex items-center gap-2 sm:gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-9 items-center rounded-full border border-zinc-800 bg-zinc-900/60 px-4 text-xs font-semibold text-zinc-400 transition-all duration-200 hover:border-zinc-700 hover:text-zinc-200 sm:h-10 sm:px-5 sm:text-sm"
            >
              {node}
            </motion.div>

            {i < nodes.length - 1 && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-zinc-600">
                <path d="M5 3L11 8L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
