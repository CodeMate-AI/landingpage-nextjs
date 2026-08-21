"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, ProjectCategory } from "../lib/communityProjects";
import CommunityFilterBar from "./CommunityFilterBar";
import CommunityProjectCard from "./CommunityProjectCard";

// Renders the filterable showcase grid with category navigation and project counts.
export default function CommunityGallery() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All Projects");
  const [visibleCount, setVisibleCount] = useState(6);

  const handleCategoryChange = (category: ProjectCategory) => {
    setActiveCategory(category);
    setVisibleCount(6); // Reset pagination on category change
  };

  const filteredProjects =
    activeCategory === "All Projects"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const projectsToRender = filteredProjects.slice(0, visibleCount);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8 lg:pb-28 lg:pt-12">
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

      <CommunityFilterBar activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

      <div className="mt-4 grid w-full grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {projectsToRender.map((project, i) => (
            <CommunityProjectCard key={project.id} project={project} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Center-aligned 'Show More' Button */}
      {filteredProjects.length > visibleCount && (
        <div className="mt-12 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-zinc-900/80 px-8 py-3 text-sm font-semibold text-white shadow-xl backdrop-blur-md transition-all hover:bg-zinc-800 hover:border-white/25"
          >
            Show More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.button>
        </div>
      )}

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
