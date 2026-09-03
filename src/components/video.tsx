'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, options: any) => {
        mute: () => void;
        playVideo: () => void;
        unloadModule?: (moduleName: string) => void;
        setOption?: (module: string, option: string, value: unknown) => void;
        destroy: () => void;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const VIDEO_ID = 'ux5jJgNkslE';

export default function VideoEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let player:
      | {
          destroy: () => void;
        }
      | null = null;
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

      player = new window.YT.Player(containerRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: {
            target: {
              mute: () => void;
              playVideo: () => void;
              unloadModule?: (moduleName: string) => void;
              setOption?: (module: string, option: string, value: unknown) => void;
            };
          }) => {
            event.target.mute();
            event.target.playVideo();
            disableCaptions(event.target);
          },
          onStateChange: (event: {
            data: number;
            target: {
              unloadModule?: (moduleName: string) => void;
              setOption?: (module: string, option: string, value: unknown) => void;
            };
          }) => {
            if (event.data === 1) {
              disableCaptions(event.target);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      setupPlayer();
      return () => {
        isMounted = false;
        player?.destroy();
      };
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
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

    return () => {
      isMounted = false;
      player?.destroy();
      if (window.onYouTubeIframeAPIReady === setupPlayer) {
        window.onYouTubeIframeAPIReady = previousReady;
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black pointer-events-none">
      <div
        ref={containerRef}
        className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full [&>iframe]:pointer-events-none"
      />
    </div>
  );
}
