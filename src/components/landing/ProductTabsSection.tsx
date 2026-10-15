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

  // Handle smooth scroll clicks
  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(300, Math.floor(el.clientWidth * 0.75));
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      aria-label="CodeMate Product Details"
      className={`${montserrat.className} relative w-full bg-[#0C0C0E] text-white flex flex-col items-center overflow-hidden pt-24 pb-16 px-4 sm:pt-28 sm:pb-24 sm:px-8 lg:py-[140px] lg:px-[90px]`}
    >
      <div className="w-full max-w-[1740px] flex flex-col items-center gap-10 sm:gap-14 lg:gap-20">
        {/* ========================================================================= */}
        {/* Frame 35: Header (Responsive Left / Right layout + Navigation Controls)   */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 sm:gap-8 pb-2">
          {/* Left Block: Product Label + Headline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`header-left-${currentTab.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex flex-col items-start gap-1 sm:gap-2 max-w-[760px]"
            >
              <span className="text-white/60 text-base sm:text-xl lg:text-[24px] lg:leading-[32px] font-normal tracking-wide">
                {currentTab.productLabel}
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] lg:leading-[60px] font-semibold bg-gradient-to-b from-white via-white/90 to-[#9CA3AF] bg-clip-text text-transparent">
                {currentTab.headline}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Right Block: Description + Slider Controls */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-end lg:items-end justify-between w-full lg:w-auto gap-4 max-w-[620px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={`header-desc-${currentTab.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-white/90 text-sm sm:text-base lg:text-[16px] lg:leading-[25px] font-normal text-left"
              >
                {currentTab.description}
              </motion.p>
            </AnimatePresence>

            {/* Slider Navigation Arrow Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous cards"
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
                aria-label="Next cards"
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
        </div>

        {/* ========================================================================= */}
        {/* Frame 16: Horizontal Carousel Track (Swipeable, Scrollable, Keyboardable) */}
        {/* ========================================================================= */}
        <div className="w-full relative">
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollBoundaries}
            className="w-full flex flex-row items-stretch gap-5 sm:gap-8 lg:gap-[40px] overflow-x-auto scroll-smooth py-2 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`carousel-track-${currentTab.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-row items-stretch gap-5 sm:gap-8 lg:gap-[40px]"
              >
                {currentTab.cards.map((card, idx) => (
                  <article
                    key={card.id || `card-${idx}`}
                    className="group flex flex-col items-start gap-4 sm:gap-5 w-[280px] sm:w-[380px] md:w-[440px] lg:w-[500px] flex-shrink-0 transition-transform duration-300"
                  >
                    {/* Media Container: Background+Border+Shadow */}
                    <div className="relative w-full h-[200px] sm:h-[260px] md:h-[280px] lg:h-[300px] bg-[#121216] border border-white/[0.06] rounded-[12px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300 group-hover:border-white/15">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 640px) 280px, (max-width: 768px) 380px, (max-width: 1024px) 440px, 500px"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Card Content: Frame 38 */}
                    <div className="w-full flex flex-col items-start gap-2 sm:gap-3 px-1 sm:px-2">
                      <h3 className="text-white text-base sm:text-xl lg:text-[24px] lg:leading-[28px] font-medium tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-[#868686] text-xs sm:text-[15px] lg:text-[16px] lg:leading-[24px] font-normal leading-relaxed">
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
        {/* Frame 36: Tab Switcher Pill                                               */}
        {/* ========================================================================= */}
        <div className="w-full flex justify-center px-1">
          <nav
            aria-label="CodeMate Products Navigation"
            className="w-auto max-w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#141A21] border border-white/20 rounded-[12px] sm:rounded-[14px] p-1.5 sm:p-2 lg:py-3 lg:px-6 flex flex-row items-center justify-start sm:justify-center gap-1 sm:gap-1.5 shadow-lg"
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
                  className={`relative px-3 sm:px-5 lg:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-[15px] lg:text-[16px] lg:leading-[24px] font-normal transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#121212] font-medium shadow-sm'
                      : 'bg-transparent text-white/80 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {tab.tabName}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
