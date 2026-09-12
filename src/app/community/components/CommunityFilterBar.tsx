"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCategory, projects } from "../lib/communityProjects";

/**
 * CommunityFilterBar renders:
 * 1. Desktop: Centered frosted-glass category pill strip.
 * 2. Mobile/Tablet: Filter trigger bar with a slide-out drawer coming from the left.
 */
interface FilterBarProps {
  activeCategory: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
}

const filterCategories: ProjectCategory[] = [
  "All Projects",
  "Enterprise CRMs",
  "Developer Tools",
  "AI Agents & SaaS",
  "Internal Utilities",
];

export default function CommunityFilterBar({ activeCategory, onCategoryChange }: FilterBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

  const getCategoryCount = (category: ProjectCategory) => {
    if (category === "All Projects") return projects.length;
    return projects.filter((p) => p.category === category).length;
  };

  const handleSelectCategory = (category: ProjectCategory) => {
    onCategoryChange(category);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Desktop View: Centered Pill Strip */}
      <section className="mx-auto hidden w-full max-w-7xl justify-center px-4 py-4 sm:px-6 lg:flex lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full max-w-full justify-center"
        >
          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-1.5 shadow-xl backdrop-blur-xl">
            {filterCategories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`relative shrink-0 select-none whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
                    isActive
                      ? "bg-white font-semibold text-black shadow-lg"
                      : "bg-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Mobile & Tablet View: Trigger Bar */}
      <section className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-zinc-900/80 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all hover:bg-zinc-800 hover:border-white/25 active:scale-95"
          aria-label="Open filter menu"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filters</span>
          {activeCategory !== "All Projects" && (
            <span className="h-2 w-2 rounded-full bg-white" />
          )}
        </button>

        <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400">
          <span className="font-medium text-white">{activeCategory}</span>
          <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
            {getCategoryCount(activeCategory)}
          </span>
        </div>
      </section>

      {/* Mobile & Tablet Slide-Out Drawer (Coming from Left) */}
      {mounted && createPortal(
        <AnimatePresence>
          {isDrawerOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[999999999999] bg-black/80 backdrop-blur-md"
                onClick={() => setIsDrawerOpen(false)}
                aria-hidden="true"
              />

              {/* Slide-In Drawer Panel from Left */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-0 left-0 top-0 z-[999999999999] flex w-[85%] max-w-[340px] flex-col border-r border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center text-zinc-200">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Filter Projects</h2>
                      <p className="text-xs text-zinc-400">Select project category</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-white"
                    aria-label="Close filter drawer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Filter Options List */}
                <div className="mt-6 flex flex-1 flex-col gap-2.5 overflow-y-auto">
                  {filterCategories.map((category) => {
                    const isActive = activeCategory === category;
                    const count = getCategoryCount(category);

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleSelectCategory(category)}
                        className={`group flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-all ${
                          isActive
                            ? "border-white/30 bg-zinc-900/70 text-white shadow-lg"
                            : "border-zinc-800/80 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-3.5 w-3.5 shrink-0 rounded-full transition-all ${
                              isActive
                                ? "bg-white shadow-sm"
                                : "border border-zinc-700/80 bg-zinc-900/40 group-hover:border-zinc-500"
                            }`}
                          />
                          <span className={isActive ? "font-semibold text-white" : ""}>{category}</span>
                        </div>

                        <span className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                          isActive ? "bg-zinc-800 text-zinc-200" : "bg-zinc-800/80 text-zinc-400"
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Reset */}
                {activeCategory !== "All Projects" && (
                  <div className="border-t border-zinc-800/80 pt-4">
                    <button
                      type="button"
                      onClick={() => handleSelectCategory("All Projects")}
                      className="w-full rounded-xl border border-zinc-700/80 bg-zinc-800/60 py-2.5 text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white"
                    >
                      Reset to All Projects
                    </button>
                  </div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
