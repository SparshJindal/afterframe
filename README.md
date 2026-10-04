# Afterframe v1.2 — verified accounts and a public landing

The public entry is `/`; the existing journal is `/app` and requires a verified account. Apply the included account documentation before production. Local signup/recovery mail is delivered privately into `.dev-mail/`, not to a live inbox. The current HTML bundler creates a landing/UI preview only; it cannot create an account or log movies.

See `docs/AUTH-ARCHITECTURE.md` and `docs/LOCAL-AND-PRODUCTION.md` for the account design and deployment prerequisites. The catalogue, scoring and recommendation notes below remain applicable; legacy anonymous-profile assumptions do not.

# Afterframe
**Look a little closer.** A working film journal with a populated movie catalogue and first-review recommendations.

**Data licence:** the bundled MovieLens catalogue and derived rating aggregates are for research/prototyping under the original GroupLens terms. Commercial or revenue-bearing use requires permission. The complete original licence is in `catalogue/MOVIELENS-LICENSE.txt`. Do not assume this dataset is cleared for a commercial launch.

## Run it
Requires Node.js 22+ (24 recommended). From this folder:

```sh
npm ci
npm run dev
```

Open **http://localhost:3000**. `npm run dev` starts a **real local PostgreSQL server** on port 55432, applies the schema, imports 9,742 MovieLens films and retains the four featured films (two overlap, so a fresh catalogue contains 9,744 films) and launches the web app. It is not SQLite and is not an in-memory fake database. Data persists in `.postgres/`. The embedded development database is for local use only; its known development password must never be used for hosting. Ctrl+C stops the app and database. The embedded runtime downloads a PostgreSQL binary through npm and is supported on common Linux/macOS/Windows architectures; it must not run as root.

### Use your own PostgreSQL
```sh
npm ci --omit=dev
export DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/afterframe'
export PORT=3000
npm start
```
The schema is applied at startup. For a managed database requiring TLS, set `PGSSL=true`; certificates remain verified. The backend never exposes database credentials to the browser.

### Docker alternative
```sh
export POSTGRES_PASSWORD='a-long-unique-local-password'
docker compose up --build
```
Open http://localhost:3000. PostgreSQL has a persistent named volume and no published database port. This compose configuration is for local HTTP, not an Internet-facing production deployment.

## What works
- Responsive editorial interface, real film imagery, generated camera mascot and an interactive floating field-note card. Motion respects reduced-motion preferences.
- Journal, searchable 9,744-film initial library with genre filtering, 24-item pagination, custom film entries and a persistent watchlist.
- Immediate metadata-based recommendations after a review, with reasons, exclusion of watched films and separate public-rating evidence.
- First: overall enjoyment, 0.5–5, in half-star steps. Then eight aspect questions, 0–4, with fixed anchors, explicit N/A/unsure choices and optional evidence notes.
- Per-device draft recovery, back navigation, viewing dates, spoiler notes and a final comparison of instinct versus rubric score.
- Transactional PostgreSQL writes, server-side validation and database constraints. Client entry IDs allow retrying committed writes without creating a second entry.
- Read/delete entries, log rewatches, export JSON, delete all private profile data.
- Individual answers retain the aspect and rubric version for future research. No aspect is silently turned into a zero when skipped.
- Private browser profiles, opt-in aggregate recommendation contributions and an exploratory preference model.

## Data model
The `movies` table includes MovieLens ID, IMDb ID, TMDB ID, original title, genres, tags, source release, historical rating count and mean. `catalogue_imports` records source metadata and import version. Source-file SHA-256 hashes are recorded in `catalogue/source.json`. Importing is transactional and idempotent by stable IDs/version; it does not replace existing private reviews. Startup requires no external API key. `GET /api/movies?q=…&genre=…&limit=24&offset=0` supports bounded SQL search. The interface uses a cached catalogue for instant paginated filtering.

`profiles` → `ratings` → `answers`. Each rating stores movie, overall enjoyment, viewing date, spoiler flag and rubric version. Each answer stores aspect ID, 0–4 score or a specific skip reason, and a private note. `question_versions` stores the historical prompt/label identity. `movies`, `watchlist` and hashed `sessions` are separate tables. Private profile deletion cascades to entries, answers, watchlist and sessions. Shared catalogue records remain.

The rubric is version 1: story, characters, performance, visuals, sound, editing, ideas and personal impact. Score = mean of scored aspects × 1.25. At least four scored aspects are required; incomplete profiles are labelled. The overall rating is always stored independently, not overwritten by the calculated score.

## First-review recommendations
The MovieLens latest-small September 2018 catalogue contains 9,742 films, 100,836 ratings and 3,683 tag applications. Only movie metadata and anonymous **movie-level aggregates** are imported—not MovieLens people, private profile IDs or fake Afterframe reviews. Director, runtime and artwork are not provided by this import; absent fields remain absent and are labelled honestly. Known featured artwork/directors are preserved.

After a positive review (overall ≥3.5), early recommendations compare sourced genre/tag metadata using inverse-frequency-weighted overlap. A shrunk public overall-rating prior breaks weak ties; lower-rated films down-weight similar metadata. Mild diversification reduces repetition. Films already reviewed are excluded. Candidates require at least five source ratings. Neutral, negative or metadata-free histories get explicitly labelled community discovery—not a pretended personal preference.

