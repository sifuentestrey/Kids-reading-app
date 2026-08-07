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

## Do not push to this repository from Google AI Studio

AI Studio's GitHub sync writes a whole-project snapshot, not a diff. Anything it
does not know about is deleted rather than left alone, and it labels the result
with a message describing only the part it meant to change. Commit `9056a6e`
reads "refactor: move pcmToWav helper to server.ts" and is 3,710 deletions: it
removed `browserVoice.ts`, `netlify/functions/tts.ts`, `netlify.toml`,
`shared/audio.ts`, `roomLayout.ts`, `useRoomDrag.ts`, this file, and both test
suites, and restored the JPEG sprites that the room had already been rewritten to
avoid.

GitHub is the source of truth. Use AI Studio to read the code or to draft
something you then copy across by hand, but do not let it push.

## Text-to-speech

`/api/tts` is served two ways — `server.ts` in development, and
`netlify/functions/tts.ts` on the static deployment — so the shared call lives in
`shared/audio.ts` and both go through it. A copy that drifts produces a voice
that changes depending on how the app happened to be deployed.

- **Call Google's REST endpoint at a literal URL.** Do not reintroduce the
  `@google/genai` SDK on this path. Netlify's AI Gateway recognises the SDK and
  reroutes it through its own model catalogue, which carries no TTS models, so a
  valid model ID comes back as `unable to find suitable provider for gemini/...`
  — an error in a shape Google never emits.
- **The key is `GOOGLE_AI_STUDIO_KEY`, not `GEMINI_API_KEY`.** The gateway claims
  the latter and fills it at runtime with a 366-character JWT, so a key set under
  that name never reaches Google; it comes back as "API key not valid", which
  reads exactly like a typo. `GEMINI_API_KEY` remains a fallback for hosts that
  do not do this.
- **Never turn a failure into silence.** A non-audio reply must stay HTTP 200
  with `fallback: true` so `soundService` degrades to the device voice, and must
  carry a `reason` naming the cause with credentials stripped out.
- Walk `TTS_MODELS` rather than pinning one ID. They are preview models: they get
  retired without notice, and which of them a key may call varies by project.
