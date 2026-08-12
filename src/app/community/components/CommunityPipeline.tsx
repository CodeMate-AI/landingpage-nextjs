"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * CommunityPipeline renders the three-stage SDLC flow used on the community page.
 * The stage cards stack on smaller screens and connect horizontally on desktop.
 */
const stages = [
  {
    number: "01",
    label: "BUILD · Design Mode",
    sub: "Prompts & Figma into UI",
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.12)",
    borderColor: "rgba(139, 92, 246, 0.35)",
    iconPath: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    number: "02",
    label: "BUILD · Code Mode",
    sub: "Full-Stack scaffolding & APIs",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.12)",
    borderColor: "rgba(16, 185, 129, 0.35)",
    iconPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
  {
    number: "03",
    label: "CORA · VS Code",
    sub: "Autonomous review & tests",
    color: "#00BFFF",
    bgColor: "rgba(0, 191, 255, 0.12)",
    borderColor: "rgba(0, 191, 255, 0.35)",
    iconPath: "M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5",
  },
];

export default function CommunityPipeline() {
  return (
    <section className="flex justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-10 lg:p-12"
      >
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-center md:gap-0">
          {stages.map((stage, i) => (
            <div key={stage.number} className="flex w-full flex-col items-center md:w-auto md:flex-row">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-105 sm:h-16 sm:w-16"
                  style={{ backgroundColor: stage.bgColor, borderColor: stage.borderColor }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={stage.color}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={stage.iconPath} />
                  </svg>
                </div>

                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider" style={{ color: stage.color }}>
                    Stage {stage.number}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-zinc-200 sm:text-base">
                    {stage.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-400">
                    {stage.sub}
                  </span>
                </div>
              </motion.div>

              {i < stages.length - 1 && (
                <>
                  <div className="relative mx-3 hidden h-px w-16 md:block lg:mx-6 lg:w-24">
                    <div
                      className="absolute inset-0 h-px"
                      style={{ background: `linear-gradient(90deg, ${stage.color} 0%, ${stages[i + 1].color} 100%)` }}
                    />
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2"
                      style={{
                        width: 0,
                        height: 0,
                        borderTop: "5px solid transparent",
                        borderBottom: "5px solid transparent",
                        borderLeft: `8px solid ${stages[i + 1].color}`,
                      }}
                    />
                  </div>
                  <div className="my-3 flex flex-col items-center md:hidden">
                    <div
                      className="h-8 w-px"
                      style={{ background: `linear-gradient(180deg, ${stage.color} 0%, ${stages[i + 1].color} 100%)` }}
                    />
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderTop: `8px solid ${stages[i + 1].color}`,
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
