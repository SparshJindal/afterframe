# Setup, migration and operations

## Local development (after applying the patch to v1.1)

```sh
npm ci
npm run dev
```
Development binds to loopback by default. Open `http://localhost:3000/`. Create a test account with a 15+ character non-emoji passphrase. This creates an **unverified** account, not a logged-in journal session.

The dev mail worker writes a JSON file into `.dev-mail/` after a short delay. Open it locally, follow the verification URL in its `text` field, verify, then sign in. The same local workflow supplies password reset links. These are real single-use bearer links, not public sample tokens. The files and `.key` remain private, mode-restricted, ignored by Git and absent from the patch.

- Existing embedded PostgreSQL is reused and the additive schema runs; current movie catalogue and old review records are not deleted.
- Old anonymous profiles are not automatically attached to an email. See the architecture document before building any explicit claim/import feature.
- Browser profile username is generated at signup; users can choose their own unique handle from the profile panel after sign-in.
- `npm run bundle` emits `../Afterframe-landing-preview.html`. It is not an offline authenticated journal.
- Development external breach checks are optional (`HIBP_CHECK=true`); production checks are mandatory.
- Run `npm test` on a disposable local DB. Auth tests read the private development mail files to exercise verification/reset. Do not run this mutation suite on production or any real-user database.

## Environment values

| Name | Purpose |
|---|---|
| `DATABASE_URL` | Secret PostgreSQL connection string; migration and runtime roles should differ in production |
| `HOST` | Loopback by default in development; 0.0.0.0 for deliberate container/proxy use |
| `PORT` | Node listening port, 3000 by default |
| `APP_ORIGIN` | Exact externally visible HTTPS origin in production; no paths/wildcards/trailing slash |
| `NODE_ENV=production` | Enables Secure cookies, HTTPS/config checks, mandatory password screening and HSTS |
| `AUTH_SECRET` | Base64 encoding of at least 32 cryptographically random bytes; used with domain-separated key derivation for CSRF and encrypted mail queue |
| `RESEND_API_KEY` | Provider key from your own Resend account, in a secret manager |
| `MAIL_FROM` | Verified sender, e.g. `Afterframe <accounts@your-domain>` |
| `PGSSL=true` | Trusted, certificate-verified TLS for managed PostgreSQL where required |
| `RUN_MIGRATIONS=true` | Controlled migration/seed bootstrap only; false for normal production serving |
| `HIBP_CHECK=true` | Enable online breach screening locally; cannot disable it in production |

Generate `AUTH_SECRET` on your own machine or secret-manager tooling:
```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Store the value privately; never commit it or paste it into project/chat logs. Do not copy development `.dev-mail/.key` into production. Mail/domain setup: [Resend Node sending guide](https://resend.com/docs/send-with-nodejs), [domain setup](https://resend.com/docs/dashboard/domains/introduction).

## Controlled production bootstrap

1. Provision private PostgreSQL and a migration role. Back up existing v1.1 data and test restore.
2. Use HTTPS `APP_ORIGIN`, production auth/email secrets and the migration role's `DATABASE_URL`. Set `RUN_MIGRATIONS=true` for a controlled first bootstrap; confirm both `db/schema.sql` and `db/auth-schema.sql` complete and the existing catalogue is present. This server performs additive migrations/seeding on startup when explicitly enabled, so run that bootstrap off the public traffic path and stop it afterward.
3. Create a separate runtime role with required SELECT/INSERT/UPDATE/DELETE grants on the needed tables, no CREATE/ALTER/DROP. Use that role for serving and set `RUN_MIGRATIONS=false`. Read-only catalogues need a separate privileged/manual-film workflow if you tighten movie INSERT grants further.
4. Configure verified email sending (SPF/DKIM/DMARC and provider-approved sender), staging recovery/verification tests, mandatory breach-screen availability, private DB TLS and backups.
5. Put the app behind an HTTPS reverse proxy with header limits, DDoS/IP/ASN limits and **validated trusted-client IP handling**. The code ignores untrusted forwarded IP headers, so a proxy otherwise makes every client share the proxy socket IP; solve this deliberately, not with `trust proxy = true` for all clients.
6. Review redaction settings in HTTP/proxy/APM logs. Never log cookies, Authorization, passwords, CSRF values, full verification/reset links or POST bodies. Endpoint/status/event IDs are enough.
7. Monitor rate-limit anomalies, login failures, mail retries/dead letters, DB health, hash concurrency saturation and recovery abuse. The baseline logs event types rather than secret payloads. Add alerting and a provider failure runbook before launch.
8. Re-run the release checklist and arrange a security review. Add MFA/device-session-management/abuse defenses as the public product grows.

**Failure behavior:** missing production mail/secret/HTTPS configuration aborts startup; missing schema/catalogue with migrations disabled aborts startup; unavailable session check keeps the main UI locked; external breach-check failure blocks new passwords, not existing sign-ins. There is no production dev-mail/localStorage/login bypass.

## Rollback and rotation

A code rollback alone does not re-enable anonymous access safely. Keep authenticated routing and authorization controls in place. Preserve the additive account tables during rollback; do not drop them or silently attach them to old profile UUIDs.

A migration backup is essential. Root auth-key rotation affects CSRF signatures and encrypted queued messages. Drain or explicitly migrate/requeue pending mail, rotate through a controlled secret deployment, revoke sessions according to incident policy, and require clients to refresh their CSRF token. This baseline does not implement multi-key queue decryption; do not rotate the key blindly with pending jobs. A managed KMS/envelope approach is recommended as operational complexity grows.

## Container development
The compose patch adds `HOST=0.0.0.0` only for the container interface. The Dockerfile creates a restricted, writable `.dev-mail/` directory for the non-root runtime user; `.dockerignore` excludes private host mail/DB/env files from the build context. Local container verification messages stay inside the container—retrieve them privately with your local container tooling. This is not a production email setup or a claim that Docker was deployed/tested here.
