import { getImageProps } from "next/image";

type HpHeroImageProps = {
  src: string;
  alt: string;
  sizes: string;
  /** The viewport range where this image is visible; the preload only applies there. */
  media: string;
  className?: string;
  /** Serves the source file exactly as it is, with no resizing or compression. */
  unoptimized?: boolean;
};

// Hero image for layouts that swap between a desktop and a mobile image with CSS.
// Lazy loading stops the hidden copy from downloading, and the scoped preload keeps the visible one fast.
export default function HpHeroImage({ src, alt, sizes, media, className, unoptimized }: HpHeroImageProps) {
  const { props } = getImageProps({ src, alt, sizes, className, unoptimized, fill: true });

  return (
    <>
      <link
        rel="preload"
        as="image"
        href={props.srcSet ? undefined : props.src}
        imageSrcSet={props.srcSet}
        imageSizes={props.srcSet ? props.sizes : undefined}
        media={media}
        fetchPriority="high"
      />
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img {...props} loading="lazy" fetchPriority="high" />
    </>
  );
}
