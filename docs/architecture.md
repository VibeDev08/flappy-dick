# Architecture

## Overview

The project uses a single web application with clear internal module boundaries:

- `src/app`: page shell, route handlers, and request lifecycle
- `src/components`: React UI and canvas host components
- `src/lib/game-core`: pure gameplay logic with no browser dependency
- `src/lib/content`: static content definitions and tuning constants
- `src/lib/server`: leaderboard validation, Supabase persistence, and token signing
- `src/lib/persistence`: browser local-storage helpers

This keeps the gameplay core testable while avoiding the cost of a full multi-package monorepo on day one.

## Runtime Flow

1. The browser loads the landing page.
2. The player passes the `18+` confirmation gate.
3. The player selects a character.
4. The web app creates a run token from the server.
5. Canvas gameplay starts and uses the deterministic game core.
6. The fail overlay renders the score-reactive goo splatter.
7. If the score qualifies, the client submits the run token, score, and player name.
8. The server validates the request and updates the top-10 leaderboard.

## Module Boundaries

### `src/lib/game-core`

Owns:

- physics and flap impulse
- obstacle spawning
- collision checks
- scoring
- phase transitions

Does not own:

- DOM events
- audio playback
- local storage
- server requests

### `src/lib/content`

Owns:

- avatar definitions
- obstacle variant descriptors
- fail-screen copy
- share-card lines
- tuning constants exposed as data

### `src/lib/server`

Owns:

- run-token issuance
- score validation
- basic abuse filtering
- leaderboard reads and writes

### `src/components`

Owns:

- `18+` gate UI
- character selection UI
- leaderboard modal
- canvas rendering bridge
- result overlay and name entry

## Persistence

### Browser

Local storage persists:

- selected character
- audio mute setting
- completed `18+` confirmation
- best score

### Server

The server persists:

- top-10 leaderboard entries
- issued run-token ids used for replay protection

## Anti-Cheat Model

The leaderboard uses moderate protection, not a heavy secure multiplayer model.

- The client requests a server-issued run token before a run starts.
- The token includes signed timing metadata.
- Score submissions must present that token.
- The server rejects impossible run durations for the submitted score.
- The server rejects reused tokens.
- The server validates name length and characters.

This discourages trivial fake-score posting while staying lightweight.
