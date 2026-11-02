import Image from "next/image";
import Link from "next/link";
import { IconMail, IconPhone } from "@tabler/icons-react";

// Footer for pages under /hp, shared by /hp/promo and /hp/usecases/[slug].
export default function HpSubpageFooter() {
  return (
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
          <a href="tel:+918766330253" aria-label="Call CodeMate" className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10">
            <IconPhone size={18} stroke={1.8} aria-hidden="true" />
          </a>
          <a href="mailto:contact@codemate.ai" aria-label="Email CodeMate" className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10">
            <IconMail size={18} stroke={1.8} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
