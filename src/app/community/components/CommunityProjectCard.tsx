"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import type { Project } from "../lib/communityProjects";

/**
 * CommunityProjectCard renders one showcase project and selects a matching preview image.
 */
interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function CommunityProjectCard({ project, index = 0 }: ProjectCardProps) {
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group transform-gpu flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-xl backdrop-blur-md transition-[border-color,box-shadow] duration-200 hover:border-white/20 hover:shadow-2xl"
    >
      <div className="relative h-44 w-full overflow-hidden border-b border-zinc-800/80 bg-zinc-950/80 sm:h-48">
        <div className="relative h-full w-full cursor-pointer" onClick={() => setIsVideoOpen(true)}>
          <img
            src={project.previewImage}
            alt={`${project.name} Preview`}
            className="h-full w-full object-cover object-top"
          />
          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="8,5 20,12 8,19" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold leading-snug text-white transition-colors duration-200 group-hover:text-cyan-400">
          {project.name}
        </h3>

        <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">{project.description}</p>

        <div className="mt-auto flex items-center gap-4 border-t border-zinc-800/80 pt-3">
          <a href={project.demoUrl || "https://app.codemate.ai"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 transition-colors hover:text-cyan-300">
            Live Demo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
          <a href="https://docs.codemate.ai" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors hover:text-white">
            View Docs
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

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
                  <iframe
                    src="https://drive.google.com/file/d/1afHAYXZqWns_WrW634b9iDm6tUnecBPM/preview?autoplay=1&rm=minimal"
                    className="absolute -top-[54px] left-0 w-full h-[calc(100%+108px)] border-0 pointer-events-none lg:pointer-events-auto"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 z-10 bg-transparent lg:hidden" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.article>
  );
}
