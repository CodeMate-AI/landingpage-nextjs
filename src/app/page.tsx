'use client'
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { ChevronUp, Menu, Weight, X, ChevronRight } from 'lucide-react';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { IconArrowLeft, IconArrowRight, IconArrowBadgeDown } from '@tabler/icons-react';
import StaggeredMenu from '@/components/ui/Menu';
import { FaXTwitter, FaLinkedin, FaInstagram, FaDiscord, FaYoutube, FaGithub, FaBitbucket, FaGitlab } from "react-icons/fa6";
import { VscAzureDevops } from "react-icons/vsc";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { TextAnimate } from '@/components/ui/textAnimate'
import MagicBento from '@/components/ui/magicBento';
import Lenis from 'lenis'
import { Montserrat } from 'next/font/google';
import { LoaderFive, LoaderOne } from '@/components/ui/loader';
import { TypingAnimation, AnimatedSpan } from '@/components/ui/terminal';
import SeamlessCarousel from '@/components/SeamlessCarousel';

import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useRouter } from 'next/navigation';
import Footer from '@/components/footer';

import VideoEmbed from '@/components/video';
import Counter from '@/components/ui/counter';
import { Marquee } from '@/components/ui/marquee';
import SmartGif from '@/components/ui/SmartGif';
import Achivements from '@/components/achivements';
import MediaPresence from '@/components/media-presence';
import { cn } from './utils/cn';
import EventOffer from './pricing/components/EventOffer';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Add what you need
  variable: '--font-montserrat', // Optional, for CSS variable usage
});

const montserrat2 = Montserrat({
  subsets: ['latin'],
  weight: ['200'],
  variable: '--font-montserrat', // Optional, for CSS variable usage
});


