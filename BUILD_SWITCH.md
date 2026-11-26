# Build switch

`site.config.json` is the only file you need to touch to change which version of the site is live.

```json
{
  "build": "cinematic"
}
```

| Value | Build | Source | Output |
|-------|-------|--------|--------|
| `cinematic` | Vice City / GTA-themed experience | `cinematic/` | `dist/` |
| `original` | Original profile site | repo root (`index.html`, `src/`, `public/`) | `dist/` |

## To switch

1. Change `"build"` to `"original"` or `"cinematic"`.
2. Commit the change:
   ```bash
   git add site.config.json
   git commit -m "switch site build to original"
   git push origin main
   ```
3. Cloudflare Pages rebuilds automatically from `main`.
4. Confirm the commit's **Cloudflare Pages** check is green, then open https://profile-asa.pages.dev/.

## How it works

`npm run build` runs [`scripts/build.mjs`](scripts/build.mjs), which reads `site.config.json` and then:

- for `cinematic`: runs `cinematic/scripts/generate-preview.mjs`, then `vite build --config cinematic/vite.config.ts cinematic`
- for `original`: runs `scripts/generate-preview.mjs`, then `vite build`

Both Vite builds write to the same `dist/` directory, so Cloudflare needs no configuration changes when you switch.

## Notes

- Never delete either build directory — both versions must stay in the repo.
- `npm run dev` always serves the **original** build; `npm run dev:cinematic` serves the cinematic one.
- Large source videos in the repo root are gitignored. Only optimized web assets under `public/` and `cinematic/public/` are deployed.
