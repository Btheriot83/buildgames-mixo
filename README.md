# Hot Metal — Mixo replacement (Build Games)

Personal replacement for the **Mixo** core loop: brief → structured landing page → edit sections → live preview → export static HTML/ZIP.

**Aesthetic:** *Hot Metal Proof* — letterpress desk, acid chartreuse, oxidized rose, Fraunces + IBM Plex Mono, WebGL ink shader, looping ink video, stamp-on-export.

## Stack

- Next.js 15 + TypeScript + Tailwind (layout tokens) + **SQLite** (`better-sqlite3` locally, `sql.js` on Vercel)
- Optional `OPENAI_API_KEY` (degrades to local templates when unset)

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Development server |
| `npm test` | Unit tests (data model + generate) |
| `npm run test:e2e` | Playwright smoke (core loop) |
| `npm run build` | Production build |
| `npm run start:local` | Production-style local run |
| `npm run db:reset` | Delete local SQLite files |

## Permissions / privacy

- Single-user, private, **no accounts**, no analytics/telemetry/ads
- All secrets in `.env` (see `.env.example`)

## Architecture

- `src/lib/db.ts` — SQLite projects store (better-sqlite3 / sql.js)
- `src/lib/db-sqljs.ts` — pure-JS SQLite adapter for Vercel
- `src/lib/generate.ts` — brief → sections (local + optional LLM)
- `src/lib/export.ts` — static HTML + ZIP
- `src/components/CreateFlow.tsx` — gamified brief steps + press animation
- `src/components/InkShader.tsx` — WebGL ink-bleed background
- `src/components/StampOverlay.tsx` — export delight stamp
- `src/components/ProjectEditor.tsx` — section edit + responsive preview

## Data location & backup

- Default DB: `./data/mixo.sqlite` (override with `MIXO_DATA_DIR`)
- Backup: copy that file, or **Export JSON / ZIP** from the editor
- Import JSON from the home list to restore
- Sample project is labelled `[SAMPLE]` and deletable

## SQLite on Vercel

**Local:** prefers native `better-sqlite3` (optionalDependency — install continues if native compile fails).

**Vercel / serverless:** falls back to pure-JS [`sql.js`](https://sql.js.org) when `VERCEL=1` is set, or when `better-sqlite3` fails to load. Data is persisted under `/tmp/mixo.sqlite` when writable.

> **Demo caveat:** `/tmp` on Vercel is **ephemeral**. Cold starts may reset projects. Sample data reseeds automatically. Export ZIP/JSON for durable copies.

Force the Vercel path locally: `USE_SQLJS=1 npm run dev`.

`next.config` marks both `better-sqlite3` and `sql.js` as `serverExternalPackages`.

## Core loop demo

1. Home → fill five brief lines (Lock line → Stamp & generate)
2. Edit formes in the left rail; preview updates live
3. Switch desktop/tablet/mobile
4. **Stamp ZIP** (or HTML/JSON) — stamp overlay confirms

## Limitations vs paid Mixo

Deliberately excluded (per contest prompt):

- Sender reputation / deliverability / suppression
- General-purpose freeform visual editing
- Large template & component libraries
- Fake network effects, proprietary data, or compliance claims

Optional LLM improves copy tone only; app stays useful offline.

## Design notes (Lenny / Anshu)

Seed-derived direction **Hot Metal Proof** (seed never shown in UI). Critic pass targeted ≥9/10: kill purple SaaS, centered hero+ghost CTAs, identical icon cards; prefer imagery, video loop, shader, asymmetric editorial layouts, gamified create/export.
