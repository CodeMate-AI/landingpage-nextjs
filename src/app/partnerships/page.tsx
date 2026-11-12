import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { partnershipCards } from '@/components/partnerships/data';
import PartnerContactSection from '@/components/partnerships/PartnerContactSection';
import { HUB_URL, JsonLd, SITE_URL, breadcrumbJsonLd } from '@/components/partnerships/seo';

const url = HUB_URL;
const title = 'Partnerships: HP, HPE and Qualcomm | CodeMate AI';
const description =
  'How CodeMate AI works with HP, HPE and Qualcomm to bring AI-powered software development to more developers, devices and enterprises.';
const ogImage = '/partners/hp-cover.png';

const hubJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'en-US',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: partnershipCards.map((card, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: card.title,
        url: `${SITE_URL}${card.href}`,
      })),
    },
  },
  breadcrumbJsonLd([
    { name: 'Home', url: SITE_URL },
    { name: 'Partnerships', url },
  ]),
];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    'CodeMate AI partnerships',
    'CodeMate AI HP',
    'CodeMate AI HPE',
    'CodeMate AI Qualcomm',
    'HP AI PC',
    'Hewlett Packard Enterprise',
    'Snapdragon',
    'AI-powered software development',
  ],
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
      <JsonLd data={hubJsonLd} />
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
          <h1 className="whitespace-nowrap font-semibold tracking-tight text-[clamp(1.5rem,6.5vw,3.75rem)] leading-[1.08] pb-[0.08em] bg-gradient-to-b from-white to-gray-300/70 bg-clip-text text-transparent">
            Partners in sovereign AI
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
