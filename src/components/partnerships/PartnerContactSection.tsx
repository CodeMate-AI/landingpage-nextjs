import Image from 'next/image';
import Link from 'next/link';

export default function PartnerContactSection() {
  return (
    <section
      aria-labelledby="partner-contact-heading"
      className="mx-auto mt-16 sm:mt-24 mb-24 sm:mb-32 max-w-6xl overflow-hidden rounded-2xl border border-zinc-800 bg-clip-padding bg-gradient-to-b from-zinc-900 via-zinc-900 to-[#0A5BDF]/35 px-6 py-14 sm:py-20 text-center"
    >
      <h2
        id="partner-contact-heading"
        className="font-heading text-[clamp(1.75rem,3.6vw,2.5rem)] leading-[1.15] text-white"
      >
        Partner with CodeMate AI
        <span className="block text-neutral-300">Let&apos;s build together.</span>
      </h2>

      <Image
        src="/logos/brand/codemate-icon.svg"
        alt=""
        aria-hidden="true"
        width={48}
        height={38}
        className="mx-auto mt-10 sm:mt-12 h-auto w-12"
      />

      <Link
        href="/contact"
        className="mt-10 sm:mt-12 inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-sm sm:text-base font-semibold text-black transition-colors hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        Contact us
      </Link>
    </section>
  );
}
