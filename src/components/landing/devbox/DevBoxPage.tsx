'use client';

import React from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import BackToHome from '@/components/back-to-home'; // Shared with the media, achievements and community pages
import DevBoxSection from '@/components/landing/devbox/DevBoxSection';
import { useLenis } from '@/hooks/use-lenis';
import { ARROW_CURSOR } from '@/lib/cursor';

// The /devbox page: the full Dev Box scroll film between the site navbar and footer, with the home page's cursor and smooth scroll
export default function DevBoxPage() {
  useLenis();

  return (
    <MotionConfig reducedMotion="user">
      <div style={{ cursor: ARROW_CURSOR }} className="relative bg-zinc-950">
        <Navbar />
        <main className="relative">
          {/* Same plain "Back to Home" link as the contact page, under the navbar logo's left edge on the film's opening label row; it scrolls away with the page */}
          <BackToHome
            iconOnlyOnPhones
            className="absolute z-20 left-5 md:left-8 lg:left-[calc(7vw+1rem)] top-[97px] lg:top-[calc(clamp(5.5rem,12vh,8rem)+9px)] -translate-y-1/2"
          />
          <DevBoxSection />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
