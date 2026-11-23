import React from 'react';
import Image from 'next/image';
import { DEVBOX_DATA } from '@/data/landingData';
import { SEQUENCE, frameSrc } from '@/lib/devbox-film';
import styles from './DevBoxSection.module.css';

// Frame 90 of the desktop film shows the box fully taken apart
const EXPLODED_FRAME = frameSrc(SEQUENCE.desktop.dir, 89);

// Still version of the Dev Box film for visitors who turn off motion; CSS shows it only under prefers-reduced-motion
export default function DevBoxStaticStory() {
  return (
    <section
      className={`${styles.staticOnly} w-full bg-[#050505] py-12 px-4 sm:py-16 sm:px-8 md:py-20 md:px-10 lg:py-24 lg:px-12 xl:py-[120px] xl:px-[90px]`}
      aria-labelledby="devbox-static-title"
    >
      <div className="mx-auto w-full max-w-[1740px]">
        <span className="font-sans text-[14px] sm:text-[18px] leading-[18px] text-white/75">
          <span translate="no">CodeMate Dev Box</span>, powered by HP&apos;s <span translate="no">ZGX Nano</span>
        </span>
        <h2
          id="devbox-static-title"
          className="mt-2 sm:mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-[60px] lg:leading-[60px]"
          style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
        >
          <span className="bg-linear-to-b from-white to-[#D1D5DB]/80 bg-clip-text text-transparent">
            {DEVBOX_DATA.titlePrefix}
          </span>
          <span className="bg-linear-to-r from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
            {DEVBOX_DATA.titleHighlight}
          </span>
        </h2>
        <p className="mt-4 max-w-[34rem] text-[15px] leading-[1.7] text-white/70">{DEVBOX_DATA.support}</p>

        <Image
          src={SEQUENCE.poster}
          alt="CodeMate Dev Box on HP's ZGX Nano"
          width={1600}
          height={900}
          unoptimized
          className="mt-10 w-full h-auto rounded-2xl"
        />

        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {DEVBOX_DATA.chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <span className="text-[12px] uppercase tracking-[0.16em] text-white/75">
                <span className="text-[#00BFFF] mr-3">{String(index + 2).padStart(2, '0')}</span>
                {chapter.label}
              </span>
              <h3
                className="mt-3 text-xl font-semibold text-white"
                style={{ fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' }}
              >
                {chapter.headline}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.7] text-white/70">{chapter.body}</p>
            </li>
          ))}
        </ol>

        <Image
          src={EXPLODED_FRAME}
          alt="The layers inside the Dev Box, taken apart"
          width={1600}
          height={900}
          unoptimized
          className="mt-10 w-full h-auto rounded-2xl"
        />

        <ul className="mt-6 flex flex-wrap gap-2" aria-label={DEVBOX_DATA.stackLabel}>
          {DEVBOX_DATA.stack.map((layer) => (
            <li key={layer} className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/85">
              {layer}
            </li>
          ))}
        </ul>
        {/* The four tools fold into one line, matching the film's layer list */}
        <p className="mt-3 text-[12px] text-white/55">{DEVBOX_DATA.stackTools}</p>
      </div>
    </section>
  );
}
