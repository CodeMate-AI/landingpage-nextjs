'use client';

import React, { useEffect, useRef, useState, type CSSProperties, type Ref } from 'react';
import Image from 'next/image';
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { DEVBOX_DATA, type DevBoxChapter } from '@/data/landingData';
import {
  activeBeatAtProgress,
  CHAPTER_TIMINGS,
  FINALE_ENTER,
  FINALE_FULL,
  INTRO_EXIT,
  isPortraitScreen,
  SCROLL_LENGTH_VH,
  SEQUENCE,
  stackChapter,
  stackFinale,
  stackIntro,
  type BeatTiming,
  type PortraitStops,
} from '@/lib/devbox-film';
import { DevBoxFrameCanvas } from './DevBoxFrameCanvas';
import DevBoxStaticStory from './DevBoxStaticStory';
import styles from './DevBoxSection.module.css';

const FINALE_BEAT = DEVBOX_DATA.chapters.length + 1;

const pad = (value: number) => String(value).padStart(2, '0');

// Portrait screens pin each copy block at its measured top; wider screens keep the CSS anchor
const placement = (top?: number) => (top === undefined ? {} : { top, bottom: 'auto' });

// Opening beat: label, headline and one line centred above the closed box; fades out as the lid lifts
function IntroCopy({
  progress,
  active,
  ref,
  stackTop,
}: {
  progress: MotionValue<number>;
  active: boolean;
  ref: Ref<HTMLDivElement>;
  stackTop?: number;
}) {
  const opacity = useTransform(progress, [0, INTRO_EXIT * 0.7, INTRO_EXIT], [1, 1, 0]);
  const y = useTransform(progress, [0, INTRO_EXIT], [0, -24]);

  return (
    <motion.div
      ref={ref}
      className={styles.copy}
      data-bookend="intro"
      style={{ opacity, y, ...placement(stackTop) }}
      aria-hidden={!active}
    >
      <span className={styles.eyebrow} translate="no">
        {DEVBOX_DATA.introLabel}
      </span>
      {/* White first half, cyan second half, the same two-tone headline as the Toolbox section */}
      <h2 id="devbox-title" className={styles.title}>
        <span className={styles.titlePlain}>{DEVBOX_DATA.introTitlePrefix}</span>
        <span className={styles.titleHighlight}>{DEVBOX_DATA.introTitleHighlight}</span>
      </h2>
      <p className={styles.copyBody}>
        {/* Brand names kept out of Google Translate, per the language switcher rule */}
        <span translate="no">CodeMate AI</span>, ready to run on HP&apos;s{' '}
        <span translate="no">ZGX Nano</span>.
      </p>
    </motion.div>
  );
}

// One capability over its stage of the film; fades in and out on its own timing window
function ChapterCopy({
  progress,
  chapter,
  timing,
  number,
  active,
  ref,
  stackTop,
}: {
  progress: MotionValue<number>;
  chapter: DevBoxChapter;
  timing: BeatTiming;
  number: number;
  active: boolean;
  ref: Ref<HTMLDivElement>;
  stackTop?: number;
}) {
  const opacity = useTransform(
    progress,
    [timing.enter, timing.full, timing.exitStart, timing.exit],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [timing.enter, timing.exit], [30, -24]);

  return (
    // data-stack lets laptops lay the layer list out to the right of the copy
    <motion.div
      ref={ref}
      className={styles.copy}
      style={{ opacity, y, ...placement(stackTop) }}
      aria-hidden={!active}
      data-stack={chapter.showStack ? 'true' : undefined}
    >
      <div>
        <span className={styles.eyebrow}>
          <span className={styles.eyebrowNumber}>{pad(number)}</span>
          {chapter.label}
        </span>
        <h3 className={styles.copyTitle}>{chapter.headline}</h3>
        <p className={styles.copyBody}>{chapter.body}</p>
      </div>
      {chapter.showStack && <LayerList progress={progress} timing={timing} />}
    </motion.div>
  );
}

// The coworker stack, top to bottom; the highlighted row follows the scroll while the chapter is fully shown
function LayerList({ progress, timing }: { progress: MotionValue<number>; timing: BeatTiming }) {
  const count = DEVBOX_DATA.stack.length;
  const [activeLayer, setActiveLayer] = useState(0);

  // Split the chapter's fully visible window into equal slices, one per row, so scrolling up walks back up the list
  useMotionValueEvent(progress, 'change', (value) => {
    const local = (value - timing.full) / (timing.exitStart - timing.full);
    const next = Math.min(count - 1, Math.max(0, Math.floor(local * count)));
    setActiveLayer((current) => (current === next ? current : next));
  });

  return (
    <div className={styles.layers}>
      <span className={styles.layersLabel}>{DEVBOX_DATA.stackLabel}</span>
      <ol className={styles.layerList}>
        {DEVBOX_DATA.stack.map((layer, index) => (
          <li
            key={layer}
            className={styles.layer}
            data-active={index === activeLayer ? 'true' : undefined}
          >
            {layer}
          </li>
        ))}
      </ol>
      <p className={styles.layersTools}>{DEVBOX_DATA.stackTools}</p>
    </div>
  );
}

