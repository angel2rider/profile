# Build switch

`site.config.json` controls which version of the site Cloudflare Pages builds.

```json
{ "build": "cinematic" }
```

- `cinematic` — Vice City / GTA-themed build (source in `cinematic/`).
- `original` — the original site (source at repo root).

Change the value, commit, and push to `main`. Cloudflare Pages will rebuild and publish the chosen version. Both builds live in this repository.
