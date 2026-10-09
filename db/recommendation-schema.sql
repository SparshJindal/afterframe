BEGIN;
-- No journal entry or shared review is modified by this additive migration.
CREATE TABLE IF NOT EXISTS recommendation_feedback (
 profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 movie_id text NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(profile_id,movie_id)
);
CREATE TABLE IF NOT EXISTS recommendation_shelves (
 profile_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
 journal_key text NOT NULL DEFAULT '',
 input_revision integer NOT NULL DEFAULT 0 CHECK(input_revision>=0),
 refresh_revision integer NOT NULL DEFAULT 0 CHECK(refresh_revision>=0),
 served_revision integer NOT NULL DEFAULT -1,
 movie_ids text[] NOT NULL DEFAULT '{}',
 recent_slates jsonb NOT NULL DEFAULT '[]' CHECK(jsonb_typeof(recent_slates)='array'),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS recommendation_feedback_recent ON recommendation_feedback(profile_id,created_at DESC,movie_id);
COMMIT;
