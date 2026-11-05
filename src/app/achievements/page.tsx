import type { Metadata } from 'next';
import ShowcasePage from '@/components/showcase/ShowcasePage';
import { ACHIEVEMENTS_DATA } from '@/data/achievements';

const TITLE = 'Achievements';
const DESCRIPTION =
  'Awards, partnerships, summits and recognition earned by CodeMate AI from tech platforms, organisations and industry leaders around the globe.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://codemate.ai/achievements' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://codemate.ai/achievements',
    type: 'website',
    siteName: 'CodeMate AI',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function AchievementsPage() {
  const { titlePrefix, titleHighlight, titleSuffix, subtitle, items } = ACHIEVEMENTS_DATA;

  return (
    <ShowcasePage
      titlePrefix={titlePrefix}
      titleHighlight={titleHighlight}
      titleSuffix={titleSuffix}
      subtitle={subtitle}
      cards={items.map((item, idx) => ({
        key: `${idx}-${item.title}`,
        title: item.title,
        alt: item.alt,
        image: item.image,
        link: item.link,
        imagePosition: item.imagePosition,
      }))}
    />
  );
}
