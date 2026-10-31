import Image from "next/image";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

// Nav for pages under /hp, shared by /hp/promo and /hp/usecases/[slug].
export default function HpSubpageNav() {
  return (
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
          aria-label="Back to HP x CodeMate"
          className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-heading text-[15px] tracking-[0.4px] text-black transition-colors hover:text-accent-blue"
        >
          <IconArrowLeft size={17} stroke={1.8} aria-hidden="true" />
          <span className="sm:hidden">Back</span>
          <span className="hidden sm:inline">Back to HP x CodeMate</span>
        </Link>
      </div>
    </nav>
  );
}
