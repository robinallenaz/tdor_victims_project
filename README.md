# TDoR Victims Project

Assets and data for a Transgender Day of Remembrance (TDoR) event utilizing data from https://tdor.translivesmatter.info/.

## What's here
- **photos/** — source images for the collage
- **data/** — JSON used by the site
  - `data/photos.json` — manifest of images displayed in the collage
- **scripts/build-photos-json.mjs** — generates `data/photos.json` from `photos/`
- **assets/vigil-candles.mp4** — optional hero video shown at the top
- **index.html / styles.css / app.js** — static site (infinite looping collage)
- **tdor_export.csv** — offline data export
- **tdor_names.txt** — one name per line for reading aloud

## GitHub Pages collage (quick start)

- The repo includes: `index.html`, `styles.css`, `app.js`, and `data/photos.json`. The hero video is `assets/vigil-candles.mp4` (optional).
- Put images in `photos/`. Generate the manifest:
  ```bash
  node scripts/build-photos-json.mjs
  ```
- Preview locally:
  ```bash
  npx serve .
  ```
- Deploy: GitHub → Settings → Pages → Build and deployment → Branch: `main` (Folder: `/`).
- The collage auto-scrolls infinitely. Adjust speed in `app.js` if desired.
