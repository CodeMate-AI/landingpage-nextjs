import type { Metadata } from 'next';
import DevBoxPage from '@/components/landing/devbox/DevBoxPage';
import { SEQUENCE } from '@/lib/devbox-film';

const TITLE = 'CodeMate Dev Box on HP ZGX Nano';
const DESCRIPTION =
  "CodeMate AI's AI Co-Worker on HP's ZGX Nano: local models, memory and agents on hardware you own.";

// Own route for the Dev Box scroll film, linked from the teaser on the home page
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://codemate.ai/devbox' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://codemate.ai/devbox',
    type: 'website',
    siteName: 'CodeMate AI',
    images: [{ url: SEQUENCE.poster, width: 1600, height: 900 }], // Follows the frame folder version, so new frames bring a new share image
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <DevBoxPage />;
}
