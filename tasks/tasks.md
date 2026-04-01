# Tasks

## Milestone 1

- [x] Write product docs and technical docs.
- [x] Lock stack and scripts.
- [x] Set up the web app structure.

## Milestone 2

- [x] Implement deterministic game state and update loop.
- [x] Add touch, keyboard, and mouse mapping to one `flap` action.
- [x] Add unit tests for scoring, collisions, and fail states.

## Milestone 3

- [x] Add the `18+` gate and pre-run character selection.
- [x] Render the player and first obstacle batch.
- [x] Tune portrait mobile gameplay and desktop support.

## Milestone 4

- [x] Add the goo splatter fail overlay with score scaling.
- [x] Add crude-pun UI copy and minimal-funny audio hooks.
- [x] Add share-card generation.

## Milestone 5

- [x] Build the all-time top-10 leaderboard service.
- [x] Add qualifying name entry.
- [x] Add validation, token signing, and replay protection.

## Milestone 6

- [x] Optimize for production.
- [x] Validate build and tests.
- [x] Prepare deployment configuration for a custom-domain launch.
- [x] Polish the startup flow to better match the classic Flappy Bird title and ready screens.

## Milestone 7

- [x] Replace file-backed leaderboard persistence with Supabase-hosted storage.

## Milestone 8

- [x] Resolve blocking lint/type issues for a production build.
- [x] Reconcile gameplay-core tests with current engine phase behavior.
- [x] Re-validate deploy pipeline (`lint`, `test`, `build`) end-to-end.
- [x] Replace runtime quip truncation with manually shortened phrases that fit the 30-char cap.

## Milestone 9

- [x] Add a standard deploy checklist and npm scripts for repeatable production releases.
- [x] Enforce mandatory top-10 name claim flow by blocking dismiss/bypass paths on the congrats modal.
- [x] Add a Reddit banner asset at `1920x384` based on the approved Twitter banner art.
- [x] Add a Reddit profile image based on the app favicon instead of the character art.

## Milestone 10

- [x] Enable RLS and service-role-only policies on Supabase `public` leaderboard tables to resolve "table publicly accessible" security warnings.
