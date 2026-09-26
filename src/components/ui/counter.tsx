'use client';

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterProps {
  /**
   * A function to format the counter value. By default, it will format the
   * number with commas.
   */
  format?: (value: number) => string;

  /**
   * The target value of the counter.
   */
  targetValue: number;

  /**
   * The direction of the counter. If "up", the counter will start from 0 and
   * go up to the target value. If "down", the counter will start from the target
   * value and go down to 0.
   */
  direction?: "up" | "down";

  /**
   * The delay in milliseconds before the counter starts counting.
   */
  delay?: number;

  /**
   * Total duration of the counting animation in milliseconds.
   */
  duration?: number;

  /**
   * Additional classes for the counter.
   */
  className?: string;
}

export const Formatter = {
  number: (value: number) => Intl.NumberFormat("en-US").format(Math.round(value)),
  currency: (value: number) =>
    Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.round(value)),
};

// Ease out cubic for silky smooth deceleration
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function Counter({
  format = Formatter.number,
  targetValue,
  direction = "up",
  delay = 0,
  duration = 1400,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isGoingUp = direction === "up";
  const startValue = isGoingUp ? 0 : targetValue;
  const endValue = isGoingUp ? targetValue : 0;

  const isInView = useInView(ref, { margin: "0px", once: true });

  useEffect(() => {
    if (!isInView) {
      if (ref.current) {
        ref.current.textContent = format(startValue);
      }
      return;
    }

    let rafId: number;
    let timeoutId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      const startTime = performance.now();

      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = startValue + (endValue - startValue) * easedProgress;

        if (ref.current) {
          ref.current.textContent = format(currentValue);
        }

        if (progress < 1) {
          rafId = requestAnimationFrame(update);
        } else if (ref.current) {
          ref.current.textContent = format(endValue);
        }
      }

      rafId = requestAnimationFrame(update);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isInView, startValue, endValue, duration, delay, format]);

  return (
    <span
      ref={ref}
      className={cn("tabular-nums inline-block font-variant-numeric font-bold text-foreground", className)}
    >
      {format(startValue)}
    </span>
  );
}
