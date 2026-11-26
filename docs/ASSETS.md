# Assets, sources and licensing

## Audio

Source: `Sequence 01.mp4` (in repo root, gitignored — it is the edited GTA VI sequence using the site audio).

Pipeline:

1. Extract WAV from the source with `ffmpeg`.
2. Bass-boost with [`aubatch`](https://github.com/) from `~/aura-music`:
   - `aubatch --bass-only --format mp3 --mp3-bitrate 320 --target-peak -1`
   - bx_subfilter preset: `Default.aupreset`
   - LUX Sub-Bass preset: `MINE.aupreset`
   - **No reverb preset** is used.
3. Publish three renditions in `cinematic/public/`:

| File | Codec | Size | Purpose |
|------|-------|-----:|---------|
| `vice-city-radio.m4a` | AAC 128 kbps | 1.2 MB | First source; iOS/Android |
| `vice-city-radio.mp3` | MP3 320 kbps | 2.9 MB | Universal fallback |
| `vice-city-radio.opus` | Opus 128 kbps | 1.2 MB | Last fallback |

## Video

Source: `final.mp4` in the repo root (gitignored; 4K, 509 MB).

Two silent web renditions in `cinematic/public/`:

| File | Codec | Size |
|------|-------|-----:|
| `vice-city-video-v2.webm` | VP9, 720p | 11 MB |
| `vice-city-video-v2.mp4` | H.264, 720p, faststart | 14 MB |

The 3px pixel/scanline overlay is CSS (`.vice-video-pixels`), matching the original site.

The film goes fully black at **60.8s**. At that point the app fades the video out, reveals the still image behind it, and switches lyrics to quotes.

## Image

`miami-sunset-artistic-fc.jpg` was supplied by the user and optimized to `cinematic/public/vice-city.webp` (239 KB). A JPEG (`vice-city.jpg`) is kept alongside it.

## Discord assets

Avatar, avatar decoration, nameplate and badge icons are fetched dynamically from Discord at runtime. Optimized local copies in `cinematic/public/` are preloaded as fallbacks so nothing flashes:

- `avatar.webp`
- `avatar-decoration.webp`
- `nameplate.webp`
- `badge-0.png`, `badge-1.png`

The nameplate artwork is also used as a subtle screen-blended layer inside the dock.

## Font

`cinematic/public/fonts/pricedown.otf` is self-hosted Pricedown.

> Pricedown is distributed under a Typodermic desktop EULA that restricts web embedding and commercial use. For public/commercial deployment, obtain a proper webfont licence or substitute a licensed alternative.

## Lyrics

Lyric text comes from LRCLIB. Word-level timings were generated with OpenAI Whisper `small.en` from the original audio. Only lines actually detected in this edit are included. Displaying third-party lyrics publicly requires the appropriate rights.

## Quotes

Quotes are fetched from `https://api.api-ninjas.com/v1/quotes`. A fallback key is embedded in `cinematic/src/ProfileUI.tsx`; `VITE_QUOTES_API_KEY` overrides it. Client-side keys are visible — use a restricted key in production.
