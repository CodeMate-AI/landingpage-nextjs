'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
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
  SCROLL_LENGTH_VH,
  SEQUENCE,
  stageAtProgress,
  type BeatTiming,
} from '@/lib/devbox-film';
import { DevBoxFrameCanvas } from './DevBoxFrameCanvas';
import DevBoxStaticStory from './DevBoxStaticStory';
import styles from './DevBoxSection.module.css';

// Intro plus one stage per chapter, one tick each on the progress rail
const STAGE_COUNT = DEVBOX_DATA.chapters.length + 1;
const FINALE_BEAT = DEVBOX_DATA.chapters.length + 1;

const pad = (value: number) => String(value).padStart(2, '0');

// Overline, headline and scroll cue over the closed box; fades out as the lid lifts
function IntroCopy({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  const opacity = useTransform(progress, [0, INTRO_EXIT * 0.7, INTRO_EXIT], [1, 1, 0]);
  const y = useTransform(progress, [0, INTRO_EXIT], [0, -24]);

  return (
    <motion.div className={styles.intro} style={{ opacity, y }} aria-hidden={!active}>
      <div>
        <span className={styles.overline}>
          <span translate="no">CodeMate Dev Box</span>, powered by HP&apos;s{' '}
          <span translate="no">ZGX Nano</span>
        </span>
        <h2 id="devbox-title" className={styles.title}>
          <span className={styles.titlePlain}>{DEVBOX_DATA.titlePrefix}</span>
          <span className={styles.titleHighlight}>{DEVBOX_DATA.titleHighlight}</span>
        </h2>
      </div>
      {/* On laptops this column moves to the top right so the copy stays above the box */}
      <div className={styles.introAside}>
        <p className={styles.support}>{DEVBOX_DATA.support}</p>
        <div className={styles.cue}>
          <span>{DEVBOX_DATA.scrollCue}</span>
          <span className={styles.cueLine} />
        </div>
      </div>
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
}: {
  progress: MotionValue<number>;
  chapter: DevBoxChapter;
  timing: BeatTiming;
  number: number;
  active: boolean;
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
      className={styles.copy}
      style={{ opacity, y }}
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
      {chapter.showStack && <LayerList />}
    </motion.div>
  );
}

// The coworker stack, top to bottom, ending on the hardware the film is showing
function LayerList() {
  return (
    <div className={styles.layers}>
      <span className={styles.layersLabel}>{DEVBOX_DATA.stackLabel}</span>
      <ol className={styles.layerList}>
        {DEVBOX_DATA.stack.map((layer) => (
          <li key={layer} className={styles.layer}>
            {layer}
          </li>
        ))}
      </ol>
      <p className={styles.layersTools}>{DEVBOX_DATA.stackTools}</p>
    </div>
  );
}

// Closing line once the box has reassembled; it stays on screen until the section scrolls away
function FinaleCopy({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  const opacity = useTransform(progress, [FINALE_ENTER, FINALE_FULL], [0, 1]);
  const y = useTransform(progress, [FINALE_ENTER, 1], [26, 0]);

  return (
    <motion.div className={styles.copy} style={{ opacity, y }} aria-hidden={!active}>
      <span className={styles.eyebrow} translate="no">
        {DEVBOX_DATA.finaleLabel}
      </span>
      <h3 className={styles.copyTitle}>{DEVBOX_DATA.finaleHeadline}</h3>
      <p className={styles.copyBody}>
        {/* Brand name kept out of Google Translate, per the language switcher rule */}
        <span translate="no">CodeMate AI</span>, ready to run on HP&apos;s{' '}
        <span translate="no">ZGX Nano</span>.
      </p>
    </motion.div>
  );
}

// Five ticks plus "01 Dev Box" at the bottom of every stage; decorative, so hidden from screen readers
function ProgressRail({ stage }: { stage: number }) {
  const label = stage === 0 ? DEVBOX_DATA.introLabel : DEVBOX_DATA.chapters[stage - 1].label;

  return (
    <div className={styles.rail} aria-hidden="true">
      <span className={styles.railIndex}>{pad(stage + 1)}</span>
      <span className={styles.railTicks}>
        {Array.from({ length: STAGE_COUNT }, (_, index) => (
          <span key={index} className={styles.railTick} data-on={index <= stage ? 'true' : undefined} />
        ))}
      </span>
      <span>{label}</span>
    </div>
  );
}

export default function DevBoxSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // A slight push-in on the closed box at both ends of the film
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.96, 1], [1.018, 1, 1, 1.012]);

  // Frames start downloading about one screen before the section, so they never slow the hero
  const isNear = useInView(sectionRef, { once: true, margin: '100% 0px 100% 0px' });

  const [beat, setBeat] = useState(0);
  const [stage, setStage] = useState(0);

  // Only re-render when the visible beat or stage actually changes, not on every scroll tick
  const sync = (value: number) => {
    const nextBeat = activeBeatAtProgress(value);
    const nextStage = stageAtProgress(value);
    setBeat((current) => (current === nextBeat ? current : nextBeat));
    setStage((current) => (current === nextStage ? current : nextStage));
  };

  useMotionValueEvent(scrollYProgress, 'change', sync);

  // Pick up the right beat when the page loads already scrolled into the section
  useEffect(() => {
    const frame = requestAnimationFrame(() => sync(scrollYProgress.get()));
    return () => cancelAnimationFrame(frame);
  }, [scrollYProgress]);

  // Scroll length lives in devbox-film.ts so it can be tuned in one place
  const lengthVars = {
    '--devbox-length': `${SCROLL_LENGTH_VH.desktop}vh`,
    '--devbox-length-mobile': `${SCROLL_LENGTH_VH.mobile}vh`,
  } as CSSProperties;

  return (
    <>
      <section
        ref={sectionRef}
        className={`${styles.section} ${styles.motionOnly}`}
        style={lengthVars}
        data-beat={beat}
        aria-labelledby="devbox-title"
      >
        <div className={styles.sticky}>
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
            {isNear && <DevBoxFrameCanvas progress={scrollYProgress} className={styles.canvas} />}
          </motion.div>

          <div className={styles.scrim} />
          <div className={styles.grain} />

          <IntroCopy progress={scrollYProgress} active={beat === 0} />
          {DEVBOX_DATA.chapters.map((chapter, index) => (
            <ChapterCopy
              key={chapter.id}
              progress={scrollYProgress}
              chapter={chapter}
              timing={CHAPTER_TIMINGS[index]}
              number={index + 2}
              active={beat === index + 1}
            />
          ))}
          <FinaleCopy progress={scrollYProgress} active={beat === FINALE_BEAT} />
          <ProgressRail stage={stage} />
        </div>
      </section>

      <DevBoxStaticStory />
    </>
  );
}
