// Scroll film timing for the CodeMate Dev Box section (ported from the zgx-app reference).

// Bump the folder version when frames change, since /devbox/* is cached as immutable for a year
const FRAME_ROOT = '/devbox/v1';

export const SEQUENCE = {
  desktop: { count: 120, dir: `${FRAME_ROOT}/desktop` },
  mobile: { count: 90, dir: `${FRAME_ROOT}/mobile` },
  poster: `${FRAME_ROOT}/poster.webp`,
  posterBlur: `${FRAME_ROOT}/poster-blur.webp`,
} as const;

// Pinned scroll length in vh; still being tuned (560 is the reference, about 300 is the shorter option)
export const SCROLL_LENGTH_VH = { desktop: 560, mobile: 500 } as const;

export const frameSrc = (dir: string, index: number) =>
  `${dir}/${String(Math.min(index + 1, 9999)).padStart(4, '0')}.webp`;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

// Progress to frame position: hold, take apart, hold exploded, reassemble, hold the closed box
const FRAME_ANCHORS: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0.15, 0],
  [0.25, 39 / 119],
  [0.34, 59 / 119],
  [0.48, 89 / 119],
  [0.62, 1],
  [0.64, 1],
  [0.96, 0],
  [1, 0],
];

export function frameTAtProgress(progress: number) {
  const value = clamp(progress);
  for (let index = 0; index < FRAME_ANCHORS.length - 1; index += 1) {
    const [startProgress, startFrame] = FRAME_ANCHORS[index];
    const [endProgress, endFrame] = FRAME_ANCHORS[index + 1];
    if (value <= endProgress) {
      const span = endProgress - startProgress;
      const local = span <= 0 ? 0 : (value - startProgress) / span;
      return startFrame + (endFrame - startFrame) * local;
    }
  }
  return 0;
}

export function frameIndexAtProgress(progress: number, count: number) {
  return frameTAtProgress(progress) * (count - 1);
}

// When a chapter's copy fades in (enter to full) and out (exitStart to exit), in section progress
export type BeatTiming = { enter: number; full: number; exitStart: number; exit: number };

// One timing per capability chapter, in the order of DEVBOX_DATA.chapters
export const CHAPTER_TIMINGS: BeatTiming[] = [
  { enter: 0.145, full: 0.172, exitStart: 0.307, exit: 0.34 },
  { enter: 0.34, full: 0.366, exitStart: 0.454, exit: 0.48 },
  { enter: 0.48, full: 0.506, exitStart: 0.614, exit: 0.64 },
  { enter: 0.66, full: 0.69, exitStart: 0.87, exit: 0.9 },
];

// The intro fades out as the lid starts to lift, the closing line fades in on the reassembled box
export const INTRO_EXIT = 0.145;
export const FINALE_ENTER = 0.94;
export const FINALE_FULL = 0.965;

// Beat 0 is the intro, 1..n the chapters, n+1 the finale, -1 the gaps between them
export function activeBeatAtProgress(progress: number) {
  if (progress < INTRO_EXIT) return 0;
  if (progress >= FINALE_ENTER) return CHAPTER_TIMINGS.length + 1;
  const chapter = CHAPTER_TIMINGS.findIndex((t) => progress >= t.enter && progress < t.exit);
  return chapter === -1 ? -1 : chapter + 1;
}
