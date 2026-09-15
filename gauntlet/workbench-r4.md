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

## r5 — buttons Stamp landing weight
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r5-cta-weight.png
- bar A/B: gauntlet/shots-r4/r5-bar-mixo-ab.png
- verdict: Primary CTA heavier (16/700/52px) — closer to Mixo Get Started heft; Mixo pink still louder saturation.
- commit: 0a54be8

## r6 — buttons secondary quieter
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r6-ghost-quieter.png
- verdict: Use five lines recedes; Stamp landing dominates — Mixo Log in vs Get Started pattern closer.
- commit: 6852967

## r7 — bar gap acid tape quieter
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r7-acid-tape-quiet.png
- verdict: Top strip half as busy (2 labels); Mixo still wins empty whitespace above hero.
- commit: 74f59ea

## r8 — bar gap job ladder compact
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r8-job-ladder-compact.png
- verdict: Ladder shorter — more air to brief; Mixo has no job chrome (still denser than bar).
- commit: 23a1aa3

## r9 — contrast create panel flatter
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r9-panel-flat-shadow.png
- verdict: Wine mega-offset gone → ink 8px flat; Mixo card still softer/rounder.
- commit: 8741b7e

## r10 — fonts create H2 hierarchy
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r10-create-h2.png
- bar A/B: gauntlet/shots-r4/r10-bar-mixo-ab.png
- verdict: Create title quieter vs field+CTA; Mixo still one H1 only above input.
- commit: 39ab719

## Dream-loop lock
- baseline: `.dream-loop/baseline.png` (= `shots-r4/dream-baseline-core.png`)
- target: `.dream-loop/target.png` (= `shots-r4/dream-target.png`) — refined exact UI screenshot (Higgsfield gpt_image_2_5 from live baseline)
- critic: close live→target AND vs Mixo bar; Quoin Lock locked; no fake accounts

## transitions.dev recipe → action map
| Recipe | Fires on |
| --- | --- |
| texts-reveal (HeroReveal stagger) | Home hero mount |
| panel-reveal (t-panel-slide) | Create panel / project list open |
| thinking-states (ThinkingLine) | Stamp generate in progress |
| spinning-counter / number-pop (SpinningCounter) | Editor section rail index |
| success-check | StampOverlay on HTML/ZIP export success |
| toast | StampOverlay export success; Save "Chase locked" |
| error-state-shake | CreateFlow validation/API error; ProjectEditor save error |
| skeleton-reveal | CreateFlow pressing panel while stamping |

## r11 — buttons error-shake + skeleton
- files: src/app/transitions.css, src/components/CreateFlow.tsx, src/components/StampOverlay.tsx, .gitignore
- shot: gauntlet/shots-r4/r11-error-shake-skeleton.png
- recipes: error-state-shake → create validation/API fail; skeleton-reveal → pressing; toast Quoin-flat on export
- verdict: Feedback is now action-tied not CSS-only; Mixo still quieter empty states.
- commit: 57c4169

## r12 — buttons save toast
- files: src/components/ProjectEditor.tsx
- shot: gauntlet/shots-r4/r12-save-toast-editor.png
- recipes: toast → Save success; error-state-shake → Save fail
- verdict: Desk save now announces with Quoin toast; Mixo still has no press chrome.
- commit: 11e3bf6

## r13 — bar gap quiet top (dream)
- files: src/app/page.tsx, src/app/globals.css
- shot: gauntlet/shots-r4/r13-quiet-top-dream.png
- vs target: acid tape + heavy ladder → slim brand + job crumb (closer)
- vs Mixo: still denser than Mixo empty hero chrome, but gap closed
- verdict: Top chrome finally breathes; Mixo still wins pure whitespace.
- commit: 8fafb70

## r14 — fonts job-first H1 (dream)
- files: src/app/page.tsx, src/app/globals.css
- shot: gauntlet/shots-r4/r14-job-first-h1.png
- vs target: H1 is the brief ask; create H2 hidden as duplicate
- vs Mixo: same job-first pattern under Fraunces/Quoin
- verdict: Job readable in 3s; Mixo still cleaner sans weight.
- commit: 6cb94d6

## r15 — contrast stage air (dream)
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r15-stage-air.png
- bar A/B: gauntlet/shots-r4/r15-bar-mixo-ab.png
- vs target: more gap between copy and demo; flatter panel
- verdict: Focal create plane clearer; Mixo still softer card + pink CTA.
- commit: 1f5f6da

## r16 — bar gap proof secondary (dream)
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r16-proof-secondary.png
- vs target: Imagine plate smaller under demo copy
- verdict: Demo proof leads; plate no longer fights CTA. Mixo has no plate chrome.
- commit: 53db979

## r17 — contrast demo head (dream)
- files: src/app/globals.css, src/app/page.tsx
- shot: gauntlet/shots-r4/r17-demo-head.png
- vs target: light head with body type instead of ink bar
- verdict: Right column quieter; Mixo mock window still softer.
- commit: 7e2418f

## r18 — buttons CTA sole loud (dream)
- files: src/app/globals.css
- shot: gauntlet/shots-r4/r18-cta-chips.png
- vs target: meter hidden; chips quieter; Stamp landing sole loud control
- verdict: Closer to Mixo one-CTA fantasy under Quoin acid.
- commit: 6e1c1f0
