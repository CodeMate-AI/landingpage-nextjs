"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

/**
 * CommunityFeaturedProject showcases the flagship Orbit CRM demo with a mock browser
 * frame, CTA buttons, and a short SDLC journey summary.
 */
function BrowserMockup() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-zinc-950">
      <img
        src="/orbit_crm_community.png"
        alt="Orbit CRM Dashboard"
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}

export default function CommunityFeaturedProject() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVideoOpen(false);
    };

    if (isVideoOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isVideoOpen]);

  const sdlcSteps = [
    {
      title: "BUILD · Design Mode",
      description: "Wireframes, UI component library, and navigation flows generated from natural language prompts.",
    },
    {
      title: "BUILD · Prototype Mode",
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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="transform-gpu flex w-full max-w-7xl flex-col gap-8 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-md lg:p-10"
      >
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="flex w-full flex-col gap-5 lg:w-[58%]">
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-black lg:h-[420px] lg:aspect-auto">
              <div className="group relative h-full w-full cursor-pointer" onClick={() => setIsVideoOpen(true)}>
                <BrowserMockup />

                {/* Play overlay - hidden by default, visible on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-shadow"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="8,5 20,12 8,19" />
                    </svg>
                  </motion.div>
                </div>
              </div>
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
            href="https://orbit-crm-og.codemate.build/"
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

      {mounted && createPortal(
        <AnimatePresence>
          {isVideoOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[999999999999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-xl"
              onClick={() => setIsVideoOpen(false)}
            >
              <div className="relative w-full max-w-4xl aspect-video mx-4 md:mx-0">
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(false)}
                  className="absolute -top-16 right-0 z-[10000] rounded-full border border-white/10 bg-neutral-900/50 p-2 text-white/70 backdrop-blur-md transition-colors hover:bg-neutral-900/80 hover:text-white"
                  aria-label="Close video modal"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 24 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 24 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <video
                    src="/CRM.mp4"
                    autoPlay
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-contain bg-black"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
