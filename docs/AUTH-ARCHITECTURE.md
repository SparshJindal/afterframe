# Afterframe accounts: systems and security design

**Status:** implemented development baseline; not independently audited and not a public-production security certification. This patch adds account authentication to Afterframe v1.1 while retaining the existing journal UI and movie data. Production requires HTTPS, a verified mail-sending domain/provider, secrets, controlled migrations, operational monitoring and a release review.

## 1. Routes and trust boundaries

| Surface | Anonymous | Verified, authenticated account |
|---|---|---|
| `/`, `/landing`, `/landing.html` | Public landing page | Public; CTA returns to journal |
| `/app`, `/app/`, `/index.html` | Redirect to landing/sign-in | Existing main journal, unchanged visual layout |
| Static CSS/JS/featured artwork | Public, non-secret | Public |
| `/api/health` | Minimal health status | Same |
| `/api/auth/session` | Pre-auth CSRF challenge; no account | Own account summary and session-bound CSRF token |
| Signup/verification/login/recovery | Public but Origin + CSRF + rate limits | Same appropriate flow |
| `/api/state`, `/api/movies`, `/api/taste`, `/api/export` | **401** | Own data / permitted catalogue access |
| Logging/deleting reviews, custom films, watchlist, recommendation opt-in | **Denied** | Server-owned profile ID, session + CSRF required |
| Profile edit, password change, account deletion | **Denied** | Own account only; destructive security actions need current password |

The backend is the authority. A browser redirect, hidden button, JWT-shaped string or localStorage `loggedIn=true` is not authorization. The old anonymous `af_session` cookie is explicitly **not** an account. No request-supplied `userId` or `profileId` selects the owner of a review.

```text
Browser ─ HTTPS ─ reverse proxy / edge limits ─ Node app ─ private PostgreSQL
                                     │             │
                             strict Origin    opaque sessions + CSRF
                                                   │
                                        encrypted mail outbox
                                                   │
                                       verified mail provider
```

A managed OIDC/auth provider is a reasonable alternative before launch: it reduces the amount of credential/recovery code you operate. Do not combine provider identities with this password database ad hoc. If switching, use the provider's immutable issuer+subject as the identity key and retain the same ownership middleware and private-profile model. This package deliberately implements one password-account path, not partially connected social-login buttons.

## 2. Password contract

- Minimum **15 Unicode code points** without MFA. Maximum **128 code points / 512 UTF-8 bytes**; reject explicitly, never truncate.
- Allow spaces, digits, `#`, `*`, punctuation and printable non-English letters. A long passphrase is encouraged. All-whitespace values are rejected.
- **No emojis:** reject Extended_Pictographic characters, regional-indicator flags, skin-tone modifiers, zero-width joiners, emoji presentation selectors and keycap combining marks. Also reject invisible/control characters and lone surrogates.
- Do **not** use `\p{Emoji}` alone: it includes the ordinary digits and `#`/`*` used in emoji sequences, and would reject legitimate passwords.
- The same policy module is used in the browser and Node. Server checks apply to signup, reset and password changes. Client checks improve UX but are not trusted.
- No password whitespace trimming, Unicode normalization, case conversion, arbitrary class requirements or scheduled password expiry. The exact submitted UTF-8 sequence is verified.
- Paste, password managers, `autocomplete="new-password"` / `current-password`, and show/hide controls are supported. Password input is never saved in localStorage/sessionStorage.
- User-requested emoji blocking is a **product-specific restriction**, not a claim of fully unrestricted Unicode password support. Some symbols such as copyright/pictographic symbols are also excluded by this conservative rule. Display names/bios do not inherit the emoji ban.
- Check a small local common-password blocklist and **Pwned Passwords** by SHA-1 prefix range with padding. Only the first five hash characters are sent; the raw password and full hash are not sent to that service. Production screening is compulsory and fails closed for *new/changed* passwords if unavailable. Existing logins do not depend on the breach service.
- Development skips the external check unless `HIBP_CHECK=true`. That is a weaker development mode, not a production shortcut.

