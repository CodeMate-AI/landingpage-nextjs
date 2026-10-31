import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

function focusableIn(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
}

// Keeps keyboard focus inside an open dialog and returns it to the opening element on close.
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  const initialFocus = useRef(initialFocusRef);
  initialFocus.current = initialFocusRef;

  useEffect(() => {
    if (!isOpen) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    // Waits a moment because a drawer can't take focus until its slide-in has made it visible.
    const focusTimer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      (initialFocus.current?.current ?? focusableIn(container)[0] ?? container).focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      const container = containerRef.current;
      if (event.key !== "Tab" || !container) return;

      const focusable = focusableIn(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    // Tab key events stop at an iframe, so this catches focus that leaves through one.
    const handleFocusIn = (event: FocusEvent) => {
      const container = containerRef.current;
      if (!container || container.contains(event.target as Node)) return;
      focusableIn(container)[0]?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocusIn);
      opener?.focus({ preventScroll: true });
    };
  }, [containerRef, isOpen]);
}
