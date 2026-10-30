'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface YTPlayerInstance {
  mute: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  unloadModule?: (moduleName: string) => void;
  setOption?: (module: string, option: string, value: unknown) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, options: any) => YTPlayerInstance;
      PlayerState?: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface VideoEmbedProps {
  videoId?: string;
  shouldPlay?: boolean;
}

const DEFAULT_VIDEO_ID = 'ux5jJgNkslE';

export default function VideoEmbed({
  videoId = DEFAULT_VIDEO_ID,
  shouldPlay = false,
}: VideoEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const shouldPlayRef = useRef(shouldPlay);
  const isWarmedUpRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Synchronize shouldPlay state with player playback
  useEffect(() => {
    shouldPlayRef.current = shouldPlay;
    if (!playerRef.current) return;

    if (shouldPlay) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [shouldPlay]);

  // Preload YouTube API and initialize player immediately on component mount
  useEffect(() => {
    let isMounted = true;

    const disableCaptions = (target: {
      unloadModule?: (moduleName: string) => void;
      setOption?: (module: string, option: string, value: unknown) => void;
    }) => {
      target.unloadModule?.('captions');
      target.unloadModule?.('cc');
      target.setOption?.('captions', 'track', {});
      target.setOption?.('cc', 'track', {});
    };

    const setupPlayer = () => {
      if (!isMounted || !containerRef.current || !window.YT?.Player) {
        return;
      }

      new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          mute: 1,
          loop: 1,
          playlist: videoId,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          cc_lang_pref: 'none',
          playsinline: 1,
        },
        events: {
          onReady: (event: { target: YTPlayerInstance }) => {
            if (!isMounted) return;
            playerRef.current = event.target;
            event.target.mute();
            disableCaptions(event.target);

            // If the user already scrolled into position, play immediately; otherwise warm up buffer
            if (shouldPlayRef.current) {
              event.target.playVideo();
            } else {
              event.target.playVideo();
            }
          },
          onStateChange: (event: { data: number; target: YTPlayerInstance }) => {
            if (!isMounted) return;

            // State 1: PLAYING
            if (event.data === 1) {
              disableCaptions(event.target);

              // If pre-buffering while out of viewport, pause and hold at beginning
              if (!shouldPlayRef.current && !isWarmedUpRef.current) {
                isWarmedUpRef.current = true;
                event.target.pauseVideo();
                event.target.seekTo(0, true);
              } else if (shouldPlayRef.current) {
                setIsPlaying(true);
              }
            }

            // State 0: ENDED (Seamless loop fail-safe)
            if (event.data === 0) {
              event.target.seekTo(0, true);
              event.target.playVideo();
            }
          },
        },
      });
    };

    const initYouTube = () => {
      if (window.YT?.Player) {
        setupPlayer();
        return;
      }

      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        setupPlayer();
      };
    };

    // Eagerly initialize on mount for zero-latency readiness
    initYouTube();

    return () => {
      isMounted = false;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black pointer-events-none">
      {/* Preloaded YouTube player iframe */}
      <div
        ref={containerRef}
        className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:pointer-events-none"
      />

      {/* High-resolution preview poster eliminates blank screens and fades when playback begins */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 pointer-events-none ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={thumbnailUrl}
          alt="CodeMate Video Preview"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
