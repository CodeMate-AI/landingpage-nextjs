'use client';

import React from 'react';
import { Montserrat } from 'next/font/google';
import { motion } from 'framer-motion';
import Counter from '@/components/ui/counter';
import { Marquee } from '@/components/ui/marquee';
import { SOCIAL_PROOF_DATA } from '@/data/landingData';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function SocialProofSection() {
  return (
    <section
      aria-label="Social Proof and Enterprise Trust"
      className={`${montserrat.className} relative w-full bg-[rgba(255,255,255,0.02)] text-white flex flex-col items-center overflow-hidden pt-8 sm:pt-12 lg:pt-14 pb-8 sm:pb-12 lg:pb-14 px-4 sm:px-8 lg:px-[90px]`}
    >
      {/* ========================================================================= */}
      {/* Top Header and Statistics Metrics Row                                     */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[1740px] flex flex-col items-center">
        <div className="w-full flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 lg:gap-10 pb-2">
          {/* Left Block (Heading + Subtitle) */}
          <div className="flex flex-col items-start gap-3 max-w-[620px]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-3"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[72px] font-semibold bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
                {SOCIAL_PROOF_DATA.titleHighlight}
              </h2>
              <span className="inline-flex items-baseline text-3xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[72px] font-semibold bg-gradient-to-b from-white to-[#9CA3AF] bg-clip-text text-transparent">
                {SOCIAL_PROOF_DATA.titlePrefix}&nbsp;
                <Counter
                  targetValue={SOCIAL_PROOF_DATA.userCountValue}
                  className="tabular-nums font-semibold bg-gradient-to-b from-white to-[#9CA3AF] bg-clip-text text-transparent"
                />
                {SOCIAL_PROOF_DATA.userCountSuffix}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white text-base sm:text-xl lg:text-[24px] lg:leading-[32px] font-normal leading-relaxed text-left"
            >
              {SOCIAL_PROOF_DATA.subtitle}
            </motion.p>
          </div>

          {/* Vertical Divider Line between header and metrics */}
          <div className="hidden xl:block w-[1px] h-[104px] bg-white/20 shrink-0" />

          {/* Right Block (Statistics Metrics: Proper left, center, right distribution for mobile & iPad) */}
          <div className="w-full xl:w-auto grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 xl:flex xl:flex-row xl:items-start xl:gap-[48px] 2xl:gap-[64px]">
            {SOCIAL_PROOF_DATA.metrics.map((metric, idx) => {
              const alignmentClass =
                idx === 0
                  ? 'items-start text-left'
                  : idx === 1
                  ? 'items-center text-center'
                  : 'items-end text-right';

              return (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: 0.1 * (idx + 1) }}
                  className={`flex flex-col ${alignmentClass} w-full min-w-0`}
                >
                  <div className="flex items-baseline text-white font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[46px] tabular-nums tracking-tight">
                    <Counter
                      className="tabular-nums"
                      direction="up"
                      targetValue={metric.value}
                    />
                    <span>{metric.suffix}</span>
                  </div>
                  <p className="mt-1.5 sm:mt-3 text-white/70 font-normal text-xs sm:text-base lg:text-[20px] lg:leading-[28px] max-w-[200px] leading-snug">
                    {metric.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Container: Flowing Partner Logos Marquee (Full Bleed Edge to Edge)        */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden flex justify-center items-center mt-6 sm:mt-8 lg:mt-10 [mask-image:linear-gradient(to_right,transparent_0%,black_3%,black_97%,transparent_100%)]">
        <Marquee pauseOnHover className="[--duration:20s] flex justify-center items-center">
          {SOCIAL_PROOF_DATA.partners.map((partner) => (
            <img
              key={partner.id}
              src={partner.logo}
              alt={partner.name}
              className={partner.className}
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
