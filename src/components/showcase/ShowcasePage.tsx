import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export interface ShowcaseCardData {
  key: string;
  title: string;
  alt: string;
  image: string;
  link?: string;
  // Achievements: which part of the photo to keep when cropped
  imagePosition?: 'top' | 'bottom';
  // Media: show the image as a logo on a white plate instead of a full-bleed photo
  plate?: boolean;
  scale?: number;
}

interface ShowcasePageProps {
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix: string;
  subtitle: string;
  cards: ShowcaseCardData[];
}

const CURSOR = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="22" height="22"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 2 1, auto`;

const POSITION_CLASS = {
  top: 'object-top',
  bottom: 'object-bottom',
} as const;

// Shared page shell for /achievements and /media: heading, responsive card grid
// (4 columns on desktop, 2 on medium screens, 1 on small screens), navbar and footer.
export default function ShowcasePage({
  titlePrefix,
  titleHighlight,
  titleSuffix,
  subtitle,
  cards,
}: ShowcasePageProps) {
  return (
    <div
      style={{ cursor: CURSOR }}
      className="min-h-screen overflow-x-hidden bg-zinc-950 pt-[92px] text-white sm:pt-[104px] lg:pt-[110px]"
    >
      <Navbar />

      <main className="relative z-10 w-full px-4 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-32">
        <header className="mx-auto flex max-w-[880px] flex-col items-center pt-10 text-center sm:pt-14 lg:pt-20">
          <h1 className="text-[clamp(2rem,8vw,3rem)] font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent">
              {titlePrefix}
            </span>
            <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
              {titleHighlight}
            </span>
            <span className="bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent">
              {titleSuffix}
            </span>
          </h1>
          <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-zinc-500 sm:text-base lg:text-lg">
            {subtitle}
          </p>
        </header>

        <ul className="mx-auto mt-10 grid max-w-[1240px] list-none grid-cols-1 gap-4 p-0 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:mt-20 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.key} className="flex">
              <article className="flex w-full flex-col overflow-hidden rounded-lg bg-[#121214]">
                <div
                  className={`relative aspect-[5/3] w-full overflow-hidden ${
                    card.plate ? 'flex items-center justify-center bg-white p-5' : 'bg-zinc-900'
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.alt}
                    loading="lazy"
                    decoding="async"
                    style={card.scale ? { transform: `scale(${card.scale})` } : undefined}
                    className={
                      card.plate
                        ? 'h-full w-full object-contain'
                        : `h-full w-full object-cover ${card.imagePosition ? POSITION_CLASS[card.imagePosition] : ''}`
                    }
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-5">
                  <h2
                    title={card.title}
                    className="line-clamp-2 text-base font-medium leading-snug text-white sm:text-lg"
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
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  );
}
