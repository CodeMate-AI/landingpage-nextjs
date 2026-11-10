import type { Metadata } from 'next';
import { hpePartnership as p } from '@/components/partnerships/data';

const url = `https://codemate.ai/partnerships/${p.slug}`;

export const metadata: Metadata = {
  title: { absolute: p.title },
  description: p.metaDescription,
  alternates: { canonical: url },
  openGraph: {
    title: p.title,
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
    title: p.title,
    description: p.metaDescription,
    images: [p.cover],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="custom-cursor min-h-screen">{children}</div>;
}
