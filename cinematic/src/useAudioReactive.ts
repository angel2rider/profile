import { useEffect, useRef, useState } from 'react';
import {
  AUDIO_SRC,
  BEATS,
  DROP_PULSES,
  ENERGY,
  FIRST_DROP,
  FULL_REVEAL_TIME,
  TRACK_DURATION,
  HIGH,
  LOW,
  MID,
  REACTIVE_END,
  REVEAL_TIME,
  SECTION_CHANGES,
  sampleEnvelope,
} from './audioTimeline';

type Stage = 'loading' | 'gate' | 'intro' | 'full';

const clamp = (v: number, min = 0, max = 1.2) => Math.min(max, Math.max(min, v));

export function useAudioReactive() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);
  const stoppedRef = useRef(false);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const freqDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const sectionIndexRef = useRef(0);
  const dropIndexRef = useRef(0);
  const fallbackStartRef = useRef(0);

  const [stage, setStage] = useState<Stage>('loading');
  const [time, setTime] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [startCount, setStartCount] = useState(0);
  const [reacting, setReacting] = useState(true);

  // Apply the current audio time to the UI. Used by the frame loop and by
  // visibilitychange so a backgrounded tab catches up in one shot.
  const applyTimeline = (t: number) => {
    setTime(t);
    if (t >= REVEAL_TIME) {
      setStage((prev) => (prev === 'gate' || prev === 'loading' ? 'intro' : prev));
    }
    if (t >= FULL_REVEAL_TIME) {
      setStage((prev) => (prev === 'gate' || prev === 'loading' || prev === 'intro' ? 'full' : prev));
    }
  };

  const syncNow = () => {
    const audio = audioRef.current;
    if (audio) applyTimeline(audio.currentTime);
  };


  // Nothing plays until the visitor clicks/taps the page.
  const start = (force = false) => {
    if (startedRef.current && !force) return;
    startedRef.current = true;

    const audio = audioRef.current;
    fallbackStartRef.current = performance.now();
    stoppedRef.current = false;
    sectionIndexRef.current = 0;
    dropIndexRef.current = 0;
    setTime(0);
    setStage('gate');
    setReacting(true);
    setSoundOn(true);
    setStartCount((n) => n + 1);

    if (audio) {
      audio.muted = false;
      audio.volume = 1;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }

    if (!contextRef.current) {
      try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        const context = new Ctx() as AudioContext;
        const source = context.createMediaElementSource(audio!);
        const analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.68;
        source.connect(analyser);
        analyser.connect(context.destination);
        contextRef.current = context;
        analyserRef.current = analyser;
        freqDataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
      } catch {
        // Audio still plays if the analyser cannot be attached.
      }
    }
    contextRef.current?.resume().catch(() => {});
  };

  useEffect(() => {
    const onDown = () => start();
    document.addEventListener('pointerdown', onDown, { once: true });
    document.addEventListener('keydown', onDown, { once: true });
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onDown);
    };
  }, []);

  // Separate from the audio guard so StrictMode's double-mount can't leave us stuck on the loader.
  useEffect(() => {
    const gateTimer = window.setTimeout(() => {
      setStage((prev) => (prev === 'loading' ? 'gate' : prev));
    }, 900);
    return () => window.clearTimeout(gateTimer);
  }, []);

  // First gesture turns the sound on and unlocks the analyser.
  useEffect(() => {
    const enableSound = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.muted = false;
      audio.play().catch(() => {});
      setSoundOn(true);

      if (!contextRef.current) {
        try {
          const Ctx = window.AudioContext || (window as any).webkitAudioContext;
          const context = new Ctx() as AudioContext;
          const source = context.createMediaElementSource(audio);
          const analyser = context.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.68;
          source.connect(analyser);
          analyser.connect(context.destination);
          contextRef.current = context;
          analyserRef.current = analyser;
          freqDataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
        } catch {
          // Audio still plays even if the analyser cannot be attached.
        }
      }
      contextRef.current?.resume().catch(() => {});
    };

    const onDown = () => enableSound();
    document.addEventListener('pointerdown', onDown, { once: true });
    document.addEventListener('keydown', onDown, { once: true });
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onDown);
    };
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) syncNow();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  // The reactive loop: precomputed envelopes before the gesture, analyser after it.
  useEffect(() => {
    let frame = 0;
    let lastStateUpdate = 0;
    let raf = 0;

    const setVar = (name: string, value: number) =>
      rootRef.current?.style.setProperty(`--audio-${name}`, value.toFixed(3));

    const analyserBands = () => {
      const analyser = analyserRef.current;
      const data = freqDataRef.current;
      if (!analyser || !data || contextRef.current?.state !== 'running') return null;
      analyser.getByteFrequencyData(data);
      const avg = (from: number, to: number) => {
        let sum = 0;
        for (let i = from; i < to; i++) sum += data[i];
        return sum / ((to - from) * 255);
      };
      const ranges: [number, number][] = [[1, 6], [6, 18], [18, 60], [60, 160], [160, 420]];
      return {
        bass: clamp(avg(1, 12) * 1.45),
        mid: clamp(avg(12, 110) * 1.7),
        high: clamp(avg(110, 380) * 2.2),
        bands: ranges.map(([a, b]) => clamp(avg(a, b) * 2.0)),
      };
    };

    const tick = (now: number) => {
      const audio = audioRef.current;
      const clockTime = (now - fallbackStartRef.current) / 1000;
      // Always follow the actual audio clock once the element exists — the reveal
      // must land on the track's 7.5s swell even if the file is still buffering.
      const t = audio ? audio.currentTime : clockTime;

      // Throttled state updates; visibilitychange calls applyTimeline directly.
      if (now - lastStateUpdate > 150) {
        lastStateUpdate = now;
        applyTimeline(t);
      }

      if (t >= REACTIVE_END) {
        if (!stoppedRef.current) {
          stoppedRef.current = true;
          setReacting(false);
          setVar('bass', 0);
          setVar('mid', 0);
          setVar('high', 0);
          setVar('beat', 0);
          setVar('drop', 0);
          setVar('energy', 0.5);
          setVar('build', 0);
        }
        setVar('progress', t / TRACK_DURATION);
        raf = requestAnimationFrame(tick);
        return; // first minute only — visuals stay static from here on
      }

      const energy = sampleEnvelope(ENERGY, t);
      const low = sampleEnvelope(LOW, t);
      const mid = sampleEnvelope(MID, t);
      const high = sampleEnvelope(HIGH, t);
      const live = analyserBands();

      const bands = live ? live.bands : [clamp(low), clamp(mid * 0.85), clamp(mid), clamp(high * 0.85), clamp(high)];
      bands.forEach((value, index) => setVar(`band-${index}`, value));

      const bass = live ? clamp(low * 0.35 + live.bass * 0.85) : clamp(low);
      const mids = live ? clamp(mid * 0.35 + live.mid * 0.85) : clamp(mid);
      const highs = live ? clamp(high * 0.35 + live.high * 0.85) : clamp(high);

      // Nearest-beat pulse, sharp on the beat and decaying quickly.
      let nearest = Infinity;
      for (let i = 0; i < BEATS.length; i++) {
        const d = Math.abs(t - BEATS[i]);
        if (d < nearest) nearest = d;
        if (BEATS[i] > t + 0.5) break;
      }
      const beat = clamp(Math.pow(Math.max(0, 1 - nearest / 0.24), 2));

      // Drop flashes with a fast attack and exponential decay.
      let drop = 0;
      for (const d of DROP_PULSES) {
        if (t >= d) drop = Math.max(drop, Math.exp(-(t - d) * 2.1));
      }

      // Build swell before the drop (7.5s) — slow rise, then cut.
      const build = t < FIRST_DROP
        ? clamp(Math.max(0, (t - 4.5) / (FIRST_DROP - 4.5)) * (0.5 + 0.5 * Math.sin(t * 9)))
        : 0;

      setVar('bass', bass);
      setVar('mid', mids);
      setVar('high', highs);
      setVar('energy', clamp(energy * 0.6 + (bass + mids + highs) / 3 * 0.4));
      setVar('beat', beat);
      setVar('drop', drop);
      setVar('build', build);
      setVar('progress', t / TRACK_DURATION);

      // One light sweep per musical hit, tied to the measured drop grid.
      const hits = [REVEAL_TIME, ...DROP_PULSES];
      while (dropIndexRef.current < hits.length && t >= hits[dropIndexRef.current]) {
        window.dispatchEvent(new CustomEvent('vice-drop', { detail: { time: t } }));
        dropIndexRef.current++;
      }

      // Section changes rotate the quote / palette while the track is reactive.
      while (
        sectionIndexRef.current < SECTION_CHANGES.length &&
        t >= SECTION_CHANGES[sectionIndexRef.current]
      ) {
        const index = sectionIndexRef.current++;
        window.dispatchEvent(new CustomEvent('vice-section', { detail: { index, time: t } }));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return {
    audioRef,
    rootRef,
    stage,
    time,
    soundOn,
    startCount,
    reacting,
    showUI: stage === 'intro' || stage === 'full',
    phase: stage,
    syncNow,
    countdown: Math.max(0, Math.ceil(REVEAL_TIME - time)),
    unmute: () => start(),
  };
}
