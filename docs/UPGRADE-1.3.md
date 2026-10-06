# Afterframe 1.3 — four upgrades, in order

This release extends the authenticated v1.2 app. It does not deploy hosting, buy a CDN, configure email delivery, or activate a paid AI account. Keep the existing login, CSRF, ownership and verified-email gates.

## 01 — Poster delivery

- Six existing source images have generated responsive WebP variants (320, 640, up to 960 pixels; no upscaling). Missing catalogue posters remain labelled typographic placeholders.
- `public/image-manifest.js` maps existing poster URLs to real, content-hashed assets. Cards use `srcset`, `sizes`, dimensions, lazy loading and asynchronous decoding. Landing posters are eager by default; the hero background is optimized separately.
- Content-hashed WebP responses use `public, max-age=31536000, immutable`. All public static files have strong ETags and conditional GET/304 support. HTML is `no-store`; scripts/styles revalidate. Authentication and journal APIs remain `no-store`.
- The public asset buffer cache is a 32 MiB bounded, process-local LRU. It checks file mtime before reuse. It never contains account/API responses.
- Rebuild after replacing artwork: `npm ci && npm run images`. The builder refreshes existing static landing/hero asset hashes along with the manifest. If you add new artwork or change intrinsic dimensions/layouts, review the image markup and sizes hints. Keep old hashed assets accessible for at least the advertised cache lifetime. Do not overwrite an old hashed filename with new content.
- The existing app still boots with a full catalogue payload. Shared catalogue/index caching cuts repeated database/index work; client-side catalogue pagination is not server-side initial-load pagination.

### CDN deployment (not provisioned)
Serve `/assets/optimized/*` through your hosting/CDN's public asset route while preserving these URLs and cache headers. Never create a blanket cache-everything rule for `/api/*`, `/app`, HTML, or requests carrying account cookies. The browser cache already covers recently viewed posters; no service worker is required or included. CDN activation and first-load network benchmarking remain deployment work.

## 02 — Dynamic personal preferences

The rubric is still the equal-weight scored-aspect mean × 1.25; skipped aspects are excluded. It never changes when personal weights change.

Preference model: seven raw 0–4 craft scores predict the separate 0.5–5 overall enjoyment score. Personal impact is excluded. Latest review per distinct movie is used. At least 12 fully scored craft reviews, one star of outcome contrast and two varied craft features are required.

Train by minimizing average squared prediction error plus an L2 penalty toward prior coefficients. Coefficients are non-negative. Inputs and outcome are centered; the intercept is reconstructed. Projected gradient descent uses 900 iterations and step 0.04. Regularization is `max(0.18, 6/n)`.

**Constant/near-constant aspect scores do not imply disinterest.** If variance is under 0.15 in raw score units, that coefficient stays at its prior. We do not scale tiny variance up or automatically reward a noisy feature. UI says "Not enough contrast" and "Prior", not a claimed learned importance percentage. Other labels (tentative below 30 training films, developing thereafter) are heuristics, not Bayesian confidence intervals.

Prior: seven conservative 0.12 coefficients until enough opt-in population observations exist. With at least five eligible contributors and 50 complete observations, learn a shared prior from within-user-centered scores and enjoyment, regularized toward the defaults. Contributors need at least three distinct complete films and a one-star enjoyment spread; cap each user's population contribution at the latest 100 films. This removes generous-rating offsets, but is not a full hierarchical Bayesian model or standardized inter-rater calibration.

Recompute after journal edits/deletions and contribution changes. Recommendation/model results cache per owner for up to 60 seconds, capped at 500 owners. Concurrent reads coalesce. Generation checks prevent in-flight results from repopulating an invalidated cache. Mutations invalidate before and after response completion. Multiple app replicas still need shared invalidation/pub-sub for immediate cross-replica changes; without it, other replicas may use an aggregate for up to 60 seconds.

## 03 — Hybrid recommendation ranking

Three evidence streams, no invented craft data:

1. Existing genre/tag content similarity and Bayesian-smoothed historical community quality. Rare descriptors count more; positive reviews are ≥3.5 and negative ≤2.5. Latest reviews only; watched films excluded.
2. **Historical item-item collaborative filtering**, built from MovieLens latest-small's 100,836 ratings by 610 historical viewers. Use positive strengths `rating-3` for ratings ≥3.5, cosine similarity, multiply by `shared_positive_raters/(shared_positive_raters+20)`, require five shared positive raters and retain top 40 neighbors. Movies need 10 historical ratings to enter the offline neighbor builder. The delivered artifact covers 2,269 eligible movies; no individual historical viewer rows/IDs are shipped in it.
3. Personal craft predictions, only for candidates with all seven aspect averages supported by at least three other opted-in contributors per aspect. Reviews are deduplicated per contributing user/movie; your own rows and all notes are excluded. Newly added films can qualify via genuine craft evidence even without historical MovieLens ratings.

Historical collaboration uses your current latest likes and dislikes to produce a score; it does not retrain historical neighbors after each review. Rebuild the aggregate neighbor artifact when licensed historical data changes. No user clustering, matrix factorization or neural embeddings are claimed in this release.

Base hybrid score: `(content_rank + 0.3 * nonnegative_collaborative_score) / 1.3`. A craft signal blends in at `min(0.35, n/(n+30) * sample/(sample+10))`. Predictions are clamped to 0.5–5. Diversity selection subtracts 0.075 × similarity to already selected films. Return at most eight unique unseen movies. Discovery applies hard catalogue filters *before* ranking; exclusions are never silently relaxed.

