"use client";

import React from "react";
import { motion } from "framer-motion";
import { ProjectCategory } from "../lib/communityProjects";

/**
 * CommunityFilterBar renders the category pills used to filter the gallery.
 */
interface FilterBarProps {
  activeCategory: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
  totalCount: number;
}

const filters: { label: ProjectCategory; hasCount?: boolean }[] = [
  { label: "All Projects", hasCount: true },
  { label: "Enterprise CRMs" },
  { label: "Developer Tools" },
  { label: "AI Agents & SaaS" },
  { label: "Internal Utilities" },
];

export default function CommunityFilterBar({ activeCategory, onCategoryChange, totalCount }: FilterBarProps) {
  return (
    <section className="mx-auto hidden w-full max-w-7xl justify-center px-4 py-4 sm:px-6 lg:flex lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full max-w-full justify-center"
      >
        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-1.5 shadow-xl backdrop-blur-xl">
          {filters.map((filter) => {
            const isActive = activeCategory === filter.label;
            return (
              <button
                key={filter.label}
                onClick={() => onCategoryChange(filter.label)}
                className={`relative shrink-0 select-none whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 sm:text-sm ${
                  isActive
                    ? "bg-white font-semibold text-black shadow-lg"
                    : "bg-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
                }`}
              >
                {filter.label}
                {filter.hasCount && <span className="ml-1.5 text-xs opacity-70">({totalCount})</span>}
              </button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
