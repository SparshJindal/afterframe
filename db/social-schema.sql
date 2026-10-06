BEGIN;
-- Existing users are not silently published into a searchable directory.
ALTER TABLE auth_accounts ADD COLUMN IF NOT EXISTS discoverable boolean NOT NULL DEFAULT true;
ALTER TABLE auth_accounts ALTER COLUMN discoverable SET DEFAULT true;
CREATE INDEX IF NOT EXISTS social_directory_name ON auth_accounts(lower(display_name)) WHERE discoverable=true;
CREATE TABLE IF NOT EXISTS friend_connections (
 id uuid PRIMARY KEY,
 requester_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 recipient_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 status text NOT NULL CHECK(status IN ('pending','accepted','declined')),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(requester_id<>recipient_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS friends_unique_pair ON friend_connections(LEAST(requester_id,recipient_id),GREATEST(requester_id,recipient_id));
CREATE INDEX IF NOT EXISTS friends_recipient_status ON friend_connections(recipient_id,status,updated_at DESC);
CREATE INDEX IF NOT EXISTS friends_requester_status ON friend_connections(requester_id,status,updated_at DESC);
CREATE TABLE IF NOT EXISTS social_blocks (
 owner_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 blocked_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(owner_id,blocked_id), CHECK(owner_id<>blocked_id)
);
CREATE TABLE IF NOT EXISTS social_review_shares (
 id uuid PRIMARY KEY,
 rating_id uuid NOT NULL UNIQUE REFERENCES ratings(id) ON DELETE CASCADE,
 owner_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 review_text text NOT NULL DEFAULT '' CHECK(length(review_text)<=2000),
 spoilers boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS social_shares_owner_feed ON social_review_shares(owner_id,created_at DESC,id DESC);
CREATE TABLE IF NOT EXISTS friend_recommendations (
 id uuid PRIMARY KEY, client_id uuid NOT NULL,
 sender_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 recipient_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 movie_id text NOT NULL REFERENCES movies(id),
 message text NOT NULL DEFAULT '' CHECK(length(message)<=500), spoilers boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(), seen_at timestamptz, dismissed_at timestamptz,
 CHECK(sender_id<>recipient_id), UNIQUE(sender_id,client_id)
);
CREATE INDEX IF NOT EXISTS social_recommendations_inbox ON friend_recommendations(recipient_id,created_at DESC,id DESC);
CREATE INDEX IF NOT EXISTS social_recommendations_sender ON friend_recommendations(sender_id,created_at DESC,id DESC);
CREATE TABLE IF NOT EXISTS social_review_likes (
 share_id uuid NOT NULL REFERENCES social_review_shares(id) ON DELETE CASCADE,
 account_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(share_id,account_id)
);
CREATE TABLE IF NOT EXISTS social_review_comments (
 id uuid PRIMARY KEY, share_id uuid NOT NULL REFERENCES social_review_shares(id) ON DELETE CASCADE,
 author_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 body text NOT NULL CHECK(length(body) BETWEEN 1 AND 500), spoilers boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS social_comments_thread ON social_review_comments(share_id,created_at,id);
COMMIT;
