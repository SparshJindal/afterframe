# Responsive recommendations (algorithm v4)

## What was wrong

The earlier shelf mixed broad genre affinity with a comparatively small historical-neighbor signal, averaging likes without any special influence for recent logs. Genre-only matches could tie for long stretches; public quality and deterministic tie-breaking kept bringing back the same films. The shelf did not remember previously served sets or explicit rejection. A process-local 60-second profile cache also could not observe a successful journal mutation handled by a different serverless worker.

This patch keeps the existing craft-learning model and privacy gates. It changes candidate relevance, freshness, and the feedback loop—not the equal-weight rubric or the eight journal questions. It was built on the latest customized main, preserving the updated copy, poster lookup, authentication configuration and single-rating-per-film behavior.

## Ranking behavior

- **Latest viewing matters:** half of signal influence follows the most recent distinct log, a quarter follows the exponentially weighted recent queue, and a quarter is spread across the latest 200 distinct films. This is a product heuristic, not an empirically fitted accuracy claim. All watched movies, including older logs outside that window, remain excluded.
- **Ratings have direction and strength:** positive and negative signals use `(overall - 3) / 2`, clamped to -1…1. Three stars is neutral; half-star differences matter. A weak like does not count as much as a strong like. A strong dislike suppresses related candidates more than a mild dislike; the ranker retains a vetted change-of-pace pool so old genre matches do not become a trap.
- **Metadata is more specific:** IDF-weighted genres, tags, and same-director evidence contribute when present. Missing tags/directors are not fabricated. Feature vectors are cached in the catalogue index.
- **Historical co-likes are calibrated:** real historical similarity is support-shrunk and saturates smoothly before blending. Positive and negative neighbors use the same recency-aware signals. This fixes tiny raw collaborative scores being drowned by broad genre matches. Historical ratings are not presented as live friend preferences.
- **Freshness is remembered:** the database stores the current eight movie IDs and up to three previous slates. After a changed journal or saved/hidden preference, recent exposure gets a bounded penalty; up to five previous picks may remain when comparable fresh alternatives exist. `More picks` reduces that repeat allowance to two. Small/low-quality candidate pools can repeat rather than serving fabricated or clearly poor matches.
- **Variety is deliberate:** selection penalizes redundant metadata, repeated directors, and simple same-series title matches. These are soft penalties, not hard quotas or guarantees.
- **Unchanged shelves are stable:** repeated GETs, page reloads and wall-clock passage do not arbitrarily rotate the shelf. A deterministic seed only breaks near-ties on changed inputs or explicit refresh. Previously selected IDs are retained in order if still eligible; missing/ineligible candidates are removed and replaced.
- **Craft scores remain real:** at least three other opt-in contributors per craft aspect and the original personal learning gate are still required. No acting, sound or editing score is inferred from genres, tags, stars or a language model.

This is behavioral improvement, not proof of recommendation precision. There has been no production-user relevance evaluation, large-scale load test, or fresh external movie-data import. Sparse catalogue metadata and historical MovieLens coverage remain limitations.

## Controls and immediate updates

- **More picks:** explicitly requests another set without discarding the journal or changing ratings. The control is available on personalized shelves, not a claim that all results must be new.
- **Not for me:** persistently hides an individual film from personalized recommendations and mood-search results. It is not treated as a negative star rating or a disliked genre.
- **Hidden picks:** paginated list with Restore controls. Restoring makes a film eligible again; it does not force it into the next eight slots.
- Saved watchlist films are excluded from the personalized shelf: they are already chosen. Explicit mood discovery may still surface saved films, while watched and hidden films remain excluded.
- Successful rating saves/edits, deletion, watchlist changes and dismissals advance a database-backed input revision. Cache reads revalidate that revision across workers before returning a profile. A rating save and its revision update occur in the same transaction. If a newly logged custom movie is missing from another worker's catalogue cache, that cache reloads before ranking.
- Old mood-search results are cleared after a journal save/delete; submitting a new mood query re-ranks against the current journal. No automatic external language-model call is triggered by logging a movie.

## Deployment / Antigravity handoff

Apply this additive migration **before deploying the code**, against the same PostgreSQL database the app uses:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/recommendation-schema.sql
```

Use the controlled migration/admin role and grant the runtime role SELECT/INSERT/UPDATE/DELETE on `recommendation_feedback` and `recommendation_shelves`. All earlier base/auth/discovery/social migrations must already be present. Do not expose the connection string in chat or commits. Local `npm run dev` applies the migration automatically at initialization; ordinary production startup does not add it with runtime DDL and checks that the table exists.

The migration creates two account-profile-owned tables with cascading account deletion. It does not delete journal entries, rewrite reviews, make profiles public, or import new ratings. Shelf state contains movie IDs, revisions and a hash of numeric ranking inputs—not review notes, email addresses, passwords, or social messages. No new external service or environment secret is required. Keep the new tables when rolling application code back; older versions ignore them.

No live production database or deployment was changed by this work.

## API

Existing `GET /api/taste` now returns algorithm version 4 and `shelf: {hiddenCount, canRefresh}`. The existing public profile fields remain compatible.

Authenticated, same-origin, CSRF-protected additions:

- `POST /api/recommendations/refresh` with `{}` → updated public taste/shelf response. Database-backed rate limit applies.
- `POST /api/recommendations/feedback` with `{movieId, dismissed:true|false}` → updated public taste/shelf response. Extra identity/unknown fields are rejected; nonexistent movie IDs return 404.
- `GET /api/recommendations/hidden?offset=0` → `{movies:[{id,title,year}], nextOffset}` with 20 owned rows per page.

Lists and mutations are scoped to the signed-in profile, never a caller-supplied account/profile ID. Recommendation endpoints, like other private APIs, remain `Cache-Control: no-store`.

## Verification

The full disposable-local-PostgreSQL suite passes (61 tests). Added checks cover a new strong like after a long one-genre history, low-rating strength, calibrated CF evidence, strict mood filters, all watched/hidden/saved exclusions, finite output, small-pool fallback, stable unchanged slates, bounded explicit rotation, edit/delete fingerprints, no private note use, cache invalidation across two recommender instances, persistent private dismissal/restore, CSRF/identity rejection, additive migration reruns, and account cleanup.

Desktop (1440px) and mobile (390px) browser flows exercise More picks, Not for me, Hidden picks, Restore, watchlist exclusion and empty hidden state; no page exceptions occurred. Only synthetic disposable accounts were used. Do not run the mutation test suite against production or real-user data.
