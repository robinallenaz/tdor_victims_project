# TDoR Victims Project

Assets and data for a Transgender Day of Remembrance (TDoR) event utilizing data from https://tdor.translivesmatter.info/.

## What's here
- **photos/** — source images for the collage
- **data/** — JSON used by the site
  - `data/photos.json` — manifest of images displayed in the collage
- **scripts/build-photos-json.mjs** — generates `data/photos.json` from `photos/`
- **assets/vigil-candles.mp4** — optional hero video shown at the top
- **index.html / styles.css / app.js** — static site (infinite looping collage)
- **tdor_export_*/** — offline data export
- **tdor_names.txt** — one name per line for reading aloud

## Run locally (quick start)

Install dependencies:

```bash
npm install
```

Start a local server (no live reload):

```bash
npm start
```

Start a dev server (live reload):

```bash
npm run dev
```

Both run on:

- `http://localhost:8080`

The photo manifest is regenerated automatically before `start`/`dev`.

### Generate the photo manifest manually

```bash
npm run build:photos
```

## GitHub Pages collage

- The repo includes: `index.html`, `styles.css`, `app.js`, and `data/photos.json`. The hero video is `assets/vigil-candles.mp4` (optional).
- Put images in `photos/`. Generate the manifest:
  ```bash
  node scripts/build-photos-json.mjs
  ```
- Preview locally:
  ```bash
  npm start
  ```
- Deploy: GitHub → Settings → Pages → Build and deployment → Branch: `main` (Folder: `/`).
- The collage auto-scrolls infinitely. Adjust speed in `app.js` if desired.

## Troubleshooting

- If `fetch(data/photos.json)` fails when opening `index.html` directly, run the site through a local server (`npm start` / `npm run dev`) instead of using a `file://` path.
- If port `8080` is already in use, stop the other process using it or tell me and I can switch the scripts to a different port.
