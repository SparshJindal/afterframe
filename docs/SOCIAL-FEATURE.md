# Friends, shared takes and film recommendations

## What ships

- A fourth main navigation tab, **Friends**, with Updates, Your friends, Find friends, Requests, Film recommendations and Blocked sections.
- Username/display-name search. Unique handles and display names use the existing account profile editor. Email addresses, account IDs and private profile IDs are not exposed by the directory.
- Opt-in directory visibility, incoming/outgoing requests, accept/decline/cancel, remove friend, block/unblock, friend profiles and paginated shared reviews.
- An Updates feed containing explicitly shared film reviews, your accepted friendships, and recommendations sent or received by you. Friendship, directory visibility and blocking rules are checked server-side on every read.
- Journal entry → Read your take → **Share with friends**. Users write a separate review of up to 2,000 characters; the journal's eight aspect notes are never copied into social content. A shared rating can have no written review. Existing entries are not automatically shared.
- Shared takes support likes and flat comments (500 characters), with spoiler flags and deletion by comment authors or the shared-review owner.
- Every film card used by the journal, Discover and personalized recommendation shelves includes **Recommend to a friend**. Search accepted friends by username/name, select one, add a note (500 characters), and send. Received/sent sections support read status, dismissal and retraction.
- Film cards show the top three accepted friends' latest **explicitly shared** ratings for that movie. A compact hover, click or keyboard-expand panel shows safe review excerpts and links to full takes. Highest ratings appear first. These are social context, not ranking/training inputs.

## Privacy contract

Directory listing defaults to **off**, including for existing accounts. People must enable **Let people find me** before search can discover them or a new request can be sent to them. Turning it off does not remove existing friendships.

Shared reviews are visible only to their author and currently accepted, unblocked friends. Taste profiles, aspect notes and watchlists stay private. Reviews and comments marked as spoilers are omitted from API previews, not merely hidden with CSS; revealing requires an explicit detail request. Recommendation spoiler notes follow the same rule.

Blocking in either direction removes the friendship and hides search, profiles, review access, comments/likes from the blocked person, and recommendations. Unblocking does not restore friendship. Removing a friend revokes access immediately on subsequent requests. Previously authorized content already displayed or copied cannot be remotely erased.

Making a take private again deletes its social share, likes and comments, while preserving the private journal entry. Deleting an entry or account cascades through dependent social rows. Recommendations require an accepted friendship at send time and read time. Received dismissal hides the recommendation from the shared exchange; sender retraction deletes it.

Mutation routes retain the existing authentication, exact-origin and CSRF requirements. Social reads/writes and request/recommendation sends have database-backed rate limits. Declined requests have a seven-day retry cooldown. A normalized unique pair index and advisory transaction locks prevent duplicate cross-requests. Recommendations use a client-generated UUID for safe retries of the same recipient/movie/note.

## Database and deployment

New additive, idempotent migration: **`db/social-schema.sql`**. No seeded users, social content, email changes, or retroactive publication of journal entries.

Schema additions:

| Object | Purpose |
|---|---|
| `auth_accounts.discoverable` | Opt-in username/name directory |
| `friend_connections` | One directional pending request or accepted friendship per unordered account pair |
| `social_blocks` | Account-level block edges |
| `social_review_shares` | Explicit shared version of an owned rating |
| `social_review_likes` | Idempotent account/share likes |
| `social_review_comments` | Authored, spoiler-aware comments |
| `friend_recommendations` | Recipient/sender-scoped movie notes, retry key and read/dismiss state |

For production, run with the controlled migration role **before deploying the new application code**:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/social-schema.sql
```

Do not paste the connection string into chat or commit it. Keep normal runtime `RUN_MIGRATIONS=false`; grant the runtime role the needed SELECT/INSERT/UPDATE/DELETE privileges on the new tables. Existing base, auth and discovery migrations must already be present. Local `npm run dev` applies the additive social migration automatically at initialization. Startup fails closed if the social schema is missing.

No new environment values, external social provider, paid service or frontend dependency is required. `npm run assets` materializes the existing committed artwork where needed; `npm run dev` and `npm test` remain the normal local commands.

To roll back application code, retain the new tables and column. Older application versions ignore them. Do not drop social tables as part of a routine rollback.

## API surface

All routes live under `/api/social/` and require a verified signed-in account:

- `GET overview`; `PATCH settings` with `{discoverable:boolean}`.
- `GET people?q=`; `GET friends?q=`; `GET profile/:username`.
- `GET requests?direction=incoming|outgoing`; `POST requests` with `{username}`; `PATCH requests/:id` with `{action:"accept"|"decline"}`; `DELETE connections/:id` with `{}`.
- `GET blocks`; `POST|DELETE blocks` with `{username}`.
- `GET|POST|DELETE shares/:ratingId`; POST `{reviewText,spoilers}`, DELETE `{}`.
- `GET reviews/:shareId[?reveal=1]`; `POST reviews/:shareId/like` with `{liked:boolean}`.
- `GET|POST reviews/:shareId/comments`; POST `{text,spoilers}`; `DELETE reviews/:shareId/comments/:id` with `{}`.
- `GET movie-ratings?ids=comma-separated-movie-ids` (maximum 60).
- `GET recommendations?direction=received|sent`; `POST recommendations` with `{username,movieId,message,spoilers,requestId}`.
- `GET recommendations/:id[?reveal=1]`; `PATCH recommendations/:id` with `{action:"read"|"dismiss"}`; `DELETE recommendations/:id` with `{}` (sender only).
- `GET feed[?cursor=opaque-keyset-cursor]`.

Lists use 20 rows and `nextOffset` except the feed, which uses a microsecond-precise timestamp/UUID keyset cursor and `nextCursor`. Raw cursor values are opaque; use the returned value. Search requires at least two characters and escapes SQL wildcard characters.

## Verification and current limits

`test/social.test.mjs` exercises real PostgreSQL-backed endpoints: authentication, CSRF/origin, opt-in discovery, cross-request races, direction/ownership checks, declined-request cooldown, blocking, sharing and spoiler redaction, comments/likes, recommendation retries, read/dismiss/retract, revoked access, pagination, additive migration reruns and cascading deletion. Run only against a disposable local database, never production. Synthetic accounts are removed after tests.

UI checks exercise populated and empty sections, search, request acceptance, reviews/comments, sharing, friend-rated movie panels and sending/reading recommendations at desktop and 390px mobile widths.

Updates refresh when opening the tab, switching sections or pressing **Refresh updates**. This release does not add WebSockets, push/email social notifications, group recommendations, image uploads, public profiles, comment replies or abuse-report administration. Directory substring search uses PostgreSQL ILIKE; very large directories may need a later pg_trgm migration and relevance tuning. The existing journal export remains journal-focused; it is not yet a social archive export.
