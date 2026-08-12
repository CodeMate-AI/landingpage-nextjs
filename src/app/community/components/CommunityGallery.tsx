"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { projects, ProjectCategory } from "../lib/communityProjects";
import CommunityFilterBar from "./CommunityFilterBar";
import CommunityProjectCard from "./CommunityProjectCard";

/**
 * CommunityGallery owns the active category state and renders the responsive grid.
 */
export default function CommunityGallery() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All Projects");

  const filteredProjects =
    activeCategory === "All Projects"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
      >
        Project Showcase
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-400 sm:text-base"
      >
        Production-grade platforms and dev utilities shipped autonomously by our team using CodeMate's AI-native pipeline.
      </motion.p>

      <CommunityFilterBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} totalCount={projects.length} />

      <div className="mt-4 grid w-full grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, i) => (
          <CommunityProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60 text-zinc-500">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-base font-semibold text-white sm:text-lg">No projects found</span>
          <span className="text-xs text-zinc-500 sm:text-sm">Try selecting a different category from above.</span>
        </motion.div>
      )}
    </section>
  );
}
