"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import PixelTransition from "./pixel-transition";

interface CarouselProps {
  items: React.ReactElement[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  companyLogo?: string;
  companyName?: string;
  bio?: string;
  linkedin?: string;
  salaryRange?: string;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const checkScrollability = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll, checkScrollability]);

  const scrollLeft = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, []);

  const handleCardClose = useCallback((index: number) => {
    if (carouselRef.current) {
      const cardWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? 230 : 384;
      const gap = typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  }, []);

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l",
            )}
          ></div>

          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "mx-auto max-w-7xl", // remove max-w-4xl if you want the carousel to span the full width of its container
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 * index,
                  ease: [0.4, 0, 0.2, 1],
                }}
                key={`card-${index}`}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100/10 backdrop-blur-sm transition-all hover:bg-gray-100/20 disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-white" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100/10 backdrop-blur-sm transition-all hover:bg-gray-100/20 disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const firstContent = (
    <div className="relative h-full w-full">
      <BlurImage
        src={card.src}
        alt={card.title}
        className="h-full w-full object-cover"
      />
      <div className={`absolute bottom-0 left-0 right-0 z-[1] w-full p-6 flex items-center justify-between gap-4 bg-[rgb(30,30,30)]/40 backdrop-blur-sm border-t rounded-2xl border-[#a7e8e8]/20
        ${isHovered ? 'md:hidden' : ''}
        peer-[.pixel-transition-active]:hidden
      `}>
        <div className="relative z-10 flex flex-col">
          <p className="text-left font-sans text-sm font-medium md:text-base text-white">
            {card.category}
          </p>
          <p className="mt-2 text-left font-sans text-xl font-semibold [text-wrap:balance] md:text-3xl text-white">
            {card.title}
          </p>
        </div>
        {card.companyLogo && (
          <div className="flex-shrink-0">
            <img
              src={card.companyLogo}
              alt={`${card.companyName || 'Company'} Logo`}
              className="h-12 w-12 object-contain rounded-md bg-white p-1"
            />
          </div>
        )}
      </div>
    </div>
  );

  const secondContent = (
    <div className="h-full w-full bg-neutral-900 p-6 flex flex-col overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        {card.companyLogo && (
          <img
            src={card.companyLogo}
            alt={`${card.companyName || 'Company'} Logo`}
            className="h-16 w-16 object-contain rounded-md bg-white p-2"
          />
        )}
        <div>
          {card.companyName && (
            <h3 className="text-xl font-semibold text-white">{card.companyName}</h3>
          )}
        </div>
      </div>

      {card.bio && (
        <p className="text-white/80 text-lg leading-relaxed mb-6">{card.bio}</p>
      )}

      {/* Salary and LinkedIn section */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-800 mt-4">
        {card.salaryRange && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white/70">Salary Range:</span>
            <span className="text-sm font-semibold text-white">{card.salaryRange}</span>
          </div>
        )}
        {card.linkedin && (
          <a
            href={card.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            LinkedIn Profile
          </a>
        )}
      </div>

      {/* Any subsequent content would go here */}
    </div>
  );

  return (
    <PixelTransition
      firstContent={firstContent}
      secondContent={secondContent}
      gridSize={15}
      pixelColor="#ffffff"
      animationStepDuration={0.3}
      className="h-80 md:h-[33rem] w-56 md:w-96"
      style={{
        border: "none",
        backgroundColor: "transparent",
      }}
    />
  );
};

export const BlurImage = ({
  src,
  className,
  alt,
  ...rest
}: {
  src: string;
  className?: string;
  alt: string;
  [key: string]: unknown;
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={cn(
        "object-cover transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      {...rest}
    />
  );
};