// ==========================================
// 1. MAIN COMPONENT DECLARATION
// The root Page component for the landing page.
// Handles core state, scroll tracking (Framer Motion), and renders all sub-sections.
// ==========================================
function Page() {
  // ==========================================
  // 1A. MOCK DATA & CONTENT
  // Data arrays used to populate interactive code editor simulations
  // ==========================================
  const brokenComponent = [
    { code: "import React from 'react'", isError: false },
    { code: "", isError: false },
    { code: "type Props = {", isError: false },
    { code: "  name: string", isError: false },
    { code: "}", isError: false },
    { code: "", isError: false },
    { code: "export const ErrorComp: React.FC<Props> = ({ name }) => {", isError: false },
    { code: "  const [count, setCount]: number = useState(0)", isError: true }, // ❌ incorrect type annotation + useState not imported
    { code: "", isError: false },
    { code: "  useEffect(() => {", isError: true }, // ❌ useEffect not imported
    { code: "    console.logg('Name is:', name)", isError: true }, // ❌ typo `logg`
    { code: "  }, [nam])", isError: true }, // ❌ `nam` is not defined
    { code: "", isError: false },
    // ==========================================
    // 2. MAIN PAGE RENDER (JSX)
    // Renders the entire landing page sequentially:
    // Nav -> Hero -> Products -> Testimonials -> Footer
    // ==========================================
    { code: "  return (", isError: false },
    { code: "    <div>", isError: false },
    { code: "      <h1>Hello, {namee}</h1>", isError: true }, // ❌ `namee` is a typo
    { code: "      <button onClick={() => setCount(cn => cn + 1)}>Click</buttn>", isError: true }, // ❌ `buttn` typo
    { code: "      <p>Count: {countt}</p>", isError: true }, // ❌ `countt` is a typo
    { code: "    </div>", isError: false },
    { code: "  )", isError: true }, // ❌ return not wrapped in fragment or single parent (could error in strict JSX)
    { code: "}", isError: false },
  ]

  const fixedComponent = [
    { code: "import React, { useState, useEffect } from 'react'", isError: false },
    { code: "", isError: false },
    { code: "type Props = {", isError: false },
    { code: "  name: string", isError: false },
    { code: "}", isError: false },
    { code: "", isError: false },
    { code: "export const ErrorComp: React.FC<Props> = ({ name }) => {", isError: false },
    { code: "  const [count, setCount] = useState(0)", isError: true },
    { code: "", isError: false },
    { code: "  useEffect(() => {", isError: true },
    { code: "    console.log('Name is:', name)", isError: true },
    { code: "  }, [name])", isError: true },
    { code: "", isError: false },
    { code: "  return (", isError: false },
    { code: "    <div>", isError: false },
    { code: "      <h1>Hello, {name}</h1>", isError: true },
    { code: "      <button onClick={() => setCount(cn => cn + 1)}>Click</button>", isError: true },
    { code: "      <p>Count: {count}</p>", isError: true },
    { code: "    </div>", isError: false },
    { code: "  )", isError: true },
    { code: "}", isError: false },
  ];


  // ==========================================
  // 1B. NAVIGATION CONFIGURATION
  // ==========================================
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  const router = useRouter();
  // ==========================================
  // 1C. REFS & COMPONENT STATE
  // React state hooks for toggling UI elements (menus, overlays, modals)
  // and Refs for tracking scroll positions of specific sections.
  // ==========================================
  const heroRef = useRef<HTMLDivElement>(null);
  const heroRef2 = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const MFRef = useRef<HTMLDivElement>(null);
  // const [d,setD] = useState(false); 
  // const [r,setR] = useState(false);
  // const [a,setA] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [mat1, setMat1] = useState(0);
  const [mat2, setMat2] = useState(0);
  const [mat3, setMat3] = useState(0);
  const [IsMascot, setIsMascot] = useState(false);
  const [isNBack, setIsNBack] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [isMenu, setMenu] = useState(false);
  const [isArrowV, setIsArrowV] = useState(false);
  const [isProducts, setIsProducts] = useState(false);
  const [isResources, setIsResources] = useState(false);
  const [isOS, setIsOS] = useState(false);
  const [isArrow, setIsArrow] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [announcementHeight, setAnnouncementHeight] = useState(0);
  const [isCoraBlocked, setIsCoraBlocked] = useState(true);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const feature1Ref = useRef<HTMLDivElement>(null);
  const testiRef = useRef<HTMLDivElement>(null);
  const productShowRef = useRef<HTMLDivElement>(null);
  const codeMateImageRef = useRef<HTMLImageElement>(null);
  const unlockCopyRef = useRef<HTMLParagraphElement>(null);
  const [isLoad, setIsLoad] = useState(false);
  const [isLoad2, setIsLoad2] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const unlockVideoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const title = ["Don't", "be", "techy", "to"];
  const title2 = ["Develop", "Softwares"];
  const [isTitle, setIstitle] = useState(false);
  // ==========================================
  // 1D. SCROLL ANIMATION HOOKS (FRAMER MOTION)
  // Extensive use of useScroll() and useTransform() to create
  // parallax effects, fade-ins, and scroll-linked interactions across the page.
  // ==========================================
  const { scrollYProgress: shadingProgress } = useScroll({
    target: heroRef,
    offset: ['end end', 'end start']
  })
  const shadingHeight = useTransform(shadingProgress, [0, 1], [0, 1000]);


  const { scrollYProgress: PShowYProg } = useScroll({
    target: productShowRef,
    offset: ['start start', 'end start']
  });




  const { scrollYProgress: codeMateImageProg } = useScroll({
    target: codeMateImageRef,
    offset: ['start end', 'end start']
  });

  const { scrollYProgress: unlockYProg } = useScroll({
    target: unlockCopyRef,
    offset: ['start end', 'end start']
  });

  const { scrollYProgress: testiYProg } = useScroll({
    target: testiRef,
    offset: ['start start', 'end start']
  });


  const { scrollYProgress: MYProg } = useScroll({
    target: mainRef,
    offset: ['start start', 'end start']
  });
  const { scrollYProgress: MFYProg } = useScroll({
    target: MFRef,
    offset: ['start start', 'end start']
  });

  // Track window scroll for navbar positioning
  const { scrollY } = useScroll();


  // ========== "What you'll Unlock" section scroll math ==========
  // Container: h-[430vh]. Offset: ['start start','end start'] → scroll distance = 430vh.
  // Next section enters viewport bottom at PShowYProg ≈ 0.767 (= 1 − 100vh/430vh).
  // 6 unlock steps span 0→0.76, ending just before the next section peeks in.
  // Blank tail ≈ (0.767−0.76)×430 ≈ 3vh — virtually invisible.
  const UNLOCK_END = 0.76;
  const UNLOCK_STEP = UNLOCK_END / 6; // ≈ 0.1267

  const unlockBarY = useTransform(PShowYProg, [0, UNLOCK_END], ['0%', '100%']);
  const headerY = useTransform(PShowYProg, [UNLOCK_END, UNLOCK_END + 0.12], [0, -200]);

  const [unlockStep, setUnlockStep] = useState<-1 | 0 | 1 | 2 | 3 | 4 | 5>(-1);

  ///for mobile feature section
  const mx = useTransform(MFYProg, [0, 1], [0, -1200]);

  useEffect(() => {
    // ==========================================
    // 1E. SMOOTH SCROLL INITIALIZATION
    // Initializes Lenis for global smooth scrolling.
    // ==========================================
    const lenis = new Lenis({
      duration: 2
    });
    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf);
  }, []);

  ///codeEditor part

  // [UNUSED] scaleE / xE — legacy transforms, not referenced in JSX
  // const scaleE = useTransform(PShowYProg, [0.5, 0.6, 0.7], [1, 1.5, 1]);
  // const xE = useTransform(PShowYProg, [0.5, 0.7], [0, -516]);

  ///for testing
  const tdiv1X = useTransform(testiYProg, [0, 0.1], [700, 0]);
  const tdiv2X = useTransform(testiYProg, [0.1, 0.3], [1300, 0]);
  const tdiv3X = useTransform(testiYProg, [0.3, 0.5], [1900, 0]);
  const tdiv4X = useTransform(testiYProg, [0.5, 0.7], [2500, 0]);
  const tdiv5X = useTransform(testiYProg, [0.7, 0.8], [3100, 0]);
  const tdiv6X = useTransform(testiYProg, [0.8, 1], [3600, 0]);
  const commentsX = useTransform(testiYProg, [0, 1], [0, 1500]);

  // Top announcement banner (SWE Bench ranking)
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const SWE_BENCH_BLOG_URL =
    'https://blog.codemate.ai/cora-achieves-sota-with-76-resolution-rate-on-swe-bench-verified-subset-outperforming-industry-leaders-2/'; // TODO: replace with actual blog URL
  const announcementRef = useRef<HTMLDivElement>(null);

  //for bento
  // [UNUSED] scaleB / xB — legacy transforms, not referenced in JSX
  // const scaleB = useTransform(PShowYProg, [0.8, 0.9], [1, 1.5]);
  // const xB = useTransform(PShowYProg, [0.8, 0.9], [0, 550]);


  ///for mobile navbar menu
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  //for codeEditor
  // ==========================================
  // 1F. EVENT HANDLERS
  // Functions to manage modal overlays, keyboard shortcuts, and button clicks.
  // ==========================================

  ///for mascot 
  useMotionValueEvent(MYProg, 'change', (latest) => {
    // Arrow visibility (show after 5% scroll)
    if (latest >= 0.05) setIsArrowV(true);
    else setIsArrowV(false);

    if (latest >= 0.027262813522355506) setIsMascot(true);
    if (latest <= 0.027262813522355506) setIsMascot(false);
  });



  ///for new products section




  // Discrete step switching for "What you'll Unlock"
  // Uses midpoint thresholds so the step changes at the exact center between two cards.
  // This makes scroll-up and scroll-down behavior perfectly symmetric.
  useMotionValueEvent(PShowYProg, 'change', (latest) => {
    if (latest <= 0 || latest >= UNLOCK_END) {
      setUnlockStep(-1);
      return;
    }

    // Midpoint thresholds: step changes when progress crosses the midpoint between
    // two adjacent step centers (UNLOCK_STEP * (i + 0.5) and UNLOCK_STEP * (i + 1.5))
    if (latest < UNLOCK_STEP * 1) setUnlockStep(0);
    else if (latest < UNLOCK_STEP * 2) setUnlockStep(1);
    else if (latest < UNLOCK_STEP * 3) setUnlockStep(2);
    else if (latest < UNLOCK_STEP * 4) setUnlockStep(3);
    else if (latest < UNLOCK_STEP * 5) setUnlockStep(4);
    else setUnlockStep(5);
  });

  // Play/pause videos in "What You'll Unlock" based on active step
  useEffect(() => {
    Object.entries(unlockVideoRefs.current).forEach(([key, video]) => {
      if (!video) return;
      if (Number(key) === unlockStep) {
        video.play().catch(() => { });
      } else {
        video.pause();
      }
    });
  }, [unlockStep]);

  // Block CORA.mp4 while the CodeMate Chat image is on screen
  useMotionValueEvent(codeMateImageProg, 'change', (latest) => {
    const imageVisible = latest > 0 && latest < 1;
    setIsCoraBlocked(imageVisible);
  });

  // Hide product overlay once the unlock paragraph leaves view (e.g., scrolling up past it)



  // for main div events
  useMotionValueEvent(MYProg, 'change', (latest) => {

    if (latest >= 0.001203313524221142) setIsNBack(true);
    if (latest <= 0.001203313524221142) setIsNBack(false);
  })

  useMotionValueEvent(MYProg, 'change', (e) => {
    if (e >= lastScroll) setIsArrow(true);
    if (e <= lastScroll) setIsArrow(false);
    setLastScroll(e);
  });

  // Detect when user starts scrolling to move navbar to top
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 10) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  });
  const shouldShowAnnouncement = showAnnouncement;

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


  // mainRef.current?.addEventListener("scroll",(e:any)=>{
  //     const currentScroll = e.target.scrollTop; 
  //     // console.log(currentScroll);

  //    if(currentScroll >= lastScroll) setIsArrow(true);
  //    if(currentScroll <= lastScroll) setIsArrow(false);
  //    setLastScroll(currentScroll); 
  // });
  useEffect(() => {
    const timer = setTimeout(() => {
      setIstitle(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  const handleArrow = () => {
    if (isArrow) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnnouncementClick = () => {
    window.open(SWE_BENCH_BLOG_URL, '_blank', 'noopener,noreferrer');
  };


  return (
    <div style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="22" height="22"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto` }} ref={mainRef} className={`${montserrat.className} bg-zinc-950 pt-[92px] sm:pt-[104px] lg:pt-[110px]`} >

      {/* arrow for going to hero section */}
      <AnimatePresence>
        {isArrowV &&
          <motion.div initial={{ opacity: 0, filter: 'blur(20px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(20px)' }} transition={{ duration: 1 }} className="fixed bottom-7 right-7 z-[9999999999]">
            <motion.div onClick={handleArrow} whileTap={{ scale: 1 }} whileHover={{ scale: 1.1 }} className='hidden lg:flex cursor-pointer  justify-center items-center  size-10 rounded-full bg-[#EDEADE]/90  text-black'>
              <motion.svg animate={{ rotate: isArrow ? 180 : 0 }} transition={{ duration: 0.5 }} xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
      {/* arrow for going to hero section */}

      {/* ========================================== */}
      {/* UI SECTION: TOP ANNOUNCEMENT BANNER      */}
      {/* Marketing banner displayed above the nav */}
      {/* ========================================== */}
      {/* Announcement*/}
      {shouldShowAnnouncement && (
        <motion.div
          ref={announcementRef}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="w-full flex justify-center px-1 sm:px-2 z-[999999]"
        >
          <div className="relative p-[1px] rounded-md bg-gradient-to-r from-neutral-800 to-neutral-700 w-fit max-w-[calc(100vw-1.5rem)] shadow-lg hover:shadow-xl transition group">
            <div
              role="button"
              tabIndex={0}
              onClick={() => window.open('https://app.codemate.ai', '_blank')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open('https://app.codemate.ai', '_blank'); } }}
              className="flex w-full h-full items-center justify-center gap-1.5 sm:gap-2 rounded-md bg-black px-2 py-2 sm:py-2 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 rounded-sm bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-black uppercase tracking-wide shrink-0">
                  Limited Offer
                </span>
                <div className="flex min-w-0 items-center gap-0.5 text-[11px] sm:text-[13px] font-medium leading-snug">
                  <p className="truncate max-w-[200px] xs:max-w-[260px] sm:max-w-none text-center sm:text-left text-neutral-300">
                    Get <span className="text-white font-semibold">60 Days of PRO</span> for free
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
      {/*navBar*/}
      <div
        style={{ top: 0 }}
        className="hidden lg:flex fixed justify-center items-center w-full cursor-default z-[999999] transition-all duration-300 linear">
        <motion.div
          initial={{ y: -110 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.2, delay: 0 }}
          // initial={{opacity:0,filter:'blur(10px)'}}
          // animate={{opacity:1,filter:'blur(0px)'}}
          // transition={{duration:1,delay:7}}
          style={{
            background: !isNBack ? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',
            boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
          className={`${hasScrolled ? 'mt-5' : 'mt-2'} w-full bg-opacity-65 z-[9999999999] rounded-lg ${isNBack ? 'border-y-[1px]   border-gray-400 border-opacity-10' : ''} transition-all duration-300`}>
          <div className='flex  h-full w-full text-white px-[1rem] py-2 '>
            <div className='flex justify-between items-center w-full h-10'>

              <div className="h-fit w-[15vw] flex justify-center overflow-hidden">
                <img onClick={() => router.push("/")} src="/codemateLogo.svg" alt="" className='cursor-pointer' />
                {/* {!IsMascot && <img src="/codemateLogo.svg" alt="" />}
     {IsMascot && <motion.div initial={{opacity:0,filter:'blur(20px)',x:50}} animate={{opacity:1,filter:'blur(0px)',x:-80}} transition={{duration:0.5}}>
<svg width="50" height="40" viewBox="0 0 153 150" fill="none" xmlns="http://www.w3.org/2000/svg">

  <path d="M131.78 150H39.4727L60.2412 110.845H152.55L131.78 150ZM39.4727 39.0674V150L0.242188 125.04V14.1074L39.4727 39.0674ZM131.78 39.1553H39.4727L60.2412 0H152.55L131.78 39.1553Z" 
    fill="url(#paint0_linear_2014_66)"/>

<motion.svg
  animate={{ translateX: [0, 0,15,15,15,15, 0], translateY: [0,12,12,-10,-10,0, 0] }}
  transition={{ duration: 7, repeat: Infinity }}
>
  <motion.circle cx="71.7422" cy="75" r="11" fill="white"
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.8, repeat: Infinity,repeatDelay:2 }}
  />
  <motion.circle cx="111.742" cy="75" r="11" fill="white"
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.8, repeat: Infinity,repeatDelay:2 }}
  />
</motion.svg>

  <defs>
    <linearGradient id="paint0_linear_2014_66" x1="0.580642" y1="0" x2="183.357" y2="82.4837" gradientUnits="userSpaceOnUse">
      <stop stop-color="#00BFFF"/>
      <stop offset="1" stop-color="#1E90FF"/>
    </linearGradient>
  </defs>
</svg>


      </motion.div>} */}

              </div>
              <div className={`${montserrat.className} relative flex flex-col gap-3 text-md  justify-center items-center cursor-pointer text-right z-50`}>
                <span className=' flex gap-5 justify-center items-center z-50'>
                  <motion.h1
                    onMouseEnter={() => { setIsProducts(state => !state); setIsOS(false); setIsResources(false) }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} className={`flex text-center opacity-100 gap-[0.20rem] justify-center items-center  z-50  ${isProducts ? 'opacity-100' : 'opacity-65'}`}>Products  <motion.span
                      initial={{ rotate: 180 }}
                      animate={{ rotate: !isProducts ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronUp
                        className="h-4 w-4 shrink-0 grow-0 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50"
                      />
                    </motion.span></motion.h1>
                  <motion.h1
                    onMouseEnter={() => { setIsOS(state => !state); setIsProducts(false); setIsResources(false) }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} className={`flex text-center opacity-100 gap-[0.20rem] justify-center items-center text-nowrap  z-50  ${isOS ? '' : 'opacity-65'}`}>Open-Source  <motion.span
                      initial={{ rotate: 180 }}
                      animate={{ rotate: !isOS ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronUp
                        className="h-4 w-4 shrink-0 grow-0 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50"
                      />
                    </motion.span></motion.h1>
                  <motion.h1
                    onMouseEnter={() => { setIsResources(state => !state); setIsOS(false); setIsProducts(false) }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }} className={`flex text-center opacity-100 gap-[0.20rem] justify-center items-center text-nowrap  z-50  ${isResources ? '' : 'opacity-65'}`}>Resources<motion.span
                      initial={{ rotate: 180 }}
                      animate={{ rotate: !isResources ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronUp
                        className="h-4 w-4 shrink-0 grow-0 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50"
                      />
                    </motion.span></motion.h1>
                  {/* <motion.h1 onMouseEnter={()=>setIsProducts(state=>!state)} whileHover={{opacity:1}} transition={{duration:0.2}} className={`flex text-center  justify-center items-center opacity-65 z-50 `}>OpenSource</motion.h1> */}
                  <motion.h1 onMouseEnter={() => { setIsProducts(false); setIsOS(false); setIsResources(false) }} onClick={() => productShowRef.current?.scrollIntoView({ behavior: "smooth" })} whileHover={{ opacity: 1 }} className='opacity-65'>Features</motion.h1>
                  <motion.h1 onMouseEnter={() => { setIsProducts(false); setIsOS(false); setIsResources(false) }} whileHover={{ opacity: 1 }} onClick={() => { router.push('pricing') }} className='opacity-65'>Pricing</motion.h1>
                  <a href='https://edu.codemate.ai/' target='_blank'>
                    <motion.h1 onMouseEnter={() => { setIsProducts(false); setIsOS(false); setIsResources(false) }} whileHover={{ opacity: 1 }} className='opacity-65'>Education</motion.h1>
                  </a>
                  <a href="https://app.codemate.ai" target='_blank'>
                    <motion.button whileHover={{ opacity: 1, scale: 1.05 }} className={`${montserrat.className} px-2 py-1  bg-[#FFFFFF] text-black  rounded-sm font-semibold opacity-85 text-nowrap`}>Get Started</motion.button>
                  </a>
                </span>

                {isProducts &&
                  <div className='absolute  h-[20rem] w-[31.5%] mt-[22rem] -left-11 rounded-md -z-10 '>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        boxShadow: '0 14px 25px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(50px)',
                        WebkitBackdropFilter: 'blur(50px)'
                      }} className=' h-auto w-full left-5 rounded-2xl -z-10 bg-zinc-900 drop-shadow-2xl shadow-2xl overflow-hidden'>
                      <div className="py-4 px-2 flex flex-col gap-0">

                        <h1 style={{ fontWeight: 450 }} className="text-left px-3 mb-1 text-sm opacity-50">Web-Application</h1>
                        <a href="https://app.codemate.ai/chat" target="_blank" className="w-full">
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-70 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 flex justify-center">
                                <img src="/Co_Logo.png" alt="Chat" className="size-5 object-contain" />
                              </div>
                              <h1>C0</h1>
                            </div>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>
                        <a href='https://build.codemateai.dev/build' target='_blank' className="w-full">
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-70 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 flex justify-center">
                                <img src="/Build_Logo.png" alt="Build" className="size-5 scale-[1.5] object-contain" />
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
                                <img src="/CORA_Logo.png" alt="CORA" className="size-5 object-contain" />
                              </div>
                              <h1>CORA</h1>
                            </div>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>
                        <a href='https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate' target='_blank' className="w-full">
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-70 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 flex justify-center">
                                <img src="/Co_Logo.png" alt="C0 Extension" className="size-5 object-contain" />
                              </div>
                              <h1 className="text-nowrap">C0 Extension</h1>
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
                                <img src="/CORA_Logo.png" alt="CORA" className="size-5 object-contain" />
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
                }

                {isOS &&
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

                {isResources &&
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
                        <a href='https://blog.codemate.ai/' target='_blank' className='w-full'>
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-80 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <h1>Blogs</h1>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>
                        <a href='https://calendar.app.google/Gyyh913R8hyczmBFA' target='_blank' className='w-full'>
                          <motion.div whileHover={{ opacity: 1 }} className="flex justify-between items-center opacity-80 w-full group hover:bg-white/10 rounded-lg px-3 py-2 transition-all duration-200">
                            <h1>Contact</h1>
                            <div className="size-[1.48rem] bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.svg initial={{ rotate: 50, opacity: 0.7 }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
                            </div>
                          </motion.div>
                        </a>
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
            </div>
            {/* <h1 className=' p-2 bg-[#1a1a1a] border border-opacity-15 bg-opacity-25 rounded-md flex justify-center items-center'>Book a Demo</h1> */}
          </div>
        </motion.div>
      </div>
      {/*navBar*/}

      {/*navBar for mobile*/}
      <div
        style={{ zIndex: 999999, top: 0 }}
        className="lg:hidden fixed flex justify-center items-center w-full transition-all duration-300">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          // initial={{opacity:0,filter:'blur(10px)'}}
          // animate={{opacity:1,filter:'blur(0px)'}}
          // transition={{duration:1,delay:7}}
          style={{
            background: !isNBack ? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',
            boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 99999999999,
          }}
          className={`w-full bg-opacity-65 z-[99999999999] ${isNBack ? 'border-y-[1px]   border-gray-400 border-opacity-10' : ''}`}>
          <div className='flex  h-full w-full text-white px-[2rem] py-2 '>
            <div className='flex justify-between items-center w-full h-10'>

              <div className="h-full w-[30vw] flex justify-center overflow-hidden">
                <img src="/codemateLogo.svg" alt="" className='hidden' />

                {/* {!IsMascot && <img src="/codemateLogo.svg" alt="" />}
     {IsMascot && <motion.div initial={{opacity:0,filter:'blur(20px)',x:50}} animate={{opacity:1,filter:'blur(0px)',x:0}} transition={{duration:0.5}}>
<svg width="155" height="150" viewBox="0 0 53 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M131.78 150H39.4727L60.2412 110.845H152.55L131.78 150ZM39.4727 39.0674V150L0.242188 125.04V14.1074L39.4727 39.0674ZM71.7422 64C77.8173 64 82.7422 68.9249 82.7422 75C82.7422 81.0751 77.8173 86 71.7422 86C65.6671 86 60.7422 81.0751 60.7422 75C60.7422 68.9249 65.6671 64 71.7422 64ZM111.742 64C117.817 64 122.742 68.9249 122.742 75C122.742 81.0751 117.817 86 111.742 86C105.667 86 100.742 81.0751 100.742 75C100.742 68.9249 105.667 64 111.742 64ZM131.78 39.1553H39.4727L60.2412 0H152.55L131.78 39.1553Z" fill="url(#paint0_linear_2014_66)"/>
<defs>
<linearGradient id="paint0_linear_2014_66" x1="0.580642" y1="1.09465e-05" x2="183.357" y2="82.4837" gradientUnits="userSpaceOnUse">
<stop stop-color="#396AFC"/>
<stop offset="1" stop-color="#2948FF"/>
</linearGradient>
</defs>
</svg>


      </motion.div>} */}

              </div>




            </div>
            {/* <h1 className=' p-2 bg-[#1a1a1a] border border-opacity-15 bg-opacity-25 rounded-md flex justify-center items-center'>Book a Demo</h1> */}
          </div>
        </motion.div>
      </div>

      {/* ========================================== */}
      {/* UI SECTION: MOBILE NAVIGATION & MENU     */}
      {/* Hamburger menu overlay for mobile devices*/}
      {/* ========================================== */}
      {/* mobile menu */}
      <AnimatePresence>
        <motion.div
          key="mobile-navbar-container"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            background: !isNBack ? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',
            boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            top: 0
          }}
          className={`${isMenu && (isProducts || isOS) ? 'bg-zinc-900' : ''} lg:hidden fixed flex w-full px-5 pl-0 py-[1.1rem] justify-between items-center z-[99999999999]`}>
          <img src="/codemateLogo.svg" alt="" className='h-full w-[50vw]' />
          <motion.div
            onClick={() => { setMenu(state => !state); setIsNBack(false) }} className={`${montserrat.className}   flex gap-2 text-[4vw]  justify-center items-center cursor-pointer text-right  `}>
            {/* Menu */}
            <Menu
              className={cn(
                " w-[5vw] h-[5vw] transition-all duration-200",
                isMenu
                  ? "hidden  scale-75 -rotate-45"
                  : "opacity-100 scale-100 rotate-0"
              )}
            />

            {/* Cross Icon */}
            <X
              className={cn(
                " w-[5vw] h-[5vw] transition-all duration-200",
                isMenu
                  ? "opacity-100 scale-100 rotate-0"
                  : "hidden scale-75 rotate-45"
              )}
            />

            {/* <motion.svg style={{ width: "5vw", height: "5vw" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></motion.svg> */}
          </motion.div>
        </motion.div>
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

                <div data-lenis-prevent className='relative h-full w-full overflow-y-auto  z-[9999999999]'>

                  <div className='flex flex-col leading-[1] text-[8vw] pt-24 pl-5 gap-10 '>
                    <motion.div onClick={() => router.push('/')} whileHover={{ opacity: 0.6 }} className='flex gap-2 cursor-pointer'><span className='MenuText'>HOME</span><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>01</p></motion.div>
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

                          <h1 style={{ fontWeight: 600 }} className='text-lg text-left mb-1'>Web-Application</h1>

                          <div className='relative text-base text-left overflow-hidden '>
                            <a href="https://app.codemate.ai/chat" target='_blank'>
                              <div className='flex items-center gap-2 z-20 opacity-90'>
                                <div className="w-8 flex justify-center">
                                  <img src="/Co_Logo.png" alt="Chat" className="size-5 object-contain" />
                                </div>
                                <motion.h1>C0</motion.h1>
                              </div>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600 flex items-center gap-2'>
                                  <div className="w-8 flex justify-center">
                                    <img src="/Co_Logo.png" alt="C0" className="size-5 object-contain" />
                                  </div>
                                  <h1>C0</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>


                          <div className='relative text-base text-left overflow-hidden mb-2'>
                            <a href="https://build.codemateai.dev/secure__?session__id__=1e79d863e85850ddad011af939f79137:ifr7GFfV29hp6Frs5FpwvPtObmg8HHmIXq2cJ9uv5/3bUIQvNeQ4/PS4bUUqZk8a" target="_blank">
                              <div className='flex items-center gap-2 z-20 opacity-90'>
                                <div className="w-8 flex justify-center">
                                  <img src="/Build_Logo.png" alt="Build" className="size-5 scale-[1.5] object-contain ml-0" />
                                </div>
                                <motion.h1>Build</motion.h1>
                              </div>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600 flex items-center gap-2'>
                                  <div className="w-8 flex justify-center">
                                    <img src="/Build_Logo.png" alt="Build" className="size-5 scale-[1.5] object-contain ml-0" />
                                  </div>
                                  <h1>Build</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>


                          <h1 style={{ fontWeight: 600 }} className='text-lg  text-left mb-1'>VS Code Extension</h1>

                          <div className='relative text-base text-left overflow-hidden'>
                            <a href="https://marketplace.visualstudio.com/items?itemName=CodeMateAI.codemate-agent" target="_blank">
                              <div className='flex items-center gap-2 z-20 opacity-90'>
                                <div className="w-8 flex justify-center">
                                  <img src="/CORA_Logo.png" alt="CORA" className="size-5 object-contain" />
                                </div>
                                <motion.h1>CORA</motion.h1>
                              </div>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600 flex items-center gap-2'>
                                  <div className="w-8 flex justify-center">
                                    <img src="/CORA_Logo.png" alt="CORA" className="size-5 object-contain" />
                                  </div>
                                  <h1>CORA</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>
                          <div className='relative text-base text-left overflow-hidden mb-2'>
                            <a href="https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate">
                              <div className='flex items-center gap-2 z-20 opacity-90'>
                                <div className="w-8 flex justify-center">
                                  <img src="/Co_Logo.png" alt="C0 Extension" className="size-5 object-contain" />
                                </div>
                                <motion.h1>C0 Extension</motion.h1>
                              </div>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600 flex items-center gap-2'>
                                  <div className="w-8 flex justify-center">
                                    <img src="/Co_Logo.png" alt="C0 Extension" className="size-5 object-contain" />
                                  </div>
                                  <h1>C0 Extension</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>

                          <h1 style={{ fontWeight: 600 }} className='text-lg  text-left mb-1'>JetBrains Plugin</h1>
                          <div className='relative text-base text-left overflow-hidden'>
                            <a href="https://plugins.jetbrains.com/plugin/29932-cora" target="_blank">
                              <div className='flex items-center gap-2 z-20 opacity-90'>
                                <div className="w-8 flex justify-center">
                                  <img src="/CORA_Logo.png" alt="CORA" className="size-5 object-contain" />
                                </div>
                                <motion.h1>CORA</motion.h1>
                              </div>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600 flex items-center gap-2'>
                                  <div className="w-8 flex justify-center">
                                    <img src="/CORA_Logo.png" alt="CORA" className="size-5 object-contain" />
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



                          <div className='relative text-base text-left overflow-hidden '>
                            <a href="https://huggingface.co/codemateai" target='_blank'>
                              <motion.h1 className='z-20 opacity-90'>Models</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>Chat</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>


                          <div className='relative text-base text-left overflow-hidden'>
                            <a href="https://cli.codemate.ai/" target="_blank">
                              <motion.h1 className='z-20 opacity-90'>Terminal</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>Build</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>


                          {/* <h1 style={{fontWeight:500}} className='text-[1rem]  text-left mb-1'>VS Code Extension</h1>

                    <div className='relative text-sm text-left overflow-hidden'> 
            <a href="https://marketplace.visualstudio.com/items?itemName=CodeMateAI.codemate-agent" target="_blank">          
            <motion.h1  className='z-20 opacity-90'>CORA</motion.h1>
            <motion.div whileHover={{y:-50}} transition={{duration:0.8}} className='absolute h-full w-full  top-0 '>
              <motion.div initial={{y:50}} className= 'h-full w-full rounded-t-md bg-cyan-600'>
              <h1>CORA</h1>
              </motion.div>
            </motion.div>
            </a>
          </div>
                   <div className='relative text-sm text-left overflow-hidden mb-2'> 
             <a href="https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate">       
            <motion.h1  className='z-20 opacity-90'>Chat Extension</motion.h1>
            <motion.div whileHover={{y:-50}} transition={{duration:0.8}} className='absolute h-full w-full  top-0 '>
              <motion.div initial={{y:50}} className= 'h-full w-full rounded-t-md bg-cyan-600'>
              <h1>Chat Extension</h1>
              </motion.div>
            </motion.div>
            </a>
          </div> */}

                          {/* <h1 className='text-lg text-left mb-1 font-semibold'>Open-Source</h1>

                             <div className='relative border-b-[1px] border-zinc-500 overflow-hidden'> 
            <a href="hf.co/codemateai" target="_blank">          
            <motion.h1  className='z-20 opacity-90'>Models</motion.h1>
            <motion.div whileHover={{y:-50}} transition={{duration:0.8}} className='absolute h-full w-full  top-0 '>
              <motion.div initial={{y:50}} className= 'h-full w-full rounded-t-md bg-cyan-600'>
              <h1>Models</h1>
              </motion.div>
            </motion.div>
            </a>
          </div>
                   <div className='relative border-b-[1px] border-zinc-500 overflow-hidden'> 
             <a href="cli.codemate.ai">       
            <motion.h1  className='z-20 opacity-90'>Terminal</motion.h1>
            <motion.div whileHover={{y:-50}} transition={{duration:0.8}} className='absolute h-full w-full  top-0 '>
              <motion.div initial={{y:50}} className= 'h-full w-full rounded-t-md bg-cyan-600'>
              <h1>Terminal</h1>
              </motion.div>
            </motion.div>
            </a>
          </div> */}

                          {/* <a href='app.codemate.ai' target='_blank' className='w-full mt-3'>
        <button className='flex gap-1 justify-center items-center  bg-gray-300 hover:opacity-80 text-zinc-950 rounded-sm font-semibold w-full'>Manage<svg  xmlns="http://www.w3.org/2000/svg"  width={18}  height={18}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" /></svg></button>
        </a> */}
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
                          <div className='relative text-base text-left overflow-hidden '>
                            <a href="https://docs.codemate.ai/" target='_blank'>
                              <motion.h1 className='z-20 opacity-90'>Docs</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>Docs</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>


                          <div className='relative text-base text-left overflow-hidden'>
                            <a href="https://blog.codemate.ai/" target="_blank">
                              <motion.h1 className='z-20 opacity-90'>Blogs</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>Blogs</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>


                          <div className='relative text-base text-left overflow-hidden'>
                            <a href="https://calendar.app.google/Gyyh913R8hyczmBFA" target="_blank">
                              <motion.h1 className='z-20 opacity-90'>Contact</motion.h1>
                              <motion.div whileHover={{ y: -50 }} transition={{ duration: 0.8 }} className='absolute h-full w-full  top-0 '>
                                <motion.div initial={{ y: 50 }} className='h-full w-full rounded-t-md bg-cyan-600'>
                                  <h1>Contact</h1>
                                </motion.div>
                              </motion.div>
                            </a>
                          </div>
                        </motion.div>
                      }
                    </motion.div>
                    <motion.div onClick={() => window.location.href = '/pricing'} whileHover={{ opacity: 0.6 }} className='flex gap-2 cursor-pointer'><h1 className='MenuText'>PRICING</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>05</p></motion.div>
                    <a href='https://edu.codemate.ai/' target='_blank'>
                      <motion.div whileHover={{ opacity: 0.6 }} className='flex gap-2 cursor-pointer'><h1 className='MenuText'>EDUCATION</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>06</p></motion.div>
                    </a>
                    <a href="https://app.codemate.ai" target="_blank">
                      <motion.div whileHover={{ opacity: 0.6 }} className='flex gap-2 cursor-pointer'><h1 className='MenuText'>GET STARTED</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>07</p></motion.div>
                    </a>
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

            <div onClick={() => { setMenu(false); setIsProducts(false) }} className='h-full w-[30%]'></div>

          </div>
        )}
      </AnimatePresence>
      {/* mobile menu */}

      {/*navBar for mobile*/}


      {/* hero section  */}
      {/* hero section  */}
      <div ref={heroRef2} className='h-auto lg:h-screen w-full overflow-x-hidden relative'>
        <BackgroundGradientAnimation className='w-full overflow-hidden' interactive={true} gradientBackgroundStart='rgb(9, 9, 11)' gradientBackgroundEnd='rgb(9, 9, 11)' firstColor='0, 255, 255' secondColor='30, 144, 255' thirdColor='0, 255, 255' fourthColor='255,255,255' pointerColor='30, 144, 255' size='100%'>
          {/* ========================================== */}
          {/* UI SECTION: HERO                         */}
          {/* The main landing area with the primary CTA and background animation */}
          {/* ========================================== */}
          <div style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="26" height="26"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto` }} ref={heroRef} className='relative h-auto lg:h-screen w-full z-50 overflow-hidden cursor-default flex flex-col justify-start pt-20 lg:pt-[8vh] pb-8 lg:pb-20'>

            <motion.div
              style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="32" height="32"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto` }}
              className='absolute inset-0 opacity-5 z-0'>
              <img src="/bgNoise.png" className='w-full h-full object-cover' alt="" />
            </motion.div>

            <div className='relative z-50 w-full pl-[8vw] lg:pl-[calc(3.3vw+3rem)] pr-[8vw] lg:pr-12 flex flex-col items-start'>
              <motion.div
                className='text-[clamp(2.5rem,12vw,4.5rem)] lg:text-[clamp(5rem,8vw,8rem)] leading-[1.05] font-semibold flex flex-col z-50 xxlHerotext text-left'>


                <div className={`${montserrat.className} `}>
                  <div className='xxlHero z-50'>
                    <motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.3 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]'>On</motion.span>
                    {' '}
                    <motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.3, delay: 0.3 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]'>Device</motion.span>
                    {' '}
                    <motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.2, delay: 0.6 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]'>First</motion.span>
                    {' '}
                    <motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.1, delay: 0.8 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]'>AI</motion.span>
                  </div>
                </div>
                <div className={`${montserrat.className} flex flex-wrap justify-start gap-x-4 bg-gradient-to-b from-white to-gray-300/10 bg-clip-text text-transparent`}>
                  <div className='pb-3'>
                    <motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.1, delay: 0.9 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]'>SDLC</motion.span>
                    {' '}
                    <motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.1, delay: 1 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]'>Agent</motion.span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, delay: 1.5 }}
                  className={`flex flex-col ${montserrat.className} font-normal text-sm sm:text-base lg:text-xl gap-1 leading-relaxed mt-2 lg:mt-5 opacity-60 text-left`}>
                  <p>Build and ship 20x faster with CodeMate AI</p>
                  <p>Your all-in-one accelerator to turn your ideas into code</p>
                </motion.div>

                {/* State-of-the-Art Badge */}
                <motion.div
                  ref={announcementRef}
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="w-full flex justify-start mt-3 lg:mt-8 z-[100]"
                >
                  <div className="relative p-[1px] rounded-md bg-gradient-to-r from-neutral-800 to-neutral-700 w-fit max-w-[calc(100vw-3rem)] shadow-lg hover:shadow-xl transition group">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => window.open('https://blog.codemate.ai/cora-achieves-sota-with-76-resolution-rate-on-swe-bench-verified-subset-outperforming-industry-leaders-2/', '_blank')}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open('https://app.codemate.ai', '_blank'); } }}
                      className="flex w-full h-full items-center justify-center gap-1.5 sm:gap-2 rounded-md bg-black px-3 py-2 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                        <p className="text-[11px] sm:text-[13px] font-medium leading-snug text-neutral-300">
                          Cora is now <span className="text-white font-semibold">State-of-the-Art</span>
                        </p>
                        <ChevronRight className="text-neutral-400 group-hover:text-white transition-colors shrink-0" size={14} strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, filter: "blur(10px)", y: 100 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`${montserrat.className} flex justify-start items-center gap-3 sm:gap-4 text-xs sm:text-sm mt-4 lg:mt-10`}
                >
                  <a href="/download">
                    <motion.button
                      whileHover={{ opacity: 0.8 }}
                      className="h-10 sm:h-12 px-4 sm:px-8 flex items-center justify-center bg-black text-white rounded-md font-semibold border border-white/5 whitespace-nowrap"
                    >
                        Download
                      </motion.button>
                    </a>
                    <a href="https://app.codemate.ai" target="_blank">
                      <motion.button
                        whileHover={{ opacity: 0.9 }}
                        className="h-10 sm:h-12 px-4 sm:px-8 flex items-center justify-center bg-white text-black rounded-md font-semibold whitespace-nowrap"
                      >
                        Try Build 2.0
                      </motion.button>
                    </a>
                  </motion.div>
                </motion.div>

                {/* <motion.span className='mt-32' initial={{display:'none',y:50,filter:'blur(10px)'}}
       animate={{display:'block',y:0,filter:'blur(0px)'}}
       transition={{delay:7,duration:1}}
       >
       <img src="/chat.png" className='object-cover w-[45rem]' alt="" />
       </motion.span> */}

                {/* <motion.p
      initial={{opacity:0,display:'hidden',filter:'blur(10px)'}}
      animate={{opacity:1,filter:'blur(0px)',display:'block'}}
      transition={{duration:1,delay:8}}
      className={`${montserrat.className} opacity-60 text-xl`}>You Think ! We Develop</motion.p> */}

                {/* <motion.div 
   initial={{opacity:0}}
   animate={{opacity:0.6,y:[10,0,10]}}
   transition={{duration:4,delay:10,repeat:Infinity,repeatType:'reverse'}}
   className='absolute bottom-10 text-3xl opacity-50'>
     <span className='flex justify-center items-center'>Scroll Up <svg  xmlns="http://www.w3.org/2000/svg"  width="32"  height="32"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></svg></span>
   </motion.div> */}
              </div>



            </div>
          </BackgroundGradientAnimation>
        </div>
      {/* hero section */}

      {/* enter section */}
      {/* <div
   ref={exploreRef} 
   className={`${montserrat2.className} flex justify-center items-center h-[100vh] w-full bg-zinc-950`}>
    <motion.span 
    initial={{opacity:0,filter:'blur(20px)'}}
    whileInView={{opacity:1,filter:'blur(0px)'}}
    viewport={{amount:1}}
    transition={{duration:1.3}}
    className='flex gap-5 text-6xl'>
      <h1 className='font-semibold text-white'>Press</h1>
      <motion.h1 animate={{scale:[1,1.1]}} 
      transition={{duration:2,repeat:Infinity,repeatType:'mirror',}}
      className='p-2 bg-opacity-80 bg-[#1B2021] text-[#00FFFF]'>Enter</motion.h1>
      <h1 className='font-semibold text-white'>to</h1>
      <h1 className='italic text-white'>Explore</h1>
    </motion.span>
   </div> */}
      {/* enter section */}

      {/* scrolling bento */}


      <EventOffer
        isOpen={showEventPopup}
        onClose={() => setShowEventPopup(false)}
        badgeText="Republic Day Special"
        offerText="Flat 77% OFF"
        discountLabel="50% OFF"
        imageSrc='https://backend.v3.codemateai.dev/uploaded/images/68c433e9-aa31-4bfe-9127-62ae403e018e'
      />

      <div className='w-full bg-zinc-950 text-white -z-10 flex flex-col justify-center items-center '>
        <h1 className=' font-mono pt-8 opacity-75  text-center  text-lg'>Introducing CodeMate AI</h1>


        {/* ========================================== */}
        {/* UI SECTION: FULL-STACK AI ENGINEER SHOWCASE */}
        {/* Features a sticky video player on the left and a scrollable list of products on the right */}
        {/* ========================================== */}
        <div className={`${montserrat.className} mt-4 leading-[1] text-[8vw]   lg:text-6xl  font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent  pt-2 lg:pb-2 w-full text-center `}>Your<span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent  lg:text-7xl'> Full-Stack</span> AI Engineer.</div>

        <div className={`relative z-20 w-full flex flex-col lg:flex-row items-start ${montserrat.className}`}>
          {/* Left: Sticky video panel - desktop only */}
          <div className='hidden lg:flex sticky top-0 h-screen flex-1 items-center justify-center px-8'>
            <div className="flex flex-col gap-2 w-full max-w-[58vw]">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ willChange: "transform, opacity" }}
                className='h-[65vh] w-full rounded-lg overflow-hidden'>
                <VideoEmbed />
              </motion.div>
              <p ref={unlockCopyRef} className='opacity-70 text-[1rem] w-full leading-relaxed mt-3'>From developers to non-developers, it acts like your autonomous team mate that assist you in shipping code with AI.</p>
            </div>
          </div>

          {/* Right: Product cards - pushed to far right */}
          <div className="flex flex-col items-center w-full lg:w-[32vw] lg:mr-6 lg:py-8 lg:gap-2 pb-8">
            {/* Mobile-only video */}
            <div className='lg:hidden w-full px-4 mb-8'>
              <div className='h-[45vh] w-full rounded-lg overflow-hidden'>
                <VideoEmbed />
              </div>
              <p className='opacity-70 text-[0.9rem] w-full leading-relaxed mt-3'>From developers to non-developers, it acts like your autonomous team mate that assist you in shipping code with AI.</p>
            </div>

            {[
              { href: "https://build.codemateai.dev/build", img: "/build_gif.gif", fallback: "/Build Static.png", imgClass: "object-fit size-[90%] shadow-2xl", bottom: "bottom-[0.4rem] lg:bottom-[0.5rem]", title: "CodeMate Build", desc: "Turns prompts and Figma designs into deployable apps instantly with full design mode support." },
              { href: "https://cli.codemate.ai/", img: "term.svg", imgClass: "object-fit size-[90%] shadow-2xl", bottom: "bottom-[-4.8rem] lg:bottom-[-6rem]", title: "AI Terminal", desc: "Run code and scripts instantly through an AI-powered command-line interface." },
              { href: "https://marketplace.visualstudio.com/items?itemName=CodeMateAI.codemate-agent", img: "/CORA+FULL.gif", fallback: "/CORA Static.png", imgClass: "w-full h-auto object-contain rounded-t-lg shadow-[0_-10px_40px_rgba(0,0,0,0.5)]", bottom: "bottom-[0.4rem] lg:bottom-[0.5rem]", px: true, title: "CodeMate CORA", desc: "End-to-end AI coding agent for writing, securing, and quality-gating code directly in your IDE." },
              { href: "https://edu.codemate.ai/", img: "/codemate_edu.gif", fallback: "/Codemate Education Static.png", imgClass: "object-fit size-[90%] shadow-2xl", bottom: "bottom-[1.5rem] lg:bottom-[3.5rem]", title: "CodeMate Education", desc: "AI-powered classroom management built for educators and students to master modern development." },
              { href: "https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate", img: "/Codemaps (1).gif", fallback: "/Co extention Static.png", imgClass: "object-fit size-[90%] shadow-2xl", bottom: "bottom-[0.4rem] lg:bottom-[0.5rem]", title: "CodeMate C0 Extension", desc: "Your in-IDE AI partner for code management, debugging, and performance optimization." },
              { href: "https://app.codemate.ai/chat", img: "/C0 Web app1.gif", fallback: "/Co web Static.png", imgClass: "w-full h-auto object-contain rounded-t-lg shadow-[0_-10px_40px_rgba(0,0,0,0.5)]", bottom: "bottom-[0.4rem] lg:bottom-[0.5rem]", px: true, title: "CodeMate C0", desc: "Turns deep research and feasibility into production-ready code through AI-driven intelligence." },
            ].map((product: any, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3, scale: 0.8, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.5, margin: "-10% 0px -10% 0px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ willChange: "transform, opacity, filter" }}
                className="w-full flex flex-col items-center lg:items-start py-3 px-4 lg:px-0 group"
              >
                <a href={product.href} target="_blank" className='cursor-pointer w-full'>
                  <div className="flex flex-col items-center lg:items-start w-full">
                    <div className='relative h-[16rem] lg:h-[20rem] w-[88vw] lg:w-[28vw] overflow-hidden rounded-t-[3rem] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,191,255,0.2)]'>
                      <div className='absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20 rounded-t-[3rem] border-x-[1px] border-zinc-600' />
                      <div className={`absolute ${product.bottom} w-full flex items-center justify-center shadow-2xl ${product.px ? 'px-4' : ''}`}>
                        <SmartGif
                          src={product.img}
                          fallbackSrc={product.fallback}
                          className={product.imgClass}
                          alt={product.title}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mt-6">
                      <h1 className='text-2xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent group-hover:from-[#00BFFF] group-hover:to-[#1E90FF] transition-all duration-300'>{product.title}</h1>
                    </div>
                    <p className='text-center lg:text-left opacity-70 text-base w-[88vw] lg:w-[28vw] mt-2 leading-relaxed group-hover:opacity-100 transition-opacity'>{product.desc}</p>
                  </div>
                </a>
              </motion.div>
            ))}

            {/* PR Review Agent - special (has icons) */}
            <motion.div
              initial={{ opacity: 0.3, scale: 0.8, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.5, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ willChange: "transform, opacity, filter" }}
              className="w-full flex flex-col items-center lg:items-start py-3 px-4 lg:px-0 group mb-8 lg:mb-4"
            >
              <a href="https://github.com/apps/codemate-ai-pr-review-agent" target="_blank" className='cursor-pointer w-full'>
                <div className="flex flex-col items-center lg:items-start w-full">
                  <div className='relative h-[16rem] lg:h-[20rem] w-[88vw] lg:w-[28vw] overflow-hidden rounded-t-[3rem] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,191,255,0.2)]'>
                    <div className='absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20 rounded-t-[3rem] border-x-[1px] border-zinc-600' />
                    <div className="absolute bottom-[-4.8rem] lg:bottom-[-6rem] w-full flex items-center justify-center shadow-2xl">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        ref={codeMateImageRef}
                        src="/prneww.png"
                        className="object-fit size-[90%] shadow-2xl"
                        alt="PR Review"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mt-6">
                    <h1 className='text-2xl font-bold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent group-hover:from-[#00BFFF] group-hover:to-[#1E90FF] transition-all duration-300'>CodeMate PR Review Agent</h1>
                  </div>
                  <p className='text-center lg:text-left opacity-70 text-base w-[88vw] lg:w-[28vw] mt-2 leading-relaxed group-hover:opacity-100 transition-opacity'>Automates code reviews and security analysis across GitHub, GitLab, Bitbucket, and Azure DevOps.</p>
                  <div className='flex items-center gap-6 mt-6 opacity-60 text-white group-hover:opacity-100 transition-opacity'>
                    <FaGithub className='w-6 h-6 hover:scale-125 transition-transform cursor-pointer' title='GitHub' />
                    <FaBitbucket className='w-6 h-6 hover:scale-125 transition-transform cursor-pointer' title='Bitbucket' />
                    <FaGitlab className='w-6 h-6 hover:scale-125 transition-transform cursor-pointer' title='GitLab' />
                    <VscAzureDevops className='w-6 h-6 hover:scale-125 transition-transform cursor-pointer' title='Azure DevOps' />
                  </div>
                </div>
              </a>
            </motion.div>
          </div>

        </div>
      </div>
      {/* scrolling bento */}

      <div>
        {/* horizontal scroll section: What You'll Unlock */}
        <div ref={productShowRef} className='relative z-10 h-[430vh] w-full bg-zinc-950 -mt-[15vh]'>

          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-[8vh] lg:pt-0">
            {/* Horizontal Scrolling Content */}
            <div className="relative flex-1 w-full flex items-center overflow-hidden pointer-events-none">
              <motion.div
                style={{
                  x: isMobile
                    ? useTransform(
                        PShowYProg,
                        // Mobile: 6 cards of 100vw each, title 100vw. Center card i → x = -(100vw + i*100vw)
                        [0, UNLOCK_STEP * 0.5, UNLOCK_STEP * 1.5, UNLOCK_STEP * 2.5, UNLOCK_STEP * 3.5, UNLOCK_STEP * 4.5, UNLOCK_STEP * 5.5, UNLOCK_END],
                        ["0vw", "-100vw", "-200vw", "-300vw", "-400vw", "-500vw", "-600vw", "-600vw"]
                      )
                    : useTransform(
                        PShowYProg,
                        // Desktop: title ~35vw, each card 550px + 4rem gap. Multi-breakpoint to center each card.
                        [0, UNLOCK_STEP * 0.5, UNLOCK_STEP * 1.5, UNLOCK_STEP * 2.5, UNLOCK_STEP * 3.5, UNLOCK_STEP * 4.5, UNLOCK_STEP * 5.5, UNLOCK_END],
                        ["0%", "-6%", "-19.5%", "-33%", "-46.5%", "-60%", "-73%", "-73%"]
                      ),
                  willChange: 'transform'
                }}
                className="flex items-center gap-0 lg:gap-[4rem] w-max pl-0 lg:pl-[10%] pr-0 lg:pr-[10%] pointer-events-auto lg:mt-0"
              >

                {/* Scrolling Title */}
                <div className="w-[100vw] lg:w-[35vw] flex flex-col justify-center items-center text-center lg:items-start lg:text-left shrink-0 px-8 lg:px-0">
                  <div className={`${montserrat.className} text-[clamp(2rem,10vw,3.5rem)] leading-[1.05] font-bold text-white`}>
                    What You'll
                    <div className="block">
                      <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Unlock</span>
                      <span className="lg:hidden"> with</span>
                    </div>
                    <div className="mt-1 lg:mt-2 text-[clamp(1.5rem,7vw,2.5rem)] font-semibold leading-tight whitespace-nowrap">
                      <span className="hidden lg:inline">with </span>
                      CodeMate AI
                    </div>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex gap-0 lg:gap-16">
                  {[
                    { id: "00", title: "Design Mode", desc: "Generate pixel-perfect UI components and layouts instantly. Transform your visual ideas into production-ready code without writing boilerplate.", media: "/design mode build.gif", isVideo: false },
                    { id: "01", title: "Figma to Code", desc: "Seamlessly connect your Figma designs directly to CodeMate Build and export fully functional, responsive code that perfectly matches your mockups.", media: "/build_figma_GIF.gif", isVideo: false },
                    { id: "02", title: "Custom AI Skills", desc: "Teach CORA specific tasks, coding standards, and architectural patterns tailored perfectly to your team's unique workflows.", media: "/skills_gif.gif", isVideo: false },
                    { id: "03", title: "Ship Autonomously with CORA", desc: "Delegate tasks to our smartest coding agent that knows your codebase", media: "https://drive.codemate.ai/CORA.mp4", isVideo: true },
                    { id: "04", title: "Automated PR Reviews", desc: "Integrated in your desired version control (GitHub, Bitbucket, GitLab, Azure DevOps) and automates your entire code reviews. Ship clean code to production up to 80% faster.", media: "https://drive.codemate.ai/PR_review.mp4", isVideo: true },
                    { id: "05", title: "Documentation", desc: "Acts as your AI coding partner by simplifying documentation and keeping it up-to-date, so you can focus on writing clean, impactful code.", media: "https://drive.codemate.ai/Documentation.mp4", isVideo: true },
                  ].map((item, i) => {
                    // Proximity-based effects: adjacent cards get softer treatment
                    const dist = unlockStep === -1 ? 0 : Math.abs(i - unlockStep);
                    const isActive = i === unlockStep;
                    const proximityOpacity = unlockStep === -1 ? 1 : isActive ? 1 : dist === 1 ? 0.5 : 0.2;
                    const proximityBlur = unlockStep === -1 ? 0 : isActive ? 0 : dist === 1 ? 1.5 : 3.5;
                    const proximityScale = unlockStep === -1 ? 1 : isActive ? 1.03 : dist === 1 ? 0.97 : 0.92;
                    const proximityY = unlockStep === -1 ? 0 : isActive ? -4 : dist === 1 ? 4 : 10;

                    return (
                      <div key={i} className="w-[100vw] lg:w-[550px] shrink-0 flex flex-col relative pt-4 px-8 lg:px-0 items-center">
                        <div
                          className="flex flex-col gap-6 transition-all duration-700 ease-in-out items-start text-left"
                          style={{
                            opacity: proximityOpacity,
                            filter: `blur(${proximityBlur}px)`,
                            transform: `scale(${proximityScale}) translateY(${proximityY}px)`,
                          }}
                        >
                          {/* Top Text */}
                          <div className="flex flex-col gap-2">
                            {/* <div className={`font-mono text-[15px] font-bold tracking-wider transition-all duration-700 ${isActive ? 'text-[#00BFFF] drop-shadow-[0_0_8px_rgba(0,191,255,0.6)]' : 'text-[#00BFFF]/60'}`}>[{item.id}]</div> */}
                            <h3 className={`${montserrat.className} text-[22px] lg:text-[26px] font-bold leading-snug transition-all duration-700 ${isActive ? 'text-white' : 'text-white/70'}`}>{item.title}</h3>
                          </div>

                          {/* Image/Video Box */}
                          <div
                            className={`h-[200px] sm:h-[250px] lg:h-[300px] w-full shrink-0 overflow-hidden rounded-xl bg-[#0a0a0a] relative flex items-center justify-center p-1 transition-all duration-700 ${isActive ? 'border border-[#00BFFF]/30 shadow-[0_0_40px_rgba(0,191,255,0.15),0_0_80px_rgba(0,191,255,0.05)]' : 'border border-white/[0.04] shadow-2xl'}`}
                          >
                            {/* Subtle radial glow behind active card media */}
                            {isActive && (
                              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(0,191,255,0.06)_0%,transparent_70%)] pointer-events-none" />
                            )}
                            {item.isVideo ? (
                              <video
                                ref={(el) => { unlockVideoRefs.current[i] = el }}
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-contain rounded-lg relative z-10"
                                src={item.media}
                              />
                            ) : (
                              <SmartGif
                                src={item.media}
                                alt={item.title}
                                className="w-full h-full object-contain rounded-lg relative z-10"
                                isActive={isActive}
                              />
                            )}
                          </div>

                          {/* Bottom Description */}
                          <div className="flex flex-col gap-4 px-2 items-start">
                            <p className={`text-[14px] lg:text-[16px] leading-relaxed transition-all duration-700 ${isActive ? 'text-[#d4d4d4]' : 'text-[#666]'}`}>{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Step Indicator Dots */}
            {unlockStep >= 0 && (
              <div className="absolute bottom-[14vh] lg:bottom-[12vh] left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
                {[0, 1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className="transition-all duration-500 rounded-full"
                    style={{
                      width: dot === unlockStep ? 28 : 8,
                      height: 8,
                      backgroundColor: dot === unlockStep ? '#00BFFF' : 'rgba(255,255,255,0.2)',
                      boxShadow: dot === unlockStep ? '0 0 12px rgba(0,191,255,0.5)' : 'none',
                    }}
                  />
                ))}
              </div>
            )}

            {/* From Web-Application Label (Mobile) */}
            <div className="lg:hidden w-full px-8 pt-10 pb-8 text-right pointer-events-none">
              <motion.div
                style={{
                  opacity: useTransform(PShowYProg, [0.72, 0.76], [0, 1]),
                  filter: useTransform(PShowYProg, [0.72, 0.76], ['blur(10px)', 'blur(0px)']),
                }}
                transition={{ duration: 0.6 }}
                className={`${montserrat.className} text-xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent pt-2 pb-2 w-full text-right pointer-events-auto`}>
                From <br /> <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-3xl'>Web-Application</span>
              </motion.div>
            </div>
          </div>

          {/* From Web-Application Label (Desktop) */}
          <div className='hidden lg:block sticky top-[88vh] z-40 pointer-events-none'>
            <motion.div
              style={{
                opacity: useTransform(PShowYProg, [0.72, 0.76], [0, 1]),
                filter: useTransform(PShowYProg, [0.72, 0.76], ['blur(10px)', 'blur(0px)']),
              }}
              transition={{ duration: 0.6 }}
              className={`${montserrat.className} text-xl lg:text-2xl pr-4 lg:pr-[6rem] font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent pt-2 pb-2 w-full text-right pointer-events-auto`}>
              From <br className='lg:hidden' /> <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-3xl lg:text-4xl'>Web-Application</span>
            </motion.div>
          </div>
        </div>

        {/* Seamlessly Integrated Section with Carousel */}
        <div className="relative w-full z-10 bg-black pt-10 pb-4 lg:pt-12 lg:pb-8">
          <div className="pb-2 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`${montserrat.className} text-[2.2rem] lg:text-[3rem] font-bold leading-[1.15]`}
            >
              <span className="bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent">Seamlessly </span>
              <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">Integrated</span>
              <br />
              <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent text-xl lg:text-3xl">in your existing environment</span>
            </motion.h2>
          </div>
          <SeamlessCarousel />
          <div className="mt-2 lg:mt-4 mb-2">
            <div className={`${montserrat.className} text-xl lg:text-2xl pl-6 lg:pl-[4rem] font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent w-full`}>
              To your <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-3xl lg:text-4xl'>IDE</span>
            </div>
          </div>
        </div>

      </div>

      {/* enterprises section  */}
      <div className=' w-full pt-16 px-8 lg:px-14 overflow-hidden'>
        <h1 className="text-3xl lg:text-[2rem] text-center lg:text-start font-bold">
          <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">For </span>
          <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
            Enterprises
          </span>
        </h1>
        <div className='mt-5 lg:mt-7 text-sm lg:text-[2.1vw] lg:text-6xl flex flex-col lg:gap-1 font-semibold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent pb-1 text-center lg:text-start'>
          <h1>From Legacy Systems to Next-Gen Apps -</h1>
          <h1>CodeMate AI Accelerates Your Enterprise Journey.</h1>
        </div>

        <div className='relative flex justify-center items-center mt-20 w-full'>
          <div
            style={{
              background: !isNBack ? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',
              boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 99999,
            }}
            className='lg:h-[35rem] lg:w-[70%] rounded-[4rem] px-8 border-y-[1px]  border-white border-opacity-50 flex flex-col gap-10 pb-5'>
            <div>
              <h1 className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-left text-9xl font-semibold mt-5">
                “
              </h1>
              <div className='text-[6vw] lg:text-[2.75rem] leading-[1.1] font-semibold'>
                Through the insights CodeMate provides, teams are inspired to achieve what truly matters <span className='opacity-60'>— building impactful solutions, shaping future growth, and delivering measurable value.</span>
              </div>
            </div>

            <div className=''>
              <h1 className='font-semibold'>Ayush Singhal</h1>
              <p className='opacity-50'>Founder of CodeMate AI</p>
            </div>
          </div>

          <motion.img initial={{ scale: 0.75, y: 20 }} src="gl.png" alt="" className="absolute hidden lg:flex  " />

          <motion.img initial={{ scale: 1.1, y: 150 }} src="gl.png" alt="" className="absolute lg:hidden  " />


        </div>


        <div className='text-2xl lg:text-5xl  flex flex-col gap-1 font-semibold mt-20 opacity-70'>
          <h1 >Solutions that scales</h1>
          <h1>your business</h1>
        </div>

        <div className='w-full flex flex-col lg:flex-row  justify-center items-center gap-5  lg:gap-[1.25] mt-10 '>
          <div className='relative min-h-[35vh] lg:min-h-0 lg:h-[19rem] lg:w-[30vw] rounded-2xl flex flex-col items-start gap-6  border-x-[1px] border-y-[0.5px] border-white border-opacity-20 px-7 lg:px-3 py-5'
            style={{
              background: !isNBack ? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',
              boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 99999,
            }}
          >
            <motion.img initial={{ scale: 1.2 }} src="1st icon (3).svg" alt="" className="object-fit brightness-90 size-[20%]" />
            <h1 className='text-left text-2xl lg:text-3xl font-semibold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'>Long-term code memory that learns from your legacy systems.</h1>
            {/* <p className='text-xs lg:text-sm opacity-50'>
    Codemate helps you streamline and synchronize your codebase across knowledge bases, ensuring consistency, reducing redundancy, and enabling your team to focus on innovation and faster delivery.
  </p> */}
          </div>

          <div className='flex flex-col gap-5 lg:flex-row lg:gap-[1.25]'>
            <div className='relative min-h-[35vh] lg:min-h-0 lg:h-[19rem] lg:w-[30vw] rounded-2xl flex flex-col items-start gap-6   border-x-[1px] border-y-[0.5px] border-white border-opacity-20 px-7 lg:px-3 py-5'
              style={{
                background: !isNBack ? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',
                boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                zIndex: 99999,
              }}
            >
              <motion.img initial={{ scale: 1 }} src="icon2.svg" alt="" className="object-fit brightness-90 size-[25%]" />
              <h1 className=' text-left text-2xl lg:text-3xl font-semibold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'>Hybrid, on-device architecture — secure, scalable, and cost-efficient.</h1>
              {/* <p className='text-xs lg:text-sm opacity-50'>
Run it seamlessly in your environment with Codemate, ensuring smooth integration with your existing workflows. Codemate adapts to your setup, minimizing disruption while maximizing efficiency, so your team can maintain focus on delivering quality code without added complexity.
  </p> */}
            </div>
            <div className='relative min-h-[35vh] lg:min-h-0 lg:h-[19rem] lg:w-[30vw] rounded-2xl flex flex-col items-start border-x-[1px] border-y-[0.5px]   border-white border-opacity-20 gap-6 px-7 lg:px-3 py-5'
              style={{
                background: !isNBack ? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',
                boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                zIndex: 99999,
              }}
            >
              <motion.img initial={{ scale: 1 }} src="e3.svg" alt="" className="object-fit brightness-90 size-[25%]" />
              <h1 className=' text-left text-2xl lg:text-3xl font-semibold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'>AI coding made accessible for both developers and non-developers.</h1>
              {/* <p className='text-xs lg:text-sm opacity-50'>
Codemate’s full-stack nature bridges the gap between developers and non-developers, enabling seamless collaboration, simplifying workflows, and boosting productivity across projects.
  </p> */}
            </div>
          </div>
        </div>

        <div className=' lg:text-2xl  flex flex-col justify-center items-center w-full gap-1 font-semibold mt-10 opacity-70'>
          {/* <h1>Explore more reasons for your business</h1>
  <h1>to invest in Codemate tools</h1> */}
          <a href="https://calendar.app.google/Gyyh913R8hyczmBFA" target="_blank" >
            <motion.button
              whileHover={{ opacity: 0.7 }}
              className='px-4 py-2  bg-[#FFFFFF] text-black  rounded-full    mt-2 font-semibold'>Book a Call</motion.button>
          </a>
        </div>

      </div>
      {/* enterprises section */}



      {/* trusted by section */}
      <div className={`${montserrat.className} lg:pb-16 pb-8 w-full bg-zinc-950 text-white z-50`}>
        <div className='pt-[5rem] lg:pt-[15rem]'>
          <div className="px-8 lg:px-16 ">
            <h1 className=' text-3xl lg:text-7xl font-bold pb-1 leading-[1.1] bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent text-center lg:text-start'><span className="bg-gradient-to-b  from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-center">Trusted </span> by <Counter
              className='text-3xl lg:text-7xl bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'
              direction="up"
              targetValue={100000} />+</h1>
            <p className=' mt-2  lg:text-2xl opacity-60 text-center lg:text-start'><span className=''>Developers across the globe and </span> from startups to Fortune 500 companies</p>
          </div>



          <div className='flex flex-col w-full lg:flex-row gap-10 justify-center items-center lg:gap-32 mt-10 lg:mt-16 pt-10'>
            <div className=' w-full lg:w-[50vw] xl:size-[13rem]'>
              <h1 className="text-6xl lg:text-8xl text-center w-full font-semibold opacity-70"><Counter
                className='text-6xl lg:text-8xl'
                direction="up"
                targetValue={55} />%</h1>
              <p className='text-lg lg:text-xl opacity-70 mt-3 text-center'>Faster coding</p>
            </div>
            <div className=' w-full lg:w-[50vw] xl:size-[13rem]'>

              <h1 className="text-6xl lg:text-8xl text-center w-full font-semibold opacity-70"><Counter
                className='text-6xl lg:text-8xl'
                direction="up"
                targetValue={39} />%</h1>
              <p className='text-lg lg:text-xl opacity-70 mt-3 text-center'>Improvement in code quality</p>
            </div>
            <div className=' w-full lg:w-[50vw] xl:size-[13rem]'>

              <h1 className="text-6xl lg:text-8xl text-center w-full font-semibold opacity-70"><Counter
                className='text-6xl lg:text-8xl'
                direction="up"
                targetValue={68} />%</h1>
              <p className='text-lg lg:text-xl opacity-70 mt-3 text-center'>Had a positive experience</p>
            </div>
          </div>

          <div className='relative flex justify-center items-center overflow-hidden'>

            <div className="absolute -left-10 top-0 bg-zinc-950 h-full w-[10%] blur-2xl z-50" />
            <div className="absolute -right-10 top-0 bg-zinc-950 h-full w-[10%] blur-2xl z-50" />

            <Marquee pauseOnHover className="[--duration:20s] flex justify-center items-center mt-5">
              <img src='dell.svg' className='object-fit  size-[30vw] lg:size-[12vw] opacity-100 brightness-150 lg:mt-0' />
              <img src='qual.svg' className='object-fit w-[65vw] lg:w-[20vw] mb-[2vw] opacity-100 brightness-150 lg:mt-9' />
              <img src='paytm.svg' className='object-fit w-[40vw] lg:w-[18vw] opacity-100 brightness-150' />
              <img src='amazon.svg' className='object-fit w-[40vw] lg:w-[18vw] opacity-100 brightness-150 mt-5 lg:mt-10' />
              <img src='fampay.svg' className='object-fit w-[45vw] lg:w-[20vw] opacity-100 brightness-150' />
              <img src='inno.svg' className='object-fit w-[50vw] lg:w-[20vw] opacity-100 brightness-150' />
              <img src='atl.svg' className='object-fit w-[50vw] lg:w-[20vw] opacity-100 brightness-150' />
            </Marquee>
          </div>

          {/* <div className='flex flex-col justify-center items-center w-full'>
      <div className='flex lg:gap-10 justify-center items-center mt-4'>
       <img src='paytm.svg' className='object-fit w-[30vw] lg:w-[25vw]'/>
       <img src='amazon.svg' className='object-fit w-[30vw] lg:w-[25vw]'/>
       <img src='fampay.svg' className='object-fit w-[30vw] lg:w-[25vw]'/>
      </div>
      <div className='flex gap-4'>
        <img src='inno.svg' className='object-fit w-[35vw] lg:w-[25vw]]'/>
        <img src='atl.svg' className='object-fit w-[35vw] lg:w-[25vw]'/>
      </div>
     </div> */}

        </div>



      </div>
      {/* trusted by section */}


      {/* bento */}
      {/* <div className=' relative h-[170vh] w-full bg-zinc-950 text-white overflow-hidden'>
   <div className={`${montserrat.className}  text-8xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent pl-10 mb-6 pt-20 text-center pb-1`}>What<span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'> else</span> we got?</div>
   
  <MagicBento 
  textAutoHide={true}
  enableStars={true}
  enableSpotlight={true}
  enableBorderGlow={true}
  enableTilt={false}
  enableMagnetism={true}
  clickEffect={true}
  spotlightRadius={400}
  particleCount={12}
  glowColor="0, 191, 255"
/>

  </div>  */}
      {/* bento   */}

      {/* ========================================== */}
      {/* UI SECTION: ACHIEVEMENTS & STATISTICS    */}
      {/* ========================================== */}
      <Achivements />
      {/* ========================================== */}
      {/* UI SECTION: MEDIA PRESENCE (AS SEEN ON)  */}
      {/* ========================================== */}
      <MediaPresence />


      <div className={`${montserrat.className} leading-[1] text-[10vw]  lg:text-6xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent lg:pl-10 pt-8 text-center`}>Do not listen to us but from <span className='bg-gradient-to-b  from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>People</span></div>

      {/* ========================================== */}
      {/* UI SECTION: TESTIMONIALS & REVIEWS       */}
      {/* Scrolling carousel of user feedback and trust markers */}
      {/* ========================================== */}
      <div ref={testiRef} className='relative h-[300vh] w-full bg-zinc-950 '>


        <div className=' sticky top-0   h-screen w-full overflow-x-hidden '>

          <div
            className='relative h-full w-full flex  items-center justify-center    py-3 overflow-hidden'>


            {/* <motion.div 
     style={{x:commentsX}}
     className={`${montserrat.className} absolute flex gap-10 text-7xl text-white font-semibold`}>
<h1 className="whitespace-nowrap text-opacity-80">thrilled 🤩</h1>
<h1 className="whitespace-nowrap text-opacity-80">grateful 🙏</h1>
<h1 className="whitespace-nowrap text-opacity-80">inspired ✨</h1>
<h1 className="whitespace-nowrap text-opacity-80">amazed 🤯</h1>
<h1 className="whitespace-nowrap text-opacity-80">relieved 😌</h1>
<h1 className="whitespace-nowrap text-opacity-80">blessed 🥰</h1>
<h1 className="whitespace-nowrap text-opacity-80">accomplished 🏆</h1>
<h1 className="whitespace-nowrap text-opacity-80">delighted 😊</h1>
<h1 className="whitespace-nowrap text-opacity-80">empowered 💪</h1>
<h1 className="whitespace-nowrap text-opacity-80">fulfilled ❤️</h1>
     </motion.div> */}


            <img src="/codemateLogo.svg" className='absolute object-fit w-[95vw] brightness-[0.6]' alt="" />



            <div className={`${montserrat.className} text-white h-full w-full flex items-center justify-center flex-col`}>
              <motion.div className='absolute  h-[30rem] w-[40rem]  rounded-3xl'></motion.div>


              <motion.div
                style={{ y: tdiv1X }}
                className='absolute h-[25rem] w-[90vw] lg:h-[30rem] lg:w-[40rem]  rounded-3xl flex justify-center items-center'>
                <motion.div
                  animate={{ rotate: 10 }}
                  className='h-auto min-h-[70%] w-[92%] lg:w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-center px-5 lg:px-8 py-5 gap-5'>
                  <div className='flex w-full gap-4 items-center'>
                    <div className='rounded-full bg-white size-20'><img src="https://drive.codemate.ai/ayushbansal.jpeg" alt="" className='size-20 rounded-full' /></div>
                    <div className='flex flex-col'>
                      <h1 className='font-semibold text-2xl'>Ayush Bansal</h1>
                      <p className='opacity-60 text-sm lg:text-md'>Software Engineer-II, Amazon</p>
                    </div>
                  </div>

                  <div className='leading-[1.1] text-[3.7vw] lg:text-2xl'><span className='text-[#00BFFF]'>CodeMate.ai</span> has revolutionized my coding workflow with accurate AI suggestions and a user-friendly interface. Highly recommended!</div>

                  <div className='w-full flex justify-between'>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                style={{ y: tdiv2X }}
                className='absolute h-[25rem] w-[90vw] lg:h-[30rem] lg:w-[40rem]  rounded-3xl flex justify-center items-center'>
                <motion.div
                  animate={{ rotate: 5 }}
                  className='h-auto min-h-[70%] w-[92%] lg:w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-center px-5 lg:px-8 py-5 gap-5'>
                  <div className='flex w-full gap-4 items-center'>
                    <div className='rounded-full bg-white size-20'><img src="https://drive.codemate.ai/hani.webp" alt="" className='size-20 rounded-full' /></div>
                    <div className='flex flex-col'>
                      <h1 className='font-semibold text-2xl'>Hani H.</h1>
                      <p className='opacity-60'>Founder</p>
                    </div>
                  </div>

                  <div className='leading-[1.1] text-[3.3vw] lg:text-2xl'><span className='text-[#00BFFF]'>CodeMate</span> has lots of great features. You can request code samples when stuck, or get a code review to spot issues you might miss. The Debugger is a life saver—it quickly found a bug in my code that was filling the error logs!</div>

                  <div className='w-full flex justify-between'>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div style={{ y: tdiv3X }} className='absolute h-[25rem] w-[90vw] lg:h-[30rem] lg:w-[40rem] rounded-3xl flex justify-center items-center'>
                <motion.div
                  animate={{ rotate: 0 }}
                  className='h-auto min-h-[70%] w-[92%] lg:w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-center px-5 lg:px-8 py-5 gap-5'>
                  <div className='flex w-full gap-4 items-center'>
                    <div className='rounded-full bg-white size-20'><img src="https://drive.codemate.ai/vilkho_appsumo.webp" alt="" className='size-20 rounded-full' /></div>
                    <div className='flex flex-col w-[50%]'>
                      <h1 className='font-semibold text-xl lg:text-2xl'>Vilkhovskiy</h1>
                      <p className='opacity-60 text-sm lg:text-md '>Chief Executive Officer, Softenq</p>
                    </div>
                  </div>

                  <div className='leading-[1.1] text-[3.3vw] lg:text-2xl'>An excellent solution for project analysis and efficient development! I love how <span className='text-[#00BFFF]'>CodeMate</span> can analyze an entire project, assign tasks for refactoring or code generation, and even ensure the project is covered with tests.</div>

                  <div className='w-full flex justify-between'>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div style={{ y: tdiv4X }} className='absolute h-[25rem] w-[90vw] lg:h-[30rem] lg:w-[40rem] rounded-3xl flex justify-center items-center'>
                <motion.div
                  animate={{ rotate: -5 }}
                  className='h-auto min-h-[70%] w-[92%] lg:w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-center px-5 lg:px-8 py-5 gap-5'>
                  <div className='flex w-full gap-4 items-center'>
                    <div className='rounded-full bg-white size-20'><img src="https://i.pravatar.cc/150?u=kitty.liu" alt="" className='size-20 rounded-full' /></div>
                    <div className='flex flex-col'>
                      <h1 className='font-semibold text-2xl'>Kitty Liu</h1>
                      <p className='opacity-60'>Engineering</p>
                    </div>
                  </div>

                  <div className='leading-[1.1] text-[4vw] lg:text-2xl'><span className='text-[#00BFFF]'>CodeMate</span> is doing a great job with its simplicity. I can't wait to see more features they are going to release soon.</div>

                  <div className='w-full flex justify-between'>
                  </div>
                </motion.div>
              </motion.div>
              <motion.div style={{ y: tdiv5X }} className='absolute h-[25rem] w-[90vw] lg:h-[30rem] lg:w-[40rem] rounded-3xl flex justify-center items-center'>
                <motion.div
                  animate={{ rotate: -10 }}
                  className='h-auto min-h-[70%] w-[92%] lg:w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-center px-5 lg:px-8 py-5 gap-5'>
                  <div className='flex w-full gap-4 items-center'>
                    <div className='rounded-full bg-white size-20'><img src="https://i.pravatar.cc/150?u=david.kim" alt="" className='size-20 rounded-full' /></div>
                    <div className='flex flex-col'>
                      <h1 className='font-semibold text-2xl'>Keith Price</h1>
                      <p className='opacity-60'>Backend Engineer</p>
                    </div>
                  </div>

                  <div className='leading-[1.1] text-[3.1vw] lg:text-2xl'>Love this tool! It can train on the entire solution (and others), saving so much time and frustration. <span className='text-[#00BFFF]'>Unlike ChatGPT</span>, it finds the right methods and code blocks with ease, and the ability to retain training on past solutions is phenomenal.</div>

                  <div className='w-full flex justify-between'>
                  </div>
                </motion.div>
              </motion.div>
              {/* <motion.div style={{y:tdiv6X}} className='absolute  h-[30rem] w-[40rem]  rounded-3xl flex justify-center items-center'>
                        <motion.div 
      animate={{rotate:-15}}
      className='h-[70%] w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-cente px-8 py-5 gap-5'>
       <div className='flex w-full gap-4 items-center'>
       <div className='rounded-full bg-white size-20'></div>
      <div className='flex flex-col'>
       <h1>Ayush Bansal</h1>
        <p>Software Engineer-II, Amazon</p> 
      </div>
       </div>

       <div className='text-2xl'>CodeMate.ai has revolutionized my coding workflow with accurate AI suggestions and a user-friendly interface. Highly recommended!</div>

       <div className='w-full flex justify-between'>
       </div>
      </motion.div>
     </motion.div> */}
            </div>
          </div>

        </div>
      </div>

      <div ref={footerRef}>
        {/* ========================================== */}
        {/* UI SECTION: PAGE FOOTER                  */}
        {/* ========================================== */}
        <Footer />
      </div>
    </div>


  )
}

export default Page



// function Product2({productRef2}:{productRef2:React.RefObject<HTMLDivElement>}){

//   const feature2Ref = useRef<HTMLDivElement>(null);
//   const {scrollYProgress:p2YProg} = useScroll({
//       target:productRef2,
//       offset:['start end','end start']
//     });
//   const drawerX = useTransform(p2YProg,[0.4,1],[0,-1500]);
//   return(
//     <>
//     <motion.div
//      initial={{opacity:0,filter:'blur(50px)'}}
//      whileInView={{opacity:1,filter:'blur(0px)'}}



// function Product2({productRef2}:{productRef2:React.RefObject<HTMLDivElement>}){

//   const feature2Ref = useRef<HTMLDivElement>(null);
//   const {scrollYProgress:p2YProg} = useScroll({
//       target:productRef2,
//       offset:['start end','end start']
//     });
//   const drawerX = useTransform(p2YProg,[0.4,1],[0,-1500]);
//   return(
//     <>
//     <motion.div
//      initial={{opacity:0,filter:'blur(50px)'}}
//      whileInView={{opacity:1,filter:'blur(0px)'}}


