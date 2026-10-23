'use client';

import React from 'react';
import { Montserrat, Inter } from 'next/font/google';
import { motion } from 'framer-motion';
import { ENTERPRISE_ARCHITECTURE_DATA } from '@/data/landingData';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function EnterpriseArchitectureSection() {
  return (
    <section
      aria-label="Enterprise Architecture and Acceleration Showcase"
      className={`${montserrat.className} relative w-full bg-[#000000] text-white flex flex-col items-center [box-sizing:border-box] overflow-hidden pt-10 sm:pt-14 lg:pt-20 2xl:pt-[140px] pb-10 sm:pb-14 lg:pb-20 2xl:pb-[140px] px-4 sm:px-6 lg:px-6 xl:px-8 2xl:px-[90px] gap-8 sm:gap-10 lg:gap-[48px] 2xl:gap-[60px] isolate`}
    >
      {/* ========================================================================= */}
      {/* Background: Half Glowing Portal Orb Dome (Desktop only, hidden on mobile/iPad) */}
      {/* ========================================================================= */}
      <div className="hidden xl:flex absolute inset-x-0 top-0 justify-center items-start pointer-events-none z-0 overflow-hidden select-none">
        <img
          src={ENTERPRISE_ARCHITECTURE_DATA.backgroundImage}
          alt=""
          aria-hidden="true"
          className="w-full max-w-[1700px] h-auto object-contain object-top opacity-90 mix-blend-screen translate-y-[105px] pointer-events-none select-none"
        />
      </div>

      {/* ========================================================================= */}
      {/* Headline: From Legacy Systems to Next-Gen Apps                            */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55 }}
        className="z-10 flex flex-col items-center text-center max-w-[1362px] px-2 sm:px-4"
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[76px] font-medium text-white tracking-tight text-center">
          <span>{ENTERPRISE_ARCHITECTURE_DATA.titlePrefix}</span>
          <br className="hidden sm:inline" />
          <span className="mt-1 inline-block">
            <span translate="no">CodeMate AI</span> Accelerates{' '}
            <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent font-semibold">
              {ENTERPRISE_ARCHITECTURE_DATA.titleHighlight}
            </span>
          </span>
        </h2>
      </motion.div>

      {/* ========================================================================= */}
      {/* Architecture Glassmorphism Rows                                           */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1740px] flex flex-col gap-6 sm:gap-7 lg:gap-[24px] z-10">
        {ENTERPRISE_ARCHITECTURE_DATA.groups.map((group, groupIdx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 * groupIdx }}
            className="w-full flex flex-col items-start gap-2.5 sm:gap-3 lg:gap-[16px]"
          >
            {/* Category Header */}
            <h3
              className={`${inter.className} text-white/75 font-normal text-sm sm:text-base lg:text-[18px] lg:leading-[18px] tracking-normal`}
            >
              {group.category}
            </h3>

            {/* Glassmorphic Row Container */}
            <div
              className={`w-full border-[0.5px] border-white/20 rounded-[4px] overflow-hidden flex flex-col lg:flex-row bg-[rgba(20,20,22,0.4)] shadow-[0_4px_30px_rgba(0,0,0,0.5)] ${
                group.columns === 5
                  ? 'backdrop-blur-[10.5px]'
                  : group.columns === 3
                  ? 'backdrop-blur-[17px]'
                  : 'backdrop-blur-[12px]'
              }`}
            >
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex-1 lg:flex-auto min-w-0 flex flex-col justify-start items-start p-3 sm:p-3.5 lg:px-3.5 xl:px-4 2xl:px-5 lg:pt-3.5 xl:pt-4 2xl:pt-4.5 lg:pb-3 min-h-[85px] sm:min-h-[95px] lg:h-[135px] xl:h-[145px] gap-1.5 sm:gap-2 border-b lg:border-b-0 lg:border-r border-white/20 last:border-b-0 lg:last:border-r-0 transition-all duration-300 hover:bg-white/[0.06] group"
                >
                  <h4 className="text-white font-semibold text-base sm:text-lg lg:text-[15px] xl:text-[17px] 2xl:text-[19px] lg:leading-[22px] xl:leading-[24px] 2xl:leading-[26px] tracking-tight group-hover:text-white transition-colors whitespace-nowrap">
                    {item.title}
                  </h4>
                  <p className="text-white/70 font-normal text-xs sm:text-sm lg:text-[11px] xl:text-[11.5px] 2xl:text-[13px] lg:leading-[16px] xl:leading-[18px] 2xl:leading-[20px] tracking-tight whitespace-nowrap group-hover:text-white/85 transition-colors">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
