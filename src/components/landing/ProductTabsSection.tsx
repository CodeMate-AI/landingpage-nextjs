'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import { PRODUCT_TABS_DATA, ProductTabItem } from '@/data/landingData';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function ProductTabsSection() {
  const [activeTabId, setActiveTabId] = useState<string>('work');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Active tab data lookup from dynamic data source
  const currentTab: ProductTabItem =
    PRODUCT_TABS_DATA.tabs.find((tab) => tab.id === activeTabId) ||
    PRODUCT_TABS_DATA.tabs[0];

  // Update boundary state for slider buttons
  const checkScrollBoundaries = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // Reset scroll position and update boundaries when active tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    const timer = setTimeout(checkScrollBoundaries, 350);
    return () => clearTimeout(timer);
  }, [activeTabId, checkScrollBoundaries]);

  // Handle smooth scroll clicks: 1 full card step on mobile, tablet, and desktop
  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isMobile = el.clientWidth < 640;
    const isTablet = el.clientWidth >= 640 && el.clientWidth < 1024;
    const cardStep = isMobile
      ? el.clientWidth + 20
      : isTablet
      ? (el.clientWidth - 24) / 2 + 24
      : (el.clientWidth - 64) / 3 + 32;
    el.scrollBy({
      left: direction === 'left' ? -cardStep : cardStep,
      behavior: 'smooth',
    });
  };

  return (
    <section
      aria-label="CodeMate Product Details"
      className={`${montserrat.className} relative w-full bg-[#0C0C0E] text-white flex flex-col items-center overflow-hidden pt-6 sm:pt-8 lg:pt-8 pb-8 sm:pb-8 lg:pb-10 px-4 sm:px-8 lg:px-[90px]`}
    >
      <div className="w-full max-w-[1740px] flex flex-col items-center gap-6 sm:gap-8 lg:gap-8">
        {/* ========================================================================= */}
        {/* Product Header (Responsive Left / Right layout with Navigation Controls)  */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5 sm:gap-6 pb-1 min-h-[296px] sm:min-h-[330px] lg:min-h-[228px]">
          {/* Left Block: Product Label + Headline */}
          <div className="flex flex-col items-start gap-1 sm:gap-2 max-w-[760px] w-full lg:w-auto min-h-[130px] sm:min-h-[150px] lg:min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`header-left-${currentTab.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col items-start gap-1 sm:gap-2 w-full"
              >
                <span className="text-white/60 text-base sm:text-xl lg:text-[22px] lg:leading-[28px] font-normal tracking-wide">
                  {currentTab.productLabel}
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[46px] lg:leading-[54px] font-semibold bg-gradient-to-b from-white via-white/90 to-[#9CA3AF] bg-clip-text text-transparent min-h-[64px] sm:min-h-[80px] lg:min-h-[110px]">
                  {currentTab.headline}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Block: Description + Slider Controls */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-end lg:items-end justify-between w-full lg:w-auto gap-3 sm:gap-4 lg:max-w-[580px]">
            <div className="w-full min-h-[48px] sm:min-h-[54px] lg:min-h-[54px] flex items-start sm:items-end lg:items-end">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`header-desc-${currentTab.id}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="text-white/90 text-sm sm:text-base lg:text-[15px] lg:leading-[24px] font-normal text-left max-w-[500px] lg:max-w-none min-h-[44px] sm:min-h-[50px] lg:min-h-[50px]"
                >
                  {currentTab.description}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Slider Navigation Arrow Buttons: Pinned to right-hand side on mobile, matching original desktop placement */}
            <div className="w-full sm:w-auto lg:w-auto flex justify-end items-center gap-2 pt-1 shrink-0">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous cards"
                className={`w-10 h-10 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 ${
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
                aria-label="Next cards"
                className={`w-10 h-10 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all duration-200 ${
                  canScrollRight
                    ? 'border-white/20 bg-[#141A21] text-white hover:bg-white/10 hover:border-white/40 cursor-pointer active:scale-95'
                    : 'border-white/5 bg-white/[0.02] text-white/20 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Horizontal Product Carousel Track (Swipeable, Scrollable, Keyboardable)  */}
        {/* ========================================================================= */}
        <div className="w-full relative min-h-[320px] sm:min-h-[356px] lg:min-h-[368px]">
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollBoundaries}
            className="w-full flex flex-row items-stretch gap-5 sm:gap-6 lg:gap-8 overflow-x-auto scroll-smooth py-1 px-0 sm:px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x snap-x snap-mandatory"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`carousel-track-${currentTab.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-row items-stretch gap-5 sm:gap-6 lg:gap-8 w-full"
              >
                {currentTab.cards.map((card, idx) => (
                  <article
                    key={card.id || `card-${idx}`}
                    className="group flex flex-col items-start gap-3 sm:gap-4 w-full min-w-full sm:min-w-0 sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-64px)/3)] flex-shrink-0 transition-transform duration-300 snap-start"
                  >
                    {/* Media Container: Background+Border+Shadow */}
                    <div className="relative w-full aspect-video bg-[#121216] border border-white/[0.06] rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300 group-hover:border-white/15">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        quality={95}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 600px"
                        className="object-contain object-center transition-none"
                      />
                    </div>

                    {/* Card Content Details */}
                    <div className="w-full flex flex-col items-start gap-1.5 sm:gap-2 px-1 sm:px-2">
                      <h3 className="text-white text-base sm:text-lg lg:text-[22px] lg:leading-[26px] font-medium tracking-tight min-h-[26px] sm:min-h-[30px] lg:min-h-[32px]">
                        {card.title}
                      </h3>
                      <p className="text-[#868686] text-xs sm:text-[14px] lg:text-[15px] lg:leading-[22px] font-normal leading-relaxed min-h-[48px] sm:min-h-[56px] lg:min-h-[66px]">
                        {card.description}
                      </p>
                    </div>
                  </article>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Tab Switcher Navigation Controls (Community-style Pill Strip)             */}
        {/* ========================================================================= */}
        <div className="w-full flex justify-center px-1 pt-1 sm:pt-2">
          <nav
            aria-label="CodeMate Products Navigation"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl border border-white/10 bg-zinc-900/70 p-1.5 shadow-xl backdrop-blur-xl max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
          >
            {PRODUCT_TABS_DATA.tabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  aria-selected={isActive}
                  role="tab"
                  className={`relative shrink-0 select-none whitespace-nowrap rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-black font-semibold'
                      : 'bg-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-product-tab-pill"
                      className="absolute inset-0 bg-white rounded-xl shadow-lg"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{tab.tabName}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
