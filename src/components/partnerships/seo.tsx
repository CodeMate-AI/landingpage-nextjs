import type { Metadata } from 'next';
import type { Partnership } from './data';

// SEO helpers for the /partnerships section. Structured data references the
// site-wide nodes defined in src/app/layout.tsx (#organization, #website, #software).

export const SITE_URL = 'https://codemate.ai';
export const HUB_URL = `${SITE_URL}/partnerships`;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SOFTWARE_ID = `${SITE_URL}/#software`;

export const partnershipUrl = (slug: string) => `${HUB_URL}/${slug}`;

type Crumb = { name: string; url: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export const partnershipCrumbs = (name: string, url: string): Crumb[] => [
  { name: 'Home', url: SITE_URL },
  { name: 'Partnerships', url: HUB_URL },
  { name, url },
];

/** WebPage describing one partnership, tied to CodeMate AI and the partner organization */
export function partnershipPageJsonLd({
  url,
  name,
  description,
  image,
  partnerName,
  partnerUrl,
}: {
  url: string;
  name: string;
  description: string;
  image: string;
  partnerName: string;
  partnerUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: 'en-US',
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: new URL(image, SITE_URL).toString() },
    about: [
      { '@id': ORG_ID },
      { '@type': 'Organization', name: partnerName, url: partnerUrl, sameAs: [partnerUrl] },
    ],
    mentions: { '@id': SOFTWARE_ID },
  };
}

export function partnershipMetadata(p: Partnership): Metadata {
  const url = partnershipUrl(p.slug);
  return {
    title: { absolute: p.seoTitle },
    description: p.metaDescription,
    keywords: p.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: p.seoTitle,
      description: p.metaDescription,
      url,
      type: 'website',
      siteName: 'CodeMate AI',
      locale: 'en_US',
      images: [{ url: p.cover, width: 1200, height: 628, alt: p.coverAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@codemateai',
      title: p.seoTitle,
      description: p.metaDescription,
      images: [p.cover],
    },
  };
}

/** Structured data for a partnership page in data.ts (HPE, Qualcomm) */
export function partnershipJsonLd(p: Partnership) {
  const url = partnershipUrl(p.slug);
  return [
    partnershipPageJsonLd({
      url,
      name: p.seoTitle,
      description: p.metaDescription,
      image: p.cover,
      partnerName: p.partner,
      partnerUrl: p.partnerUrl,
    }),
    breadcrumbJsonLd(partnershipCrumbs(p.partner, url)),
  ];
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output; escape "<" so content can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
