'use client'
import React, { useEffect, useState, useRef } from 'react'
import { ChevronRight } from 'lucide-react';
import { FaGithub, FaBitbucket, FaGitlab } from "react-icons/fa6";
import { VscAzureDevops } from "react-icons/vsc";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import Lenis from 'lenis'
import { Montserrat } from 'next/font/google';
import SeamlessCarousel from '@/components/SeamlessCarousel';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import Footer from '@/components/footer';
import VideoEmbed from '@/components/video';
import { Marquee } from '@/components/ui/marquee';
import Achivements from '@/components/achivements';
import EventOffer from './pricing/components/EventOffer';
import Navbar from '@/components/navbar';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

export default function Page() {
  const [lastScroll, setLastScroll] = useState(0);
  const [isArrowV, setIsArrowV] = useState(false);
  const [isArrow, setIsArrow] = useState(false);
  const [showEventPopup, setShowEventPopup] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: MYProg } = useScroll({
    target: mainRef,
    offset: ['start start', 'end start']
  });

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5 });
    let rafId: number;

    function raf(time: any) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useMotionValueEvent(MYProg, 'change', (latest) => {
    setIsArrowV(latest >= 0.05);
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

  const products = [
    {
      href: "http://build.codemate.ai/",
      img: "/Build Static.png",
      title: "CodeMate Build",
      desc: "Turns prompts and Figma designs into deployable apps instantly with full design mode support."
    },
    {
      href: "https://marketplace.visualstudio.com/items?itemName=CodeMateAI.codemate-agent",
      img: "/CORA Static.png",
      title: "CodeMate CORA",
      desc: "End-to-end AI coding agent for writing, securing, and quality-gating code directly in your IDE.",
      imgPosition: "object-left-top"
    },
    {
      href: "https://app.codemate.ai/chat",
      img: "/Co web Static.png",
      title: "CodeMate Work",
      desc: "Turns deep research and feasibility into production-ready code through AI-driven intelligence."
    },
    /*
    // CodeMate Work Extension - Preserved for future use
    {
      href: "https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate",
      img: "/Co extention Static.png",
      title: "CodeMate Work Extension",
      desc: "Your in-IDE AI partner for code management, debugging, and performance optimization."
    },
    */
    {
      href: "https://edu.codemate.ai/",
      img: "/Codemate Education Static.png",
      title: "CodeMate Academy",
      desc: "AI-powered classroom management built for educators and students to master modern development.",
      imgPosition: "object-left-top"
    },
    {
      href: "https://cli.codemate.ai/",
      img: "term.svg",
      title: "AI Terminal",
      desc: "Run code and scripts instantly through an AI-powered command-line interface."
    },
    {
      href: "https://github.com/apps/codemate-ai-pr-review-agent",
      img: "/Pr_review_agent_parth.png",
      title: "CodeMate PR Review Agent",
      desc: "Automates code reviews and security analysis across GitHub, GitLab, Bitbucket, and Azure DevOps.",
      showVcsIcons: true
    }
  ];

  const unlockFeatures = [
    {
      id: "01",
      title: "Design Mode",
      desc: "Generate pixel-perfect UI components and layouts instantly. Transform your visual ideas into production-ready code without writing boilerplate.",
      media: "/Design mode_static.png"
    },
    {
      id: "02",
      title: "Figma to Code",
      desc: "Seamlessly connect your Figma designs directly to CodeMate Build and export fully functional, responsive code that matches your mockups.",
      media: "/figma-to-code-static.png"
    },
    {
      id: "03",
      title: "Custom AI Skills",
      desc: "Teach CORA specific tasks, coding standards, and architectural patterns tailored to your team's unique workflows.",
      media: "/skill-static.png",
      imgPosition: "object-left-top"
    },
    {
      id: "04",
      title: "Ship Autonomously with CORA",
      desc: "Delegate tasks to our smartest coding agent that understands your codebase from architecture to edge cases.",
      media: "/cora-autonomous.png",
      imgPosition: "object-left-top"
    },
    {
      id: "05",
      title: "Automated PR Reviews",
      desc: "Integrated in your version control (GitHub, Bitbucket, GitLab, Azure DevOps) to automate code reviews and ship clean code up to 80% faster.",
      media: "/Pr_review_agent_parth.png"
    },
    {
      id: "06",
      title: "Documentation",
      desc: "Acts as your AI coding partner by simplifying documentation and keeping it up-to-date, so you can focus on writing impactful code.",
      media: "/documentation-static.png",
      imgPosition: "object-left-top"
    }
  ];

  return (
    <div
      style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="22" height="22"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto` }}
      ref={mainRef}
      className={`${montserrat.className} bg-zinc-950 text-white min-h-screen pt-[92px] sm:pt-[96px] lg:pt-[88px]`}
    >
      {/* ========================================================================= */}
      {/* SECTION 0: SCROLL CONTROL UTILITIES                                        */}
      {/* Floating control for jumping to the top or bottom of the landing page     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isArrowV && (
          <motion.div
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-7 right-7 z-[9999999999]"
          >
            <motion.button
              onClick={handleArrow}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.1 }}
              aria-label="Scroll page"
              className="hidden lg:flex cursor-pointer justify-center items-center size-10 rounded-full bg-[#EDEADE]/90 text-black shadow-lg"
            >
              <motion.svg
                animate={{ rotate: isArrow ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                xmlns="http://www.w3.org/2000/svg"
                width={26}
                height={26}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 5l0 14" />
                <path d="M16 9l-4 -4" />
                <path d="M8 9l4 -4" />
              </motion.svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />

      <EventOffer
        isOpen={showEventPopup}
        onClose={() => setShowEventPopup(false)}
        badgeText="Special Offer"
        offerText="Flat 77% OFF"
        discountLabel="50% OFF"
        imageSrc="https://backend.codemate.ai/uploaded/images/68c433e9-aa31-4bfe-9127-62ae403e018e"
      />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO & PRIMARY ACTION AREA                                     */}
      {/* Background animation canvas, headline, badge, and CTA action buttons      */}
      {/* ========================================================================= */}
      <div className='h-auto lg:h-screen lg:max-h-[860px] lg:min-h-[640px] w-full overflow-x-hidden relative'>
        <BackgroundGradientAnimation
          className='w-full overflow-hidden'
          interactive={true}
          gradientBackgroundStart='rgb(9, 9, 11)'
          gradientBackgroundEnd='rgb(9, 9, 11)'
          firstColor='0, 255, 255'
          secondColor='30, 144, 255'
          thirdColor='0, 255, 255'
          fourthColor='255, 255, 255'
          pointerColor='30, 144, 255'
          size='100%'
        >
          <div
            style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="26" height="26"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto` }}
            className='relative h-auto lg:h-screen lg:max-h-[860px] lg:min-h-[640px] w-full z-50 overflow-hidden cursor-default flex flex-col justify-start pt-20 lg:pt-[8vh] pb-8 lg:pb-16'
          >
            <motion.div
              style={{ cursor: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="32" height="32"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto` }}
              className='absolute inset-0 opacity-5 z-0'
            >
              <img src="/bgNoise.png" className='w-full h-full object-cover' alt="" aria-hidden="true" />
            </motion.div>

            <div className='relative z-50 w-full px-6 sm:px-8 lg:px-0 lg:pl-[calc(3.3vw+3rem)] lg:pr-12 flex flex-col items-start'>
              <h1 className='text-[clamp(2.5rem,11vw,4.5rem)] lg:text-[clamp(5rem,8vw,8rem)] leading-[1.05] font-semibold flex flex-col z-50 xxlHerotext text-left mt-3 sm:mt-6'>
                <span className='xxlHero z-50 block'>
                  <span className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]'>
                    India’s First AI
                  </span>
                </span>
                <span className='flex flex-wrap justify-start gap-x-4 pb-3'>
                  <span className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]'>
                    SDLC
                  </span>{' '}
                  <span className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text text-transparent inline-block pb-[0.2em] -mb-[0.2em]'>
                    Agent
                  </span>
                </span>
              </h1>

              <div className="flex flex-col font-normal text-sm sm:text-base md:text-lg lg:text-xl gap-1 leading-relaxed mt-4 lg:mt-6 opacity-70 text-left max-w-2xl">
                <p>Build and ship 20x faster with CodeMate AI</p>
                <p>Your all-in-one accelerator to turn your ideas into code</p>
              </div>

              {/* SOTA Announcement Badge */}
              <div className="w-full flex justify-start mt-4 sm:mt-6 z-[100]">
                <a
                  href="/blog/cora-sota-swe-bench"
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
              </div>

              <div className="flex flex-col sm:flex-row justify-start items-center gap-3 sm:gap-4 text-sm md:text-base mt-6 sm:mt-8 w-full sm:w-auto">
                <a href="/download" aria-label="Download CodeMate AI's ToolBox" className="w-full sm:w-auto">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-12 sm:h-12 px-7 sm:px-8 w-full sm:w-auto flex items-center justify-center bg-black text-white rounded-md font-semibold border border-white/20 hover:border-white/40 transition-colors whitespace-nowrap"
                  >
                    Download
                  </motion.button>
                </a>
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
              </div>
            </div>
          </div>
        </BackgroundGradientAnimation>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: PRODUCT SUITE SHOWCASE                                         */}
      {/* Grid of live CodeMate products with edge-to-edge mockup previews          */}
      {/* ========================================================================= */}
      <section className="w-full bg-zinc-950 pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-neutral-400 text-center">
            Introducing CodeMate AI
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
            Your{' '}
            <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
              Full-Stack
            </span>{' '}
            AI Engineer
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 text-center max-w-2xl leading-relaxed">
            From developers to non-developers, an autonomous teammate that assists you in shipping code with AI.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 w-full mt-12 sm:mt-16">
            {products.map((product, i) => (
              <a
                key={i}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between bg-[#0c0c0e] border border-white/10 hover:border-white/25 rounded-2xl p-4 sm:p-6 transition-colors duration-200"
              >
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-900/60 border border-white/10 mb-5 flex items-center justify-center">
                  <img
                    src={product.img}
                    alt={product.title}
                    className={`w-full h-full object-cover ${product.imgPosition || 'object-top'}`}
                  />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-400 mt-2 leading-relaxed">
                    {product.desc}
                  </p>
                  {product.showVcsIcons && (
                    <div className="flex items-center gap-5 mt-4 text-neutral-400 group-hover:text-white transition-colors">
                      <FaGithub className="w-5 h-5 hover:scale-125 transition-transform" title="GitHub" />
                      <FaBitbucket className="w-5 h-5 hover:scale-125 transition-transform" title="Bitbucket" />
                      <FaGitlab className="w-5 h-5 hover:scale-125 transition-transform" title="GitLab" />
                      <VscAzureDevops className="w-5 h-5 hover:scale-125 transition-transform" title="Azure DevOps" />
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: SOCIAL PROOF & PARTNER LOGOS                                   */}
      {/* Infinite marquee displaying trusted developer and enterprise brand logos  */}
      {/* ========================================================================= */}
      <section className="w-full bg-zinc-950 pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold pb-1 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
              Trusted{' '}
            </span>
            by 1,000,000+
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 max-w-xl mx-auto">
            Developers across the globe and from startups to Fortune 500 companies
          </p>
        </div>

        <div className="relative flex justify-center items-center overflow-hidden mt-10 sm:mt-12">
          <div className="absolute -left-6 top-0 bg-zinc-950 h-full w-24 sm:w-36 blur-2xl z-10 pointer-events-none" />
          <div className="absolute -right-6 top-0 bg-zinc-950 h-full w-24 sm:w-36 blur-2xl z-10 pointer-events-none" />

          <Marquee pauseOnHover className="[--duration:24s] flex justify-center items-center py-6">
            <img src="maruti-suzuki.svg" className="object-contain w-[48vw] sm:w-[26vw] lg:w-[18vw] mx-6 sm:mx-10 opacity-100 brightness-150" alt="Maruti Suzuki" />
            <img src="atl.svg" className="object-contain w-[40vw] sm:w-[22vw] lg:w-[15vw] mx-6 sm:mx-10 opacity-100 brightness-150" alt="Atlassian" />
            <img src="dell.svg" className="object-contain w-[26vw] sm:w-[16vw] lg:w-[10vw] mx-6 sm:mx-10 opacity-100 brightness-150" alt="Dell" />
            <img src="qual.svg" className="object-contain w-[48vw] sm:w-[26vw] lg:w-[17vw] mx-6 sm:mx-10 opacity-100 brightness-150" alt="Qualcomm" />
            <img src="paytm.svg" className="object-contain w-[34vw] sm:w-[20vw] lg:w-[14vw] mx-6 sm:mx-10 opacity-100 brightness-150" alt="Paytm" />
            <img src="amazon.svg" className="object-contain w-[34vw] sm:w-[20vw] lg:w-[14vw] mx-6 sm:mx-10 opacity-100 brightness-150" alt="Amazon" />
            <img src="fampay.svg" className="object-contain w-[38vw] sm:w-[22vw] lg:w-[15vw] mx-6 sm:mx-10 opacity-100 brightness-150" alt="FamPay" />
            <img src="inno.svg" className="object-contain w-[40vw] sm:w-[22vw] lg:w-[15vw] mx-6 sm:mx-10 opacity-100 brightness-150" alt="Inno" />
          </Marquee>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: PLATFORM CAPABILITIES (WHAT YOU’LL UNLOCK)                     */}
      {/* Sticky feature index on the left with interactive capability card grid    */}
      {/* ========================================================================= */}
      <section id="features" className="w-full bg-zinc-950 py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <div className="w-full lg:w-1/3 lg:sticky lg:top-32 lg:self-start">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              What You’ll{' '}
              <span className="block bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
                Unlock
              </span>
              with CodeMate AI
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-400 leading-relaxed">
              Explore the capabilities that transform your modern development workflow, from rapid prototyping to automated enterprise reviews.
            </p>
          </div>

          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {unlockFeatures.map((item, i) => (
              <div
                key={i}
                className="group flex flex-col justify-between bg-[#0c0c0e] border border-white/10 hover:border-white/25 rounded-2xl p-5 sm:p-6 transition-colors duration-200"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-neutral-900/60 border border-white/10 flex items-center justify-center mb-4">
                    <img
                      src={item.media}
                      alt={item.title}
                      className={`w-full h-full object-cover ${item.imgPosition || 'object-top'}`}
                    />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5 & 6: PERFORMANCE METRICS & SHOWCASE VIDEO                       */}
      {/* Continuous showcase combining 3 impact metrics and embedded video box     */}
      {/* ========================================================================= */}
      <section className="w-full bg-zinc-950 pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Metrics Row */}
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-around items-center md:items-start gap-8 md:gap-10 lg:gap-14 text-center">
            <div className="flex flex-col items-center gap-2 sm:gap-3 w-full sm:w-[200px] lg:w-[240px] text-center">
              <div className="h-auto lg:h-[72px] flex items-center justify-center">
                <span className="font-bold text-5xl sm:text-6xl lg:text-7xl lg:leading-tight text-[#FAFAFA] opacity-80 tracking-tight">
                  55%
                </span>
              </div>
              <p className="text-sm sm:text-base text-neutral-300 font-normal">
                Faster coding
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 sm:gap-3 w-full sm:w-[200px] lg:w-[240px] text-center">
              <div className="h-auto lg:h-[72px] flex items-center justify-center">
                <span className="font-bold text-5xl sm:text-6xl lg:text-7xl lg:leading-tight text-[#FAFAFA] opacity-80 tracking-tight">
                  39%
                </span>
              </div>
              <p className="text-sm sm:text-base text-neutral-300 font-normal">
                Improvement in code quality
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 sm:gap-3 w-full sm:w-[200px] lg:w-[240px] text-center">
              <div className="h-auto lg:h-[72px] flex items-center justify-center">
                <span className="font-bold text-5xl sm:text-6xl lg:text-7xl lg:leading-tight text-[#FAFAFA] opacity-80 tracking-tight">
                  68%
                </span>
              </div>
              <p className="text-sm sm:text-base text-neutral-300 font-normal">
                Had a positive experience
              </p>
            </div>
          </div>

          {/* Product Video Showcase */}
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center mt-14 sm:mt-16 lg:mt-20">
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl">
              <VideoEmbed />
            </div>
            <p className="text-center text-sm sm:text-base md:text-lg text-neutral-400 mt-6 max-w-2xl leading-relaxed">
              From developers to non-developers, it acts like your autonomous teammate that assists you in shipping code with AI.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: IDE & WORKFLOW SEAMLESS INTEGRATION                            */}
      {/* Interactive IDE environment carousel showcasing autocompletion & reviews  */}
      {/* ========================================================================= */}
      <section className="w-full bg-black pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Seamlessly{' '}
            </span>
            <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
              Integrated
            </span>
            <br />
            <span className="text-xl sm:text-2xl lg:text-3xl text-neutral-400 font-semibold mt-1 block">
              in your existing environment
            </span>
          </h2>
        </div>

        <SeamlessCarousel />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: MILESTONES & GLOBAL RECOGNITION (TALK OF THE TOWN)             */}
      {/* Global media coverage, summits, and partnership achievement cards         */}
      {/* ========================================================================= */}
      <section className="w-full bg-zinc-950 pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <Achivements />
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: FOOTER & SOCIAL CONNECTIVITY                                   */}
      {/* Navigation links, community channels, and AI evaluation prompt links      */}
      {/* ========================================================================= */}
      <div>
        <Footer />
      </div>
    </div>
  );
}
