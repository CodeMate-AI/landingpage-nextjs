import Image from "next/image";
import Link from "next/link";
import { hpContact } from "../config/hpData";

export default function HpFooter() {
  return (
    <footer className="bg-black border-t border-[#262626] py-14 sm:py-16 text-white w-full">
      <div className="max-w-340 mx-auto flex w-full flex-col items-center gap-6 px-6 sm:px-10">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-center">
          <a
            href={hpContact.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-[15px] font-normal uppercase tracking-[0.15em] text-white/75 transition-colors duration-200 hover:text-white"
          >
            Privacy
          </a>
          <a
            href={hpContact.termsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-[15px] font-normal uppercase tracking-[0.15em] text-white/75 transition-colors duration-200 hover:text-white"
          >
            Terms of Service
          </a>
          <a
            href={`mailto:${hpContact.email}`}
            className="font-heading text-[15px] font-normal uppercase tracking-[0.15em] text-white/75 transition-colors duration-200 hover:text-white"
          >
            Support
          </a>
        </div>

        <Link href="/" className="shrink-0 flex items-center">
          <Image
            src="/HPxCodeMateAI_LOGO_NAV.png"
            alt="HP x CodeMate"
            width={280}
            height={94}
            unoptimized
            className="h-15 sm:h-18 w-auto object-contain transition-opacity hover:opacity-95"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </Link>

        {/* Contact & Social Icon Buttons under HP x CodeMate Logo */}
        <div className="flex items-center gap-4 mt-2">
          {/* Phone Icon */}
          <a
            href={`tel:${hpContact.phone}`}
            aria-label={`Call ${hpContact.displayPhone}`}
            className="flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-white stroke-current" fill="none" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.122-4.1-6.924-6.924l1.293-.97a1.173 1.173 0 00.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </a>

          {/* Gmail / Mail Icon */}
          <a
            href={hpContact.gmailComposeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Email ${hpContact.email} via Gmail`}
            className="flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>

          {/* LinkedIn Icon */}
          <a
            href={hpContact.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>

          {/* X (Twitter) Icon */}
          <a
            href={hpContact.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter / X"
            className="flex items-center justify-center w-11 h-11 border border-white/20 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
