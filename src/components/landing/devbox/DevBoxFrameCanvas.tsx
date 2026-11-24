"use client";

// Canvas frame player for the Dev Box film (decode off the main thread, direction-biased prefetch).

// The landing page animates with framer-motion, so the reference's motion/react import is swapped for it
import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_PORTRAIT_STOPS,
  FRAME_ASPECT,
  frameIndexAtProgress,
  frameSrc,
  isPortraitScreen,
  portraitFraming,
  SEQUENCE,
  stageLayout,
  type PortraitStops,
} from "@/lib/devbox-film"; // Dev Box frame paths and progress anchors

type FrameImage = ImageBitmap | HTMLImageElement;

type CanvasState = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  images: Array<FrameImage | null>;
  loaded: boolean[];
  loading: Set<number>;
  queued: Set<number>;
  queue: number[];
  active: number;
  center: number;
  initialized: boolean;
  count: number;
  directory: string;
  width: number;
  height: number;
  dpr: number;
  raf: number;
  progress: number;
  ready: boolean;
  disposed: boolean;
  onFirstPaint: () => void; // Reveals the canvas over the poster once it has drawn a real frame
  portraitStops: PortraitStops; // Where the section measured the box should sit for each beat on portrait screens
};

// Netlify and nginx serve over HTTP/2, so six parallel frame requests share one connection (reference used 4)
const MAX_CONCURRENCY = 6;
// Extra low-priority requests that fill the browser cache with the whole film in the background
const WARM_CONCURRENCY = 3;
// Bias the loader toward the direction the film is travelling. A symmetric
// window spends half its bandwidth on frames that have already passed; the
// extra lead is what keeps fast scrolls from catching the decoder.
const WINDOW_AHEAD = 20;
const WINDOW_BEHIND = 6;
const KEEP_AHEAD = 24;
const KEEP_BEHIND = 10;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function imageLayout(
  width: number,
  height: number,
  progress: number,
  portraitStops: PortraitStops,
): { dx: number; dy: number; dw: number; dh: number; contained: boolean } {
  // Phones and portrait iPads: a strip as wide as the screen, placed per beat by the measured copy
  if (isPortraitScreen(width, height)) {
    const { zoom, focus } = portraitFraming(progress, portraitStops);
    const dw = width * zoom;
    const dh = dw / FRAME_ASPECT;
    // No top clamp: a tall beat (the layer list) may push the frame's empty upper part off screen so its copy stays below the box
    return { dx: (width - dw) / 2, dy: Math.min(height * focus - dh / 2, Math.max(0, height - dh)), dw, dh, contained: true };
  }

  // Everything wider: the smaller stage, so copy reads in its own band above or below the box
  return { ...stageLayout(width, height, progress), contained: true };
}

