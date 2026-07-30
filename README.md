# ReadWithMe

An early-literacy app for three children (Tru, Alivia, Ava). Phonics lessons earn
Star Gems, which decorate the Treehouse Sanctuary — the 2.5D room they own.

React 18 + TypeScript + Tailwind, built with Vite. See `CLAUDE.md` for the design
rules and the room's architecture.

## Getting it to the kids' tablets

The app needs no server to play. `soundService` uses the Express `/api/tts`
endpoint for a studio TTS voice when it is there, and falls back to the browser's
own speech synthesis when it is not — so the client bundle alone is complete and
playable. That makes a static deployment the simplest way to hand this to a child.

### Static hosting (recommended)

Netlify and Cloudflare Pages both read `netlify.toml`, so connect the repository
and they need no further configuration. On Vercel, set the build command to
`npm run build:static` and the output directory to `dist`.

To check the output locally first:

```bash
npm install
npm run build:static     # writes dist/
npx vite preview --port 3000
```

Once it is deployed, open the URL on each tablet and use **Add to Home Screen** so
it launches like an app.

The one thing static hosting costs is the studio TTS voice, which needs the Node
server plus an API key. Children get their device's built-in voice instead. The
app detects the missing endpoint on its first request and stops asking, so there
is no per-line delay.

### On your own machine, over Wi-Fi

Useful for trying it out before deploying. The server binds `0.0.0.0`, so other
devices on the same network can reach it:

```bash
npm install
npm run build
npm start                # serves dist/ on port 3000
```

Then open `http://<your-ip>:3000` on the tablet — `ipconfig getifaddr en0` on
macOS, `ipconfig` on Windows, `hostname -I` on Linux. The machine has to stay
awake and on the network.

### Studio TTS voice

Copy `.env.example` to `.env` and set `ELEVENLABS_API_KEY` or `GEMINI_API_KEY`.
Both are optional; without them the app uses the browser voice. Keys are only
read by the Express server, so they require one of the Node deployments rather
than static hosting.

## Progress is stored per device

Profiles, Star Gems, and room layouts live in `localStorage` under
`read_with_me_profiles_v5`. Two consequences worth knowing before handing out
links:

- Three children can share one tablet — they each pick a profile from the "Who is
  Reading Today?" screen. But the same child on two devices gets two separate sets
  of progress, and there is no sync or account.
- Clearing the browser's site data erases progress. There is no export yet.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `npm run dev` (Express + Vite middleware via `tsx server.ts`) |
| Typecheck | `npx tsc --noEmit` |
| Build (client + server) | `npm run build` |
| Build (client only) | `npm run build:static` |
| Serve the production build | `npm start` |
