# IDENTITY — Hot Metal Press (LOCKED)

**Aesthetic name:** Quoin Lock  
**Frozen:** 2026-09-14 PT · seed docs-only in DISCOVER.md  
**Core job:** Brief → stamped landing sections (one prompt, editable, export HTML/ZIP)

## Feel
Locking a chase on a Vandercook: cold steel, rubber ink smell, bone paper, acid chartreuse make-ready tape. Generation = quoin bite → wet proof. Chrome stays quiet; the stamped page is loudest.

## Palette (do not drift)
| Token | Hex | Use |
| --- | --- | --- |
| ink | `#11131a` | text, rules |
| bone | `#f2ede3` | page ground |
| paper | `#e8e2d6` | panels |
| acid | `#dae278` | primary CTA / make-ready |
| rose | `#9f5762` | meta / emphasis |
| wine | `#591034` | shadows / stamp |
| slate | `#5c5f68` | secondary copy |

**Forbidden:** vibe purple `#6366f1–#8b5cf6`, blue→indigo gradients, glassmorphism, colored glow CTAs.

## Type
- **Display (mark / H1 / preview headlines only):** Fraunces
- **Body / UI:** IBM Plex Sans
- **Meta / controls:** IBM Plex Mono
- Do **not** set Fraunces as `body` font.

## Materials / imagery
- Real Imagine assets: `public/textures/imagine/proof-sheet.png`, `empty-type.png`, `quoin-lock.png`
- Ink loop video `public/textures/ink-loop.mp4` as make-ready matte beside the desk (desktop only)
- Paper grain + registration marks OK; no CSS blob heroes

## Motion rules
- Serves the press job only: press meter fill, ram while generating, stamp overlay on export, stagger reveal on hero
- No floating decorative loops, no 3D tilted panels, no bounce-everywhere
- `prefers-reduced-motion` disables ram animation

## Copy voice
Plain shop English. Prefer “brief / proof / stamp / desk” over cryptic letterpress jargon in primary CTAs. No fake stats, no emoji, no Trustpilot theater.

## What we will NOT change in gauntlet (Phase B)
- Aesthetic name Quoin Lock / palette / type pairing above
- One-prompt primary create path
- Local-first SQLite + stamp export
- No accounts / billing / telemetry
