import type { Metadata } from 'next';
import { hpePartnership as p } from '@/components/partnerships/data';
import { JsonLd, partnershipJsonLd, partnershipMetadata } from '@/components/partnerships/seo';

export const metadata: Metadata = partnershipMetadata(p);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="custom-cursor min-h-screen">
      <JsonLd data={partnershipJsonLd(p)} />
      {children}
    </div>
  );
}
