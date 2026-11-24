import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DEVBOX_DATA } from '@/data/landingData';

// Still of the ZGX Nano with the CodeMate AI logo on the lid; a new file name, since /devbox/* is cached as immutable
const TEASER_IMAGE = '/devbox/teaser/zgx-nano-codemate.webp';

const MONTSERRAT = { fontFamily: 'var(--font-montserrat, Montserrat, sans-serif)' };

// Two edge fades crossed, so all four sides of the photo reach full transparency and no frame edge shows on the dark ground
const PHOTO_FADE = {
  maskImage:
    'linear-gradient(to right, transparent, #000 16%, #000 84%, transparent), linear-gradient(to bottom, transparent, #000 16%, #000 72%, transparent)',
  WebkitMaskImage:
    'linear-gradient(to right, transparent, #000 16%, #000 84%, transparent), linear-gradient(to bottom, transparent, #000 16%, #000 72%, transparent)',
  maskComposite: 'intersect',
  WebkitMaskComposite: 'source-in',
} as const;

// Home page stand-in for the Dev Box film: heading, one big still of the box, its facts and a link to the film on /devbox
export default function DevBoxTeaser() {
  return (
    <section
      className="relative w-full bg-[#050505] overflow-hidden py-12 px-4 sm:py-16 sm:px-8 md:py-20 md:px-10 lg:py-24 lg:px-12 xl:py-[120px] xl:px-[90px]"
      aria-labelledby="devbox-teaser-title"
    >
      {/* Phones and tablets read top to bottom: heading, photo, specs, button. From lg the photo takes the right column and the
          left three stack between two flexible rows, so they sit centred beside it */}
      <div className="mx-auto grid w-full max-w-[1740px] grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:gap-x-12 xl:gap-x-16">
        <div className="flex flex-col items-start lg:col-start-1 lg:row-start-2">
          <span className="font-sans text-[14px] sm:text-[18px] leading-[18px] text-white/75">
            <span translate="no">CodeMate Dev Box</span>, powered by HP&apos;s <span translate="no">ZGX Nano</span>
          </span>
          <h2
            id="devbox-teaser-title"
            className="mt-3 lg:text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-[44px] lg:leading-[1.1] xl:text-[48px] 2xl:text-[56px]" // Sized to the half-width column so it sets as two lines, "One box. A whole" over "AI Co-Worker."
            style={MONTSERRAT}
          >
            {/* Same headline as the film's opening view, so the click lands where the teaser left off */}
            <span className="bg-linear-to-b from-white to-[#D1D5DB]/80 bg-clip-text text-transparent">
              {DEVBOX_DATA.introTitlePrefix}
            </span>
            {/* nowrap: the column is narrow enough that the browser otherwise splits the name at its hyphen, "Co-" / "Worker." */}
            <span className="whitespace-nowrap bg-linear-to-r from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
              {DEVBOX_DATA.introTitleHighlight}
            </span>
          </h2>
          <p className="mt-4 max-w-[30rem] text-[15px] sm:text-base leading-[1.7] text-white/70">{DEVBOX_DATA.support}</p>
        </div>

        {/* The four ZGX Nano facts as ruled cells: 2x2 on phones and beside the photo, one row of four on tablets */}
        <dl className="mt-2 grid w-full grid-cols-2 gap-x-6 sm:grid-cols-4 lg:col-start-1 lg:row-start-3 lg:mt-8 lg:max-w-[30rem] lg:grid-cols-2 lg:gap-x-8">
            {DEVBOX_DATA.specs.map((spec) => (
            <div key={spec.value} className="border-t border-white/10 py-4">
              <dt className="text-xl sm:text-2xl font-semibold text-white" translate="no" style={MONTSERRAT}>
                {spec.value}
              </dt>
              <dd className="mt-1 text-[13px] text-white/60">{spec.label}</dd>
            </div>
          ))}
        </dl>

        {/* One clear action named for what it opens; the arrow steps forward on hover and the button presses on click */}
        <div className="mt-6 lg:col-start-1 lg:row-start-4 lg:mt-8">
          <Link
            href="/devbox"
            className="group inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-white px-7 sm:px-8 text-sm md:text-base font-semibold text-black transition-[background-color,transform] duration-200 hover:bg-neutral-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            See how it works
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {/* The box at full size, also a way into the film; a faint blue glow behind it lifts it off the dark ground.
            Below lg it runs into the side padding and tucks its faded studio under its neighbours, since only the middle of the frame is box */}
        <Link
          href="/devbox"
          aria-label="Open the CodeMate Dev Box film"
          className="group relative row-start-2 -mx-4 -my-2 block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] sm:-mx-8 sm:-my-6 md:-mx-10 lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:mx-0 lg:my-0 lg:self-center"
        >
          <div
            className="pointer-events-none absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(0,191,255,0.14),transparent)] blur-2xl"
            aria-hidden="true"
          />
          <Image
            src={TEASER_IMAGE}
            alt="CodeMate Dev Box on HP's ZGX Nano, with the CodeMate AI logo on the lid"
            width={1280}
            height={720}
            unoptimized
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="relative w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            style={PHOTO_FADE}
          />
        </Link>
      </div>
    </section>
  );
}
