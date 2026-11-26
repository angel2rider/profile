/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LoadingScreen from './LoadingScreen';
import ErrorBoundary from './ErrorBoundary';
import ViceBackground from './ViceBackground';
import { AUDIO_SRC } from './audioTimeline';
import { useAudioReactive } from './useAudioReactive';

const ProfileUI = lazy(() => import('./ProfileUI'));
const GateSceneCanvas = lazy(() => import('./GateScene'));

export default function App() {
  const { audioRef, rootRef, stage, phase, soundOn, startCount, reacting, showUI, countdown, time, unmute, syncNow } = useAudioReactive();
  const showingProfile = phase === 'intro' || phase === 'full';

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const VIDEO_BLACK_AT = 60.8;
  const showVideo = soundOn && time < VIDEO_BLACK_AT;
  const quotesMode = soundOn && !showVideo;

  // Warm the full video into the HTTP cache so the click has nothing to wait for.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();

    // Warm only the first chunk of whichever format this browser will use.
    // If the host ignores Range, cancel instead of re-downloading the whole film.
    const probe = document.createElement('video');
    const preferred = probe.canPlayType('video/webm; codecs="vp9"')
      ? '/vice-city-video-v2.webm'
      : '/vice-city-video-v2.mp4';
    const timer = window.setTimeout(() => {
      fetch(preferred, {
        headers: { Range: 'bytes=0-2097151' },
        priority: 'low',
      } as RequestInit)
        .then(async (res) => {
          if (res.status === 206) await res.arrayBuffer();
          else await res.body?.cancel();
        })
        .catch(() => {});
    }, 150);
    return () => window.clearTimeout(timer);
  }, []);

  // Play synchronously on the first gesture, ahead of React state updates.
  useEffect(() => {
    const playNow = () => {
      const video = videoRef.current;
      if (!video) return;
      if (video.currentTime > 0.1 && !video.paused) return;
      video.currentTime = 0;
      video.play().catch(() => {});
    };
    document.addEventListener('pointerdown', playNow, { once: true, capture: true });
    document.addEventListener('keydown', playNow, { once: true, capture: true });
    return () => {
      document.removeEventListener('pointerdown', playNow, { capture: true });
      document.removeEventListener('keydown', playNow, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (!startCount) return;
    const video = videoRef.current;
    if (!video || !video.paused) return;
    video.currentTime = 0;
    video.play().catch(() => {
      video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
    });
  }, [startCount]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const video = videoRef.current;
      const audio = audioRef.current;
      if (video && audio && !video.paused && !audio.paused) {
        if (Math.abs(video.currentTime - audio.currentTime) > 0.12) {
          try { video.currentTime = audio.currentTime; } catch { /* seek not ready */ }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [audioRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && time >= VIDEO_BLACK_AT && !video.paused) video.pause();
  }, [time]);

  // Backgrounded tabs pause rAF; resume the film against the audio clock.
  useEffect(() => {
    const onVisibility = () => {
      const video = videoRef.current;
      const audio = audioRef.current;
      if (!video || !audio) return;

      if (document.hidden) {
        if (!video.paused) video.pause();
        return;
      }

      syncNow();
      const t = audio.currentTime;
      if (startCount > 0 && t < VIDEO_BLACK_AT) {
        try {
          video.currentTime = Math.min(t, Math.max(0, (video.duration || t) - 0.05));
        } catch { /* seek not ready yet */ }
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [startCount, audioRef, syncNow]);


  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src="/vice-city-radio.opus" type="audio/ogg" />
        <source src={AUDIO_SRC} type="audio/mpeg" />
      </audio>
      <LoadingScreen isLoading={stage === 'loading'} />

      <div className="app-shell fixed inset-0 flex items-center justify-center bg-ink">
        <div
          ref={rootRef}
          className="relative z-10 h-full w-full overflow-hidden rounded-[10px] border border-cream/12 bg-ink shadow-[0_30px_120px_rgba(0,0,0,0.5)]"
        >
          <ViceBackground />

          {/* Intro film — synced to the same audio clock, silent to avoid doubling sound. */}
          <div className={`absolute inset-0 z-[1] overflow-hidden transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover [filter:contrast(1.03)_saturate(0.97)]"
            >
              <source src="/vice-city-video-v2.webm" type="video/webm" />
              <source src="/vice-city-video-v2.mp4" type="video/mp4" />
            </video>
            <div className="vice-video-pixels" />
          </div>

          {/* Station ID */}
          <div className="pointer-events-none absolute inset-x-6 top-5 z-30 hidden items-center justify-between sm:flex">
            <p className="font-hud text-[9px] tracking-[0.35em] text-cream/55">
              THEGT · VICE CITY RADIO
            </p>
            <p className="font-hud text-[9px] tracking-[0.35em] text-cream/40">
              89.6 FM · LEONIDA
            </p>
          </div>



          <AnimatePresence>
            {!showingProfile && (
              <motion.div
                className="absolute inset-0 z-50 flex touch-manipulation items-center justify-center rounded-[10px]"
                onClick={unmute}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') unmute(); }}
                role="button"
                tabIndex={0}
                aria-label="Tap to enable sound; the profile appears on the beat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
              >
                <Suspense fallback={<div className="font-display text-4xl text-cream/60">TheGT</div>}>
                  <GateSceneCanvas countdown={countdown} soundOn={soundOn} time={time} />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>

          {showingProfile && (
            <ErrorBoundary>
              <div className="no-scrollbar absolute inset-0 z-10 flex flex-col overflow-hidden rounded-[10px]">
                <Suspense fallback={null}>
                  <ProfileUI showUI={showUI} audioRef={audioRef} phase={phase} quotesMode={quotesMode} />
                </Suspense>
              </div>
            </ErrorBoundary>
          )}

          {!soundOn && showingProfile && (
            <button
              onClick={unmute}
              className="absolute bottom-6 right-5 z-30 font-hud text-[9px] tracking-[0.25em] text-cream/45 transition-colors hover:text-cream"
              aria-label="Enable sound"
            >
              SOUND OFF · TAP
            </button>
          )}

          {/* Song progress — a quiet reason to stay until the end. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-px bg-cream/10">
            <div
              className="audio-progress vice-gradient h-full"
              style={{ width: 'calc(var(--audio-progress) * 100%)' }}
            />
          </div>

        </div>
      </div>
    </>
  );
}
