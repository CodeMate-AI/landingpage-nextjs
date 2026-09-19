"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import HpRoiCalculator from "./components/HpRoiCalculator";

export default function HpRoiPage() {
  return (
    <div className="custom-cursor flex min-h-dvh flex-col bg-white text-black">
      {/* Navbar matching promo page */}
      <nav className="sticky top-0 z-20 w-full border-b border-divider/60 bg-white">
        <div className="mx-auto flex h-18 w-full max-w-340 items-center justify-between gap-5 px-6 sm:px-10">
          <Link href="/hp" className="flex shrink-0 items-center transition-opacity hover:opacity-80" aria-label="Back to HP x CodeMate AI">
            <Image
              src="/HPxCodeMateAI_LOGO_NAV.png"
              alt="HP x CodeMate AI"
              width={210}
              height={70}
              priority
              unoptimized
              className="h-14.5 w-43 object-contain sm:h-17.5 sm:w-52.5"
            />
          </Link>
          <Link
            href="/hp"
            className="inline-flex items-center gap-2 font-heading text-[15px] tracking-[0.4px] text-black transition-colors hover:text-accent-blue"
          >
            <IconArrowLeft size={17} stroke={1.8} aria-hidden="true" />
            Back to HP x CodeMate
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="w-full flex-1 bg-[#EBF3FF] border-b border-divider/60">
        <div className="max-w-340 mx-auto px-6 sm:px-10 py-12 lg:py-16">
          {/* Section Hero Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 border border-accent-blue/20 bg-white px-3.5 py-1.5 font-heading text-[13px] tracking-[0.7px] text-accent-blue font-medium">
              HP × CodeMate Financial Assessment
            </div>
            <h1 className="font-heading text-[38px] sm:text-[50px] lg:text-[58px] font-normal leading-[1.05] tracking-[0.3px] text-black">
              Calculate Your Enterprise Return on Investment
            </h1>
            <p className="mt-5 font-sans text-[16px] sm:text-[18px] leading-7 text-[#485571]">
              Quantify the engineering velocity, hours saved, and direct cost savings when deploying CodeMate AI across your engineering organization on HP Next Gen AI PCs.
            </p>
          </div>

          {/* Localized Calculator Component */}
          <Suspense fallback={<div className="w-full h-96 bg-white animate-pulse rounded-2xl" />}>
            <HpRoiCalculator />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black py-10 text-white sm:py-12">
        <div className="mx-auto flex w-full max-w-340 flex-col items-center justify-between gap-8 px-6 sm:px-10 lg:flex-row">
          <Link href="/hp" className="flex shrink-0 items-center" aria-label="HP x CodeMate AI home">
            <Image
              src="/HPxCodeMateAI_LOGO_NAV.png"
              alt="HP x CodeMate"
              width={210}
              height={70}
              unoptimized
              className="h-14.5 w-43 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 font-heading text-[13px] uppercase tracking-[0.13em] text-white/75">
            <a href="https://docs.codemate.ai/faqs/privacy-policy" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Privacy</a>
            <a href="https://docs.codemate.ai/faqs/terms-of-service" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Terms</a>
            <a href="mailto:contact@codemate.ai" className="transition-colors hover:text-white">Support</a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+918766330253"
              aria-label="Call CodeMate"
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <svg className="w-5 h-5 text-white stroke-current" fill="none" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.122-4.1-6.924-6.924l1.293-.97a1.173 1.173 0 00.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </a>
            <a
              href="mailto:contact@codemate.ai"
              aria-label="Email CodeMate"
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
