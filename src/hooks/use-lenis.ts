import { useEffect } from 'react';
import Lenis from 'lenis';

// Lenis smooth scroll for a page, skipped for visitors who turn off motion; exposed on window.__lenis for scripted scrolls
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.1 });
    (window as any).__lenis = lenis;
    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      delete (window as any).__lenis;
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
