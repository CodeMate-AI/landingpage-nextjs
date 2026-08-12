"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * CommunityMetrics highlights the key community impact statistics.
 */
const metrics = [
  { value: "9+", label: "Production Apps Built" },
  { value: "48h", label: "Average Build Time" },
  { value: "100%", label: "CodeMate SDLC Generated" },
];

export default function CommunityMetrics() {
  return (
    <section className="flex justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full max-w-4xl flex-col items-center justify-center gap-6 rounded-2xl border border-white/5 bg-zinc-950/40 p-6 backdrop-blur-md sm:flex-row sm:gap-0 sm:p-8"
      >
        {metrics.map((metric, i) => (
          <div key={metric.label} className="flex w-full flex-col items-center sm:w-auto sm:flex-row">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center px-6 text-center sm:px-10 lg:px-14"
            >
              <span className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                {metric.value}
              </span>
              <span className="mt-2 whitespace-nowrap text-xs font-medium text-zinc-400 sm:text-sm">
                {metric.label}
              </span>
            </motion.div>

            {i < metrics.length - 1 && <div className="hidden h-12 w-px bg-zinc-800 sm:block" />}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
