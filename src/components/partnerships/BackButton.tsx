'use client';

import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';

/**
 * Returns to whatever page the visitor came from. When there is no history
 * (link opened in a new tab, typed URL), falls back to the partnerships hub.
 */
export default function BackButton({
  fallbackHref = '/partnerships',
  className = '',
}: {
  fallbackHref?: string;
  className?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) router.back();
    else router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-sm sm:text-[15px] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded ${className}`}
    >
      <IconArrowLeft size={17} stroke={1.8} aria-hidden="true" />
      Back
    </button>
  );
}
