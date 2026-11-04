/**
 * Moves a horizontal carousel by exactly one card, measured from the rendered layout,
 * so the step stays correct at every breakpoint. Cards are marked with data-carousel-card.
 * No behavior is passed: the container's scroll-smooth class decides, which respects reduced motion.
 */
export function scrollCarouselByCard(container: HTMLElement, direction: 'left' | 'right') {
  const cards = container.querySelectorAll<HTMLElement>('[data-carousel-card]');
  if (cards.length < 2) return;

  const step = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
  container.scrollBy({ left: direction === 'left' ? -step : step });
}
