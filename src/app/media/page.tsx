import type { Metadata } from 'next';
import ShowcasePage from '@/components/showcase/ShowcasePage';
import { MEDIA_DATA } from '@/data/media';

const TITLE = 'Media Presence';
const DESCRIPTION =
  'CodeMate AI in the news: coverage from leading news and media platforms around the globe.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://codemate.ai/media' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://codemate.ai/media',
    type: 'website',
    siteName: 'CodeMate AI',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function MediaPage() {
  const { titlePrefix, titleHighlight, titleSuffix, subtitle, items } = MEDIA_DATA;

  // Cards with a Read More link first, cards without one stacked at the end (original order kept in each group)
  return (
    <ShowcasePage
      titlePrefix={titlePrefix}
      titleHighlight={titleHighlight}
      titleSuffix={titleSuffix}
      subtitle={subtitle}
      cards={[...items.filter((item) => item.link), ...items.filter((item) => !item.link)].map((item, idx) => ({
        key: `${idx}-${item.outlet}`,
        title: item.headline,
        alt: item.outlet,
        image: item.image,
        link: item.link,
        plate: !item.fill,
      }))}
    />
  );
}
