# Afterframe 1.3

Repository-specific deployment adaptations and existing authentication policy are documented in [docs/GITHUB-INTEGRATION-1.3.md](docs/GITHUB-INTEGRATION-1.3.md). Read that alongside the baseline release guide before deployment.

An editorial film journal with a public cinematic landing, verified accounts, PostgreSQL-owned reviews, eight anchored cinema questions, and separate overall enjoyment ratings.

## This release

1. Responsive WebP posters, content-hashed immutable public caching, ETag/304 and a bounded public asset cache.
2. Dynamic nonnegative preference regression anchored to conservative/opt-in population priors. Constant aspects retain a prior; evidence is labelled. The equal-weight rubric stays stable.
3. Hybrid metadata + historical item-item collaboration + genuine opt-in craft predictions. Eight unseen, diversified picks with grounded explanations.
4. Authenticated conversational discovery. Local rules work without keys; optional OpenAI structured filters require explicit user consent, server configuration, validation and budget/rate controls.

**Start with [docs/UPGRADE-1.3.md](docs/UPGRADE-1.3.md).** It explains exact algorithms, evidence gates, privacy, deployment, migration, CDN setup, limitations, rollback and evaluation design. See [docs/VERIFICATION-1.3.md](docs/VERIFICATION-1.3.md) for release tests.

## Run

Node 22+ (24 preferred), PostgreSQL. Install dependencies with `npm ci`.

- Development: `npm run dev` starts an embedded local PostgreSQL database and the app on loopback. On minimal Linux, the embedded package may require its native library directory in LD_LIBRARY_PATH; using an installed PostgreSQL or Docker is an alternative.
- Existing DB: set DATABASE_URL, APP_ORIGIN and PORT, then `npm start`. Copy `.env.example` values into your environment/secret manager; this app does not automatically load a .env file when run directly with Node.
- Production: HTTPS APP_ORIGIN, a random AUTH_SECRET, verified sender MAIL_FROM and real RESEND_API_KEY are required. See [docs/LOCAL-AND-PRODUCTION.md](docs/LOCAL-AND-PRODUCTION.md) and [docs/AUTH-ARCHITECTURE.md](docs/AUTH-ARCHITECTURE.md). Use a controlled migration role, not runtime DDL.
- Upgrading v1.2: run `db/discovery-schema.sql` with your migration role before restarting. Existing accounts/reviews remain intact. No fabricated users or reviews are seeded.

Routes: `/` public landing; `/app` verified journal; `/api/discover` verified + CSRF-protected discovery. Anonymous users cannot log movies, change watchlists, edit profiles or export journals. Passwords reject emoji sequences server-side/client-side without banning normal digits, #, * or printable international letters. Private ownership is derived from the authenticated server session.

Optional LLM: disabled by default. To activate configure LLM_ENABLED=true, OPENAI_API_KEY, LLM_MODEL and LLM_DAILY_REQUEST_LIMIT server-side. The user must separately opt in. No key is included, no real provider call is needed for the ordinary app, and provider failures have a local fallback. Never expose secrets in browser code.

## Tests and generated assets

Start a disposable local development instance, then `npm test`. Never use production for fixture tests. Browser QA: install Playwright Chromium, then `node test-upgrades-ui.mjs` (or set CHROMIUM_PATH to a local browser).

- `npm run images`: regenerate optimized public artwork/hash manifest and refresh existing static references. Review markup when dimensions/layouts change. Retain old hashed assets for cache lifetime.
- `npm run assets && npm run bundle`: self-contained **landing/UI preview only**. It cannot create accounts or provide an offline fake journal.
- `python scripts/build-collaborative.py /path/to/ml-latest-small/ratings.csv`: rebuild historical aggregate neighbors; NumPy is build-time only.
- `python scripts/build_catalogue.py /path/to/ml-latest-small`: rebuild sourced catalogue metadata.

## Data and limitations

The historical MovieLens latest-small catalogue has 9,742 films and 100,836 ratings, plus the app's featured/new films. Historical coverage is through 2018, not a current movie feed. Missing posters/directors/runtimes stay missing and are labelled. Historical ratings supply metadata/community/collaborative signals, **not** invented craft scores.

Read `catalogue/MOVIELENS-LICENSE.txt` before use. This is a research-use source; commercial use needs permission. Source metadata is in `catalogue/source.json` and the collaborative artifact records its method and aggregate counts. No historical individual viewer rows are distributed in that artifact.

The personal model is experimental, not a proven causal account of taste. No held-out recommendation accuracy, production load capacity, live LLM billing, CDN rollout, Docker production deployment or independent security audit is claimed. Asset/model caches are process-local; multi-replica deployment needs deliberate proxy configuration and shared invalidation. Full initial catalogue loading is still an optimization opportunity.
