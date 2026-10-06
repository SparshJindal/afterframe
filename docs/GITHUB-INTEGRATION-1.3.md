# Repository integration notes — v1.3

Merged onto the customized repository main at f8270bf, not blindly copied over it. Preserved the Vercel `api/index.mjs` adapter/default export/lazy DB initialization, connection settings, existing dynamic poster lookup, newer rounded/hero CSS, original images, public/data.js and data.mjs (including the Ford v Ferrari addition).

## Generated artifacts and Vercel

The connected GitHub writer supports UTF-8 content, not raw binary blobs. Exact WebP bytes are committed as `.webp.b64`; the sparse collaborative artifact is compressed in `catalogue/collaborative.json.gz.b64`. These are generated public assets/aggregate historical similarities, not credentials. No raw individual historical user rows are included.

- Public hashed `.webp` URLs stay unchanged. `server/static.mjs` reads real WebP if materialized, otherwise decodes the committed .b64 representation once into the bounded buffer cache. Its strong ETag and Content-Type refer to the decoded bytes. GET/HEAD/304 and immutable browser/shared-cache headers work normally.
- Vercel routes only the hashed optimized-image paths through the existing function before its normal public catch-all. These public assets bypass database initialization. All pre-existing API/app routes remain.
- `npm run assets` materializes images on local/Docker/build setups. `npm run images` regenerates both image and .b64 output. The current Vercel config does not require build-time materialization; the decoder path works directly from the committed files.
- `npm run bundle` expects materialized images: run `npm run assets` first after a fresh clone.
- Runtime collaborative loading decompresses its aggregate artifact once. Its builder writes the same gzip/base64 format.

Kept dynamic TMDB/Wikipedia artwork lookup instead of regressing catalogue posters to placeholders. Client-side resolution now has bounded workers, in-flight deduplication, a bounded recent cache with negative-result expiry, and CSP-compatible image error handling. Public successful poster-URL JSON now actually preserves cache headers (the original send helper overwrote them with no-store).

## Before merging/deploying

Run `db/discovery-schema.sql` against the deployment database with a migration role and grant runtime table permissions. This branch does not change your production database. Configure the optional LLM only if desired. No live OpenAI call, Vercel deployment validation or CDN provisioning was performed.

Existing repository authentication policy is retained, including its REQUIRE_EMAIL_VERIFICATION switch. Unlike the original v1.2 ZIP, the customized main defaults production verification off and has other deployment-specific behavior. Set REQUIRE_EMAIL_VERIFICATION=true and configure mail delivery if verified-email access is required. Review its existing forwarded-header trust, runtime DDL and cloud TLS validation choices before production; this feature merge is not a full security re-audit. Verification mail tokens and raw internal auth errors are no longer emitted to user responses/logs by the touched paths.

The original release's algorithm/security documentation describes the standard v1.2 baseline; this note records repository-specific differences. Dev test verification remains enabled by default.

Use the PR for review before merging main. Main/production was not overwritten or force-pushed. Generated public data and no secrets are committed.

## Merged-branch verification

38 automated tests passed against a separate disposable `afterframe_git_test` PostgreSQL database, including an extra exact-byte encoded-asset/HEAD test. Desktop/mobile browser acceptance passed on the merged server at a separate local port; original dynamic poster resolution and rounded UI were retained. No production data or credentials were modified. The original ZIP's 37-test report remains the report for that artifact, not this adapted repository commit.
