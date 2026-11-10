# Portfolio

Next.js site with an animated intro, a terminal, a physics ID card, a live contribution graph, a scroll-drawn flow line and a Hermes Agent credits sheet. Light theme only.

## Run

```bash
npm install
npm run dev
```

Opens on port 3100. Add `?skip` to the URL to jump past the intro.

## GitHub data

The token lives in `.env.local` as `GITHUB_TOKEN` and is only read on the server. Pages refresh from
GitHub at most once an hour when someone visits. If GitHub or the token fails, the site falls back to
`data/snapshot.json`.

The contribution sheet shows Hermes work only: merged pull requests in Hermes Agent and its official
plugins, plus authored and co-authored commits on Hermes Agent main. The contributor rank comes from `/api/rank`, which every page load reads, cached for 60 seconds.

Use a fine-grained token with read-only access to public repositories.

## Daily refresh

`.github/workflows/daily-refresh.yml` runs every day at 03:00 India time, and can be started by hand from the
Actions tab. It fetches the Hermes credits, rebuilds the resume PDF, commits any change and redeploys.
It refuses to commit if any count goes down, since that usually means GitHub returned partial data.

Repository secrets it uses: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`, and optionally `GH_READ_TOKEN`. A deploy step is skipped if its token is missing.

## Cloudflare

```bash
npm run cf:deploy
```

Always deploy with this script. It moves `.env` files aside first, because OpenNext otherwise copies them
into the Worker bundle. Set the token as a secret with `npx wrangler secret put GITHUB_TOKEN`.

## Editing content

| What | Where |
| --- | --- |
| Name, links, case files, pinned scraps, stack | `lib/profile.ts` |
| Resume text | `lib/resume.ts` |
| Palettes | `lib/palettes.ts` |
| Computer drawing | `scripts/gen-computer.mjs` |
| Floppy, keycap, mug, server drawings | `scripts/gen-decor.mjs` |

## Commands

```bash
npm run gen:resume     # rebuilds public/Mahammad-Salman-Resume.pdf from lib/resume.ts
npm run gen:snapshot   # refreshes the fallback GitHub data
npm run gen:computer   # redraws the isometric computer
npm run gen:decor      # redraws the small isometric objects
```
