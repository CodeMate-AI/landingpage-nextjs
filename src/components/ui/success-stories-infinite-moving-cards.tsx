'use client';

import { cn } from "../../lib/utils";
import Image from "next/image";
import React, { useEffect, useState, startTransition } from "react";

export const SuccessStoriesInfiniteMovingCards = () => {
  const items = [
    { href: "/1.png" },
    { href: "/2.png" },
    { href: "/3.png" },
    { href: "/4.png" },
    { href: "/5.png" },
    { href: "/6.png" },
    { href: "/7.png" },
    { href: "/8.png" },
    { href: "/9.png" },
    { href: "/10.png" },
  ];

  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (containerRef.current && scrollerRef.current) {
      startTransition(() => {
        const scrollerContent = Array.from(scrollerRef.current!.children);

        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });

        containerRef.current!.style.setProperty('--animation-direction', 'forwards');
        containerRef.current!.style.setProperty('--animation-duration', '100s');
        setStart(true);
      });
    }
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="animate-pulse bg-indigo-500/20 h-[270px] w-[270px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="scroller relative z-20 max-w-screen overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-10 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <Image
            width={270}
            height={2}
            src={item.href}
            alt={`Success story ${idx + 1}`}
            className="relative rounded-2xl object-contain opacity-50"
            key={item.href}
            priority={idx < 3}
          />
        ))}
      </ul>
    </div>
  );
}; 