The old `recommendations` and `earlyRecommendations` fields remain for compatibility; the app now renders `hybridRecommendations`. Explanations are deterministic and evidence-backed. Community averages are never labelled personal predicted ratings.

Rebuild: install NumPy in a build environment, then `python scripts/build-collaborative.py /path/to/ml-latest-small/ratings.csv`. Runtime needs no Python. MovieLens's included research licence still applies; commercial use needs permission. The artifact is historical, not a real-time collaborative model of new Afterframe users.

## 04 — Optional language-assisted discovery

New authenticated, CSRF-protected endpoint: `POST /api/discover` with exactly `{ "query": "sci-fi from the 2010s, no horror", "useLLM": false }`.

The Discover page has a compact "Tonight's brief" form, an off-by-default opt-in checkbox, applied-filter chips, grounded results, and explicit empty/fallback states. Local rules support genres/negations, selected themes, decades, since/after/from/before/until years and "under N minutes". Unknown runtime is excluded under a runtime constraint; most catalogue runtimes are missing. Unsupported wording is disclosed, not falsely understood.

When both server configuration and user consent allow it, OpenAI structured output extracts a small filter object. It gets only the user's brief plus a fixed schema—not email, profile, ratings, notes, candidate databases, credentials or SQL. An independent local validator rejects unknown keys/genres, fake movie IDs, invalid bounds and unsafe keywords. Provider output cannot select movie IDs or execute tools. Catalogue retrieval, ranking and explanations remain deterministic. No fabricated acting/editing scores or verified violence/child-safety guarantees.

Configuration (server environment/secret manager, never client JS or Git):

```
LLM_ENABLED=true
OPENAI_API_KEY=<your server-side key>
LLM_MODEL=gpt-4.1-mini
LLM_DAILY_REQUEST_LIMIT=1000
```

Verify the chosen model currently supports chat-completion structured outputs before rollout. There is no provider credential in this package and live provider billing/quality was not tested. Disabled, unavailable, malformed, exhausted-budget or busy provider paths use local rules. A paid-attempt rate-limit violation returns 429; it is not silently bypassed.

Controls: 600 code points/2,400 bytes per brief; 450 maximum completion tokens; 8-second provider timeout; two external calls concurrently per process. Database fixed-window limits: all discovery 60/IP and 30/account per 15 minutes; paid attempts additionally 10/IP and 5/account per 15 minutes. A shared PostgreSQL UTC-day counter caps provider attempts globally (default 1,000/day, configurable 1–10,000). Attempts, including provider failures, consume budget. This is a request/token ceiling, not a guaranteed dollar ceiling; set provider-side spend controls too. The existing 60/profile/minute mutation limit also applies. Signed-in IP attribution still requires a correctly configured trusted reverse proxy, as documented for v1.2.

Briefs are not persisted by this feature. They may contain whatever a user types, so disclose the provider's retention policy before enabling it. `externalRequest` reports an attempted provider request even if the response failed and local fallback was used. No request text, provider response or secrets are written to application logs by the funnel.

## Deployment and tests

1. Commit/backup your project and database. Apply either the combined patch or stages 01→04, not both.
2. `npm ci` on Node 22+ (Node 24 preferred). Generated images and collaborative data are already included.
3. Existing v1.2 auth database is required. New migration, with a migration role:
   `psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/discovery-schema.sql`
4. Runtime role needs SELECT/INSERT/UPDATE on `llm_daily_budget`, in addition to the v1.2 table permissions. Keep runtime DDL disabled. Retain production auth/email/HTTPS settings.
5. Restart the application; check `/api/health`, anonymous gates, signed-in movie logging, cached image/304 delivery, recommendations and local discovery. Enable external assistance only after local checks.
6. Tests: run a disposable local PostgreSQL app with `npm run dev`; in another terminal run `npm test`. Tests create synthetic accounts/reviews and remove them. Never point tests at production. Repeated test runs can intentionally hit auth throttles; use a fresh isolated test database. The test suite expects the dev cookie and disabled external LLM by default.
7. Browser QA: `npx playwright install chromium`, then `node test-upgrades-ui.mjs`. An existing local browser can be selected with `CHROMIUM_PATH=/path/to/chromium`. This uses disposable SQL fixtures and must only target the local dev database.
8. Sandbox caveat: the embedded development PostgreSQL package may need its native library directory in LD_LIBRARY_PATH on minimal Linux images. Docker or a separately installed local PostgreSQL are alternatives. Do not patch production libraries to work around a local test issue.

### Validation scope
Automated unit/integration checks cover prior retention, stable rubric, synthetic association recovery, collaboration/evidence gates, private-note exclusion, constrained catalogue retrieval, invalid provider output, provider fallback, cost/rate controls, conditional image caching and existing authentication flows. Browser checks exercise real movie logging, hybrid picks, discovery and empty states, desktop/mobile layouts, evidence labels and preserved profile dialogs.

No live OpenAI call, CDN rollout, Docker production deployment, production traffic benchmark, independent security audit or recommendation-accuracy validation is claimed.

Before tuning: use user-level chronological train/validation/test splits; rebuild historical similarities and popularity features from training only to avoid leakage. Compare content-only, popularity, collaborative and hybrid Recall/NDCG@K, catalogue coverage and diversity. Evaluate aspect prediction with held-out RMSE/MAE and compare a user's mean-rating baseline. Include low-variance/low-history slices. Tune on validation; report final metrics on untouched test data. Twelve reviews is a product threshold, not proof of reliable prediction.

Rollback: restore the prior code/assets from backup and restart. Leave the new budget table in place unless a reviewed migration explicitly removes it. Keep old hashed images accessible for cached clients. Do not delete accounts, reviews or contribution preferences during rollback.
