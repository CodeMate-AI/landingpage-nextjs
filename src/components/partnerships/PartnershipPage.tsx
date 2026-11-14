'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MotionConfig, motion } from 'framer-motion';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { partnershipCards, type Partnership, type PartnershipSection } from './data';
import BackButton from './BackButton';
import PartnershipDiagram from './PartnershipDiagram';

// Layout: a left-aligned partner brief. Each section is a 12-column row with the
// heading on the left (sticky on desktop) and the content on the right.

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

function SectionRow({ section, id }: { section: PartnershipSection; id: string }) {
  return (
    <section aria-labelledby={id} className="grid gap-6 border-t border-zinc-800 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <h2 id={id} className="text-2xl lg:text-3xl font-semibold leading-tight tracking-tight text-white lg:sticky lg:top-32">
          {section.heading}
        </h2>
      </div>

      <div className="lg:col-span-8">
        <div className="max-w-[65ch] space-y-4 text-base lg:text-[17px] leading-relaxed text-neutral-400">
          {section.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        {section.items && (
          <dl className="mt-10 grid gap-x-10 sm:grid-cols-2">
            {section.items.map((item) => (
              <div key={item.label} className="border-t border-zinc-800 py-5">
                <dt className="text-base font-semibold text-white">{item.label}</dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-neutral-400">{item.text}</dd>
              </div>
            ))}
          </dl>
        )}

        {section.closing && (
          <div className="mt-8 max-w-[65ch] space-y-4 text-base lg:text-[17px] leading-relaxed text-neutral-400">
            {section.closing.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function PartnershipPage({ data }: { data: Partnership }) {
  const others = partnershipCards.filter((card) => !card.href.endsWith(`/${data.slug}`));
  const diagramAfter = data.diagramAfter ?? -1;
  const diagram = data.diagram && (
    <div className="pb-14 sm:pb-20">
      <PartnershipDiagram diagram={data.diagram} />
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative bg-zinc-950 text-white min-h-screen pt-[92px] sm:pt-[104px] lg:pt-[110px] overflow-x-hidden">
        <Navbar />

        <main className="px-4 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="pt-2">
              <BackButton className="text-neutral-400 hover:text-white focus-visible:outline-white" />
            </div>

            {/* Hero */}
            <motion.header
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="grid items-center gap-10 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-6">
                <p className="text-sm sm:text-base font-medium text-neutral-400">{data.partnerLine}</p>
                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] tracking-tight text-white">
                  {data.headline}
                </h1>
                <p className="mt-6 max-w-[60ch] text-base lg:text-lg leading-relaxed text-neutral-400">{data.subtitle}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className={`inline-flex h-12 items-center justify-center rounded-md bg-white px-7 font-semibold text-black transition-colors hover:bg-neutral-200 ${focusRing}`}
                  >
                    Contact us
                  </Link>
                  <a
                    href="https://app.codemate.ai/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex h-12 items-center justify-center rounded-md border border-zinc-700 px-7 font-semibold text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900 ${focusRing}`}
                  >
                    Try for free
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
                  <Image
                    src={data.cover}
                    alt={data.coverAlt}
                    width={1200}
                    height={628}
                    priority
                    sizes="(max-width: 1025px) 100vw, 560px"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </motion.header>

            {/* Lead */}
            <section aria-label="About the partnership" className="grid gap-4 border-t border-zinc-800 py-14 sm:py-20 lg:grid-cols-12 lg:gap-12">
              <p className="text-sm font-medium text-neutral-500 lg:col-span-4">The partnership</p>
              <p className="max-w-[60ch] text-lg sm:text-xl lg:text-2xl leading-relaxed text-neutral-200 lg:col-span-8">
                {data.lead}
              </p>
            </section>

            {diagramAfter === -1 && diagram}

            {data.sections.map((section, i) => (
              <React.Fragment key={section.heading}>
                <SectionRow section={section} id={`section-${i}`} />
                {i === diagramAfter && diagram}
              </React.Fragment>
            ))}

            {/* More partnerships */}
            {others.length > 0 && (
              <section aria-labelledby="more-partnerships" className="border-t border-zinc-800 pt-14 pb-24 sm:pt-20 sm:pb-32">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 id="more-partnerships" className="text-2xl lg:text-3xl font-semibold tracking-tight text-white">
                    More partnerships
                  </h2>
                  <Link href="/partnerships" className={`shrink-0 rounded text-sm sm:text-base text-neutral-400 transition-colors hover:text-white ${focusRing}`}>
                    View all
                  </Link>
                </div>
                <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2">
                  {others.map((card) => (
                    <li key={card.href}>
                      <Link href={card.href} className={`group block rounded-xl ${focusRing}`}>
                        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                          <Image
                            src={card.cover}
                            alt={card.alt}
                            width={1080}
                            height={608}
                            sizes="(max-width: 640px) 100vw, 560px"
                            className="aspect-[16/9] h-auto w-full object-cover"
                          />
                        </div>
                        <h3 className="mt-4 line-clamp-2 text-base sm:text-lg font-medium leading-snug text-neutral-100 transition-colors group-hover:text-white">
                          {card.title}
                        </h3>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
