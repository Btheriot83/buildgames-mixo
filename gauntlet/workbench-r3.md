# Gauntlet Phase B3 workbench — Hot Metal Press (mixo)

**Identity locked:** Quoin Lock (`docs/IDENTITY.md`) — **no reseed**.  
**Bar:** https://www.mixo.io/ · live demo https://buildgames-mixo.vercel.app  
**Hard bar:** flat materials · no decorative gradients · no glass blur · no glow.  
**B3 focus (Brandon):** fonts · contrast that holds · buttons that earn weight · close A/B vs live Mixo.

**Job (≤3s):** one brief → stamped landing → export HTML.

## Bar read (live Mixo — R0)
- Plus Jakarta Sans; H1 ~85px / weight 800; near-black `#1e1e24`
- Primary CTA: saturated pink `#FF006E`, white, weight 700, ~16px — one dominant action
- Clean whitespace; secondary text dark enough to hold
- Screenshots: `screenshots/r3/r0-bar-mixo.png`, `r0-bar-mixo-ab.png`

## Candidate before (R0)
- Fraunces H1 ~120px (overscaled vs Mixo)
- Acid CTA 12px mono uppercase — washed / underweight vs Mixo solid CTA
- Slate `#5c5f68` lede washed on bone
- Missing Plex Sans SemiBold/Bold faces (weights synthesized poorly)
- Screenshot: `screenshots/r3/r0-live-before.png`

---

## Round 1 — Display scale
- **Piece:** H1 too huge / gimmicky vs Mixo ~85px
- **Build:** Fraunces clamp → `2.75–5.25rem` (~83px @1280)
- **Visible delta:** title sits closer to Mixo hero weight without leaving Quoin Lock
- **Verdict:** Keep

## Round 2 — Font faces (Bold / SemiBold)
- **Piece:** no real 600/700 Plex Sans → soft hierarchy
- **Build:** `IBMPlexSans-SemiBold.ttf`, `IBMPlexSans-Bold.ttf`, `IBMPlexMono-SemiBold.ttf` + correct `@font-face` weights
- **Visible delta:** UI/buttons actually render weight 600–700
- **Verdict:** Keep

## Round 3 — Body hierarchy
- **Piece:** Fraunces bleeding into UI feel; body scale mushy
- **Build:** body 16/1.55 Plex Sans; create H2 display ~1.45–1.85rem; lede 1.125rem
- **Verdict:** Keep

## Round 4 — Slate contrast
- **Piece:** washed secondary (`#5c5f68` on `#f2ede3`)
- **Build:** `--slate: #3a3d46` (hot-metal + themes.ts); proof-sheet slate darkened
- **Visible delta:** lede/muted hold on bone
- **Verdict:** Keep

## Round 5 — Primary CTA weight (acid)
- **Piece:** Mixo wins CTA; our acid was tiny mono
- **Build:** `.btn-acid` → Plex Sans 600 / 15px / 14×22 pad / 2px ink / flat `4px 4px 0` ink shadow / sentence case
- **Label:** **Stamp landing** (job verb)
- **Verdict:** Keep

## Round 6 — Secondary quieter
- **Piece:** ghost competed with primary
- **Build:** `.btn-ghost` lighter pad/weight, no offset shadow, bone fill
- **Verdict:** Keep

## Round 7 — Stamp HTML = ink
- **Piece:** highest job action must outrank Save/JSON/ZIP
- **Build:** editor `Stamp HTML` → `.btn-ink` (ink fill, bone text, wine offset, weight 700)
- **Screenshot:** `screenshots/r3/r17-editor-buttons.png`
- **Verdict:** Keep

## Round 8 — Create field Mixo-closer
- **Piece:** Mixo path is one clear input + one CTA
- **Build:** taller textarea (112px), `#fffdf8` fill, 2px ink, 16px body type; CTA min-width 168px
- **Verdict:** Keep

## Round 9 — Meta color contrast
- **Piece:** rose meta washed on paper
- **Build:** mono-tag / step-kicker / rail-label → wine `#591034` weight 500
- **Verdict:** Keep

## Round 10 — Chips readable
- **Piece:** uppercase mono chips felt toy / low contrast
- **Build:** sentence-case Plex Sans 13/500; white paper fill; 2px ink; acid hover
- **Verdict:** Keep

## Round 11 — Job ladder contrast
- **Piece:** em at 0.72 bone washed on ink bar
- **Build:** strong = Plex 600 sentence case; em solid `#bdb8ae`
- **Verdict:** Keep

## Round 12 — Preview CTA hierarchy
- **Piece:** stamped preview buttons mono-tiny
- **Build:** pv-btn ink/acid/line → body 13–600, 2px borders, flat offsets
- **Verdict:** Keep

## Round 13 — Form field contrast
- **Piece:** paper-on-paper inputs
- **Build:** `#fffdf8` fields, 2px ink; title-input Fraunces 700
- **Verdict:** Keep

## Round 14 — Tracking kill
- **Piece:** 0.14–0.18em mono tracking = AI tell
- **Build:** meta tracking ~0.06em; acid-tape quieter
- **Verdict:** Keep

## Round 15 — Create H2 + tape
- **Piece:** create panel chrome noise vs Mixo clean hero
- **Build:** tighter display H2; tape label smaller / BRIEF → STAMP
- **Verdict:** Keep

## Round 16 — Demo preview head
- **Piece:** materials head competed / low hierarchy
- **Build:** ink head bar, acid mono-tag, Fraunces bone title
- **Verdict:** Keep

## Round 17 — Editor toolbar craft
- **Piece:** equal ghost buttons → Stamp HTML lost
- **Build:** ghost compact; Stamp HTML ink heavy; vp-toggle sentence case
- **Verdict:** Keep

## Round 18 — Rail / list type
- **Piece:** all-caps mono rail / oversized card titles
- **Build:** rail sentence case Plex; list H2 Fraunces; cards Plex 600
- **Verdict:** Keep

## Round 19 — Flat reassert
- **Piece:** Brandon hard bar / Inkwell veto
- **Build:** zero decorative gradients on chrome (pixel audit `grads: []`); paper-grain only on shell; no backdrop-filter
- **Verdict:** Keep

## Round 20 — Coherence + A/B close
- **Piece:** brand lockup / focus / mobile CTA full-width; export HTML type/buttons match desk
- **Build:** brand strong 700; focus ink rings; export.ts body sans + weighted flat buttons; lede copy Mixo-clear under Quoin voice
- **Screenshots:** `r20-home-after.png`, `after-r3-home.png`
- **Verdict:** Ship B3

---

## Screenshot index
| File | What |
| --- | --- |
| `screenshots/r3/r0-bar-mixo.png` | Live Mixo bar |
| `screenshots/r3/r0-bar-mixo-ab.png` | Mixo A/B retake |
| `screenshots/r3/r0-live-before.png` | Pre-B3 demo |
| `screenshots/r3/before-r3-home.png` | Alias before |
| `screenshots/r3/r17-editor-buttons.png` | Stamp HTML ink primary |
| `screenshots/r3/r20-home-after.png` | Post-B3 home |
| `screenshots/r3/after-r3-home.png` | Alias after |

## Blind note vs Mixo
Mixo still wins conversion fantasy (hosted site + pink CTA saturation). Candidate closed type-scale, secondary contrast, and button-weight gaps under Quoin Lock — primary **Stamp landing** and desk **Stamp HTML** now earn clear primary/secondary roles; flat anti-gradient bar held. No reseed.