function drawEdgeFades(
  ctx: CanvasRenderingContext2D,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const portrait = isPortraitScreen(ctx.canvas.width, ctx.canvas.height);
  // The stage floats on the dark ground, so its sides fade wide too, like a vignette
  const fadeX = portrait ? Math.min(72, dw * 0.055) : dw * 0.14;
  // Portrait frames are a strip across a tall screen, so their top and bottom fade much further to hide the seam
  // Wider screens: a frame edge that lands mid-screen (box dropped or raised) gets a long fade, not a 48px one
  const edgeOnScreen = dy > 1 || dy + dh < ctx.canvas.clientHeight - 1;
  const fadeY = isPortraitScreen(ctx.canvas.width, ctx.canvas.height)
    ? dh * 0.36
    : edgeOnScreen
      ? Math.min(240, dh * 0.24)
      : Math.min(48, dh * 0.06);

  ctx.save();
  ctx.beginPath();
  ctx.rect(dx, dy, dw, dh);
  ctx.clip();

  const left = ctx.createLinearGradient(dx, 0, dx + fadeX, 0);
  left.addColorStop(0, "rgba(5,5,5,1)");
  left.addColorStop(1, "rgba(5,5,5,0)");
  ctx.fillStyle = left;
  ctx.fillRect(dx, dy, fadeX, dh);

  const right = ctx.createLinearGradient(dx + dw, 0, dx + dw - fadeX, 0);
  right.addColorStop(0, "rgba(5,5,5,1)");
  right.addColorStop(1, "rgba(5,5,5,0)");
  ctx.fillStyle = right;
  ctx.fillRect(dx + dw - fadeX, dy, fadeX, dh);

  const top = ctx.createLinearGradient(0, dy, 0, dy + fadeY);
  // The studio backdrop is brightest at the frame top, so the fade holds solid first, then eases out without a visible edge
  top.addColorStop(0, "rgba(5,5,5,1)");
  top.addColorStop(0.2, "rgba(5,5,5,1)");
  top.addColorStop(0.55, "rgba(5,5,5,0.6)");
  top.addColorStop(0.85, "rgba(5,5,5,0.15)");
  top.addColorStop(1, "rgba(5,5,5,0)");
  ctx.fillStyle = top;
  ctx.fillRect(dx, dy, dw, fadeY);

  const bottom = ctx.createLinearGradient(0, dy + dh, 0, dy + dh - fadeY);
  bottom.addColorStop(0, "rgba(5,5,5,1)");
  bottom.addColorStop(1, "rgba(5,5,5,0)");
  ctx.fillStyle = bottom;
  ctx.fillRect(dx, dy + dh - fadeY, dw, fadeY);

  ctx.restore();
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  image: FrameImage,
  state: CanvasState,
) {
  const layout = imageLayout(state.width, state.height, state.progress, state.portraitStops);
  ctx.drawImage(image, layout.dx, layout.dy, layout.dw, layout.dh);
}

// Fades go on once over the finished composite; per frame, a blended second frame would lighten the first frame's fade
function fadeFrameEdges(ctx: CanvasRenderingContext2D, state: CanvasState) {
  const layout = imageLayout(state.width, state.height, state.progress, state.portraitStops);
  if (layout.contained) {
    drawEdgeFades(ctx, layout.dx, layout.dy, layout.dw, layout.dh);
  }
}

function nearestLoaded(state: CanvasState, index: number) {
  const target = Math.round(index);
  if (state.loaded[target]) return target;

  for (let distance = 1; distance < state.count; distance += 1) {
    const before = target - distance;
    if (before >= 0 && state.loaded[before]) return before;
    const after = target + distance;
    if (after < state.count && state.loaded[after]) return after;
  }

  return -1;
}

function closeFrame(image: FrameImage | null) {
  if (!image) return;
  if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
    image.close();
    return;
  }
  if (image instanceof HTMLImageElement) {
    image.onload = null;
    image.onerror = null;
    image.src = "";
  }
}

