'use client';

import React, { useEffect, useRef } from 'react';
import type { ShowcaseCardData } from './ShowcasePage';

const POSITION_CLASS = {
  top: 'object-top',
  bottom: 'object-bottom',
} as const;

// Cards in the first screenful get their image immediately; the rest wait until
// they are close to the viewport, so a long page never fetches everything at once.
const EAGER_COUNT = 4;
const COLUMNS = 4;
const IMAGE_PRELOAD_MARGIN = '0px 0px 600px 0px';

export default function ShowcaseGrid({ cards }: { cards: ShowcaseCardData[] }) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-card]'));

    // Reveal: one observer for every card, runs once per card, only toggles an attribute
    // so the browser animates opacity and transform on the compositor (no layout work).
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.dataset.visible = 'true';
          // Release the compositor layer once the transition has finished
          window.setTimeout(() => el.classList.remove('will-change-[opacity,transform]'), 1000);
          revealObserver.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    // Image loading: set the real src shortly before the card scrolls into view
    const imageObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const img = (entry.target as HTMLElement).querySelector<HTMLImageElement>('img[data-src]');
          if (img) {
            img.src = img.dataset.src as string;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(entry.target);
        }
      },
      { rootMargin: IMAGE_PRELOAD_MARGIN },
    );

    items.forEach((el) => {
      if (reducedMotion) el.dataset.visible = 'true';
      else revealObserver.observe(el);
      imageObserver.observe(el);
    });

    // Images that were already cached finish before React attaches onLoad
    list.querySelectorAll<HTMLImageElement>('img[data-fade]').forEach((img) => {
      if (img.complete && img.naturalWidth > 0) img.dataset.loaded = 'true';
    });

    return () => {
      revealObserver.disconnect();
      imageObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Without JavaScript the reveal never fires, so show the cards as they are */}
      <noscript>
        <style>{`[data-card]{opacity:1!important;transform:none!important}img[data-fade]{opacity:1!important}`}</style>
      </noscript>

      <ul
        ref={listRef}
        className="mx-auto mt-10 grid max-w-[1240px] list-none grid-cols-1 gap-4 p-0 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:mt-20 lg:grid-cols-4"
      >
        {cards.map((card, idx) => {
          const eager = idx < EAGER_COUNT;
          return (
            <li
              key={card.key}
              data-card
              style={{ transitionDelay: `${(idx % COLUMNS) * 70}ms` }}
              className="flex translate-y-6 opacity-0 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
            >
              <article className="flex w-full flex-col overflow-hidden rounded-lg bg-[#121214]">
                <div
                  className={`relative aspect-[5/3] w-full overflow-hidden ${
                    card.plate ? 'flex items-center justify-center bg-white p-5' : 'bg-zinc-900'
                  }`}
                >
                  <img
                    data-fade
                    {...(eager ? { src: card.image } : { 'data-src': card.image })}
                    alt={card.alt}
                    decoding="async"
                    fetchPriority={eager ? 'high' : 'low'}
                    onLoad={(e) => {
                      e.currentTarget.dataset.loaded = 'true';
                    }}
                    style={card.scale ? { transform: `scale(${card.scale})` } : undefined}
                    className={`h-full w-full opacity-0 transition-opacity duration-500 data-[loaded=true]:opacity-100 motion-reduce:transition-none ${
                      card.plate
                        ? 'object-contain'
                        : `object-cover ${card.imagePosition ? POSITION_CLASS[card.imagePosition] : ''}`
                    }`}
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-5">
                  <h2
                    className="break-words text-base font-medium leading-snug text-white sm:text-lg"
                    style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
                  >
                    {card.title}
                  </h2>
                  {card.link ? (
                    <a
                      href={card.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto w-fit pt-1 text-sm text-[#00BFFF] transition-opacity hover:opacity-70 sm:text-base"
                    >
                      Read More<span className="sr-only"> about {card.title}</span>
                    </a>
                  ) : null}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
