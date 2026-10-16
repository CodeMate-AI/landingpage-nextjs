'use client';

import React from 'react';
import { Montserrat } from 'next/font/google';
import { motion } from 'framer-motion';
import VideoEmbed from '@/components/video';
import { WATCH_ACTION_DATA } from '@/data/landingData';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function WatchActionSection() {
  return (
    <section
      id="watch-action"
      aria-label="Watch CodeMate in Action"
      className={`${montserrat.className} relative w-full bg-[#000000] text-white flex flex-col items-center justify-center pt-8 sm:pt-10 lg:pt-12 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-8 lg:px-[80px] gap-8 sm:gap-10`}
    >
      {/* ========================================================================= */}
      {/* Title: Watch CodeMate in Action                                           */}
      {/* ========================================================================= */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[60px] font-semibold text-center tracking-tight max-w-[850px]"
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
      {/* Medium Video Player Container (Pure Embed: Autoplay, Muted, No Controls)  */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-[880px] lg:max-w-[960px] aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-zinc-950"
      >
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <VideoEmbed />
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* Subtitle / Descriptive Copy                                               */}
      {/* ========================================================================= */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 0.7, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-white/70 text-sm sm:text-base lg:text-[16px] lg:leading-[26px] font-normal text-center max-w-[932px] px-4 leading-relaxed"
      >
        {WATCH_ACTION_DATA.description}
      </motion.p>
    </section>
  );
}
