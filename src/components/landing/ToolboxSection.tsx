'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaGithub, FaBitbucket, FaGitlab } from 'react-icons/fa6';
import { VscAzureDevops } from 'react-icons/vsc';
import { TOOLBOX_DATA, ToolboxProduct } from '@/data/landingData';

// Normalized optical scales for toolbox card logos to ensure uniform visual mass
const TOOLBOX_LOGO_SCALES: Record<string, string> = {
  build: 'scale-[2.1]',
  cora: 'scale-[1.15]',
  'cora-cli': 'scale-[1.15]',
  academy: 'scale-[1.05]',
  'pr-review': 'scale-[0.75]',
};

export default function ToolboxSection() {
  // At first, all cards are shown at the bottom without description.
  // When hovered, the card lifts up and description reveals.
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic scroll state tracking
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 5;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const cardStep = 348; // Card width (336px) + gap (12px)
    const scrollAmount = direction === 'left' ? -cardStep : cardStep;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full bg-[#0C0C0E] px-4 pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-10 lg:pb-12 sm:px-8 lg:px-[90px] overflow-hidden">
      <div className="mx-auto flex max-w-[1740px] flex-col items-center gap-8 lg:gap-[48px]">
        {/* Section Header: Left-aligned with Right-aligned Navigation Controls */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-8 pb-2">
          <div className="flex flex-col items-start text-left max-w-[956px]">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 0.75, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
              className="font-sans text-[16px] sm:text-[18px] font-normal leading-[18px] tracking-normal text-white"
              style={{ opacity: 0.75 }}
            >
              {TOOLBOX_DATA.overline}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[60px] lg:leading-[60px] text-left"
              style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
            >
              <span className="bg-gradient-to-b from-white to-[#D1D5DB]/80 bg-clip-text text-transparent">
                {TOOLBOX_DATA.titlePrefix}
              </span>
              <span className="bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
                {TOOLBOX_DATA.titleHighlight}
              </span>
              <span className="bg-gradient-to-b from-white to-[#D1D5DB]/80 bg-clip-text text-transparent">
                {TOOLBOX_DATA.titleSuffix}
              </span>
            </motion.h2>
          </div>

          {/* Slider Navigation Controls */}
          <div className="flex items-center gap-2 pt-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Slide cards left"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 ${
                canScrollLeft
                  ? 'border-white/20 bg-[#141A21] text-white hover:bg-white/10 hover:border-white/40 cursor-pointer active:scale-95'
                  : 'border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Slide cards right"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 ${
                canScrollRight
                  ? 'border-white/20 bg-[#141A21] text-white hover:bg-white/10 hover:border-white/40 cursor-pointer active:scale-95'
                  : 'border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* 6 Product Cards Row: Native scrollbar disabled, navigated via left/right slider or touch swipe */}
        <div
          ref={scrollContainerRef}
          onMouseLeave={() => setHoveredIndex(null)}
          className="flex w-full flex-nowrap items-stretch gap-3 lg:gap-[12px] overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth pb-2 pt-2 select-none"
        >
          {TOOLBOX_DATA.products.map((product: ToolboxProduct, idx: number) => {
            const isHovered = hoveredIndex === idx;
            const isPRReview = product.id === 'pr-review';

            return (
              <motion.a
                key={product.id}
                href={product.link}
                target={product.isExternal ? '_blank' : '_self'}
                rel={product.isExternal ? 'noopener noreferrer' : undefined}
                onMouseEnter={() => setHoveredIndex(idx)}
                onClick={() => setHoveredIndex(idx)}
                animate={{
                  backgroundColor: isHovered
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.04)',
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                style={{
                  padding: '24px 0px 24px 20px',
                }}
                className={`group relative flex h-[540px] w-[320px] min-w-[300px] shrink-0 2xl:w-[336px] 2xl:shrink-0 flex-col justify-between overflow-hidden rounded-[8px] border transition-colors duration-300 ${
                  isHovered
                    ? 'border-white/15 shadow-[0_12px_40px_rgba(0,191,255,0.08)]'
                    : 'border-white/5 shadow-none'
                }`}
              >
                {/* Product Information (Header and Expandable Description) */}
                <div className="flex flex-col gap-2 z-20 pr-4">
                  {/* Product Logo and Title */}
                  <div className="flex items-start gap-[8px] min-h-[28px]">
                    <div className="flex size-[28px] shrink-0 items-center justify-center">
                      <Image
                        src={product.logo}
                        alt={product.name}
                        width={28}
                        height={28}
                        quality={95}
                        sizes="56px"
                        className={`object-contain transition-transform ${
                          TOOLBOX_LOGO_SCALES[product.id] || ''
                        }`}
                      />
                    </div>
                    <h3
                      className="text-[20px] font-semibold leading-[28px] text-white tracking-normal"
                      style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Expandable Description: 66px height, Montserrat 14px/22px, opacity 0.7 */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isHovered ? 'max-h-[72px] opacity-70 mt-1' : 'max-h-0 opacity-0 mt-0'
                    }`}
                  >
                    <p
                      className="text-[14px] leading-[22px] text-white max-w-[300px]"
                      style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)', opacity: 0.7 }}
                    >
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Internal Preview Image: Smooth vertical lift to middle without any tilt */}
                <div className="relative w-full overflow-hidden flex-1 flex flex-col justify-end">
                  <motion.div
                    animate={{
                      y: isHovered ? (isPRReview ? -12 : -20) : 0,
                      scale: isHovered ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="relative left-0 h-[258px] w-[458px] rounded-tl-[6px] overflow-hidden origin-bottom-left"
                  >
                    <Image
                      src={product.previewImage}
                      alt={product.name}
                      width={458}
                      height={258}
                      quality={95}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 916px"
                      className="h-full w-full object-cover object-left-top rounded-tl-[6px]"
                    />
                  </motion.div>
                </div>

                {/* Integration Logos (Exclusive to PR Review Agent, revealed on hover) */}
                {isPRReview && (
                  <motion.div
                    initial={false}
                    animate={{
                      height: isHovered ? 24 : 0,
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? 12 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex items-center gap-[24px] overflow-hidden z-20 pointer-events-none"
                  >
                    <FaGithub
                      size={22}
                      className="text-white/70 transition-colors hover:text-white shrink-0"
                      title="GitHub"
                    />
                    <FaBitbucket
                      size={20}
                      className="text-white/70 transition-colors hover:text-white shrink-0"
                      title="Bitbucket"
                    />
                    <FaGitlab
                      size={22}
                      className="text-white/70 transition-colors hover:text-white shrink-0"
                      title="GitLab"
                    />
                    <VscAzureDevops
                      size={22}
                      className="text-white/70 transition-colors hover:text-white shrink-0"
                      title="Azure DevOps"
                    />
                  </motion.div>
                )}
              </motion.a>
            );
          })}
        </div>



        {/* Bottom CTA Button: Centered just below the navigation pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex justify-center w-full mt-2"
        >
          <Link
            href={TOOLBOX_DATA.ctaLink}
            className="flex h-[50px] w-[168px] items-center justify-center rounded-[6px] border border-white/5 bg-[#000000] font-semibold text-white transition-all duration-200 hover:border-white/20 hover:bg-zinc-900"
            style={{
              fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)',
              fontSize: '14px',
              lineHeight: '20px',
            }}
          >
            {TOOLBOX_DATA.ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
