# Status

## Completed

- Project scaffolding
- Product documentation
- Browser-first technical foundation
- Deterministic gameplay core
- Unified input layer
- Avatar selection flow
- Obstacle content library
- Presentation layer with goo fail overlay
- Local persistence
- Share-card generation
- All-time top-10 leaderboard
- Production build validation
- Deployment-ready configuration
- Obstacle silhouette simplification pass
- Player avatar updated to match reference image (single glans, corona, wrinkles)
- Gameplay backdrop updated to a sky-blue field with a repeated edge-to-edge top cloud row
- Game shell updated from full-bleed view to a centered portrait frame closer to classic Flappy Bird presentation
- Playfield widened further to better match the reference Flappy Bird browser layout
- Startup flow updated to use a Flappy-Bird-style title screen and separate ready screen before the run begins
- Leaderboard persistence migrated from local file storage to Supabase-backed tables with token replay protection
- Deploy-readiness hardening pass completed (lint errors fixed, tests aligned with runtime behavior, production type safety validated)
- Full release checks passing locally: `npm run lint`, `npm run test`, and `npm run build`
- Result-overlay quips now use curated short phrases directly (no runtime ellipsis truncation)
- Deployment runbook added with repeatable verify/secret/deploy checklist and package scripts
- "Switch Dick" post-crash character swap button added to NavBar; deployed to production (version 8cc3a4cc-841d-43b7-bb77-02bf4035b865)
- Rotation-aware hitbox and post-crash fall physics shipped to production (version 9c82f9c5-4f77-44cd-9e43-5974150cabe8)
- Spacebar on character-select screen now confirms the chosen dick and starts the run (same as "Let's Go"); deployed to production (version 5a597c46-c2e3-4b87-baaa-72c3ab99117e)
- Top-10 congrats modal now hard-locks leaderboard entry until a valid name is submitted (no outside-tap dismiss, no spacebar retry bypass)
- Share card/OG image refreshed to closely match the in-game title screen styling, obstacle art, prompt pill, and player avatar; deployed to production (version 93835afb-0849-42f7-a10e-cf2b6962fd6c)
- Share/OG flow stabilized across devices after cache and crawler hardening:
- Mobile remains pinned to the known-good path (`?share=20260328k`) with `og-card-mobile.png`.
- Desktop uses a separate share key (`/share?desktop=20260328a`) so desktop tuning does not impact mobile behavior.
- Sharing stays review-first via X intent and uses concise two-sentence copy with emoji.

## Follow-Up Ideas

- Add real browser automation or manual QA coverage for desktop and mobile devices.
- Add production hosting credentials and point the deployment at the final custom domain.

## Risks

- art throughput for `20+` obstacle variants
- balancing fail-overlay scale across small screens
- keeping leaderboard validation lightweight but useful
