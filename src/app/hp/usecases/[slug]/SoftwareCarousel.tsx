"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UsecaseSoftware } from "../../config/usecaseContent";

const CARD_GAP = 20;

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "previous" ? "Previous software" : "Next software"}
      className="flex items-center justify-center w-9 h-9 p-0 border-0 rounded-full bg-transparent text-black cursor-pointer transition-colors duration-200 enabled:hover:text-accent-blue disabled:opacity-30 disabled:cursor-default"
    >
      <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path
          fillRule="evenodd"
          d={
            direction === "previous"
              ? "M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"
              : "M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
          }
        />
      </svg>
    </button>
  );
}

function VisitArrow() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M4.08 9.92 9.92 4.08M4.08 4.08h5.84v5.84" />
    </svg>
  );
}

export default function SoftwareCarousel({ softwares }: { softwares: readonly UsecaseSoftware[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateArrows = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // The end padding can add scroll room when every card is already fully visible.
    const endPadding = parseFloat(getComputedStyle(scroller).paddingRight);
    const allCardsFit = scroller.scrollWidth - endPadding <= scroller.clientWidth;
    setCanScrollPrevious(!allCardsFit && scroller.scrollLeft > 1);
    setCanScrollNext(!allCardsFit && scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    updateArrows();
    scroller.addEventListener("scroll", updateArrows, { passive: true });
    const observer = new ResizeObserver(updateArrows);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", updateArrows);
      observer.disconnect();
    };
  }, [updateArrows]);

  const scrollByCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    const card = scroller?.firstElementChild;
    if (!scroller || !card) return;
    scroller.scrollBy({ left: direction * (card.getBoundingClientRect().width + CARD_GAP), behavior: "smooth" });
  };

  const linkClass =
    "inline-flex items-center gap-3 font-heading font-medium text-[13px] leading-[21px] tracking-[0.26px] text-[#0F1724]";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Runs past the page gutter to the screen edge; the end padding lets the last card line up with the content. */}
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Softwares developed using CodeMate"
        tabIndex={0}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory mr-[calc(50%-50vw)] pr-[calc(50vw-50%)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
      >
        {softwares.map((software, index) => (
          <article
            key={`${software.name}-${index}`}
            className="snap-start shrink-0 w-[min(576.98px,calc(100vw-72px))] flex flex-col items-start gap-8 bg-white border border-[#E2E5EA] rounded-lg p-6 sm:p-[37px]"
          >
            <span className="inline-flex items-center gap-1.5 h-[26px] px-3 py-[5px] rounded-full bg-[#E8F3FF] font-heading font-medium text-[10px] leading-4 tracking-[1.2px] uppercase text-[#005DE7]">
              <svg className="w-2.5 h-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M8.33 2.5 3.75 7.08 1.67 5" />
              </svg>
              {software.tag}
            </span>
            <div className="flex flex-col gap-3 w-full">
              <h3 className="font-heading font-medium text-[24px] leading-[25px] tracking-[1px] text-[#0F1724] m-0">
                {software.name}
              </h3>
              <p className="font-heading font-normal text-[16px] leading-[22px] text-[#5A6578] min-h-[68px] m-0">
                {software.description}
              </p>
            </div>
            {software.url ? (
              <a
                href={software.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} mt-auto hover:text-accent-blue transition-colors duration-200`}
              >
                {software.linkLabel}
                <VisitArrow />
              </a>
            ) : null}
          </article>
        ))}
      </div>

      {(canScrollPrevious || canScrollNext) && (
        <div className="flex justify-end gap-10">
          <ArrowButton direction="previous" disabled={!canScrollPrevious} onClick={() => scrollByCard(-1)} />
          <ArrowButton direction="next" disabled={!canScrollNext} onClick={() => scrollByCard(1)} />
        </div>
      )}
    </div>
  );
}
