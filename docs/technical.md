# Technical Notes

## Chosen Stack

- `Next.js` App Router
- `React` for shell UI
- `TypeScript` across client and server
- HTML canvas for gameplay rendering
- Route handlers for the leaderboard API
- `Vitest` for deterministic gameplay-core tests

## Why This Stack

- One deployment unit covers game UI and backend endpoints.
- Canvas is enough for the visual style and obstacle volume in V1.
- The gameplay core stays framework-independent even though it lives in the same repo.
- Route handlers make the leaderboard simple to ship on a custom domain.

## Input Mapping

- mobile tap -> `flap`
- desktop mouse click -> `flap`
- desktop `Space` -> `flap`

The app normalizes raw browser events into a single game action so physics and state logic stay input-agnostic.

## Leaderboard Design

The leaderboard is an all-time top 10 backed by Supabase. Each entry stores:

- `name`
- `score`
- `createdAt`
- `characterId`

The server also stores consumed run-token ids to prevent trivial replay submissions.

## Validation Rules

- Names are trimmed and capped at 12 characters.
- Only qualifying scores are accepted.
- A score must be possible within the run duration implied by the signed token.
- Tokens are single use.

## Content Pipeline

Obstacle generation uses a hybrid approach:

- modular presets cover most obstacle variants
- a few custom variants add visual spikes in the library

Each obstacle descriptor includes:

- palette
- shaft width and length
- curve amount
- tip shape
- vein style

Gameplay hitboxes stay normalized and forgiving even when the art varies.

## Performance Goals

- hold `60fps` on modern phones and desktops
- keep render work mostly in a single canvas
- avoid frequent object churn in the game loop
- keep fail overlays and share-card generation event-driven, not constantly recomputed

## Testing Focus

- flap physics
- obstacle spawning cadence
- scoring behavior
- collision detection
- fail-state transitions
- leaderboard qualification rules
