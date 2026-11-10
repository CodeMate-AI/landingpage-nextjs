import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { partnershipCards } from '@/components/partnerships/data';
import PartnerContactSection from '@/components/partnerships/PartnerContactSection';

const url = 'https://codemate.ai/partnerships';
const title = 'Partnerships | CodeMate AI';
const description =
  'How CodeMate AI works with HP, HPE and Qualcomm to bring AI-powered software development to more developers, devices and enterprises.';
const ogImage = '/partners/hp-cover.png';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    siteName: 'CodeMate AI',
    locale: 'en_US',
    images: [{ url: ogImage, width: 1080, height: 608, alt: 'CodeMate AI partnerships' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@codemateai',
    title,
    description,
    images: [ogImage],
  },
};

export default function PartnershipsPage() {
  return (
    <div className="custom-cursor relative bg-zinc-950 text-white min-h-screen pt-[92px] sm:pt-[104px] lg:pt-[110px] overflow-x-hidden">
      <Navbar />

      <main className="px-4 sm:px-8">
        <div className="mx-auto max-w-6xl pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded text-sm sm:text-[15px] text-neutral-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <IconArrowLeft size={17} stroke={1.8} aria-hidden="true" />
            Back to home
          </Link>
        </div>

        <header className="mx-auto max-w-3xl text-center pt-6 sm:pt-10">
          <p className="mb-3 sm:mb-4 text-sm sm:text-base font-medium text-neutral-400">PARTNERSHIPS</p>
          <h1 className="font-heading text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.15] pb-[0.08em] bg-gradient-to-b from-white to-gray-300/70 bg-clip-text text-transparent">
            Built together
          </h1>
          <p className="mt-5 mx-auto max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-neutral-400">
            Partnerships that bring CodeMate AI to more developers, devices and enterprises.
          </p>
        </header>

        <ul className="mx-auto mt-12 sm:mt-16 grid max-w-6xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {partnershipCards.map((card, i) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                  <Image
                    src={card.cover}
                    alt={card.alt}
                    width={1080}
                    height={608}
                    priority={i < 3}
                    sizes="(max-width: 640px) 100vw, (max-width: 1025px) 50vw, 370px"
                    className="aspect-[16/9] h-auto w-full object-cover"
                  />
                </div>
                <h2
                  title={card.title}
                  className="mt-4 line-clamp-2 text-base sm:text-lg font-medium leading-snug text-neutral-100 transition-colors group-hover:text-white"
                >
                  {card.title}
                </h2>
              </Link>
            </li>
          ))}
        </ul>

        <PartnerContactSection />
      </main>

      <Footer />
    </div>
  );
}