// Closing beat once the box has reassembled: the Sovereign AI line plus the ZGX Nano specs; it stays until the section scrolls away
function FinaleCopy({
  progress,
  active,
  ref,
  stackTop,
}: {
  progress: MotionValue<number>;
  active: boolean;
  ref: Ref<HTMLDivElement>;
  stackTop?: number;
}) {
  const opacity = useTransform(progress, [FINALE_ENTER, FINALE_FULL], [0, 1]);
  const y = useTransform(progress, [FINALE_ENTER, 1], [26, 0]);

  return (
    <motion.div
      ref={ref}
      className={styles.copy}
      data-bookend="finale"
      style={{ opacity, y, ...placement(stackTop) }}
      aria-hidden={!active}
    >
      {/* Headline group and specs are two cells, so wide screens can set them side by side in one band */}
      <div>
        <h3 className={styles.copyTitle}>
          <span className={styles.titlePlain}>{DEVBOX_DATA.titlePrefix}</span>
          <span className={styles.titleHighlight}>{DEVBOX_DATA.titleHighlight}</span>
        </h3>
        <p className={styles.copyBody}>{DEVBOX_DATA.support}</p>
      </div>
      {/* The ZGX Nano hardware behind the coworker, in four short facts */}
      <dl className={styles.specs}>
        {DEVBOX_DATA.specs.map((spec) => (
          <div key={spec.value} className={styles.spec}>
            <dt className={styles.specValue} translate="no">
              {spec.value}
            </dt>
            <dd className={styles.specLabel}>{spec.label}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}

// Where every beat's copy and box sit on portrait screens; null on wider screens, which keep the CSS layout
type BeatStack = { introTop: number; chapterTops: number[]; finaleTop: number; stops: PortraitStops } | null;

export default function DevBoxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const finaleRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [stack, setStack] = useState<BeatStack>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // A slight push-in on the closed box at both ends of the film
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.96, 1], [1.018, 1, 1, 1.012]);

  // Frames start downloading two screens before the section: early enough to be ready, late enough not to slow the hero
  const isNear = useInView(sectionRef, { once: true, margin: '200% 0px 200% 0px' });

  const [beat, setBeat] = useState(0);

  // Only re-render when the visible beat actually changes, not on every scroll tick
  const sync = (value: number) => {
    const nextBeat = activeBeatAtProgress(value);
    setBeat((current) => (current === nextBeat ? current : nextBeat));
  };

  useMotionValueEvent(scrollYProgress, 'change', sync);

  // Pick up the right beat when the page loads already scrolled into the section
  useEffect(() => {
    const frame = requestAnimationFrame(() => sync(scrollYProgress.get()));
    return () => cancelAnimationFrame(frame);
  }, [scrollYProgress]);

  // Phones and portrait iPads: measure every beat's copy and pair it with the box so no beat leaves a blank band; re-runs on resize
  useEffect(() => {
    const sticky = stickyRef.current;
    const intro = introRef.current;
    const finale = finaleRef.current;
    const chapters = chapterRefs.current.filter((element): element is HTMLDivElement => element !== null);
    if (!sticky || !intro || !finale || chapters.length !== DEVBOX_DATA.chapters.length) return;

    const measure = () => {
      const width = sticky.clientWidth;
      const height = sticky.clientHeight;
      if (!isPortraitScreen(width, height)) {
        setStack(null);
        return;
      }
      const opening = stackIntro(width, height, intro.offsetHeight);
      const middle = chapters.map((chapter) => stackChapter(width, height, chapter.offsetHeight));
      const closing = stackFinale(width, height, finale.offsetHeight);
      setStack({
        introTop: opening.copyTop,
        chapterTops: middle.map((pair) => pair.copyTop),
        finaleTop: closing.copyTop,
        stops: { intro: opening.focus, chapters: middle.map((pair) => pair.focus), finale: closing.focus },
      });
    };

    // The observer also fires once on start, so the first layout needs no direct call here
    const observer = new ResizeObserver(measure);
    [sticky, intro, finale, ...chapters].forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Scroll length lives in devbox-film.ts so it can be tuned in one place; the focus var places the portrait poster
  const sectionVars = {
    '--devbox-length': `${SCROLL_LENGTH_VH.desktop}vh`,
    '--devbox-length-mobile': `${SCROLL_LENGTH_VH.mobile}vh`,
    ...(stack && { '--devbox-intro-focus': stack.stops.intro }),
  } as CSSProperties;

  return (
    <>
      <section
        ref={sectionRef}
        className={`${styles.section} ${styles.motionOnly}`}
        style={sectionVars}
        data-beat={beat}
        aria-labelledby="devbox-title"
      >
        <div ref={stickyRef} className={styles.sticky}>
          <motion.div className={styles.media} style={{ scale }}>
            {/* Poster holds the frame until the canvas has painted its first frame */}
            <div className={styles.posterLayer}>
              <Image
                src={SEQUENCE.posterBlur}
                alt=""
                width={32}
                height={18}
                unoptimized
                className={styles.posterBlur}
              />
              <Image
                src={SEQUENCE.poster}
                alt="CodeMate Dev Box on HP's ZGX Nano"
                width={1600}
                height={900}
                unoptimized
                className={styles.poster}
              />
            </div>
            {isNear && (
              <DevBoxFrameCanvas
                progress={scrollYProgress}
                portraitStops={stack?.stops}
                className={styles.canvas}
              />
            )}
          </motion.div>

          <div className={styles.scrim} />
          <div className={styles.grain} />

          <IntroCopy ref={introRef} progress={scrollYProgress} active={beat === 0} stackTop={stack?.introTop} />
          {DEVBOX_DATA.chapters.map((chapter, index) => (
            <ChapterCopy
              key={chapter.id}
              progress={scrollYProgress}
              chapter={chapter}
              timing={CHAPTER_TIMINGS[index]}
              number={index + 1} // The intro has no number, so chapters count from 01
              active={beat === index + 1}
              ref={(element) => {
                chapterRefs.current[index] = element;
              }}
              stackTop={stack?.chapterTops[index]}
            />
          ))}
          <FinaleCopy
            ref={finaleRef}
            progress={scrollYProgress}
            active={beat === FINALE_BEAT}
            stackTop={stack?.finaleTop}
          />
        </div>
      </section>

      <DevBoxStaticStory />
    </>
  );
}