async function decodeFallback(blob: Blob) {
  const image = new Image();
  const objectUrl = URL.createObjectURL(blob);
  image.src = objectUrl;
  try {
    await image.decode();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
  return image;
}

/**
 * Decode off the scroll path. A plain HTMLImageElement is not decoded until
 * the first drawImage() call, which stalls the main thread for every frame.
 * createImageBitmap() performs the decode before the frame is marked ready,
 * so scrolling only pays for the composite.
 */
// Downloads every frame into the HTTP cache once the section is near, so later decodes never wait on the network.
// The player's own fetch for a frame already in flight here waits on the browser's cache lock instead of downloading twice.
async function warmCache(state: CanvasState) {
  // Wait for an idle moment so the warm-up never competes with the hero's own loading (Safari has no requestIdleCallback)
  await new Promise((resolve) =>
    "requestIdleCallback" in window ? window.requestIdleCallback(resolve, { timeout: 2000 }) : setTimeout(resolve, 1000),
  );
  let next = 1; // Frame 0 is the poster, which the page has already loaded
  const worker = async () => {
    while (!state.disposed && next < state.count) {
      const index = next++;
      if (state.loaded[index] || state.loading.has(index)) continue;
      try {
        const response = await fetch(frameSrc(state.directory, index), { priority: "low" });
        await response.blob(); // Reading the body is what stores the response in the cache
      } catch {
        // Harmless: the player fetches this frame itself when the scroll reaches it
      }
    }
  };
  await Promise.all(Array.from({ length: WARM_CONCURRENCY }, worker));
}

async function loadFrame(state: CanvasState, index: number) {
  if (state.disposed || state.loaded[index] || state.loading.has(index)) {
    return;
  }

  state.loading.add(index);

  const url =
    index === 0 ? SEQUENCE.poster : frameSrc(state.directory, index);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Frame ${index} failed: ${response.status}`);
    const blob = await response.blob();

    const image =
      typeof window.createImageBitmap === "function"
        ? await window.createImageBitmap(blob)
        : await decodeFallback(blob);

    if (state.disposed) {
      closeFrame(image);
      return;
    }

    state.images[index] = image;
    state.loaded[index] = true;

    // Reveal on the first frame that actually paints, not only frame 0: a reload mid-film restores the scroll
    // position, frame 0 is then outside the loading window, and the closed-box poster would stay up forever
    if (!state.ready) {
      if (paint(state)) {
        state.ready = true;
        state.onFirstPaint();
      }
    } else {
      requestPaint(state);
    }
  } catch {
    state.images[index] = null;
  } finally {
    state.loading.delete(index);
  }
}

function pump(state: CanvasState) {
  if (state.disposed) return;

  while (state.active < MAX_CONCURRENCY && state.queue.length > 0) {
    const index = state.queue.shift();
    if (index === undefined) break;
    state.queued.delete(index);

    if (state.loaded[index] || state.loading.has(index)) continue;

    state.active += 1;
    void loadFrame(state, index).finally(() => {
      state.active -= 1;
      pump(state);
    });
  }
}

function ensureWindow(state: CanvasState, center: number) {
  if (state.disposed) return;

  const next = Math.round(clamp(center, 0, state.count - 1));
  if (state.initialized && state.center === next) return;

  const movingBackward = state.initialized && next < state.center;

  state.center = next;
  state.initialized = true;

  const windowBefore = movingBackward ? WINDOW_AHEAD : WINDOW_BEHIND;
  const windowAfter = movingBackward ? WINDOW_BEHIND : WINDOW_AHEAD;
  const start = Math.max(0, next - windowBefore);
  const end = Math.min(state.count - 1, next + windowAfter);

  state.queue = [];
  state.queued.clear();

  for (let index = start; index <= end; index += 1) {
    if (!state.loaded[index] && !state.loading.has(index)) {
      state.queue.push(index);
      state.queued.add(index);
    }
  }

  state.queue.sort(
    (a, b) => Math.abs(a - next) - Math.abs(b - next),
  );

  const keepBefore = movingBackward ? KEEP_AHEAD : KEEP_BEHIND;
  const keepAfter = movingBackward ? KEEP_BEHIND : KEEP_AHEAD;
  const keepStart = Math.max(0, next - keepBefore);
  const keepEnd = Math.min(state.count - 1, next + keepAfter);

  for (let index = 0; index < state.count; index += 1) {
    if (index >= keepStart && index <= keepEnd) continue;
    if (!state.loaded[index]) continue;

    const image = state.images[index];
    state.loaded[index] = false;
    state.images[index] = null;
    closeFrame(image);
  }

  pump(state);
}

// Returns whether a frame was drawn, so the first reveal can wait for real pixels
function paint(state: CanvasState): boolean {
  const exact = frameIndexAtProgress(state.progress, state.count);
  const low = Math.floor(exact);
  const high = Math.min(state.count - 1, low + 1);
  const blend = exact - low;

  const lowImage = state.images[low];
  const highImage = state.images[high];

  let primary: FrameImage | null = null;
  let secondary: FrameImage | null = null;
  let secondaryAlpha = 0;

  if (lowImage && state.loaded[low]) {
    primary = lowImage;
    if (high !== low && blend > 0.015 && highImage && state.loaded[high]) {
      secondary = highImage;
      secondaryAlpha = blend;
    }
  } else if (highImage && state.loaded[high]) {
    primary = highImage;
  } else {
    const fallback = nearestLoaded(state, exact);
    if (fallback >= 0 && Math.abs(fallback - exact) <= WINDOW_AHEAD + 2) {
      primary = state.images[fallback];
    }
  }

  // Never clear to a transparent canvas just because the exact frame is still
  // in flight. Keeping the last painted frame avoids black flashes on slow
  // networks and during fast scrolls.
  if (!primary) {
    ensureWindow(state, exact);
    return false; // Nothing drawn yet, so the poster must stay visible
  }

  const { ctx, dpr, width, height } = state;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.globalAlpha = 1;
  drawFrame(ctx, primary, state);

  if (secondary) {
    ctx.globalAlpha = secondaryAlpha;
    drawFrame(ctx, secondary, state);
    ctx.globalAlpha = 1;
  }
  fadeFrameEdges(ctx, state);

  // Only evict after the composite. Closing an ImageBitmap that is still the
  // source of the current paint raises InvalidStateError in Chromium.
  ensureWindow(state, exact);
  return true;
}

function requestPaint(state: CanvasState) {
  if (state.disposed || state.raf) return;
  state.raf = window.requestAnimationFrame(() => {
    state.raf = 0;
    if (!state.disposed) paint(state);
  });
}

function measure(state: CanvasState) {
  const rect = state.canvas.getBoundingClientRect();
  // The master frames are 1600x900. Rendering a 2x canvas on a retina display
  // adds millions of pixels without adding source detail, and makes every
  // composite more expensive. 1.5x is still above the source width at the
  // film's normal presentation size.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const pixelWidth = Math.max(1, Math.round(width * dpr));
  const pixelHeight = Math.max(1, Math.round(height * dpr));

  state.width = width;
  state.height = height;
  state.dpr = dpr;

  if (state.canvas.width !== pixelWidth) state.canvas.width = pixelWidth;
  if (state.canvas.height !== pixelHeight) state.canvas.height = pixelHeight;

  paint(state);
}

// className comes from the section so the canvas styles live in its CSS module
export function DevBoxFrameCanvas({
  progress,
  portraitStops = DEFAULT_PORTRAIT_STOPS,
  className,
}: {
  progress: MotionValue<number>;
  portraitStops?: PortraitStops;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<CanvasState | null>(null);
  const focusRef = useRef(portraitStops);
  const [ready, setReady] = useState(false);

  // The section re-measures its copy on resize; hand the new box position to the draw loop and repaint
  useEffect(() => {
    focusRef.current = portraitStops;
    const state = stateRef.current;
    if (!state) return;
    state.portraitStops = portraitStops;
    requestPaint(state);
  }, [portraitStops]);

  useMotionValueEvent(progress, "change", (value) => {
    const state = stateRef.current;
    if (!state) return;
    state.progress = value;
    requestPaint(state);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const set = isMobile ? SEQUENCE.mobile : SEQUENCE.desktop;

    const state: CanvasState = {
      canvas,
      ctx,
      images: Array.from({ length: set.count }, () => null),
      loaded: Array.from({ length: set.count }, () => false),
      loading: new Set(),
      queued: new Set(),
      queue: [],
      active: 0,
      center: -1,
      initialized: false,
      count: set.count,
      directory: set.dir,
      width: 1,
      height: 1,
      dpr: 1,
      raf: 0,
      progress: progress.get(),
      ready: false,
      disposed: false,
      onFirstPaint: () => setReady(true),
      portraitStops: focusRef.current,
    };

    // ready already starts false; setting it again here would trip react-hooks/set-state-in-effect
    stateRef.current = state;

    measure(state);
    void warmCache(state); // Fire and forget; it stops by itself when the canvas unmounts

    const observer = new ResizeObserver(() => measure(state));
    observer.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden) requestPaint(state);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      state.disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (state.raf) window.cancelAnimationFrame(state.raf);
      state.queue = [];
      state.queued.clear();
      state.loading.clear();
      for (const image of state.images) {
        closeFrame(image);
      }
      state.images = [];
      state.loaded = [];
      stateRef.current = null;
    };
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      data-ready={ready ? "true" : "false"}
      aria-hidden="true"
    />
  );
}
