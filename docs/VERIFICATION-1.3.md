# Release verification — Afterframe 1.3

## Automated checks

Final local `npm test`: **37 passed, 0 failed**, against a real disposable PostgreSQL development instance. No paid AI provider was contacted.

Coverage includes:
- Original password policy, signup/email-token expiry/replay, verified login, CSRF/Origin, private ownership, Argon2id persistence, reset/change/revocation and account deletion.
- Equal-weight rubric/skip handling, distinct-film training gates, outcome contrast, synthetic feature-association recovery and no impact leakage.
- Constant/near-constant feature prior retention, population minimum-data gate and within-user centering.
- Historical collaborative signal, unseen-film exclusion, craft contributor gate and source evidence.
- Real SQL aggregation requires three other opt-in contributors; opt-out removes eligibility; private contributor notes never appear in the recommendation response.
- Catalogue/model read coalescing and invalidation.
- Structured-filter output validation, fake IDs/unknown fields rejected, explicit LLM consent, no journal data in provider request, unavailable/invalid/budget-exhausted provider fallback.
- Public ETag/304 and immutable image caching; private API no-store.
- Authenticated constrained discovery, no-results preservation, CSRF rejection, request bounds/allowlist and shared database 429 limits.

Mocked provider transport validates contract/fallback behavior; it is not a real provider compatibility, billing or quality test. Synthetic association recovery is a correctness check, not held-out recommendation accuracy.

## Browser acceptance

Final local Chromium/Playwright flow passed:
verified session → real movie quiz/save → hybrid picks → Discover filter brief → constrained results → empty-state case → learned evidence labels → preserved account profile.

Desktop 1440px and mobile 390px screenshots were inspected. Poster sizing regression found during QA was repaired (`height:auto` keeps intrinsic attributes from overriding the landing composition crop). Browser checks assert no horizontal document overflow, no page errors and reasonable desktop/mobile poster heights. Landing composition, discovery form/results, low-contrast evidence labels and empty states remain in the existing editorial style.

UI histories were explicit disposable QA fixtures, removed after the run. They are not default app users/reviews, training seeds or delivered database contents.

## Patch integrity

The release includes an authenticated-v1.2→v1.3 combined patch and four sequential patch folders, each with exact baseline/new hashes, a unified diff and a dry-run apply helper. The package contains no .env, provider secrets, runtime mail, database, node_modules or synthetic account records.

Production email setup, CDN provisioning, external provider activation, hosting, load tests and independent security review remain operator work. See UPGRADE-1.3.md and the separate Antigravity instructions.
