"use client";

import React, { useRef } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CommunityHero from "./components/CommunityHero";
import CommunityFeaturedProject from "./components/CommunityFeaturedProject";
import CommunityGallery from "./components/CommunityGallery";

// Renders the primary community page route layout with custom cursor and showcase sections.
export default function CommunityPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="22" height="22"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto`,
      }}
      className="min-h-screen overflow-x-hidden bg-zinc-950 pt-[92px] text-white sm:pt-[104px] lg:pt-[110px]"
    >
      <Navbar />

      <main className="relative z-10 w-full">
        <CommunityHero />
        <CommunityFeaturedProject />
        <CommunityGallery />
      </main>

      <Footer />
    </div>
  );
}
