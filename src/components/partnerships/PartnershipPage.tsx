'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MotionConfig, motion } from 'framer-motion';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import type { Partnership } from './data';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

export default function PartnershipPage({ data }: { data: Partnership }) {
  const [brand, rest] = data.title.split(': ');

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative bg-zinc-950 text-white min-h-screen pt-[92px] sm:pt-[104px] lg:pt-[110px] overflow-x-hidden">
        <Navbar />

        <main className="px-4 sm:px-8">
          {/* Hero */}
          <motion.header
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center pt-6 sm:pt-10"
          >
            <h1 className="text-[clamp(2rem,5vw,3.75rem)] leading-[1.1] font-semibold bg-gradient-to-b from-white to-gray-300/70 bg-clip-text text-transparent">
              {brand}
            </h1>
            {rest && (
              <p className="mt-3 text-lg sm:text-xl md:text-2xl font-medium text-neutral-300">{rest}</p>
            )}
            <p className="mt-5 mx-auto max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed text-neutral-400">
              {data.subtitle}
            </p>
          </motion.header>

          {/* Cover */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-10 sm:mt-14 max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
          >
            <Image
              src={data.cover}
              alt={data.coverAlt}
              width={1200}
              height={628}
              priority
              sizes="(max-width: 1200px) 100vw, 1152px"
              className="h-auto w-full"
            />
          </motion.div>

          {/* Lead statement */}
          <motion.div {...fadeUp} className="mx-auto mt-16 sm:mt-20 max-w-3xl">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <p className="py-8 sm:py-10 text-center text-base sm:text-lg md:text-xl leading-relaxed text-neutral-200">
              {data.lead}
            </p>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </motion.div>

          {/* Sections */}
          <div className="mx-auto max-w-5xl">
            {data.sections.map((section) => (
              <motion.section key={section.heading} {...fadeUp} className="mt-20 sm:mt-28">
                <h2 className="mx-auto max-w-3xl text-center text-2xl sm:text-3xl md:text-[2.25rem] leading-tight font-semibold text-white">
                  {section.heading}
                </h2>
                <div className="mx-auto mt-6 sm:mt-8 max-w-3xl space-y-4 text-center text-sm sm:text-base leading-relaxed text-neutral-400">
                  {section.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>

                {section.items && (
                  <ul className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {section.items.map((item, i) => (
                      <li
                        key={item.label}
                        className={`rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 transition-colors hover:border-white/20 ${
                          section.items!.length % 2 === 1 && i === section.items!.length - 1 ? 'md:col-span-2 md:text-center' : ''
                        }`}
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-white">{item.label}</h3>
                        <p className="mt-2 text-sm sm:text-[0.95rem] leading-relaxed text-neutral-400">{item.text}</p>
                      </li>
                    ))}
                  </ul>
                )}

                {section.closing && (
                  <div className="mx-auto mt-8 max-w-3xl space-y-4 text-center text-sm sm:text-base leading-relaxed text-neutral-400">
                    {section.closing.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                )}
              </motion.section>
            ))}
          </div>

          {/* CTA */}
          <motion.section
            {...fadeUp}
            className="relative mx-auto mt-24 sm:mt-32 mb-20 sm:mb-28 max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-cyan-950/60 px-6 py-14 sm:py-20 text-center"
          >
            <h2 className="text-2xl sm:text-4xl font-semibold leading-tight text-white">
              Experience CodeMate AI
              <span className="block mt-1 text-neutral-300 font-normal">Sovereign AI for software development</span>
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 text-sm md:text-base">
              <Link href="/download" className="w-full sm:w-auto">
                <span className="h-12 px-8 flex items-center justify-center bg-black text-white rounded-md font-semibold border border-white/20 hover:border-white/40 transition-colors whitespace-nowrap">
                  Download
                </span>
              </Link>
              <a href="https://app.codemate.ai/dashboard" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <span className="h-12 px-8 flex items-center justify-center bg-white text-black rounded-md font-semibold hover:bg-neutral-200 transition-colors whitespace-nowrap">
                  Try for Free
                </span>
              </a>
            </div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