References: [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [NIST SP 800-63B-4](https://pages.nist.gov/800-63-4/sp800-63b.html), [Pwned Passwords API](https://haveibeenpwned.com/API/v3#PwnedPasswords).

## 3. Credential storage and resource abuse

Argon2id through `@node-rs/argon2`, **64 MiB memory, t=3, p=1, 32-byte output**, with a library-generated per-password salt. Store the PHC encoded hash only. These parameters exceed OWASP's minimum, but they must be benchmarked on the actual host. Do not replace Argon2id with SHA-256 or a home-made encryption scheme. A dummy Argon2 hash is verified for an unknown email to reduce the obvious nonexistent-account timing discrepancy.

At most four hashing jobs run concurrently per process; overload fails with 503 rather than growing an unbounded queue. JSON auth bodies are limited to 16 KiB. HTTP header/request/keep-alive timeouts are configured. Auth throttles use PostgreSQL atomic counters for both socket IP and normalized identity; IP values are HMAC-keyed rather than stored raw. This is application throttling, not DDoS protection: enforce volumetric and IP/ASN limits at the edge too.

Default limits: login 30/IP and 8/identity per 15-minute window; registration/recovery/resend 20/IP and 3/identity per hour; sensitive reauthentication 20/IP and 6/account per 15 minutes. Verification/reset have their own IP budgets. Fixed windows allow boundary bursts; production should add distributed sliding-window/abuse detection. No permanent account lockout is implemented.

**Proxy warning:** this module uses `req.socket.remoteAddress` and ignores arbitrary `X-Forwarded-For`. Behind a proxy that can collapse clients to one socket address. Before deployment, configure validated trusted-proxy address handling at your edge/framework; never trust every forwarded header or let clients pick their own rate-limit identity.

## 4. Sessions and CSRF

- 32 random bytes as an opaque bearer cookie; database stores SHA-256 of the token, not the bearer value. A profile UUID is not a credential.
- Production cookie: `__Host-af_auth`, `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, no Domain. Development binds to loopback and uses `af_auth` without Secure over loopback HTTP. Container/LAN exposure must be an explicit choice.
- Cookie and server absolute expiry: 7 days, or 30 days with Remember me. **12-hour server idle expiry** still applies. Activity extends idle time only, not absolute lifetime.
- Rotate on login; do not preserve a caller's pre-login session. Old current-session token is revoked on successful replacement login.
- Each session records an account credential version. Password change/reset increments it and deletes all sessions. Session lookup requires a matching version, blocking stale authentication during races.
- Logout revokes the actual database session. Logout-all requires current password. Browser logout is broadcast to other tabs; drafts are tab-session storage, not persistent account notes in localStorage. Password change/deletion clears that session storage too.
- Mutations require exact configured Origin, a session/challenge-bound HMAC CSRF header and expected JSON. SameSite is defense in depth, not the only CSRF check. Pre-auth challenges expire after 20 minutes and are signed server-side.
- CSRF token is returned by a same-origin session endpoint and kept in JS memory; cookies are HttpOnly. No CORS origin reflection. No access/refresh JWTs in browser storage.
- Session cookies must be HTTPS-only in production. HSTS, CSP, no-sniff, no-referrer, frame denial and camera/microphone/geolocation restrictions are set. Inline *style attributes* are permitted for the existing numeric UI bars; scripts remain same-origin only.

Reference: [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

## 5. Verification, recovery and delivery

Signup creates a fresh private profile and an unverified account. It does not start a journal session. A verified email plus the password is required to log in. Signup, resend and forgot-password replies are generic; login errors use one response for bad credentials, nonexistent email or unfinished verification. This reduces enumeration; it is not a promise of perfect constant-time network behavior. Username uniqueness is surfaced only while editing an already authenticated account.

Email-link tokens: 32 random bytes, SHA-256 hashes in PostgreSQL, account+purpose binding, 24-hour verification expiry or 30-minute reset expiry. Consume under a transaction/row lock; reissues invalidate the older token for that purpose. Password reset revokes every session and outstanding recovery/verification token and does not automatically log the browser in.

Links use URL **fragments**, not query parameters. The landing page removes the fragment from history immediately, then submits it in an HTTPS POST body. No third-party analytics or pixels are added. Avoid request-body capture at every proxy/APM layer.

Mail delivery uses a transactional outbox with AES-256-GCM encrypted payloads, a key derived separately from the root auth secret, claimed jobs and retry bounds. Resend delivery uses an idempotency key. Failed jobs retry up to five times; monitor errors/dead letters and provide an operator resend/requeue workflow before launch. Queue ciphertext is pruned after one day when sent, or seven days regardless. Provider deliverability, SPF/DKIM/DMARC and sender-domain verification are real setup work, not simulated.

Development writes message JSON to `.dev-mail/` with restricted permissions, **outside the web root**. These messages contain bearer verification/reset links. Never commit, upload, screenshot, publicly serve or bundle the directory. There is no public development-mail endpoint. Production requires a configured mail provider and never uses the local spool fallback.

## 6. Profile and privacy

Private by default: display name, unique lowercase username, private bio, verified email. The profile endpoint returns only the authenticated account; email is never a public identifier. Escaped text rendering prevents bio/name strings becoming HTML. A controlled initials avatar avoids unvalidated upload/URL attack surfaces.

Not implemented: photo uploads, public profile pages, follows, OAuth, MFA/passkeys, email changes, administrator accounts or admin moderation. Email is read-only in the UI; the profile API rejects extra fields. Do not add a freeform `email` update. A future email-change flow must require current password, notify the old email, verify the new address before switching and revoke sessions according to risk policy.

Recommendations retain their original separation: numeric aspect contributions are opt-in, private notes remain private, imported MovieLens overall ratings are not aspect scores. Authorized exports include the basic profile and journal; password/session/recovery secrets are excluded.

Account deletion requires the current password and version check, then deletes the owned profile inside a transaction. Foreign-key cascades remove reviews/answers/watchlist/account/sessions/token/outbox rows. Shared catalogue records remain. Security audit events can retain event type/time for 90 days with account reference nulled; backups and the external mail provider have separately configured retention. Never promise that encrypted backups/provider mail copies disappear instantly.

## 7. Existing anonymous data

Old browser profiles and cookies must not automatically attach to an email address. This patch preserves old data in PostgreSQL but does not grant access to it through the new auth API. New signup gets a fresh profile. Never migrate by matching display name, guessed email, supplied UUID, or an unverified client `profileId`.

A future claim/import flow needs: explicit consent, proof of current ownership of the legacy token plus a verified signed-in account, transaction locks, immutable account audit, duplicate handling and rejection after expiry. The old offline HTML preview still holds data in its own browser storage and is not an identity source. Offer user-directed JSON import only after validating record structure and making ownership belong exclusively to the authenticated account. **Do not ship the old localStorage-only bundle as the authenticated product.** The updated bundler outputs a landing/UI preview only.

## 8. Production system posture

- Use a migration/seed database role in a controlled release job (`RUN_MIGRATIONS=true`). Run the server afterward with `RUN_MIGRATIONS=false` and a separate runtime role with no schema DDL privileges. Explicitly grant only required table DML; protect the catalogue/administrative operations separately as the product grows.
- Production secrets are secret-manager values, not source/.env commits. `AUTH_SECRET` is base64 encoding at least 32 random bytes. Keep separate development/staging/production secrets and DBs. Root-key rotation needs a plan for pending encrypted mail, CSRF renewal and deliberate session invalidation; this baseline does not implement multi-key envelope rotation.
- Enforce database network isolation, trusted TLS/certificates, encrypted backups, restore drills, mail queue/audit monitoring, session cleanup and credential redaction in logs.
- Keep lockfile/native libraries updated; audit dependencies and run SAST/DAST/ownership tests. Review CSP and proxy/header rules after hosting changes.
- Add managed MFA/recovery protections, breached-password screening availability metrics, distributed edge throttles, abuse monitoring and device/session-management UI before positioning this as a mature public security product.
- The MovieLens catalogue is a historical research dataset; commercial/revenue-bearing use requires GroupLens permission or replacement with appropriately licensed data. The landing is not a legal privacy policy. Obtain the necessary policy/terms and artwork/data rights for public use.

## 9. Required security acceptance tests

Run `npm test` against a disposable development DB. Never run the mutation tests on a real-user production database.

- Anonymous and forged legacy cookies cannot access any journal API; `/app` and `/index.html` redirect.
- UI hiding is bypassed in a raw HTTP request: server still denies writes.
- Register → dev verification delivery → one-use link → password login works; unverified login fails.
- Emoji, flag, keycap, modifier and invisible-character passwords fail server validation. Ordinary digits/#/* and non-English letters pass the policy.
- CSRF-forged and wrong-Origin requests fail; host/user-ID manipulation does not change the owner.
- Wrong current password prevents deletion; another account cannot read/delete notes.
- Stored values are Argon2 PHC hashes and hashed email/session tokens, never raw credentials.
- Reset is one-use and old sessions/old password stop working. Password changes/logout-all revoke every device.
- Profile XSS strings render as text; direct email/account/profile-ID edits are rejected.
- Movie logging, watchlist, recommendations, export and opt-in still work after valid login.
- Landing motion pauses; reduced-motion disables animation; forms/menus work with keyboard and at 390px.

Test coverage is an implementation check, not proof of immunity to all attacks. An independent pre-production review is still required.
