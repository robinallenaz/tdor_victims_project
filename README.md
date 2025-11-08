# TDoR Victims Project

Assets and data for a Transgender Day of Remembrance (TDoR) event utilizing data from https://tdor.translivesmatter.info/.

## What's here
- **photos/** — images for a collage or slideshow
- **tdor_export.csv** — offline data export
- **tdor_names.txt** — one name per line for reading aloud
- **trans_flag.jpg** — visual asset from 
- **TDOR_flyer.png** — event flyer

## GitHub Pages collage (quick start)

- The repo already includes: `index.html`, `styles.css`, `app.js`, and `data/photos.json`.
- Put images in `photos/` and list filenames in `data/photos.json` under `images`.
- Preview locally:
  ```bash
  npx serve .
  ```
- Deploy: GitHub → Settings → Pages → Build and deployment → Branch: `main` (Folder: `/`).

## Use the TDoR API securely (with your key)

- Never put your API key in client-side JS.
- Add a repository secret named `TDOR_API_KEY` (Settings → Secrets and variables → Actions → New repository secret).
- The workflow at `.github/workflows/fetch-tdor.yml` will fetch:
  `https://tdor.translivesmatter.info/api/v1/reports?key=<api-key>&from=<date>&to=<date>&country=<country>&filter=<filter>`
  and save `data/reports.json`, then derive `data/photos.json` used by the site.
- Edit the workflow `FROM/TO/COUNTRY/FILTER` env values to your desired range.
- Run it manually (Actions → Fetch TDoR data → Run workflow) or wait for the daily schedule.
- If the API uses a different image field (e.g., `image_url`, `photo`, or `image`), update the derive step accordingly.

## Notes

- Respectful use only; center remembrance and dignity.
- Data courtesy of translivesmatter.info — follow their attribution/licensing guidance.
