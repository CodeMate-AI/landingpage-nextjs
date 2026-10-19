'use client';

import React, { useRef } from 'react';
import { Montserrat } from 'next/font/google';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import VideoEmbed from '@/components/video';
import { WATCH_ACTION_DATA } from '@/data/landingData';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function WatchActionSection() {
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  // Play video only when user approaches/enters section; pause when scrolled away
  const isInView = useInView(videoWrapperRef, {
    margin: '150px 0px 150px 0px',
  });

  // Track scroll progress of the video element itself from viewport entry to center
  const { scrollYProgress } = useScroll({
    target: videoWrapperRef,
    offset: ['start end', 'center center'],
  });

  // Physics-based spring for organic and smooth expansion across any scroll speed
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // Smooth expansion: starts as a compact small box (0.65) and expands to full size (1.0)
  const scale = useTransform(smoothProgress, [0, 1], [0.65, 1]);
  // Border radius smoothly morphs from compact rounded box (28px) to crisp frame (14px)
  const borderRadius = useTransform(smoothProgress, [0, 1], [28, 14]);
  // Ambient cyan-blue glow dynamically blooms with container expansion
  const glowOpacity = useTransform(smoothProgress, [0, 1], [0.15, 0.65]);
  const glowScale = useTransform(smoothProgress, [0, 1], [0.65, 1.05]);

  return (
    <section
      id="watch-action"
      aria-label="Watch CodeMate in Action"
      className={`${montserrat.className} relative w-full bg-[#000000] text-white flex flex-col items-center justify-center [box-sizing:border-box] pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 2xl:py-[110px] px-4 sm:px-8 2xl:px-[80px] gap-8 sm:gap-10 2xl:gap-[40px] overflow-hidden`}
    >
      {/* ========================================================================= */}
      {/* Title: Watch CodeMate in Action                                           */}
      {/* ========================================================================= */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[60px] font-semibold text-center tracking-tight max-w-[850px] z-10"
      >
        <span className="bg-gradient-to-b from-[#FFFFFF] to-[#B0B8C6] bg-clip-text text-transparent">
          {WATCH_ACTION_DATA.titlePrefix}
        </span>
        <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
          {WATCH_ACTION_DATA.titleHighlight}
        </span>
        <span className="bg-gradient-to-b from-[#FFFFFF] to-[#B0B8C6] bg-clip-text text-transparent">
          {WATCH_ACTION_DATA.titleSuffix}
        </span>
      </motion.h2>

      {/* ========================================================================= */}
      {/* Scroll-Driven Expanding Video Container                                   */}
      {/* ========================================================================= */}
      <div ref={videoWrapperRef} className="relative w-full flex items-center justify-center my-1 sm:my-2 2xl:my-0">
        {/* Subtle ambient cyan/blue back-glow expanding organically with the box */}
        <motion.div
          style={{ scale: glowScale, opacity: glowOpacity }}
          className="absolute -inset-4 sm:-inset-10 bg-[radial-gradient(ellipse_at_center,rgba(0,191,255,0.22),rgba(30,144,255,0.06),transparent_70%)] blur-2xl pointer-events-none"
        />

        {/* Video Player Card */}
        <motion.div
          style={{ scale, borderRadius }}
          className="relative w-full max-w-[880px] lg:max-w-[960px] aspect-video overflow-hidden border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] bg-zinc-950 will-change-transform transform-gpu z-10"
        >
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <VideoEmbed shouldPlay={isInView} />
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* Subtitle / Descriptive Copy                                               */}
      {/* ========================================================================= */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 0.7, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-white/70 text-sm sm:text-base lg:text-[16px] lg:leading-[26px] font-normal text-center max-w-[932px] px-4 leading-relaxed z-10"
      >
        {WATCH_ACTION_DATA.description}
      </motion.p>
    </section>
  );
}
