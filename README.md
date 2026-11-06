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

The contribution sheet shows Hermes Agent only: merged pull requests, authored commits and co-authored
commits. The contributor rank comes from `/api/rank`, which every page load reads, cached for 60 seconds.

Use a fine-grained token with read-only access to public repositories.

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
