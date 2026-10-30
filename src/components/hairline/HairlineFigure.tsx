'use client';

import React, { useEffect, useRef } from 'react';

// Figures are loaded on the client only: the kernel works on the live DOM
const FIGURES = {
  rulebook: () => import('./figures/rulebook'),
  connectors: () => import('./figures/connectors'),
  lens: () => import('./figures/lens'),
  library: () => import('./figures/library'),
  plan: () => import('./figures/plan'),
} as const;

export type HairlineFigureName = keyof typeof FIGURES;

interface HairlineFigureProps {
  name: HairlineFigureName;
  /** Slider position from 0 to 1, mapped onto the figure's own range (0.5 is its default) */
  intensity?: number;
  /** Walk the figure's tour while it is on screen; a real pointer takes over */
  autoplay?: boolean;
  className?: string;
  /** Palette overrides: --hairline-plate, -hi, -edge, -mid, -lo and -stroke */
  style?: React.CSSProperties;
}

/** Maps 0–1 onto [lo, mid, hi] as two straight lines meeting at 0.5, as the package's bench does */
const valueAt = ([lo, mid, hi]: number[], i: number) =>
  i <= 0.5 ? lo + (i / 0.5) * (mid - lo) : mid + ((i - 0.5) / 0.5) * (hi - mid);

export default function HairlineFigure({ name, intensity = 0.5, autoplay = true, className = '', style }: HairlineFigureProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let disposed = false;
    let cleanup = () => {};

    Promise.all([import('./kernel'), FIGURES[name]()]).then(([{ default: HL }, { default: figure }]) => {
      if (disposed) return;
      HL.inject(document);
      stage.setAttribute('aria-label', figure.means);
      const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);
      // The read-out is the bench's corner label; the card has none, so it is kept but not shown
      const read = { textContent: 'rest' };
      const handle = figure.mount({ stage, svg, read }, valueAt(figure.range, intensity));
      const playing = autoplay ? HL.tour(stage, figure.tour || HL.LAP) : null;
      cleanup = () => {
        playing?.stop();
        handle.destroy();
        svg.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [name, intensity, autoplay]);

  return (
    <div
      ref={stageRef}
      role="img"
      data-hairline={name}
      data-hairline-theme="dark"
      className={className}
      style={style}
    />
  );
}
