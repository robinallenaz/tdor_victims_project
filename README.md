# TDoR Victims Project

![TDoR Flyer](TDOR_flyer.png)

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

## Use the TDoR API securely (with your key)

- Never put your API key in client-side JS.
- Add a repository secret named `TDOR_API_KEY` (Settings → Secrets and variables → Actions → New repository secret).
- The workflow at `.github/workflows/fetch-tdor.yml` will fetch:
  `https://tdor.translivesmatter.info/api/v1/reports?key=<api-key>&from=<date>&to=<date>&country=<country>&filter=<filter>`
  and save `data/reports.json`, then derive `data/photos.json` used by the site.
- Edit the workflow inputs (`from`, `to`, `country`, `filter`, `category`) when you run it, or keep the defaults.
- Run it manually (Actions → Fetch TDoR data → Run workflow) or wait for the daily schedule.
- If the API uses a different image field (e.g., `image_url`, `photo`, or `image`), update the derive step accordingly.

## Notes

- Respectful use only; center remembrance and dignity.
- Data courtesy of translivesmatter.info — follow their attribution/licensing guidance.