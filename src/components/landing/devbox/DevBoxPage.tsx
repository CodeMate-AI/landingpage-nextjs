'use client';

import React from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
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
        <main>
          <DevBoxSection />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
