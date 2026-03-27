# Deploy Checklist

Use this exact flow for production updates.

## 1) Prepare branch

- `git checkout main`
- `git pull`
- `git checkout -b feat/<short-description>`

## 2) Implement and verify locally

- Make your code changes.
- Run `npm run verify`.

## 3) Commit and push

- `git add .`
- `git commit -m "fix: <why the change exists>"`
- `git push -u origin <branch-name>`

## 4) Merge to `main`

- Open a PR and merge after review.
- Pull latest `main` locally if needed.

## 5) Verify Cloudflare secrets (required)

- Run `npm run secrets:check`.
- Confirm both are present:
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RUN_TOKEN_SECRET`
- If either is missing:
  - `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name flappy-dick`
  - `npx wrangler secret put RUN_TOKEN_SECRET --name flappy-dick`

## 6) Deploy

- Run `npm run deploy:prod`.

## 7) Post-deploy smoke test

- Open live site.
- Start a run and crash once.
- Confirm score overlay appears.
- Confirm leaderboard loads and score submit still works.

## Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` out of `wrangler.jsonc`.
- Keep only public values (for example `NEXT_PUBLIC_SUPABASE_URL`) in `wrangler.jsonc` `vars`.
- If deployment scope ever changes (for example using `--env production`), secrets must be set and listed with the same scope.
