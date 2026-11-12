import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';

/**
 * Always returns to the partnerships hub. A fixed link rather than history.back(),
 * which could land on an in-page anchor (the HP nav adds #section entries) or
 * on another site.
 */
export default function BackButton({
  href = '/partnerships',
  className = '',
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-sm sm:text-[15px] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded ${className}`}
    >
      <IconArrowLeft size={17} stroke={1.8} aria-hidden="true" />
      Back
    </Link>
  );
}
