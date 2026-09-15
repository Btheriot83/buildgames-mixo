# Gauntlet Phase B4 INTEGRITY — Hot Metal Press (mixo)

**Identity locked:** Quoin Lock (`docs/IDENTITY.md`) — **no reseed**.  
**Bar:** https://www.mixo.io/ · demo https://buildgames-mixo.vercel.app  
**Hard bar:** flat · no decorative gradients · no glass · no glow.  
**Gate:** `/workspace/build-games/gauntlet/INTEGRITY_GATE.md` — one commit per round, shot, files, honest verdict.

**Job (≤3s):** one brief → stamped landing → export HTML.

## Bar read (R0)
- Mixo: Plus Jakarta / near-black H1 ~85px / weight 800; pink `#FF006E` CTA; clean whitespace; soft pastel wash (their brand — we stay Quoin flat).
- Shots: `shots-r4/r0-bar-mixo.png`, `r0-bar-mixo-ab.png`, `r0-live-before.png`, `r0-prod-before.png`

## Candidate before (R0)
- Quoin Lock desk: acid tape + job ladder + create panel + demo proof — denser than Mixo hero.
- Brand lockup still shouts uppercase mono tracking.
- Acid CTA present but panel wine offset + chrome compete with the job.
- Shots: `shots-r4/r0-live-before.png`

---


## r1 — fonts brand lockup
- files: src/app/globals.css, src/app/page.tsx
- shot: gauntlet/shots-r4/r1-brand-fonts.png
- verdict: Mixo still cleaner overall; our brand no longer shouts uppercase mono — spottable in 3s under Quoin Lock.
- commit: 06eb227

## r2 — fonts press meter
- files: src/app/globals.css, src/components/CreateFlow.tsx
- shot: gauntlet/shots-r4/r2-press-meter-fonts.png
- verdict: Meter reads as UI copy not all-caps mono shout; Mixo still quieter chrome overall.
- commit: a0afd4a

## r3 — fonts H1 display scale
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r3-h1-scale.png
- verdict: H1 sits nearer Mixo ~85px weight without leaving Fraunces; Mixo still wins clean sans solidity.
- commit: 37d44d8

## r4 — contrast lede slate
- files: src/app/globals.css src/lib/themes.ts
- shot: gauntlet/shots-r4/r4-slate-contrast.png
- verdict: Lede/muted darker on bone — holds better; Mixo gray still softer on white.
- commit: a0c075c
