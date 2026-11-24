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

// ---------- Framing on screens that are not plain widescreen ----------

// The frames are 16:9; anything at or below 4:5 (phones, portrait iPads) gets the stacked layout
export const FRAME_ASPECT = 16 / 9;
export const isPortraitScreen = (width: number, height: number) => width / height <= 0.8;

// The closed box takes about 70% of the frame width, so at 1.3 it spans the phone with a gutter either side
const BOOKEND_ZOOM = 1.3;
// The open box needs the whole frame width for its side panels
const STORY_ZOOM = 1.07;

// Clears the floating navbar pill above the box and leaves a margin under the copy
const NAV_CLEARANCE = 88;
const BOTTOM_CLEARANCE = 28;
// Where the box starts inside its frame: the closed box sits low in the studio, the open one fills it
const CLOSED_BOX_TOP = 0.28;
const OPEN_BOX_TOP = 0.06;
// Where the box (with its reflection) ends inside its frame; copy starts below that, never on the box
const CLOSED_FLOOR = 0.12;
const OPEN_FLOOR = 0.06;
// Space between the box and its copy, above or below
const PAIR_GAP = 24;
// Leftover height goes 45% above the pair and 55% below, since the eye reads a touch above the true centre
const OPTICAL_BIAS = 0.45;

// Vertical centre of the frame, as a share of the screen height, for every beat on portrait screens
export type PortraitStops = { intro: number; chapters: number[]; finale: number };
// Used until the copy has been measured
export const DEFAULT_PORTRAIT_STOPS: PortraitStops = {
  intro: 0.42,
  chapters: CHAPTER_TIMINGS.map(() => 0.3),
  finale: 0.36,
};

const smoothstep = (start: number, end: number, value: number) => {
  const local = clamp((value - start) / (end - start));
  return local * local * (3 - 2 * local);
};
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

// 1 on the opening and closing beats, 0 during the chapters, eased in between so the box glides
function bookendAmount(progress: number) {
  return progress < 0.5 ? 1 - smoothstep(0.06, 0.2, progress) : smoothstep(0.9, 0.955, progress);
}

// Each beat holds its framing while its copy is fully shown; between holds the box glides to the next spot
function portraitKeyframes(stops: PortraitStops) {
  return [
    { start: 0, end: 0.06, zoom: BOOKEND_ZOOM, focus: stops.intro },
    ...CHAPTER_TIMINGS.map((timing, index) => ({
      start: timing.full,
      end: timing.exitStart,
      zoom: STORY_ZOOM,
      focus: stops.chapters[index] ?? DEFAULT_PORTRAIT_STOPS.chapters[index],
    })),
    { start: 0.955, end: 1, zoom: BOOKEND_ZOOM, focus: stops.finale },
  ];
}

// Zoom and vertical focus of the frame on portrait screens at this point in the film
export function portraitFraming(progress: number, stops: PortraitStops) {
  const keys = portraitKeyframes(stops);
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    if (progress > key.end) continue;
    if (index === 0 || progress >= key.start) return { zoom: key.zoom, focus: key.focus };
    const previous = keys[index - 1];
    const amount = smoothstep(previous.end, key.start, progress);
    return { zoom: lerp(previous.zoom, key.zoom, amount), focus: lerp(previous.focus, key.focus, amount) };
  }
  const last = keys[keys.length - 1];
  return { zoom: last.zoom, focus: last.focus };
}

// Wider screens play the film in a smaller stage, so every beat's copy gets its own band and never sits on the box
const STAGE_MAX_WIDTH = 0.86; // Share of the screen width
const STAGE_MAX_HEIGHT = 0.6; // Share of the screen height
const STAGE_TOP_STORY = 0.1; // Chapters and closing: just under the navbar, copy band below
const STAGE_TOP_INTRO = 0.3; // Opening: under the centred title
// Height kept free under the stage for chapter copy, so short laptops get a smaller box instead of copy on top of it
const COPY_BAND = 300;

// Size and position of the frame on screens wider than 4:5; the stage eases down for the opening title
export function stageLayout(width: number, height: number, progress: number) {
  const maxHeight = Math.min(height * STAGE_MAX_HEIGHT, height * (1 - STAGE_TOP_STORY) - COPY_BAND);
  const dw = Math.min(width * STAGE_MAX_WIDTH, maxHeight * FRAME_ASPECT);
  const dh = dw / FRAME_ASPECT;
  const intro = progress < 0.5 ? bookendAmount(progress) : 0;
  return { dx: (width - dw) / 2, dy: height * lerp(STAGE_TOP_STORY, STAGE_TOP_INTRO, intro), dw, dh };
}

type PairShape = { zoom: number; boxTop: number; floor: number; copyFirst: boolean };

// One beat on a portrait screen: copy above or below the box, the pair just above centre under the navbar
function stackPair(width: number, height: number, copyHeight: number, shape: PairShape) {
  const frameHeight = (width * shape.zoom) / FRAME_ASPECT;
  const boxSpan = frameHeight * (1 - shape.floor - shape.boxTop);
  const gap = PAIR_GAP;
  const room = height - NAV_CLEARANCE - BOTTOM_CLEARANCE;
  const pairTop = NAV_CLEARANCE + Math.max(0, (room - boxSpan - gap - copyHeight) * OPTICAL_BIAS);

  if (shape.copyFirst) {
    // The opening title starts right under the navbar, so no empty band opens up after the Toolbox section above
    const boxStart = NAV_CLEARANCE + copyHeight + gap;
    return { copyTop: NAV_CLEARANCE, focus: (boxStart - frameHeight * shape.boxTop + frameHeight / 2) / height };
  }

  // Short phones: the copy never drops below the bottom margin, the box rides up instead
  const copyTop = Math.min(pairTop + boxSpan + gap, height - BOTTOM_CLEARANCE - copyHeight);
  const frameTop = copyTop - gap - frameHeight * (1 - shape.floor);
  return { copyTop, focus: (frameTop + frameHeight / 2) / height };
}

// Opening beat: copy first, the closed box straight under it
export const stackIntro = (width: number, height: number, copyHeight: number) =>
  stackPair(width, height, copyHeight, { zoom: BOOKEND_ZOOM, boxTop: CLOSED_BOX_TOP, floor: CLOSED_FLOOR, copyFirst: true });

// Chapters: the open box, its copy straight under it
export const stackChapter = (width: number, height: number, copyHeight: number) =>
  stackPair(width, height, copyHeight, { zoom: STORY_ZOOM, boxTop: OPEN_BOX_TOP, floor: OPEN_FLOOR, copyFirst: false });

// Closing beat: the closed box, the copy and specs straight under it
// The closing copy ends as far above the section bottom as the opening title starts below its top, so both ends match
export function stackFinale(width: number, height: number, copyHeight: number) {
  const pair = stackPair(width, height, copyHeight, { zoom: BOOKEND_ZOOM, boxTop: CLOSED_BOX_TOP, floor: CLOSED_FLOOR, copyFirst: false });
  const copyTop = height - NAV_CLEARANCE - copyHeight;
  return { copyTop, focus: pair.focus + (copyTop - pair.copyTop) / height };
}
