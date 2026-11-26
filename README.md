# TheGT — profile site

Two complete versions of the same profile live in this repo. A single committed value decides which one Cloudflare Pages publishes.

- **Live site:** https://profile-asa.pages.dev/
- **Cinematic build** (GTA VI / Vice City themed): source in [`cinematic/`](cinematic/)
- **Original build**: source at the repo root (`index.html`, `src/`, `public/`)

See [BUILD_SWITCH.md](BUILD_SWITCH.md) for the one-line switch.

---

## Quick start

```bash
npm install
npm run dev            # original build at http://localhost:3000
npm run dev:cinematic  # cinematic build at http://localhost:3001
npm run lint           # TypeScript check for both builds
npm run build          # builds whichever version site.config.json selects into dist/
```

`npm run build` is the command Cloudflare Pages runs. It reads `site.config.json`, generates the matching social preview, and writes the chosen site to `dist/`.

---

## Repository layout

```
.
├── index.html                 # original build entry
├── src/                       # original build source
├── public/                    # original build static assets
├── cinematic/                 # cinematic build (complete Vite app)
│   ├── index.html
│   ├── vite.config.ts         # outputs to ../dist
│   ├── src/                   # React UI, audio engine, lyrics, timeline
│   ├── public/                # audio, video, images, font, _headers
│   └── scripts/               # cinematic preview generator
├── scripts/build.mjs          # build switcher
├── site.config.json           # THE SWITCH
├── BUILD_SWITCH.md
└── docs/
    ├── ARCHITECTURE.md
    └── ASSETS.md
```

---

## How the cinematic build works

The whole experience is driven by one audio element. Nothing plays until the visitor clicks or taps.

| Time | Event |
|-----:|-------|
| `0.00s` | Click/tap starts audio and intro film together |
| `7.62s` | First reveal — avatar, name and music-only state |
| `14.42s` | Main bass drop — status line and dock appear |
| `30.16s` | First lyric line (word-by-word sync) |
| `60.20s` | Last lyric line |
| `60.80s` | Video goes black; switch to the still image and rotating quotes |
| `75.80s` | Audio ends; the profile stays with quotes rotating |

Lyrics come from verified text aligned with Whisper word timestamps. Quotes come from the API Ninja endpoint with a local fallback. After the track ends there is no end card or replay — the profile just remains.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the timing and sync model.

---

## Deploying

1. Edit `site.config.json` if you want to change builds.
2. Commit and push to `main`.
3. Cloudflare Pages runs `npm run build` and publishes `dist/`.
4. Check the **Cloudflare Pages** status on the commit in GitHub.

The build switch, including how to verify it, is documented in [BUILD_SWITCH.md](BUILD_SWITCH.md).

---

## Environment

`VITE_QUOTES_API_KEY` is optional; a working fallback key is already embedded in the cinematic quote component. To override it, create `.env.local`:

```env
VITE_QUOTES_API_KEY=your_key_here
```

Note that any client-side key is visible to visitors. Use a restricted key.

---

## Documentation

- [Build switch](BUILD_SWITCH.md)
- [Architecture and timing](docs/ARCHITECTURE.md)
- [Assets, sources and licensing](docs/ASSETS.md)
