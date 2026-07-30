# ReadWithMe — Treehouse Sanctuary Project

An early-literacy app for three children (Tru, Alivia, Ava). The Treehouse
Sanctuary is the reward room they decorate with Star Gems earned from phonics
lessons.

## Technology Stack

- React 18 + TypeScript
- Tailwind CSS (utility styling; the config is extended — see below)
- Vite build pipeline. Assets are imported through Vite, never via `index.html`
  import maps.
- `soundService` wraps speech synthesis and UI sounds.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `npm run dev` (Express + Vite middleware via `tsx server.ts`) |
| Typecheck | `npx tsc --noEmit` |
| Build | `npm run build` |
| Add a package | `npm install <package>` |

## Design rules

- Cozy 2.5D isometric cartoon look, in the spirit of late-2000s kid portals
  (Nicktropolis, Club Penguin).
- **Shaded, not flat.** Every graphic must carry gradients, a rim highlight, and
  a ground contact shadow. Flat single-fill shapes are not acceptable for
  furniture, pets, or characters. Inline SVG is the medium of choice: it is
  genuinely transparent, scales without artefacts, needs no network request, and
  cannot be blocked by an asset policy.
- **Never store sprite art as JPEG.** JPEG has no alpha channel, so a
  transparent sprite saved as `.jpg` acquires an opaque white rectangle. This
  was the real cause of the "white boxes" behind placed furniture; it was never
  a CORS or CORB problem — a blocked image renders as nothing, not as a white
  box.
- Containers wrapping a sprite must be `bg-transparent` with no padding, no
  card background, and no generic card shadow.
- Do not route asset requests through third-party CORS proxies. Everything the
  room needs is local or drawn in code.
- HUD chrome is cartoon neubrutalist: `bg-amber-50` fills, `border-4
  border-amber-950`, and the hard offset `shadow-cartoon*` utilities. No soft
  blurred shadows on controls.

## Room architecture

The room lives in `src/components/room/`:

| File | Responsibility |
| --- | --- |
| `roomLayout.ts` | The single coordinate space: `x`/`y` as 0..1 fractions of the stage, band definitions (`ceiling` / `wall` / `floor`), default slots, clamping, and `depthZIndex`. |
| `useRoomDrag.ts` | Pointer-event dragging with pointer capture. |
| `TreehouseRoomStage.tsx` | The room shell, the window, the HUD, and the render loop. |
| `RoomFurniture.tsx` | Inline SVG furniture graphics. |
| `RoomPets.tsx`, `RoomAvatar.tsx` | Inline SVG pets and the child character. |

Rules when working in here:

- **One coordinate space.** Positions are always 0..1 fractions, never pixels
  and never percent strings. This keeps a saved room correct at every viewport
  size.
- **Depth follows y.** An item further down the screen (larger `y`) must get a
  higher `z-index` so it overlaps what is behind it. Use `depthZIndex` — do not
  hand-assign z-index values.
- **Pointer events only.** Use `onPointerDown` / `onPointerMove` /
  `onPointerUp` with `setPointerCapture`. HTML5 drag-and-drop has no touch
  support and must not be used; these children are mostly on tablets.
- **The room shell is CSS.** Walls, floor, and window are gradients and
  transforms in `index.css` plus the stage markup. Do not reintroduce a
  background photograph — a photo cannot be tinted per time-of-day and produced
  the flat brown floor seam this room used to have.
- Item positions persist in `LearnerProfile.placedItemLayout`. Bumping the
  `localStorage` schema requires a migration that seeds missing data rather than
  resetting a child's room.

## Tailwind config notes

`tailwind.config.js` extends spacing (`18 22 26 30 34`), `borderWidth.3`,
`scale.102/115/120`, `zIndex.42/45/60/70`, the `shadow-cartoon*` shadows, and the
`spin-slow` / `bounce-subtle` / `fade-in` animations. These exist because the
room components use them. Tailwind silently drops unknown utilities, so a class
like `w-30` renders as nothing at all — if a graphic mysteriously collapses to
its intrinsic size, check that every utility it uses is actually defined.
