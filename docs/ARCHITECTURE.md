# Architecture and timing

The cinematic build is a single-screen React app. One `<audio>` element is the master clock; the film, reveals, lyrics and quotes all follow it.

## Master clock

`cinematic/src/useAudioReactive.ts` owns the timeline.

- Nothing plays until the first `pointerdown` or `keydown`.
- `start()` resets audio to `0`, unmutes it, starts the Web Audio analyser on fine-pointer devices, and increments `startCount` so the film restarts too.
- A `requestAnimationFrame` loop reads `audio.currentTime`, updates CSS variables (`--audio-bass`, `--audio-beat`, `--audio-band-0..4`, `--audio-progress`, etc.) and advances the stage.
- On touch devices the analyser is skipped; precomputed envelopes still drive the visuals. This avoids iOS Safari suspending Web Audio and silencing playback.

## Stages

`Stage = 'loading' | 'gate' | 'intro' | 'full'`

| Threshold | Stage | UI |
|-----------|-------|----|
| 0–0.9s | `loading` | Tuning slip |
| 0.9–7.62s | `gate` | Title card, click to start |
| 7.62–14.42s | `intro` | Avatar + name + music-only symbol |
| 14.42s onward | `full` | Status, guild, badges, macOS dock, footer |

The second reveal is pre-rolled by 0.15s (`FULL_REVEAL_TIME = 14.27`) so its 100ms snap animation completes on the measured bass transient at 14.42s.

## Video sync

- The intro film is muted; audio comes only from the master `<audio>`.
- On fine-pointer hosts where the media is seekable, drift is corrected by seeking.
- **Cloudflare Pages does not serve byte ranges** for these assets, so the film is not seekable there. Drift is corrected with small `playbackRate` nudges instead, and the video is never reset to `0`.
- On tab hide, both audio and the muted film keep playing. On return, `visibilitychange` calls `syncNow()` so the UI catches up in one update.

## Lyrics and quotes

`cinematic/src/lyrics.ts` contains word-level timings:

- text from LRCLIB
- timings from Whisper `small.en` word timestamps on the original audio
- only lines actually detected in this cut are included

`LyricDisplay` highlights the active word and keeps sung/upcoming words visible. When no lyrics are active it shows ♪ / ♫ symbols.

From 60.8s onward `quotesMode` replaces lyrics with `RotatingQuote`, which fetches from API Ninja every 10 seconds and falls back to local quotes on failure.

## Responsive fit

`ProfileUI` uses a `ResizeObserver` on its content and parent, measuring `scrollHeight`/`scrollWidth` rather than fixed breakpoints. The content is scaled to fit any viewport without scrolling, including landscape phones. Safe-area padding is handled in CSS via `env(safe-area-inset-*)`.
