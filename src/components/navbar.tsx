'use client'
import React, { useEffect, useState, useRef } from 'react'
import { ChevronUp, Menu, X, ChevronRight } from 'lucide-react';
import { FaXTwitter, FaLinkedin, FaInstagram, FaDiscord, FaYoutube, FaGithub, FaBitbucket, FaGitlab } from "react-icons/fa6";
import { VscAzureDevops } from "react-icons/vsc";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/app/utils/cn';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Handles smooth scrolling to the features section without page-jump scroll restoration issues
  const handleFeaturesClick = () => {
    if (pathname === '/') {
      // Scroll immediately if already on the homepage
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Disable Next.js default scroll-to-top on router push, then scroll to target element
    router.push('/', { scroll: false });
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const el = document.getElementById('features');
      if (el) {
        clearInterval(interval);
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (attempts > 15) {
        clearInterval(interval);
      }
    }, 100);
  };

  const [isNBack, setIsNBack] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [windowWidth, setWindowWidth] = useState(820);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      setIsMobile(w < 1025);
      setIsTablet(w >= 768 && w < 1025);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isMenu, setMenu] = useState(false);
  const [isProducts, setIsProducts] = useState(false);
  const [isResources, setIsResources] = useState(false);
  const [isOS, setIsOS] = useState(false);
  const [isPartners, setIsPartners] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [announcementHeight, setAnnouncementHeight] = useState(0);
  const announcementRef = useRef<HTMLDivElement>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Prevent background scrolling and pause smooth scroll while mobile hamburger menu is open
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (isMenu) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalDocOverflow = document.documentElement.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      // Pause Lenis smooth scroll if instance is registered
      if ((window as any).__lenis) {
        (window as any).__lenis.stop();
      }

      // Prevent touchmove and wheel gestures outside of the scrollable drawer
      const preventBackgroundScroll = (e: TouchEvent | WheelEvent) => {
        const target = e.target;
        const element = target instanceof Element ? target : null;
        if (!element?.closest('[data-lenis-prevent]')) {
          e.preventDefault();
        }
      };

      window.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
      window.addEventListener('wheel', preventBackgroundScroll, { passive: false });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
        document.body.style.touchAction = originalTouchAction;
        if ((window as any).__lenis) {
          (window as any).__lenis.start();
        }
        window.removeEventListener('touchmove', preventBackgroundScroll);
        window.removeEventListener('wheel', preventBackgroundScroll);
      };
    }
  }, [isMenu]);

  // Track window scroll for navbar positioning
  const { scrollY } = useScroll();

  // Detect when user starts scrolling to move navbar to top and compact with hysteresis to avoid boundary flutter
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsNBack(latest >= 10);
    if (latest > 70) {
      setIsCompact(true);
      setHasScrolled(true);
      setIsProducts(false);
      setIsOS(false);
      setIsResources(false);
      setIsPartners(false);
    } else if (latest < 30) {
      setIsCompact(false);
      setHasScrolled(false);
    }
  });

  const SWE_BENCH_BLOG_URL = '/blog/cora-hits-sota-76-on-swe-bench-verified';

  // Track announcement banner height for responsive navbar offset
  useEffect(() => {
    const node = announcementRef.current;
    if (!node) {
      setAnnouncementHeight(0);
      return;
    }

    const updateHeight = () => {
      setAnnouncementHeight(node.offsetHeight || 0);
    };

    updateHeight();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateHeight());
      resizeObserver.observe(node);
    }
    window.addEventListener('resize', updateHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [showAnnouncement]);

  const desktopNavTop = hasScrolled
    ? 0
    : showAnnouncement
      ? Math.max(announcementHeight - 6, 0)
      : 12;
  const mobileNavTop = hasScrolled
    ? 0
    : showAnnouncement
      ? Math.max(announcementHeight - 10, 0)
      : 0;

  const isBlogPage = pathname ? pathname.startsWith('/blog') : false;
  const isCommunityPage = pathname ? pathname.startsWith('/community') : false;
  const shouldShowAnnouncement = showAnnouncement && !isBlogPage && !isCommunityPage;

  return (
    <div>
      {/* ========================================== */}
      {/* UI SECTION: TOP ANNOUNCEMENT BANNER      */}
      {/* Marketing banner displayed above the nav */}
      {/* ========================================== */}
      {shouldShowAnnouncement && (
        <motion.div
          ref={announcementRef}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="w-full flex justify-center px-1 sm:px-2 z-[999999]"
        >
          <div className="relative p-[1px] rounded-md bg-gradient-to-r from-neutral-800 to-neutral-700 w-fit max-w-[calc(100vw-1.5rem)] shadow-lg hover:shadow-xl transition group mt-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => window.open('https://app.codemate.ai', '_blank')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open('https://app.codemate.ai', '_blank'); } }}
              className="flex w-full h-full items-center justify-center gap-1.5 sm:gap-2 rounded-md bg-black px-3 py-3 sm:py-2 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 rounded-sm bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-black uppercase tracking-wide shrink-0">
                  Limited Offer
                </span>
                <div className="flex min-w-0 items-center gap-0.5 text-[11px] sm:text-[13px] font-medium leading-snug">
                  <p className="truncate max-w-[200px] xs:max-w-[260px] sm:max-w-none text-center sm:text-left text-neutral-300">
                    Get <span className="text-white font-semibold">14 Days of PRO</span> for free
                  </p>
                  <ChevronRight className="ml-0.5 text-neutral-400 group-hover:text-white transition-colors shrink-0" size={14} strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================== */}
      {/* UI SECTION: DESKTOP NAVIGATION           */}
      {/* Sticky top navigation with mega-menus    */}
      {/* ========================================== */}
      <div
        style={{ top: 0 }}
        className="hidden lg:flex fixed justify-center items-center w-full cursor-default z-[999999] transition-all duration-300 linear">
        <motion.div
          initial={{ y: -110 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.2, delay: 0 }}
          style={{
            background: isCompact
              ? 'rgba(12, 12, 14, 0.82)'
              : !isNBack
              ? 'rgba(15, 12, 12, 0.2)'
              : 'rgba(15, 20, 20, 0.45)',
            boxShadow: isCompact
              ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
              : '0 4px 25px rgba(0, 0, 0, 0.1)',
            backdropFilter: isCompact ? 'blur(20px)' : 'blur(10px)',
            WebkitBackdropFilter: isCompact ? 'blur(20px)' : 'blur(10px)',
          }}
          className={cn(
            'transition-all duration-300 ease-out transform-gpu z-[9999999999]',
            isCompact
              ? 'mt-3 w-[75%] max-w-[1050px] rounded-xl border border-white/10'
              : 'mt-3 w-[90%] rounded-lg bg-opacity-65'
          )}>
          <div className='flex h-full w-full text-white px-[1rem] py-2'>
            <div className='flex justify-between items-center w-full h-10'>

              {/* Original logo size and styling preserved */}
              <div className="h-fit w-[15vw] flex justify-center overflow-hidden">
                <img
                  onClick={() => router.push("/")}
                  src="/logos/brand/codemate-logo.svg"
                  alt="CodeMate AI Logo"
                  className='cursor-pointer'
                />
              </div>
              <div className="relative flex flex-col gap-3 text-md justify-center items-center cursor-pointer text-right z-50">
                {/* Compact Scrolled Navigation (Concurrent Layer) */}
                <div
                  className={cn(
                    'flex gap-5 lg:gap-6 justify-center items-center z-50 pr-2 transition-all duration-300 ease-out transform-gpu',
                    isCompact
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-2 pointer-events-none absolute'
                  )}
                >
                  <motion.h1
                    onClick={handleFeaturesClick}
                    whileHover={{ opacity: 1 }}
                    className='opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-sm font-medium'
                  >
                    Features
                  </motion.h1>
                  <motion.h1
                    onClick={() => { router.push('/pricing?product=cora') }}
                    whileHover={{ opacity: 1 }}
                    className='opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-sm font-medium'
                  >
                    Pricing
                  </motion.h1>
                  <Link href="/download">
                    <motion.h1
                      whileHover={{ opacity: 1 }}
                      className='opacity-70 hover:opacity-100 transition-opacity cursor-pointer text-sm font-medium'
                    >
                      Download
                    </motion.h1>
                  </Link>
                  <a
                    href="https://app.codemate.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.button
                      whileHover={{ opacity: 1, scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-3.5 py-1.5 bg-[#FFFFFF] text-black rounded-sm font-semibold opacity-90 hover:opacity-100 text-nowrap transition-all text-sm"
                    >
                      Sign Up
                    </motion.button>
                  </a>
                </div>

                {/* Full Un-scrolled Navigation (Concurrent Layer) */}
                <div
                  className={cn(
                    'flex gap-5 justify-center items-center z-50 transition-all duration-300 ease-out transform-gpu',
                    !isCompact
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-2 pointer-events-none absolute'
                  )}
                >
                  <motion.h1
                    onMouseEnter={() => { setIsProducts(state => !state); setIsOS(false); setIsResources(false); setIsPartners(false); }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} className={`flex text-center opacity-100 gap-[0.20rem] justify-center items-center z-50 ${isProducts ? 'opacity-100' : 'opacity-65'}`}>Products  <motion.span
                      initial={{ rotate: 180 }}
                      animate={{ rotate: !isProducts ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronUp
                        className="h-4 w-4 shrink-0 grow-0 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50"
                      />
                    </motion.span></motion.h1>

                  <motion.h1
                    onMouseEnter={() => { setIsOS(state => !state); setIsProducts(false); setIsResources(false); setIsPartners(false); }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} className={`flex text-center opacity-100 gap-[0.20rem] justify-center items-center text-nowrap z-50 ${isOS ? '' : 'opacity-65'}`}>Open-Source  <motion.span
                      initial={{ rotate: 180 }}
                      animate={{ rotate: !isOS ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronUp
                        className="h-4 w-4 shrink-0 grow-0 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50"
                      />
                    </motion.span></motion.h1>
                  <motion.h1
                    onMouseEnter={() => { setIsResources(state => !state); setIsOS(false); setIsProducts(false); setIsPartners(false); }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} className={`flex text-center opacity-100 gap-[0.20rem] justify-center items-center text-nowrap z-50 ${isResources ? '' : 'opacity-65'}`}>Resources<motion.span
                      initial={{ rotate: 180 }}
                      animate={{ rotate: !isResources ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronUp
                        className="h-4 w-4 shrink-0 grow-0 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50"
                      />
                    </motion.span></motion.h1>

                  <motion.h1 onMouseEnter={() => { setIsProducts(false); setIsOS(false); setIsResources(false); setIsPartners(false); }} onClick={handleFeaturesClick} whileHover={{ opacity: 1 }} className='opacity-65 cursor-pointer'>Features</motion.h1>
                  <motion.h1 onMouseEnter={() => { setIsProducts(false); setIsOS(false); setIsResources(false); setIsPartners(false); }} whileHover={{ opacity: 1 }} onClick={() => { router.push('/pricing?product=cora') }} className='opacity-65'>Pricing</motion.h1>

                  <motion.h1
                    onMouseEnter={() => { setIsPartners(state => !state); setIsOS(false); setIsProducts(false); setIsResources(false); }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} className={`flex text-center opacity-100 gap-[0.20rem] justify-center items-center text-nowrap z-50 ${isPartners ? '' : 'opacity-65'}`}>Partners<motion.span
                      initial={{ rotate: 180 }}
                      animate={{ rotate: !isPartners ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronUp
                        className="h-4 w-4 shrink-0 grow-0 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50"
                      />
                    </motion.span></motion.h1>
                  <a href='https://edu.codemate.ai/' target='_blank'>
                    <motion.h1 onMouseEnter={() => { setIsProducts(false); setIsOS(false); setIsResources(false); setIsPartners(false); }} whileHover={{ opacity: 1 }} className='opacity-65'>Academy</motion.h1>
                  </a>

                  <Link href="/contact">
                    <motion.button onMouseEnter={() => { setIsProducts(false); setIsOS(false); setIsResources(false); setIsPartners(false); }} whileHover={{ opacity: 1, scale: 1.05 }} className="px-2 py-1 bg-[#FFFFFF] text-black rounded-sm font-semibold opacity-85 text-nowrap">Contact Us</motion.button>
                  </Link>
                </div>

                {isProducts && (
                  <div className={cn(
                    'absolute h-[20rem] w-[14.5rem] rounded-md -z-10',
                    'mt-[22rem] -left-[1.2rem]'
                  )}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        boxShadow: '0 14px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(50px)',
                        WebkitBackdropFilter: 'blur(50px)'
                      }} className=' h-auto w-full left-0 rounded-2xl -z-10 bg-zinc-900 drop-shadow-2xl shadow-2xl overflow-hidden'>
                      <div className="py-3 px-2 flex flex-col gap-0">

                        <h1 style={{ fontWeight: 450 }} className="text-left px-3 mb-1 text-sm opacity-50">Web-Application</h1>
                        <a href="https://app.codemate.ai/chat" target="_blank" className="w-full">
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-70 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 flex justify-center">
                                <img src="/logos/brand/codemate-work-logo.png" alt="Chat" className="size-5 object-contain" />
                              </div>
                              <h1>Work</h1>
                            </div>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>
                        <a href='http://build.codemate.ai/' target='_blank' className="w-full">
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-70 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 flex justify-center">
                                <img src="/logos/brand/codemate-build-logo.png" alt="Build" className="size-5 scale-[1.5] object-contain" />
                              </div>
                              <h1>Build</h1>
                            </div>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>

                        <h1 style={{ fontWeight: 450 }} className="text-left px-3 mb-1 mt-3 text-sm opacity-50">VS Code Extension</h1>
                        <a href="https://marketplace.visualstudio.com/items?itemName=CodeMateAI.codemate-agent" target="_blank" className="w-full">
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-70 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 flex justify-center">
                                <img src="/logos/brand/codemate-cora-logo.png" alt="CORA" className="size-5 object-contain" />
                              </div>
                              <h1>CORA</h1>
                            </div>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>

                        <h1 style={{ fontWeight: 450 }} className="text-left px-3 mb-1 mt-3 text-sm opacity-50">JetBrains Plugin</h1>
                        <a href="https://plugins.jetbrains.com/plugin/29932-cora" target="_blank" className="w-full">
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-70 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 flex justify-center">
                                <img src="/logos/brand/codemate-cora-logo.png" alt="CORA" className="size-5 object-contain" />
                              </div>
                              <h1>CORA</h1>
                            </div>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>
                      </div>
                    </motion.div>
                  </div>
                )}

                {isOS && !isCompact &&
                  <div className='absolute  h-[20rem] w-[12rem] mt-[22rem] left-[5.8rem] rounded-md -z-10 '>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        boxShadow: '0 14px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(50px)',
                        WebkitBackdropFilter: 'blur(50px)'
                      }} className=' h-auto w-full left-0 rounded-2xl -z-10 bg-zinc-900 drop-shadow-2xl shadow-2xl overflow-hidden'>
                      <div className="py-4 px-2 flex flex-col gap-0">
                        <a href="https://huggingface.co/codemateai" target="_blank" className="w-full">
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-80 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <h1>Models</h1>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>
                        <a href='https://cli.codemate.ai/' target='_blank' className="w-full">
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-80 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <h1>Terminal</h1>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>
                      </div>
                    </motion.div>
                  </div>
                }

                {isResources && !isCompact &&
                  <div className='absolute  h-[20rem] w-[12rem] mt-[22rem] left-[14.8rem] rounded-md -z-10 '>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        boxShadow: '0 14px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(50px)',
                        WebkitBackdropFilter: 'blur(50px)'
                      }} className=' h-auto w-full left-0 rounded-2xl -z-10 bg-zinc-900 drop-shadow-2xl shadow-2xl overflow-hidden'>
                      <div className="py-4 px-2 flex flex-col gap-0">
                        <a href="https://docs.codemate.ai/" target="_blank" className='w-full'>
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-80 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <h1>Docs</h1>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>
                        <Link href='/blog' className='w-full'>
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-80 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <h1>Blogs</h1>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </Link>
                        <Link href="/community" className='w-full'>
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-80 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <h1>Community</h1>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                }

                {isPartners && !isCompact &&
                  <div className='absolute  h-[20rem] w-[9rem] mt-[22rem] left-[33.2rem] rounded-md -z-10 '>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        boxShadow: '0 14px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(50px)',
                        WebkitBackdropFilter: 'blur(50px)'
                      }} className=' h-auto w-full left-0 rounded-2xl -z-10 bg-zinc-900 drop-shadow-2xl shadow-2xl overflow-hidden'>
                      <div className="py-3 px-2 flex flex-col gap-0">
                        <Link href='/hp' className='w-full'>
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-80 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <h1>HP</h1>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                }

              </div>

              {isProducts &&
                <div onMouseEnter={() => setIsProducts(false)} className='fixed h-screen w-full z-40' />
              }
              {isOS &&
                <div onMouseEnter={() => setIsOS(false)} className='fixed h-screen w-full z-40' />
              }
              {isResources &&
                <div onMouseEnter={() => setIsResources(false)} className='fixed h-screen w-full z-40' />
              }
              {isPartners &&
                <div onMouseEnter={() => setIsPartners(false)} className='fixed h-screen w-full z-40' />
              }
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* UI SECTION: MOBILE NAVIGATION & MENU     */}
      {/* Hamburger menu overlay for mobile devices*/}
      {/* ========================================== */}
      <AnimatePresence>
        {/* Mobile & Tablet floating compact navbar wrapper */}
        <div
          style={{ top: 0 }}
          className="lg:hidden fixed inset-x-0 flex justify-center items-center w-full z-[99999999999] pointer-events-none transition-all duration-300"
        >
          <motion.div
            key="mobile-navbar-container"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: isMenu
                ? 'rgb(24, 24, 27)'
                : isCompact
                ? 'rgba(12, 12, 14, 0.85)'
                : !isNBack
                ? 'rgba(15, 12, 12, 0.2)'
                : 'rgba(15, 20, 20, 0.45)',
              boxShadow: isCompact && !isMenu
                ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
                : '0 4px 25px rgba(0, 0, 0, 0.1)',
              backdropFilter: isCompact || isMenu ? 'blur(20px)' : 'blur(10px)',
              WebkitBackdropFilter: isCompact || isMenu ? 'blur(20px)' : 'blur(10px)',
            }}
            className={cn(
              'pointer-events-auto transition-all duration-300 ease-out transform-gpu flex justify-between items-center',
              isCompact && !isMenu
                ? 'mt-2.5 w-[94%] sm:w-[90%] md:w-[85%] max-w-[640px] rounded-xl border border-white/10 px-3.5 sm:px-5 py-2'
                : 'w-full px-5 md:px-8 py-[0.9rem] md:py-4 border-b border-white/5'
            )}
          >
            {/* Left side: CodeMate logo */}
            <div
              className="flex items-center justify-start overflow-hidden cursor-pointer shrink-0"
              onClick={() => {
                if (isMenu) setMenu(false);
                router.push('/');
              }}
            >
              <img
                src="/logos/brand/codemate-logo.svg"
                alt="CodeMate AI Logo"
                className={cn(
                  'transition-all duration-300 object-contain',
                  isCompact && !isMenu
                    ? 'w-[132px] xs:w-[142px] sm:w-[160px] md:w-[175px] h-auto'
                    : 'w-[136px] xs:w-[146px] sm:w-[165px] md:w-[185px] h-auto'
                )}
              />
            </div>

            {/* Right side: Pricing, Sign Up, and Hamburger icon */}
            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 shrink-0 text-right">
              {/* Pricing link */}
              {!isMenu && (
                <motion.span
                  onClick={() => { router.push('/pricing?product=cora'); }}
                  whileHover={{ opacity: 1 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    'text-xs sm:text-sm font-medium text-neutral-200 hover:text-white cursor-pointer transition-all duration-200 select-none',
                    isCompact
                      ? 'opacity-80 scale-100'
                      : 'hidden sm:inline-block opacity-75'
                  )}
                >
                  Pricing
                </motion.span>
              )}

              {/* Sign Up button */}
              {!isMenu && (
                <a
                  href="https://app.codemate.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'transition-all duration-200 select-none',
                    isCompact
                      ? 'inline-flex'
                      : 'hidden sm:inline-flex'
                  )}
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white text-black text-xs sm:text-sm rounded-sm font-semibold hover:bg-neutral-200 transition-colors whitespace-nowrap"
                  >
                    Sign Up
                  </motion.button>
                </a>
              )}

              {/* Hamburger / Close icon (right-most) */}
              <motion.div
                onClick={() => { setMenu(state => !state); }}
                whileTap={{ scale: 0.92 }}
                aria-label={isMenu ? "Close menu" : "Open menu"}
                role="button"
                className="flex justify-center items-center cursor-pointer p-1 text-white hover:text-neutral-200 transition-colors"
              >
                <Menu
                  className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200",
                    isMenu
                      ? "hidden scale-75 -rotate-45"
                      : "opacity-100 scale-100 rotate-0"
                  )}
                />
                <X
                  className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200",
                    isMenu
                      ? "opacity-100 scale-100 rotate-0"
                      : "hidden scale-75 rotate-45"
                  )}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
        {isMenu && (
          <div
            key="mobile-menu-overlay"
            className="fixed top-0 h-screen w-full left-0 z-[999999999] flex"
          >
            <div className='h-full w-[100%]'>
              <motion.div
                key={1}
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                exit={{ x: -400 }}
                transition={{ duration: 0.2 }}
                className="absolute h-full w-[100%] bg-white"
              />
              <motion.div
                key={2}
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                exit={{ x: -400 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="absolute h-full w-[100%] bg-cyan-600 z-10"
              />
              <motion.div
                key={3}
                initial={{ x: -400 }}
                animate={{ x: 0 }}
                exit={{ x: -400 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="absolute h-full  w-[100%] bg-zinc-900  z-[999999999999]"
              >
                <div data-lenis-prevent className='relative h-full w-full overflow-y-auto overscroll-contain z-[9999999999]'>
                <div className='flex flex-col leading-[1] text-[8vw] pt-24 pl-5 gap-10 '>
                  <motion.div onClick={() => { setMenu(false); router.push('/'); }} whileHover={{ opacity: 0.6 }} className='flex gap-2 cursor-pointer'><span className='MenuText'>HOME</span><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>01</p></motion.div>
                  <motion.div className='flex flex-col gap-2 cursor-pointer'>
                    <motion.div onClick={() => { setIsProducts(state => !state); }} whileHover={{ opacity: 0.6 }} className='flex justify-between items-center'>
                      <div className='flex gap-2'>
                        <h1 className='MenuText'>PRODUCTS</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>02</p>
                      </div>
                      <motion.span
                        initial={{ rotate: 180 }}
                        animate={{ rotate: !isProducts ? 180 : 0 }}
                        className='mr-3'
                      >
                        <ChevronUp
                          className="h-5 w-5 shrink-0 grow-0 text-zinc-950  transition-transform duration-200 group-data-expanded:-rotate-180 opacity-60 dark:text-zinc-50"
                        />
                      </motion.span>
                    </motion.div>

                      {isProducts &&
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.3 }} className='flex flex-col text-xl gap-2 text-center opacity-70 mt-4 mr-5'>
                          <h1 style={{ fontWeight: 600 }} className='text-lg md:text-[1.35rem] lg:text-lg text-left mb-1 mt-1'>Web-Application</h1>
                          <div className='relative text-base md:text-[1.15rem] lg:text-base text-left overflow-hidden py-0.5 md:py-2 lg:py-0 '>
                            <a href="https://app.codemate.ai/chat" target='_blank'>
                              <div className='flex items-center gap-2 z-20 opacity-90'>
                                <div className="w-8 md:w-10 flex justify-center">
                                  <img src="/logos/brand/codemate-work-logo.png" alt="Chat" width={28} height={28} className="size-5 md:size-7 lg:size-5 object-contain" />
                                </div>
                                <motion.h1>Work</motion.h1>
                              </div>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600 flex items-center gap-2'>
                                  <div className="w-8 md:w-10 flex justify-center">
                                    <img src="/logos/brand/codemate-work-logo.png" alt="Work" width={28} height={28} className="size-5 md:size-7 lg:size-5 object-contain" />
                                  </div>
                                  <h1>Work</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>
                          <div className='relative text-base md:text-[1.15rem] lg:text-base text-left overflow-hidden py-0.5 md:py-2 lg:py-0 '>
                            <a href="http://build.codemate.ai/" target='_blank'>
                              <div className='flex items-center gap-2 z-20 opacity-90'>
                                <div className="w-8 md:w-10 flex justify-center">
                                  <img src="/logos/brand/codemate-build-logo.png" alt="Build" className="size-5 md:size-7 scale-[1.5] lg:size-5 object-contain" />
                                </div>
                                <motion.h1>Build</motion.h1>
                              </div>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600 flex items-center gap-2'>
                                  <div className="w-8 md:w-10 flex justify-center">
                                    <img src="/logos/brand/codemate-build-logo.png" alt="Build" className="size-5 md:size-7 scale-[1.5] lg:size-5 object-contain" />
                                  </div>
                                  <h1>Build</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>

                          <h1 style={{ fontWeight: 600 }} className='text-lg md:text-[1.35rem] lg:text-lg text-left mb-1 mt-3'>VS Code Extension</h1>
                          <div className='relative text-base md:text-[1.15rem] lg:text-base text-left overflow-hidden py-0.5 md:py-2 lg:py-0 mb-2'>
                            <a href="https://marketplace.visualstudio.com/items?itemName=CodeMateAI.codemate-agent" target="_blank">
                              <div className='flex items-center gap-2 z-20 opacity-90'>
                                <div className="w-8 md:w-10 flex justify-center">
                                  <img src="/logos/brand/codemate-cora-logo.png" alt="CORA" className="size-5 md:size-7 lg:size-5 object-contain" />
                                </div>
                                <motion.h1>CORA</motion.h1>
                              </div>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600 flex items-center gap-2'>
                                  <div className="w-8 md:w-10 flex justify-center">
                                    <img src="/logos/brand/codemate-cora-logo.png" alt="CORA" className="size-5 md:size-7 lg:size-5 object-contain" />
                                  </div>
                                  <h1>CORA</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>

                          <h1 style={{ fontWeight: 600 }} className='text-lg md:text-[1.35rem] lg:text-lg text-left mb-1 mt-3'>JetBrains Plugin</h1>
                          <div className='relative text-base md:text-[1.15rem] lg:text-base text-left overflow-hidden py-0.5 md:py-2 lg:py-0'>
                            <a href="https://plugins.jetbrains.com/plugin/29932-cora" target="_blank">
                              <div className='flex items-center gap-2 z-20 opacity-90'>
                                <div className="w-8 md:w-10 flex justify-center">
                                  <img src="/logos/brand/codemate-cora-logo.png" alt="CORA" className="size-5 md:size-7 lg:size-5 object-contain" />
                                </div>
                                <motion.h1>CORA</motion.h1>
                              </div>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600 flex items-center gap-2'>
                                  <div className="w-8 md:w-10 flex justify-center">
                                    <img src="/logos/brand/codemate-cora-logo.png" alt="CORA" className="size-5 md:size-7 lg:size-5 object-contain" />
                                  </div>
                                  <h1>CORA</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>
                        </motion.div>
                      }
                    </motion.div>

                    <motion.div className='flex flex-col gap-2 cursor-pointer'>
                      <motion.div onClick={() => { setIsOS(state => !state); }} whileHover={{ opacity: 0.6 }} className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                          <h1 className='MenuText'>OPEN-SOURCE</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>03</p>
                        </div>
                        <motion.span
                          initial={{ rotate: 180 }}
                          animate={{ rotate: !isOS ? 180 : 0 }}
                          className='mr-3'
                        >
                          <ChevronUp
                            className="h-5 w-5 shrink-0 grow-0 text-zinc-950  transition-transform duration-200 group-data-expanded:-rotate-180 opacity-60 dark:text-zinc-50"
                          />
                        </motion.span>
                      </motion.div>

                      {isOS &&
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.3 }} className='flex flex-col text-xl gap-2 text-center opacity-70 mt-4 mr-5'>
                          <div className='relative text-base md:text-[1.15rem] lg:text-base text-left overflow-hidden py-0.5 md:py-2 lg:py-0 '>
                            <a href="https://huggingface.co/codemateai" target='_blank'>
                              <motion.h1 className='z-20 opacity-90'>Models</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>Chat</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>
                          <div className='relative text-base md:text-[1.15rem] lg:text-base text-left overflow-hidden py-0.5 md:py-2 lg:py-0'>
                            <a href="https://cli.codemate.ai/" target="_blank">
                              <motion.h1 className='z-20 opacity-90'>Terminal</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>Build</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>
                        </motion.div>
                      }
                    </motion.div>

                    <motion.div className='flex flex-col gap-2 cursor-pointer'>
                      <motion.div onClick={() => { setIsResources(state => !state); }} whileHover={{ opacity: 0.6 }} className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                          <h1 className='MenuText'>RESOURCES</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>04</p>
                        </div>
                        <motion.span
                          initial={{ rotate: 180 }}
                          animate={{ rotate: !isResources ? 180 : 0 }}
                          className='mr-3'
                        >
                          <ChevronUp
                            className="h-5 w-5 shrink-0 grow-0 text-zinc-950  transition-transform duration-200 group-data-expanded:-rotate-180 opacity-60 dark:text-zinc-50"
                          />
                        </motion.span>
                      </motion.div>

                      {isResources &&
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.3 }} className='flex flex-col text-xl gap-2 text-center opacity-70 mt-4 mr-5'>
                          <div className='relative text-base md:text-[1.15rem] lg:text-base text-left overflow-hidden py-0.5 md:py-2 lg:py-0 '>
                            <a href="https://docs.codemate.ai/" target='_blank'>
                              <motion.h1 className='z-20 opacity-90'>Docs</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>Docs</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>
                          <div className='relative text-base md:text-[1.15rem] lg:text-base text-left overflow-hidden py-0.5 md:py-2 lg:py-0'>
                            <Link href="/blog" onClick={() => setMenu(false)}>
                              <motion.h1 className='z-20 opacity-90'>Blogs</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full top-0'>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>Blogs</h1>
                                </motion.div>
                              </motion.div>
                            </Link>
                          </div>
                          <div className='relative text-base md:text-[1.15rem] lg:text-base text-left overflow-hidden py-0.5 md:py-2 lg:py-0 '>
                            <Link href="/community" onClick={() => setMenu(false)}>
                              <motion.h1 className='z-20 opacity-90'>Community</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>Community</h1>
                                </motion.div>
                              </motion.div>
                            </Link>
                          </div>
                        </motion.div>
                      }
                    </motion.div>
                    <motion.div onClick={() => { setMenu(false); handleFeaturesClick(); }} whileHover={{ opacity: 0.6 }} className='flex gap-2 cursor-pointer'><h1 className='MenuText'>FEATURES</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>05</p></motion.div>
                    <motion.div onClick={() => { setMenu(false); router.push('/pricing?product=cora') }} whileHover={{ opacity: 0.6 }} className='flex gap-2 cursor-pointer'><h1 className='MenuText'>PRICING</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>06</p></motion.div>

                    <motion.div className='flex flex-col gap-2 cursor-pointer'>
                      <motion.div onClick={() => { setIsPartners(state => !state); }} whileHover={{ opacity: 0.6 }} className='flex justify-between items-center'>
                        <div className='flex gap-2'>
                          <h1 className='MenuText'>PARTNERS</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>07</p>
                        </div>
                        <motion.span
                          initial={{ rotate: 180 }}
                          animate={{ rotate: !isPartners ? 180 : 0 }}
                          className='mr-3'
                        >
                          <ChevronUp
                            className="h-5 w-5 shrink-0 grow-0 text-zinc-950  transition-transform duration-200 group-data-expanded:-rotate-180 opacity-60 dark:text-zinc-50"
                          />
                        </motion.span>
                      </motion.div>

                      {isPartners &&
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.3 }} className='flex flex-col text-xl gap-2 text-center opacity-70 mt-4 mr-5'>
                          <div className='relative text-base md:text-[1.15rem] lg:text-base text-left overflow-hidden py-0.5 md:py-2 lg:py-0'>
                            <Link href="/hp" onClick={() => setMenu(false)}>
                              <motion.h1 className='z-20 opacity-90'>HP</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full top-0'>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>HP</h1>
                                </motion.div>
                              </motion.div>
                            </Link>
                          </div>
                        </motion.div>
                      }
                    </motion.div>

                    <a href='https://edu.codemate.ai/' target='_blank'>
                      <motion.div whileHover={{ opacity: 0.6 }} className='flex gap-2 cursor-pointer'><h1 className='MenuText'>ACADEMY</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>08</p></motion.div>
                    </a>
                    <motion.div onClick={() => { setMenu(false); router.push('/contact'); }} whileHover={{ opacity: 0.6 }} className='flex gap-2 cursor-pointer'><h1 className='MenuText'>CONTACT US</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>09</p></motion.div>
                  </div>

                  <div className='mt-[15rem] w-full bg-zinc-900'>
                    <div className='pl-5 pb-8'>
                      <h1 className='text-[6vw]  opacity-65 mb-3'>Socials</h1>
                      <div className='flex text-[5vw] gap-4 opacity-90 group'>
                        <a href="https://www.instagram.com/codemateai" target='_blank'>
                          <h1 className='group-hover:opacity-20 hover:!opacity-100 hover:text-[#00BFFF]'><FaInstagram size={40} className="md:w-10 md:h-10" /></h1>
                        </a>
                        <a href='https://twitter.com/codemateai' target='_blank'>
                          <h1 className='group-hover:opacity-20 hover:!opacity-100 hover:text-[#00BFFF]'><FaXTwitter size={40} className="md:w-10 md:h-10" /></h1>
                        </a>
                        <a href='https://www.linkedin.com/company/codemateai/' target='_blank'>
                          <h1 className='group-hover:opacity-20 hover:!opacity-100 hover:text-[#00BFFF]'><FaLinkedin size={40} className="md:w-10 md:h-10" /></h1>
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </div>
            <div onClick={() => { setMenu(false); }} className='h-full w-[30%]'></div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
