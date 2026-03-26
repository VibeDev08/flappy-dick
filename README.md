# Flappy Dick

`Flappy Dick` is a browser-first arcade parody game inspired by `Flappy Bird`. The project is optimized for portrait mobile play, supports desktop input, and includes a lightweight all-time top-10 leaderboard.

## Stack

- `Next.js` with `React` and `TypeScript`
- Canvas-driven gameplay rendered in the browser
- Route handlers for the leaderboard API
- Local browser persistence for character selection, audio preference, `18+` confirmation, and best score
- Supabase-backed server persistence for leaderboard data
- `Vitest` for gameplay-core tests

## Product Rules

- Show an `18+` confirmation gate before the player enters the game.
- Player chooses one of 2 avatars before the first run.
- Mobile input uses screen tap.
- Desktop input uses `Space` or mouse click.
- The fail state shows a white goo splatter with score text inside it.
- Splatter size scales with score but clamps to a device-aware maximum.
- Share flow is a screenshot/share card with score, character, a funny line, and the game URL.
- Leaderboard is all-time only, top 10 only, and prompts for a name only if a score qualifies.

## Scripts

- `npm run dev` starts the app locally.
- `npm run build` creates the production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.
- `npm run test` runs the gameplay tests.

## Project Layout

- `src/app` contains the web app, route handlers, and page-level UI.
- `src/components` contains UI and canvas-facing React components.
- `src/lib/game-core` contains deterministic gameplay logic and tests.
- `src/lib/content` contains avatar, obstacle, and UI content data.
- `src/lib/server` contains leaderboard persistence and validation utilities.
- `docs` contains architecture, technical, design, and status docs.
- `tasks` contains the implementation task list.

## Development Order

1. Lock the docs and core content rules.
2. Build the deterministic game loop and inputs.
3. Add avatar selection, obstacle rendering, and fail-state polish.
4. Add share-card generation and local persistence.
5. Add the protected top-10 leaderboard.

## Deployment

- Copy `.env.example` to `.env.local` and set `RUN_TOKEN_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.
- Run `npm run build` before production deploys.
- Use `npm run start` for a simple Node deployment.
- A `Dockerfile` is included for container-based hosting behind a custom domain.
- Leaderboard persistence is hosted in Supabase tables and works in serverless production environments.

## Notes

- This repo intentionally favors simple, explicit code over a heavier game-engine abstraction layer.
- Leaderboard storage uses Supabase while keeping the same lightweight anti-cheat validation rules.