Early recommendations do not assign acting/editing/sound scores to unseen films, do not show a fabricated predicted personal rating and do not treat MovieLens stars as aspect answers. When supported craft-model estimates are available, those are shown first with separate labels; metadata picks fill remaining slots.

The current historical source does not cover all releases, languages or countries. Add missing films manually. New manually added films without genre/tag enrichment cannot produce a strong content profile. A commercially licensed metadata provider and catalogue updates are future integration work.

## Aspect-based recommendation baseline
1. Use only the latest viewing of each distinct film; rewatches do not inflate the training count.
2. Require 12 distinct films with all seven craft aspects scored, and at least a one-star spread in overall ratings.
3. Fit centred, non-negative ridge regression against overall enjoyment, with regularisation 0.65. Personal impact is excluded from predictors because it overlaps with the outcome.
4. Show normalised positive coefficients as **experimental associations**, not causal preferences or objective importance. Before training readiness, show aspect averages, explicitly not preferences.
5. For an unseen film, require at least three other opt-in profiles for **every** craft aspect. Average their latest ratings, then apply the viewer’s model to estimate enjoyment. Notes are never returned by the recommendation endpoint. Contributions are off by default; opt-out takes effect on the next query.

There are no fabricated community ratings or example user reviews in the delivered app. The featured shelf is curated; initial personalised picks are separately labelled metadata matches. The threshold is a conservative UX gate, not a statistical guarantee. The model needs offline evaluation, holdout tests, uncertainty calibration and collaborative filtering before being sold as accurate personalisation. It currently assumes positive, approximately linear associations. Correlated self-reported aspects can still confound it.

## Preview versus authenticated app
The separate `Afterframe-landing-preview.html` is a visual landing/auth-dialog preview. It deliberately cannot create an account, authenticate, save a password or log a movie. The patched main app runs at `/app` through the Node backend and requires a verified account. The old v1.1 localStorage-only preview is not an authenticated product and must not be used as a login bypass.

Build the new landing preview with `npm run bundle`. Real accounts and journal operations require PostgreSQL and the server. Read `docs/LOCAL-AND-PRODUCTION.md` for verification mail and deployment setup.

## Test
Start `npm run dev` in one terminal, then:
```sh
npm test
```
Tests cover rubric math, skip handling, invalid dates/scores, duplicate aspects, insufficient data, rewatch deduplication, synthetic preference recovery, real database roundtrips, ownership isolation, exports, watchlist, deletion, CSRF, opt-in and recommendation evidence gates. API tests create and remove temporary profiles. The recommendation test also cleans temporary catalogue fixtures using the development database URL. Set `TEST_URL` and `TEST_DATABASE_URL` together if testing another non-production instance. **Never run mutation tests against real user data.**

## Before public launch
This is a functioning private-browser MVP, **not a finished public social network**. It now has verified-email password accounts, revocable sessions and recovery; MFA, public/social profiles and avatar uploads are not implemented. A verified account owns the journal. Signing in again restores access; browser cookies are sessions, not the account identity. HttpOnly/SameSite cookies, ownership-scoped reads, escaping, parameterised SQL, request limits and restrictive script CSP are included, but they do not replace production authentication.

Before public hosting:
- Review the implemented authentication/recovery baseline and add production MFA/abuse defenses. Do not treat anonymous browser profiles as robust independent viewers.
- Use HTTPS; set `NODE_ENV=production`, `APP_ORIGIN=https://your-domain`, a unique managed `DATABASE_URL`, and proper TLS as needed. Secure cookies are enabled in production. Never use the local database password.
- Add IP-level distributed rate limits, catalogue moderation, anti-Sybil protections, structured migrations, backup/restore drills, monitoring, privacy policy and retention rules.
- Obtain the appropriate licence/permissions for film artwork and metadata; consider a properly attributed TMDB integration.
- Evaluate recommendation quality and uncertainty. The prototype requires opt-in numerical contributions but has no public profiles or public review sharing.

## Artwork
Film posters and the Interstellar still were downloaded from the TMDB image CDN for this prototype. Artwork remains the property of respective rights holders. This app is not endorsed or certified by TMDB. Attribution is also visible under **The method**. The original camera doodle was AI-generated for Afterframe; the transparent version is a cleaned crop of that image. The wordmark and favicon are code-native graphics.

## Stack
Vanilla JavaScript ES modules, CSS, Node’s HTTP server, `pg`, PostgreSQL. No frontend framework or build service is needed. The small dependency surface is intentional. Docker configuration and a reproducible npm lockfile are included.

## Rebuild the sourced catalogue
Download the official `ml-latest-small.zip` from https://grouplens.org/datasets/movielens/, unzip it, then run:
```sh
python scripts/build_catalogue.py /path/to/ml-latest-small
```
This recreates the transformed metadata, source hashes and licence files. Startup imports the packaged data automatically. The version check prevents duplicate startup imports. For a new source release, update the recorded source version as part of a deliberate migration rather than treating a constant label as freshness. The currently packaged source is the 2018 release, not a current-release feed.
