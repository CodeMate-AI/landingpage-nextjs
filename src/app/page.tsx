'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Lenis from 'lenis';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ToolboxSection from '@/components/landing/ToolboxSection';
import ProductTabsSection from '@/components/landing/ProductTabsSection';
import SocialProofSection from '@/components/landing/SocialProofSection';
import EnterpriseArchitectureSection from '@/components/landing/EnterpriseArchitectureSection';
import WatchActionSection from '@/components/landing/WatchActionSection';

// Preserved for future re-activation
import Achivements from '@/components/achivements';
import MediaPresence from '@/components/media-presence';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const SWE_BENCH_BLOG_URL = '/blog/cora-hits-sota-76-on-swe-bench-verified';

function Page() {
  const heroRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const [lastScroll, setLastScroll] = useState(0);
  const [isArrowV, setIsArrowV] = useState(false);
  const [isArrow, setIsArrow] = useState(false);

  // Lenis smooth scroll initialization
  useEffect(() => {
    const lenis = new Lenis({ duration: 2 });
    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Main page scroll progress for scroll-to-top arrow indicator
  const { scrollYProgress: MYProg } = useScroll({
    target: mainRef,
    offset: ['start start', 'end start'],
  });

  useMotionValueEvent(MYProg, 'change', (latest) => {
    // 1. Arrow visibility (show after 5% scroll)
    setIsArrowV(latest >= 0.05);

    // 2. Scroll direction tracking (arrow orientation)
    setIsArrow(latest >= lastScroll);
    setLastScroll(latest);
  });

  const handleArrow = () => {
    if (isArrow) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="22" height="22"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto`,
      }}
      ref={mainRef}
      className={`relative ${montserrat.variable} bg-zinc-950 pt-[92px] sm:pt-[104px] lg:pt-[110px]`}
    >
      {/* Floating scroll-to-top / scroll-to-bottom arrow button */}
      <AnimatePresence>
        {isArrowV && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-7 right-7 z-[9999999999]"
          >
            <motion.div
              onClick={handleArrow}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.1 }}
              aria-label="Scroll to top or bottom"
              role="button"
              className="hidden lg:flex cursor-pointer justify-center items-center size-10 rounded-full bg-[#EDEADE]/90 text-black shadow-lg"
            >
              <motion.svg
                animate={{ rotate: isArrow ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                xmlns="http://www.w3.org/2000/svg"
                width={30}
                height={30}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5l0 14" />
                <path d="M16 9l-4 -4" />
                <path d="M8 9l4 -4" />
              </motion.svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO & PRIMARY ACTION AREA                                     */}
      {/* Background animation canvas, headline, badge, and CTA action buttons      */}
      {/* ========================================================================= */}
      <div className="h-auto lg:h-screen lg:max-h-[740px] lg:min-h-[580px] w-full overflow-x-hidden relative">
        <BackgroundGradientAnimation
          className="w-full overflow-hidden"
          interactive={true}
          gradientBackgroundStart="rgb(9, 9, 11)"
          gradientBackgroundEnd="rgb(9, 9, 11)"
          firstColor="0, 255, 255"
          secondColor="30, 144, 255"
          thirdColor="0, 255, 255"
          fourthColor="255, 255, 255"
          pointerColor="30, 144, 255"
          size="100%"
        >
          <div
            ref={heroRef}
            className="relative h-auto lg:h-screen lg:max-h-[740px] lg:min-h-[580px] w-full z-50 overflow-hidden cursor-default flex flex-col justify-start pt-14 sm:pt-16 lg:pt-10 xl:pt-12 pb-8 lg:pb-10"
          >
            <motion.div className="absolute inset-0 opacity-5 z-0 pointer-events-none">
              <Image
                src="/ui/bg-noise.png"
                alt=""
                fill
                priority
                className="object-cover"
                aria-hidden="true"
              />
            </motion.div>

            <div className="relative z-50 w-full px-5 sm:px-8 lg:px-0 lg:pl-[calc(3.3vw+3rem)] lg:pr-12 flex flex-col items-start">
              <h1 className="text-[clamp(1.65rem,6.8vw,2.25rem)] sm:text-[clamp(2.5rem,5.5vw,3.75rem)] lg:text-[clamp(3.5rem,5.8vw,6rem)] leading-[1.08] font-semibold flex flex-col gap-0.5 z-50 xxlHerotext text-left mt-1 sm:mt-3 lg:mt-1.5">
                <span className="xxlHero z-50 block whitespace-nowrap">
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]"
                  >
                    Sovereign
                  </motion.span>{' '}
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    className="bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]"
                  >
                    AI
                  </motion.span>{' '}
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.2, delay: 0.5 }}
                    className="bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]"
                  >
                    for
                  </motion.span>
                </span>
                <span className="z-50 block whitespace-nowrap pb-1.5">
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className="bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]"
                  >
                    Software
                  </motion.span>{' '}
                  <motion.span
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    className="bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]"
                  >
                    Development
                  </motion.span>
                </span>
              </h1>

              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.4, delay: 1.15 }}
                className="flex flex-col font-normal text-sm sm:text-base md:text-lg lg:text-xl gap-1 leading-relaxed mt-4 lg:mt-6 text-neutral-300 text-left max-w-3xl"
              >
                <p>
                  Build and ship faster with AI that works where your data lives, keeping your data, code, intelligence, and AI under your control.
                </p>
              </motion.div>

              {/* SOTA Announcement Badge */}
              <motion.div
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.35 }}
                className="w-full flex justify-start mt-4 sm:mt-6 z-[100]"
              >
                <a
                  href={SWE_BENCH_BLOG_URL}
                  aria-label="Read announcement: Cora is now State-of-the-Art"
                  className="relative p-[1px] rounded-md bg-gradient-to-r from-neutral-800 to-neutral-700 w-fit max-w-[calc(100vw-3rem)] shadow-lg hover:shadow-xl transition group"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 rounded-md bg-black px-3.5 py-2 sm:px-4 sm:py-2.5 text-white">
                    <p className="text-xs sm:text-sm font-medium leading-snug text-neutral-300">
                      Cora is now <span className="text-white font-semibold">State-of-the-Art</span>
                    </p>
                    <ChevronRight className="text-neutral-400 group-hover:text-white transition-colors shrink-0" size={14} strokeWidth={2} />
                  </div>
                </a>
              </motion.div>

              {/* Action Call-to-Action Buttons */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="flex flex-col sm:flex-row justify-start items-center gap-3 sm:gap-4 text-sm md:text-base mt-4 sm:mt-5 w-full sm:w-auto"
              >
                <Link href="/download" aria-label="Download CodeMate AI's ToolBox" className="w-full sm:w-auto">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-12 sm:h-12 px-7 sm:px-8 w-full sm:w-auto flex items-center justify-center bg-black text-white rounded-md font-semibold border border-white/20 hover:border-white/40 transition-colors whitespace-nowrap"
                  >
                    Download
                  </motion.button>
                </Link>
                <a href="https://app.codemate.ai/dashboard" aria-label="Try CodeMate AI for Free" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-12 sm:h-12 px-7 sm:px-8 w-full sm:w-auto flex items-center justify-center bg-white text-black rounded-md font-semibold hover:bg-neutral-200 transition-colors whitespace-nowrap"
                  >
                    Try for Free
                  </motion.button>
                </a>
              </motion.div>
            </div>
          </div>
        </BackgroundGradientAnimation>
      </div>

      {/* ========================================================================= */}
      {/* TOOLBOX SECTION                                                           */}
      {/* ========================================================================= */}
      <ToolboxSection />

      {/* ========================================================================= */}
      {/* PRODUCT TABS SHOWCASE                                                     */}
      {/* ========================================================================= */}
      <ProductTabsSection />

      {/* ========================================================================= */}
      {/* SOCIAL PROOF & METRICS                                                    */}
      {/* ========================================================================= */}
      <SocialProofSection />

      {/* ========================================================================= */}
      {/* ENTERPRISE ARCHITECTURE & JOURNEY                                         */}
      {/* ========================================================================= */}
      <EnterpriseArchitectureSection />

      {/* ========================================================================= */}
      {/* WATCH CODEMATE IN ACTION                                                  */}
      {/* ========================================================================= */}
      <WatchActionSection />

      {/* ========================================== */}
      {/* UI SECTION: ACHIEVEMENTS & STATISTICS (COMMENTED OUT) */}
      {/* ========================================== */}
      {/* <Achivements /> */}

      {/* ========================================== */}
      {/* UI SECTION: MEDIA PRESENCE (COMMENTED OUT) */}
      {/* ========================================== */}
      {/* <MediaPresence /> */}

      <div ref={footerRef}>
        {/* ========================================== */}
        {/* UI SECTION: PAGE FOOTER                   */}
        {/* ========================================== */}
        <Footer />
      </div>
    </div>
  );
}

export default Page;
